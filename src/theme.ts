import { Platform } from 'react-native';

export const colors = {
  // Brand
  terracotta: '#C4654A',
  terracottaSoft: '#E08A6F',
  sage: '#546342',
  sageSoft: '#7A8B66',
  cream: '#FDF9F2',
  card: '#FFFDF7',
  cardWarm: '#FAF4E8',

  // Ink
  ink: '#2B2B2B',
  inkSoft: '#6B6B6B',
  inkMuted: '#9A958B',

  // Lines
  hairline: '#E6DFD1',
  hairlineSoft: '#F0E9DB',

  // Status
  success: '#7A8B66',
  warning: '#D89B5C',
  danger: '#B85C3C',

  // Aliases used by legacy code
  background: '#FDF9F2',
  surface: '#FFFDF7',
  primary: '#C4654A',
  secondary: '#546342',
  text: '#2B2B2B',
  textMuted: '#9A958B',
  textSoft: '#6B6B6B',
  border: '#E6DFD1',
  white: '#FFFFFF',

  // Extended compatibility with old theme
  surfaceContainer: '#F1EDE6',
  surfaceContainerHigh: '#EBE8E1',
  surfaceContainerHighest: '#E6E2DB',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#2B2B2B',
  textSecondary: '#6B6B6B',
  outlineVariant: '#E3E5E0',
  outline: '#9A958B',
  secondaryLight: '#E8F0DC',
  cardTinted: '#E8F0DC',
  borderLight: '#EDE8E1',
  textLight: '#FDF9F2',
  textLightMuted: '#B8C4A8',
};

export const fonts = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  sans: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};

export const radii = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32, '4xl': 40 };

export const shadow = {
  card: {
    shadowColor: '#2B2B2B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  soft: {
    shadowColor: '#2B2B2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
};
