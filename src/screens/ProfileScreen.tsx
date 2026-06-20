import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { categoryMeta } from '../data/all-questions';
import { colors, fonts } from '../theme';
import {
  archetypeLabels, getArchetypeCounts, getChoiceSummaries, getPrimaryArchetype,
  getLatestUniqueChoices, normalizeUserChoice,
} from '../utils/longevity';
import { UserChoice } from '../types/index';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { TopHeader } from '../components/TopHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
const ARCH_COLORS = [colors.terracotta, colors.sage, '#C49B6C', '#8B7355', '#A35C4A'];
// Icon mapping for archetype rows (tinted circular badges)
const archetypeIcon = (key: string, color: string, size = 18) => {
  const k = key.toLowerCase();
  if (k.includes('optim')) return <MaterialCommunityIcons name="star-four-points" size={size} color={color} />;
  if (k.includes('natural')) return <Ionicons name="leaf" size={size} color={color} />;
  if (k.includes('balanc') || k.includes('integrat')) return <MaterialCommunityIcons name="scale-balance" size={size} color={color} />;
  if (k.includes('relation')) return <Ionicons name="people" size={size} color={color} />;
  if (k.includes('prevent')) return <Ionicons name="shield-checkmark" size={size} color={color} />;
  return <Ionicons name="ellipse" size={size} color={color} />;
};
// Icon for each dimension/category
const dimensionIcon = (id: string, color: string, size = 16) => {
  const k = id.toLowerCase();
  if (k.includes('nutri') || k.includes('diet') || k.includes('food')) return <MaterialCommunityIcons name="bowl-mix" size={size} color={color} />;
  if (k.includes('exercise') || k.includes('movement') || k.includes('fit')) return <FontAwesome5 name="running" size={size - 2} color={color} />;
  if (k.includes('sleep')) return <Ionicons name="moon" size={size} color={color} />;
  if (k.includes('stress') || k.includes('mind')) return <MaterialCommunityIcons name="meditation" size={size} color={color} />;
  if (k.includes('social') || k.includes('relation')) return <Ionicons name="people" size={size} color={color} />;
  if (k.includes('hydrat') || k.includes('water')) return <Ionicons name="water" size={size} color={color} />;
  if (k.includes('purpose') || k.includes('mean')) return <Feather name="compass" size={size} color={color} />;
  if (k.includes('nature') || k.includes('outdoor')) return <Ionicons name="leaf" size={size} color={color} />;
  if (k.includes('brain') || k.includes('cogn')) return <MaterialCommunityIcons name="brain" size={size} color={color} />;
  if (k.includes('heart') || k.includes('cardio')) return <Ionicons name="heart" size={size} color={color} />;
  return <Ionicons name="sparkles" size={size} color={color} />;
};
export const ProfileScreen: React.FC = () => {
  const { user, resetOnboarding } = useUser();
  const navigation = useNavigation<any>();
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
  const handleNavTab = (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => {
    if (tab === 'profile') return;
    navigation.navigate(tab === 'daily' ? 'TodayTab' : tab === 'explore' ? 'LibraryTab' : tab === 'journal' ? 'JournalTab' : 'MoreTab');
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />
      <TopHeader
        userName={user?.name}
        onProfilePress={() => {}}
        onMenuPress={() => {}}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Identity card with watercolor botanicals */}
          <Card>
            <View style={styles.identityCardInner}>
              {/* Faded leaves on the right as decorative background */}
              <Image
                source={require('../../assets/profile-leaves-bg.png')}
                style={styles.bgLeaves}
                resizeMode="contain"
                pointerEvents="none"
              />
              <View style={styles.identityRow}>
                <View style={styles.avatarWrap}>
                  <Avatar name={user?.name ?? 'You'} size={88} />
                  {/* Sprig overlapping bottom-left of avatar */}
                  <View pointerEvents="none" style={styles.sprig}>
                    <Image
                      source={require('../../assets/profile-sprig.png')}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <View style={{ flex: 1, marginLeft: 18 }}>
                  <Text style={styles.name}>{user?.name ?? 'You'}</Text>
                  <Text style={styles.totalTxt}>
                    <Text style={styles.totalNum}>{totalChoices}</Text> choices made
                  </Text>
                  {dominantLabel && (
                    <View style={styles.archeBlock}>
                      <View style={styles.archeIconBadge}>
                        <MaterialCommunityIcons name="star-four-points" size={14} color={colors.sage} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.archeEyebrow}>Primary Archetype</Text>
                        <Text style={styles.archeName}>{dominantLabel.label}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Card>
          {/* Archetype balance */}
          <Card style={{ marginTop: 16 }}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionEyebrow}>Archetype Balance</Text>
                <Text style={styles.sectionTitle}>How your choices distribute</Text>
              </View>
              <TouchableOpacity style={styles.pillBtn} activeOpacity={0.8}>
                <Feather name="bar-chart-2" size={13} color={colors.ink} />
                <Text style={styles.pillBtnTxt}>View insights</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.stackBar}>
              {Object.entries(archetypeCounts).map(([key, val], i) => {
                const w = ((val as number) / totalArchetype) * 100;
                if (!w) return null;
                return <View key={key} style={{ width: `${w}%`, backgroundColor: ARCH_COLORS[i % ARCH_COLORS.length], height: '100%' }} />;
              })}
            </View>
            <View style={{ marginTop: 18 }}>
              {Object.entries(archetypeCounts).map(([key, val], i) => {
                if (!val) return null;
                const label = archetypeLabels[key as keyof typeof archetypeLabels]?.label ?? key;
                const pct = Math.round(((val as number) / totalArchetype) * 100);
                const color = ARCH_COLORS[i % ARCH_COLORS.length];
                const isLast = i === Object.entries(archetypeCounts).filter(([, v]) => v).length - 1;
                return (
                  <View key={key} style={[styles.legendRow, !isLast && styles.legendDivider]}>
                    <View style={[styles.legendIconCircle, { backgroundColor: color }]}>
                      {archetypeIcon(label, '#FFFFFF', 16)}
                    </View>
                    <Text style={styles.legendLabel}>{label}</Text>
                    <Text style={[styles.legendPct, { color }]}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </Card>
          {/* Dimensions */}
          <Card style={{ marginTop: 16 }}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionEyebrow}>15 Dimensions</Text>
                <Text style={styles.sectionTitle}>Your scores</Text>
              </View>
              <TouchableOpacity style={styles.pillBtn} activeOpacity={0.8}>
                <Text style={styles.pillBtnTxt}>View all</Text>
                <Feather name="chevron-right" size={14} color={colors.ink} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 4 }}>
              {categoryMeta.map(cat => {
                const score = dimensionScores[cat.id]?.score ?? 0;
                return (
                  <TouchableOpacity key={cat.id} style={styles.dimRow} activeOpacity={0.7}>
                    <View style={styles.dimIconCircle}>
                      {dimensionIcon(cat.id, '#FFFFFF', 16)}
                    </View>
                    <Text style={styles.dimLabel}>{cat.label}</Text>
                    <View style={styles.dimBarWrap}>
                      <ProgressBar value={score / 100} tint={colors.sage} />
                    </View>
                    <Text style={styles.dimScore}>{Math.round(score)}</Text>
                    <Feather name="chevron-right" size={16} color={colors.inkMuted} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
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
      <BottomNavigation active="profile" onPress={handleNavTab} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  // Identity card
  identityCardInner: { position: 'relative', overflow: 'hidden' },
  bgLeaves: {
    position: 'absolute',
    right: -30,
    top: -20,
    width: 220,
    height: 220,
    opacity: 0.55,
  },
  identityRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { width: 88, height: 88, position: 'relative' },
  sprig: {
    position: 'absolute',
    left: -20,
    bottom: -55,
    width: 110,
    height: 110,
    opacity: 0.7,
  },
  name: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink, lineHeight: 32 },
  totalTxt: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkSoft, marginTop: 6 },
  totalNum: { fontFamily: fonts.serif, color: colors.terracotta, fontSize: 18 },
  archeBlock: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.hairlineSoft,
    flexDirection: 'row',
    alignItems: 'center',
  },
  archeIconBadge: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.hairlineSoft,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  archeEyebrow: {
    fontFamily: fonts.sans, fontSize: 10, letterSpacing: 1.4,
    textTransform: 'uppercase', color: colors.terracotta, marginBottom: 2,
  },
  archeName: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink },
  // Section header with pill button
  sectionHead: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  sectionEyebrow: {
    fontFamily: fonts.sans, fontSize: 10, letterSpacing: 1.4,
    textTransform: 'uppercase', color: colors.sage, marginBottom: 4,
  },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink },
  pillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.hairlineSoft,
  },
  pillBtnTxt: { fontFamily: fonts.sans, fontSize: 12, color: colors.ink, marginLeft: 4 },
  stackBar: {
    flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden',
    backgroundColor: colors.hairlineSoft,
  },
  // Archetype legend rows
  legendRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12,
  },
  legendDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairlineSoft,
  },
  legendIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  legendLabel: { flex: 1, fontFamily: fonts.serif, fontSize: 16, color: colors.ink },
  legendPct: { fontFamily: fonts.serif, fontSize: 16 },
  // Dimension rows
  dimRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10,
  },
  dimIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.sage,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  dimLabel: { fontFamily: fonts.serif, fontSize: 15, color: colors.ink, width: 90 },
  dimBarWrap: { flex: 1, marginHorizontal: 10 },
  dimScore: { fontFamily: fonts.sans, fontSize: 14, color: colors.ink, minWidth: 28, textAlign: 'right' },
  devBtn: { marginTop: 24, padding: 14, alignItems: 'center' },
  devTxt: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkMuted, letterSpacing: 0.5 },
});
