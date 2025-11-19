import { renderHook, act } from '@testing-library/react-native';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Alert } from 'react-native';

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useErrorHandler Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle error with alert', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError(new Error('Test error'));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Hata',
      'Test error',
      [{ text: 'Tamam' }]
    );
  });

  it('should handle string error', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleError('String error');
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Hata',
      'String error',
      [{ text: 'Tamam' }]
    );
  });

  it('should handle async errors', async () => {
    const { result } = renderHook(() => useErrorHandler());
    
    const asyncFn = jest.fn().mockRejectedValue(new Error('Async error'));
    
    const response = await act(async () => {
      return await result.current.handleAsyncError(asyncFn);
    });

    expect(response).toBeNull();
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('should return result for successful async function', async () => {
    const { result } = renderHook(() => useErrorHandler());
    
    const asyncFn = jest.fn().mockResolvedValue('Success');
    
    const response = await act(async () => {
      return await result.current.handleAsyncError(asyncFn);
    });

    expect(response).toBe('Success');
  });
});

