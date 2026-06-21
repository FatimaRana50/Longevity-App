@AGENTS.md

---

# The Longevity Game — Project Summary for Claude

## What This Is

A **psychology-driven longevity web app** (not a biometric tracker). Users answer "Would You Rather" dilemmas about health, aging, and purpose to discover their **Longevity Archetype** across 15 dimensions.

Based on the book *Would You Rather: The Longevity Challenge* by Valentina Teekapa.
**Tagline:** "The first psychology-driven longevity platform."

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web frontend | Next.js 14 (App Router) + Tailwind CSS — `E:\Longevity-App\web\` |
| Backend API | Node.js + Express + TypeScript — `E:\Longevity-App\backend\` |
| Database + Auth | Supabase (PostgreSQL) |
| Payments | Stripe |
| AI | OpenAI API (gpt-4o-mini) |
| Mobile (Phase 2) | Expo / React Native — `E:\Longevity-App\src\` |

---

## Auth Architecture

**Important:** The web frontend does NOT talk to Supabase directly. All auth goes through the backend API.

- Login/signup/forgot-password → `POST /api/auth/*` on backend
- Token stored in `localStorage` (key: `access_token`) AND a cookie (key: `access_token`) for middleware
- `setSession()` / `clearSession()` in `web/lib/api.ts` manage both
- Next.js middleware (`web/middleware.ts`) checks the cookie to protect app routes
- Any 401 from backend auto-redirects to `/login` via the `request()` function in `api.ts`

---

## Web Pages & Routes

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Built | Landing page — marketing, no auth required |
| `/login` | ✅ Built | Email/password via backend |
| `/signup` | ✅ Built | Creates user via backend |
| `/forgot-password` | ✅ Built | Sends reset email via backend |
| `/reset-password` | ✅ Built | Reads `?token=` from URL, sets new password |
| `/onboarding` | ✅ Built | 4-step onboarding (name, interests, quiz) |
| `/today` | ✅ Built | Daily 3-question challenge |
| `/explore` | ✅ Built | 15-category library with progress bars |
| `/explore/[category]` | ✅ Built | Questions within a category |
| `/journal` | ✅ Built | Reflection entries list |
| `/insights` | ✅ Built | AI Insights — premium only |
| `/profile` | ✅ Built | Avatar, streaks, badges, dimension scores, sign out |
| `/share` | ✅ Built | Share archetype card |
| `/couples` | ✅ Built | Couples mode — premium only |

**Still needed from PRD:** Friends mode (`/friends`), PDF export, analytics/radar chart page.

---

## Backend API Routes

All routes at `http://localhost:4000`. Auth routes need `Authorization: Bearer <token>` header.

| Route | Auth | Notes |
|---|---|---|
| `POST /api/auth/signup` | No | Creates user + returns session |
| `POST /api/auth/login` | No | Returns `accessToken`, `refreshToken` |
| `POST /api/auth/forgot-password` | No | Sends reset email |
| `POST /api/auth/reset-password` | No | Needs token + new password |
| `GET /api/questions/daily` | Yes | Returns 3 questions for today |
| `GET /api/questions?category=` | Yes | Questions by category |
| `POST /api/choices` | Yes | Save an answer |
| `GET /api/choices` | Yes | All user answers |
| `GET /api/choices/stats/:id` | Yes | Community A/B split |
| `GET /api/profile` | Yes | User profile |
| `GET /api/profile/scores` | Yes | Category progress + archetype distribution |
| `PATCH /api/profile` | Yes | Update name/avatar |
| `GET /api/journal` | Yes | List entries |
| `POST /api/journal` | Yes | Create entry |
| `GET /api/streaks` | Yes | Current + longest streak |
| `POST /api/streaks/update` | Yes | Call after saving a choice |
| `GET /api/insights` | Yes + Premium | AI insights list |
| `POST /api/insights/generate` | Yes + Premium | Generate insight (rate limited 1/type/day) |
| `POST /api/couples/invite` | Yes + Premium | Generate invite code |
| `POST /api/couples/join` | Yes + Premium | Join with partner code |
| `GET /api/couples/comparison` | Yes + Premium | Compatibility score |
| `POST /api/billing/checkout` | Yes | Stripe checkout session |
| `POST /api/billing/portal` | Yes | Stripe customer portal |

---

## Key Design System (from `docs/website-design-reference.md`)

**Colors:**
- `--primary: #3C4A3E` — dark charcoal-olive (headings)
- `--secondary: #546342` — olive green (buttons, active states)
- `--secondary-light: #E8F0DC` — light olive (badge backgrounds)
- `--background: #FDF9F2` — warm off-white (page background)
- `--surface: #F1EDE6` — cream (cards)
- `--text-primary: #1C1C18` — warm charcoal (never pure black)
- `--text-secondary: #4A4E46`
- `--text-muted: #887369`

**Typography:** Lora (serif, italic for all headings) + Inter (sans for body/labels)

**Design rules:**
- Serif italic = headings always
- Cards everywhere — rounded-xl, shadow-subtle
- Uppercase 10–11px tracking-widest for metadata labels
- Nature tones only — no cold blues/grays in primary UI
- Progress bars always visible (8px, secondary fill)

---

## 7 Archetypes

1. Healthspan Maximizer
2. Prevention-First Optimizer
3. Natural Balance Seeker
4. Tech-Forward Biohacker
5. Purpose-Driven Ageless
6. Social Wellness Connector
7. Longevity Realist

---

## 15 Question Categories

nutrition, exercise, sleep, stress, preventive, biohacking, social, environment, cognitive, medical, work-life, financial, supplements, aging, legacy

---

## Subscription Model

- **Free:** Daily questions (3/day), basic profile, journal, streaks/badges
- **Premium ($9.99/mo or $79/yr):** Unlimited questions, AI insights, couples mode, full analytics, PDF export, friends mode

---

## Key Files

| File | Purpose |
|---|---|
| `web/lib/api.ts` | All frontend→backend API calls. Add new endpoints here. |
| `web/lib/types.ts` | Shared types: CATEGORY_META, ARCHETYPE_META, CategorySlug, etc. |
| `web/middleware.ts` | Protects app routes via cookie check |
| `web/components/layout/Sidebar.tsx` | Desktop nav + logout |
| `web/components/layout/BottomNav.tsx` | Mobile nav |
| `web/app/(app)/layout.tsx` | App shell — fetches user, passes to sidebar |
| `backend/src/app.ts` | Express app — register new routes here |
| `backend/src/middleware/auth.ts` | `requireAuth` middleware |
| `backend/src/middleware/premium.ts` | `requirePremium` middleware |
| `backend/src/services/supabase.ts` | Supabase service-role client |

---

## What Still Needs Building

- `/friends` page + `friends` backend routes
- Analytics / radar chart page (dimension scores visualised)
- PDF export (`GET /export/journal`)
- Questions need to be seeded into Supabase (currently 0 questions in DB)
- Onboarding completion needs to call backend to save name/interests
- Share card image generation (currently just shows a card UI, no real image)
- Stripe webhook handler needs testing with Stripe CLI
- Google / Apple OAuth (currently shows "coming soon" placeholder)
