import type { ReactNode } from 'react';
import { View, Text, Switch, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/stores/appStore';

const PRIVACY_URL = 'https://diegofernandes.github.io/potinho/privacy'; // replace after hosting

export default function Settings() {
  const router = useRouter();
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const isPremium = useAppStore((s) => s.isPremium);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const toggleHaptics = useAppStore((s) => s.toggleHaptics);

  const Row = ({
    label,
    right,
    onPress,
  }: {
    label: string;
    right?: ReactNode;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-4 bg-paper rounded-2xl mb-2"
    >
      <Text className="text-ink text-base">{label}</Text>
      {right}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <Text className="text-ink text-xl font-semibold">Configurações</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-2xl">✕</Text>
        </Pressable>
      </View>

      <View className="px-6 pt-6">
        <Row
          label="Som do sorteio"
          right={<Switch value={soundEnabled} onValueChange={toggleSound} />}
        />
        <Row
          label="Vibração"
          right={<Switch value={hapticsEnabled} onValueChange={toggleHaptics} />}
        />

        {!isPremium && (
          <Row
            label="✨ Versão premium"
            right={<Text className="text-brand font-semibold">Desbloquear</Text>}
            onPress={() => router.push('/paywall')}
          />
        )}

        {isPremium && (
          <Row
            label="📊 Estatísticas"
            right={<Text className="text-muted">›</Text>}
            onPress={() => router.push('/stats')}
          />
        )}

        <Row
          label="Política de privacidade"
          right={<Text className="text-muted">›</Text>}
          onPress={() => Linking.openURL(PRIVACY_URL)}
        />

        <View className="mt-8">
          <Text className="text-muted text-center">Potinho v1.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
