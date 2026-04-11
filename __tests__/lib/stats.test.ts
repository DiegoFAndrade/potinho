import { computeStats } from '@/lib/stats';
import type { Task } from '@/types';

const t = (over: Partial<Task>): Task => ({
  id: over.id ?? 'id',
  jarId: over.jarId ?? 'j1',
  text: over.text ?? 'x',
  status: over.status ?? 'active',
  createdAt: over.createdAt ?? 0,
  completedAt: over.completedAt ?? null,
});

describe('stats', () => {
  test('empty list produces zeros', () => {
    const s = computeStats([]);
    expect(s.totalDone).toBe(0);
    expect(s.totalActive).toBe(0);
    expect(s.completionRate).toBe(0);
  });

  test('counts done, active, and rate', () => {
    const s = computeStats([
      t({ status: 'done', completedAt: 1 }),
      t({ status: 'done', completedAt: 2 }),
      t({ status: 'active' }),
      t({ status: 'skipped' }),
    ]);
    expect(s.totalDone).toBe(2);
    expect(s.totalActive).toBe(1);
    expect(s.completionRate).toBeCloseTo(0.5);
  });

  test('groups by jar', () => {
    const s = computeStats([
      t({ jarId: 'A', status: 'done' }),
      t({ jarId: 'A', status: 'done' }),
      t({ jarId: 'B', status: 'done' }),
    ]);
    expect(s.doneByJar).toEqual({ A: 2, B: 1 });
  });
});
