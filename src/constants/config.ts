import { Platform } from 'react-native';
import Constants from 'expo-constants';

// IMPORTANT: API URL Configuration
// Option 1: Use environment variable (recommended for VPS/production)
//   Set EXPO_PUBLIC_API_URL=http://your-vps-ip:8080/api
// Option 2: Use local IP for development
//   Find your IP: Windows: ipconfig | findstr IPv4
//                 Mac/Linux: ifconfig | grep "inet "
// Option 3: Use VPS IP directly (replace with your VPS IP)
const VPS_IP = 'YOUR_VPS_IP_HERE'; // ⚠️ Replace with your VPS IP (e.g., '185.123.45.67')
const LOCAL_IP = '192.168.1.100'; // ⚠️ Your local network IP for development

// Choose which IP to use (VPS for production, LOCAL for development)
const USE_VPS = false; // Set to true to use VPS IP
const HOST_IP = USE_VPS ? VPS_IP : LOCAL_IP;

// Get API URL based on platform and environment
const getApiBaseUrl = (): string => {
  // Check for environment variable first
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    console.log('🌐 Using API URL from environment:', envUrl);
    return envUrl;
  }

  // Check if running in Expo Go (physical device)
  // Expo Go always runs on physical device, so we need IP address
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  const isPhysicalDevice = Constants.isDevice;
  
  // For Expo Go, always use IP address (it's always on physical device)
  // For development builds, check if it's a physical device
  const useIPAddress = isExpoGo || (isPhysicalDevice && Platform.OS !== 'web');

  let apiUrl: string;
  
  if (Platform.OS === 'android') {
    // Android Emulator uses 10.0.2.2 to access host machine's localhost
    // For Expo Go or physical device, use IP address (VPS or local)
    apiUrl = useIPAddress ? `http://${HOST_IP}:8080/api` : 'http://10.0.2.2:8080/api';
  } else if (Platform.OS === 'ios') {
    // iOS Simulator can use localhost, but Expo Go on physical device needs IP
    // Use VPS IP if configured, otherwise use local IP
    apiUrl = useIPAddress ? `http://${HOST_IP}:8080/api` : 'http://localhost:8080/api';
  } else {
    // Web or other platforms
    apiUrl = 'http://localhost:8080/api';
  }
  
  // If using VPS, prefer HTTPS if available
  if (USE_VPS && apiUrl.startsWith('http://')) {
    // You can change to https:// if you set up SSL on VPS
    // apiUrl = apiUrl.replace('http://', 'https://');
  }

  // Debug logging
  console.log('🌐 API Configuration:', {
    platform: Platform.OS,
    isExpoGo,
    isPhysicalDevice,
    useIPAddress,
    apiUrl,
    hostIP: HOST_IP,
  });

  return apiUrl;
};

export const config = {
  // API
  apiBaseUrl: getApiBaseUrl(),
  apiTimeout: 30000,
  
  // Sprint configuration
  sprintDuration: 60, // minutes
  raffleAnnouncementDelay: 15, // minutes after sprint ends
  
  // Raffle multipliers
  defaultMultiplier: 1.0,
  winnerMultiplier: 0.25,
  loserMultiplierIncrease: 0.1,
  
  // Ad viewing
  minAdViewDuration: 15, // seconds - minimum time to count as viewed
  maxAdViewsPerSprint: 100, // prevent abuse
  
  // Thresholds
  raffleThresholds: [
    { views: 1000, description: 'Basic Prize' },
    { views: 5000, description: 'Medium Prize' },
    { views: 10000, description: 'Premium Prize' },
    { views: 50000, description: 'Mega Prize' },
  ],
  
  // App info
  appName: 'Cursor Raffle',
  appVersion: '1.0.0',
  
  // Storage keys
  storageKeys: {
    authToken: '@cursor_raffle:auth_token',
    refreshToken: '@cursor_raffle:refresh_token',
    user: '@cursor_raffle:user',
    onboarding: '@cursor_raffle:onboarding_complete',
  },
};

