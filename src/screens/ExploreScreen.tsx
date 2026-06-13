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

export type ExploreStackParamList = {
  ExploreHome: undefined;
  CategoryQuestions: { categoryId: string; categoryLabel: string; categoryIcon: string };
};

export const ExploreScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const [answeredByCategory, setAnsweredByCategory] = useState<Record<string, number>>({});

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
      const choices = await db.getUserChoices(userId).catch(() => []);
      const counts: Record<string, number> = {};
      getLatestUniqueChoices((choices ?? []).map(normalizeUserChoice)).forEach(c => {
        const cat = c.category || '';
        counts[cat] = (counts[cat] || 0) + 1;
      });
      setAnsweredByCategory(counts);
    } catch {
      // silent — progress is optional
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
  overallCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overallLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  overallCount: { fontSize: 13, fontWeight: '600', color: colors.secondary },
  overallTrack: {
    height: 6,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 3,
    overflow: 'hidden',
  },
  overallFill: {
    height: 6,
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 22 },
  rowContent: { flex: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  doneBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  doneBadgeText: { fontSize: 11, fontWeight: '700', color: colors.onSecondaryContainer },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  progressCount: {
    fontSize: 11,
    color: colors.textMuted,
    minWidth: 36,
    textAlign: 'right',
  },
  chevron: {
    fontSize: 22,
    color: colors.textMuted,
    marginLeft: 8,
  },
});
