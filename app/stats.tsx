import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { computeStats } from '@/lib/stats';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';
import { useJarStore } from '@/stores/jarStore';

export default function Stats() {
  const router = useRouter();
  const tasks = useTaskStore((s) => s.tasks);
  const jars = useJarStore((s) => s.jars);
  const streak = useAppStore((s) => s.streak);
  const stats = computeStats(tasks);

  const Stat = ({ label, value }: { label: string; value: string | number }) => (
    <View className="bg-paper rounded-2xl p-4 flex-1 mx-1">
      <Text className="text-muted text-sm">{label}</Text>
      <Text className="text-ink text-2xl font-bold">{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <Text className="text-ink text-xl font-semibold">Estatísticas</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-2xl">✕</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5 pt-4">
        <View className="flex-row mb-3">
          <Stat label="Concluídas" value={stats.totalDone} />
          <Stat label="Ativas" value={stats.totalActive} />
        </View>
        <View className="flex-row mb-3">
          <Stat label="Streak atual" value={`${streak.count} 🔥`} />
          <Stat label="Taxa conclusão" value={`${Math.round(stats.completionRate * 100)}%`} />
        </View>

        <Text className="text-muted mt-6 mb-2 px-1">Por potinho</Text>
        {jars.map((j) => (
          <View key={j.id} className="bg-paper rounded-2xl p-4 mb-2 flex-row justify-between">
            <Text className="text-ink">{j.name}</Text>
            <Text className="text-ink font-semibold">{stats.doneByJar[j.id] ?? 0}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
