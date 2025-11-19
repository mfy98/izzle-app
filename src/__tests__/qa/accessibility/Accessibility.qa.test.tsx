/**
 * Accessibility QA Tests
 * Tests for screen reader support, labels, and accessibility features
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TicketCounter } from '@/components/raffle/TicketCounter';

describe('Accessibility Tests', () => {
  describe('Button Accessibility', () => {
    it('should have accessible label', () => {
      const { getByLabelText } = render(
        <Button accessibilityLabel="Login button">Giriş Yap</Button>
      );
      
      expect(getByLabelText('Login button')).toBeTruthy();
    });

    it('should support accessibility role', () => {
      const { getByRole } = render(
        <Button accessibilityRole="button">Test</Button>
      );
      
      expect(getByRole('button')).toBeTruthy();
    });
  });

  describe('Input Accessibility', () => {
    it('should have accessible label', () => {
      const { getByLabelText } = render(
        <Input
          label="Email"
          accessibilityLabel="Email input"
          placeholder="Enter email"
        />
      );
      
      expect(getByLabelText('Email input')).toBeTruthy();
    });
  });

  describe('TicketCounter Accessibility', () => {
    it('should have accessible ticket count', () => {
      const { getByText } = render(
        <TicketCounter tickets={25} multiplier={1.0} adViews={25} />
      );
      
      expect(getByText('25')).toBeTruthy();
      expect(getByText(/Çekiliş Hakları/i)).toBeTruthy();
    });
  });
});

