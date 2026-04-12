import LottieView from 'lottie-react-native';
import { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text } from 'react-native';

export interface JarHandle {
  shake: () => Promise<void>;
}

interface Props {
  taskCount: number;
}

export const Jar = forwardRef<JarHandle, Props>(({ taskCount }, ref) => {
  const lottieRef = useRef<LottieView>(null);

  useImperativeHandle(ref, () => ({
    shake: () =>
      new Promise((resolve) => {
        lottieRef.current?.reset();
        lottieRef.current?.play();
        setTimeout(resolve, 2500);
      }),
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* decorative asterisks around the jar */}
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
          bottom: 40,
          left: -12,
          color: '#89A47C',
          fontSize: 24,
          transform: [{ rotate: '8deg' }],
        }}
      >
        ✦
      </Text>

      <LottieView
        ref={lottieRef}
        source={require('../../assets/lottie/jar-shake.json')}
        style={{ width: 280, height: 280 }}
        loop={false}
        autoPlay={false}
      />

      {/* Task count is shown by Home screen below the jar so we skip it here */}
      {taskCount === 0 && null}
    </View>
  );
});
Jar.displayName = 'Jar';
