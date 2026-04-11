import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { newId } from '@/lib/id';
import type { Jar } from '@/types';

interface JarStore {
  jars: Jar[];
  ensureDefault: () => void;
  addJar: (input: { name: string; color: string }) => Jar;
  renameJar: (id: string, name: string) => void;
  removeJar: (id: string) => void;
  reset: () => void;
}

export const useJarStore = create<JarStore>()(
  persist(
    (set, get) => ({
      jars: [],
      ensureDefault: () => {
        if (get().jars.length > 0) return;
        const jar: Jar = {
          id: newId(),
          name: 'Meu potinho',
          color: '#E8896B',
          createdAt: Date.now(),
        };
        set({ jars: [jar] });
      },
      addJar: ({ name, color }) => {
        const jar: Jar = { id: newId(), name, color, createdAt: Date.now() };
        set({ jars: [...get().jars, jar] });
        return jar;
      },
      renameJar: (id, name) => {
        set({ jars: get().jars.map((j) => (j.id === id ? { ...j, name } : j)) });
      },
      removeJar: (id) => {
        set({ jars: get().jars.filter((j) => j.id !== id) });
      },
      reset: () => set({ jars: [] }),
    }),
    { name: 'jar-store', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
