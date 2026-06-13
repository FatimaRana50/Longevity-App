import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts } from '../theme';
import { useUser } from '../context/UserContext';
import { ArchetypeType } from '../types/index';
import onboarding, { scoreArchetype, computeRiskLevel, archetypeQuestions, riskQuestions } from '../utils/onboarding';

type Step = 'welcome' | 'name' | 'interests' | 'archetype';

const INTERESTS = [
  'Healthy aging', 'Biohacking', 'Cognitive health', 'Relationships',
  'Fitness', 'Prevention', 'Mental wellness', 'Retirement wellness',
  'Stress reduction', 'Purpose & legacy',
];

const ARCHETYPES: { id: ArchetypeType; label: string; emoji: string; desc: string }[] = [
  { id: 'optimizer', label: 'Data-driven Optimizer', emoji: '🔬', desc: 'Science, tracking, and precision' },
  { id: 'naturalist', label: 'Nature & Wisdom Seeker', emoji: '🌿', desc: 'Whole foods and ancestral wisdom' },
  { id: 'balanced-integrator', label: 'Balanced Integrator', emoji: '⚖️', desc: 'Practical, sustainable habits' },
  { id: 'relationship-centered', label: 'People & Purpose First', emoji: '❤️', desc: 'Connection, joy, and meaning' },
  { id: 'prevention-focused', label: 'Prevention Focused', emoji: '🛡️', desc: 'Screenings and risk reduction' },
];

function Logo() {
  return (
    <View style={styles.logo}>
      <View style={styles.logoIconOuter}>
        <View style={styles.logoIconInner} />
      </View>
      <Text style={styles.logoText}>Longevity</Text>
    </View>
  );
}

