import { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Jar } from '@/components/Jar';
import { TaskCard } from '@/components/TaskCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { IconButton } from '@/components/IconButton';
import { AdBanner } from '@/components/AdBanner';
import { useDrawTask } from '@/hooks/useDrawTask';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';

const POT_IMAGE = require('../assets/logo-transparent.png');

function CelebrationToast({ message }: { message: string }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    const ease = Easing.out(Easing.back(1.5));
    opacity.value = withSequence(
      withTiming(1, { duration: 300, easing: ease }),
      withDelay(1500, withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) })),
    );
    translateY.value = withTiming(0, { duration: 300, easing: ease });
    scale.value = withSequence(
      withTiming(1.05, { duration: 300, easing: ease }),
      withTiming(1, { duration: 200 }),
    );
  }, [opacity, translateY, scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityLabel={message}
      style={[
        animStyle,
        {
          position: 'absolute',
          top: '40%',
          left: 24,
          right: 24,
          alignItems: 'center',
          zIndex: 20,
        },
      ]}
    >
      <View style={{ position: 'relative', paddingRight: 5, paddingBottom: 5 }}>
        <View
          className="bg-ink"
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            right: 0,
            bottom: 0,
            borderRadius: 24,
          }}
        />
        <View
          className="bg-sage border-ink"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 24,
            borderWidth: 3,
            gap: 10,
          }}
        >
          <Image source={POT_IMAGE} style={{ width: 28, height: 28 }} resizeMode="contain" />
          <Text
            className="font-bodyBlack text-surface-hi"
            style={{ fontSize: 18 }}
          >
            {message}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const jars = useJarStore((s) => s.jars);
  const jar = jars[0];
  const activeCount = useTaskStore((s) => (jar ? s.activeIn(jar.id).length : 0));

  const { draw, accept, done, skip, drawnTask, isAccepted, isDrawing, jarRef, celebration } = useDrawTask(jar?.id ?? '');

  if (!onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  if (!jar) return null;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Celebration toast */}
      {celebration && <CelebrationToast message={celebration} key={celebration} />}

      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            className="font-bodyBold text-brand-dark"
            style={{
              fontSize: 10,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
            }}
          >
            {t('home.jarName', { name: jar.name })}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <IconButton icon="list" onPress={() => router.push('/tasks')} label="Lista de tarefas" />
            <IconButton icon="settings" onPress={() => router.push('/settings')} label="Configurações" />
          </View>
        </View>

        <Text
          className="font-display text-ink"
          style={{
            fontSize: 44,
            lineHeight: 48,
            letterSpacing: -1,
            marginTop: 2,
          }}
        >
          {t('home.title')}
        </Text>
      </View>

      {/* Main area */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <View>
          <Jar ref={jarRef} taskCount={activeCount} />
        </View>

        {!drawnTask && (
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <Text
              className="font-bodyBold text-ink-soft"
              style={{
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              {activeCount === 0
                ? t('home.empty')
                : t('home.taskCount', { count: activeCount })}
            </Text>
          </View>
        )}

        {drawnTask && (
          <View style={{ marginTop: 24, width: '100%' }}>
            <TaskCard
              text={drawnTask.text}
              accepted={isAccepted}
              onAccept={accept}
              onDone={done}
              onSkip={skip}
            />
          </View>
        )}
      </View>

      {/* Bottom actions */}
      {!drawnTask && (
        <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 12 }}>
          <PrimaryButton onPress={() => router.push('/add-task')} variant="secondary">
            {t('home.addTask')}
          </PrimaryButton>
          <PrimaryButton
            onPress={draw}
            disabled={activeCount === 0 || isDrawing}
            testID="draw-button"
          >
            {isDrawing ? t('home.drawing') : t('home.draw')}
          </PrimaryButton>
        </View>
      )}

      <AdBanner />
    </SafeAreaView>
  );
}
