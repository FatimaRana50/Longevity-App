import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
// @ts-ignore
import { Ionicons } from '@expo/vector-icons';
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
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.iconBadge}>
        <Ionicons name="bar-chart" size={20} color={colors.cream} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F0DC',
    borderRadius: radii.lg,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.soft,
  },
  image: {
    width: 72,
    height: 72,
    marginRight: 16,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 22,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.terracotta,
    textTransform: 'uppercase',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
