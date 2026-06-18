import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { categoryMeta, CategoryMeta } from '../data/all-questions';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { colors, fonts, radii, shadow } from '../theme';
import { getLatestUniqueChoices, normalizeUserChoice } from '../utils/longevity';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';

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

  // recommended: lowest-progress category
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="Explore" subtitle="All 15 dimensions of longevity" />

        <FlatList
          data={categoryMeta}
          keyExtractor={i => i.id}
          renderItem={renderCategory}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={
            <View style={{ marginBottom: 20 }}>
              <Card>
                <Text style={styles.eyebrow}>Overall Progress</Text>
                <Text style={styles.bigStat}>
                  <Text style={styles.bigStatNum}>{totalAnswered}</Text>
                  <Text style={styles.bigStatDen}> / {totalQuestions}</Text>
                </Text>
                <Text style={styles.statSub}>questions answered</Text>
                <View style={{ marginTop: 14 }}>
                  <ProgressBar value={overallPct} />
                </View>
              </Card>

              {recommended && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('CategoryQuestions', {
                    categoryId: recommended.id,
                    categoryLabel: recommended.label,
                    categoryIcon: recommended.icon,
                  })}
                  style={{ marginTop: 12 }}
                >
                  <Card variant="warm" accent={colors.sage}>
                    <Text style={[styles.eyebrow, { color: colors.sage }]}>Suggested for you</Text>
                    <Text style={styles.recTitle}>Continue with {recommended.label}</Text>
                    <Text style={styles.recSub}>A balanced practice covers every dimension.</Text>
                  </Card>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </SafeAreaView>
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
  bigStatNum: { fontFamily: fonts.serif, fontSize: 40, color: colors.ink, letterSpacing: -1 },
  bigStatDen: { fontFamily: fonts.serif, fontSize: 22, color: colors.inkMuted },
  statSub: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  recTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink, marginTop: 2 },
  recSub: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkSoft, marginTop: 6 },
  categoryRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.card, borderRadius: radii.lg, padding: 18,
    borderWidth: 1, borderColor: colors.hairlineSoft,
    ...shadow.soft,
  },
  catIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.cardWarm,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
    borderWidth: 1, borderColor: colors.hairline,
  },
  catIconText: { fontFamily: fonts.serif, fontSize: 18, color: colors.terracotta },
  catTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catLabel: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink },
  donePill: { backgroundColor: colors.sage, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  donePillTxt: { fontFamily: fonts.sans, fontSize: 10, color: colors.cream, letterSpacing: 0.8, textTransform: 'uppercase' },
  catCount: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft, marginTop: 6 },
});
