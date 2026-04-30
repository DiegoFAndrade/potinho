import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
import { computeStats } from '@/lib/stats';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';
import { useJarStore } from '@/stores/jarStore';

export default function Stats() {
  const { t } = useTranslation();
  const router = useRouter();
  const tasks = useTaskStore((s) => s.tasks);
  const jars = useJarStore((s) => s.jars);
  const streak = useAppStore((s) => s.streak);
  const stats = computeStats(tasks);

  const Stat = ({ label, value, tint }: { label: string; value: string | number; tint: string }) => (
    <View style={{ flex: 1, marginHorizontal: 5 }} accessibilityLabel={`${label}: ${value}`}>
      <View
        className="bg-ink"
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          right: -4,
          bottom: -4,
          borderRadius: 20,
        }}
      />
      <View
        className={`${tint} border-ink`}
        style={{
          borderRadius: 20,
          borderWidth: 2.5,
          padding: 16,
        }}
      >
        <Text
          className="font-bodyBold text-ink-soft"
          style={{
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
        <Text
          className="font-display text-ink"
          style={{ fontSize: 36, lineHeight: 40, marginTop: 2 }}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
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
            {t('stats.kicker')}
          </Text>
          <Text
            className="font-display text-ink"
            style={{ fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
          >
            {t('stats.title')}
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <Stat label={t('stats.done')} value={stats.totalDone} tint="bg-blush" />
          <Stat label={t('stats.active')} value={stats.totalActive} tint="bg-surface-hi" />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <Stat label={t('stats.streak')} value={`${streak.count}🔥`} tint="bg-accent" />
          <Stat label={t('stats.rate')} value={`${Math.round(stats.completionRate * 100)}%`} tint="bg-sage" />
        </View>

        <Text
          className="font-bodyBold text-ink-soft"
          style={{
            fontSize: 12,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginTop: 8,
            marginBottom: 10,
            paddingHorizontal: 4,
          }}
        >
          {t('stats.byJar')}
        </Text>
        {jars.map((j) => (
          <View
            key={j.id}
            className="bg-surface-hi border-ink"
            style={{
              borderRadius: 18,
              borderWidth: 2.5,
              padding: 16,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text className="font-bodyBold text-ink" style={{ fontSize: 16 }}>
              {j.name}
            </Text>
            <Text className="font-display text-brand" style={{ fontSize: 24 }}>
              {stats.doneByJar[j.id] ?? 0}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
