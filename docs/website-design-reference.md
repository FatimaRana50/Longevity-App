# Website Design Reference — The Longevity Game
# Derived from mobile app audit. Use this to build the Next.js web app.

---

## 1. Color Tokens

Paste into `tailwind.config.ts` and `globals.css`:

```css
:root {
  --primary:               #3C4A3E;   /* deep charcoal-olive — headings, key UI */
  --secondary:             #546342;   /* elegant olive — buttons, active, badges */
  --secondary-light:       #E8F0DC;   /* badge backgrounds, light accents */
  --accent:                #887369;   /* dividers, borders, muted tone */
  --background:            #FDF9F2;   /* page background (warm off-white) */
  --surface:               #F1EDE6;   /* card backgrounds, soft cream */
  --surface-high:          #EBE8E1;   /* mid-tone surface */
  --surface-highest:       #E6E2DB;   /* deepest surface */
  --surface-elevated:      #FFFFFF;   /* pure white for emphasis */
  --text-primary:          #1C1C18;   /* main text — warm charcoal */
  --text-secondary:        #4A4E46;   /* secondary text — muted olive-slate */
  --text-muted:            #887369;   /* metadata, labels */
  --secondary-container:   #D8E9BE;   /* warm olive backdrop */
  --on-secondary-container:#5A6948;   /* dark olive for badge text */
  --outline-variant:       #E3E5E0;   /* ultra-thin micro-borders */
  --outline:               #887369;   /* structured accent boundaries */
  --border:                #E3E5E0;
  --border-light:          #EDE8E1;
  --text-light:            #FDF9F2;
  --text-light-muted:      #B8C4A8;
}
```

---

## 2. Typography

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-serif: 'Lora', 'Georgia', serif;          /* replaces New York */
  --font-sans:  'Inter', 'system-ui', sans-serif;  /* replaces SF Pro */
}
```

**Usage rules (mirror mobile exactly):**
- Serif: page titles, card headings, question text, hero text — always with `italic` when used as heading
- Sans: body text, labels, metadata, nav, buttons
- Sizes: 10 / 11 / 12 / 13 / 14 / 15 / 16 / 17 / 18 / 22 / 24 / 26 / 28 / 30 / 32 / 38 / 42px
- Weights: 400 (normal), 500 (medium), 600 (semibold), 700–800 (bold headings)

---

## 3. Spacing & Radius

```
Spacing scale (px): 4, 8, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40, 48, 56, 64

Border radius:
  input:       8px
  card:        12–14px
  option card: 16px
  pill:        9999px
  chip:        24px
