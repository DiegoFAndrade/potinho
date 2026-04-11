export type JarId = string;
export type TaskId = string;

export interface Jar {
  id: JarId;
  name: string;
  color: string;
  createdAt: number;
}

export type TaskStatus = 'active' | 'done' | 'skipped';

export interface Task {
  id: TaskId;
  jarId: JarId;
  text: string;
  status: TaskStatus;
  createdAt: number;
  completedAt: number | null;
}

export interface Streak {
  count: number;
  lastDrawDate: string; // YYYY-MM-DD in local time
}

export interface AppState {
  isPremium: boolean;
  streak: Streak;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: string;
  lastDrawId: TaskId | null;
  onboardingDone: boolean;
  drawsSinceLastInterstitial: number;
}
