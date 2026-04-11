import type { Task } from '@/types';

export interface Stats {
  totalDone: number;
  totalActive: number;
  totalSkipped: number;
  completionRate: number; // done / (done + active + skipped)
  doneByJar: Record<string, number>;
}

export const computeStats = (tasks: Task[]): Stats => {
  let totalDone = 0;
  let totalActive = 0;
  let totalSkipped = 0;
  const doneByJar: Record<string, number> = {};

  for (const task of tasks) {
    if (task.status === 'done') {
      totalDone++;
      doneByJar[task.jarId] = (doneByJar[task.jarId] ?? 0) + 1;
    } else if (task.status === 'active') {
      totalActive++;
    } else if (task.status === 'skipped') {
      totalSkipped++;
    }
  }

  const total = totalDone + totalActive + totalSkipped;
  const completionRate = total === 0 ? 0 : totalDone / total;

  return { totalDone, totalActive, totalSkipped, completionRate, doneByJar };
};
