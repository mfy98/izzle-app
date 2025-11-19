import { useCallback } from 'react';
import { Alert } from 'react-native';

export interface ErrorHandler {
  handleError: (error: Error | string, showAlert?: boolean) => void;
  handleAsyncError: <T>(
    asyncFn: () => Promise<T>,
    showAlert?: boolean
  ) => Promise<T | null>;
}

export const useErrorHandler = (): ErrorHandler => {
  const handleError = useCallback((error: Error | string, showAlert = true) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    console.error('Error handled:', errorMessage, error);

    if (showAlert) {
      Alert.alert(
        'Hata',
        errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    }
  }, []);

  const handleAsyncError = useCallback(
    async <T,>(asyncFn: () => Promise<T>, showAlert = true): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error as Error, showAlert);
        return null;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
  };
};

