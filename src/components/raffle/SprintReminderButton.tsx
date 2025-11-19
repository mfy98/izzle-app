import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Sprint } from '@/types/sprint';
import { colors, sizes } from '@/constants';
import {
  scheduleSprintReminder,
  cancelSprintReminder,
  hasSprintReminder,
} from '@/services/notifications';

interface SprintReminderButtonProps {
  sprint: Sprint;
}

export const SprintReminderButton: React.FC<SprintReminderButtonProps> = ({ sprint }) => {
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkReminderStatus();
  }, [sprint.id]);

  const checkReminderStatus = async () => {
    try {
      const hasReminder = await hasSprintReminder(sprint.id);
      setIsReminderSet(hasReminder);
    } catch (error) {
      console.error('Error checking reminder status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleReminder = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const startDate = new Date(sprint.startDate);

      if (isReminderSet) {
        // Cancel reminder
        const canceled = await cancelSprintReminder(sprint.id);
        if (canceled) {
          setIsReminderSet(false);
          Alert.alert('Başarılı', 'Hatırlatıcı iptal edildi.');
        }
      } else {
        // Schedule reminder
        const notificationId = await scheduleSprintReminder(
          sprint.id,
          startDate,
          sprint.category
        );

        if (notificationId) {
          setIsReminderSet(true);
          Alert.alert(
            'Hatırlatıcı Ayarlandı',
            'Sprint başlamadan 15 dakika önce bildirim alacaksınız.'
          );
        } else {
          Alert.alert(
            'Hata',
            'Hatırlatıcı ayarlanamadı. Lütfen bildirim izinlerini kontrol edin.'
          );
        }
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, isReminderSet && styles.buttonActive]}
      onPress={handleToggleReminder}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={isReminderSet ? 'bell' : 'bell-outline'}
        size={20}
        color={isReminderSet ? '#FFFFFF' : colors.primary}
      />
      <Text style={[styles.buttonText, isReminderSet && styles.buttonTextActive]}>
        {isReminderSet ? 'Hatırlatıcı Aktif' : 'Hatırlatıcı Ayarla'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: sizes.sm,
  },
  loadingText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes.xs,
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    borderRadius: sizes.borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
});


