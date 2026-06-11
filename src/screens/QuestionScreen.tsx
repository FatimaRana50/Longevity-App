import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QuestionCard } from '../components/QuestionCard';
import { Question, UserChoice } from '../types/index';
import { db } from '../services/supabase';
import { nutritionQuestions } from '../data/nutrition-questions';
import { colors, fonts } from '../theme';
import { useUser } from '../context/UserContext';

export const QuestionScreen: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id ?? '00000000-0000-0000-0000-000000000001';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, UserChoice>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setInitialLoading(true);
      setQuestions(nutritionQuestions);
      try {
        const choices = await db.getUserChoices(userId);
        const map: Record<string, UserChoice> = {};
        choices?.forEach((c: any) => { map[c.question_id] = c; });
        setUserChoices(map);
      } catch (err) {
        console.warn('Could not load choices:', err);
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
      try {
        await db.saveChoice(userId, q.id, choice, reflection);
      } catch (err) {
        console.warn('Could not save to Supabase:', err);
      }
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        Alert.alert('Done!', `You completed all ${questions.length} nutrition questions.`);
        setCurrentIndex(0);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No questions available</Text>
      </View>
    );
  }

  const answeredCount = Object.keys(userChoices).length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoIconOuter}>
              <View style={styles.logoIconInner} />
            </View>
            <Text style={styles.headerTitle}>Longevity</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? 'U'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <QuestionCard
        question={questions[currentIndex]}
        onChoice={handleAnswer}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoIconInner: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontStyle: 'italic',
    color: colors.textPrimary,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
  },
});
