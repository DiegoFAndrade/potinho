import { View, Text } from 'react-native';

interface Props {
  count: number;
}

/** Rotated sticker-style streak badge. */
export function Streak({ count }: Props) {
  if (count === 0) return null;
  return (
    <View style={{ transform: [{ rotate: '-4deg' }] }}>
      {/* offset shadow */}
      <View
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          right: -3,
          bottom: -3,
          backgroundColor: '#231208',
          borderRadius: 999,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#D9A520',
          paddingVertical: 4,
          paddingHorizontal: 10,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: '#231208',
        }}
      >
        <Text style={{ fontSize: 14 }}>🔥</Text>
        <Text
          className="font-bodyBlack"
          style={{ color: '#231208', marginLeft: 4, fontSize: 14 }}
        >
          {count} {count === 1 ? 'dia' : 'dias'}
        </Text>
      </View>
    </View>
  );
}
