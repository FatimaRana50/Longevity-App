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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 22,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 6, fontWeight: '700', letterSpacing: 0.3, textTransform: 'uppercase' },
  summaryValue: { fontFamily: fonts.serif, fontSize: 32, fontWeight: '700', color: colors.primary, letterSpacing: -0.5 },
  summaryBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryBadgeText: { color: colors.white, fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
  summaryDivider: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  recentLabel: { fontSize: 11, fontWeight: '800', color: colors.secondary, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.8 },
  recentText: { fontSize: 15, lineHeight: 22, color: colors.textPrimary, fontWeight: '500' },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryPill: {
    backgroundColor: colors.secondaryLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryPillText: { fontSize: 12, color: colors.secondary, fontWeight: '700', letterSpacing: -0.2 },
  timestamp: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  question: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  reflection: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: 14,
    fontWeight: '500',
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  choiceLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  choiceValue: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  archetypePill: {
    marginLeft: 'auto',
    backgroundColor: colors.secondaryLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  archetypePillText: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: -0.1,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginHorizontal: 24,
    marginTop: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  emptySub: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
