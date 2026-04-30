import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppStore } from '@/stores/appStore';
import { useTaskStore } from '@/stores/taskStore';
import { useJarStore } from '@/stores/jarStore';
import { analyticsService, Events } from '@/services/analyticsService';

export default function Onboarding() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [firstTask, setFirstTask] = useState('');
  const router = useRouter();

  const slides = [
    { kicker: t('onboarding.stepOne'), title: t('onboarding.title1'), body: t('onboarding.body1'), accent: '#E8503D' },
    { kicker: t('onboarding.stepTwo'), title: t('onboarding.title2'), body: t('onboarding.body2'), accent: '#D9A520' },
    { kicker: t('onboarding.stepThree'), title: t('onboarding.title3'), body: t('onboarding.body3'), accent: '#89A47C' },
  ];

  const next = () => {
    if (step < slides.length) setStep(step + 1);
  };

  const finish = () => {
    if (firstTask.trim()) {
      useJarStore.getState().ensureDefault();
      const jarId = useJarStore.getState().jars[0].id;
      useTaskStore.getState().addTask(jarId, firstTask.trim());
    }
    analyticsService.track(Events.ONBOARDING_COMPLETED);
    useAppStore.getState().finishOnboarding();
    router.replace('/');
  };

  if (step < slides.length) {
    const slide = slides[step];
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 48, paddingBottom: 32 }}>
          {/* Kicker with dashed line */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <View style={{ height: 2, flex: 1, backgroundColor: slide.accent }} />
            <Text
              className="font-bodyBlack"
              style={{
                color: slide.accent,
                fontSize: 13,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              {t('onboarding.step', { name: slide.kicker })}
            </Text>
            <View style={{ height: 2, flex: 1, backgroundColor: slide.accent }} />
          </View>

          <View accessibilityLabel={`${slide.title.replace(/\n/g, ' ')}. ${slide.body}`}>
            {/* Giant number */}
            <Text
              className="font-display"
              style={{
                color: slide.accent,
                fontSize: 180,
                lineHeight: 160,
                marginLeft: -8,
                marginBottom: 0,
              }}
            >
              {step + 1}
            </Text>

            {/* Title */}
            <Text
              className="font-display text-ink"
              style={{
                fontSize: 32,
                lineHeight: 42,
                letterSpacing: -0.8,
                marginTop: 8,
              }}
            >
              {slide.title}
            </Text>

            {/* Body */}
            <Text
              className="font-body text-ink-soft"
              style={{
                fontSize: 17,
                lineHeight: 26,
                marginTop: 16,
                maxWidth: 300,
              }}
            >
              {slide.body}
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          {/* Progress dots */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            {slides.map((s, i) => (
              <View
                key={i}
                accessibilityLabel={t('onboarding.progressDot', { current: i + 1 })}
                className="border-ink"
                style={{
                  width: i === step ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === step ? s.accent : '#E8D5B7',
                  borderWidth: 1.5,
                }}
              />
            ))}
          </View>

          <PrimaryButton onPress={next}>
            {step === slides.length - 1 ? t('onboarding.letsGo') : t('onboarding.next')}
          </PrimaryButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 48, paddingBottom: 32 }}>
        <Text
          className="font-bodyBold text-brand-dark"
          style={{
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          {t('onboarding.firstTaskKicker')}
        </Text>
        <Text
          className="font-display text-ink"
          style={{
            fontSize: 42,
            lineHeight: 46,
            letterSpacing: -1,
            marginBottom: 12,
          }}
        >
          {t('onboarding.firstTaskTitle')}
        </Text>
        <Text
          className="font-body text-ink-soft"
          style={{
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 28,
          }}
        >
          {t('onboarding.firstTaskBody')}
        </Text>

        <View
          className="bg-surface-hi border-ink"
          style={{
            borderRadius: 20,
            borderWidth: 3,
            padding: 18,
          }}
        >
          <TextInput
            value={firstTask}
            onChangeText={setFirstTask}
            placeholder={t('onboarding.firstTaskPlaceholder')}
            placeholderTextColor="#8A7868"
            style={{
              fontFamily: 'Fraunces_500Medium',
              color: '#231208',
              fontSize: 20,
              minHeight: 28,
            }}
            autoFocus
          />
        </View>

        <View style={{ flex: 1 }} />

        <PrimaryButton onPress={finish} disabled={!firstTask.trim()}>
          {t('onboarding.start')}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
