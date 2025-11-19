import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATION_STORAGE_KEY = '@cursor_raffle:sprint_reminders';

export interface SprintReminder {
  sprintId: string;
  notificationId: string;
  scheduledTime: string;
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('sprint-reminders', {
        name: 'Sprint Hatırlatıcıları',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedule a sprint reminder notification (15 minutes before sprint starts)
 */
export async function scheduleSprintReminder(
  sprintId: string,
  sprintStartDate: Date,
  sprintCategory?: string
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Calculate notification time (15 minutes before sprint start)
    const notificationTime = new Date(sprintStartDate.getTime() - 15 * 60 * 1000);
    const now = new Date();

    // Don't schedule if notification time is in the past
    if (notificationTime <= now) {
      console.warn('Notification time is in the past');
      return null;
    }

    const categoryText = sprintCategory ? ` (${sprintCategory})` : '';
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚀 Sprint Başlıyor!',
        body: `Sprint${categoryText} 15 dakika sonra başlayacak. Kaçırma!`,
        data: { sprintId, type: 'sprint_reminder' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: notificationTime,
    });

    // Save reminder to storage
    const reminders = await getSprintReminders();
    reminders.push({
      sprintId,
      notificationId,
      scheduledTime: notificationTime.toISOString(),
    });
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(reminders));

    return notificationId;
  } catch (error) {
    console.error('Error scheduling sprint reminder:', error);
    return null;
  }
}

/**
 * Cancel a sprint reminder
 */
export async function cancelSprintReminder(sprintId: string): Promise<boolean> {
  try {
    const reminders = await getSprintReminders();
    const reminder = reminders.find(r => r.sprintId === sprintId);

    if (reminder) {
      await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
      
      const updatedReminders = reminders.filter(r => r.sprintId !== sprintId);
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedReminders));
      
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error canceling sprint reminder:', error);
    return false;
  }
}

/**
 * Get all scheduled sprint reminders
 */
export async function getSprintReminders(): Promise<SprintReminder[]> {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sprint reminders:', error);
    return [];
  }
}

/**
 * Check if a sprint has a reminder scheduled
 */
export async function hasSprintReminder(sprintId: string): Promise<boolean> {
  const reminders = await getSprintReminders();
  return reminders.some(r => r.sprintId === sprintId);
}

/**
 * Cancel all sprint reminders
 */
export async function cancelAllSprintReminders(): Promise<void> {
  try {
    const reminders = await getSprintReminders();
    for (const reminder of reminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
    }
    await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
  } catch (error) {
    console.error('Error canceling all sprint reminders:', error);
  }
}


