import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

export interface JarHandle {
  shake: () => Promise<void>;
}

interface Props {
  taskCount: number;
}

const JAR_IMAGE = require('../../assets/logo.png');

export const Jar = forwardRef<JarHandle, Props>(({ taskCount }, ref) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const resolveRef = useRef<(() => void) | null>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const shake = useCallback(() => {
    return new Promise<void>((resolve) => {
      resolveRef.current = resolve;

      const t = 80; // duration per swing
      const ease = Easing.inOut(Easing.ease);

      // Scale up slightly then shake
      scale.value = withSequence(
        withTiming(1.05, { duration: 150, easing: ease }),
        withDelay(t * 10, withTiming(1, { duration: 200, easing: ease })),
      );

      rotation.value = withSequence(
        withTiming(-8, { duration: t, easing: ease }),
        withTiming(8, { duration: t, easing: ease }),
        withTiming(-8, { duration: t, easing: ease }),
        withTiming(8, { duration: t, easing: ease }),
        withTiming(-6, { duration: t, easing: ease }),
        withTiming(6, { duration: t, easing: ease }),
        withTiming(-4, { duration: t, easing: ease }),
        withTiming(4, { duration: t, easing: ease }),
        withTiming(-2, { duration: t, easing: ease }),
        withTiming(0, { duration: t, easing: ease }),
      );

      // Resolve after full animation (~1s)
      setTimeout(() => {
        resolveRef.current?.();
        resolveRef.current = null;
      }, t * 10 + 200);
    });
  }, [rotation, scale]);

  useImperativeHandle(ref, () => ({ shake }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* decorative asterisks */}
      <Text
        className="font-display"
        style={{
          position: 'absolute',
          top: 10,
          left: -8,
          color: '#D9A520',
          fontSize: 28,
          transform: [{ rotate: '-15deg' }],
        }}
      >
        ✦
      </Text>
      <Text
        className="font-display"
        style={{
          position: 'absolute',
          top: 40,
          right: -4,
          color: '#E8503D',
          fontSize: 20,
          transform: [{ rotate: '12deg' }],
        }}
      >
        ✦
      </Text>
      <Text
        className="font-display"
        style={{
          position: 'absolute',
          bottom: 20,
          left: -12,
          color: '#89A47C',
          fontSize: 24,
          transform: [{ rotate: '8deg' }],
        }}
      >
        ✦
      </Text>

      <Animated.View style={animatedStyle}>
        <Image
          source={JAR_IMAGE}
          style={{ width: 220, height: 220 }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
});
Jar.displayName = 'Jar';
