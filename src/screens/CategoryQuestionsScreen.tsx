import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getQuestionsByCategory } from '../data/all-questions';
import { Question, UserChoice } from '../types/index';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { colors, fonts, radii, shadow } from '../theme';
import { ExploreStackParamList } from './ExploreScreen';
import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { TopHeader } from '../components/TopHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { PremiumButton } from '../components/PremiumButton';
import { ProgressBar } from '../components/ProgressBar';
import { getCategoryImage } from '../utils/categoryImages';

type CategoryRoute = RouteProp<ExploreStackParamList, 'CategoryQuestions'>;

export const CategoryQuestionsScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const route = useRoute<CategoryRoute>();
  const { categoryId, categoryLabel } = route.params;

  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
  const questions: Question[] = getQuestionsByCategory(categoryId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, UserChoice>>({});
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => { loadChoices(); }, []);

  const loadChoices = async () => {
    try {
      const choices = await db.getUserChoices(userId).catch(() => []);
      const map: Record<string, UserChoice> = {};
      choices?.forEach((c: any) => {
        map[c.question_id] = {
          id: c.id, userId: c.user_id, questionId: c.question_id,
          category: c.category ?? categoryId, choice: c.choice, reflection: c.reflection,
          timestamp: new Date(c.timestamp),
        };
      });
      setUserChoices(map);
      const firstUnanswered = questions.findIndex(q => !map[q.id]);
      if (firstUnanswered === -1 && questions.length > 0) setFinished(true);
      else if (firstUnanswered > 0) setCurrentIndex(firstUnanswered);
    } finally {
      setInitialLoading(false);
    }
  };

  const q = questions[currentIndex];

  const handleAnswer = async () => {
    if (!q || !selected) return;
    setSaving(true);
    try {
      const archetype = selected === 'A' ? q.optionA.insight.archetype : q.optionB.insight.archetype;
      const newChoice: UserChoice = {
        id: `${userId}_${q.id}`, userId, questionId: q.id, category: q.category,
        choice: selected, reflection, selectedArchetype: archetype, timestamp: new Date(),
      };
      setUserChoices(prev => ({ ...prev, [q.id]: newChoice }));
      await db.saveChoice(userId, q.id, selected, reflection, q.category, archetype);
      setSelected(null);
      setReflection('');
      if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
      else setFinished(true);
    } catch {
      Alert.alert('Could not save', 'Please try again.');
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

  const handleNavTab = (tab: 'daily' | 'explore' | 'journal' | 'profile' | 'more') => {
    if (tab === 'explore') return;
    const tabName = tab === 'daily' ? 'TodayTab' : tab === 'journal' ? 'JournalTab' : tab === 'profile' ? 'ProfileTab' : 'MoreTab';
    navigation.getParent()?.navigate(tabName as any);
  };

  if (finished || !q) {
    return (
      <View style={styles.container}>
        <BotanicalBackdrop variant="full" />
        <TopHeader
          userName={user?.name}
          onProfilePress={() => handleNavTab('profile')}
          onMenuPress={() => {}}
        />
        <View style={styles.center}>
          <Text style={styles.doneTitle}>Category Complete</Text>
          <Text style={styles.doneSub}>You've reflected on every question in {categoryLabel}.</Text>
          <PremiumButton label="Back to Explore" onPress={() => navigation.goBack()} style={{ marginTop: 28 }} />
        </View>
        <BottomNavigation active="explore" onPress={handleNavTab} />
      </View>
    );
  }

  const pct = (currentIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BotanicalBackdrop variant="subtle" />
      <TopHeader
        userName={user?.name}
        onProfilePress={() => handleNavTab('profile')}
        onMenuPress={() => {}}
      />

      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Question {currentIndex + 1} of {questions.length}</Text>
        <View style={{ marginTop: 8 }}><ProgressBar value={pct} /></View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category image hero with overlaid question */}
          <View style={styles.heroWrap}>
            <Image
              source={getCategoryImage(categoryId)}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroQuestion}>{q.question}</Text>
            </View>
          </View>

          {(['A', 'B'] as const).map(letter => {
            const opt = letter === 'A' ? q.optionA : q.optionB;
            const sel = selected === letter;
            return (
              <TouchableOpacity
                key={letter}
                activeOpacity={0.85}
                onPress={() => setSelected(letter)}
                style={[styles.option, sel && styles.optionSel]}
              >
                <View style={[styles.badge, sel && styles.badgeSel]}>
                  <Text style={[styles.badgeTxt, sel && { color: colors.cream }]}>{letter}</Text>
                </View>
                <Text style={styles.optionTxt}>{opt.text}</Text>
              </TouchableOpacity>
            );
          })}

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

          <Text style={styles.label}>Reflection (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="A note for your journal…"
            placeholderTextColor={colors.inkMuted}
            value={reflection}
            onChangeText={setReflection}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.navRow}>
            <PremiumButton
              label="Previous"
              variant="ghost"
              onPress={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              style={{ flex: 1, marginRight: 8 }}
            />
            <PremiumButton
              label={currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
              onPress={handleAnswer}
              disabled={!selected}
              loading={saving}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNavigation active="explore" onPress={handleNavTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  progressWrap: { paddingHorizontal: 24, marginBottom: 20 },
  progressLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft, letterSpacing: 0.5 },
  scroll: { paddingHorizontal: 24, paddingBottom: 60 },
  question: {
    fontFamily: fonts.serif, fontSize: 26, lineHeight: 36, color: colors.ink,
    marginBottom: 24, letterSpacing: -0.3,
  },
  option: {
    backgroundColor: colors.card, borderRadius: radii.lg, padding: 18,
    borderWidth: 1, borderColor: colors.hairline, marginBottom: 12,
    flexDirection: 'row', alignItems: 'flex-start', ...shadow.soft,
  },
  optionSel: { borderColor: colors.terracotta, backgroundColor: colors.cardWarm },
  badge: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1.5,
    borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  badgeSel: { backgroundColor: colors.terracotta, borderColor: colors.terracotta },
  badgeTxt: { fontFamily: fonts.serif, fontSize: 13, color: colors.inkSoft },
  optionTxt: { flex: 1, fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.inkSoft, paddingTop: 4 },
  label: {
    fontFamily: fonts.sans, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
    color: colors.inkSoft, marginTop: 24, marginBottom: 8,
  },
  input: {
    minHeight: 84, padding: 14, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.hairline, backgroundColor: colors.card,
    fontFamily: fonts.sans, fontSize: 15, color: colors.ink, lineHeight: 22,
  },
  navRow: { flexDirection: 'row', marginTop: 24 },
  doneTitle: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink, textAlign: 'center' },
  doneSub: { fontFamily: fonts.sans, fontSize: 15, color: colors.inkSoft, marginTop: 10, textAlign: 'center', lineHeight: 22 },
  heroWrap: { borderRadius: radii.lg, overflow: 'hidden', marginBottom: 20, height: 320, justifyContent: 'flex-end' },
  heroImage: { position: 'absolute', width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)' },
  heroContent: { padding: 16, zIndex: 1 },
  heroQuestion: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 36, color: colors.cream, letterSpacing: -0.4 },
  insightWrap: { marginTop: 16, padding: 16, backgroundColor: colors.cardWarm, borderRadius: radii.md, borderLeftWidth: 3, borderLeftColor: colors.terracotta },
  insightLabel: { fontFamily: fonts.sans, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.terracotta, marginBottom: 4 },
  insightText: { fontFamily: fonts.serif, fontSize: 16, color: colors.ink, lineHeight: 24 },
});
