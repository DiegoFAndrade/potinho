import { useTaskStore } from '@/stores/taskStore';
import { createRandom } from '@/lib/random';

describe('taskStore', () => {
  beforeEach(() => {
    useTaskStore.getState().reset();
  });

  test('addTask creates an active task', () => {
    useTaskStore.getState().addTask('j1', 'Estudar');
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ jarId: 'j1', text: 'Estudar', status: 'active' });
  });

  test('draw picks an active task from the jar', () => {
    useTaskStore.getState().addTask('j1', 'A');
    useTaskStore.getState().addTask('j1', 'B');
    useTaskStore.getState().addTask('j2', 'C');
    const picked = useTaskStore.getState().draw('j1', createRandom(1));
    expect(picked).not.toBeNull();
    expect(picked!.jarId).toBe('j1');
  });

  test('draw returns null when no active tasks in jar', () => {
    const picked = useTaskStore.getState().draw('j1', createRandom(1));
    expect(picked).toBeNull();
  });

  test('markDone sets status and completedAt', () => {
    useTaskStore.getState().addTask('j1', 'A');
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().markDone(id);
    const updated = useTaskStore.getState().tasks.find((t) => t.id === id)!;
    expect(updated.status).toBe('done');
    expect(updated.completedAt).not.toBeNull();
  });

  test('skip keeps task active but updates timestamp', () => {
    useTaskStore.getState().addTask('j1', 'A');
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().skip(id);
    const updated = useTaskStore.getState().tasks.find((t) => t.id === id)!;
    expect(updated.status).toBe('active');
  });

  test('removeTask deletes by id', () => {
    useTaskStore.getState().addTask('j1', 'A');
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().removeTask(id);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  test('activeIn returns only active tasks for a jar', () => {
    useTaskStore.getState().addTask('j1', 'A');
    useTaskStore.getState().addTask('j1', 'B');
    useTaskStore.getState().addTask('j2', 'C');
    const active = useTaskStore.getState().activeIn('j1');
    expect(active).toHaveLength(2);
  });
});
