import mobileAds, {
  InterstitialAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useAppStore } from '@/stores/appStore';
import { analyticsService, Events } from '@/services/analyticsService';

export interface InterstitialDecisionInput {
  isPremium: boolean;
  drawsSinceLastInterstitial: number;
  isFirstDrawToday: boolean;
}

const MIN_DRAWS_BETWEEN_INTERSTITIALS = 5;

export const shouldShowInterstitial = (i: InterstitialDecisionInput): boolean => {
  if (i.isPremium) return false;
  if (i.isFirstDrawToday) return false;
  return i.drawsSinceLastInterstitial >= MIN_DRAWS_BETWEEN_INTERSTITIALS;
};

const INTERSTITIAL_ID = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2826077560722110/5366553535';
export const BANNER_ID = __DEV__ ? TestIds.BANNER : 'ca-app-pub-2826077560722110/6679635201';

let interstitial: InterstitialAd | null = null;

const loadInterstitial = () => {
  interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID);
  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    // Reload next one immediately so it's ready
    loadInterstitial();
  });
  interstitial.load();
};

export const adsService = {
  init: async () => {
    await mobileAds().initialize();
    // Interstitials disabled in v1 — keep the function around for v2 reactivation.
  },
  maybeShowInterstitial: (isFirstDrawToday: boolean) => {
    const state = useAppStore.getState();
    if (
      !shouldShowInterstitial({
        isPremium: state.isPremium,
        drawsSinceLastInterstitial: state.drawsSinceLastInterstitial,
        isFirstDrawToday,
      })
    ) {
      return;
    }
    if (interstitial?.loaded) {
      analyticsService.track(Events.INTERSTITIAL_SHOWN);
      interstitial.show();
      useAppStore.getState().resetInterstitialCounter();
    }
  },
};
