import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView,
} from 'react-native';
import { Question } from '../types/index';
import { colors, fonts } from '../theme';

interface QuestionCardProps {
  question: Question;
  onChoice: (choice: 'A' | 'B', reflection?: string) => void;
  answeredCount?: number;
  totalQuestions?: number;
  loading?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onChoice,
  answeredCount = 0,
  totalQuestions = 0,
  loading = false,
}) => {
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reflection, setReflection] = useState('');

  const insight = selected === 'A' ? question.optionA.insight : question.optionB.insight;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
  };

  const handleContinue = () => {
    onChoice(selected!, reflection);
    setSelected(null);
    setSubmitted(false);
    setReflection('');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Daily Quest</Text>
      </View>

      {/* Heading */}
      <Text style={styles.questionTitle}>Would You Rather...</Text>
      <Text style={styles.questionSub}>A choice for the long-term self.</Text>

      {/* Full question */}
      <Text style={styles.questionBody}>{question.question}</Text>

      {!submitted ? (
        <>
          <TouchableOpacity
            style={[styles.optionCard, selected === 'A' && styles.optionCardSelected]}
            onPress={() => setSelected('A')}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={[styles.optionTag, selected === 'A' && styles.optionTagSelected]}>OPTION A</Text>
            <Text style={styles.optionText}>{question.optionA.text}</Text>
            {selected === 'A' && <View style={styles.selectedPip} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, selected === 'B' && styles.optionCardSelected]}
            onPress={() => setSelected('B')}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={[styles.optionTag, selected === 'B' && styles.optionTagSelected]}>OPTION B</Text>
            <Text style={styles.optionText}>{question.optionB.text}</Text>
            {selected === 'B' && <View style={styles.selectedPip} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, !selected && styles.submitBtnInactive]}
            onPress={handleSubmit}
            disabled={!selected || loading}
            activeOpacity={0.85}
          >
            <Text style={[styles.submitBtnText, !selected && styles.submitBtnTextInactive]}>
              Submit Answer ✦
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Chosen recap */}
          <View style={[styles.optionCard, styles.optionCardSelected]}>
            <Text style={[styles.optionTag, styles.optionTagSelected]}>YOUR CHOICE</Text>
            <Text style={styles.optionText}>
              {selected === 'A' ? question.optionA.text : question.optionB.text}
            </Text>
          </View>

          {/* Insight */}
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>✨  INSIGHT</Text>
            <Text style={styles.insightText}>{insight!.text}</Text>
          </View>

          {/* Science */}
          <View style={styles.scienceCard}>
            <Text style={styles.scienceLabel}>🔬  SCIENCE SAYS</Text>
            <Text style={styles.scienceText}>{insight!.scienceSays}</Text>
          </View>

          {/* Reflection */}
          <Text style={styles.reflectionPrompt}>Your reflection (optional)</Text>
          <TextInput
            style={styles.reflectionInput}
            placeholder="What made you choose this?"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            value={reflection}
            onChangeText={setReflection}
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>
              {loading ? 'Saving…' : '→  Next Question'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {totalQuestions > 0 && (
        <Text style={styles.progress}>{answeredCount} of {totalQuestions} completed</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 48,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 22,
  },
  badgeText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  questionTitle: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  questionSub: {
    fontFamily: fonts.serif,
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginBottom: 20,
  },
  questionBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 28,
    fontStyle: 'italic',
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    position: 'relative',
    shadowColor: '#2B3322',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.cardTinted,
  },
  optionTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: colors.textMuted,
    marginBottom: 8,
  },
  optionTagSelected: {
    color: colors.secondary,
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 23,
  },
  selectedPip: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
  },
  submitBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 17,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnInactive: {
    backgroundColor: colors.borderLight,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  submitBtnTextInactive: {
    color: colors.textMuted,
  },
  insightCard: {
    backgroundColor: colors.cardTinted,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.secondary,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 21,
  },
  scienceCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  scienceLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: 6,
  },
  scienceText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  reflectionPrompt: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },
  reflectionInput: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
  },
  progress: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 24,
  },
});
