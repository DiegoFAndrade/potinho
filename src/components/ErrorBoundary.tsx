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
    // Report to Sentry without blocking render
    import('@sentry/react-native')
      .then(({ captureException }) => captureException(error))
      .catch(() => {});
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
