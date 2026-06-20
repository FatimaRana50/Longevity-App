import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { categoryMeta, allQuestions } from '../data/all-questions';
import { colors, fonts, radii, shadow } from '../theme';
import { getLatestUniqueChoices, normalizeUserChoice } from '../utils/longevity';
import { UserChoice } from '../types/index';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { TopHeader } from '../components/TopHeader';
import { BottomNavigation } from '../components/BottomNavigation';

const categoryLookup = Object.fromEntries(categoryMeta.map(c => [c.id, c]));
const questionLookup = Object.fromEntries(allQuestions.map(q => [q.id, q.question]));

const ACCENT_PALETTE = [colors.terracotta, colors.sage, '#C49B6C', '#8B7355', '#A35C4A'];
const accentForCategory = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length];
};

// Pick an icon for each category id. Falls back to a leaf glyph.
const iconForCategory = (id: string): { lib: 'ion' | 'mc' | 'feather'; name: string } => {
  const key = (id || '').toLowerCase();
  if (key.includes('nutri') || key.includes('food') || key.includes('diet'))
    return { lib: 'ion', name: 'nutrition-outline' };
  if (key.includes('age') || key.includes('long'))
    return { lib: 'mc', name: 'leaf' };
  if (key.includes('sleep')) return { lib: 'ion', name: 'moon-outline' };
  if (key.includes('move') || key.includes('fit') || key.includes('exer'))
    return { lib: 'ion', name: 'fitness-outline' };
  if (key.includes('mind') || key.includes('stress'))
    return { lib: 'mc', name: 'meditation' };
  return { lib: 'mc', name: 'leaf' };
};

const CategoryIcon: React.FC<{ id: string; color: string; size?: number }> = ({
  id,
  color,
  size = 22,
}) => {
  const ic = iconForCategory(id);
  if (ic.lib === 'ion') return <Ionicons name={ic.name as any} size={size} color={color} />;
  if (ic.lib === 'feather') return <Feather name={ic.name as any} size={size} color={color} />;
  return <MaterialCommunityIcons name={ic.name as any} size={size} color={color} />;
};

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(date);
}

type Sort = 'recent' | 'category';

