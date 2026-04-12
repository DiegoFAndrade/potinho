import { Component, type ReactNode } from 'react';
import { Text, View } from 'react-native';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // TODO(Task 33): wire Sentry here
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-cream items-center justify-center p-8">
          <Text className="text-ink text-xl font-semibold mb-2">
            Opa, algo deu errado.
          </Text>
          <Text className="text-muted text-center">
            Reabra o app para tentar de novo.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}
