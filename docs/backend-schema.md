# Backend Schema — The Longevity Game (Supabase / PostgreSQL)

All tables live in Supabase. Auth is handled by `supabase.auth.users`. Row Level Security (RLS) is enabled on all user-data tables.

---

## Table: `profiles`

Extends `auth.users`. Created on signup trigger.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, FK → `auth.users.id` ON DELETE CASCADE | Auto from auth |
| `email` | `text` | NOT NULL, UNIQUE | Valid email |
| `name` | `text` | NOT NULL | 1–100 chars |
| `age_range` | `text` | NULLABLE | `'18-24'`, `'25-34'`, `'35-44'`, `'45-54'`, `'55-64'`, `'65-74'`, `'75+'` |
| `gender` | `text` | NULLABLE | `'male'`, `'female'`, `'non-binary'`, `'prefer-not-to-say'` |
| `country` | `text` | NULLABLE | ISO 3166-1 alpha-2 code e.g. `'US'`, `'GB'` |
| `interests` | `text[]` | DEFAULT `'{}'` | Array from: `'nutrition'`, `'exercise'`, `'sleep'`, `'biohacking'`, `'stress'`, `'social'`, `'cognitive'`, `'preventive'`, `'supplements'`, `'environment'`, `'financial'`, `'aging'`, `'legacy'` |
| `goals` | `text[]` | DEFAULT `'{}'` | Free-form short strings, max 10 items |
| `archetype` | `text` | NULLABLE | `'healthspan-maximizer'`, `'prevention-first-optimizer'`, `'natural-balance-seeker'`, `'tech-forward-biohacker'`, `'purpose-driven-ageless'`, `'social-wellness-connector'`, `'longevity-realist'` |
| `dimension_scores` | `jsonb` | DEFAULT `'{}'` | Keys: `prevention_orientation`, `risk_tolerance`, `technology_adoption`, `healthspan_focus`, `naturalism`, `social_wellness`, `purpose_orientation`, `medical_intervention_preference`, `optimization_drive`, `financial_conservatism` — values: `0.0–10.0` |
| `onboarding_completed` | `boolean` | DEFAULT `false` | |
| `subscription_status` | `text` | DEFAULT `'free'` | `'free'`, `'premium'`, `'cancelled'`, `'past_due'` |
| `subscription_expires_at` | `timestamptz` | NULLABLE | Set when premium activated |
| `stripe_customer_id` | `text` | NULLABLE | Set on first Stripe checkout |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | Auto-updated via trigger |

**RLS:** Users can only SELECT/UPDATE their own row (`auth.uid() = id`).

---

## Table: `questions`

Seeded from the book content. Read-only for users.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `category` | `text` | NOT NULL, indexed | `'nutrition'`, `'exercise'`, `'sleep'`, `'stress'`, `'preventive'`, `'biohacking'`, `'social'`, `'environment'`, `'cognitive'`, `'medical'`, `'work-life'`, `'financial'`, `'supplements'`, `'aging'`, `'legacy'` |
| `question_text` | `text` | NOT NULL | The dilemma question |
| `option_a_text` | `text` | NOT NULL | Option A label |
| `option_b_text` | `text` | NOT NULL | Option B label |
| `option_a_insight` | `text` | NULLABLE | Explanation / science context for A |
| `option_b_insight` | `text` | NULLABLE | Explanation / science context for B |
| `option_a_archetype` | `text` | NULLABLE | Which archetype option A leans toward |
| `option_b_archetype` | `text` | NULLABLE | Which archetype option B leans toward |
| `option_a_dimension_weights` | `jsonb` | DEFAULT `'{}'` | e.g. `{"naturalism": 1, "risk_tolerance": -0.5}` |
| `option_b_dimension_weights` | `jsonb` | DEFAULT `'{}'` | Same keys as dimension_scores |
| `difficulty` | `text` | DEFAULT `'medium'` | `'easy'`, `'medium'`, `'hard'` |
| `tags` | `text[]` | DEFAULT `'{}'` | Extra metadata tags |
| `is_active` | `boolean` | DEFAULT `true` | Set false to hide without deleting |
| `is_premium` | `boolean` | DEFAULT `false` | Premium-only questions |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**RLS:** All authenticated users can SELECT where `is_active = true`. Free users additionally filtered by `is_premium = false` at app layer.

