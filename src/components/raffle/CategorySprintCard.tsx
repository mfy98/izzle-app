import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCategoryTheme } from '@/utils/categoryThemes';
import { formatCountdown, getDayName } from '@/utils/formatting';
import { Sprint, SprintStatus } from '@/types/sprint';
import { SprintReminderButton } from './SprintReminderButton';

interface CategorySprintCardProps {
  sprint: Sprint;
  onPress?: () => void;
}

export const CategorySprintCard: React.FC<CategorySprintCardProps> = ({ sprint, onPress }) => {
  const theme = getCategoryTheme(sprint.category || 'Teknoloji');
  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const isUpcoming = sprint.status === SprintStatus.UPCOMING;
  const timeRemaining = isUpcoming
    ? startDate.getTime() - now.getTime()
    : endDate.getTime() - now.getTime();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={theme.icon as any} size={32} color="#FFFFFF" />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryLabel}>Kategori</Text>
              <Text style={styles.categoryName}>{sprint.category || 'Genel'}</Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>
              {isUpcoming ? 'Başlangıç' : 'Kalan Süre'}
            </Text>
            <Text style={styles.timerValue}>
              {timeRemaining > 0 ? formatCountdown(timeRemaining) : '--:--'}
            </Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="calendar" size={16} color="#FFFFFF" />
              <Text style={styles.detailText}>{getDayName(sprint.dayOfWeek)}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="clock" size={16} color="#FFFFFF" />
              <Text style={styles.detailText}>
                {sprint.startTime} - {sprint.endTime}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="account-group" size={16} color="#FFFFFF" />
              <Text style={styles.detailText}>{sprint.totalParticipants} katılımcı</Text>
            </View>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {isUpcoming ? 'Yaklaşan Sprint' : 'Aktif Sprint'}
            </Text>
          </View>

          {isUpcoming && (
            <View style={styles.reminderContainer}>
              <SprintReminderButton sprint={sprint} />
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    marginVertical: 8,
  },
  timerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reminderContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
});

