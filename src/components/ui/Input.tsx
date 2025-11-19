import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { colors, sizes } from '@/constants';

interface InputProps extends Omit<TextInputProps, 'mode'> {
  error?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  helperText,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        error={error}
        outlineColor={error ? colors.error : colors.border}
        activeOutlineColor={error ? colors.error : colors.primary}
        style={[styles.input, style]}
        contentStyle={styles.content}
        {...props}
      />
      {helperText && (
        <TextInput
          editable={false}
          value={helperText}
          error={error}
          style={styles.helperText}
          mode="flat"
          underlineColorAndroid="transparent"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: sizes.md,
  },
  input: {
    backgroundColor: colors.surface,
    fontSize: sizes.fontSize.md,
  },
  content: {
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
  },
  helperText: {
    fontSize: sizes.fontSize.sm,
    marginTop: sizes.xs,
    backgroundColor: 'transparent',
    height: 20,
  },
});

