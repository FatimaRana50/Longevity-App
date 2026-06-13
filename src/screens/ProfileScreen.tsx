import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { categoryMeta } from '../data/all-questions';
import { colors, fonts } from '../theme';
import { archetypeLabels, getArchetypeCounts, getChoiceSummaries, getPrimaryArchetype, getLatestUniqueChoices, normalizeUserChoice } from '../utils/longevity';
import { UserChoice } from '../types/index';

function Bar({ value }: { value: number }) {
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${Math.min(100, Math.max(0, value))}%` }]} />
    </View>
  );
}

export const ProfileScreen: React.FC = () => {
  const { user, resetOnboarding } = useUser();
  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
  const [choices, setChoices] = useState<UserChoice[]>([]);

  const loadProfileData = async () => {
    try {
      const rows = await db.getUserChoices(userId).catch(() => []);
      setChoices(getLatestUniqueChoices((rows ?? []).map(normalizeUserChoice)));
    } catch {
      setChoices([]);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
    }, [userId])
  );

  const totalChoices = choices.length;
  const dimensionScores = useMemo(() => getChoiceSummaries(choices), [choices]);
  const archetypeCounts = useMemo(() => getArchetypeCounts(choices), [choices]);
  const dominantArchetype = user?.primaryArchetype ?? getPrimaryArchetype(choices);

  const leadingCategory = useMemo(() => {
    return [...categoryMeta]
      .map(category => ({
        ...category,
        score: dimensionScores[category.id]?.score ?? 0,
      }))
      .sort((a, b) => b.score - a.score)[0];
  }, [dimensionScores]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSub}>Your longevity dimensions at a glance</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Current profile</Text>
              <Text style={styles.heroName}>{user?.name?.trim() || 'Your profile'}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? 'U'}</Text>
            </View>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{totalChoices}</Text>
              <Text style={styles.statLabel}>choices saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{leadingCategory?.score ?? 0}%</Text>
              <Text style={styles.statLabel}>top dimension</Text>
            </View>
          </View>

          {dominantArchetype ? (
            <View style={styles.archetypeCard}>
              <Text style={styles.archetypeEmoji}>{archetypeLabels[dominantArchetype].emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.archetypeLabel}>Primary archetype</Text>
                <Text style={styles.archetypeValue}>{archetypeLabels[dominantArchetype].label}</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dimension scores</Text>
          <Text style={styles.sectionSub}>Percent of each category you have explored</Text>
        </View>

        <View style={styles.dimensionCard}>
          {categoryMeta.map(category => {
            const summary = dimensionScores[category.id];
            return (
              <View key={category.id} style={styles.dimensionRow}>
                <View style={styles.dimensionTopRow}>
                  <Text style={styles.dimensionName}>{category.icon} {category.label}</Text>
                  <Text style={styles.dimensionScore}>{summary.score}%</Text>
                </View>
                <Bar value={summary.score} />
                <Text style={styles.dimensionMeta}>{summary.answered} of {summary.total} questions answered</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Archetype balance</Text>
          <Text style={styles.sectionSub}>How your choices are distributed so far</Text>
        </View>

        <View style={styles.archetypeGrid}>
          {(Object.keys(archetypeCounts) as Array<keyof typeof archetypeCounts>).map(key => {
            const label = archetypeLabels[key];
            return (
              <View key={key} style={styles.archetypeTile}>
                <Text style={styles.archetypeTileEmoji}>{label.emoji}</Text>
                <Text style={styles.archetypeTileCount}>{archetypeCounts[key]}</Text>
                <Text style={styles.archetypeTileLabel}>{label.label}</Text>
              </View>
            );
          })}
        </View>

        {__DEV__ ? (
          <View style={styles.devCard}>
            <Text style={styles.devTitle}>Developer tools</Text>
            <Text style={styles.devText}>Reset your onboarding state so the intro flow appears again.</Text>
            <TouchableOpacity
              style={styles.devButton}
              onPress={() => {
                Alert.alert(
                  'Reset onboarding?',
                  'This clears onboarding completion and your profile archetype so you can replay the intro.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: () => {
                        resetOnboarding().catch(() => {});
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.devButtonText}>Reset onboarding</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    padding: 18,
    marginBottom: 18,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heroLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  heroName: { fontFamily: fonts.serif, fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant + '60',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.textSecondary },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.outlineVariant + '60', marginHorizontal: 8 },
  archetypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardTinted,
    borderRadius: 16,
    padding: 14,
  },
  archetypeEmoji: { fontSize: 24 },
  archetypeLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  archetypeValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  sectionSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  dimensionCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '4D',
    padding: 14,
    marginBottom: 18,
  },
  dimensionRow: { marginBottom: 14 },
  dimensionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dimensionName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, flex: 1, paddingRight: 10 },
  dimensionScore: { fontSize: 13, fontWeight: '700', color: colors.secondary },
  barTrack: { height: 8, borderRadius: 999, backgroundColor: colors.surfaceContainerHighest, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 999, backgroundColor: colors.secondary },
  dimensionMeta: { fontSize: 11, color: colors.textMuted, marginTop: 6 },
  archetypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  archetypeTile: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    marginBottom: 10,
    alignItems: 'center',
  },
  archetypeTileEmoji: { fontSize: 20, marginBottom: 6 },
  archetypeTileCount: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  archetypeTileLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 4 },
  devCard: {
    marginTop: 4,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '55',
  },
  devTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  devText: { fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  devButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  devButtonText: { color: colors.white, fontSize: 14, fontWeight: '700' },
});