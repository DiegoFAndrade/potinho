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
    <View
      style={{
        backgroundColor: '#FFFBEF',
        borderRadius: 16,
        borderWidth: 2.5,
        borderColor: '#231208',
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text
        className="font-bodyMedium"
        style={{ color: '#231208', flex: 1, fontSize: 16, lineHeight: 22 }}
      >
        {item.text}
      </Text>
      <Pressable onPress={() => removeTask(item.id)} hitSlop={10} accessibilityLabel="Remover tarefa">
        <Text style={{ color: '#B8321E', fontSize: 22, paddingHorizontal: 6 }}>✕</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8EFD9' }}>
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View>
          <Text
            className="font-bodyBold"
            style={{ color: '#B8321E', fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' }}
          >
            ✦ suas coisas
          </Text>
          <Text
            className="font-display"
            style={{ color: '#231208', fontSize: 40, lineHeight: 44, letterSpacing: -0.8, marginTop: 2 }}
          >
            tarefas
          </Text>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={{ fontSize: 28, color: '#231208' }}>✕</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
        <Text
          className="font-bodyBold"
          style={{ color: '#4A2E1E', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}
        >
          — no potinho ({active.length})
        </Text>
        <FlatList
          data={active}
          keyExtractor={(t) => t.id}
          renderItem={renderActive}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text
              className="font-body"
              style={{ color: '#4A2E1E', fontStyle: 'italic', marginBottom: 16 }}
            >
              nada ainda. joga algo aí.
            </Text>
          }
        />

        <Text
          className="font-bodyBold"
          style={{
            color: '#4A2E1E',
            fontSize: 12,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginTop: 24,
            marginBottom: 10,
          }}
        >
          — feitas {isPremium ? '(tudo)' : '(7 dias)'}
        </Text>
        <FlatList
          data={completed}
          keyExtractor={(t) => t.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#FFD5C8',
                borderRadius: 14,
                borderWidth: 2,
                borderColor: '#231208',
                paddingVertical: 10,
                paddingHorizontal: 14,
                marginBottom: 8,
              }}
            >
              <Text
                className="font-body"
                style={{ color: '#4A2E1E', fontSize: 15, textDecorationLine: 'line-through' }}
              >
                {item.text}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text className="font-body" style={{ color: '#4A2E1E', fontStyle: 'italic' }}>
              ainda nenhuma.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}
