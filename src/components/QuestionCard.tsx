import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { Question } from '../types/index';
import { colors, fonts } from '../theme';
import { db } from '../services/supabase';

interface QuestionCardProps {
  question: Question;
  onSubmitAnswer: (choice: 'A' | 'B', reflection?: string) => Promise<void>;
  onContinue: () => void;
  answeredCount?: number;
  totalQuestions?: number;
  loading?: boolean;
}

const archetypeIcon: Record<string, string> = {
  'optimizer': '🔬',
  'naturalist': '🌿',
  'balanced-integrator': '⚖️',
  'relationship-centered': '❤️',
  'prevention-focused': '🛡️',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question, onSubmitAnswer, onContinue, answeredCount = 0, totalQuestions = 0, loading = false,
}) => {
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reflection, setReflection] = useState('');
  const [communityStats, setCommunityStats] = useState<{
    total: number;
    optionACount: number;
    optionBCount: number;
    optionAPercent: number;
    optionBPercent: number;
  } | null>(null);
  const [communityLoading, setCommunityLoading] = useState(false);

  const insight = selected === 'A' ? question.optionA.insight : question.optionB.insight;

  const handleSubmit = async () => {
    if (!selected) return;
    setCommunityLoading(true);
    try {
      await onSubmitAnswer(selected, reflection);
      const stats = await db.getChoiceDistribution(question.id);
      setCommunityStats(stats);
      setSubmitted(true);
    } catch {
      setCommunityLoading(false);
      return;
    }
    setCommunityLoading(false);
  };

  const handleContinue = () => {
    onContinue();
    setSelected(null);
    setSubmitted(false);
    setReflection('');
    setCommunityStats(null);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Badge */}
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Daily Quest</Text>
        </View>
      </View>

      {/* Question heading */}
      <Text style={styles.questionTitle}>Would You Rather...</Text>
      <Text style={styles.questionSub}>A choice for the long-term self.</Text>
      <Text style={styles.questionBody}>{question.question}</Text>

      {!submitted ? (
        <>
          {/* Option A */}
          <TouchableOpacity
            style={[styles.optionCard, selected === 'A' && styles.optionCardActive]}
            onPress={() => setSelected('A')}
            activeOpacity={0.85}
            disabled={loading}
          >
            <View style={styles.optionCardInner}>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionTag}>Option A</Text>
                <Text style={styles.optionText}>{question.optionA.text}</Text>
              </View>
              <View style={[styles.iconCircle, selected === 'A' && styles.iconCircleActive]}>
                <Text style={styles.iconEmoji}>
                  {archetypeIcon[question.optionA.insight.archetype] ?? '🌿'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Option B */}
          <TouchableOpacity
            style={[styles.optionCard, selected === 'B' && styles.optionCardActive]}
            onPress={() => setSelected('B')}
            activeOpacity={0.85}
            disabled={loading}
          >
            <View style={styles.optionCardInner}>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionTag}>Option B</Text>
                <Text style={styles.optionText}>{question.optionB.text}</Text>
              </View>
              <View style={[styles.iconCircle, selected === 'B' && styles.iconCircleActive]}>
                <Text style={styles.iconEmoji}>
                  {archetypeIcon[question.optionB.insight.archetype] ?? '🌿'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, !selected && styles.submitBtnInactive]}
            onPress={handleSubmit}
            disabled={!selected || loading}
            activeOpacity={0.85}
          >
            <Text style={[styles.submitBtnText, !selected && styles.submitBtnTextInactive]}>
              Submit Answer  🌱
            </Text>
          </TouchableOpacity>

          {/* Quote */}
          <Text style={styles.quote}>
            "The secret of health for both mind and body is not to mourn for the past, worry about the future... but to live the present moment wisely and earnestly."
          </Text>
        </>
      ) : (
        <>
          {/* Chosen recap */}
          <View style={[styles.optionCard, styles.optionCardActive]}>
            <View style={styles.optionCardInner}>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionTag}>Your Choice</Text>
                <Text style={styles.optionText}>
                  {selected === 'A' ? question.optionA.text : question.optionB.text}
                </Text>
              </View>
              <View style={styles.iconCircleActive}>
                <Text style={styles.iconEmoji}>{archetypeIcon[insight!.archetype] ?? '🌿'}</Text>
              </View>
            </View>
          </View>

          {/* Insight */}
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>✨  Insight</Text>
            <Text style={styles.insightText}>{insight!.text}</Text>
          </View>

          {/* Community split */}
          <View style={styles.communityCard}>
            <Text style={styles.communityLabel}>Your community split</Text>
            {communityLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : communityStats && communityStats.total > 0 ? (
              <>
                <View style={styles.splitRow}>
                  <Text style={styles.splitText}>Option A</Text>
                  <Text style={styles.splitValue}>{communityStats.optionAPercent}%</Text>
                </View>
                <View style={styles.splitBarTrack}>
                  <View style={[styles.splitBarA, { width: `${communityStats.optionAPercent}%` }]} />
                  <View style={[styles.splitBarB, { width: `${communityStats.optionBPercent}%` }]} />
                </View>
                <View style={styles.splitRowBottom}>
                  <Text style={styles.splitMeta}>{communityStats.optionACount} chose A</Text>
                  <Text style={styles.splitMeta}>{communityStats.optionBCount} chose B</Text>
                </View>
              </>
            ) : (
              <Text style={styles.splitEmpty}>No community data yet. Be the first to set the pattern.</Text>
            )}
          </View>

          {/* Science */}
          <View style={styles.scienceCard}>
            <Text style={styles.scienceLabel}>🔬  Science Says</Text>
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
              {loading ? 'Saving…' : 'Next Question  →'}
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
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 56 },

  badgeRow: { alignItems: 'center', marginBottom: 16 },
  badge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.onSecondaryContainer,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  questionTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  questionSub: {
    fontFamily: fonts.serif,
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  questionBody: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
    fontStyle: 'italic',
  },

  optionCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 14,
    shadowColor: '#55433b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainer,
  },
  optionCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 14,
  },
  optionTextBlock: { flex: 1 },
  optionTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  optionText: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 25,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: { fontSize: 22 },

  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnInactive: {
    backgroundColor: colors.surfaceContainerHigh,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: colors.white,
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '600',
  },
  submitBtnTextInactive: { color: colors.textMuted },

  quote: {
    marginTop: 28,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
    color: colors.outline,
    lineHeight: 18,
    paddingHorizontal: 8,
  },

  insightCard: {
    backgroundColor: colors.cardTinted,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.secondary,
    marginBottom: 8,
  },
  insightText: { fontSize: 14, color: colors.textPrimary, lineHeight: 21 },

  scienceCard: {
    backgroundColor: colors.surfaceContainerHigh,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  scienceLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textMuted,
    marginBottom: 6,
  },
  scienceText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  communityCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: 20,
  },
  communityLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  splitText: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  splitValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  splitBarTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHighest,
    marginBottom: 10,
  },
  splitBarA: { height: 10, backgroundColor: colors.primary },
  splitBarB: { height: 10, backgroundColor: colors.secondary },
  splitRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  splitMeta: { fontSize: 12, color: colors.textMuted },
  splitEmpty: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },

  reflectionPrompt: { fontSize: 13, color: colors.textMuted, marginBottom: 8 },
  reflectionInput: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    marginBottom: 20,
  },

  progress: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 24,
  },
});
