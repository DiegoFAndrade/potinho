import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';

export default function AddTask() {
  const router = useRouter();
  const jars = useJarStore((s) => s.jars);
  const isPremium = useAppStore((s) => s.isPremium);
  const [text, setText] = useState('');
  const [jarId, setJarId] = useState(jars[0]?.id ?? '');

  const submit = (andContinue: boolean) => {
    const trimmed = text.trim();
    if (!trimmed || !jarId) return;
    useTaskStore.getState().addTask(jarId, trimmed);
    setText('');
    if (!andContinue) router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <Text className="text-ink text-xl font-semibold">Nova tarefa</Text>
        <Pressable onPress={() => router.back()} accessibilityLabel="Fechar">
          <Text className="text-2xl">✕</Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-6">
        {isPremium && jars.length > 1 && (
          <View className="flex-row flex-wrap mb-4 gap-2">
            {jars.map((j) => (
              <Pressable
                key={j.id}
                onPress={() => setJarId(j.id)}
                className={`px-3 py-2 rounded-full ${jarId === j.id ? 'bg-brand' : 'bg-jar'}`}
              >
                <Text className={jarId === j.id ? 'text-white' : 'text-ink'}>{j.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="O que você tá adiando?"
          placeholderTextColor="#8A7868"
          className="bg-paper rounded-2xl px-4 py-3 text-ink text-lg"
          autoFocus
          multiline
        />
      </View>

      <View className="px-6 pb-6 gap-3">
        <PrimaryButton onPress={() => submit(false)} disabled={!text.trim()}>
          Adicionar
        </PrimaryButton>
        <PrimaryButton onPress={() => submit(true)} disabled={!text.trim()} variant="secondary">
          Adicionar e continuar
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
