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
        // Lottie animation duration is ~2.5s; resolve after that
        setTimeout(resolve, 2500);
      }),
  }));

  return (
    <View className="items-center justify-center">
      <LottieView
        ref={lottieRef}
        source={require('../../assets/lottie/jar-shake.json')}
        style={{ width: 280, height: 280 }}
        loop={false}
        autoPlay={false}
      />
      <Text className="text-muted mt-2">
        {taskCount === 0
          ? 'Vazio — adicione uma tarefa'
          : `${taskCount} ${taskCount === 1 ? 'tarefa' : 'tarefas'}`}
      </Text>
    </View>
  );
});
Jar.displayName = 'Jar';
