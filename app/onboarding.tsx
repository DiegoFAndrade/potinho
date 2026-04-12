import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppStore } from '@/stores/appStore';
import { useTaskStore } from '@/stores/taskStore';
import { useJarStore } from '@/stores/jarStore';

const SLIDES = [
  {
    title: 'Anote o que você tá adiando',
    body: 'Aquelas tarefinhas que ficam na sua cabeça — joga tudo no potinho.',
  },
  {
    title: 'Sorteie uma por vez',
    body: 'Em vez de decidir, deixa o potinho decidir por você. Menos paralisia, mais ação.',
  },
  {
    title: 'Faça e comemore',
    body: 'Marque como concluída e veja seu streak crescer. Um dia de cada vez.',
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [firstTask, setFirstTask] = useState('');
  const router = useRouter();

  const next = () => {
    if (step < SLIDES.length) {
      setStep(step + 1);
    }
  };

  const finish = () => {
    if (firstTask.trim()) {
      useJarStore.getState().ensureDefault();
      const jarId = useJarStore.getState().jars[0].id;
      useTaskStore.getState().addTask(jarId, firstTask.trim());
    }
    useAppStore.getState().finishOnboarding();
    router.replace('/');
  };

  if (step < SLIDES.length) {
    const slide = SLIDES[step];
    return (
      <View className="flex-1 bg-cream p-8 justify-between">
        <View className="flex-1 justify-center">
          <Text className="text-ink text-3xl font-bold mb-4">{slide.title}</Text>
          <Text className="text-muted text-lg leading-6">{slide.body}</Text>
        </View>
        <View className="flex-row justify-center mb-6">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`w-2 h-2 rounded-full mx-1 ${i === step ? 'bg-brand' : 'bg-jar'}`}
            />
          ))}
        </View>
        <PrimaryButton onPress={next}>Próximo</PrimaryButton>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cream p-8 justify-between">
      <View className="flex-1 justify-center">
        <Text className="text-ink text-3xl font-bold mb-4">Qual sua primeira tarefa?</Text>
        <Text className="text-muted text-lg mb-6">
          Pode ser qualquer coisa pequena que você tá adiando.
        </Text>
        <TextInput
          value={firstTask}
          onChangeText={setFirstTask}
          placeholder="Ex: Lavar a louça"
          placeholderTextColor="#8A7868"
          className="bg-paper rounded-2xl px-4 py-3 text-ink text-lg"
          autoFocus
        />
      </View>
      <PrimaryButton onPress={finish} disabled={!firstTask.trim()}>
        Começar
      </PrimaryButton>
    </View>
  );
}
