import { Platform } from 'react-native';

export const colors = {
  primary: '#C4622D',          // rust CTA
  secondary: '#556B3A',        // olive green
  secondaryLight: '#7A9B5A',   // lighter olive
  secondaryMuted: '#A8C190',   // soft sage

  background: '#F7F4EC',       // warm off-white
  backgroundAlt: '#EEF0E8',    // light olive tint
  card: '#FFFFFF',             // pure white cards
  cardTinted: '#EEF3E8',       // olive-tinted card (selected)

  textPrimary: '#2B3322',      // very dark olive
  textSecondary: '#5A6648',    // medium olive
  textMuted: '#8A9878',        // muted sage
  textLight: '#F7F4EC',        // off-white (for dark surfaces)
  textLightMuted: '#B8C4A8',

  border: '#D8E0CC',           // soft olive border
  borderLight: '#ECF0E4',      // very light border

  white: '#FFFFFF',
  // kept for onboarding consistency
  badge: '#3D5C2E',
  backgroundDark: '#1A1914',
  borderDark: '#3A3728',
  cardDark: '#252318',
};

export const fonts = {
  serif: Platform.OS === 'ios' ? 'Georgia' : 'serif',
};
