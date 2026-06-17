import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { QuestionCard } from '../components/QuestionCard';
import { Question, UserChoice } from '../types/index';
import { db } from '../services/supabase';
import { allQuestions } from '../data/all-questions';
import { getDailySelection } from '../services/daily';
import { colors, fonts } from '../theme';
import { useUser } from '../context/UserContext';

export const QuestionScreen: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, UserChoice>>({});
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

  useEffect(() => {
    if (questions.length === 0) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex >= questions.length) {
      setCurrentIndex(0);
    }
  }, [questions]);

  const handleSubmitAnswer = async (choice: 'A' | 'B', reflection?: string) => {
    const q = questions[currentIndex];
    try {
      setUserChoices(prev => ({
        ...prev,
        [q.id]: {
          id: `${userId}_${q.id}`, userId,
          questionId: q.id, category: q.category, choice, reflection,
          selectedArchetype: choice === 'A' ? q.optionA.insight.archetype : q.optionB.insight.archetype,
          timestamp: new Date(),
        },
      }));
      await db.saveChoice(userId, q.id, choice, reflection, q.category, choice === 'A' ? q.optionA.insight.archetype : q.optionB.insight.archetype);
    } catch (error) {
      console.warn('Failed to save choice:', error);
      Alert.alert('Could not save answer', 'Check your connection and try again.');
    }
  };

  const handleContinue = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      Alert.alert('Complete!', `You finished all ${questions.length} questions.`);
      setCurrentIndex(0);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerIcon}>🌿</Text>
            <Text style={styles.headerTitle}>Longevity</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? 'U'}</Text>
          </View>
        </View>
      </SafeAreaView>

      {questions[currentIndex] ? (
        <QuestionCard
          question={questions[currentIndex]}
          onSubmitAnswer={handleSubmitAnswer}
          onContinue={handleContinue}
          answeredCount={Object.keys(userChoices).length}
          totalQuestions={questions.length}
          loading={false}
        />
      ) : (
        <View style={styles.center}>
          <Text style={{ color: colors.textMuted }}>No questions available for today.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safeArea: { backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.background,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { fontSize: 22 },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});
