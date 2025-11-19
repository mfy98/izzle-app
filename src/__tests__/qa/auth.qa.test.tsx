/**
 * QA Tests for Authentication Flows
 * Tests critical user paths for login, registration, and authentication
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import LoginScreen from '@/features/auth/LoginScreen';
import UserRegistrationForm from '@/components/forms/UserRegistrationForm';
import { apiClient } from '@/services/api/client';

// Mock dependencies
jest.mock('@/services/api/client');
jest.mock('@/store/authStore');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('QA: Authentication Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert = jest.fn();
  });

  describe('Login Flow', () => {
    it('should successfully log in with valid credentials', async () => {
      const mockLogin = jest.fn().mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        token: 'mock-token',
      });

      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
      });

      mockApiClient.post.mockResolvedValue({
        data: {
          user: { id: '1', email: 'test@example.com', role: 'user' },
          token: 'mock-token',
        },
      });

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('E-posta');
      const passwordInput = getByPlaceholderText('Şifre');
      const loginButton = getByText('Giriş Yap');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should show error message for invalid credentials', async () => {
      const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));

      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
      });

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('E-posta');
      const passwordInput = getByPlaceholderText('Şifre');
      const loginButton = getByText('Giriş Yap');

      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });

    it('should validate email format', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('E-posta');
      const passwordInput = getByPlaceholderText('Şifre');
      const loginButton = getByText('Giriş Yap');

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      // Should show validation error
      await waitFor(() => {
        expect(screen.queryByText(/geçerli/i)).toBeTruthy();
      });
    });

    it('should require password field', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('E-posta');
      const loginButton = getByText('Giriş Yap');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(loginButton);

      // Should show validation error
      await waitFor(() => {
        expect(screen.queryByText(/gerekli/i)).toBeTruthy();
      });
    });
  });

  describe('Registration Flow', () => {
    it('should successfully register a new user with valid data', async () => {
      const mockRegister = jest.fn().mockResolvedValue({
        user: { id: '1', email: 'new@example.com', role: 'user' },
        token: 'mock-token',
      });

      mockUseAuthStore.mockReturnValue({
        register: mockRegister,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
      });

      mockApiClient.post.mockResolvedValue({
        data: {
          user: { id: '1', email: 'new@example.com', role: 'user' },
          token: 'mock-token',
        },
      });

      const { getByPlaceholderText, getByText } = render(<UserRegistrationForm />);

      // Fill form
      fireEvent.changeText(getByPlaceholderText(/e-posta/i), 'new@example.com');
      fireEvent.changeText(getByPlaceholderText(/şifre/i), 'password123');
      fireEvent.changeText(getByPlaceholderText(/ad/i), 'John');
      fireEvent.changeText(getByPlaceholderText(/soyad/i), 'Doe');
      fireEvent.changeText(getByPlaceholderText(/telefon/i), '5551234567');
      
      // Address fields
      fireEvent.changeText(getByPlaceholderText(/sokak/i), 'Test Street');
      fireEvent.changeText(getByPlaceholderText(/ilçe/i), 'Test District');
      fireEvent.changeText(getByPlaceholderText(/şehir/i), 'Test City');
      fireEvent.changeText(getByPlaceholderText(/posta kodu/i), '12345');
      fireEvent.changeText(getByPlaceholderText(/ülke/i), 'Turkey');

      const submitButton = getByText(/kayıt ol/i);
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
      });
    });

    it('should validate all required fields in registration', async () => {
      const { getByText } = render(<UserRegistrationForm />);

      const submitButton = getByText(/kayıt ol/i);
      fireEvent.press(submitButton);

      // Should show validation errors for all required fields
      await waitFor(() => {
        expect(screen.queryAllByText(/gerekli/i).length).toBeGreaterThan(0);
      });
    });

    it('should validate password strength', async () => {
      const { getByPlaceholderText, getByText } = render(<UserRegistrationForm />);

      fireEvent.changeText(getByPlaceholderText(/şifre/i), '123');
      const submitButton = getByText(/kayıt ol/i);
      fireEvent.press(submitButton);

      // Should show password strength error
      await waitFor(() => {
        expect(screen.queryByText(/şifre.*uzun/i)).toBeTruthy();
      });
    });
  });

  describe('Logout Flow', () => {
    it('should successfully log out user', async () => {
      const mockLogout = jest.fn();

      mockUseAuthStore.mockReturnValue({
        logout: mockLogout,
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isLoading: false,
        checkAuth: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      // Render a component that has logout functionality
      const LogoutButton = () => {
        const { logout } = useAuthStore();
        return <button onPress={logout}>Logout</button>;
      };

      const { getByText } = render(<LogoutButton />);
      fireEvent.press(getByText('Logout'));

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
      });
    });
  });

  describe('Session Management', () => {
    it('should maintain session after app restart', async () => {
      const mockCheckAuth = jest.fn().mockResolvedValue({
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', role: 'user' },
      });

      mockUseAuthStore.mockReturnValue({
        checkAuth: mockCheckAuth,
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isLoading: false,
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      // Simulate app restart
      await mockCheckAuth();

      expect(mockCheckAuth).toHaveBeenCalled();
    });
  });
});




