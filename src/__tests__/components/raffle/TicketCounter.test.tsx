import React from 'react';
import { render } from '@testing-library/react-native';
import { TicketCounter } from '@/components/raffle/TicketCounter';

describe('TicketCounter Component', () => {
  it('should render ticket count correctly', () => {
    const { getByText } = render(
      <TicketCounter tickets={25} multiplier={1.0} adViews={25} />
    );
    
    expect(getByText('25')).toBeTruthy();
  });

  it('should display multiplier correctly', () => {
    const { getByText } = render(
      <TicketCounter tickets={10} multiplier={1.25} adViews={8} />
    );
    
    expect(getByText(/1,25/)).toBeTruthy();
  });

  it('should calculate displayed tickets based on multiplier', () => {
    const { getByText } = render(
      <TicketCounter tickets={10} multiplier={1.5} adViews={8} />
    );
    
    // 8 views * 1.5 multiplier = 12 (displayed as calculated)
    expect(getByText('12')).toBeTruthy();
  });

  it('should display ad views count', () => {
    const { getByText } = render(
      <TicketCounter tickets={10} multiplier={1.0} adViews={15} />
    );
    
    expect(getByText('15')).toBeTruthy();
  });
});

