import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';
import { colors, sizes } from '@/constants';

// Custom center tab button component with circular border
const CenterTabButton = ({ color, focused }: { color: string; focused: boolean }) => {
  return (
    <View style={styles.centerTabContainer}>
      <View style={styles.centerTabCircle}>
        <View style={[styles.centerTab, focused && styles.centerTabActive]}>
          <MaterialCommunityIcons
            name={focused ? 'play-circle' : 'play-circle-outline'}
            size={32}
            color={focused ? '#FFFFFF' : color}
          />
        </View>
      </View>
    </View>
  );
};

export default function TabLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Role-based tab configuration
  const isAdvertiser = user?.role === UserRole.ADVERTISER;
  const isAdmin = user?.role === UserRole.ADMIN;

  // Custom tab button wrapper to ensure full width
  const CustomTabButton = (props: any) => {
    return (
      <TouchableOpacity
        onPress={props.onPress || undefined}
        onLongPress={props.onLongPress || undefined}
        disabled={props.disabled || false}
        accessibilityRole={props.accessibilityRole}
        accessibilityState={props.accessibilityState}
        style={[
          {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            minWidth: 0,
            flexBasis: 0,
            paddingTop: 4,
          },
          props.style,
        ]}
        activeOpacity={0.7}
      >
        {props.children}
      </TouchableOpacity>
    );
  };

  // Common tab bar options
  const commonTabBarOptions = {
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: '#6B7280',
    headerShown: false,
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      height: 60,
      paddingBottom: 4,
      paddingTop: 6,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      alignSelf: 'stretch' as const,
    },
    tabBarItemStyle: {
      flex: 1,
      justifyContent: 'flex-start' as const,
      alignItems: 'center' as const,
      minWidth: 0,
      flexBasis: 0,
      paddingTop: 4,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '500' as const,
      marginTop: 2,
      marginBottom: 0,
    },
    tabBarIconStyle: {
      marginTop: 0,
      marginBottom: 0,
    },
  };

  // USER TABS: Ana Sayfa | Çekiliş | Reklam İzle (ortada, geniş) | İndirimler | Profil
  if (!isAdvertiser && !isAdmin) {
    return (
      <Tabs screenOptions={commonTabBarOptions}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
            tabBarButton: (props) => <CustomTabButton {...props} />,
          }}
        />
        <Tabs.Screen
          name="raffle"
          options={{
            title: 'Çekiliş',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="ticket" size={size} color={color} />
            ),
            tabBarButton: (props) => <CustomTabButton {...props} />,
          }}
        />
        <Tabs.Screen
          name="center-action"
          options={{
            title: 'Reklam İzle',
            tabBarIcon: ({ color, focused }) => <CenterTabButton color={color} focused={focused} />,
            tabBarLabel: '', // Label'ı kaldır, sadece icon
            tabBarButton: (props) => (
              <TouchableOpacity
                onPress={props.onPress || undefined}
                onLongPress={props.onLongPress || undefined}
                disabled={props.disabled || false}
                accessibilityRole={props.accessibilityRole}
                accessibilityState={props.accessibilityState}
                style={[
                  {
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: 0, // Ortadaki tab için daha yukarıda
                  },
                  props.style,
                ]}
                activeOpacity={0.7}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="coupons"
          options={{
            title: 'İndirimler',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="tag" size={size} color={color} />
            ),
            tabBarButton: (props) => <CustomTabButton {...props} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
            tabBarButton: (props) => <CustomTabButton {...props} />,
          }}
        />
        {/* Hidden screens - completely remove from tab bar */}
        <Tabs.Screen name="watch" options={{ href: null }} />
        <Tabs.Screen name="affiliate" options={{ href: null }} />
        <Tabs.Screen name="info" options={{ href: null }} />
        <Tabs.Screen name="admin-panel" options={{ href: null }} />
        <Tabs.Screen name="users" options={{ href: null }} />
        <Tabs.Screen name="ads-management" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="advertiser-dashboard" options={{ href: null }} />
        <Tabs.Screen name="advertiser-ads" options={{ href: null }} />
        <Tabs.Screen name="advertiser-auction" options={{ href: null }} />
      </Tabs>
    );
  }

  // ADVERTISER TABS: Ana Sayfa | Dashboard | Analytics (ortada, geniş) | Reklamlar | Profil
  if (isAdvertiser) {
    return (
      <Tabs screenOptions={commonTabBarOptions}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="advertiser-dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="center-action"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.centerTabContainer}>
                <View style={styles.centerTabCircle}>
                  <View style={[styles.centerTab, focused && styles.centerTabActive]}>
                    <MaterialCommunityIcons
                      name={focused ? 'chart-line' : 'chart-line-variant'}
                      size={32}
                      color={focused ? '#FFFFFF' : color}
                    />
                  </View>
                </View>
              </View>
            ),
            tabBarLabel: '',
            tabBarButton: (props) => (
              <TouchableOpacity
                onPress={props.onPress || undefined}
                onLongPress={props.onLongPress || undefined}
                onPressIn={props.onPressIn || undefined}
                onPressOut={props.onPressOut || undefined}
                disabled={props.disabled || false}
                accessibilityRole={props.accessibilityRole}
                accessibilityState={props.accessibilityState}
                accessibilityLabel={props.accessibilityLabel}
                testID={props.testID}
                style={[
                  {
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: 8,
                  },
                  props.style,
                ]}
                activeOpacity={0.7}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="advertiser-ads"
          options={{
            title: 'Reklamlar',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="video" size={size} color={color} />
            ),
            tabBarButton: (props) => <CustomTabButton {...props} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
            tabBarButton: (props) => <CustomTabButton {...props} />,
          }}
        />
        {/* Hidden screens - completely remove from tab bar */}
        <Tabs.Screen name="watch" options={{ href: null }} />
        <Tabs.Screen name="raffle" options={{ href: null }} />
        <Tabs.Screen name="coupons" options={{ href: null }} />
        <Tabs.Screen name="affiliate" options={{ href: null }} />
        <Tabs.Screen name="info" options={{ href: null }} />
        <Tabs.Screen name="admin-panel" options={{ href: null }} />
        <Tabs.Screen name="users" options={{ href: null }} />
        <Tabs.Screen name="ads-management" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
      </Tabs>
    );
  }

  // ADMIN TABS: Dashboard | Kullanıcılar | Reklamlar (ortada, geniş) | Ayarlar | Profil
  return (
    <Tabs screenOptions={commonTabBarOptions}>
      <Tabs.Screen
        name="admin-panel"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
          tabBarButton: (props) => <CustomTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Kullanıcılar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
          tabBarButton: (props) => <CustomTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="ads-management"
        options={{
          title: 'Reklamlar',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.centerTab, focused && styles.centerTabActive]}>
              <MaterialCommunityIcons
                name={focused ? 'video' : 'video-outline'}
                size={32}
                color={focused ? '#FFFFFF' : color}
              />
            </View>
          ),
          tabBarLabel: '',
          tabBarButton: (props) => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {props.children}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="admin-analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
          tabBarButton: (props) => <CustomTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
          tabBarButton: (props) => <CustomTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
          tabBarButton: (props) => <CustomTabButton {...props} />,
        }}
      />
      {/* Hidden screens - completely remove from tab bar */}
      <Tabs.Screen name="home" options={{ href: null }} />
      <Tabs.Screen name="watch" options={{ href: null }} />
      <Tabs.Screen name="raffle" options={{ href: null }} />
      <Tabs.Screen name="coupons" options={{ href: null }} />
      <Tabs.Screen name="affiliate" options={{ href: null }} />
      <Tabs.Screen name="info" options={{ href: null }} />
      <Tabs.Screen name="center-action" options={{ href: null }} />
        <Tabs.Screen name="advertiser-dashboard" options={{ href: null }} />
        <Tabs.Screen name="advertiser-ads" options={{ href: null }} />
        <Tabs.Screen name="advertiser-sponsorship" options={{ href: null }} />
        <Tabs.Screen name="admin-analytics" options={{ href: null }} />
      </Tabs>
    );
  }

const styles = StyleSheet.create({
  centerTabContainer: {
    position: 'relative',
    top: -24, // Tab bar'ın üstüne çıkması için
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 10,
  },
  centerTabCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  centerTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTabActive: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
});