---

## Table: `user_choices`

One row per user per question answered.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE, indexed | |
| `question_id` | `uuid` | NOT NULL, FK → `questions.id` ON DELETE CASCADE, indexed | |
| `selected_option` | `text` | NOT NULL | `'A'` or `'B'` |
| `skipped` | `boolean` | DEFAULT `false` | True if user skipped |
| `reflection` | `text` | NULLABLE | Max 2000 chars |
| `mood` | `text` | NULLABLE | `'great'`, `'good'`, `'neutral'`, `'reflective'`, `'uncertain'` |
| `tags` | `text[]` | DEFAULT `'{}'` | User-applied tags |
| `answered_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

**Unique constraint:** `(user_id, question_id)` — one answer per question per user (upsert on re-answer).

**RLS:** Users can SELECT/INSERT/UPDATE their own rows only.

---

## Table: `daily_challenges`

Tracks which questions were served each day to each user.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE | |
| `date` | `date` | NOT NULL | e.g. `'2026-06-19'` |
| `question_ids` | `uuid[]` | NOT NULL | Array of 3 question UUIDs for that day |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**Unique constraint:** `(user_id, date)`

**RLS:** Users can SELECT/INSERT their own rows.

---

## Table: `journal_entries`

Standalone journal entries (not tied to a question answer).

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE, indexed | |
| `title` | `text` | NULLABLE | Max 200 chars |
| `body` | `text` | NOT NULL | Max 10,000 chars |
| `mood` | `text` | NULLABLE | `'great'`, `'good'`, `'neutral'`, `'reflective'`, `'uncertain'` |
| `tags` | `text[]` | DEFAULT `'{}'` | |
| `related_question_id` | `uuid` | NULLABLE, FK → `questions.id` | Link to a question if entry is about one |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

**RLS:** Users can SELECT/INSERT/UPDATE/DELETE their own rows.

---

## Table: `streaks`

One row per user, updated on each daily completion.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `user_id` | `uuid` | PK, FK → `profiles.id` ON DELETE CASCADE | |
| `current_streak` | `integer` | DEFAULT `0` | Days in a row with ≥1 answer |
| `longest_streak` | `integer` | DEFAULT `0` | Best ever streak |
| `last_activity_date` | `date` | NULLABLE | Last date user answered a question |
| `total_questions_answered` | `integer` | DEFAULT `0` | Lifetime count |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

**RLS:** Users can SELECT their own row. UPDATE handled by server-side function/trigger.

---

## Table: `badges`

Which badges a user has unlocked.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE, indexed | |
| `badge_slug` | `text` | NOT NULL | See badge list below |
| `unlocked_at` | `timestamptz` | DEFAULT `now()` | |

**Unique constraint:** `(user_id, badge_slug)`

**Badge slugs:**
- `first-answer` — answered 1 question
- `questions-30` — answered 30 questions
- `questions-100` — answered 100 questions
- `nutrition-master` — completed all nutrition questions
- `sleep-explorer` — completed all sleep questions
- `prevention-champion` — completed all preventive medicine questions
- `purpose-seeker` — completed all legacy & purpose questions
- `streak-7` — 7-day streak
- `streak-30` — 30-day streak
- `journal-starter` — first reflection saved
- `social-sharer` — first share generated
- `couples-connected` — completed couples mode

**RLS:** Users can SELECT their own rows.

---

## Table: `couples`

Links two user accounts for couples mode.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `initiator_id` | `uuid` | NOT NULL, FK → `profiles.id` | User who sent invite |
| `partner_id` | `uuid` | NULLABLE, FK → `profiles.id` | Set when partner accepts |
| `invite_code` | `text` | NOT NULL, UNIQUE | 8-char random code |
| `status` | `text` | DEFAULT `'pending'` | `'pending'`, `'active'`, `'disconnected'` |
| `compatibility_score` | `numeric(5,2)` | NULLABLE | 0.00–100.00, calculated on backend |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

**RLS:** Users can SELECT rows where they are `initiator_id` or `partner_id`.

---

## Table: `friends`

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` | |
| `friend_id` | `uuid` | NOT NULL, FK → `profiles.id` | |
| `status` | `text` | DEFAULT `'pending'` | `'pending'`, `'accepted'`, `'blocked'` |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**Unique constraint:** `(user_id, friend_id)`

