import { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { IconButton } from '@/components/IconButton';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';
import type { Task } from '@/types';

type Tab = 'active' | 'done';

function TabButton({ label, count, selected, onPress }: { label: string; count: number; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <View style={{ position: 'relative', paddingRight: 3, paddingBottom: 3 }}>
        {selected && (
          <View
            style={{
              position: 'absolute',
              top: 3,
              left: 3,
              right: 0,
              bottom: 0,
              backgroundColor: '#231208',
              borderRadius: 16,
            }}
          />
        )}
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 16,
            borderWidth: 2.5,
            borderColor: '#231208',
            backgroundColor: selected ? '#E8503D' : '#FFFBEF',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Text
            className="font-bodyBold"
            style={{ color: selected ? '#FFFBEF' : '#4A2E1E', fontSize: 14 }}
          >
            {label}
          </Text>
          <View
            style={{
              backgroundColor: selected ? '#FFFBEF' : '#E8D5B7',
              borderRadius: 10,
              paddingHorizontal: 7,
              paddingVertical: 1,
            }}
          >
            <Text
              className="font-bodyBlack"
              style={{ color: selected ? '#E8503D' : '#4A2E1E', fontSize: 12 }}
            >
              {count}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function TasksScreen() {
  const router = useRouter();
  const jars = useJarStore((s) => s.jars);
  const tasks = useTaskStore((s) => s.tasks);
  const removeTask = useTaskStore((s) => s.removeTask);
  const isPremium = useAppStore((s) => s.isPremium);
  const [tab, setTab] = useState<Tab>('active');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const jar = jars[0];
  if (!jar) return null;

  const active = tasks.filter((t) => t.jarId === jar.id && t.status === 'active');
  const sevenDaysAgo = Date.now() - 7 * 86_400_000;
  const allCompleted = tasks.filter(
    (t) => t.jarId === jar.id && t.status === 'done' && t.completedAt != null,
  );
  const completed = allCompleted
    .filter((t) => isPremium || (t.completedAt ?? 0) >= sevenDaysAgo)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  const hiddenCount = allCompleted.length - completed.length;

  const handleDelete = (id: string) => {
    Alert.alert('Remover tarefa?', undefined, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeTask(id) },
    ]);
  };

  const handleEditStart = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleEditSave = () => {
    if (editingId && editText.trim()) {
      useTaskStore.getState().editTask(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const renderActive = ({ item }: { item: Task }) => {
    const isEditing = editingId === item.id;

    return (
      <View
        style={{
          backgroundColor: '#FFFBEF',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#231208',
          paddingVertical: 10,
          paddingHorizontal: 14,
          marginBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {isEditing ? (
          <>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              autoFocus
              className="font-bodyMedium"
              style={{
                flex: 1,
                fontSize: 15,
                lineHeight: 20,
                color: '#231208',
                paddingVertical: 0,
              }}
              onSubmitEditing={handleEditSave}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 8 }}>
              <Pressable onPress={handleEditSave} hitSlop={10} accessibilityLabel="Salvar edição">
                <Feather name="check" size={20} color="#89A47C" />
              </Pressable>
              <Pressable onPress={handleEditCancel} hitSlop={10} accessibilityLabel="Cancelar edição">
                <Feather name="x" size={20} color="#4A2E1E" />
              </Pressable>
              <Pressable onPress={() => { handleEditCancel(); handleDelete(item.id); }} hitSlop={10} accessibilityLabel="Remover tarefa">
                <Feather name="trash-2" size={18} color="#B8321E" />
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text
              className="font-bodyMedium"
              style={{ color: '#231208', flex: 1, fontSize: 15, lineHeight: 20 }}
            >
              {item.text}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 8 }}>
              <Pressable onPress={() => handleEditStart(item)} hitSlop={10} accessibilityLabel="Editar tarefa">
                <Feather name="edit-2" size={17} color="#4A2E1E" />
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id)} hitSlop={10} accessibilityLabel="Remover tarefa">
                <Feather name="trash-2" size={17} color="#B8321E" />
              </Pressable>
            </View>
          </>
        )}
      </View>
    );
  };

  const renderDone = ({ item }: { item: Task }) => (
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
        className="font-bodyMedium"
        style={{ color: '#4A2E1E', fontSize: 15, lineHeight: 20, textDecorationLine: 'line-through' }}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8EFD9' }}>
      {/* Header */}
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
            style={{ color: '#231208', fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
          >
            Tarefas
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, gap: 10 }}>
        <TabButton
          label="No potinho"
          count={active.length}
          selected={tab === 'active'}
          onPress={() => setTab('active')}
        />
        <TabButton
          label="Feitas"
          count={completed.length}
          selected={tab === 'done'}
          onPress={() => setTab('done')}
        />
      </View>

      {/* List */}
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        {tab === 'active' ? (
          <FlatList
            data={active}
            keyExtractor={(t) => t.id}
            renderItem={renderActive}
            ListEmptyComponent={
              <Text
                className="font-body"
                style={{ color: '#4A2E1E', fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}
              >
                Nada ainda. Joga algo aí.
              </Text>
            }
          />
        ) : (
          <>
            {!isPremium && (
              <Text
                className="font-bodyBold"
                style={{
                  color: '#8A7868',
                  fontSize: 11,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  textAlign: 'center',
                }}
              >
                Últimos 7 dias — Premium libera tudo
              </Text>
            )}
            <FlatList
              data={completed}
              keyExtractor={(t) => t.id}
              renderItem={renderDone}
              ListEmptyComponent={
                <Text
                  className="font-body"
                  style={{ color: '#4A2E1E', fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}
                >
                  Suas tarefas concluídas aparecem aqui.
                </Text>
              }
              ListFooterComponent={
                !isPremium && hiddenCount > 0 ? (
                  <View
                    style={{
                      backgroundColor: '#89A47C',
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: '#231208',
                      padding: 16,
                      marginTop: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      className="font-bodyMedium"
                      style={{ color: '#FFFBEF', fontSize: 14, textAlign: 'center', marginBottom: 10 }}
                    >
                      Você tem mais {hiddenCount} {hiddenCount === 1 ? 'tarefa concluída' : 'tarefas concluídas'}.
                      {'\n'}Premium desbloqueia o histórico completo.
                    </Text>
                    <Pressable
                      onPress={() => router.push('/paywall')}
                      style={{
                        backgroundColor: '#FFFBEF',
                        borderRadius: 10,
                        paddingVertical: 8,
                        paddingHorizontal: 18,
                        borderWidth: 2,
                        borderColor: '#231208',
                      }}
                    >
                      <Text className="font-bodyBold" style={{ color: '#231208', fontSize: 14 }}>
                        Ver mais →
                      </Text>
                    </Pressable>
                  </View>
                ) : null
              }
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
