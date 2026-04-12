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
      {/* Header — clean, breathing room */}
      <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
        {/* Top row: kicker + nav icons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
            <Pressable onPress={() => router.push('/tasks')} accessibilityLabel="Lista de tarefas" hitSlop={10}>
              <Text style={{ fontSize: 20 }}>📋</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/settings')} accessibilityLabel="Configurações" hitSlop={10}>
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Title + streak inline */}
        <Text
          className="font-display"
          style={{
            color: '#231208',
            fontSize: 44,
            lineHeight: 48,
            letterSpacing: -1,
            marginTop: 2,
          }}
        >
          Potinho
        </Text>
      </View>

      {/* Main area — jar centered with generous space */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Jar ref={jarRef} taskCount={activeCount} />

        {/* Task count caption */}
        {!drawnTask && (
          <View style={{ alignItems: 'center', marginTop: 12 }}>
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
                ? '— Vazio, adicione algo —'
                : `— ${activeCount} ${activeCount === 1 ? 'coisa' : 'coisas'} pra fazer —`}
            </Text>
          </View>
        )}

        {drawnTask && (
          <View style={{ marginTop: 24, width: '100%' }}>
            <TaskCard text={drawnTask.text} onDone={done} onSkip={skip} />
          </View>
        )}
      </View>

      {/* Bottom actions — hidden when task card showing */}
      {!drawnTask && (
        <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 12 }}>
          <PrimaryButton onPress={() => router.push('/add-task')} variant="secondary">
            + Criar tarefa
          </PrimaryButton>
          <PrimaryButton
            onPress={draw}
            disabled={activeCount === 0 || isDrawing}
            testID="draw-button"
          >
            {isDrawing ? '...' : 'SORTEAR ✦'}
          </PrimaryButton>
        </View>
      )}

      <AdBanner />
    </SafeAreaView>
  );
}