---

## Table: `ai_insights`

Cached AI-generated content per user.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE, indexed | |
| `insight_type` | `text` | NOT NULL | `'personality-summary'`, `'reflection-summary'`, `'behavior-patterns'`, `'discussion-questions'` |
| `content` | `text` | NOT NULL | Generated text |
| `generated_at` | `timestamptz` | DEFAULT `now()` | |
| `questions_snapshot_count` | `integer` | NULLABLE | How many answers were used to generate |

**RLS:** Users can SELECT their own rows.

---

## Table: `share_cards`

Tracks generated social sharing cards.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE | |
| `card_type` | `text` | NOT NULL | `'archetype'`, `'score'`, `'category-highlight'` |
| `image_url` | `text` | NULLABLE | Stored in Supabase Storage |
| `shared_to` | `text` | NULLABLE | `'instagram'`, `'facebook'`, `'linkedin'`, `'x'`, `'tiktok'`, `'copy-link'` |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

---

## Table: `subscriptions`

Mirrors Stripe subscription state.

| Column | Type | Constraints | Accepted Values / Notes |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE, UNIQUE | |
| `stripe_subscription_id` | `text` | NOT NULL, UNIQUE | |
| `stripe_price_id` | `text` | NOT NULL | Monthly or annual price ID |
| `plan` | `text` | NOT NULL | `'monthly'` ($9.99), `'annual'` ($79) |
| `status` | `text` | NOT NULL | `'active'`, `'cancelled'`, `'past_due'`, `'trialing'` |
| `current_period_start` | `timestamptz` | NOT NULL | |
| `current_period_end` | `timestamptz` | NOT NULL | |
| `cancel_at_period_end` | `boolean` | DEFAULT `false` | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

**RLS:** Users can SELECT their own row.

---

## Supabase Functions / Triggers Needed

| Function | Purpose |
|---|---|
| `handle_new_user()` | Trigger on `auth.users` INSERT → create `profiles` row |
| `update_updated_at()` | Trigger on any table UPDATE → set `updated_at = now()` |
| `update_streak_on_answer()` | Trigger on `user_choices` INSERT → update `streaks` table |
| `check_and_award_badges()` | Trigger on `streaks` UPDATE → insert new badges |
| `recalculate_dimension_scores()` | Called after new answers → update `profiles.dimension_scores` and `archetype` |
| `calculate_compatibility()` | Called when couple status → 'active' → set `couples.compatibility_score` |

---

## Supabase Storage Buckets

| Bucket | Contents | Access |
|---|---|---|
| `share-cards` | Generated social card images | Public read, authenticated write |
| `exports` | PDF journal exports | Private, authenticated read own files |

---

## Indexes

```sql
-- Frequently queried lookups
CREATE INDEX ON user_choices (user_id);
CREATE INDEX ON user_choices (question_id);
CREATE INDEX ON user_choices (user_id, answered_at DESC);
CREATE INDEX ON questions (category);
CREATE INDEX ON questions (is_active, is_premium);
CREATE INDEX ON journal_entries (user_id, created_at DESC);
CREATE INDEX ON badges (user_id);
CREATE INDEX ON daily_challenges (user_id, date);
```
