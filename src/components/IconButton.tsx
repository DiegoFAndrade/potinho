import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  label: string;
  size?: number;
}

/** Small sticker-style icon button with offset ink shadow. */
export function IconButton({ icon, onPress, label, size = 42 }: Props) {
  const radius = size * 0.33;
  const shadow = 3;

  return (
    <Pressable onPress={onPress} accessibilityLabel={label} hitSlop={10}>
      <View style={{ position: 'relative', paddingRight: shadow, paddingBottom: shadow }}>
        <View
          style={{
            position: 'absolute',
            top: shadow,
            left: shadow,
            right: 0,
            bottom: 0,
            backgroundColor: '#231208',
            borderRadius: radius,
          }}
        />
        <View
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: '#FFFBEF',
            borderWidth: 2.5,
            borderColor: '#231208',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name={icon} size={size * 0.48} color="#231208" />
        </View>
      </View>
    </Pressable>
  );
}
