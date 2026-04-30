import type { ReactNode } from 'react';
import { View, Text, Switch, Pressable, Alert } from 'react-native';
import { exportData, importData } from '@/services/backupService';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
import { useAppStore } from '@/stores/appStore';

export default function Settings() {
  const { t } = useTranslation();
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
      className="bg-surface-hi border-ink"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderRadius: 18,
        borderWidth: 2.5,
        marginBottom: 10,
      }}
    >
      <Text className="font-bodyBold text-ink" style={{ fontSize: 16 }}>
        {label}
      </Text>
      {right}
    </Pressable>
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
            {t('settings.kicker')}
          </Text>
          <Text
            className="font-display text-ink"
            style={{ fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
          >
            {t('settings.title')}
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        <Row
          label={t('settings.sound')}
          right={
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ true: '#89A47C', false: '#E8D5B7' }}
              thumbColor="#FFFBEF"
              accessibilityLabel={soundEnabled ? t('settings.soundOn') : t('settings.soundOff')}
            />
          }
        />
        <Row
          label={t('settings.vibration')}
          right={
            <Switch
              value={hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ true: '#89A47C', false: '#E8D5B7' }}
              thumbColor="#FFFBEF"
              accessibilityLabel={hapticsEnabled ? t('settings.vibrationOn') : t('settings.vibrationOff')}
            />
          }
        />

        {!isPremium && (
          <Row
            label={t('settings.premium')}
            right={
              <Text
                className="font-bodyBlack text-brand"
                style={{ fontSize: 14, letterSpacing: 1 }}
              >
                R$ 6,90 →
              </Text>
            }
            onPress={() => router.push('/paywall')}
          />
        )}

        {isPremium && (
          <Row
            label={t('settings.stats')}
            right={<Text className="text-ink-soft" style={{ fontSize: 20 }}>›</Text>}
            onPress={() => router.push('/stats')}
          />
        )}

        <Row
          label={t('settings.privacy')}
          right={<Text className="text-ink-soft" style={{ fontSize: 20 }}>›</Text>}
          onPress={() => router.push('/privacy')}
        />

        <Row
          label={t('settings.export')}
          right={<Text className="text-ink-soft" style={{ fontSize: 20 }}>↗</Text>}
          onPress={() => {
            exportData().catch(() => {});
          }}
        />

        <Row
          label={t('settings.import')}
          right={<Text className="text-ink-soft" style={{ fontSize: 20 }}>↙</Text>}
          onPress={async () => {
            const imported = await importData();
            if (imported) {
              Alert.alert(t('backup.importSuccess'));
            }
          }}
        />

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text
            className="font-bodyBold text-muted"
            style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}
          >
            {t('settings.version')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
