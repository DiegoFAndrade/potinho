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

const POT_IMAGE = require('../../assets/logo-transparent.png');

/** Small paper slips peeking out of the pot. */
function PaperSlips({ count }: { count: number }) {
  if (count === 0) return null;

  const slips = [
    { rotate: '-18deg', translateX: -24, color: '#FFFBEF', height: 30 },
    { rotate: '10deg', translateX: 6, color: '#FFD5C8', height: 34 },
    { rotate: '-5deg', translateX: 24, color: '#FFFBEF', height: 26 },
  ];

  const visibleCount = Math.min(count, slips.length);

  return (
    <View
      style={{
        position: 'absolute',
        top: 8,
        left: 0,
        right: 0,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        zIndex: 3,
      }}
    >
      {slips.slice(0, visibleCount).map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: 30,
            height: s.height,
            backgroundColor: s.color,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: '#231208',
            transform: [
              { rotate: s.rotate },
              { translateX: s.translateX },
              { translateY: -s.height / 2 },
            ],
          }}
        />
      ))}
    </View>
  );
}

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

      const t = 80;
      const ease = Easing.inOut(Easing.ease);

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
          top: 0,
          left: -20,
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
          top: 30,
          right: -16,
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
          bottom: 10,
          left: -24,
          color: '#89A47C',
          fontSize: 24,
          transform: [{ rotate: '8deg' }],
        }}
      >
        ✦
      </Text>

      <Animated.View style={animatedStyle}>
        <View style={{ position: 'relative' }}>
          <PaperSlips count={taskCount} />
          <Image
            source={POT_IMAGE}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </View>
  );
});
Jar.displayName = 'Jar';
