import React from 'react';
import {
  Pressable, Text, StyleSheet, ActivityIndicator, View, ViewStyle, TextStyle,
} from 'react-native';

type Variant = 'primary' | 'outline' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const TERRACOTTA = '#C4654A';
const TERRACOTTA_DARK = '#A6512F';
const SAGE_DARK = '#546342';
const CREAM = '#FDF9F2';

export const PremiumButton: React.FC<Props> = ({
  label, onPress, variant = 'primary', disabled, loading, style, textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? CREAM : SAGE_DARK} />
        ) : (
          <Text
            style={[
              styles.label,
              variant === 'primary' && { color: CREAM },
              variant === 'outline' && { color: SAGE_DARK },
              variant === 'ghost' && { color: SAGE_DARK },
              textStyle,
            ]}
          >
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#3a2a18',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inner: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: TERRACOTTA },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.25,
    borderColor: SAGE_DARK,
    shadowOpacity: 0,
    elevation: 0,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.94 },
  disabled: { opacity: 0.45 },
  label: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export { TERRACOTTA, TERRACOTTA_DARK, SAGE_DARK, CREAM };
