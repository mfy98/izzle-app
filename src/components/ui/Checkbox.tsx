import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, sizes } from '@/constants';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  error?: boolean;
  helperText?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  error,
  helperText,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkboxContainer, error && styles.checkboxError]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked, error && styles.checkboxErrorBorder]}>
          {checked && (
            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
          )}
        </View>
        <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      </TouchableOpacity>
      {helperText && (
        <Text style={[styles.helperText, error && styles.helperTextError]}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: sizes.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sizes.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxError: {
    borderColor: colors.error,
  },
  checkboxErrorBorder: {
    borderColor: colors.error,
  },
  label: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    flex: 1,
  },
  labelError: {
    color: colors.error,
  },
  helperText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginTop: sizes.xs,
    marginLeft: 32,
  },
  helperTextError: {
    color: colors.error,
  },
});





