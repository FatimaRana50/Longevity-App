import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getQuestionsByCategory } from '../data/all-questions';
import { QuestionCard } from '../components/QuestionCard';
import { Question, UserChoice } from '../types/index';
import { db } from '../services/supabase';
import { useUser } from '../context/UserContext';
import { colors, fonts } from '../theme';
import { ExploreStackParamList } from './ExploreScreen';
import { Alert } from 'react-native';

type CategoryRoute = RouteProp<ExploreStackParamList, 'CategoryQuestions'>;

export const CategoryQuestionsScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const route = useRoute<CategoryRoute>();
  const { categoryId, categoryLabel, categoryIcon } = route.params;

  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';
  const questions: Question[] = getQuestionsByCategory(categoryId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, UserChoice>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    loadChoices();
  }, []);

  const loadChoices = async () => {
    try {
      const choices = await db.getUserChoices(userId).catch(() => []);
      const map: Record<string, UserChoice> = {};
      choices?.forEach((c: any) => {
        map[c.question_id] = {
          id: c.id,
          userId: c.user_id,
          questionId: c.question_id,
          category: c.category ?? categoryId,
          choice: c.choice,
          reflection: c.reflection,
          timestamp: new Date(c.timestamp),
        };
      });
      setUserChoices(map);

      // Find first unanswered question
      const firstUnanswered = questions.findIndex(q => !map[q.id]);
      if (firstUnanswered === -1 && questions.length > 0) {
        setFinished(true);
      } else if (firstUnanswered > 0) {
        setCurrentIndex(firstUnanswered);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAnswer = async (choice: 'A' | 'B', reflection?: string) => {
    const q = questions[currentIndex];
    setLoading(true);
    try {
      const newChoice: UserChoice = {
        id: `${userId}_${q.id}`,
        userId,
        questionId: q.id,
        category: q.category,
        choice,
        reflection,
        selectedArchetype: choice === 'A' ? q.optionA.insight.archetype : q.optionB.insight.archetype,
        timestamp: new Date(),
      };
      setUserChoices(prev => ({ ...prev, [q.id]: newChoice }));
      await db.saveChoice(userId, q.id, choice, reflection, q.category, choice === 'A' ? q.optionA.insight.archetype : q.optionB.insight.archetype);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setFinished(true);
      }
    } catch (error) {
      console.warn('Failed to save category choice:', error);
      Alert.alert('Could not save answer', 'Check your Supabase connection and database policies, then try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (finished) {
    const answeredCount = questions.filter(q => userChoices[q.id]).length;
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{categoryIcon} {categoryLabel}</Text>
            <View style={{ width: 36 }} />
          </View>
        </SafeAreaView>
        <View style={styles.finishedWrap}>
          <Text style={styles.finishedEmoji}>🎉</Text>
          <Text style={styles.finishedTitle}>Category Complete!</Text>
          <Text style={styles.finishedSub}>
            You answered all {answeredCount} questions in {categoryLabel}
          </Text>
          <TouchableOpacity style={styles.restartBtn} onPress={() => {
            setCurrentIndex(0);
            setFinished(false);
          }}>
            <Text style={styles.restartBtnText}>Review Questions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backToExplore} onPress={() => navigation.goBack()}>
            <Text style={styles.backToExploreText}>Back to Explore</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const answeredInCategory = questions.filter(q => userChoices[q.id]).length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryIcon} {categoryLabel}</Text>
          <Text style={styles.headerProgress}>{answeredInCategory}/{questions.length}</Text>
        </View>
      </SafeAreaView>

      {questions[currentIndex] ? (
        <QuestionCard
          question={questions[currentIndex]}
          onChoice={handleAnswer}
          answeredCount={answeredInCategory}
          totalQuestions={questions.length}
          loading={loading}
        />
      ) : (
        <View style={styles.center}>
          <Text style={{ color: colors.textMuted }}>No questions available in this category.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '4D',
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 28, color: colors.textSecondary, lineHeight: 30 },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerProgress: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'right',
  },
  finishedWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  finishedEmoji: { fontSize: 56, marginBottom: 16 },
  finishedTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  finishedSub: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  restartBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 12,
  },
  restartBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  backToExplore: {
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  backToExploreText: { color: colors.textSecondary, fontSize: 15, fontWeight: '600' },
});
