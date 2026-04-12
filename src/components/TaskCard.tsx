import { View, Text } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  text: string;
  onDone: () => void;
  onSkip: () => void;
}

export function TaskCard({ text, onDone, onSkip }: Props) {
  return (
    <View className="bg-paper rounded-3xl p-6 shadow-lg" style={{ elevation: 4 }}>
      <Text className="text-muted text-sm mb-2">Sua tarefa é:</Text>
      <Text className="text-ink text-2xl font-semibold mb-6">{text}</Text>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <PrimaryButton onPress={onDone} testID="task-card-done">
            Concluí!
          </PrimaryButton>
        </View>
        <View className="flex-1">
          <PrimaryButton onPress={onSkip} variant="secondary" testID="task-card-skip">
            Fica pra depois
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}
