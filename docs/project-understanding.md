# The Longevity Game — Project Understanding

## What This App Is

A **psychology-driven longevity platform** (not a biometric tracker). Users answer "Would You Rather" style dilemmas about health, aging, and wellness to discover their personal longevity philosophy, archetype, and values. Based on the book *Would You Rather: The Longevity Challenge* by Valentina Teekapa.

**Tagline:** "The first psychology-driven longevity platform."

---

## Target Users

| Persona | Age | Core Interest |
|---|---|---|
| Wellness Explorer | 35–70 | Healthy aging, fitness, nutrition |
| Biohacker | Any | Biomarkers, supplements, optimization |
| Couples | Any | Shared wellness goals, compatibility |
| Executive | Any | Performance, stress, productivity |

---

## Business Goals (Year 1)

- 10,000 registered users
- 2,500 monthly active users
- 500 paid subscribers
- Revenue: $9.99/month or $79/year subscriptions
- Additional: coaching marketplace, corporate wellness, couples assessments, printable reports

---

## Platform

- **Phase 1:** Responsive web app (mobile-first)
- **Phase 2:** iOS + Android native apps
- **Tech Stack:**
  - Frontend: Next.js + React + Tailwind
  - Backend: Supabase (PostgreSQL + Auth)
  - Payments: Stripe
  - Analytics: PostHog
  - AI: OpenAI API
  - Hosting: Vercel

> **Note:** Current codebase is Expo/React Native. The PRD targets Next.js for web-first. Backend (Supabase) is shared across both.

---

## 14 Functional Modules

### MODULE 1 — User Registration
- Email signup, Google Sign-In, Apple Sign-In, password reset
- Collects: name, age range, gender (optional), country, interests, goals

### MODULE 2 — Onboarding Assessment
- 10–20 questions to create baseline longevity profile
- Topics: healthspan vs lifespan, risk tolerance, prevention mindset
- Output: initial archetype profile

### MODULE 3 — Daily Longevity Challenge
- 1 question per day (or 3 in current Expo app)
- Actions: Choose A, Choose B, Skip, Save reflection, Share
- Shows community distribution after answering

### MODULE 4 — Question Library
- **180 MVP questions** from the book, across 15 categories:
  1. Nutrition
  2. Exercise
  3. Sleep
  4. Stress
  5. Preventive Medicine
  6. Biohacking
  7. Social Connections
  8. Environment
  9. Cognitive Health
  10. Medical Interventions
  11. Work-Life Integration
  12. Financial Wellness
  13. Supplements
  14. Aging Gracefully
  15. Legacy & Purpose
- Future: 1,000+ questions

### MODULE 5 — Reflection Journal
- Per-answer: reflection text, mood, notes, tags
- Features: search, filter, export PDF, timeline view

### MODULE 6 — Personality Engine
- Calculates **Longevity Archetype** across 8 dimensions:
  1. Prevention Orientation
  2. Risk Tolerance
  3. Technology Adoption
  4. Healthspan Focus
  5. Naturalism
  6. Social Wellness
  7. Purpose Orientation
  8. Medical Intervention Preference
  9. Optimization Drive
  10. Financial Conservatism
- **7 Archetypes:**
  1. Healthspan Maximizer
  2. Prevention-First Optimizer
  3. Natural Balance Seeker
  4. Tech-Forward Biohacker
  5. Purpose-Driven Ageless
  6. Social Wellness Connector
  7. Longevity Realist

### MODULE 7 — Dashboard
- Current profile, category scores, streaks, completed challenges, journal entries, recent insights

### MODULE 8 — Visual Analytics
- Radar chart, trend chart, category scores, wellness profile map

### MODULE 9 — Gamification
- Daily/weekly/monthly streaks
- Badges: 30 Questions, 100 Questions, Nutrition Master, Sleep Explorer, Prevention Champion, Purpose Seeker, etc.

### MODULE 10 — AI Insights
- Personality summaries, reflection summaries, behavior patterns, suggested discussion questions
- **No medical advice** — educational and reflective only
- Powered by OpenAI API

### MODULE 11 — Social Sharing
- Generate shareable cards: profile type, longevity score, category highlights
- Platforms: Instagram, Facebook, LinkedIn, X, TikTok

### MODULE 12 — Couples Mode *(Premium)*
- Invite partner, compare answers/values/priorities
- Output: compatibility %, discussion prompts, growth areas

### MODULE 13 — Friends Mode
- Invite friends, compare profiles, private challenge groups, optional leaderboard

### MODULE 14 — Premium Subscription
| Free | Premium |
|---|---|
| Daily question | Unlimited questions |
| Basic profile | Full analytics |
| Journal | AI insights |
| — | Couples mode |
| — | Downloadable reports |
| — | Historical trends |

---

## Non-Functional Requirements

- Load time < 2 seconds
- 100% mobile responsive
- WCAG AA accessibility
- Senior-friendly: large typography, high contrast, clear nav
- Security: SSL, OAuth, GDPR + CCPA compliant

---

## MVP Sprint Plan (from PRD)

| Sprint | Weeks | Focus |
|---|---|---|
| 1 | 1–2 | Auth, database, question engine, basic UI |
| 2 | 3–4 | Dashboard, journal, profile engine |
| 3 | 5–6 | Analytics, streaks, badges, sharing |
| 4 | 7–8 | AI insights, premium subscriptions, beta launch |

---

## Version 2.0 Vision

- AI Longevity Coach
- Corporate Wellness Edition
- Healthcare Provider Edition
- Coach Marketplace
- Community Challenges
- White-label Enterprise Platform
