import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';

export default function Privacy() {
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
            ✦ legal
          </Text>
          <Text
            className="font-display text-ink"
            style={{ fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
          >
            Privacidade
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}>
        <Text
          className="font-body text-muted"
          style={{ fontSize: 12, marginBottom: 20 }}
        >
          Última atualização: 11 de abril de 2026
        </Text>

        <Section
          title="Dados que coletamos"
          body="O Potinho não coleta dados pessoais. Todas as suas tarefas, potinhos e configurações ficam armazenados exclusivamente no seu dispositivo e nunca são enviados a servidores nossos."
        />

        <Section
          title="Anúncios"
          body="Para usuários da versão gratuita, exibimos anúncios através do Google AdMob. O AdMob pode coletar seu identificador de publicidade (Advertising ID) para fins de personalização e medição. Usuários da versão premium não recebem anúncios e não têm qualquer dado coletado pelo AdMob."
        />

        <Section
          title="Relatórios de erro"
          body="Utilizamos o Sentry para receber relatórios automáticos de falhas do aplicativo. Esses relatórios incluem informações técnicas sobre o dispositivo (modelo, versão do Android) e o erro, mas não contêm dados pessoais."
        />

        <Section
          title="Compras"
          body="Compras são processadas diretamente pelo Google Play. Não temos acesso a dados de pagamento."
        />

        <Section
          title="Contato"
          body="Para dúvidas, envie e-mail para: potinho@gmail.com"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
