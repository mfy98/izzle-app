import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';
import { colors, sizes } from '@/constants';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { user } = useAuthStore();

  if (user?.role !== UserRole.ADMIN) {
    router.replace('/(tabs)/home');
    return null;
  }

  const settingsItems = [
    {
      icon: 'account-group',
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcıları görüntüle ve yönet',
      onPress: () => router.push('/(tabs)/users'),
    },
    {
      icon: 'video',
      title: 'Reklam Yönetimi',
      description: 'Reklamları onayla ve yönet',
      onPress: () => router.push('/(tabs)/ads-management'),
    },
    {
      icon: 'calendar-clock',
      title: 'Reklam Takvimi',
      description: 'Reklam programını yönet',
      onPress: () => router.push('/(tabs)/admin-panel'),
    },
    {
      icon: 'chart-box',
      title: 'Sistem İstatistikleri',
      description: 'Genel sistem metrikleri',
      onPress: () => {
        // TODO: Navigate to system stats
      },
    },
    {
      icon: 'cog',
      title: 'Sistem Ayarları',
      description: 'Uygulama ayarlarını yönet',
      onPress: () => {
        // TODO: Navigate to system settings
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Ayarlar</Text>
          <Text style={styles.subtitle}>Sistem yönetimi ve ayarlar</Text>
        </View>

        {settingsItems.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress}>
            <Card style={styles.settingCard}>
              <View style={styles.settingContent}>
                <MaterialCommunityIcons name={item.icon as any} size={24} color={colors.primary} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDescription}>{item.description}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={colors.textSecondary}
                />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: sizes.md,
  },
  header: {
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  subtitle: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  settingCard: {
    marginBottom: sizes.sm,
    padding: sizes.md,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: sizes.sm,
  },
  settingTitle: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
});


