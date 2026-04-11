import { updateStreak, toDateKey } from '@/lib/streak';

describe('streak', () => {
  const base = { count: 0, lastDrawDate: '' };

  test('toDateKey formats YYYY-MM-DD', () => {
    expect(toDateKey(new Date('2026-04-11T15:30:00'))).toBe('2026-04-11');
  });

  test('first draw ever: count becomes 1', () => {
    const result = updateStreak(base, new Date('2026-04-11T10:00:00'));
    expect(result.count).toBe(1);
    expect(result.lastDrawDate).toBe('2026-04-11');
  });

  test('second draw same day: count unchanged', () => {
    const prev = { count: 3, lastDrawDate: '2026-04-11' };
    const result = updateStreak(prev, new Date('2026-04-11T18:00:00'));
    expect(result.count).toBe(3);
  });

  test('draw next day: count increments', () => {
    const prev = { count: 3, lastDrawDate: '2026-04-11' };
    const result = updateStreak(prev, new Date('2026-04-12T09:00:00'));
    expect(result.count).toBe(4);
    expect(result.lastDrawDate).toBe('2026-04-12');
  });

  test('draw after gap: count resets to 1', () => {
    const prev = { count: 10, lastDrawDate: '2026-04-08' };
    const result = updateStreak(prev, new Date('2026-04-11T09:00:00'));
    expect(result.count).toBe(1);
    expect(result.lastDrawDate).toBe('2026-04-11');
  });
});
