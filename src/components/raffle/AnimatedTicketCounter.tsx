import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { TicketCounter } from './TicketCounter';
import { TicketCounterProps } from './TicketCounter';

export const AnimatedTicketCounter: React.FC<TicketCounterProps> = (props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const previousTickets = useRef(props.tickets);

  useEffect(() => {
    if (props.tickets !== previousTickets.current) {
      // Animate when tickets change
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      previousTickets.current = props.tickets;
    }
  }, [props.tickets, scaleAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TicketCounter {...props} />
    </Animated.View>
  );
};

