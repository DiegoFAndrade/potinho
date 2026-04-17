import type { ReactNode } from 'react';
import { View, Text, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
import { useAppStore } from '@/stores/appStore';

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
      accessibilityRole={onPress ? 'button' : undefined}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 16,
        backgroundColor: '#FFFBEF',
        borderRadius: 18,
        borderWidth: 2.5,
        borderColor: '#231208',
        marginBottom: 10,
      }}
    >
      <Text className="font-bodyBold" style={{ color: '#231208', fontSize: 16 }}>
        {label}
      </Text>
      {right}
    </Pressable>
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
            ✦ ajustes
          </Text>
          <Text
            className="font-display"
            style={{ color: '#231208', fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
          >
            Configurações
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        <Row
          label="Som do sorteio"
          right={
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ true: '#89A47C', false: '#E8D5B7' }}
              thumbColor="#FFFBEF"
              accessibilityLabel={soundEnabled ? 'Som ativado' : 'Som desativado'}
            />
          }
        />
        <Row
          label="Vibração"
          right={
            <Switch
              value={hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ true: '#89A47C', false: '#E8D5B7' }}
              thumbColor="#FFFBEF"
              accessibilityLabel={hapticsEnabled ? 'Vibração ativada' : 'Vibração desativada'}
            />
          }
        />

        {!isPremium && (
          <Row
            label="✦ Virar premium"
            right={
              <Text
                className="font-bodyBlack"
                style={{ color: '#E8503D', fontSize: 14, letterSpacing: 1 }}
              >
                R$ 6,90 →
              </Text>
            }
            onPress={() => router.push('/paywall')}
          />
        )}

        {isPremium && (
          <Row
            label="📊 Estatísticas"
            right={<Text style={{ color: '#4A2E1E', fontSize: 20 }}>›</Text>}
            onPress={() => router.push('/stats')}
          />
        )}

        <Row
          label="Política de privacidade"
          right={<Text style={{ color: '#4A2E1E', fontSize: 20 }}>›</Text>}
          onPress={() => router.push('/privacy')}
        />

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text
            className="font-bodyBold"
            style={{ color: '#8A7868', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}
          >
            potinho v1.0 ✦ feito com carinho
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
