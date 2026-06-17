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
import { colors, fonts } from '../theme';
import { getLatestUniqueChoices, normalizeUserChoice } from '../utils/longevity';
import { RecommendationCard } from '../components/RecommendationCard';

export type ExploreStackParamList = {
  ExploreHome: undefined;
  CategoryQuestions: { categoryId: string; categoryLabel: string; categoryIcon: string };
};

export const ExploreScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const [answeredByCategory, setAnsweredByCategory] = useState<Record<string, number>>({});
  const [choices, setChoices] = useState<any[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
    }, [user?.id])
  );

  const loadProgress = async () => {
    try {
      const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
      const userChoices = await db.getUserChoices(userId).catch(() => []);
      setChoices(userChoices ?? []);
      const counts: Record<string, number> = {};
      getLatestUniqueChoices((userChoices ?? []).map(normalizeUserChoice)).forEach(c => {
        const cat = c.category || '';
        counts[cat] = (counts[cat] || 0) + 1;
      });
      setAnsweredByCategory(counts);
    } catch {
      // silent
    }
  };

  const totalAnswered = Object.values(answeredByCategory).reduce((a, b) => a + b, 0);
  const totalQuestions = categoryMeta.reduce((a, c) => a + c.questionCount, 0);

  const renderCategory = ({ item }: { item: CategoryMeta }) => {
    const answered = answeredByCategory[item.id] || 0;
    const pct = item.questionCount > 0 ? answered / item.questionCount : 0;
    const done = answered >= item.questionCount;

    return (
      <TouchableOpacity
        style={styles.categoryRow}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('CategoryQuestions', {
          categoryId: item.id,
          categoryLabel: item.label,
          categoryIcon: item.icon,
        })}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.rowContent}>
          <View style={styles.rowTop}>
            <Text style={styles.categoryName}>{item.label}</Text>
            {done && <View style={styles.doneBadge}><Text style={styles.doneBadgeText}>Done</Text></View>}
          </View>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` }]} />
            </View>
            <Text style={styles.progressCount}>{answered}/{item.questionCount}</Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSub}>All 15 dimensions of longevity</Text>
        </View>

        <View style={styles.overallCard}>
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Overall Progress</Text>
            <Text style={styles.overallCount}>{totalAnswered} / {totalQuestions}</Text>
          </View>
          <View style={styles.overallTrack}>
            <View style={[
              styles.overallFill,
              { width: totalQuestions > 0 ? `${Math.round((totalAnswered / totalQuestions) * 100)}%` : '0%' }
            ]} />
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={categoryMeta}
        keyExtractor={item => item.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<RecommendationCard choices={choices} archetype={user?.primaryArchetype} />}
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
  overallCard: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 8,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  overallLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.3, textTransform: 'uppercase' },
  overallCount: { fontSize: 14, fontWeight: '700', color: colors.secondary },
  overallTrack: {
    height: 8,
    backgroundColor: colors.outlineVariant,
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  overallFill: {
    height: 8,
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  list: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  icon: { fontSize: 24 },
  rowContent: { flex: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: -0.2,
  },
  doneBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  doneBadgeText: { fontSize: 11, fontWeight: '700', color: colors.white },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.outlineVariant,
    borderRadius: 3,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  progressCount: {
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
    fontWeight: '700',
  },
  chevron: {
    fontSize: 20,
    color: colors.secondary,
    marginLeft: 12,
    fontWeight: '600',
  },
});
