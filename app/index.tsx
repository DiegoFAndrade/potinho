import { View, Text, Pressable } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
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

const Dot = ({ top, left, color, size = 6 }: { top: number; left: number; color: string; size?: number }) => (
  <View
    style={{
      position: 'absolute',
      top,
      left,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
    }}
  />
);

export default function Home() {
  const router = useRouter();
  const onboardingDone = useAppStore((s) => s.onboardingDone);
  const jars = useJarStore((s) => s.jars);
  const jar = jars[0];
  const activeCount = useTaskStore((s) => (jar ? s.activeIn(jar.id).length : 0));
  const streak = useAppStore((s) => s.streak.count);

  const { draw, done, skip, drawnTask, isDrawing, jarRef } = useDrawTask(jar?.id ?? '');

  if (!onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  if (!jar) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8EFD9' }}>
      {/* Decorative dots scattered around background */}
      <Dot top={20} left={40} color="#E8503D" />
      <Dot top={50} left={280} color="#D9A520" size={8} />
      <Dot top={120} left={30} color="#89A47C" />
      <Dot top={200} left={320} color="#E8503D" size={4} />
      <Dot top={300} left={20} color="#D9A520" />

      {/* Header row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <View>
          <Text
            className="font-bodyBold"
            style={{
              color: '#B8321E',
              fontSize: 10,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
            }}
          >
            ✦ {jar.name}
          </Text>
          <Text
            className="font-display"
            style={{
              color: '#231208',
              fontSize: 44,
              lineHeight: 48,
              marginTop: -2,
              letterSpacing: -1,
            }}
          >
            potinho
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 }}>
          <Pressable onPress={() => router.push('/tasks')} accessibilityLabel="Lista de tarefas">
            <Text style={{ fontSize: 22 }}>📋</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/settings')} accessibilityLabel="Configurações">
            <Text style={{ fontSize: 22 }}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      {/* Streak floating */}
      {streak > 0 && (
        <View style={{ position: 'absolute', top: 92, right: 28, zIndex: 10 }}>
          <Streak count={streak} />
        </View>
      )}

      {/* Main area */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <View>
          <Jar ref={jarRef} taskCount={activeCount} />
        </View>

        {/* task count label under jar */}
        {!drawnTask && (
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <Text
              className="font-bodyBold"
              style={{
                color: '#4A2E1E',
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              {activeCount === 0
                ? '— vazio, adicione algo —'
                : `— ${activeCount} ${activeCount === 1 ? 'coisa' : 'coisas'} pra fazer —`}
            </Text>
          </View>
        )}

        {drawnTask && (
          <View style={{ marginTop: 20, width: '100%' }}>
            <TaskCard text={drawnTask.text} onDone={done} onSkip={skip} />
          </View>
        )}
      </View>

      {/* Bottom actions */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 12, gap: 12 }}>
        <PrimaryButton onPress={() => router.push('/add-task')} variant="secondary">
          + anotar tarefa
        </PrimaryButton>
        <PrimaryButton
          onPress={draw}
          disabled={activeCount === 0 || isDrawing || !!drawnTask}
          testID="draw-button"
        >
          {isDrawing ? '...' : 'SORTEAR ✦'}
        </PrimaryButton>
      </View>

      <AdBanner />
    </SafeAreaView>
  );
}
