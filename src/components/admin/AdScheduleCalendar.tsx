import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';

interface AdSchedule {
  id: string;
  advertiserId: string;
  advertiserName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
}

interface AdScheduleCalendarProps {
  schedules: AdSchedule[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export const AdScheduleCalendar: React.FC<AdScheduleCalendarProps> = ({
  schedules,
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getSchedulesForDate = (day: number) => {
    if (day === null) return [];
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayOfWeek = date.getDay();
    
    return schedules.filter(schedule => {
      const scheduleStart = new Date(schedule.startDate);
      const scheduleEnd = new Date(schedule.endDate);
      
      return (
        schedule.dayOfWeek === dayOfWeek &&
        date >= scheduleStart &&
        date <= scheduleEnd
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
            <Text style={styles.navText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
            <Text style={styles.navText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {DAYS.map((day, index) => (
            <View key={index} style={styles.dayHeader}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            const daySchedules = getSchedulesForDate(day);
            const hasSchedules = daySchedules.length > 0;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  isToday(day || 0) && styles.todayCell,
                  isSelected(day || 0) && styles.selectedCell,
                  day === null && styles.emptyCell,
                ]}
                onPress={() => {
                  if (day !== null) {
                    const date = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    );
                    onDateSelect(date);
                  }
                }}
                disabled={day === null}
              >
                {day !== null && (
                  <>
                    <Text
                      style={[
                        styles.dayText,
                        isToday(day) && styles.todayText,
                        isSelected(day) && styles.selectedText,
                      ]}
                    >
                      {day}
                    </Text>
                    {hasSchedules && (
                      <View style={styles.scheduleIndicator}>
                        <View style={styles.scheduleDot} />
                        <Text style={styles.scheduleCount}>{daySchedules.length}</Text>
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Selected Date Schedules */}
      {selectedDate && (
        <Card style={styles.schedulesCard}>
          <Text style={styles.schedulesTitle}>
            {selectedDate.toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <ScrollView style={styles.schedulesList}>
            {getSchedulesForDate(selectedDate.getDate()).map((schedule) => (
              <View key={schedule.id} style={styles.scheduleItem}>
                <View style={styles.scheduleItemHeader}>
                  <Text style={styles.scheduleAdvertiser}>{schedule.advertiserName}</Text>
                  <Text style={styles.scheduleTime}>
                    {schedule.startTime} - {schedule.endTime}
                  </Text>
                </View>
              </View>
            ))}
            {getSchedulesForDate(selectedDate.getDate()).length === 0 && (
              <Text style={styles.noSchedules}>Bu gün için zamanlanmış reklam yok</Text>
            )}
          </ScrollView>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: sizes.md,
  },
  card: {
    marginBottom: sizes.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.md,
    paddingHorizontal: sizes.sm,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: sizes.fontSize.xxl,
    color: colors.primary,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  dayHeaders: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayHeader: {
    flex: 1,
    paddingVertical: sizes.sm,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  emptyCell: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  todayCell: {
    backgroundColor: colors.surfaceVariant,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  todayText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scheduleIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 2,
  },
  scheduleCount: {
    fontSize: 8,
    color: colors.primary,
    fontWeight: 'bold',
  },
  schedulesCard: {
    marginTop: sizes.md,
  },
  schedulesTitle: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.md,
  },
  schedulesList: {
    maxHeight: 200,
  },
  scheduleItem: {
    padding: sizes.sm,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.sm,
    marginBottom: sizes.xs,
  },
  scheduleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleAdvertiser: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  scheduleTime: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  noSchedules: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: sizes.fontSize.md,
    padding: sizes.md,
  },
});


