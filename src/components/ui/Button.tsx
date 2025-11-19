import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { colors, sizes } from '@/constants';

interface ButtonProps extends Omit<PaperButtonProps, 'mode'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  style,
  ...props
}) => {
  const getMode = () => {
    switch (variant) {
      case 'secondary':
        return 'contained';
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  const getButtonColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  return (
    <PaperButton
      mode={getMode()}
      buttonColor={variant === 'primary' || variant === 'secondary' ? getButtonColor() : undefined}
      textColor={
        variant === 'primary' || variant === 'secondary'
          ? '#FFFFFF'
          : variant === 'outlined'
          ? getButtonColor()
          : colors.text
      }
      disabled={disabled || loading}
      loading={loading}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        style,
      ]}
      labelStyle={styles.label}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: sizes.borderRadius.md,
    minHeight: sizes.buttonHeight.md,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    paddingVertical: sizes.sm,
  },
});

