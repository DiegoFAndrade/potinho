import { View, Text } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  text: string;
  accepted: boolean;
  onAccept: () => void;
  onDone: () => void;
  onSkip: () => void;
}

export function TaskCard({ text, accepted, onAccept, onDone, onSkip }: Props) {
  if (accepted) {
    // "Doing" mode — compact banner with "Concluí!" button
    return (
      <View>
        <View
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            right: -5,
            bottom: -5,
            backgroundColor: '#231208',
            borderRadius: 22,
          }}
        />
        <View
          style={{
            backgroundColor: '#D9A520',
            borderRadius: 22,
            borderWidth: 3,
            borderColor: '#231208',
            padding: 18,
          }}
        >
          <Text
            className="font-bodyBold"
            style={{
              color: '#231208',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            ✦ Fazendo agora
          </Text>
          <Text
            className="font-display"
            style={{
              color: '#231208',
              fontSize: 24,
              lineHeight: 28,
              marginBottom: 14,
            }}
          >
            {text}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <PrimaryButton onPress={onDone}>
                Concluí! ✦
              </PrimaryButton>
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton onPress={onSkip} variant="ghost">
                Desistir
              </PrimaryButton>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // "Just drawn" mode — full card with "Fazer" / "Depois"
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          right: -6,
          bottom: -6,
          backgroundColor: '#231208',
          borderRadius: 24,
        }}
      />
      <View
        style={{
          backgroundColor: '#FFFBEF',
          borderRadius: 24,
          borderWidth: 3,
          borderColor: '#231208',
          padding: 22,
        }}
      >
        {/* washi tape corner accent */}
        <View
          style={{
            position: 'absolute',
            top: -12,
            right: 32,
            width: 56,
            height: 22,
            backgroundColor: '#D9A520',
            borderWidth: 2,
            borderColor: '#231208',
            transform: [{ rotate: '-6deg' }],
          }}
        />

        <Text
          className="font-bodyBold"
          style={{
            color: '#B8321E',
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          ✦ Sua tarefa é
        </Text>

        <Text
          className="font-display"
          style={{
            color: '#231208',
            fontSize: 28,
            lineHeight: 34,
            marginBottom: 20,
          }}
        >
          {text}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={onAccept} testID="task-card-accept">
              Fazer
            </PrimaryButton>
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={onSkip} variant="secondary" testID="task-card-skip">
              Depois
            </PrimaryButton>
          </View>
        </View>
      </View>
    </View>
  );
}
