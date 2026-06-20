import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, fonts, radii, shadow } from '../theme';

const SPROUT_BOWL = require('../../assets/sprout-bowl.png');

interface Props {
  title?: string;
  subtitle?: string;
}

export const SuggestionCard: React.FC<Props> = ({
  title = 'Every choice you reflect on today builds your longevity.',
  subtitle = 'CHOOSE MINDFULLY. LIVE FULLY.',
}) => {
  return (
    <View style={styles.card}>
      <Image source={SPROUT_BOWL} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F0DC',
    borderRadius: radii.lg,
    padding: 24,
    alignItems: 'center',
    ...shadow.soft,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.terracotta,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
