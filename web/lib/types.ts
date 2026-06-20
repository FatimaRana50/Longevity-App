import {
  Salad, Dumbbell, Moon, Wind, Stethoscope, Zap,
  Users, Leaf, Brain, Pill, Scale, Wallet,
  FlaskConical, Flower2, Star,
  // archetypes
  Activity, Shield, TreePine, Microscope, Sparkles, Heart, BarChart3,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ArchetypeType =
  | 'healthspan-maximizer'
  | 'prevention-first-optimizer'
  | 'natural-balance-seeker'
  | 'tech-forward-biohacker'
  | 'purpose-driven-ageless'
  | 'social-wellness-connector'
  | 'longevity-realist'

export type CategorySlug =
  | 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'preventive'
  | 'biohacking' | 'social' | 'environment' | 'cognitive' | 'medical'
  | 'work-life' | 'financial' | 'supplements' | 'aging' | 'legacy'

export type SubscriptionStatus = 'free' | 'premium' | 'cancelled' | 'past_due'

export interface UserProfile {
  id: string
  email: string
  name: string
  age_range?: string
  gender?: string
  country?: string
  interests: string[]
  goals: string[]
  archetype?: ArchetypeType
  dimension_scores: Record<string, number>
  onboarding_completed: boolean
  subscription_status: SubscriptionStatus
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  category: CategorySlug
  question_text: string
  option_a_text: string
  option_b_text: string
  option_a_insight?: string
  option_b_insight?: string
  option_a_archetype?: string
  option_b_archetype?: string
  difficulty: 'easy' | 'medium' | 'hard'
  is_premium: boolean
}

export interface UserChoice {
  id: string
  user_id: string
  question_id: string
  selected_option: 'A' | 'B'
  skipped: boolean
  reflection?: string
  mood?: string
  tags: string[]
  answered_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title?: string
  body: string
  mood?: string
  tags: string[]
  related_question_id?: string
  created_at: string
  updated_at: string
}

export const CATEGORY_META: Record<CategorySlug, { label: string; icon: LucideIcon; color: string }> = {
  nutrition:   { label: 'Nutrition',             icon: Salad,       color: 'text-emerald-600 bg-emerald-50' },
  exercise:    { label: 'Exercise',              icon: Dumbbell,    color: 'text-orange-600  bg-orange-50'  },
  sleep:       { label: 'Sleep',                 icon: Moon,        color: 'text-indigo-600  bg-indigo-50'  },
  stress:      { label: 'Stress',                icon: Wind,        color: 'text-sky-600     bg-sky-50'     },
  preventive:  { label: 'Preventive Medicine',   icon: Stethoscope, color: 'text-red-600     bg-red-50'     },
  biohacking:  { label: 'Biohacking',            icon: Zap,         color: 'text-amber-600   bg-amber-50'   },
  social:      { label: 'Social Connections',    icon: Users,       color: 'text-pink-600    bg-pink-50'    },
  environment: { label: 'Environment',           icon: Leaf,        color: 'text-green-600   bg-green-50'   },
  cognitive:   { label: 'Cognitive Health',      icon: Brain,       color: 'text-violet-600  bg-violet-50'  },
  medical:     { label: 'Medical Interventions', icon: Pill,        color: 'text-rose-600    bg-rose-50'    },
  'work-life': { label: 'Work-Life Integration', icon: Scale,       color: 'text-teal-600    bg-teal-50'    },
  financial:   { label: 'Financial Wellness',    icon: Wallet,      color: 'text-lime-600    bg-lime-50'    },
  supplements: { label: 'Supplements',           icon: FlaskConical,color: 'text-cyan-600    bg-cyan-50'    },
  aging:       { label: 'Aging Gracefully',      icon: Flower2,     color: 'text-fuchsia-600 bg-fuchsia-50' },
  legacy:      { label: 'Legacy & Purpose',      icon: Star,        color: 'text-yellow-600  bg-yellow-50'  },
}

export const ARCHETYPE_META: Record<ArchetypeType, { label: string; icon: LucideIcon; color: string; tagline: string }> = {
  'healthspan-maximizer':       { label: 'Healthspan Maximizer',       icon: Activity,    color: 'text-emerald-600 bg-emerald-50', tagline: 'Quality of life above all else' },
  'prevention-first-optimizer': { label: 'Prevention-First Optimizer', icon: Shield,      color: 'text-blue-600    bg-blue-50',    tagline: 'Stop problems before they start' },
  'natural-balance-seeker':     { label: 'Natural Balance Seeker',     icon: TreePine,    color: 'text-green-600   bg-green-50',   tagline: 'Nature knows best' },
  'tech-forward-biohacker':     { label: 'Tech-Forward Biohacker',     icon: Microscope,  color: 'text-violet-600  bg-violet-50',  tagline: 'Optimize everything' },
  'purpose-driven-ageless':     { label: 'Purpose-Driven Ageless',     icon: Sparkles,    color: 'text-amber-600   bg-amber-50',   tagline: 'Meaning fuels longevity' },
  'social-wellness-connector':  { label: 'Social Wellness Connector',  icon: Heart,       color: 'text-rose-600    bg-rose-50',    tagline: 'Relationships are medicine' },
  'longevity-realist':          { label: 'Longevity Realist',          icon: BarChart3,   color: 'text-slate-600   bg-slate-50',   tagline: 'Balanced, evidence-based living' },
}
