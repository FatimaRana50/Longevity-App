import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { UserChoice } from '../types/index';
import { colors, fonts } from '../theme';
import { getRecommendations, getRecommendationMessage } from '../utils/recommendations';

interface Props {
  choices: UserChoice[];
  archetype?: string;
  onCategorySelect?: (categoryId: string, categoryLabel: string, categoryIcon: string) => void;
}

export const RecommendationCard: React.FC<Props> = ({ choices, archetype, onCategorySelect }) => {
  const recommendations = useMemo(() => getRecommendations(choices), [choices]);

  if (recommendations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyText}>You've explored all categories!</Text>
        </View>
      </View>
    );
  }

  const renderRecommendation = ({ item, index }: { item: typeof recommendations[0]; index: number }) => {
    const message = getRecommendationMessage(archetype, item.categoryLabel);

    return (
      <TouchableOpacity
        key={item.categoryId}
        style={[styles.recCard, index === 0 && styles.recCardFeatured]}
        activeOpacity={0.85}
        onPress={() => {
          onCategorySelect?.(item.categoryId, item.categoryLabel, item.categoryIcon);
        }}
      >
        <View style={styles.recHeader}>
          <Text style={styles.recIcon}>{item.categoryIcon}</Text>
          <View style={styles.recTitleBlock}>
            <Text style={styles.recTitle}>{item.categoryLabel}</Text>
            {index === 0 && <Text style={styles.recBadge}>Recommended for you</Text>}
          </View>
        </View>

        <Text style={styles.recMessage}>{message}</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progressPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(item.progressPercent)}% Complete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💡 Next Steps</Text>
      <FlatList
        data={recommendations}
        keyExtractor={item => item.categoryId}
        renderItem={renderRecommendation}
        scrollEnabled={false}
        nestedScrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  recCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  recCardFeatured: {
    borderWidth: 2,
    borderColor: colors.secondary,
    backgroundColor: colors.white,
    shadowColor: colors.secondary,
    shadowOpacity: 0.1,
    elevation: 3,
  },

  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },

  recIcon: {
    fontSize: 28,
  },

  recTitleBlock: {
    flex: 1,
  },

  recTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  recBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  recMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '500',
  },

  progressBar: {
    height: 6,
    backgroundColor: colors.outlineVariant,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },

  progressFill: {
    height: 6,
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },

  progressText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textAlign: 'right',
  },
});
