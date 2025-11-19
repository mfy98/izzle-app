import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const sizes = {
  // Screen dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Component sizes
  buttonHeight: {
    sm: 32,
    md: 48,
    lg: 56,
  },
  
  inputHeight: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  
  // Icons
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  
  // Layout
  headerHeight: 60,
  tabBarHeight: 80,
  
  // Cards
  cardPadding: 16,
  cardMargin: 16,
};

