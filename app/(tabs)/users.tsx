import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { UserRole } from '@/types/user';
import { colors, sizes } from '@/constants';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export default function UsersScreen() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== UserRole.ADMIN) {
      router.replace('/(tabs)/home');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'shield-crown';
      case UserRole.ADVERTISER:
        return 'briefcase';
      default:
        return 'account';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return '#EF4444';
      case UserRole.ADVERTISER:
        return '#3B82F6';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Kullanıcı Yönetimi</Text>
          <Text style={styles.subtitle}>Tüm kullanıcıları görüntüle ve yönet</Text>
        </View>

        {users.map((userItem) => (
          <Card key={userItem.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <MaterialCommunityIcons
                  name={getRoleIcon(userItem.role)}
                  size={24}
                  color={getRoleColor(userItem.role)}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>
                    {userItem.name} {userItem.surname}
                  </Text>
                  <Text style={styles.userEmail}>{userItem.email}</Text>
                </View>
              </View>
              <View style={styles.userBadges}>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleColor(userItem.role) + '20' },
                  ]}
                >
                  <Text
                    style={[styles.roleText, { color: getRoleColor(userItem.role) }]}
                  >
                    {userItem.role}
                  </Text>
                </View>
                {userItem.isActive ? (
                  <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                ) : (
                  <MaterialCommunityIcons name="close-circle" size={20} color="#EF4444" />
                )}
              </View>
            </View>
          </Card>
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
  userCard: {
    marginBottom: sizes.sm,
    padding: sizes.md,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: sizes.sm,
    flex: 1,
  },
  userName: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
  },
  roleBadge: {
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.radius,
  },
  roleText: {
    fontSize: sizes.fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});


