/**
 * E2E QA Tests for Authentication Flow
 * Tests complete user flows from registration to login
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { UserRegistrationForm } from '@/components/forms/UserRegistrationForm';
import { LoginScreen } from '@/features/auth/LoginScreen';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');
jest.mock('expo-router');

describe('Auth Flow E2E Tests', () => {
  const mockRegister = jest.fn().mockResolvedValue({ success: true, data: {} });
  const mockLogin = jest.fn().mockResolvedValue({ success: true, data: {} });

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      loginUser: mockLogin,
    });
  });

  describe('Registration Flow', () => {
    it('should complete full registration flow', async () => {
      const { getByPlaceholderText, getByText } = render(<UserRegistrationForm />);

      // Fill basic info
      fireEvent.changeText(getByPlaceholderText('ornek@email.com'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('En az 8 karakter'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Adınızı giriniz'), 'John');
      fireEvent.changeText(getByPlaceholderText('Soyadınızı giriniz'), 'Doe');
      fireEvent.changeText(getByPlaceholderText('5551234567'), '5551234567');

      // Continue to address
      const continueButton = getByText(/Adres Bilgilerini Doldur/i);
      fireEvent.press(continueButton);

      await waitFor(() => {
        // Fill address
        fireEvent.changeText(getByPlaceholderText('Mahalle, Sokak, Bina No, Daire No'), 'Test Street 123');
        fireEvent.changeText(getByPlaceholderText('İlçe adını giriniz'), 'Test District');
        fireEvent.changeText(getByPlaceholderText('Şehir adını giriniz'), 'Istanbul');
        fireEvent.changeText(getByPlaceholderText('34000'), '34000');
      });

      // Submit
      const submitButton = getByText(/Kayıt Ol/i);
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
      });
    });

    it('should show validation errors for invalid data', async () => {
      const { getByPlaceholderText, getByText } = render(<UserRegistrationForm />);

      // Try to submit with invalid email
      fireEvent.changeText(getByPlaceholderText('ornek@email.com'), 'invalid-email');
      
      const continueButton = getByText(/Adres Bilgilerini Doldur/i);
      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(screen.getByText(/Geçerli bir e-posta/i)).toBeTruthy();
      });
    });
  });

  describe('Login Flow', () => {
    it('should complete login flow successfully', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      fireEvent.changeText(getByPlaceholderText('ornek@email.com'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Şifrenizi giriniz'), 'password123');

      const loginButton = getByText(/Giriş Yap/i);
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should handle login errors', async () => {
      mockLogin.mockResolvedValueOnce({
        success: false,
        error: 'Invalid credentials',
      });

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      fireEvent.changeText(getByPlaceholderText('ornek@email.com'), 'wrong@example.com');
      fireEvent.changeText(getByPlaceholderText('Şifrenizi giriniz'), 'wrongpassword');

      const loginButton = getByText(/Giriş Yap/i);
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });
});

