import { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { IconButton } from '@/components/IconButton';
import { purchaseService } from '@/services/purchaseService';
import { analyticsService, Events } from '@/services/analyticsService';

export default function Paywall() {
  const { t } = useTranslation();
  const router = useRouter();
  const [price, setPrice] = useState<string>('R$ 6,90');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    analyticsService.track(Events.PAYWALL_OPENED, { source: 'direct' });
    purchaseService
      .getPremiumProduct()
      .then((p) => {
        if (p) setPrice(p.displayPrice ?? 'R$ 6,90');
        else setAvailable(false);
      })
      .catch(() => setAvailable(false));
  }, []);

  const benefits = [
    { icon: '🚫', label: t('paywall.benefit1') },
    { icon: '🫙', label: t('paywall.benefit2') },
    { icon: '🎨', label: t('paywall.benefit3') },
    { icon: '📊', label: t('paywall.benefit4') },
    { icon: '📅', label: t('paywall.benefit5') },
  ];

  const buy = async () => {
    setLoading(true);
    analyticsService.track(Events.PURCHASE_ATTEMPTED);
    const res = await purchaseService.buyPremium();
    setLoading(false);
    if (res.ok) {
      analyticsService.track(Events.PURCHASE_COMPLETED);
      Alert.alert(t('paywall.successTitle'), t('paywall.successMessage'));
      router.back();
    } else if (res.error) {
      analyticsService.track(Events.PURCHASE_FAILED, { error: res.error });
      Alert.alert(t('paywall.failTitle'), res.error);
    }
  };

  const restore = async () => {
    setRestoring(true);
    try {
      const restored = await purchaseService.restore();
      if (restored) {
        analyticsService.track(Events.PURCHASE_RESTORED);
        Alert.alert(t('paywall.restoreSuccess'), t('paywall.restoreSuccessMessage'));
        router.back();
      } else {
        Alert.alert(t('paywall.restoreNotFound'), t('paywall.restoreNotFoundMessage'));
      }
    } catch {
      Alert.alert(t('paywall.restoreError'), t('paywall.restoreErrorMessage'));
    } finally {
      setRestoring(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View style={{ paddingHorizontal: 24, paddingTop: 16, alignItems: 'flex-end' }}>
        <IconButton icon="x" onPress={() => router.back()} label={t('common.close')} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../assets/logo-potinho-transparent.png')}
            style={{ width: 80, height: 80, marginBottom: 16 }}
            resizeMode="contain"
          />
          <Text
            className="font-bodyBold text-brand-dark"
            style={{
              fontSize: 12,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {t('paywall.kicker')}
          </Text>
          <Text
            className="font-display text-ink"
            style={{
              fontSize: 52,
              lineHeight: 56,
              letterSpacing: -1.5,
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            {t('paywall.title')}
          </Text>
          <Text
            className="font-bodySemi text-ink-soft"
            style={{ fontSize: 17, textAlign: 'center', marginBottom: 28 }}
          >
            {t('paywall.subtitle')}
          </Text>
        </View>

        <View
          className="bg-surface-hi border-ink"
          style={{
            borderRadius: 24,
            borderWidth: 3,
            padding: 24,
            marginBottom: 8,
          }}
        >
          {benefits.map((b, i) => (
            <View
              key={b.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: i === benefits.length - 1 ? 0 : 14,
              }}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{b.icon}</Text>
              <Text className="font-bodyMedium text-ink" style={{ fontSize: 16, flex: 1 }}>
                {b.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 10 }}>
        {available ? (
          <>
            <PrimaryButton onPress={buy} disabled={loading} accessibilityHint={t('paywall.purchaseHint')}>
              {loading ? t('paywall.buying') : t('paywall.buyFor', { price })}
            </PrimaryButton>
            <Text
              className="font-body text-muted"
              style={{ fontSize: 12, textAlign: 'center' }}
            >
              {t('paywall.oneTime')}
            </Text>
          </>
        ) : (
          <Text
            className="font-body text-ink-soft"
            style={{ textAlign: 'center', fontStyle: 'italic' }}
          >
            {t('paywall.unavailable')}
          </Text>
        )}
        <Pressable onPress={() => router.back()} style={{ paddingVertical: 10, alignItems: 'center' }}>
          <Text className="font-bodyMedium text-ink-soft" style={{ fontSize: 14 }}>
            {t('paywall.notNow')}
          </Text>
        </Pressable>
        <Pressable onPress={restore} disabled={restoring} accessibilityRole="button" accessibilityHint={t('paywall.restoreHint')} style={{ paddingVertical: 6, alignItems: 'center' }}>
          <Text className="font-body text-muted" style={{ fontSize: 13, textDecorationLine: 'underline' }}>
            {restoring ? t('paywall.restoring') : t('paywall.restore')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
