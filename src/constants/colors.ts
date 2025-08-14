export const Colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryDark: '#3634A3',
  secondaryLight: '#7A79E0',
  
  // Status colors
  success: '#34C759',
  successDark: '#28A745',
  successLight: '#5CDB7E',
  
  warning: '#FF9500',
  warningDark: '#E6850E',
  warningLight: '#FFB340',
  
  error: '#FF3B30',
  errorDark: '#DC3545',
  errorLight: '#FF6B6B',
  
  info: '#5AC8FA',
  infoDark: '#17A2B8',
  infoLight: '#7DD3FC',
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#F2F2F7',
  card: '#FFFFFF',
  border: '#C6C6C8',
  divider: '#E5E5EA',
  
  // Text colors
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textInverse: '#FFFFFF',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Special colors
  shadow: '#000000',
  transparent: 'transparent',
  ripple: 'rgba(0, 0, 0, 0.1)',
  
  // Group colors
  groupFamily: '#FF6B6B',
  groupWork: '#4ECDC4',
  groupFriends: '#45B7D1',
  groupOther: '#96CEB4',
  
  // Dark theme colors
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    card: '#1C1C1E',
    border: '#38383A',
    divider: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',
  }
};

export const getThemeColors = (isDark: boolean) => {
  return isDark ? { ...Colors, ...Colors.dark } : Colors;
};