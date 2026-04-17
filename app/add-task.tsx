import { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, Image, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { PrimaryButton } from '@/components/PrimaryButton';
import { IconButton } from '@/components/IconButton';
import { useJarStore } from '@/stores/jarStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAppStore } from '@/stores/appStore';
import { analyticsService, Events } from '@/services/analyticsService';

export default function AddTask() {
  const router = useRouter();
  const jars = useJarStore((s) => s.jars);
  const isPremium = useAppStore((s) => s.isPremium);
  const [text, setText] = useState('');
  const [jarId, setJarId] = useState(jars[0]?.id ?? '');
  const activeCount = useTaskStore((s) => (jarId ? s.activeIn(jarId).length : 0));
  const inputRef = useRef<TextInput>(null);

  // Confirmation animation
  const confirmOpacity = useSharedValue(0);
  const confirmTranslateY = useSharedValue(10);
  const confirmStyle = useAnimatedStyle(() => ({
    opacity: confirmOpacity.value,
    transform: [{ translateY: confirmTranslateY.value }],
  }));

  const showConfirmation = useCallback(() => {
    confirmTranslateY.value = 10;
    confirmOpacity.value = withSequence(
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
      withDelay(1200, withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })),
    );
    confirmTranslateY.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) });
  }, [confirmOpacity, confirmTranslateY]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || !jarId) return;
    useTaskStore.getState().addTask(jarId, trimmed);
    analyticsService.track(Events.TASK_ADDED, { taskCount: activeCount + 1 });
    setText('');
    showConfirmation();
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8EFD9' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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
              style={{ color: '#231208', fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
            >
              Joga no potinho
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
              minHeight: 100,
            }}
          >
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder="O que está te travando?"
              placeholderTextColor="#8A7868"
              accessibilityLabel="Texto da tarefa"
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

          {/* Confirmation toast */}
          <Animated.View
            accessibilityLiveRegion="polite"
            style={[
              confirmStyle,
              {
                alignItems: 'center',
                marginTop: 16,
              },
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#89A47C',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: '#231208',
                gap: 6,
              }}
            >
              <Image
                source={require('../assets/logo-transparent.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text
                className="font-bodyBold"
                style={{ color: '#FFFBEF', fontSize: 14 }}
              >
                No potinho!
              </Text>
              <View
                style={{
                  backgroundColor: '#FFFBEF',
                  borderRadius: 10,
                  paddingHorizontal: 7,
                  paddingVertical: 1,
                }}
              >
                <Text
                  className="font-bodyBlack"
                  style={{ color: '#89A47C', fontSize: 11 }}
                >
                  {activeCount}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          <PrimaryButton onPress={submit} disabled={!text.trim()}>
            Adicionar
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
