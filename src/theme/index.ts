import { Platform } from 'react-native';

export const colors = {
  // Brand / Premium Accents
  primary: '#3C4A3E',               // Swapped terracotta for a luxurious, deep charcoal-olive
  secondary: '#546342',             // Your elegant olive tone
  secondaryLight: '#E8F0DC',        // Subtle linen olive for muted badges and indicators
  accent: '#887369',                // Muted neutral tone for crisp dividers and fine borders

  // Backgrounds & Structural Surfaces
  background: '#FDF9F2',            // Your pristine premium warm off-white
  surfaceContainer: '#F1EDE6',      // Soft cream layer
  surfaceContainerHigh: '#EBE8E1',  // Mid-tone off-white
  surfaceContainerHighest: '#E6E2DB', // Deepest surface off-white
  surfaceElevated: '#FFFFFF',       // Crisp white for structural grid alignment

  // Premium Monochromatic Typography
  textPrimary: '#1C1C18',           // Your rich warm charcoal text (never pure black)
  textSecondary: '#4A4E46',         // Shifted from brown to a muted olive-slate grey
  textMuted: '#887369',             // Soft limestone grey for fine metadata and labels

  // Balanced Container States
  secondaryContainer: '#D8E9BE',    // Warm olive backdrop
  onSecondaryContainer: '#5A6948',  // Your readable dark olive for badge text

  // UI Micro Borders
  outlineVariant: '#E3E5E0',        // Replaced pinkish tint with an ultra-thin whisper gray
  outline: '#887369',               // Structured accent boundaries

  white: '#FFFFFF',                 // Clear canvas

  // Kept for backward compatibility and references
  backgroundDark: '#1A1914',        //
  borderDark: '#3A3728',            //
  cardDark: '#252318',              //
  badge: '#3D5C2E',                 //

  // Maintained Aliases to keep existing screens functional
  card: '#F1EDE6',                  //
  cardTinted: '#E8F0DC',            //
  border: '#E3E5E0',                // Clean micro-border
  borderLight: '#EDE8E1',           //
  textLight: '#FDF9F2',             //
  textLightMuted: '#B8C4A8',        //
};

export const fonts = {
  serif: Platform.OS === 'ios' ? 'New York' : 'serif', // Changed to Apple's premium editorial serif font
  sans: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
};