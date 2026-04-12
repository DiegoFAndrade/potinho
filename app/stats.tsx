import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
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

  const Stat = ({ label, value, tint }: { label: string; value: string | number; tint: string }) => (
    <View style={{ flex: 1, marginHorizontal: 5 }}>
      <View
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          right: -4,
          bottom: -4,
          backgroundColor: '#231208',
          borderRadius: 20,
        }}
      />
      <View
        style={{
          backgroundColor: tint,
          borderRadius: 20,
          borderWidth: 2.5,
          borderColor: '#231208',
          padding: 16,
        }}
      >
        <Text
          className="font-bodyBold"
          style={{
            color: '#4A2E1E',
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
        <Text
          className="font-display"
          style={{ color: '#231208', fontSize: 36, lineHeight: 40, marginTop: 2 }}
        >
          {value}
        </Text>
      </View>
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
            ✦ seu progresso
          </Text>
          <Text
            className="font-display"
            style={{ color: '#231208', fontSize: 40, lineHeight: 44, letterSpacing: -0.8, marginTop: 2 }}
          >
            Stats
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <Stat label="feitas" value={stats.totalDone} tint="#FFD5C8" />
          <Stat label="ativas" value={stats.totalActive} tint="#FFFBEF" />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <Stat label="streak" value={`${streak.count}🔥`} tint="#D9A520" />
          <Stat label="taxa" value={`${Math.round(stats.completionRate * 100)}%`} tint="#89A47C" />
        </View>

        <Text
          className="font-bodyBold"
          style={{
            color: '#4A2E1E',
            fontSize: 12,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginTop: 8,
            marginBottom: 10,
            paddingHorizontal: 4,
          }}
        >
          — por potinho
        </Text>
        {jars.map((j) => (
          <View
            key={j.id}
            style={{
              backgroundColor: '#FFFBEF',
              borderRadius: 18,
              borderWidth: 2.5,
              borderColor: '#231208',
              padding: 16,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text className="font-bodyBold" style={{ color: '#231208', fontSize: 16 }}>
              {j.name}
            </Text>
            <Text className="font-display" style={{ color: '#E8503D', fontSize: 24 }}>
              {stats.doneByJar[j.id] ?? 0}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
