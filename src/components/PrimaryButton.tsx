import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

interface Props {
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  testID?: string;
}

/**
 * Chunky sticker button with offset shadow.
 * On press, the button visually "sits down" into its shadow.
 */
export function PrimaryButton({
  onPress,
  children,
  disabled,
  variant = 'primary',
  testID,
}: Props) {
  const fills = {
    primary: disabled ? '#F2A292' : '#E8503D',
    secondary: disabled ? '#FFE8DE' : '#FFD5C8',
    ghost: 'transparent',
  };
  const textColors = {
    primary: '#FFFBEF',
    secondary: '#231208',
    ghost: '#231208',
  };

  return (
    <View>
      {/* shadow block */}
      <View
        style={{
          position: 'absolute',
          top: 5,
          left: 5,
          right: -5,
          bottom: -5,
          backgroundColor: disabled ? 'transparent' : '#231208',
          borderRadius: 22,
        }}
      />
      <Pressable
        testID={testID}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        style={({ pressed }) => ({
          backgroundColor: fills[variant],
          borderRadius: 22,
          borderWidth: variant === 'ghost' ? 2 : 3,
          borderColor: '#231208',
          paddingVertical: 16,
          paddingHorizontal: 24,
          transform: [
            { translateX: pressed && !disabled ? 4 : 0 },
            { translateY: pressed && !disabled ? 4 : 0 },
          ],
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Text
          className="font-bodyBlack"
          style={{
            color: textColors[variant],
            fontSize: 18,
            letterSpacing: 0.3,
          }}
        >
          {children}
        </Text>
      </Pressable>
    </View>
  );
}
