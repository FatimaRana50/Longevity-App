import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, Pressable, Image,
  Animated, Easing, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { colors, fonts } from '../theme';
import { useUser } from '../context/UserContext';
import { ArchetypeType } from '../types/index';
import onboarding, {
  scoreArchetype, computeRiskLevel, archetypeQuestions, riskQuestions,
} from '../utils/onboarding';

import { BotanicalBackdrop } from '../components/BotanicalBackdrop';
import { PremiumButton, TERRACOTTA, SAGE_DARK, CREAM } from '../components/PremiumButton';
import { ProgressDots } from '../components/ProgressDots';
import {
  ClipboardIcon, CheckIcon, LeafIcon, ClockIcon, ArrowLeftIcon,
} from '../components/Icon';

/* ---------------- Local assets ---------------- */
const HERO_FRONT = require('../../assets/onboarding/hero-meditation.png');
const HERO_BACK = require('../../assets/onboarding/hero-meditation-back.png');
const LOGO = require('../../assets/onboarding/logo-mark.png');

/* ---------------- Tokens (reference colors) ---------------- */
const INK = '#2B2B2B';
const INK_SOFT = '#6B6B6B';
const CARD = '#FAF4E8';
const HAIRLINE = '#E6DFD1';

/* ---------------- Content ---------------- */
type Step = 'welcome' | 'name' | 'interests' | 'archetype';

const INTERESTS = [
  'Healthy aging', 'Biohacking', 'Cognitive health', 'Relationships',
  'Fitness', 'Prevention', 'Mental wellness', 'Retirement wellness',
  'Stress reduction', 'Purpose & legacy',
];

const SERIF = (fonts as any)?.serif ?? Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

/* ============================================================ */

