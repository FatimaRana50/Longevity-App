import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { categoryMeta, CategoryMeta } from '../data/all-questions';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { colors, fonts, radii, shadow } from '../theme';
import { getLatestUniqueChoices, normalizeUserChoice } from '../utils/longevity';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { TopHeader } from '../components/TopHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';

// Drop these two files into your assets folder:
//   assets/botanical-leaves.png   (transparent watercolor leaves)
//   assets/zen-stones.jpg         (stacked stones with sprout)
const LEAVES_IMG = require('../../assets/botanical-leaves.png');
const STONES_IMG = require('../../assets/zen-stones.jpg');

export type ExploreStackParamList = {
  ExploreHome: undefined;
  CategoryQuestions: { categoryId: string; categoryLabel: string; categoryIcon: string };
};

export const ExploreScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const [answeredByCategory, setAnsweredByCategory] = useState<Record<string, number>>({});

  useEffect(() => { loadProgress(); }, []);
  useFocusEffect(React.useCallback(() => { loadProgress(); }, [user?.id]));

  const loadProgress = async () => {
    try {
      const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
      const userChoices = await db.getUserChoices(userId).catch(() => []);
      const counts: Record<string, number> = {};
      getLatestUniqueChoices((userChoices ?? []).map(normalizeUserChoice)).forEach(c => {
        const cat = c.category || '';
        counts[cat] = (counts[cat] || 0) + 1;
      });
      setAnsweredByCategory(counts);
    } catch { /* silent */ }
  };

  const totalAnswered = Object.values(answeredByCategory).reduce((a, b) => a + b, 0);
  const totalQuestions = categoryMeta.reduce((a, c) => a + c.questionCount, 0);
  const overallPct = totalQuestions > 0 ? totalAnswered / totalQuestions : 0;
  const overallPctLabel = Math.round(overallPct * 100);

  const recommended = [...categoryMeta]
    .map(c => ({ ...c, pct: (answeredByCategory[c.id] || 0) / Math.max(1, c.questionCount) }))
    .sort((a, b) => a.pct - b.pct)[0];

  const renderCategory = ({ item }: { item: CategoryMeta }) => {
    const answered = answeredByCategory[item.id] || 0;
    const pct = item.questionCount > 0 ? answered / item.questionCount : 0;
    const done = answered >= item.questionCount;

    return (
      <TouchableOpacity
        style={styles.categoryRow}
        activeOpacity={0.75}
        onPress={() => navigation.navigate('CategoryQuestions', {
          categoryId: item.id,
          categoryLabel: item.label,
          categoryIcon: item.icon,
        })}
      >
        <View style={styles.catIconWrap}>
          <Text style={styles.catIconText}>{item.label.slice(0, 1)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.catTopRow}>
            <Text style={styles.catLabel}>{item.label}</Text>
            {done && <View style={styles.donePill}><Text style={styles.donePillTxt}>Complete</Text></View>}
          </View>
          <View style={{ marginTop: 8 }}>
            <ProgressBar value={pct} tint={done ? colors.sage : colors.terracotta} />
          </View>
          <Text style={styles.catCount}>{answered} of {item.questionCount} answered</Text>
        </View>
        <View style={styles.catChevron}>
          <Ionicons name="arrow-forward" size={18} color={colors.sage} />
        </View>
      </TouchableOpacity>
    );
  };

  const handleNavTab = (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => {
    if (tab === 'explore') return;
    const tabMap: Record<string, string> = { daily: 'TodayTab', journal: 'JournalTab', profile: 'ProfileTab', more: 'MoreTab' };
    navigation.getParent()?.navigate(tabMap[tab]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />

      <TopHeader
        userName={user?.name}
        onProfilePress={() => navigation.getParent()?.navigate('ProfileTab')}
        onMenuPress={() => {}}
      />

      <FlatList
        data={categoryMeta}
        keyExtractor={i => i.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            {/* OVERALL PROGRESS — with botanical leaves decoration */}
            <Card>
              <View style={styles.overallInner}>
                <Image
                  source={LEAVES_IMG}
                  style={styles.leavesDecor}
                  resizeMode="contain"
                  pointerEvents="none"
                />
                <Text style={styles.eyebrow}>Overall Progress</Text>
                <Text style={styles.bigStat}>
                  <Text style={styles.bigStatNum}>{totalAnswered}</Text>
                  <Text style={styles.bigStatDen}> / {totalQuestions}</Text>
                </Text>
                <Text style={styles.statSub}>questions answered</Text>

                <View style={styles.progressRow}>
                  <View style={{ flex: 1 }}>
                    <ProgressBar value={overallPct} />
                  </View>
                  <View style={styles.progressBadge}>
                    <Ionicons name="leaf-outline" size={14} color={colors.terracotta} />
                  </View>
                </View>

                <View style={styles.pctChip}>
                  <Text style={styles.pctChipTxt}>{overallPctLabel}% COMPLETED</Text>
                </View>
              </View>
            </Card>

            {/* SUGGESTED FOR YOU — image background hero card */}
            {recommended && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('CategoryQuestions', {
                  categoryId: recommended.id,
                  categoryLabel: recommended.label,
                  categoryIcon: recommended.icon,
                })}
                style={styles.suggestedWrap}
              >
                <View style={styles.suggestedSideBar}>
                  <View style={styles.sparkleBadge}>
                    <Ionicons name="sparkles" size={16} color={colors.cream} />
                  </View>
                </View>

                <ImageBackground
                  source={STONES_IMG}
                  style={styles.suggestedBg}
                  imageStyle={styles.suggestedBgImg}
                >
                  <View style={styles.suggestedOverlay} />
                  <View style={styles.suggestedContent}>
                    <Text style={[styles.eyebrow, { color: colors.sage }]}>Suggested for you</Text>
                    <Text style={styles.recTitle}>Continue with{'\n'}{recommended.label}</Text>
                    <Text style={styles.recSub}>A balanced practice covers{'\n'}every dimension.</Text>

                    <View style={styles.resumeRow}>
                      <Text style={styles.resumeTxt}>RESUME JOURNEY</Text>
                      <View style={styles.resumeBtn}>
                        <Ionicons name="arrow-forward" size={16} color={colors.terracotta} />
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <BottomNavigation active="explore" onPress={handleNavTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  safe: { flex: 1 },
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  eyebrow: {
    fontFamily: fonts.sans, fontSize: 11, letterSpacing: 1.5,
    textTransform: 'uppercase', color: colors.terracotta, marginBottom: 8,
  },
  bigStat: { marginTop: 4 },
  bigStatNum: { fontFamily: fonts.serif, fontSize: 44, color: colors.ink, letterSpacing: -1 },
  bigStatDen: { fontFamily: fonts.serif, fontSize: 24, color: colors.inkMuted },
  statSub: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkSoft, marginTop: 2 },

  overallInner: { position: 'relative', overflow: 'hidden' },
  leavesDecor: {
    position: 'absolute',
    right: -28, top: -36,
    width: 180, height: 180,
    opacity: 0.85,
  },
  progressRow: {
    marginTop: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  progressBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.cardWarm,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.hairline,
  },
  pctChip: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.cardWarm,
    borderWidth: 1, borderColor: colors.hairlineSoft,
  },
  pctChipTxt: {
    fontFamily: fonts.sans, fontSize: 10, letterSpacing: 1.2,
    color: colors.inkSoft, textTransform: 'uppercase',
  },

  /* Suggested hero */
  suggestedWrap: {
    marginTop: 16,
    flexDirection: 'row',
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadow.soft,
  },
  suggestedSideBar: {
    width: 40,
    backgroundColor: colors.sage,
    alignItems: 'center', justifyContent: 'center',
  },
  sparkleBadge: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  suggestedBg: {
    flex: 1,
    minHeight: 200,
  },
  suggestedBgImg: {
    // tint the image toward cream
  },
  suggestedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 243, 232, 0.55)',
  },
  suggestedContent: {
    padding: 20,
    paddingRight: 130, // leave room for stones image on the right
  },
  recTitle: {
    fontFamily: fonts.serif, fontSize: 24, color: colors.ink,
    marginTop: 4, lineHeight: 30,
  },
  recSub: {
    fontFamily: fonts.sans, fontSize: 13, color: colors.inkSoft,
    marginTop: 10, lineHeight: 19,
  },
  resumeRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 18, gap: 12,
  },
  resumeTxt: {
    fontFamily: fonts.sans, fontSize: 11, letterSpacing: 1.4,
    color: colors.terracotta, textTransform: 'uppercase', fontWeight: '600',
  },
  resumeBtn: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1, borderColor: colors.terracotta,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  /* Category rows */
  categoryRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radii.lg, padding: 18,
    borderWidth: 2, borderColor: colors.hairlineSoft,
    borderLeftWidth: 5, borderLeftColor: colors.terracotta,
    ...shadow.soft,
    shadowColor: colors.terracotta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  catIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.cardWarm,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
    borderWidth: 1, borderColor: colors.hairline,
  },
  catIconText: { fontFamily: fonts.serif, fontSize: 20, color: colors.terracotta },
  catTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catLabel: { fontFamily: fonts.serif, fontSize: 19, color: colors.ink },
  donePill: { backgroundColor: colors.sage, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  donePillTxt: { fontFamily: fonts.sans, fontSize: 10, color: colors.cream, letterSpacing: 0.8, textTransform: 'uppercase' },
  catCount: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft, marginTop: 6 },
  catChevron: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, borderColor: colors.hairline,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 12,
  },
});
