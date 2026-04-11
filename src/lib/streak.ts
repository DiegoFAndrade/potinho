import type { Streak } from '@/types';

export const toDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const dayDiff = (a: string, b: string): number => {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
};

export const updateStreak = (prev: Streak, now: Date): Streak => {
  const today = toDateKey(now);
  if (!prev.lastDrawDate) {
    return { count: 1, lastDrawDate: today };
  }
  const diff = dayDiff(prev.lastDrawDate, today);
  if (diff === 0) return prev;
  if (diff === 1) return { count: prev.count + 1, lastDrawDate: today };
  return { count: 1, lastDrawDate: today };
};
