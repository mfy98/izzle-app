import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, sizes } from '@/constants';

interface TimeSlotManagerProps {
  selectedTimeSlot: { start: string; end: string } | null;
  onTimeSlotSelect: (slot: { start: string; end: string }) => void;
  selectedDays: number[];
  onDaysSelect: (days: number[]) => void;
}

const DAYS = [
  { value: 0, label: 'Pazar' },
  { value: 1, label: 'Pazartesi' },
  { value: 2, label: 'Salı' },
  { value: 3, label: 'Çarşamba' },
  { value: 4, label: 'Perşembe' },
  { value: 5, label: 'Cuma' },
  { value: 6, label: 'Cumartesi' },
];

const TIME_SLOTS = [
  { start: '08:00', end: '10:00', label: 'Sabah (08:00-10:00)' },
  { start: '10:00', end: '12:00', label: 'Öğle Öncesi (10:00-12:00)' },
  { start: '12:00', end: '14:00', label: 'Öğle (12:00-14:00)' },
  { start: '14:00', end: '16:00', label: 'Öğle Sonrası (14:00-16:00)' },
  { start: '16:00', end: '18:00', label: 'Akşam Öncesi (16:00-18:00)' },
  { start: '18:00', end: '20:00', label: 'Akşam (18:00-20:00)' },
  { start: '20:00', end: '22:00', label: 'Gece (20:00-22:00)' },
];

export const TimeSlotManager: React.FC<TimeSlotManagerProps> = ({
  selectedTimeSlot,
  onTimeSlotSelect,
  selectedDays,
  onDaysSelect,
}) => {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onDaysSelect(selectedDays.filter(d => d !== day));
    } else {
      onDaysSelect([...selectedDays, day]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Day Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Haftanın Günleri</Text>
        <View style={styles.daysContainer}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayButton,
                selectedDays.includes(day.value) && styles.dayButtonSelected,
              ]}
              onPress={() => toggleDay(day.value)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDays.includes(day.value) && styles.dayButtonTextSelected,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Time Slot Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saat Aralığı</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.timeSlotsContainer}>
            {TIME_SLOTS.map((slot) => {
              const isSelected =
                selectedTimeSlot?.start === slot.start &&
                selectedTimeSlot?.end === slot.end;

              return (
                <TouchableOpacity
                  key={`${slot.start}-${slot.end}`}
                  style={[
                    styles.timeSlotButton,
                    isSelected && styles.timeSlotButtonSelected,
                  ]}
                  onPress={() => onTimeSlotSelect({ start: slot.start, end: slot.end })}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      isSelected && styles.timeSlotTextSelected,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Custom Time Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Özel Saat Aralığı</Text>
        <View style={styles.customTimeContainer}>
          <Text style={styles.customTimeLabel}>
            {selectedTimeSlot
              ? `${selectedTimeSlot.start} - ${selectedTimeSlot.end}`
              : 'Saat aralığı seçin'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: sizes.md,
  },
  section: {
    marginBottom: sizes.lg,
  },
  sectionTitle: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sizes.sm,
  },
  dayButton: {
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    fontSize: sizes.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    gap: sizes.sm,
  },
  timeSlotButton: {
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
    alignItems: 'center',
  },
  timeSlotButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: sizes.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  customTimeContainer: {
    padding: sizes.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
  },
  customTimeLabel: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    textAlign: 'center',
  },
});