export const JournalScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<any>();
  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
  const [choices, setChoices] = useState<UserChoice[]>([]);
  const [sort, setSort] = useState<Sort>('recent');
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

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

  const toggleBookmark = (id: string) =>
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));

  const renderCard = ({ item, index }: { item: UserChoice; index: number }) => {
    const cat = categoryLookup[item.category || ''];
    const accent = accentForCategory(item.category || '');
    const isBookmarked = !!bookmarked[item.id];
    const showLeaves = index === 0; // hero card has watercolor leaves

    const CardInner = (
      <>
        {/* Bookmark ribbon */}
        <TouchableOpacity
          onPress={() => toggleBookmark(item.id)}
          style={[styles.ribbon, isBookmarked && { backgroundColor: colors.sage }]}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isBookmarked ? 'star' : 'star-outline'}
            size={14}
            color={isBookmarked ? colors.cream : colors.inkMuted}
          />
        </TouchableOpacity>

        <View style={styles.cardTop}>
          <View style={[styles.iconCircle, { backgroundColor: `${accent}22` }]}>
            <CategoryIcon id={item.category || ''} color={accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.catBadge, { color: accent }]}>
              {cat?.label?.toUpperCase() ?? 'REFLECTION'}
            </Text>
          </View>
          <Text style={styles.ts}>{formatTimestamp(new Date(item.timestamp))}</Text>
        </View>

        <Text style={styles.question}>{questionLookup[item.questionId] ?? 'Reflection'}</Text>

        <View style={styles.reflectionRow}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.reflection}>{item.reflection}</Text>
          <Text style={styles.quoteMarkEnd}>”</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFoot}>
          <View style={styles.choiceWrap}>
            <View style={[styles.choiceIcon, { backgroundColor: `${accent}22` }]}>
              <Feather
                name={index === 0 ? 'arrow-down-right' : 'chevron-right'}
                size={14}
                color={accent}
              />
            </View>
            <Text style={styles.choice}>Choose {item.choice}</Text>
          </View>

          {item.selectedArchetype && (
            <View style={[styles.archePill, { backgroundColor: `${accent}1A` }]}>
              <MaterialCommunityIcons
                name={index === 0 ? 'leaf' : 'lightning-bolt'}
                size={12}
                color={accent}
              />
              <Text style={[styles.arche, { color: accent }]}>{item.selectedArchetype}</Text>
            </View>
          )}
        </View>
      </>
    );

    return (
      <View style={[styles.card, { borderLeftColor: accent, borderLeftWidth: index === 0 ? 0 : 4 }]}>
        {showLeaves ? (
          <ImageBackground
            source={require('../../assets/journal-leaves.png')}
            style={styles.cardBgInner}
            imageStyle={styles.cardBgImg}
            resizeMode="contain"
            blurRadius={7}
          >
            {CardInner}
          </ImageBackground>
        ) : (
          <View style={styles.cardBgInner}>{CardInner}</View>
        )}
      </View>
    );
  };

  const handleNavTab = (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => {
    if (tab === 'journal') return;
    navigation.navigate(
      tab === 'daily' ? 'TodayTab' :
      tab === 'explore' ? 'LibraryTab' :
      tab === 'profile' ? 'ProfileTab' : 'MoreTab'
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />
      <TopHeader
        userName={user?.name}
        onProfilePress={() => navigation.navigate('ProfileTab')}
        onMenuPress={() => {}}
      />

      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setSort('recent')}
          style={[styles.chip, sort === 'recent' && styles.chipActive]}
          activeOpacity={0.85}
        >
          <Ionicons
            name="time-outline"
            size={14}
            color={sort === 'recent' ? colors.cream : colors.inkSoft}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.chipTxt, sort === 'recent' && styles.chipTxtActive]}>Recent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSort('category')}
          style={[styles.chip, sort === 'category' && styles.chipActive]}
          activeOpacity={0.85}
        >
          <Ionicons
            name="grid-outline"
            size={14}
            color={sort === 'category' ? colors.cream : colors.inkSoft}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.chipTxt, sort === 'category' && styles.chipTxtActive]}>By category</Text>
        </TouchableOpacity>

        <View style={styles.countWrap}>
          <Feather name="edit-2" size={13} color={colors.terracotta} style={{ marginRight: 4 }} />
          <Text style={styles.count}>
            {sorted.length} {sorted.length === 1 ? 'note' : 'notes'}
          </Text>
        </View>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={i => i.id}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListFooterComponent={
          sorted.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('TodayTab')}
              style={styles.promoCard}
            >
              <Image
                source={require('../../assets/journal-sprout.png')}
                style={styles.promoImg}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.promoTitle}>
                  Your reflections build your roadmap to longevity.
                </Text>
                <View style={styles.promoCta}>
                  <Text style={styles.promoCtaTxt}>KEEP EXPLORING</Text>
                  <Feather name="arrow-right" size={14} color={colors.terracotta} style={{ marginLeft: 6 }} />
                </View>
              </View>
              <View style={styles.promoBadge}>
                <MaterialCommunityIcons name="leaf" size={20} color={colors.cream} />
              </View>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No reflections yet</Text>
            <Text style={styles.emptySub}>
              When you add a note after answering a question, it will appear here as part of your journal.
            </Text>
          </View>
        }
      />

      <BottomNavigation active="journal" onPress={handleNavTab} />
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
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999,
    borderWidth: 1, borderColor: colors.hairline, marginRight: 8,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  chipTxt: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft, letterSpacing: 0.4 },
  chipTxtActive: { color: colors.cream, fontWeight: '600' },
  countWrap: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' },
  count: { fontFamily: fonts.sans, fontSize: 12, color: colors.terracotta, fontWeight: '600' },

  list: { paddingHorizontal: 20, paddingBottom: 32 },

  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
    overflow: 'hidden',
    position: 'relative',
    ...shadow.soft,
  },
  cardBgInner: { padding: 20, paddingTop: 22 },
  cardBgImg: {
    opacity: 0.55,
    top: 40,
    left: undefined,
    right: -40,
    width: 220,
    height: 260,
    position: 'absolute',
  },

  ribbon: {
    position: 'absolute',
    top: 0, right: 18,
    width: 26, height: 36,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.hairline,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 2,
  },

  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  catBadge: {
    fontFamily: fonts.sans, fontSize: 11, letterSpacing: 1.6, fontWeight: '700',
  },
  ts: { fontFamily: fonts.sans, fontSize: 11, color: colors.inkMuted, marginRight: 32 },

  question: {
    fontFamily: fonts.serif, fontSize: 17, color: colors.ink,
    lineHeight: 26, marginBottom: 14,
  },

  reflectionRow: { flexDirection: 'row', alignItems: 'flex-start' },
  quoteMark: {
    fontFamily: fonts.serif, fontSize: 26, color: `${colors.terracotta}88`,
    lineHeight: 26, marginRight: 4, marginTop: -2,
  },
  quoteMarkEnd: {
    fontFamily: fonts.serif, fontSize: 26, color: `${colors.terracotta}88`,
    lineHeight: 26, marginLeft: 2, marginTop: -2,
  },
  reflection: {
    flex: 1,
    fontFamily: fonts.serif, fontSize: 15, fontStyle: 'italic',
    color: colors.inkSoft, lineHeight: 23,
  },

  divider: {
    height: 1, backgroundColor: colors.hairlineSoft, marginTop: 16, marginBottom: 12,
  },

  cardFoot: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  choiceWrap: { flexDirection: 'row', alignItems: 'center' },
  choiceIcon: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  choice: {
    fontFamily: fonts.sans, fontSize: 13, color: colors.ink, letterSpacing: 0.3,
  },
  archePill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  arche: {
    fontFamily: fonts.sans, fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1.2, marginLeft: 5,
  },

  // Promo / "Keep exploring" card
  promoCard: {
    marginTop: 18,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F1ECE0',
    borderRadius: radii.lg,
    padding: 16, paddingRight: 18,
    ...shadow.soft,
  },
  promoImg: { width: 78, height: 78, marginRight: 10 },
  promoTitle: {
    fontFamily: fonts.serif, fontSize: 14, color: colors.ink,
    lineHeight: 20, marginBottom: 8,
  },
  promoCta: { flexDirection: 'row', alignItems: 'center' },
  promoCtaTxt: {
    fontFamily: fonts.sans, fontSize: 11, fontWeight: '700',
    color: colors.terracotta, letterSpacing: 1.6,
  },
  promoBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.sage,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 10,
  },

  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: {
    fontFamily: fonts.serif, fontSize: 22, color: colors.ink,
    marginBottom: 8, textAlign: 'center',
  },
  emptySub: {
    fontFamily: fonts.sans, fontSize: 14, color: colors.inkSoft,
    lineHeight: 22, textAlign: 'center',
  },
});
