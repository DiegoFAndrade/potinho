import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppStore } from '@/stores/appStore';
import { useTaskStore } from '@/stores/taskStore';
import { useJarStore } from '@/stores/jarStore';
import { analyticsService, Events } from '@/services/analyticsService';

const SLIDES = [
  {
    kicker: 'um',
    title: 'Anote o que\ntá te travando.',
    body: 'Aquelas tarefinhas que ficam pairando na sua cabeça — joga tudo pro potinho.',
    accent: '#E8503D',
  },
  {
    kicker: 'dois',
    title: 'Deixa o\npotinho decidir.',
    body: 'Em vez de escolher, sorteia. Menos paralisia, mais ação.',
    accent: '#D9A520',
  },
  {
    kicker: 'três',
    title: 'Faça uma\nde cada vez.',
    body: 'Marca como feito e vê seu streak crescer. Um dia de cada vez.',
    accent: '#89A47C',
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [firstTask, setFirstTask] = useState('');
  const router = useRouter();

  const next = () => {
    if (step < SLIDES.length) setStep(step + 1);
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

  if (step < SLIDES.length) {
    const slide = SLIDES[step];
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
              passo {slide.kicker}
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
            {SLIDES.map((s, i) => (
              <View
                key={i}
                accessibilityLabel={`Passo ${i + 1} de 3`}
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
            {step === SLIDES.length - 1 ? 'Bora!' : 'Próximo →'}
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
          ✦ primeira tarefa
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
          Qual coisa{'\n'}você está{'\n'}adiando?
        </Text>
        <Text
          className="font-body text-ink-soft"
          style={{
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 28,
          }}
        >
          Pode ser qualquer coisa pequena. A gente começa por uma só.
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
            placeholder="Ex: lavar a louça"
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
          Começar ✦
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
