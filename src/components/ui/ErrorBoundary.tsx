import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { colors, sizes } from '@/constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>⚠️</Text>
            </View>

            <Text style={styles.title}>Bir Hata Oluştu</Text>
            <Text style={styles.subtitle}>
              Üzgünüz, beklenmeyen bir hata meydana geldi.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Hata Detayları:</Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorStack}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <Button
              variant="primary"
              onPress={this.handleReset}
              style={styles.button}
            >
              Tekrar Dene
            </Button>

            <TouchableOpacity
              onPress={() => {
                // Optionally reload the app or navigate to home
                this.handleReset();
              }}
            >
              <Text style={styles.linkText}>Ana Sayfaya Dön</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.xl,
  },
  iconContainer: {
    marginBottom: sizes.lg,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: sizes.xl,
    lineHeight: 24,
  },
  errorContainer: {
    width: '100%',
    backgroundColor: colors.surfaceVariant,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    marginBottom: sizes.lg,
    maxHeight: 300,
  },
  errorTitle: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.error,
    marginBottom: sizes.sm,
  },
  errorText: {
    fontSize: sizes.fontSize.xs,
    color: colors.text,
    fontFamily: 'monospace',
    marginBottom: sizes.sm,
  },
  errorStack: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  button: {
    marginBottom: sizes.md,
    minWidth: 200,
  },
  linkText: {
    fontSize: sizes.fontSize.md,
    color: colors.primary,
    fontWeight: '500',
    marginTop: sizes.sm,
  },
});

