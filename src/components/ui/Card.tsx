import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card as PaperCard, CardProps as PaperCardProps } from 'react-native-paper';
import { colors, sizes } from '@/constants';

interface CardProps extends PaperCardProps {
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = true,
  style,
  children,
  ...props
}) => {
  // Filter out any invalid props that might be passed to DOM elements
  const {
    borderRadiusStyles,
    ...validProps
  } = props as any;

  return (
    <PaperCard
      style={[styles.card, style]}
      contentStyle={padding ? styles.content : undefined}
      {...validProps}
    >
      {children}
    </PaperCard>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  rightAction,
}) => {
  return (
    <PaperCard.Title
      title={title}
      subtitle={subtitle}
      right={rightAction ? () => rightAction : undefined}
      titleStyle={styles.headerTitle}
      subtitleStyle={styles.headerSubtitle}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    marginBottom: sizes.md,
    elevation: 2,
  },
  content: {
    padding: sizes.md,
  },
  headerTitle: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
});

