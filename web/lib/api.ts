const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token') ?? null
}

export function setSession(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  // Cookie lets middleware check auth server-side
  document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  document.cookie = 'access_token=; path=/; max-age=0'
}

export const auth = {
  signup: async (email: string, password: string, name?: string) => {
    const res = await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message ?? 'Signup failed')
    if (json.data.accessToken) setSession(json.data.accessToken, json.data.refreshToken)
    return json.data as { accessToken?: string; user: { id: string; email: string } }
  },
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message ?? 'Login failed')
    setSession(json.data.accessToken, json.data.refreshToken)
    return json.data as { accessToken: string; refreshToken: string; user: { id: string; email: string } }
  },
  forgotPassword: async (email: string) => {
    const res = await fetch(`${BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message ?? 'Request failed')
    return json.data as { message: string }
  },
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    clearSession()
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new Error('Session expired — please sign in again')
  }
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
  save: (body: { question_id: string; selected_option?: 'A' | 'B'; skipped?: boolean; reflection?: string }) =>
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

// ── Friends ────────────────────────────────────────────────
export const friends = {
  list: () => request<FriendEntry[]>('GET', '/friends'),
  pending: () => request<FriendRequest[]>('GET', '/friends/pending'),
  invite: (email: string) => request<{ id: string; friend_name: string }>('POST', '/friends/invite', { email }),
  accept: (id: string) => request<unknown>('POST', `/friends/accept/${id}`),
  decline: (id: string) => request<unknown>('POST', `/friends/decline/${id}`),
  remove: (id: string) => request<unknown>('DELETE', `/friends/${id}`),
  compare: (friendId: string) => request<FriendComparison>('GET', `/friends/compare/${friendId}`),
}

// ── Export ─────────────────────────────────────────────────
export const exportApi = {
  journal: () => request<JournalExport>('GET', '/export/journal'),
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
  category: import('./types').CategorySlug
  option_a_text: string
  option_b_text: string
  option_a_insight?: string
  option_b_insight?: string
  option_a_archetype?: string
  option_b_archetype?: string
  difficulty?: 'easy' | 'medium' | 'hard'
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

export interface FriendEntry {
  friendship_id: string
  status: string
  friend: { id: string; name: string; email: string; archetype?: string } | null
}

export interface FriendRequest {
  request_id: string
  from: { id: string; name: string; email: string } | null
  created_at: string
}

export interface FriendComparison {
  friend: { name: string; archetype?: string } | null
  shared_questions: number
  agreements: number
  compatibility: number | null
}

export interface JournalExport {
  profile: { name: string; email: string; archetype?: string; created_at: string } | null
  entries: JournalEntry[]
  streak: Streak | null
  exported_at: string
}

export interface Insight {
  id: string
  insight_type: string
  content: string
  generated_at: string
}
