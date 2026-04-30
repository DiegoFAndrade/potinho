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
        className="bg-ink"
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          right: -3,
          bottom: -3,
          borderRadius: 999,
        }}
      />
      <View
        className="bg-accent border-2 border-ink"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 4,
          paddingHorizontal: 10,
          borderRadius: 999,
        }}
      >
        <Text style={{ fontSize: 14 }}>🔥</Text>
        <Text
          className="font-bodyBlack text-ink"
          style={{ marginLeft: 4, fontSize: 14 }}
        >
          {count} {count === 1 ? 'dia' : 'dias'}
        </Text>
      </View>
    </View>
  );
}
