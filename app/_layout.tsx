import '../global.css';
import '@/locales';
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
import { analyticsService, Events } from '@/services/analyticsService';
import { useJarStore } from '@/stores/jarStore';
import { useAppStore } from '@/stores/appStore';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  enableAutoSessionTracking: true,
});

function RootLayout() {
  const theme = useAppStore((s) => s.theme);
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
  }, []);

  if (!fontsLoaded) {
    return <View className="flex-1 bg-surface" />;
  }

  const themeClass = theme !== 'default' ? `theme-${theme}` : '';

  return (
    <ErrorBoundary>
      <GestureHandlerRootView className={`flex-1 ${themeClass}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="add-task" options={{ presentation: 'modal' }} />
          <Stack.Screen name="tasks" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="stats" />
          <Stack.Screen name="privacy" />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
