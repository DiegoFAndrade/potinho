// Mock for react-native-google-mobile-ads in Jest (native module unavailable in node)

export const TestIds = {
  INTERSTITIAL: 'test-interstitial',
  BANNER: 'test-banner',
};

export const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLICKED: 'clicked',
  CLOSED: 'closed',
};

export const BannerAdSize = {
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  BANNER: 'BANNER',
};

export class InterstitialAd {
  loaded = false;
  static createForAdRequest(_id: string) { return new InterstitialAd(); }
  addAdEventListener(_type: string, _cb: () => void) { return () => {}; }
  load() {}
  show() {}
}

export const BannerAd = () => null;

const mobileAds = () => ({
  initialize: async () => ({}),
});

export default mobileAds;
