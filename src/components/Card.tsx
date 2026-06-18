import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { colors, radii, shadow } from '../theme';

interface Props extends ViewProps {
  accent?: string;          // left border color
  variant?: 'plain' | 'warm';
  style?: ViewStyle;
}

export const Card: React.FC<Props> = ({ children, accent, variant = 'plain', style, ...rest }) => {
  return (
    <View
      {...rest}
      style={[
        styles.card,
        { backgroundColor: variant === 'warm' ? colors.cardWarm : colors.card },
        accent ? { borderLeftWidth: 3, borderLeftColor: accent } : null,
        shadow.soft,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
  },
});
