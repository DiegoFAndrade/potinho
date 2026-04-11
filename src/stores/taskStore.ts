import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { newId } from '@/lib/id';
import { defaultRandom, pickRandom, type RNG } from '@/lib/random';
import type { Task } from '@/types';

interface TaskStore {
  tasks: Task[];
  addTask: (jarId: string, text: string) => Task;
  editTask: (id: string, text: string) => void;
  removeTask: (id: string) => void;
  markDone: (id: string) => void;
  skip: (id: string) => void;
  activeIn: (jarId: string) => Task[];
  draw: (jarId: string, rng?: RNG) => Task | null;
  reset: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (jarId, text) => {
        const task: Task = {
          id: newId(),
          jarId,
          text,
          status: 'active',
          createdAt: Date.now(),
          completedAt: null,
        };
        set({ tasks: [...get().tasks, task] });
        return task;
      },
      editTask: (id, text) => {
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, text } : t)) });
      },
      removeTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },
      markDone: (id) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, status: 'done', completedAt: Date.now() } : t,
          ),
        });
      },
      skip: (id) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, status: 'active' } : t,
          ),
        });
      },
      activeIn: (jarId) =>
        get().tasks.filter((t) => t.jarId === jarId && t.status === 'active'),
      draw: (jarId, rng = defaultRandom) => {
        const active = get().activeIn(jarId);
        if (active.length === 0) return null;
        return pickRandom(active, rng);
      },
      reset: () => set({ tasks: [] }),
    }),
    { name: 'task-store', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
