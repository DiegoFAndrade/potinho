import { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { purchaseService } from '@/services/purchaseService';

const BENEFITS = [
  { icon: '🚫', label: 'Remover todos os anúncios' },
  { icon: '🫙', label: 'Potinhos ilimitados por categoria' },
  { icon: '🎨', label: 'Temas visuais extras' },
  { icon: '📊', label: 'Estatísticas detalhadas' },
  { icon: '📅', label: 'Histórico completo sem limite' },
];

export default function Paywall() {
  const router = useRouter();
  const [price, setPrice] = useState<string>('R$ 6,90');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    purchaseService
      .getPremiumProduct()
      .then((p) => {
        if (p) setPrice(p.displayPrice ?? 'R$ 6,90');
        else setAvailable(false);
      })
      .catch(() => setAvailable(false));
  }, []);

  const buy = async () => {
    setLoading(true);
    const res = await purchaseService.buyPremium();
    setLoading(false);
    if (res.ok) {
      Alert.alert('Premium ativado! 🎉', 'Obrigado pelo apoio.');
      router.back();
    } else if (res.error) {
      Alert.alert('Compra não concluída', res.error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 flex-row justify-end">
        <Pressable onPress={() => router.back()}>
          <Text className="text-2xl">✕</Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6 justify-center">
        <Text className="text-ink text-3xl font-bold text-center mb-2">Potinho Premium</Text>
        <Text className="text-muted text-center mb-8">
          Desbloqueie tudo com uma compra única.
        </Text>

        <View className="bg-paper rounded-3xl p-6 mb-8">
          {BENEFITS.map((b) => (
            <View key={b.label} className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">{b.icon}</Text>
              <Text className="text-ink flex-1">{b.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-6 pb-6 gap-3">
        {available ? (
          <PrimaryButton onPress={buy} disabled={loading}>
            {loading ? 'Processando...' : `Comprar por ${price}`}
          </PrimaryButton>
        ) : (
          <Text className="text-muted text-center">
            Compras indisponíveis neste dispositivo
          </Text>
        )}
        <Pressable onPress={() => router.back()} className="py-2">
          <Text className="text-muted text-center">Agora não</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
