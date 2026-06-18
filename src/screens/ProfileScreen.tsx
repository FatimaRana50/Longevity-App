import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { categoryMeta } from '../data/all-questions';
import { colors, fonts, radii, shadow } from '../theme';
import {
  archetypeLabels, getArchetypeCounts, getChoiceSummaries, getPrimaryArchetype,
  getLatestUniqueChoices, normalizeUserChoice,
} from '../utils/longevity';
import { UserChoice } from '../types/index';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { Header } from '../components/Header';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';

const ARCH_COLORS = [colors.terracotta, colors.sage, '#C49B6C', '#8B7355', '#A35C4A'];

export const ProfileScreen: React.FC = () => {
  const { user, resetOnboarding } = useUser();
  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
  const [choices, setChoices] = useState<UserChoice[]>([]);

  const loadProfileData = async () => {
    try {
      const rows = await db.getUserChoices(userId).catch(() => []);
      setChoices(getLatestUniqueChoices((rows ?? []).map(normalizeUserChoice)));
    } catch { setChoices([]); }
  };

  useEffect(() => { loadProfileData(); }, [userId]);
  useFocusEffect(React.useCallback(() => { loadProfileData(); }, [userId]));

  const totalChoices = choices.length;
  const dimensionScores = useMemo(() => getChoiceSummaries(choices), [choices]);
  const archetypeCounts = useMemo(() => getArchetypeCounts(choices), [choices]);
  const dominantArchetype = user?.primaryArchetype ?? getPrimaryArchetype(choices);
  const dominantLabel = dominantArchetype ? archetypeLabels[dominantArchetype] : null;

  const totalArchetype = Object.values(archetypeCounts).reduce((a, b) => a + (b as number), 0) || 1;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="Profile" subtitle="Your longevity dimensions" />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Identity card */}
          <Card>
            <View style={styles.identityRow}>
              <Avatar name={user?.name ?? 'You'} size={64} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.name}>{user?.name ?? 'You'}</Text>
                <Text style={styles.totalTxt}>
                  <Text style={styles.totalNum}>{totalChoices}</Text> choices made
                </Text>
              </View>
            </View>
            {dominantLabel && (
              <View style={styles.archeBlock}>
                <Text style={styles.archeEyebrow}>Primary Archetype</Text>
                <Text style={styles.archeName}>{dominantLabel.label}</Text>
              </View>
            )}
          </Card>

          {/* Archetype balance */}
          <Card style={{ marginTop: 16 }}>
            <Text style={styles.sectionEyebrow}>Archetype Balance</Text>
            <Text style={styles.sectionTitle}>How your choices distribute</Text>
            <View style={styles.stackBar}>
              {Object.entries(archetypeCounts).map(([key, val], i) => {
                const w = ((val as number) / totalArchetype) * 100;
                if (!w) return null;
                return <View key={key} style={{ width: `${w}%`, backgroundColor: ARCH_COLORS[i % ARCH_COLORS.length], height: '100%' }} />;
              })}
            </View>
            <View style={{ marginTop: 14 }}>
              {Object.entries(archetypeCounts).map(([key, val], i) => {
                if (!val) return null;
                const label = archetypeLabels[key as keyof typeof archetypeLabels]?.label ?? key;
                const pct = Math.round(((val as number) / totalArchetype) * 100);
                return (
                  <View key={key} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: ARCH_COLORS[i % ARCH_COLORS.length] }]} />
                    <Text style={styles.legendLabel}>{label}</Text>
                    <Text style={styles.legendPct}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Dimensions */}
          <Card style={{ marginTop: 16 }}>
            <Text style={styles.sectionEyebrow}>15 Dimensions</Text>
            <Text style={styles.sectionTitle}>Your scores</Text>
            <View style={{ marginTop: 8 }}>
              {categoryMeta.map(cat => {
                const score = dimensionScores[cat.id]?.score ?? 0;
                return (
                  <View key={cat.id} style={styles.dimRow}>
                    <View style={styles.dimHead}>
                      <Text style={styles.dimLabel}>{cat.label}</Text>
                      <Text style={styles.dimScore}>{Math.round(score)}</Text>
                    </View>
                    <ProgressBar value={score / 100} tint={colors.sage} />
                  </View>
                );
              })}
            </View>
          </Card>

          {__DEV__ && (
            <TouchableOpacity
              onPress={() => Alert.alert('Reset', 'Reset onboarding?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => resetOnboarding?.() },
              ])}
              style={styles.devBtn}
            >
              <Text style={styles.devTxt}>Dev: Reset Onboarding</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  identityRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontFamily: fonts.serif, fontSize: 22, color: colors.ink },
  totalTxt: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkSoft, marginTop: 4 },
  totalNum: { fontFamily: fonts.serif, color: colors.terracotta, fontSize: 16 },
  archeBlock: { marginTop: 18, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.hairlineSoft },
  archeEyebrow: {
    fontFamily: fonts.sans, fontSize: 10, letterSpacing: 1.4,
    textTransform: 'uppercase', color: colors.terracotta, marginBottom: 4,
  },
  archeName: { fontFamily: fonts.serif, fontSize: 22, color: colors.ink },
  archeDesc: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkSoft, marginTop: 6, lineHeight: 20 },
  sectionEyebrow: {
    fontFamily: fonts.sans, fontSize: 10, letterSpacing: 1.4,
    textTransform: 'uppercase', color: colors.sage, marginBottom: 4,
  },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink, marginBottom: 16 },
  stackBar: {
    flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden',
    backgroundColor: colors.hairlineSoft,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendLabel: { flex: 1, fontFamily: fonts.sans, fontSize: 14, color: colors.ink },
  legendPct: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkSoft },
  dimRow: { marginBottom: 14 },
  dimHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  dimLabel: { fontFamily: fonts.sans, fontSize: 14, color: colors.ink },
  dimScore: { fontFamily: fonts.serif, fontSize: 14, color: colors.inkSoft },
  devBtn: { marginTop: 24, padding: 14, alignItems: 'center' },
  devTxt: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkMuted, letterSpacing: 0.5 },
});
