import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

interface Props { name?: string; size?: number; }

export const Avatar: React.FC<Props> = ({ name = 'You', size = 40 }) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase() ?? '')
    .join('') || 'U';

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.txt, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cream,
  },
  txt: { color: colors.cream, fontFamily: fonts.serif, fontWeight: '600', letterSpacing: 0.5 },
});
