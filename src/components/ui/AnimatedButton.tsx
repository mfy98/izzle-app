import React, { useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Button, ButtonProps } from './Button';
import { colors } from '@/constants';

interface AnimatedButtonProps extends ButtonProps {
  scaleValue?: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  scaleValue = 0.95,
  onPress,
  style,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePress = (e: any) => {
    handlePressOut();
    onPress?.(e);
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Button
        {...props}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      />
    </Animated.View>
  );
};

