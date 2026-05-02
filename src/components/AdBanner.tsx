import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/appStore';
import { BANNER_ID } from '@/services/adsService';

export function AdBanner() {
  const { t } = useTranslation();
  const isPremium = useAppStore((s) => s.isPremium);
  if (isPremium) return null;
  return (
    <View className="items-center" accessibilityLabel={t('common.ad')}>
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
