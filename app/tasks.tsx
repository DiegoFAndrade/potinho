import { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
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
    <Pressable onPress={onPress} style={{ flex: 1 }} accessibilityRole="tab" accessibilityState={{ selected }}>
      <View style={{ position: 'relative', paddingRight: 3, paddingBottom: 3 }}>
        {selected && (
          <View
            className="bg-ink"
            style={{
              position: 'absolute',
              top: 3,
              left: 3,
              right: 0,
              bottom: 0,
              borderRadius: 16,
            }}
          />
        )}
        <View
          className={selected ? 'bg-brand border-ink' : 'bg-surface-hi border-ink'}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 16,
            borderWidth: 2.5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Text
            className={selected ? 'font-bodyBold text-surface-hi' : 'font-bodyBold text-ink-soft'}
            style={{ fontSize: 14 }}
          >
            {label}
          </Text>
          <View
            className={selected ? 'bg-surface-hi' : 'bg-jar'}
            style={{
              borderRadius: 10,
              paddingHorizontal: 7,
              paddingVertical: 1,
            }}
          >
            <Text
              className={selected ? 'font-bodyBlack text-brand' : 'font-bodyBlack text-ink-soft'}
              style={{ fontSize: 12 }}
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
  const { t } = useTranslation();
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
    Alert.alert(t('tasks.deleteTitle'), undefined, [
      { text: t('tasks.deleteCancel'), style: 'cancel' },
      { text: t('tasks.deleteConfirm'), style: 'destructive', onPress: () => removeTask(id) },
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
        className="bg-surface-hi border-ink"
        style={{
          borderRadius: 14,
          borderWidth: 2,
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
                color: '#231208', // TextInput color — kept as native prop
                paddingVertical: 0,
              }}
              onSubmitEditing={handleEditSave}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 8 }}>
              <Pressable onPress={handleEditSave} hitSlop={10} accessibilityLabel={t('tasks.saveEdit')}>
                <Feather name="check" size={20} color="#89A47C" />
              </Pressable>
              <Pressable onPress={handleEditCancel} hitSlop={10} accessibilityLabel={t('tasks.cancelEdit')}>
                <Feather name="x" size={20} color="#4A2E1E" />
              </Pressable>
              <Pressable onPress={() => { handleEditCancel(); handleDelete(item.id); }} hitSlop={10} accessibilityLabel={t('tasks.removeTask')}>
                <Feather name="trash-2" size={18} color="#B8321E" />
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text
              className="font-bodyMedium text-ink"
              style={{ flex: 1, fontSize: 15, lineHeight: 20 }}
            >
              {item.text}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 8 }}>
              <Pressable onPress={() => handleEditStart(item)} hitSlop={10} accessibilityLabel={t('tasks.editTask')}>
                <Feather name="edit-2" size={17} color="#4A2E1E" />
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id)} hitSlop={10} accessibilityLabel={t('tasks.removeTask')}>
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
      className="bg-blush border-ink"
      style={{
        borderRadius: 14,
        borderWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 8,
      }}
    >
      <Text
        className="font-bodyMedium text-ink-soft"
        style={{ fontSize: 15, lineHeight: 20, textDecorationLine: 'line-through' }}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
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
            className="font-bodyBold text-brand-dark"
            style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' }}
          >
            {t('tasks.kicker')}
          </Text>
          <Text
            className="font-display text-ink"
            style={{ fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
          >
            {t('tasks.title')}
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, gap: 10 }}>
        <TabButton
          label={t('tasks.tabActive')}
          count={active.length}
          selected={tab === 'active'}
          onPress={() => setTab('active')}
        />
        <TabButton
          label={t('tasks.tabDone')}
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
                className="font-body text-ink-soft"
                style={{ fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}
              >
                {t('tasks.emptyActive')}
              </Text>
            }
          />
        ) : (
          <>
            {!isPremium && (
              <Text
                className="font-bodyBold text-muted"
                style={{
                  fontSize: 11,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  textAlign: 'center',
                }}
              >
                {t('tasks.last7days')}
              </Text>
            )}
            <FlatList
              data={completed}
              keyExtractor={(t) => t.id}
              renderItem={renderDone}
              ListEmptyComponent={
                <Text
                  className="font-body text-ink-soft"
                  style={{ fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}
                >
                  {t('tasks.emptyDone')}
                </Text>
              }
              ListFooterComponent={
                !isPremium && hiddenCount > 0 ? (
                  <View
                    className="bg-sage border-ink"
                    style={{
                      borderRadius: 16,
                      borderWidth: 2,
                      padding: 16,
                      marginTop: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      className="font-bodyMedium text-surface-hi"
                      style={{ fontSize: 14, textAlign: 'center', marginBottom: 10 }}
                    >
                      {t('tasks.hiddenCount', { count: hiddenCount })}
                      {'\n'}{t('tasks.hiddenUpsell')}
                    </Text>
                    <Pressable
                      onPress={() => router.push('/paywall')}
                      className="bg-surface-hi border-ink"
                      style={{
                        borderRadius: 10,
                        paddingVertical: 8,
                        paddingHorizontal: 18,
                        borderWidth: 2,
                      }}
                    >
                      <Text className="font-bodyBold text-ink" style={{ fontSize: 14 }}>
                        {t('tasks.seeMore')}
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
