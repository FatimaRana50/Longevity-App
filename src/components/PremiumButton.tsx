import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors, fonts, radii, shadow } from '../theme';

export const TERRACOTTA = colors.terracotta;
export const SAGE_DARK = colors.sage;
export const CREAM = colors.cream;

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PremiumButton: React.FC<Props> = ({
  label, onPress, variant = 'primary', disabled, loading, style, textStyle,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  const v = variants[variant];
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        onPressIn={onIn}
        onPressOut={onOut}
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.base,
          v.container,
          variant === 'primary' && shadow.card,
          (disabled || loading) && { opacity: 0.45 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={v.text.color as string} />
        ) : (
          <Text style={[styles.label, v.text, textStyle]}>{label}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  label: { fontSize: 16, fontWeight: '600', letterSpacing: 0.2 },
});

const variants: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: TERRACOTTA },
    text: { color: CREAM, fontFamily: fonts.sans },
  },
  secondary: {
    container: { backgroundColor: SAGE_DARK },
    text: { color: CREAM, fontFamily: fonts.sans },
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: TERRACOTTA },
    text: { color: TERRACOTTA, fontFamily: fonts.sans },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.inkSoft, fontFamily: fonts.sans },
  },
};
