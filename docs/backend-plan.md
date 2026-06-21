# Backend Build Plan — The Longevity Game

Build order follows PRD sprints. Each task is self-contained and testable before moving on.

---

## SPRINT 1 — Foundation (Week 1–2)

### 1.1 Supabase Project Setup
- [ ] Create Supabase project
- [ ] Set environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Enable email auth, Google OAuth, Apple OAuth in Supabase dashboard
- [ ] Configure allowed redirect URLs for web and mobile

### 1.2 Database — Core Tables
- [ ] Create `profiles` table (see `backend-schema.md`)
- [ ] Create `questions` table
- [ ] Create `user_choices` table
- [ ] Create `daily_challenges` table
- [ ] Write and apply `handle_new_user()` trigger (auto-create profile on signup)
- [ ] Write and apply `update_updated_at()` trigger on all tables

### 1.3 Row Level Security
- [ ] Enable RLS on all tables
- [ ] Write RLS policies for `profiles` (own row only)
- [ ] Write RLS policies for `user_choices` (own rows only)
- [ ] Write RLS policies for `daily_challenges` (own rows only)
- [ ] Write RLS policies for `questions` (SELECT all active, filter premium at app layer)

### 1.4 Seed Questions
- [ ] Export 180 questions from current `src/data/` files into seed SQL or CSV
- [ ] Map existing category names to schema category slugs
- [ ] Map existing archetype tags to `option_a_archetype` / `option_b_archetype`
- [ ] Write dimension weights per option for each question
- [ ] Run seed script into Supabase

### 1.5 Auth API Layer
- [ ] Email signup → profile creation flow
- [ ] Email login
- [ ] Google OAuth flow
- [ ] Apple OAuth flow
- [ ] Password reset email
- [ ] Session refresh / token handling
- [ ] Test: sign up, log in, log out, reset password

---

## SPRINT 2 — Core Features (Week 3–4)

### 2.1 Question Engine
- [ ] `GET /questions?category=` — fetch questions by category (paginated)
- [ ] `GET /questions/daily?date=` — fetch today's 3 daily questions (with category balance algorithm)
- [ ] Cache daily selection in `daily_challenges` table (avoid re-randomizing on refresh)
- [ ] Premium gate: filter `is_premium = true` questions for free users

### 2.2 User Choices
- [ ] `POST /choices` — save answer `{ question_id, selected_option, reflection, mood, tags }`
- [ ] Upsert logic: one row per `(user_id, question_id)` — allow changing answer
- [ ] `GET /choices` — return all user's answers
- [ ] `GET /choices/stats?question_id=` — community A/B distribution (anonymous aggregate)

### 2.3 Personality Engine
- [ ] `recalculate_dimension_scores(user_id)` function:
  - Pull all user choices with dimension weights from questions
  - Average weighted scores per dimension (0–10 scale)
  - Determine archetype via scoring rules
  - Update `profiles.dimension_scores` and `profiles.archetype`
- [ ] Call this function after each new answer saved
- [ ] Test with sample answer sets for each of the 7 archetypes

### 2.4 Onboarding
- [ ] Create onboarding question set (10–20 questions, separate from library)
- [ ] `POST /onboarding/complete` — saves answers, triggers archetype calculation, sets `onboarding_completed = true`

### 2.5 Journal
- [ ] Create `journal_entries` table + RLS
- [ ] `POST /journal` — create entry `{ title, body, mood, tags, related_question_id }`
- [ ] `GET /journal` — list user's entries (paginated, sorted by date)
- [ ] `GET /journal/:id` — single entry
- [ ] `PUT /journal/:id` — update entry
- [ ] `DELETE /journal/:id` — delete entry
- [ ] `GET /journal/search?q=` — full-text search on `body` + `title`

---

## SPRINT 3 — Engagement (Week 5–6)

### 3.1 Streaks
- [ ] Create `streaks` table + RLS
- [ ] `update_streak_on_answer()` trigger:
  - If `last_activity_date = yesterday` → increment `current_streak`
  - If `last_activity_date = today` → no change
  - If gap > 1 day → reset `current_streak` to 1
  - Always update `last_activity_date` and `total_questions_answered`
  - Update `longest_streak` if current exceeds it
- [ ] `GET /streaks` — return user's streak data

### 3.2 Badges
- [ ] Create `badges` table + RLS
- [ ] `check_and_award_badges(user_id)` function — check all badge conditions:
  - `first-answer`: total_questions_answered >= 1
  - `questions-30`: total_questions_answered >= 30
  - `questions-100`: total_questions_answered >= 100
  - `streak-7`: current_streak >= 7
  - `streak-30`: current_streak >= 30
  - `nutrition-master`: all nutrition questions answered
  - `sleep-explorer`: all sleep questions answered
  - `prevention-champion`: all preventive questions answered
  - `purpose-seeker`: all legacy questions answered
  - `journal-starter`: journal_entries count >= 1
