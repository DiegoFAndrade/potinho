import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { updateStreak } from '@/lib/streak';
import type { AppState } from '@/types';

interface AppStoreActions {
  setPremium: (v: boolean) => void;
  finishOnboarding: () => void;
  registerDraw: (taskId: string, now?: Date) => void;
  acceptDraw: () => void;
  clearLastDraw: () => void;
  resetInterstitialCounter: () => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  setTheme: (theme: string) => void;
  reset: () => void;
}

const initialState: AppState = {
  isPremium: false,
  streak: { count: 0, lastDrawDate: '' },
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'default',
  lastDrawId: null,
  lastDrawAccepted: false,
  onboardingDone: false,
  drawsSinceLastInterstitial: 0,
};

export const useAppStore = create<AppState & AppStoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setPremium: (v) => set({ isPremium: v }),
      finishOnboarding: () => set({ onboardingDone: true }),
      registerDraw: (taskId, now = new Date()) => {
        const streak = updateStreak(get().streak, now);
        set({
          lastDrawId: taskId,
          streak,
          drawsSinceLastInterstitial: get().drawsSinceLastInterstitial + 1,
        });
      },
      acceptDraw: () => set({ lastDrawAccepted: true }),
      clearLastDraw: () => set({ lastDrawId: null, lastDrawAccepted: false }),
      resetInterstitialCounter: () => set({ drawsSinceLastInterstitial: 0 }),
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      toggleHaptics: () => set({ hapticsEnabled: !get().hapticsEnabled }),
      setTheme: (theme) => set({ theme }),
      reset: () => set(initialState),
    }),
    { name: 'app-store', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
