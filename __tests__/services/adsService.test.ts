import { shouldShowInterstitial } from '@/services/adsService';

describe('adsService.shouldShowInterstitial', () => {
  test('never shows when user is premium', () => {
    expect(
      shouldShowInterstitial({
        isPremium: true,
        drawsSinceLastInterstitial: 10,
        isFirstDrawToday: false,
      }),
    ).toBe(false);
  });

  test('never shows on first draw of the day', () => {
    expect(
      shouldShowInterstitial({
        isPremium: false,
        drawsSinceLastInterstitial: 10,
        isFirstDrawToday: true,
      }),
    ).toBe(false);
  });

  test('shows when at least 5 draws since last interstitial', () => {
    expect(
      shouldShowInterstitial({
        isPremium: false,
        drawsSinceLastInterstitial: 5,
        isFirstDrawToday: false,
      }),
    ).toBe(true);
  });

  test('skips when fewer than 5 draws', () => {
    expect(
      shouldShowInterstitial({
        isPremium: false,
        drawsSinceLastInterstitial: 3,
        isFirstDrawToday: false,
      }),
    ).toBe(false);
  });
});
