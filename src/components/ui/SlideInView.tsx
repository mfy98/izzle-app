import React, { useEffect } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = 'up',
  duration = 400,
  delay = 0,
  style,
}) => {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set initial position based on direction
    const distance = 50;
    switch (direction) {
      case 'up':
        translateY.setValue(distance);
        break;
      case 'down':
        translateY.setValue(-distance);
        break;
      case 'left':
        translateX.setValue(distance);
        break;
      case 'right':
        translateX.setValue(-distance);
        break;
    }

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, translateY, opacity, duration, delay, direction]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateX }, { translateY }],
          opacity,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

