import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

/**
 * Copy text to clipboard and show feedback to user
 */
export const copyToClipboard = async (text: string, successMessage?: string): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync(text);
    if (successMessage) {
      Alert.alert('Başarılı', successMessage);
    }
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    Alert.alert('Hata', 'Kopyalama işlemi başarısız oldu');
    return false;
  }
};




