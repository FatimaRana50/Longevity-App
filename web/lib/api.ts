import { createClient } from './supabase'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

async function getToken(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? `API error ${res.status}`)
  return json.data as T
}

// ── Questions ──────────────────────────────────────────────
export const questions = {
  daily: (date?: string) =>
    request<Question[]>('GET', `/questions/daily${date ? `?date=${date}` : ''}`),
  byCategory: (category: string, page = 1) =>
    request<Question[]>('GET', `/questions?category=${category}&page=${page}`),
  all: (page = 1) =>
    request<Question[]>('GET', `/questions?page=${page}`),
}

// ── Choices ────────────────────────────────────────────────
export const choices = {
  save: (body: { question_id: string; selected_option: 'A' | 'B'; reflection?: string }) =>
    request<UserChoice>('POST', '/choices', body),
  list: () =>
    request<UserChoice[]>('GET', '/choices'),
  stats: (questionId: string) =>
    request<{ total: number; A: number; B: number }>('GET', `/choices/stats/${questionId}`),
}

// ── Profile ────────────────────────────────────────────────
export const profile = {
  get: () =>
    request<UserProfile>('GET', '/profile'),
  scores: () =>
    request<ProfileScores>('GET', '/profile/scores'),
  update: (body: { name?: string; avatar_url?: string }) =>
    request<UserProfile>('PATCH', '/profile', body),
}

// ── Journal ────────────────────────────────────────────────
export const journal = {
  list: (page = 1, q?: string) =>
    request<JournalEntry[]>('GET', `/journal?page=${page}${q ? `&q=${encodeURIComponent(q)}` : ''}`),
  get: (id: string) =>
    request<JournalEntry>('GET', `/journal/${id}`),
  create: (body: { title: string; body: string; mood?: string; tags?: string[]; related_question_id?: string }) =>
    request<JournalEntry>('POST', '/journal', body),
  update: (id: string, body: Partial<{ title: string; body: string; mood: string; tags: string[] }>) =>
    request<JournalEntry>('PUT', `/journal/${id}`, body),
  remove: (id: string) =>
    request<{ deleted: boolean }>('DELETE', `/journal/${id}`),
}

// ── Streaks ────────────────────────────────────────────────
export const streaks = {
  get: () =>
    request<Streak>('GET', '/streaks'),
  update: () =>
    request<Streak>('POST', '/streaks/update'),
}

// ── Billing ────────────────────────────────────────────────
export const billing = {
  checkout: (plan: 'monthly' | 'annual') =>
    request<{ url: string }>('POST', '/billing/checkout', { plan }),
  portal: () =>
    request<{ url: string }>('POST', '/billing/portal'),
}

// ── Insights ───────────────────────────────────────────────
export const insights = {
  list: () =>
    request<Insight[]>('GET', '/insights'),
  generate: (insight_type: string) =>
    request<Insight>('POST', '/insights/generate', { insight_type }),
}

// ── Couples ────────────────────────────────────────────────
export const couples = {
  invite: () =>
    request<{ invite_code: string }>('POST', '/couples/invite'),
  join: (invite_code: string) =>
    request<unknown>('POST', '/couples/join', { invite_code }),
  comparison: () =>
    request<{ compatibility: number | null; shared_questions: number; agreements: number }>('GET', '/couples/comparison'),
}

// ── Local types (mirrored from backend) ───────────────────
export interface Question {
  id: string
  question_text: string
  category: string
  option_a_text: string
  option_b_text: string
  option_a_insight?: string
  option_b_insight?: string
  option_a_archetype?: string
  option_b_archetype?: string
  is_premium: boolean
  is_active: boolean
}

export interface UserChoice {
  id: string
  user_id: string
  question_id: string
  selected_option: 'A' | 'B'
  selected_archetype?: string
  category?: string
  reflection?: string
  answered_at: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  archetype?: string
  subscription_status: 'free' | 'premium' | 'cancelled' | 'past_due'
  avatar_url?: string
  onboarding_completed: boolean
}

export interface ProfileScores {
  archetype?: string
  totalAnswered: number
  categoryProgress: Record<string, { answered: number; total: number }>
  archetypeDistribution: Record<string, number>
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  body: string
  mood?: string
  tags?: string[]
  related_question_id?: string
  created_at: string
  updated_at: string
}

export interface Streak {
  current_streak: number
  longest_streak: number
  total_questions_answered: number
  last_activity_date: string
}

export interface Insight {
  id: string
  insight_type: string
  content: string
  generated_at: string
}
