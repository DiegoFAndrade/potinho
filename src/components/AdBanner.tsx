import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useAppStore } from '@/stores/appStore';
import { BANNER_ID } from '@/services/adsService';

export function AdBanner() {
  const isPremium = useAppStore((s) => s.isPremium);
  if (isPremium) return null;
  return (
    <View className="items-center">
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
