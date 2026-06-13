import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { categoryMeta, allQuestions } from '../data/all-questions';
import { colors, fonts } from '../theme';
import { getLatestUniqueChoices, normalizeUserChoice } from '../utils/longevity';
import { UserChoice } from '../types/index';

const categoryLookup = Object.fromEntries(categoryMeta.map(category => [category.id, category]));
const questionLookup = Object.fromEntries(allQuestions.map(question => [question.id, question.question]));

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export const JournalScreen: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
  const [choices, setChoices] = useState<UserChoice[]>([]);

  const loadJournal = async () => {
    try {
      const rows = await db.getUserChoices(userId).catch(() => []);
      const normalized = getLatestUniqueChoices((rows ?? []).map(normalizeUserChoice))
        .filter(choice => Boolean(choice.reflection?.trim()));
      setChoices(normalized);
    } catch {
      setChoices([]);
    }
  };

  useEffect(() => {
    loadJournal();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      loadJournal();
    }, [userId])
  );

  const reflectionCount = choices.length;
  const recentChoice = choices[0];

  const emptyState = useMemo(() => {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>✍️</Text>
        <Text style={styles.emptyTitle}>No reflections yet</Text>
        <Text style={styles.emptySub}>
          When you add a note after answering a question, it will appear here as part of your journal.
        </Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Journal</Text>
          <Text style={styles.headerSub}>Your reflections, patterns, and notes</Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={choices}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Reflections saved</Text>
                <Text style={styles.summaryValue}>{reflectionCount}</Text>
              </View>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>Private journal</Text>
              </View>
            </View>
            {recentChoice ? (
              <View style={styles.summaryDivider}>
                <Text style={styles.recentLabel}>Most recent note</Text>
                <Text style={styles.recentText} numberOfLines={2}>
                  {recentChoice.reflection}
                </Text>
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={emptyState}
        renderItem={({ item }) => {
          const meta = categoryLookup[item.category];
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{meta ? `${meta.icon} ${meta.label}` : item.category}</Text>
                </View>
                <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
              </View>

              <Text style={styles.question}>{questionLookup[item.questionId] ?? item.questionId}</Text>
              <Text style={styles.reflection}>{item.reflection}</Text>

              <View style={styles.choiceRow}>
                <Text style={styles.choiceLabel}>Choice</Text>
                <Text style={styles.choiceValue}>{item.choice}</Text>
                {item.selectedArchetype ? (
                  <View style={styles.archetypePill}>
                    <Text style={styles.archetypePillText}>{item.selectedArchetype}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        }}
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '4D',
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.primary,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  summaryCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    padding: 16,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  summaryValue: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  summaryBadge: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  summaryBadgeText: { color: colors.onSecondaryContainer, fontSize: 12, fontWeight: '700' },
  summaryDivider: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant + '40',
  },
  recentLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginBottom: 6 },
  recentText: { fontSize: 14, lineHeight: 20, color: colors.textPrimary },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '4D',
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryPillText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  timestamp: { fontSize: 12, color: colors.textMuted },
  question: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },
  reflection: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  choiceLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
  },
  choiceValue: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  archetypePill: {
    marginLeft: 'auto',
    backgroundColor: colors.cardTinted,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  archetypePillText: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  emptyState: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
  },
  emptyEmoji: { fontSize: 44, marginBottom: 10 },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
  },
});