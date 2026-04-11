import { useAppStore } from '@/stores/appStore';

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.getState().reset();
  });

  test('initial state', () => {
    const s = useAppStore.getState();
    expect(s.isPremium).toBe(false);
    expect(s.streak.count).toBe(0);
    expect(s.soundEnabled).toBe(true);
    expect(s.hapticsEnabled).toBe(true);
    expect(s.onboardingDone).toBe(false);
    expect(s.drawsSinceLastInterstitial).toBe(0);
  });

  test('setPremium toggles flag', () => {
    useAppStore.getState().setPremium(true);
    expect(useAppStore.getState().isPremium).toBe(true);
  });

  test('finishOnboarding marks done', () => {
    useAppStore.getState().finishOnboarding();
    expect(useAppStore.getState().onboardingDone).toBe(true);
  });

  test('registerDraw increments counter and updates streak', () => {
    const now = new Date('2026-04-11T10:00:00');
    useAppStore.getState().registerDraw('t1', now);
    const s = useAppStore.getState();
    expect(s.lastDrawId).toBe('t1');
    expect(s.streak.count).toBe(1);
    expect(s.drawsSinceLastInterstitial).toBe(1);
  });

  test('resetInterstitialCounter zeroes it', () => {
    useAppStore.getState().registerDraw('t1', new Date());
    useAppStore.getState().resetInterstitialCounter();
    expect(useAppStore.getState().drawsSinceLastInterstitial).toBe(0);
  });

  test('toggleSound flips', () => {
    useAppStore.getState().toggleSound();
    expect(useAppStore.getState().soundEnabled).toBe(false);
  });
});
