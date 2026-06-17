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
import { StreaksAndBadges } from '../components/StreaksAndBadges';

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

        <StreaksAndBadges choices={choices} />

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
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroLabel: { fontSize: 10, letterSpacing: 1.8, color: colors.secondary, marginBottom: 8, textTransform: 'uppercase', fontWeight: '800', opacity: 0.8 },
  heroName: { fontFamily: fonts.serif, fontSize: 26, fontStyle: 'italic', fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.3 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: colors.white, fontFamily: fonts.serif },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: fonts.serif, fontSize: 28, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 6, fontWeight: '600' },
  statDivider: { width: 1, backgroundColor: colors.outlineVariant, marginHorizontal: 12 },
  archetypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  archetypeEmoji: { fontSize: 28 },
  archetypeLabel: { fontSize: 10, color: colors.secondary, marginBottom: 4, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.8 },
  archetypeValue: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.2 },
  sectionHeader: { marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 22, fontStyle: 'italic', fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.3 },
  sectionSub: { fontSize: 14, color: colors.textSecondary, marginTop: 6, fontWeight: '500' },
  dimensionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  dimensionRow: { marginBottom: 18 },
  dimensionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dimensionName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, flex: 1, paddingRight: 10, letterSpacing: -0.2 },
  dimensionScore: { fontSize: 14, fontWeight: '700', color: colors.secondary },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.outlineVariant, overflow: 'hidden', shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  barFill: { height: 8, borderRadius: 4, backgroundColor: colors.secondary },
  dimensionMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 8, fontWeight: '500' },
  archetypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  archetypeTile: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  archetypeTileEmoji: { fontSize: 28, marginBottom: 8 },
  archetypeTileCount: { fontFamily: fonts.serif, fontSize: 24, fontWeight: '700', color: colors.primary },
  archetypeTileLabel: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 6, fontWeight: '600' },
  devCard: {
    marginTop: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  devTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8, letterSpacing: -0.2 },
  devText: { fontSize: 14, color: colors.textSecondary, marginBottom: 16, fontWeight: '500' },
  devButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  devButtonText: { color: colors.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
});
