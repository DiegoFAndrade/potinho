import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';

export default function Privacy() {
  const { t } = useTranslation();
  const router = useRouter();

  const Section = ({ title, body }: { title: string; body: string }) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        className="font-bodyBold text-ink"
        style={{ fontSize: 16, marginBottom: 6 }}
      >
        {title}
      </Text>
      <Text
        className="font-body text-ink-soft"
        style={{ fontSize: 14, lineHeight: 22 }}
      >
        {body}
      </Text>
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
            {t('privacy.kicker')}
          </Text>
          <Text
            className="font-display text-ink"
            style={{ fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
          >
            {t('privacy.title')}
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label={t('common.close')} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}>
        <Text
          className="font-body text-muted"
          style={{ fontSize: 12, marginBottom: 20 }}
        >
          {t('privacy.lastUpdated')}
        </Text>

        <Section title={t('privacy.dataTitle')} body={t('privacy.dataBody')} />
        <Section title={t('privacy.analyticsTitle')} body={t('privacy.analyticsBody')} />
        <Section title={t('privacy.adsTitle')} body={t('privacy.adsBody')} />
        <Section title={t('privacy.crashTitle')} body={t('privacy.crashBody')} />
        <Section title={t('privacy.purchaseTitle')} body={t('privacy.purchaseBody')} />
        <Section title={t('privacy.contactTitle')} body={t('privacy.contactBody')} />
      </ScrollView>
    </SafeAreaView>
  );
}
