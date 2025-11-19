import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, sizes } from '@/constants';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = sizes.borderRadius.sm,
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 3 }) => {
  return (
    <View style={styles.card}>
      <SkeletonLoader height={24} borderRadius={sizes.borderRadius.md} />
      <View style={styles.content}>
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonLoader
            key={index}
            height={16}
            style={[
              styles.line,
              index === lines - 1 && { width: '60%' },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surfaceVariant,
  },
  card: {
    backgroundColor: colors.surface,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.lg,
    marginBottom: sizes.md,
  },
  content: {
    marginTop: sizes.md,
    gap: sizes.sm,
  },
  line: {
    marginBottom: sizes.xs,
  },
});

