import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types/index';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const db = {
  async getQuestionsByCategory(category: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', category)
      .order('question_number', { ascending: true });
    if (error) throw error;
    return data;
  },

  async saveChoice(
    userId: string,
    questionId: string,
    choice: 'A' | 'B',
    reflection?: string,
    category?: string,
    selectedArchetype?: string,
  ) {
    const payload = {
      user_id: userId,
      question_id: questionId,
      choice,
      reflection: reflection || null,
      category: category || null,
      selected_archetype: selectedArchetype || null,
      timestamp: new Date().toISOString(),
    };

    const { data: existingChoice, error: existingError } = await supabase
      .from('user_choices')
      .select('id')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    const { data, error } = existingChoice?.id
      ? await supabase
        .from('user_choices')
        .update(payload)
        .eq('id', existingChoice.id)
        .select()
        .single()
      : await supabase
        .from('user_choices')
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
  },

  async getUserChoices(userId: string) {
    const { data, error } = await supabase
      .from('user_choices')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getChoiceDistribution(questionId: string) {
    const { data, error } = await supabase
      .from('user_choices')
      .select('choice')
      .eq('question_id', questionId);

    if (error) throw error;

    const total = data?.length ?? 0;
    const optionACount = data?.filter(row => row.choice === 'A').length ?? 0;
    const optionBCount = data?.filter(row => row.choice === 'B').length ?? 0;

    return {
      total,
      optionACount,
      optionBCount,
      optionAPercent: total > 0 ? Math.round((optionACount / total) * 100) : 0,
      optionBPercent: total > 0 ? Math.round((optionBCount / total) * 100) : 0,
    };
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return {
      id: data.id,
      email: data.email ?? '',
      name: data.name ?? '',
      createdAt: new Date(data.created_at),
      onboardingCompleted: data.onboarding_completed ?? false,
      primaryArchetype: data.primary_archetype,
      riskTolerance: data.risk_tolerance,
      totalChoicesMade: data.total_choices_made ?? 0,
    } as UserProfile;
  },

  async createUserProfile(profile: UserProfile) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        created_at: profile.createdAt instanceof Date ? profile.createdAt.toISOString() : new Date().toISOString(),
        onboarding_completed: false,
        risk_tolerance: null,
        total_choices_made: 0,
      }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async resetUserOnboarding(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        name: '',
        onboarding_completed: false,
        primary_archetype: null,
        risk_tolerance: null,
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const mapped: any = { id: userId };
    if ('email' in updates) mapped.email = updates.email;
    if ('name' in updates) mapped.name = updates.name;
    if ('onboardingCompleted' in updates) mapped.onboarding_completed = updates.onboardingCompleted;
    if ('primaryArchetype' in updates) mapped.primary_archetype = updates.primaryArchetype;
    if ('riskTolerance' in updates) mapped.risk_tolerance = updates.riskTolerance;
    if ('totalChoicesMade' in updates) mapped.total_choices_made = updates.totalChoicesMade;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(mapped, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
