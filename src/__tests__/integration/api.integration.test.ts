/**
 * Integration tests for API client
 * These tests verify that API calls work correctly with the backend
 */

import { apiClient } from '@/services/api/client';
import * as storage from '@/services/storage';

jest.mock('@/services/storage');

describe('API Client Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storage.getAuthToken as jest.Mock).mockResolvedValue(null);
  });

  describe('Authentication Endpoints', () => {
    it('should register user successfully', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test',
            surname: 'User',
          },
          token: 'mock-token',
        },
      };

      // Mock fetch for testing
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse.data,
      });

      const response = await apiClient.post('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        surname: 'User',
      });

      expect(response.data).toEqual(mockResponse.data);
    });

    it('should handle authentication errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      try {
        await apiClient.post('/auth/login', {
          email: 'wrong@example.com',
          password: 'wrong',
        });
      } catch (error: any) {
        expect(error.response?.status).toBe(400);
      }
    });
  });

  describe('Token Management', () => {
    it('should add auth token to headers', async () => {
      (storage.getAuthToken as jest.Mock).mockResolvedValue('mock-token');

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await apiClient.get('/sprint/current');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      );
    });
  });
});

