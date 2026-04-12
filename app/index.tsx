import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Jar } from '@/components/Jar';
import { TaskCard } from '@/components/TaskCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Streak } from '@/components/Streak';
import { AdBanner } from '@/components/AdBanner';
import { useDrawTask } from '@/hooks/useDrawTask';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';

export default function Home() {
  const router = useRouter();
  const jars = useJarStore((s) => s.jars);
  const jar = jars[0];
  const activeCount = useTaskStore((s) => (jar ? s.activeIn(jar.id).length : 0));
  const streak = useAppStore((s) => s.streak.count);

  const { draw, done, skip, drawnTask, isDrawing, jarRef } = useDrawTask(jar?.id ?? '');

  if (!jar) return null;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center justify-between px-6 pt-2">
        <Text className="text-ink text-xl font-semibold">{jar.name}</Text>
        <View className="flex-row items-center gap-2">
          <Streak count={streak} />
          <Pressable onPress={() => router.push('/tasks')} accessibilityLabel="Lista de tarefas">
            <Text className="text-2xl">📋</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/settings')} accessibilityLabel="Configurações">
            <Text className="text-2xl">⚙️</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Jar ref={jarRef} taskCount={activeCount} />
        {drawnTask && (
          <View className="mt-6 w-full">
            <TaskCard text={drawnTask.text} onDone={done} onSkip={skip} />
          </View>
        )}
      </View>

      <View className="px-6 pb-4 gap-3">
        <PrimaryButton onPress={() => router.push('/add-task')} variant="secondary">
          + Adicionar tarefa
        </PrimaryButton>
        <PrimaryButton
          onPress={draw}
          disabled={activeCount === 0 || isDrawing || !!drawnTask}
          testID="draw-button"
        >
          Sortear
        </PrimaryButton>
      </View>

      <AdBanner />
    </SafeAreaView>
  );
}
