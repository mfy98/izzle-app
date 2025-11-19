import { Tabs, Redirect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';

export default function TabLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Role-based tab configuration
  const isAdvertiser = user?.role === UserRole.ADVERTISER;
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      
      {!isAdvertiser && (
        <>
          <Tabs.Screen
            name="watch"
            options={{
              title: 'Reklam İzle',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="play-circle" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="raffle"
            options={{
              title: 'Çekiliş',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="ticket" size={size} color={color} />
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
            }}
          />
          <Tabs.Screen
            name="affiliate"
            options={{
              title: 'Affiliate',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="share-variant" size={size} color={color} />
              ),
            }}
          />
        </>
      )}

      {isAdvertiser && (
        <Tabs.Screen
          name="advertiser-dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" size={size} color={color} />
            ),
          }}
        />
      )}

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="info"
        options={{
          title: 'Bilgi',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="information" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
