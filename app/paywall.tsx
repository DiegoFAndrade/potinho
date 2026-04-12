import { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { purchaseService } from '@/services/purchaseService';

const BENEFITS = [
  { icon: '🚫', label: 'Sem anúncios, nunca mais' },
  { icon: '🫙', label: 'Potinhos ilimitados' },
  { icon: '🎨', label: 'Temas visuais extras' },
  { icon: '📊', label: 'Estatísticas detalhadas' },
  { icon: '📅', label: 'Histórico sem limite' },
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8EFD9' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, alignItems: 'flex-end' }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={{ fontSize: 28, color: '#231208' }}>✕</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Text
            className="font-bodyBold"
            style={{
              color: '#B8321E',
              fontSize: 12,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            ✦ potinho premium ✦
          </Text>
          <Text
            className="font-display"
            style={{
              color: '#231208',
              fontSize: 52,
              lineHeight: 56,
              letterSpacing: -1.5,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Desbloqueia{'\n'}tudo.
          </Text>
          <Text
            className="font-body"
            style={{ color: '#4A2E1E', fontSize: 16, textAlign: 'center', marginBottom: 32 }}
          >
            Uma compra, pra sempre.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#FFFBEF',
            borderRadius: 24,
            borderWidth: 3,
            borderColor: '#231208',
            padding: 24,
            marginBottom: 8,
          }}
        >
          {BENEFITS.map((b, i) => (
            <View
              key={b.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: i === BENEFITS.length - 1 ? 0 : 14,
              }}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{b.icon}</Text>
              <Text className="font-bodyMedium" style={{ color: '#231208', fontSize: 16, flex: 1 }}>
                {b.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 10 }}>
        {available ? (
          <PrimaryButton onPress={buy} disabled={loading}>
            {loading ? '...' : `Comprar por ${price}`}
          </PrimaryButton>
        ) : (
          <Text
            className="font-body"
            style={{ color: '#4A2E1E', textAlign: 'center', fontStyle: 'italic' }}
          >
            compras indisponíveis neste dispositivo
          </Text>
        )}
        <Pressable onPress={() => router.back()} style={{ paddingVertical: 10, alignItems: 'center' }}>
          <Text className="font-bodyMedium" style={{ color: '#4A2E1E', fontSize: 14 }}>
            Agora não
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
