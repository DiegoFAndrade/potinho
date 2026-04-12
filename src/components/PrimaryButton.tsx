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
 * Chunky sticker button with offset ink shadow.
 * Visual rendered in a plain View child so Pressable's native styling doesn't
 * interfere with z-ordering on Android.
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
  const shadowOffset = 5;

  return (
    <View style={{ position: 'relative', paddingRight: shadowOffset, paddingBottom: shadowOffset }}>
      {/* offset shadow block */}
      {!disabled && (
        <View
          style={{
            position: 'absolute',
            top: shadowOffset,
            left: shadowOffset,
            right: 0,
            bottom: 0,
            backgroundColor: '#231208',
            borderRadius: 22,
          }}
        />
      )}
      <Pressable
        testID={testID}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
      >
        {({ pressed }) => (
          <View
            style={{
              backgroundColor: fills[variant],
              borderRadius: 22,
              borderWidth: 3,
              borderColor: '#231208',
              paddingVertical: 16,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                { translateX: pressed && !disabled ? shadowOffset : 0 },
                { translateY: pressed && !disabled ? shadowOffset : 0 },
              ],
            }}
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
          </View>
        )}
      </Pressable>
    </View>
  );
}
