import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

interface Props {
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  testID?: string;
}

export function PrimaryButton({
  onPress,
  children,
  disabled,
  variant = 'primary',
  testID,
}: Props) {
  const base = 'rounded-3xl px-6 py-4 items-center justify-center';
  const primary = disabled ? 'bg-brand/40' : 'bg-brand active:bg-brandDark';
  const secondary = disabled ? 'bg-jar/40' : 'bg-jar active:bg-jar/80';
  const classes = `${base} ${variant === 'primary' ? primary : secondary}`;
  const textClasses =
    variant === 'primary'
      ? 'text-white font-semibold text-lg'
      : 'text-ink font-semibold text-lg';

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      className={classes}
      accessibilityRole="button"
    >
      <View>
        <Text className={textClasses}>{children}</Text>
      </View>
    </Pressable>
  );
}