- [ ] Insert new badge rows (ignore if already exists via unique constraint)
- [ ] Call after streak update
- [ ] `GET /badges` — return user's unlocked badges

### 3.3 Analytics Data
- [ ] `GET /profile/scores` — dimension scores + archetype + category completion %
- [ ] `GET /profile/history` — scores over time (requires snapshotting scores periodically)
- [ ] Create `profile_snapshots` table: `{ user_id, dimension_scores, archetype, snapshot_date }` — insert weekly via scheduled function

### 3.4 Social Sharing
- [ ] Create `share_cards` table
- [ ] `POST /share` — record share event `{ card_type, shared_to }`
- [ ] Award `social-sharer` badge on first share
- [ ] Card image generation: use server-side HTML-to-image (e.g. Puppeteer on Vercel) or pre-built templates stored in Supabase Storage

---

## SPRINT 4 — Premium & AI (Week 7–8)

### 4.1 Stripe Integration
- [ ] Create Stripe products: Monthly ($9.99/mo), Annual ($79/yr)
- [ ] `POST /billing/checkout` — create Stripe Checkout session
- [ ] `POST /billing/portal` — create Stripe Customer Portal session
- [ ] Webhook endpoint `POST /webhooks/stripe`:
  - `customer.subscription.created` → set `profiles.subscription_status = 'premium'`, create `subscriptions` row
  - `customer.subscription.updated` → update status
  - `customer.subscription.deleted` → set status to `'cancelled'`
  - `invoice.payment_failed` → set status to `'past_due'`
- [ ] Premium gate middleware: check `profiles.subscription_status` before serving premium content

### 4.2 AI Insights (OpenAI)
- [ ] `POST /insights/generate` — accepts `insight_type`, calls OpenAI with user's answer summary
  - Prompt must include: "No medical advice. Educational and reflective insights only."
  - Cache result in `ai_insights` table
- [ ] `GET /insights` — return cached insights for user
- [ ] Rate limit: max 1 generation per insight_type per day (check `generated_at`)
- [ ] Premium gate: AI insights are premium-only

### 4.3 Couples Mode
- [ ] Create `couples` table + RLS
- [ ] `POST /couples/invite` — generate invite code, create couple row
- [ ] `POST /couples/join` — accept invite via code, set `partner_id`, status → `'active'`
- [ ] `calculate_compatibility(couple_id)` function:
  - Compare overlapping answered questions
  - Score agreement % on shared answers
  - Generate discussion prompts from disagreements
- [ ] `GET /couples/comparison` — return side-by-side answer comparison + compatibility score
- [ ] Premium gate: couples mode is premium-only

### 4.4 Friends Mode
- [ ] Create `friends` table + RLS
- [ ] `POST /friends/invite` — send friend request by email or user ID
- [ ] `POST /friends/accept/:id` — accept friend request
- [ ] `GET /friends` — list accepted friends with their public archetype
- [ ] `GET /friends/:id/profile` — view friend's public profile (archetype + category scores only, no journal)

### 4.5 PDF Export
- [ ] `GET /export/journal` — generate PDF of journal entries (Puppeteer or pdfkit)
- [ ] Store in `exports` Supabase Storage bucket
- [ ] Return signed URL valid for 1 hour
- [ ] Premium gate

---

## Supporting Infrastructure

### API Design
- All endpoints are Supabase Edge Functions or Next.js API routes (Vercel)
- All authenticated routes validate `Authorization: Bearer <jwt>` via Supabase
- Standard response shape: `{ data: ..., error: null }` or `{ data: null, error: { message, code } }`

### Error Handling
- 400: Invalid input (missing required fields, bad enum value)
- 401: Not authenticated
- 403: Premium required or not your resource
- 404: Resource not found
- 429: Rate limited (AI insights)
- 500: Internal error (log to PostHog)

### Monitoring
- PostHog events: `question_answered`, `daily_challenge_completed`, `badge_unlocked`, `subscription_started`, `ai_insight_generated`, `share_card_created`

---

## Definition of Done (Backend)

- [ ] All tables created with correct types and constraints
- [ ] RLS policies tested with both owner and non-owner JWTs
- [ ] All triggers verified in Supabase SQL editor
- [ ] 180 questions seeded and queryable
- [ ] Auth flows tested end-to-end
- [ ] Stripe webhooks tested with Stripe CLI (`stripe listen`)
- [ ] AI insight generation returns valid, non-medical content
- [ ] All premium gates verified (free user blocked, premium user allowed)
