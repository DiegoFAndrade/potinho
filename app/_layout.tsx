import '../global.css';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import { useFonts, Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_900Black,
} from '@expo-google-fonts/fraunces';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { adsService } from '@/services/adsService';
import { purchaseService } from '@/services/purchaseService';
import { analyticsService, Events } from '@/services/analyticsService';
import { useJarStore } from '@/stores/jarStore';
import { useAppStore } from '@/stores/appStore';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  enableAutoSessionTracking: true,
});

function RootLayout() {
  const [fontsLoaded] = useFonts({
    Caprasimo_400Regular,
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_900Black,
  });

  useEffect(() => {
    if (!useAppStore.getState().onboardingDone) {
      analyticsService.track(Events.FIRST_SESSION);
    }
    useJarStore.getState().ensureDefault();
    adsService.init().catch(() => {});
    purchaseService.init().catch(() => {});
    return () => {
      purchaseService.cleanup().catch(() => {});
    };
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#F8EFD9' }} />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F8EFD9' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="add-task" options={{ presentation: 'modal' }} />
          <Stack.Screen name="tasks" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
          <Stack.Screen name="stats" />
          <Stack.Screen name="privacy" />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
