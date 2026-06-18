import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { categoryMeta, allQuestions } from '../data/all-questions';
import { colors, fonts, radii, shadow } from '../theme';
import { getLatestUniqueChoices, normalizeUserChoice } from '../utils/longevity';
import { UserChoice } from '../types/index';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { Header } from '../components/Header';

const categoryLookup = Object.fromEntries(categoryMeta.map(c => [c.id, c]));
const questionLookup = Object.fromEntries(allQuestions.map(q => [q.id, q.question]));

const ACCENT_PALETTE = [colors.terracotta, colors.sage, '#C49B6C', '#8B7355', '#A35C4A'];
const accentForCategory = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length];
};

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(date);
}

type Sort = 'recent' | 'category';

export const JournalScreen: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
  const [choices, setChoices] = useState<UserChoice[]>([]);
  const [sort, setSort] = useState<Sort>('recent');

  const loadJournal = async () => {
    try {
      const rows = await db.getUserChoices(userId).catch(() => []);
      const normalized = getLatestUniqueChoices((rows ?? []).map(normalizeUserChoice))
        .filter(c => Boolean(c.reflection?.trim()));
      setChoices(normalized);
    } catch { setChoices([]); }
  };

  useEffect(() => { loadJournal(); }, [userId]);
  useFocusEffect(React.useCallback(() => { loadJournal(); }, [userId]));

  const sorted = useMemo(() => {
    const arr = [...choices];
    if (sort === 'recent') {
      arr.sort((a, b) => (new Date(b.timestamp).getTime()) - (new Date(a.timestamp).getTime()));
    } else {
      arr.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }
    return arr;
  }, [choices, sort]);

  const renderCard = ({ item }: { item: UserChoice }) => {
    const cat = categoryLookup[item.category || ''];
    const accent = accentForCategory(item.category || '');
    return (
      <View style={[styles.card, { borderLeftColor: accent }]}>
        <View style={styles.cardTop}>
          <Text style={[styles.catBadge, { color: accent }]}>
            {cat?.label?.toUpperCase() ?? 'REFLECTION'}
          </Text>
          <Text style={styles.ts}>{formatTimestamp(new Date(item.timestamp))}</Text>
        </View>
        <Text style={styles.question}>{questionLookup[item.questionId] ?? 'Reflection'}</Text>
        <Text style={styles.reflection}>"{item.reflection}"</Text>
        <View style={styles.cardFoot}>
          <Text style={styles.choice}>Chose {item.choice}</Text>
          {item.selectedArchetype && (
            <Text style={styles.arche}>{item.selectedArchetype}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="Journal" subtitle="Your reflections, patterns, and notes" />

        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setSort('recent')}
            style={[styles.chip, sort === 'recent' && styles.chipActive]}
          >
            <Text style={[styles.chipTxt, sort === 'recent' && styles.chipTxtActive]}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSort('category')}
            style={[styles.chip, sort === 'category' && styles.chipActive]}
          >
            <Text style={[styles.chipTxt, sort === 'category' && styles.chipTxtActive]}>By category</Text>
          </TouchableOpacity>
          <Text style={styles.count}>{sorted.length} {sorted.length === 1 ? 'note' : 'notes'}</Text>
        </View>

        <FlatList
          data={sorted}
          keyExtractor={i => i.id}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No reflections yet</Text>
              <Text style={styles.emptySub}>
                When you add a note after answering a question, it will appear here as part of your journal.
              </Text>
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
  filterRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: colors.hairline, marginRight: 8,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipTxt: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft, letterSpacing: 0.4 },
  chipTxtActive: { color: colors.cream },
  count: { marginLeft: 'auto', fontFamily: fonts.sans, fontSize: 12, color: colors.inkMuted },
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  card: {
    backgroundColor: colors.card, borderRadius: radii.lg, padding: 20,
    borderWidth: 1, borderColor: colors.hairlineSoft, borderLeftWidth: 3,
    ...shadow.soft,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  catBadge: { fontFamily: fonts.sans, fontSize: 10, letterSpacing: 1.4, fontWeight: '600' },
  ts: { fontFamily: fonts.sans, fontSize: 11, color: colors.inkMuted },
  question: { fontFamily: fonts.serif, fontSize: 17, color: colors.ink, lineHeight: 24, marginBottom: 10 },
  reflection: { fontFamily: fonts.serif, fontSize: 15, fontStyle: 'italic', color: colors.inkSoft, lineHeight: 23 },
  cardFoot: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.hairlineSoft,
  },
  choice: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft, letterSpacing: 0.3 },
  arche: { fontFamily: fonts.sans, fontSize: 11, color: colors.sage, textTransform: 'uppercase', letterSpacing: 1 },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 22, color: colors.ink, marginBottom: 8, textAlign: 'center' },
  emptySub: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkSoft, lineHeight: 22, textAlign: 'center' },
});
