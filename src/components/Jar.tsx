import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, Text } from 'react-native';
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

/** Hand-crafted ceramic pot built with Views. */
function PotIllustration() {
  return (
    <View style={{ alignItems: 'center', width: 180, height: 200 }}>
      {/* Lid / rim */}
      <View
        style={{
          width: 140,
          height: 20,
          backgroundColor: '#D4877A',
          borderRadius: 10,
          borderWidth: 2.5,
          borderColor: '#231208',
          zIndex: 2,
        }}
      />

      {/* Neck (connects rim to body) */}
      <View
        style={{
          width: 100,
          height: 14,
          backgroundColor: '#E8A196',
          borderLeftWidth: 2.5,
          borderRightWidth: 2.5,
          borderColor: '#231208',
          marginTop: -2,
          zIndex: 1,
        }}
      />

      {/* Body — big round belly */}
      <View
        style={{
          width: 160,
          height: 140,
          backgroundColor: '#F0B4A8',
          borderRadius: 80,
          borderBottomLeftRadius: 60,
          borderBottomRightRadius: 60,
          borderTopLeftRadius: 70,
          borderTopRightRadius: 70,
          borderWidth: 2.5,
          borderColor: '#231208',
          marginTop: -6,
          overflow: 'hidden',
        }}
      >
        {/* Highlight / shine on body */}
        <View
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: 40,
            height: 60,
            backgroundColor: '#F8CFC7',
            borderRadius: 20,
            opacity: 0.7,
            transform: [{ rotate: '-12deg' }],
          }}
        />

        {/* Belly stripe accent */}
        <View
          style={{
            position: 'absolute',
            bottom: 40,
            left: 20,
            right: 20,
            height: 3,
            backgroundColor: '#D4877A',
            borderRadius: 2,
          }}
        />
      </View>

      {/* Bottom / base */}
      <View
        style={{
          width: 100,
          height: 14,
          backgroundColor: '#D4877A',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          borderWidth: 2.5,
          borderTopWidth: 0,
          borderColor: '#231208',
          marginTop: -8,
        }}
      />
    </View>
  );
}

/** Small paper slips peeking out of the pot. */
function PaperSlips({ count }: { count: number }) {
  if (count === 0) return null;

  const slips = [
    { rotate: '-18deg', translateX: -22, color: '#FFFBEF', height: 28 },
    { rotate: '10deg', translateX: 8, color: '#FFD5C8', height: 32 },
    { rotate: '-5deg', translateX: 20, color: '#FFFBEF', height: 24 },
  ];

  const visibleCount = Math.min(count, slips.length);

  return (
    <View
      style={{
        position: 'absolute',
        top: -10,
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
            width: 28,
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
          <PotIllustration />
        </View>
      </Animated.View>
    </View>
  );
});
Jar.displayName = 'Jar';
