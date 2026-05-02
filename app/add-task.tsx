import { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, Image, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
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
import { analyticsService, Events } from '@/services/analyticsService';

export default function AddTask() {
  const { t } = useTranslation();
  const router = useRouter();
  const jars = useJarStore((s) => s.jars);
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
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text
              className="font-bodyBold text-brand-dark"
              style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' }}
            >
              {t('addTask.kicker')}
            </Text>
            <Text
              className="font-display text-ink"
              style={{ fontSize: 32, lineHeight: 36, letterSpacing: -0.8, marginTop: 2 }}
            >
              {t('addTask.title')}
            </Text>
          </View>
          <IconButton icon="x" onPress={() => router.back()} label={t('common.close')} />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 28 }}>
          {jars.length > 1 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {jars.map((j) => {
                const selected = jarId === j.id;
                return (
                  <Pressable
                    key={j.id}
                    onPress={() => setJarId(j.id)}
                    className={selected ? 'bg-brand border-ink' : 'bg-blush border-ink'}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 999,
                      borderWidth: 2,
                    }}
                  >
                    <Text
                      className={selected ? 'font-bodyBold text-surface-hi' : 'font-bodyBold text-ink'}
                      style={{ fontSize: 13 }}
                    >
                      {j.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View
            className="bg-surface-hi border-ink"
            style={{
              borderRadius: 20,
              borderWidth: 3,
              padding: 18,
              minHeight: 100,
            }}
          >
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder={t('addTask.placeholder')}
              placeholderTextColor="#8A7868"
              accessibilityLabel={t('addTask.inputLabel')}
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
              className="bg-sage border-ink"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 999,
                borderWidth: 2,
                gap: 6,
              }}
            >
              <Image
                source={require('../assets/logo-transparent.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text
                className="font-bodyBold text-surface-hi"
                style={{ fontSize: 14 }}
              >
                {t('addTask.confirmation')}
              </Text>
              <View
                className="bg-surface-hi"
                style={{
                  borderRadius: 10,
                  paddingHorizontal: 7,
                  paddingVertical: 1,
                }}
              >
                <Text
                  className="font-bodyBlack text-sage"
                  style={{ fontSize: 11 }}
                >
                  {activeCount}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          <PrimaryButton onPress={submit} disabled={!text.trim()}>
            {t('addTask.submit')}
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
