import mobileAds, {
  InterstitialAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useAppStore } from '@/stores/appStore';

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

const INTERSTITIAL_ID = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-YOUR-REAL-ID/XXXX';
export const BANNER_ID = __DEV__ ? TestIds.BANNER : 'ca-app-pub-YOUR-REAL-ID/YYYY';

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
    loadInterstitial();
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
      interstitial.show();
      useAppStore.getState().resetInterstitialCounter();
    }
  },
};