export const OnboardingScreen: React.FC = () => {
  const { updateProfile } = useUser();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [archetype, setArchetype] = useState<ArchetypeType | ''>('');
  const [saving, setSaving] = useState(false);
  const [quizPhase, setQuizPhase] = useState<'arche' | 'risk'>('arche');
  const [archeIndex, setArcheIndex] = useState(0);
  const [riskIndex, setRiskIndex] = useState(0);
  const [archeAnswers, setArcheAnswers] = useState<( 'A' | 'B' | null )[]>([null, null, null]);
  const [riskAnswers, setRiskAnswers] = useState<( 'A' | 'B' | null )[]>([null, null, null]);

  const toggleInterest = (item: string) => {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const completeOnboarding = async () => {
    if (saving) return;
    setSaving(true);
    // If user manually selected archetype (fallback), use it, otherwise compute from quiz
    const primary = archetype || (archeAnswers.every(a => a) ? scoreArchetype(archeAnswers as ('A'|'B')[]) : undefined);
    const risk = (riskAnswers.every(a => a) ? computeRiskLevel(riskAnswers as ('A'|'B')[]) : undefined);

    await updateProfile({
      name: name.trim(),
      primaryArchetype: primary as ArchetypeType,
      riskTolerance: risk,
      onboardingCompleted: true,
    });
  };

  if (step === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.welcomeWrapper}>
          <Logo />
          <View style={styles.welcomeBody}>
            <Text style={styles.smallLabel}>WELCOME</Text>
            <Text style={styles.heroTitle}>Discover your longevity philosophy.</Text>
            <Text style={styles.heroSub}>
              One quiet question a day. No right answers — just the slow reveal of how you really think about a long, vivid life.
            </Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('name')}>
            <Text style={styles.primaryBtnText}>Begin the practice</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'name') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.stepWrapper}>
          <Logo />
          <Text style={styles.stepLabel}>STEP 1 OF 3</Text>
          <Text style={styles.stepTitle}>What may I call you?</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Your first name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => name.trim() && setStep('interests')}
          />
          <TouchableOpacity
            style={[styles.primaryBtn, !name.trim() && styles.primaryBtnDisabled]}
            onPress={() => name.trim() && setStep('interests')}
          >
            <Text style={[styles.primaryBtnText, !name.trim() && styles.primaryBtnTextDisabled]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'interests') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={styles.stepWrapper}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Logo />
          <Text style={styles.stepLabel}>STEP 2 OF 3</Text>
          <Text style={styles.stepTitle}>What pulls you toward this practice?</Text>
          <Text style={styles.stepSub}>Choose any that resonate.</Text>
          <View style={styles.chipsRow}>
            {INTERESTS.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, interests.includes(item) && styles.chipActive]}
                onPress={() => toggleInterest(item)}
              >
                <Text style={[styles.chipText, interests.includes(item) && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('archetype')}>
            <Text style={styles.primaryBtnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
  // Archetype + risk quiz step
  if (step === 'archetype') {
    const archeQuestion = archetypeQuestions[archeIndex];
    const riskQuestion = riskQuestions[riskIndex];

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.stepWrapper} showsVerticalScrollIndicator={false}>
          <Logo />
          <Text style={styles.stepLabel}>STEP 3 OF 3</Text>
          <Text style={styles.stepTitle}>Quick quiz</Text>
          <Text style={styles.stepSub}>Three short questions to learn how you approach health, then three about risk tolerance.</Text>

          {quizPhase === 'arche' ? (
            <View>
              <Text style={styles.quizQuestion}>{archeQuestion}</Text>
              <TouchableOpacity style={styles.quizOpt} onPress={() => {
                const copy = [...archeAnswers]; copy[archeIndex] = 'A'; setArcheAnswers(copy);
                if (archeIndex < 2) setArcheIndex(i => i + 1); else setQuizPhase('risk');
              }}>
                <Text style={styles.quizOptText}>{onboarding.archetypeOptions[archeIndex][0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quizOpt} onPress={() => {
                const copy = [...archeAnswers]; copy[archeIndex] = 'B'; setArcheAnswers(copy);
                if (archeIndex < 2) setArcheIndex(i => i + 1); else setQuizPhase('risk');
              }}>
                <Text style={styles.quizOptText}>{onboarding.archetypeOptions[archeIndex][1]}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.quizQuestion}>{riskQuestion}</Text>
              <TouchableOpacity style={styles.quizOpt} onPress={() => {
                const copy = [...riskAnswers]; copy[riskIndex] = 'A'; setRiskAnswers(copy);
                if (riskIndex < 2) setRiskIndex(i => i + 1); else {
                  // finish
                  setSaving(true);
                  const primary = scoreArchetype(archeAnswers as ('A'|'B')[]);
                  const risk = computeRiskLevel(riskAnswers as ('A'|'B')[]);
                  updateProfile({ name: name.trim(), primaryArchetype: primary, riskTolerance: risk, onboardingCompleted: true })
                    .catch(() => {})
                    .finally(() => setSaving(false));
                }
              }}>
                <Text style={styles.quizOptText}>{onboarding.riskOptions[riskIndex][0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quizOpt} onPress={() => {
                const copy = [...riskAnswers]; copy[riskIndex] = 'B'; setRiskAnswers(copy);
                if (riskIndex < 2) setRiskIndex(i => i + 1); else {
                  setSaving(true);
                  const primary = scoreArchetype(archeAnswers as ('A'|'B')[]);
                  const risk = computeRiskLevel(riskAnswers as ('A'|'B')[]);
                  updateProfile({ name: name.trim(), primaryArchetype: primary, riskTolerance: risk, onboardingCompleted: true })
                    .catch(() => {})
                    .finally(() => setSaving(false));
                }
              }}>
                <Text style={styles.quizOptText}>{onboarding.riskOptions[riskIndex][1]}</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeWrapper: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  stepWrapper: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 48,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 56,
  },
  logoIconOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.secondary,
    justifyContent: 'center',
      borderWidth: 2,
    marginRight: 8,
  },
  logoIconInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  logoText: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontStyle: 'italic',
    color: colors.textPrimary,
  },
  welcomeBody: {
    flex: 1,
    justifyContent: 'center',
  },
  smallLabel: {
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 18,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 38,
    color: colors.textPrimary,
    lineHeight: 48,
    marginBottom: 20,
  },
  heroSub: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  stepLabel: {
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 16,
  },
  stepTitle: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.textPrimary,
    lineHeight: 40,
    marginBottom: 8,
  },
  stepSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  nameInput: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontStyle: 'italic',
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 14,
    marginBottom: 48,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 40,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  chipText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.white,
  },
  archetypeList: {
    gap: 12,
    marginBottom: 32,
  },
  archetypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  archetypeCardActive: {
    borderColor: colors.secondary,
    backgroundColor: '#EEF3E8',
  },
  archetypeEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  archetypeInfo: {
    flex: 1,
  },
  archetypeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  archetypeLabelActive: {
    color: colors.secondary,
  },
  archetypeDesc: {
    fontSize: 13,
    color: colors.textMuted,
  },
  check: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: colors.textPrimary,
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    backgroundColor: colors.border,
  },
  primaryBtnText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryBtnTextDisabled: {
    color: colors.textMuted,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  quizOpt: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  quizOptText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
});