```

---

## 4. Shadows

```css
.shadow-subtle  { box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
.shadow-card    { box-shadow: 0 2px 8px rgba(0,0,0,0.10); }
.shadow-active  { box-shadow: 0 3px 12px rgba(84,99,66,0.15); }  /* secondary color */
.shadow-elevated{ box-shadow: 0 4px 16px rgba(0,0,0,0.20); }
```

---

## 5. Responsive Breakpoints

```
mobile:  < 640px   (single column, full-width cards)
tablet:  640–1024px (2-column layout)
desktop: > 1024px  (constrained max-width 1280px, centered)
```

---

## 6. Pages & Routes

| Route | Mobile Equivalent | Auth Required |
|---|---|---|
| `/` | — | No — Landing page |
| `/onboarding` | OnboardingScreen | Yes (post-signup) |
| `/today` | QuestionScreen (TodayTab) | Yes |
| `/explore` | ExploreScreen (LibraryTab) | Yes |
| `/explore/[category]` | CategoryQuestionsScreen | Yes |
| `/journal` | JournalScreen | Yes |
| `/profile` | ProfileScreen | Yes |
| `/share` | SocialShareScreen | Yes |
| `/couples` | CouplesMode | Yes (Premium) |
| `/login` | — | No |
| `/signup` | — | No |

---

## 7. Page-by-Page Design Spec

---

### `/` — Landing Page (no mobile equivalent)

Marketing page. Converts visitors to signups.

**Sections (top to bottom):**

1. **Nav Bar**
   - Left: 🌿 logo + "The Longevity Game" (serif, italic)
   - Right: "Log in" (text link) + "Get Started" (secondary btn)
   - Sticky, bg: surface, border-bottom: 1px outline-variant

2. **Hero**
   - Headline: "Discover your longevity philosophy." (serif, italic, 48–60px, primary)
   - Subhead: "Answer thought-provoking dilemmas. Uncover how you really think about health, aging, and purpose." (sans, 18px, text-secondary)
   - CTA button: "Begin the practice" (secondary bg, pill shape, 18px padding)
   - Background: #FDF9F2 (warm off-white), no busy imagery

3. **Social proof strip**
   - "10,000+ explorers | 180 longevity dilemmas | 7 unique archetypes"
   - 11px, uppercase, text-muted, letter-spaced

4. **Sample Question Preview**
   - Static render of a QuestionCard (non-interactive)
   - Shows the "Would You Rather..." format to set expectations

5. **15 Categories Grid**
   - 5×3 grid of category cards (icon + name)
   - Shows breadth of content

6. **7 Archetypes Section**
   - Title: "Which longevity type are you?" (serif, italic)
   - 7 cards with emoji + archetype name + 1-line description
   - Horizontal scroll on mobile

7. **Pricing Section**
   - Two-column: Free vs Premium
   - Free: daily question, basic profile, journal
   - Premium: $9.99/mo or $79/yr — full analytics, AI insights, couples, PDF export
   - "Get Started Free" CTA

8. **Footer**
   - Brand + tagline | Links: About, Privacy, Terms | Social icons

---

### `/login` and `/signup`

**Layout:** Centered card on warm background (#FDF9F2)

**Card structure (same for both):**
- Logo: 🌿 + "The Longevity Game" (serif, italic, 24px)
- Title: "Welcome back" / "Begin your practice" (serif, italic, 28px)
- Form fields (Inter style, surfaceContainer bg, outlineVariant border, 8px radius)
  - Email input
  - Password input
  - (Signup only) Name input
- Primary CTA button: full-width, secondary bg, pill radius
- Divider: "or continue with"
- OAuth buttons: Google, Apple (outlined, white bg)
- Footer link: "Don't have an account? Sign up" / "Already a member? Log in"

---

### `/onboarding`

Mirror of mobile OnboardingScreen exactly. 4 steps. Full-screen centered layout.

**Step 1: Welcome**
- Logo mark (🌿 in a circle, serif italic "Longevity" below)
- Headline: "Discover your longevity philosophy." (serif, italic, 38px)
- Value prop paragraph (sans, 16px, text-secondary)
- CTA: "Begin the practice" (secondary bg, pill, full-width on mobile)
- Background: #FDF9F2

**Step 2: Name**
- Step indicator: "STEP 1 OF 3" (11px, uppercase, secondary, letter-spacing wide)
- Question: "What may I call you?" (serif, italic, 30px)
- Input: underline-only style (border-bottom, 1px secondary, no bg, serif italic 22px)
- CTA: "Continue" (disabled until name entered)

**Step 3: Interests**
- Step indicator: "STEP 2 OF 3"
- Title: "What pulls you toward this practice?" (serif, italic)
- Subtitle: "Choose any that resonate." (sans, text-secondary)
- 10 chip toggles in wrap grid:
  - Inactive: white bg, 1px border, text-primary, 24px radius
  - Active: secondary bg, white text, 24px radius
  - Labels: Healthy aging, Biohacking, Cognitive health, Relationships, Fitness, Prevention, Mental wellness, Retirement wellness, Stress reduction, Purpose & legacy

**Step 4: Quiz**
- Step indicator: "STEP 3 OF 3"
- Title: "Quick quiz" (serif, italic)
- Subtitle description paragraph
- 6 questions total (3 archetype + 3 risk tolerance)
- Two option buttons per question (A / B)
  - Surface container bg, 2px border on active (secondary), rounded 12
  - Left: option text | Right: emoji circle (52px)
- Auto-advance on selection
- On complete → redirect to `/today`

**Layout note:** Max width 480px centered on desktop, full-width on mobile.

---

### `/today` — Daily Quest

**Desktop layout:** 2-column — sidebar (left 280px) + main content (right)
**Mobile layout:** Single column, sidebar collapses to top header strip

**Sidebar (desktop only):**
- Logo + nav links
- User avatar + name
- Current streak chip: "🔥 X day streak"
- Progress: "X of 3 today"

**Main content:**
- Header: "🌿 Daily Quest" (serif, italic, 28px) + date sub-label
- QuestionCard component (see Section 8 below)
- 3 questions per day — "X of 3" indicator

---

### `/explore` — Category Library

**Header:**
- Title: "Explore" (serif, italic, 28px, primary)
- Subtitle: "All 15 dimensions of longevity"
- Border-bottom: 1px outline-variant

**Overall Progress Card:**
- White card, border, shadow
- "OVERALL PROGRESS" label (11px, uppercase, secondary)
- "X / 180 questions" count (sans, 14px)
- Progress bar (8px, secondary fill, outline-variant track, full width)

**RecommendationCard:**
- "💡 Next Steps" heading
- 1–3 recommendation cards (featured one has 2px secondary border)
- Each: icon + category name + message + progress bar + % complete

**Category Grid:**
- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: 1-column list
- Each card:
  - Icon box (48×48, rounded 12, secondary-light bg)
  - Category name (16px, bold)
  - "Done" badge (pill, secondary bg) when complete
  - Progress bar (6px)
  - "X/Y questions" count (12px, text-muted)
  - Chevron → navigates to `/explore/[category]`

---

### `/explore/[category]` — Category Questions

**Header:**
- Back link "‹ Explore" (text-secondary)
- Category title with icon (serif, italic, 18px)
- Progress pill: "X/Y" (secondary-light bg, secondary text, pill)

**Content:**
- QuestionCard (same as /today)
- Progress through all questions in category
- Completion screen (see Section 8)

---

### `/journal` — Reflection Journal

**Header:**
- Title: "Journal" (serif, italic, 28px)
- Subtitle: "Your reflections, patterns, and notes"

**Summary Card:**
- Large serif number (reflection count, 42px)
- "Reflections saved" label (11px, uppercase, text-muted)
- "Private journal" pill badge (secondary bg, white text)
- Divider + most recent note preview (2 lines, text-secondary)

**Search bar:**
- Input with search icon, surface container bg, rounded 8
- Filters: mood filter chips (horizontal scroll)

**Entry List:**
- Desktop: 2-column masonry or stacked list
- Mobile: 1-column
- Each entry card:
  - Left border: 4px secondary
  - Top row: category pill (icon + name, secondary-light bg, rounded pill) + timestamp (text-muted, 12px)
  - Question text (13px, text-secondary, 2-line clamp)
  - Reflection body (16px, text-primary, 24px line-height)
  - Bottom row: "Choice: A" + archetype pill (right)
  - Shadow-subtle, rounded 12

**Empty state:**
- Centered card: ✍️ (48px) + "No reflections yet" (serif, italic) + subtitle

---

### `/profile` — User Profile

**Desktop layout:** 2-column (left: stats + badges; right: dimension scores)
**Mobile:** Single column, stacked

**Hero Card:**
- "CURRENT PROFILE" label (10px, uppercase, secondary)
- User name (serif, italic, 26px)
- Avatar: 56×56 circle, secondary bg, white initials, 2px outline-variant border
- Stats row: "X choices saved" | divider | "Y% top dimension"
- Archetype card: emoji (28px) + archetype label + archetype name (white text on secondary bg card)

**Streaks & Badges:**
- Streak card: "Current Streak X days 🔥" | "Best Streak Y days ⭐" (side-by-side, divider between)
- Next badge card: emoji (36px) + title + description + → arrow (2px secondary border)
- Badge grid: horizontal scroll, 90px tiles, emoji (32px) + name

**Dimension Scores:**
- Section title: "Dimension scores" (serif, italic, 22px)
- Subtitle: "Percent of each category you have explored"
- Card with 15 rows:
  - Each row: icon + category name | score % (right)
  - Progress bar (8px, secondary fill)
  - "X of Y questions" below bar (12px, text-muted)

**Archetype Balance:**
- Section title: "Archetype balance" (serif, italic, 22px)
- Grid (5 cols desktop / 3 cols mobile):
  - Each tile: emoji + count (serif, 24px) + archetype label
  - White bg, border, rounded 12, shadow

---

### `/share` — Social Share

**Card Preview (centered, max-width 360px):**
- White card, 2px secondary border, shadow-active
- Large emoji (64px, centered)
- Archetype name (serif, italic, 24px)
- Tagline (14px, text-secondary)
- "X Choices Made" stat (13px, secondary)
- Brand: "THE LONGEVITY GAME" (12px, uppercase, letter-spaced)

**Share Button:**
- "📱 Share My Archetype" (serif, 17px, white, secondary bg, rounded 12, full width)
- Copies image URL or opens native share

**Platform links:**
- Instagram, Facebook, LinkedIn, X, TikTok icon buttons (row, outlined circles)

**"Why Share?" card:**
- White card, border, shadow-subtle
- Bullet list (sans, 14px, text-secondary)

---

### `/couples` — Couples Mode *(Premium)*

**Not Partnered state:**
- Title: "💑 Couples Mode" (serif, italic, 28px)
- Info card (white, border, shadow): explanation text
- Form card:
  - Label: "PARTNER'S EMAIL OR CODE" (12px, uppercase)
  - Input (outline-variant border, surface container bg, rounded 8)
  - Button: "Send Invitation 💌" (secondary bg, full width)
  - Help text below (12px, text-muted)
- Features card: "✨ Features" list

**Partnered state:**
- Compatibility card:
  - Large % (serif, 42px, secondary)
  - "WELLNESS COMPATIBILITY" label (12px, uppercase, secondary)
  - Progress bar (8px, secondary)
  - Description text
  - 2px secondary border
- Discussion topics card: "💬 Discussion Topics" + 3 emoji prompts
- Comparison card: "📊 Comparison" + 3 key/value rows

**Premium gate (if free user):**
- Blurred/locked overlay on the couples content
- "Unlock with Premium" CTA card

---

## 8. Reusable Component Specs

### QuestionCard

Used on `/today` and `/explore/[category]`.

**Pre-submission:**
```
[Daily Quest badge — pill, secondary bg]
[Would You Rather... — serif italic 32px centered]
[A choice for the long-term self. — serif italic 15px secondary]
[Question body — sans 16px centered 24px line-height]

[Option A card]   [Option B card]
 - Inactive: surface container bg, 2px outline-variant border, rounded 16
 - Active:   white bg, 2px secondary border, shadow-active
 - Left: tag (10px uppercase) + text (serif 17px)
 - Right: emoji circle 52px (inactive: outline-variant bg / active: secondary bg)

[Submit Answer 🌱 — secondary bg, serif 17px white, rounded 12, disabled = outline-variant bg]
[quote text — 12px italic outline color 0.85 opacity centered]
```

**Post-submission:**
```
[Selected option card — active style]
[✨ Insight card — white bg, 4px left border secondary, 18px padding, rounded 12]
[Community split — two-color bar, Option A %, Option B %]
[🔬 Science Says card — white bg, border, 18px padding]
[Reflection input — surface container bg, outline-variant border, rounded 14, minHeight 80]
[Next Question → button]
[X of Y completed — 12px text-muted centered]
```

### ProgressBar

```html
<div class="h-[8px] rounded-full bg-[--outline-variant] overflow-hidden">
  <div class="h-full bg-[--secondary] rounded-full" style="width: {pct}%"></div>
</div>
```

### Pill / Badge

```
Active:   secondary bg, white text, rounded-full, px-3 py-1, text-xs font-semibold uppercase
Inactive: white bg, 1px border outline-variant, text-primary text
Category: secondary-light bg, on-secondary-container text
```

### Card

```
Standard:  white bg, 1px border (outline-variant), rounded-xl, p-4–5, shadow-subtle
Featured:  white bg, 2px border (secondary), rounded-xl, p-4–5, shadow-active
Left-accent: white bg, 1px border, 4px left border (secondary), rounded-xl
```

### Avatar

```
Circle, secondary bg, white text (user initial), font-semibold
Sizes: sm=36px, md=44px, lg=56px
Border: 2px outline-variant
```

---

## 9. Navigation (Web)

**Desktop:**
- Left sidebar (fixed, 240px wide)
  - Logo top: 🌿 "The Longevity Game" (serif italic)
  - Nav links (with emoji icons, matching mobile tabs):
    - 🌿 Daily Quest → `/today`
    - 🗺️ Explore → `/explore`
    - ✍️ Journal → `/journal`
    - 👤 Profile → `/profile`
    - 🔗 Share → `/share`
    - 💑 Couples → `/couples`
  - Bottom: streak chip + user avatar

**Mobile:**
- Bottom tab bar (mirrors mobile app exactly)
  - 6 tabs with emoji + label
  - bg: surface container (#F1EDE6)
  - Active: secondary (#546342)
  - Inactive: text-muted (#887369)
  - Border-top: 1px outline-variant

---

## 10. Key Design Principles (from mobile audit)

1. **Premium minimal** — lots of white space, no clutter, warm off-white backgrounds
2. **Nature-inspired** — olive greens, warm creams, earth tones — never cold blues or grays
3. **Editorial serif** — Lora italic for all headings gives a book/journal feel
4. **Subtle interactions** — border changes (not color fills) for hover states
5. **No pure black** — use `#1C1C18` (warm charcoal) everywhere instead
6. **Cards everywhere** — content lives in rounded cards, never flat tables
7. **Progress visible** — always show how far user has come (bars, counts, %)
8. **Emoji as icons** — used throughout for warmth; not icon fonts
9. **Uppercase labels** — metadata labels are 10–11px uppercase letter-spaced, never bold-only
10. **Serif + italic = headings** — the primary visual hierarchy signal in this design system