export const OnboardingScreen: React.FC = () => {
  const { updateProfile } = useUser();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // quiz state preserved from original
  const [quizPhase, setQuizPhase] = useState<'arche' | 'risk'>('arche');
  const [archeIndex, setArcheIndex] = useState(0);
  const [riskIndex, setRiskIndex] = useState(0);
  const [archeAnswers, setArcheAnswers] = useState<('A' | 'B' | null)[]>([null, null, null]);
  const [riskAnswers, setRiskAnswers] = useState<('A' | 'B' | null)[]>([null, null, null]);

  const stepNumber = step === 'welcome' ? 0 : step === 'name' ? 1 : step === 'interests' ? 2 : 3;

  const toggleInterest = (item: string) =>
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const completeOnboarding = async (finalArche: ArchetypeType | '') => {
    if (saving) return;
    setSaving(true);
    try {
      const riskLevel = computeRiskLevel(riskAnswers as any);
      await updateProfile({
        name: name.trim() || 'Friend',
        interests,
        primaryArchetype: (finalArche || 'balanced-integrator') as ArchetypeType,
        riskLevel,
        onboardingCompleted: true,
      } as any);
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    if (step === 'name') setStep('welcome');
    else if (step === 'interests') setStep('name');
    else if (step === 'archetype') {
      if (quizPhase === 'risk' && riskIndex === 0) { setQuizPhase('arche'); setArcheIndex(archetypeQuestions.length - 1); return; }
      if (quizPhase === 'risk') { setRiskIndex(i => Math.max(0, i - 1)); return; }
      if (quizPhase === 'arche' && archeIndex > 0) { setArcheIndex(i => i - 1); return; }
      setStep('interests');
    }
  };

  /* ---------- Welcome ---------- */
  if (step === 'welcome') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <BotanicalBackdrop variant="full" showPlant={false} showSunflower={false} showCorners={false} />
        <StatusBar style="dark" />
        <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={s.welcomeScroll} showsVerticalScrollIndicator={false}>

            <View style={s.logoBlock}>
              <Image source={LOGO} style={s.logoMark} resizeMode="contain" />
              <Text style={[s.brandTop, { fontFamily: SERIF }]}>The</Text>
              <Text style={[s.brandTitle, { fontFamily: SERIF }]}>Longevity</Text>
              <View style={s.brandRule}>
                <View style={s.ruleLine} />
                <Text style={[s.brandSub, { fontFamily: SERIF }]}>Game</Text>
                <View style={s.ruleLine} />
              </View>
            </View>

            <Text style={[s.h1, { fontFamily: SERIF }]}>
              Discover your{'\n'}longevity philosophy
            </Text>
            <Text style={s.lede}>
              Make thoughtful choices today{'\n'}for a longer, healthier tomorrow.
            </Text>

            <Image source={HERO_FRONT} style={s.heroImg} resizeMode="contain" />

            <View style={s.ctaStack}>
              <PremiumButton label="Get Started" onPress={() => setStep('name')} />
              <PremiumButton label="I already have an account" variant="outline" onPress={() => setStep('name')} />
            </View>

            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>Continue with</Text>
              <View style={s.dividerLine} />
            </View>

            <View style={s.socialRow}>
              <SocialTile label="G" />
              <SocialTile label="" symbol="apple" />
              <SocialTile label="✉" />
            </View>

            <Text style={s.legal}>
              By continuing, you agree to our{' '}
              <Text style={s.legalLink}>Terms of Service</Text>{'\n'}and{' '}
              <Text style={s.legalLink}>Privacy Policy</Text>.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  /* ---------- Stepped screens share a header ---------- */
  const Header = ({ title }: { title: string }) => (
    <View style={s.header}>
      <Pressable onPress={goBack} hitSlop={12} style={s.backBtn}>
        <ArrowLeftIcon color={INK} />
      </Pressable>
      <Text style={s.headerTitle}>{title}</Text>
      <Text style={s.headerStep}>Step {stepNumber} of 3</Text>
    </View>
  );

  /* ---------- Name ---------- */
  if (step === 'name') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <BotanicalBackdrop variant="subtle" showPlant={false} showSunflower={false} showCorners={false} />
        <StatusBar style="dark" />
        <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={s.stepScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Header title="Onboarding" />

              <Text style={[s.stepH1, { fontFamily: SERIF }]}>What should we{'\n'}call you?</Text>
              <Text style={s.stepLede}>
                A name helps us personalize your{'\n'}longevity journey.
              </Text>

              <View style={s.inputBlock}>
                <Text style={s.inputLabel}>Your name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Eleanor"
                  placeholderTextColor="#B7AC97"
                  style={s.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={s.stepFooter}>
                <PremiumButton
                  label="Continue"
                  disabled={!name.trim()}
                  onPress={() => setStep('interests')}
                />
                <ProgressDots total={3} current={1} />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  /* ---------- Interests ---------- */
  if (step === 'interests') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <BotanicalBackdrop variant="subtle" showPlant={false} showSunflower={false} showCorners={false} />
        <StatusBar style="dark" />
        <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={s.stepScroll} showsVerticalScrollIndicator={false}>
            <Header title="Onboarding" />

            <Text style={[s.stepH1, { fontFamily: SERIF }]}>Your longevity{'\n'}philosophy starts here</Text>
            <Text style={s.stepLede}>
              Answer a few thoughtful questions to discover{'\n'}your values, tradeoffs, and personal longevity profile.
            </Text>

            <Image source={HERO_BACK} style={s.heroImgBack} resizeMode="contain" />

            <View style={s.featureCard}>
              <FeatureRow icon={<ClipboardIcon />} text="10–20 quick questions" />
              <FeatureRow icon={<View style={s.checkPill}><CheckIcon color={CREAM} size={16} /></View>} text="No right or wrong answers" first={false} />
              <FeatureRow icon={<View style={s.softPill}><LeafIcon size={16} /></View>} text="Discover your values and tradeoffs" first={false} />
              <FeatureRow icon={<View style={s.softPill}><ClockIcon size={16} /></View>} text="Takes about 3 minutes" first={false} />
            </View>

            <Text style={s.sectionEyebrow}>WHAT INTERESTS YOU?</Text>
            <View style={s.chipsWrap}>
              {INTERESTS.map(item => {
                const active = interests.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() => toggleInterest(item)}
                    style={({ pressed }) => [s.chip, active && s.chipActive, pressed && { opacity: 0.85 }]}
                  >
                    <Text style={[s.chipText, active && s.chipTextActive]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={s.stepFooter}>
              <PremiumButton
                label="Begin Assessment"
                onPress={() => { setStep('archetype'); setQuizPhase('arche'); setArcheIndex(0); }}
              />
              <PremiumButton label="Maybe later" variant="ghost" onPress={() => completeOnboarding('')} />
              <ProgressDots total={3} current={2} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  /* ---------- Archetype quiz ---------- */
  const totalQuestions = archetypeQuestions.length + riskQuestions.length;
  const answeredCount =
    archeAnswers.filter(a => a !== null).length + riskAnswers.filter(a => a !== null).length;
  const progress = answeredCount / totalQuestions;
  const currentQ = quizPhase === 'arche' ? archetypeQuestions[archeIndex] : riskQuestions[riskIndex];

  const handleSelect = (choice: 'A' | 'B') => {
    if (quizPhase === 'arche') {
      const next = [...archeAnswers];
      next[archeIndex] = choice;
      setArcheAnswers(next);
      setTimeout(() => {
        if (archeIndex < archetypeQuestions.length - 1) setArcheIndex(i => i + 1);
        else { setQuizPhase('risk'); setRiskIndex(0); }
      }, 280);
    } else {
      const next = [...riskAnswers];
      next[riskIndex] = choice;
      setRiskAnswers(next);
      setTimeout(() => {
        if (riskIndex < riskQuestions.length - 1) setRiskIndex(i => i + 1);
        else {
          const archetype = scoreArchetype(next.map((_, i) => next[i]) as any, archeAnswers as any);
          completeOnboarding(archetype as ArchetypeType);
        }
      }, 280);
    }
  };

  const selected = quizPhase === 'arche' ? archeAnswers[archeIndex] : riskAnswers[riskIndex];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <BotanicalBackdrop variant="subtle" showPlant={false} showSunflower={false} showCorners={false} />
      <StatusBar style="dark" />
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={s.stepScroll} showsVerticalScrollIndicator={false}>
          <Header title="Assessment" />

          <AnimatedProgressBar value={progress} />

          <Text style={s.qCounter}>
            Question {answeredCount + 1} of {totalQuestions}
          </Text>

          <Text style={[s.qText, { fontFamily: SERIF }]}>
            {currentQ?.question ?? 'Loading…'}
          </Text>

          <View style={s.optionsStack}>
            <OptionCard
              letter="A"
              text={currentQ?.optionA ?? ''}
              active={selected === 'A'}
              onPress={() => handleSelect('A')}
            />
            <OptionCard
              letter="B"
              text={currentQ?.optionB ?? ''}
              active={selected === 'B'}
              onPress={() => handleSelect('B')}
            />
          </View>

          <View style={s.stepFooter}>
            <ProgressDots total={3} current={3} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

/* ============================================================ */
/* Subcomponents                                                 */
/* ============================================================ */

const SocialTile: React.FC<{ label: string; symbol?: 'apple' }> = ({ label, symbol }) => (
  <View style={s.socialTile}>
    {symbol === 'apple'
      ? <Text style={[s.socialGlyph, { fontSize: 26 }]}></Text>
      : label === 'G'
        ? <Text style={[s.socialGlyph, { color: '#4285F4', fontWeight: '700' }]}>G</Text>
        : <Text style={s.socialGlyph}>{label}</Text>}
  </View>
);

const FeatureRow: React.FC<{ icon: React.ReactNode; text: string; first?: boolean }> = ({ icon, text, first = true }) => (
  <View style={[s.featureRow, !first && s.featureRowDivider]}>
    <View style={s.featureIcon}>{icon}</View>
    <Text style={s.featureText}>{text}</Text>
  </View>
);

const OptionCard: React.FC<{ letter: string; text: string; active: boolean; onPress: () => void }> = ({
  letter, text, active, onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [s.optionCard, active && s.optionCardActive, pressed && { opacity: 0.9 }]}
  >
    <View style={[s.optionLetter, active && s.optionLetterActive]}>
      <Text style={[s.optionLetterText, active && { color: CREAM }]}>{letter}</Text>
    </View>
    <Text style={[s.optionText, active && { color: SAGE_DARK, fontWeight: '600' }]}>{text}</Text>
  </Pressable>
);

const AnimatedProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const w = useRef(new Animated.Value(value)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: value, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [value]);
  return (
    <View style={s.progressTrack}>
      <Animated.View style={[s.progressFill, { width: w.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
};

/* ============================================================ */
/* Styles                                                        */
/* ============================================================ */

const s = StyleSheet.create({
  safe: { flex: 1 },

  /* Welcome */
  welcomeScroll: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 36, alignItems: 'center' },
  logoBlock: { alignItems: 'center', marginTop: 24, marginBottom: 18 },
  logoMark: { width: 72, height: 72, marginBottom: 6 },
  brandTop: { fontSize: 22, color: SAGE_DARK, lineHeight: 24 },
  brandTitle: { fontSize: 42, color: INK, lineHeight: 46, letterSpacing: -0.5, marginTop: -2 },
  brandRule: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ruleLine: { width: 28, height: 1.2, backgroundColor: TERRACOTTA, marginHorizontal: 8 },
  brandSub: { fontSize: 20, color: SAGE_DARK },

  h1: {
    fontSize: 36, lineHeight: 42, color: INK, textAlign: 'center',
    marginTop: 28, letterSpacing: -0.5, fontWeight: '500',
  },
  lede: { fontSize: 16, lineHeight: 24, color: INK_SOFT, textAlign: 'center', marginTop: 14 },

  heroImg: { width: '100%', height: 260, marginTop: 18, marginBottom: 18 },
  heroImgBack: { width: '100%', height: 230, marginTop: 12, marginBottom: 20 },

  ctaStack: { width: '100%', gap: 12, marginTop: 8 },

  divider: { flexDirection: 'row', alignItems: 'center', marginTop: 28, marginBottom: 18, width: '100%' },
  dividerLine: { flex: 1, height: 1, backgroundColor: HAIRLINE },
  dividerText: { marginHorizontal: 14, color: INK_SOFT, fontSize: 13, letterSpacing: 0.3 },

  socialRow: { flexDirection: 'row', gap: 14, marginBottom: 18 },
  socialTile: {
    width: 78, height: 60, borderRadius: 14, backgroundColor: '#FFFDF7',
    borderWidth: 1, borderColor: HAIRLINE, alignItems: 'center', justifyContent: 'center',
  },
  socialGlyph: { fontSize: 22, color: INK },

  legal: { fontSize: 12.5, lineHeight: 20, color: INK_SOFT, textAlign: 'center', marginTop: 8 },
  legalLink: { color: SAGE_DARK, fontWeight: '600' },

  /* Header on stepped screens */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 6, paddingBottom: 18,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, color: INK, fontWeight: '500' },
  headerStep: { fontSize: 13, color: SAGE_DARK, fontWeight: '600', letterSpacing: 0.2 },

  stepScroll: { paddingHorizontal: 28, paddingBottom: 36 },
  stepH1: { fontSize: 34, lineHeight: 40, color: INK, letterSpacing: -0.5, marginTop: 4, fontWeight: '500' },
  stepLede: { fontSize: 15.5, lineHeight: 23, color: INK_SOFT, marginTop: 12, marginBottom: 8 },

  inputBlock: { marginTop: 28 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: SAGE_DARK, letterSpacing: 0.4, marginBottom: 10, textTransform: 'uppercase' },
  input: {
    backgroundColor: CARD, borderWidth: 1, borderColor: HAIRLINE, borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 18, fontSize: 17, color: INK,
  },

  /* Interests card + chips */
  featureCard: {
    backgroundColor: CARD, borderRadius: 20, padding: 6, marginTop: 4, marginBottom: 24,
    shadowColor: '#3a2a18', shadowOpacity: 0.05, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 1,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 14, gap: 14 },
  featureRowDivider: { borderTopWidth: 1, borderTopColor: '#EFE7D5' },
  featureIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4ECD9', alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: 15.5, color: INK, fontWeight: '500' },
  checkPill: { width: 36, height: 36, borderRadius: 18, backgroundColor: SAGE_DARK, alignItems: 'center', justifyContent: 'center' },
  softPill: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8E9DC', alignItems: 'center', justifyContent: 'center' },

  sectionEyebrow: {
    fontSize: 12, color: SAGE_DARK, fontWeight: '700', letterSpacing: 1.4,
    marginBottom: 12, marginTop: 4,
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: {
    paddingVertical: 11, paddingHorizontal: 16, borderRadius: 999,
    backgroundColor: '#FFFDF7', borderWidth: 1, borderColor: HAIRLINE,
  },
  chipActive: { backgroundColor: SAGE_DARK, borderColor: SAGE_DARK },
  chipText: { fontSize: 14, color: INK, fontWeight: '500' },
  chipTextActive: { color: CREAM, fontWeight: '600' },

  stepFooter: { gap: 14, marginTop: 12, alignItems: 'stretch' },

  /* Quiz */
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: HAIRLINE, overflow: 'hidden', marginTop: 4, marginBottom: 18 },
  progressFill: { height: '100%', backgroundColor: TERRACOTTA, borderRadius: 3 },
  qCounter: { fontSize: 12.5, color: SAGE_DARK, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 },
  qText: { fontSize: 26, lineHeight: 34, color: INK, letterSpacing: -0.3, fontWeight: '500', marginBottom: 24 },

  optionsStack: { gap: 14, marginBottom: 24 },
  optionCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: CARD, borderRadius: 18, padding: 18,
    borderWidth: 1.25, borderColor: HAIRLINE,
  },
  optionCardActive: { borderColor: SAGE_DARK, backgroundColor: '#F1EFE3' },
  optionLetter: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#FFFDF7', borderWidth: 1, borderColor: HAIRLINE,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  optionLetterActive: { backgroundColor: SAGE_DARK, borderColor: SAGE_DARK },
  optionLetterText: { fontSize: 14, fontWeight: '700', color: SAGE_DARK },
  optionText: { flex: 1, fontSize: 15.5, lineHeight: 23, color: INK },
});
