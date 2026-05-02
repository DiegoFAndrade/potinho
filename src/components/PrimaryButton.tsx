import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

interface Props {
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  compact?: boolean;
  testID?: string;
  accessibilityHint?: string;
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
  compact,
  testID,
  accessibilityHint,
}: Props) {
  const fillClasses = {
    primary: disabled ? 'bg-brand/50' : 'bg-brand',
    secondary: disabled ? 'bg-blush/50' : 'bg-blush',
    ghost: 'bg-transparent',
  };
  const textClasses = {
    primary: 'text-surface-hi',
    secondary: 'text-ink',
    ghost: 'text-ink',
  };
  const shadowOffset = 5;

  return (
    <View style={{ position: 'relative', paddingRight: shadowOffset, paddingBottom: shadowOffset }}>
      {/* offset shadow block */}
      {!disabled && (
        <View
          className="bg-ink"
          style={{
            position: 'absolute',
            top: shadowOffset,
            left: shadowOffset,
            right: 0,
            bottom: 0,
            borderRadius: 22,
          }}
        />
      )}
      <Pressable
        testID={testID}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        accessibilityHint={accessibilityHint}
      >
        {({ pressed }) => (
          <View
            className={`${fillClasses[variant]} border-3 border-ink`}
            style={{
              borderRadius: 22,
              paddingVertical: compact ? 12 : 16,
              paddingHorizontal: compact ? 20 : 24,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                { translateX: pressed && !disabled ? shadowOffset : 0 },
                { translateY: pressed && !disabled ? shadowOffset : 0 },
              ],
            }}
          >
            <Text
              className={`font-bodyBlack ${textClasses[variant]}`}
              style={{
                fontSize: compact ? 16 : 18,
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
