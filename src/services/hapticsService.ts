import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/stores/appStore';

export const hapticsService = {
  light: () => {
    if (!useAppStore.getState().hapticsEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  success: () => {
    if (!useAppStore.getState().hapticsEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
};
