import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
// @ts-ignore
import { Ionicons } from '@expo/vector-icons';
import { Question, UserChoice } from '../types/index';
import { db } from '../services/supabase';
import { allQuestions } from '../data/all-questions';
import { getDailySelection } from '../services/daily';
import { useUser } from '../context/UserContext';
import { colors, fonts, radii, shadow } from '../theme';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { PremiumButton } from '../components/PremiumButton';
import { ProgressBar } from '../components/ProgressBar';
import { TopHeader } from '../components/TopHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { SuggestionCard } from '../components/SuggestionCard';
import { getCategoryImage } from '../utils/categoryImages';

export const QuestionScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<any>();
  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, UserChoice>>({});
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => { loadQuestions(); }, []);

  const loadQuestions = async () => {
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const daily = await getDailySelection(userId, dateStr, 3).catch(() => allQuestions.slice(0, 3));
      setQuestions(daily.filter(Boolean));
      const choices = await db.getUserChoices(userId).catch(() => []);
      const map: Record<string, UserChoice> = {};
      choices?.forEach((c: any) => { map[c.question_id] = c; });
      setUserChoices(map);
    } finally {
      setInitialLoading(false);
    }
  };

  const q = questions[currentIndex];
  const answeredCount = questions.filter(qq => userChoices[qq.id]).length;

  const handleSubmit = async () => {
    if (!q || !selected) return;
    setSaving(true);
    try {
      const archetype = selected === 'A' ? q.optionA.insight.archetype : q.optionB.insight.archetype;
      setUserChoices(prev => ({
        ...prev,
        [q.id]: {
          id: `${userId}_${q.id}`, userId, questionId: q.id, category: q.category,
          choice: selected, reflection, selectedArchetype: archetype, timestamp: new Date(),
        },
      }));
      await db.saveChoice(userId, q.id, selected, reflection, q.category, archetype);
      setSelected(null);
      setReflection('');
      if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    } catch (e) {
      Alert.alert('Could not save', 'Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <BotanicalBackdrop variant="subtle" />
        <SafeAreaView style={styles.center}><ActivityIndicator color={colors.terracotta} /></SafeAreaView>
      </View>
    );
  }

  if (!q) {
    return (
      <View style={styles.container}>
        <BotanicalBackdrop variant="full" />
        <SafeAreaView style={styles.center}>
          <Text style={styles.emptyTitle}>You're complete for today</Text>
          <Text style={styles.emptySub}>Return tomorrow for new reflections.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const handleNavTab = (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => {
    if (tab === 'daily') return;
    navigation.navigate(tab === 'explore' ? 'LibraryTab' : tab === 'journal' ? 'JournalTab' : tab === 'profile' ? 'ProfileTab' : 'MoreTab');
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
            <Text style={styles.progressMeta}>{answeredCount}/{questions.length} today</Text>
          </View>
          <View style={styles.progressBarWrap}>
            <ProgressBar value={(currentIndex + 1) / Math.max(1, questions.length)} />
          </View>

          {/* Category image hero with overlaid question */}
          <View style={styles.heroWrap}>
            <Image
              source={getCategoryImage(q.category || 'sleep')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.categoryTag}>{q.category}</Text>
              <View>
                <Text style={styles.heroQuestion}>{q.question}</Text>
              </View>
            </View>
          </View>

          <OptionCard
            label="A"
            text={q.optionA.text}
            selected={selected === 'A'}
            onPress={() => setSelected('A')}
          />
          <OptionCard
            label="B"
            text={q.optionB.text}
            selected={selected === 'B'}
            onPress={() => setSelected('B')}
          />

          {selected && (
            <View style={styles.insightWrap}>
              <Text style={styles.insightLabel}>
                {selected === 'A' ? q.optionA.insight.archetype : q.optionB.insight.archetype}
              </Text>
              <Text style={styles.insightText}>
                {selected === 'A' ? q.optionA.insight.scienceSays : q.optionB.insight.scienceSays}
              </Text>
            </View>
          )}

          <Text style={styles.reflectionLabel}>Add a reflection (optional)</Text>
          <TextInput
            style={styles.reflectionInput}
            placeholder="What drew you to this choice?"
            placeholderTextColor={colors.inkMuted}
            value={reflection}
            onChangeText={setReflection}
            multiline
            textAlignVertical="top"
          />

          <PremiumButton
            label={currentIndex < questions.length - 1 ? 'Continue' : 'Complete Today'}
            onPress={handleSubmit}
            disabled={!selected}
            loading={saving}
            style={{ marginTop: 24 }}
          />

          <View style={styles.suggestionWrap}>
            <SuggestionCard />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNavigation active="daily" onPress={handleNavTab} />
    </View>
  );
};

const OptionCard: React.FC<{
  label: 'A' | 'B'; text: string; selected: boolean; onPress: () => void;
}> = ({ label, text, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.option, selected && styles.optionSelected]}
  >
    <View style={[styles.optionBadge, selected && styles.optionBadgeSelected]}>
      <Text style={[styles.optionBadgeTxt, selected && { color: colors.cream }]}>{label}</Text>
    </View>
    <Text style={[styles.optionTxt, selected && { color: colors.ink }]}>{text}</Text>
    <Ionicons name="arrow-forward" size={20} color={selected ? colors.terracotta : colors.inkSoft} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  progressRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 8,
  },
  progressLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft, letterSpacing: 0.5 },
  progressMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft },
  progressBarWrap: { paddingHorizontal: 24, marginBottom: 24 },
  scroll: { paddingHorizontal: 24, paddingBottom: 60 },
  categoryTag: {
    alignSelf: 'flex-start',
    fontFamily: fonts.sans, fontSize: 11, letterSpacing: 1.2,
    textTransform: 'uppercase', color: colors.sage,
    backgroundColor: colors.cardWarm,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    marginBottom: 8,
  },
  question: {
    fontFamily: fonts.serif, fontSize: 28, lineHeight: 38,
    color: colors.ink, marginBottom: 32, letterSpacing: -0.4,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: radii.lg, borderWidth: 2, borderColor: colors.hairline,
    borderLeftWidth: 4, borderLeftColor: colors.hairline,
    padding: 20, marginBottom: 14, flexDirection: 'row', alignItems: 'flex-start',
    ...shadow.soft,
  },
  optionSelected: {
    borderColor: colors.terracotta,
    borderLeftColor: colors.terracotta,
    backgroundColor: colors.cardWarm,
    shadowColor: colors.terracotta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  optionBadge: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1.5, borderColor: colors.hairline,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  optionBadgeSelected: { backgroundColor: colors.terracotta, borderColor: colors.terracotta },
  optionBadgeTxt: { fontFamily: fonts.serif, fontSize: 14, color: colors.inkSoft },
  optionTxt: { flex: 1, fontFamily: fonts.sans, fontSize: 16, lineHeight: 24, color: colors.inkSoft, paddingTop: 4 },
  reflectionLabel: {
    fontFamily: fonts.sans, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
    color: colors.inkSoft, marginTop: 28, marginBottom: 10,
  },
  reflectionInput: {
    minHeight: 96, padding: 16, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.hairline, backgroundColor: colors.card,
    fontFamily: fonts.sans, fontSize: 15, color: colors.ink, lineHeight: 22,
  },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 26, color: colors.ink, textAlign: 'center' },
  emptySub: { fontFamily: fonts.sans, fontSize: 15, color: colors.inkSoft, marginTop: 8, textAlign: 'center' },
  heroWrap: { borderRadius: radii.lg, overflow: 'hidden', marginBottom: 20, height: 320, justifyContent: 'flex-start' },
  heroImage: { position: 'absolute', width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)' },
  heroContent: { padding: 20, paddingTop: 24, zIndex: 1, justifyContent: 'flex-start', flex: 1 },
  heroQuestion: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 30, color: colors.cream, marginTop: 8, marginRight: 80, letterSpacing: -0.4 },
  insightWrap: { marginTop: 16, padding: 16, backgroundColor: colors.cardWarm, borderRadius: radii.md, borderLeftWidth: 3, borderLeftColor: colors.terracotta },
  insightLabel: { fontFamily: fonts.sans, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.terracotta, marginBottom: 4 },
  insightText: { fontFamily: fonts.serif, fontSize: 16, color: colors.ink, lineHeight: 24 },
  suggestionWrap: { marginTop: 32, marginBottom: 40 },
});
