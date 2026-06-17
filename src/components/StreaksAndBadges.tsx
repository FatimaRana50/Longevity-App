import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserChoice } from '../types/index';
import { colors, fonts } from '../theme';
import { calculateStreak, calculateBadges, getNextBadge } from '../utils/streaks';

interface Props {
  choices: UserChoice[];
}

export const StreaksAndBadges: React.FC<Props> = ({ choices }) => {
  const streak = useMemo(() => calculateStreak(choices), [choices]);
  const badges = useMemo(() => calculateBadges(choices), [choices]);
  const nextBadge = useMemo(() => getNextBadge(choices), [choices]);

  return (
    <View style={styles.container}>
      {/* Streak Section */}
      <View style={styles.streakCard}>
        <View style={styles.streakContent}>
          <View>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakNumber}>{streak.current} days 🔥</Text>
          </View>
          <View style={styles.streakDivider} />
          <View>
            <Text style={styles.streakLabel}>Best Streak</Text>
            <Text style={styles.streakNumber}>{streak.best} days ⭐</Text>
          </View>
        </View>
      </View>

      {/* Next Badge Preview */}
      {nextBadge && (
        <View style={styles.nextBadgeCard}>
          <Text style={styles.nextBadgeEmoji}>{nextBadge.emoji}</Text>
          <View style={styles.nextBadgeContent}>
            <Text style={styles.nextBadgeTitle}>{nextBadge.name}</Text>
            <Text style={styles.nextBadgeDesc}>{nextBadge.description}</Text>
          </View>
          <Text style={styles.nextBadgeArrow}>→</Text>
        </View>
      )}

      {/* Badges Grid */}
      {badges.length > 0 && (
        <View style={styles.badgesSection}>
          <Text style={styles.badgesTitle}>🏆 Badges Unlocked</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesGrid}
            scrollEventThrottle={16}
          >
            {badges.map(badge => (
              <View key={badge.id} style={styles.badgeTile}>
                <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  streakCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  streakLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  streakNumber: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },

  streakDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.outlineVariant,
  },

  nextBadgeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
    padding: 18,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  nextBadgeEmoji: {
    fontSize: 36,
  },

  nextBadgeContent: {
    flex: 1,
  },

  nextBadgeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },

  nextBadgeDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  nextBadgeArrow: {
    fontSize: 18,
    color: colors.secondary,
  },

  badgesSection: {
    marginBottom: 12,
  },

  badgesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  badgesGrid: {
    paddingEnd: 24,
    gap: 12,
  },

  badgeTile: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: 90,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  badgeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },

  badgeName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
});
