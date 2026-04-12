import { View, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';
import type { Task } from '@/types';

export default function TasksScreen() {
  const router = useRouter();
  const jars = useJarStore((s) => s.jars);
  const tasks = useTaskStore((s) => s.tasks);
  const removeTask = useTaskStore((s) => s.removeTask);
  const isPremium = useAppStore((s) => s.isPremium);

  const jar = jars[0];
  if (!jar) return null;

  const active = tasks.filter((t) => t.jarId === jar.id && t.status === 'active');

  const sevenDaysAgo = Date.now() - 7 * 86_400_000;
  const completed = tasks
    .filter((t) => t.jarId === jar.id && t.status === 'done' && t.completedAt != null)
    .filter((t) => isPremium || (t.completedAt ?? 0) >= sevenDaysAgo)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  const renderActive = ({ item }: { item: Task }) => (
    <View className="bg-paper rounded-2xl p-4 mb-2 flex-row justify-between items-center">
      <Text className="text-ink flex-1">{item.text}</Text>
      <Pressable onPress={() => removeTask(item.id)} accessibilityLabel="Remover tarefa">
        <Text className="text-muted text-xl px-2">✕</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <Text className="text-ink text-xl font-semibold">Tarefas</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-2xl">✕</Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-4">
        <Text className="text-muted mb-2">Ativas ({active.length})</Text>
        <FlatList
          data={active}
          keyExtractor={(t) => t.id}
          renderItem={renderActive}
          ListEmptyComponent={
            <Text className="text-muted">Nenhuma tarefa. Adicione uma na home.</Text>
          }
        />

        <Text className="text-muted mt-6 mb-2">
          Histórico {isPremium ? '(completo)' : '(últimos 7 dias)'}
        </Text>
        <FlatList
          data={completed}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <View className="bg-paper/60 rounded-2xl p-3 mb-2">
              <Text className="text-ink line-through">{item.text}</Text>
            </View>
          )}
          ListEmptyComponent={<Text className="text-muted">Nenhuma tarefa concluída ainda.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}
