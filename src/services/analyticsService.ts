export const Events = {
  FIRST_SESSION: 'first_session',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  TASK_ADDED: 'task_added',
  DRAW_STARTED: 'draw_started',
  DRAW_ACCEPTED: 'draw_accepted',
  TASK_COMPLETED: 'task_completed',
  TASK_SKIPPED: 'task_skipped',
  MILESTONE_REACHED: 'milestone_reached',
  PAYWALL_OPENED: 'paywall_opened',
  PURCHASE_ATTEMPTED: 'purchase_attempted',
  PURCHASE_COMPLETED: 'purchase_completed',
  PURCHASE_FAILED: 'purchase_failed',
  PURCHASE_RESTORED: 'purchase_restored',
  AD_BANNER_SHOWN: 'ad_banner_shown',
  INTERSTITIAL_SHOWN: 'interstitial_shown',
} as const;

type EventName = (typeof Events)[keyof typeof Events];

function track(event: EventName, params?: Record<string, unknown>) {
  if (__DEV__) {
    console.log(`[Analytics] ${event}`, params ?? '');
    return;
  }

  // Lazy-load so dev clients without the Firebase native module can still boot.
  // The require() here only runs in production builds.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const analytics = require('@react-native-firebase/analytics').default;
  analytics().logEvent(event, params).catch(() => {});
}

export const analyticsService = { track };
