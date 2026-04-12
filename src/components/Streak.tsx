import { View, Text } from 'react-native';

interface Props {
  count: number;
}

export function Streak({ count }: Props) {
  if (count === 0) return null;
  return (
    <View className="flex-row items-center bg-brand/10 px-3 py-1 rounded-full">
      <Text className="text-base">🔥</Text>
      <Text className="text-ink font-semibold ml-1">{count}</Text>
    </View>
  );
}
