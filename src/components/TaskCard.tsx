import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  text: string;
  accepted: boolean;
  onAccept: () => void;
  onDone: () => void;
  onSkip: () => void;
}

export function TaskCard({ text, accepted, onAccept, onDone, onSkip }: Props) {
  const { t } = useTranslation();
  if (accepted) {
    // "Doing" mode — compact banner with "Concluí!" button
    return (
      <View accessibilityLabel={t('taskCard.doingLabel', { text })}>
        <View
          className="bg-ink"
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            right: -5,
            bottom: -5,
            borderRadius: 22,
          }}
        />
        <View
          className="bg-accent border-3 border-ink"
          style={{
            borderRadius: 22,
            padding: 18,
          }}
        >
          <Text
            className="font-bodyBold text-ink"
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {t('taskCard.doingNow')}
          </Text>
          <Text
            className="font-display text-ink"
            style={{
              fontSize: 24,
              lineHeight: 28,
              marginBottom: 14,
            }}
          >
            {text}
          </Text>
          <View style={{ gap: 8 }}>
            <PrimaryButton onPress={onDone} compact>
              {t('taskCard.finish')}
            </PrimaryButton>
            <PrimaryButton onPress={onSkip} variant="secondary" compact>
              {t('taskCard.giveUp')}
            </PrimaryButton>
          </View>
        </View>
      </View>
    );
  }

  // "Just drawn" mode — full card with "Fazer" / "Depois"
  return (
    <View accessibilityLabel={t('taskCard.drawnLabel', { text })}>
      <View
        className="bg-ink"
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          right: -6,
          bottom: -6,
          borderRadius: 24,
        }}
      />
      <View
        className="bg-surface-hi border-3 border-ink"
        style={{
          borderRadius: 24,
          padding: 22,
        }}
      >
        {/* washi tape corner accent */}
        <View
          className="bg-accent border-2 border-ink"
          style={{
            position: 'absolute',
            top: -12,
            right: 32,
            width: 56,
            height: 22,
            transform: [{ rotate: '-6deg' }],
          }}
        />

        <Text
          className="font-bodyBold text-brand-dark"
          style={{
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {t('taskCard.yourTask')}
        </Text>

        <Text
          className="font-display text-ink"
          style={{
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
              {t('taskCard.doIt')}
            </PrimaryButton>
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={onSkip} variant="secondary" testID="task-card-skip">
              {t('taskCard.later')}
            </PrimaryButton>
          </View>
        </View>
      </View>
    </View>
  );
}
