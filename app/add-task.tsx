import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { IconButton } from '@/components/IconButton';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';

export default function AddTask() {
  const router = useRouter();
  const jars = useJarStore((s) => s.jars);
  const isPremium = useAppStore((s) => s.isPremium);
  const [text, setText] = useState('');
  const [jarId, setJarId] = useState(jars[0]?.id ?? '');

  const submit = (andContinue: boolean) => {
    const trimmed = text.trim();
    if (!trimmed || !jarId) return;
    useTaskStore.getState().addTask(jarId, trimmed);
    setText('');
    if (!andContinue) router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8EFD9' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text
            className="font-bodyBold"
            style={{ color: '#B8321E', fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' }}
          >
            ✦ nova anotação
          </Text>
          <Text
            className="font-display"
            style={{ color: '#231208', fontSize: 36, lineHeight: 40, letterSpacing: -0.8, marginTop: 2 }}
          >
            Joga no{'\n'}potinho
          </Text>
        </View>
        <IconButton icon="x" onPress={() => router.back()} label="Fechar" />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 28 }}>
        {isPremium && jars.length > 1 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {jars.map((j) => {
              const selected = jarId === j.id;
              return (
                <Pressable
                  key={j.id}
                  onPress={() => setJarId(j.id)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: '#231208',
                    backgroundColor: selected ? '#E8503D' : '#FFD5C8',
                  }}
                >
                  <Text
                    className="font-bodyBold"
                    style={{ color: selected ? '#FFFBEF' : '#231208', fontSize: 13 }}
                  >
                    {j.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View
          style={{
            backgroundColor: '#FFFBEF',
            borderRadius: 20,
            borderWidth: 3,
            borderColor: '#231208',
            padding: 18,
            minHeight: 140,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="O que tá te travando?"
            placeholderTextColor="#8A7868"
            style={{
              fontFamily: 'Fraunces_500Medium',
              color: '#231208',
              fontSize: 22,
              lineHeight: 30,
              textAlignVertical: 'top',
            }}
            autoFocus
            multiline
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 10 }}>
        <PrimaryButton onPress={() => submit(false)} disabled={!text.trim()}>
          Adicionar
        </PrimaryButton>
        <PrimaryButton onPress={() => submit(true)} disabled={!text.trim()} variant="secondary">
          + Outra
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
