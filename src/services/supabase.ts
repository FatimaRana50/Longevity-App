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

  async saveChoice(userId: string, questionId: string, choice: 'A' | 'B', reflection?: string) {
    const { data, error } = await supabase
      .from('user_choices')
      .insert({
        user_id: userId,
        question_id: questionId,
        choice,
        reflection,
        timestamp: new Date().toISOString(),
      })
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
      totalChoicesMade: data.total_choices_made ?? 0,
    } as UserProfile;
  },

  async createUserProfile(profile: UserProfile) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        created_at: new Date().toISOString(),
        onboarding_completed: false,
        total_choices_made: 0,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const mapped: any = {};
    if ('name' in updates) mapped.name = updates.name;
    if ('onboardingCompleted' in updates) mapped.onboarding_completed = updates.onboardingCompleted;
    if ('primaryArchetype' in updates) mapped.primary_archetype = updates.primaryArchetype;
    if ('totalChoicesMade' in updates) mapped.total_choices_made = updates.totalChoicesMade;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(mapped)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
