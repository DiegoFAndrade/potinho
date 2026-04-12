import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { adsService } from '@/services/adsService';
import { purchaseService } from '@/services/purchaseService';
import { useJarStore } from '@/stores/jarStore';
import { useAppStore } from '@/stores/appStore';

export default function RootLayout() {
  const router = useRouter();
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  useEffect(() => {
    useJarStore.getState().ensureDefault();
    adsService.init().catch(() => {});
    purchaseService.init().catch(() => {});
    return () => {
      purchaseService.cleanup().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!onboardingDone) {
      router.replace('/onboarding');
    }
  }, [onboardingDone, router]);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFF8EF' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="add-task" options={{ presentation: 'modal' }} />
          <Stack.Screen name="tasks" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
          <Stack.Screen name="stats" />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
