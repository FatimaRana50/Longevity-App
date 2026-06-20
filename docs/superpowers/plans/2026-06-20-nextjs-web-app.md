# Next.js Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive Next.js 14 web app for The Longevity Game that mirrors the mobile app's design system and all 8 authenticated pages plus a landing page.

**Architecture:** Next.js App Router in `E:\Longevity-App\web\`, shared Supabase backend. Desktop uses a left sidebar nav; mobile uses a bottom tab bar. All pages are server-component shells with client interactive islands.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS v3, Supabase JS v2, Lora + Inter (Google Fonts), TypeScript.

## Global Constraints

- All colors must use exact hex values from `docs/website-design-reference.md` — no approximations
- Font serif = Lora (italic for headings), font sans = Inter
- Mobile-first responsive: single column → 2-col tablet (640px) → sidebar+content desktop (1024px)
- No pure black — use `#1C1C18` everywhere
- `max-w-screen-xl mx-auto` for all page content
- Supabase URL/key from env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- No medical advice copy anywhere in AI insight prompts
- Premium gate: check `profile.subscription_status === 'premium'` before showing premium content

---

## File Map

```
web/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, providers
│   ├── globals.css                 # CSS variables, base styles
│   ├── page.tsx                    # / landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # Authenticated layout — sidebar + bottom nav
│   │   ├── onboarding/page.tsx
│   │   ├── today/page.tsx
│   │   ├── explore/
│   │   │   ├── page.tsx
│   │   │   └── [category]/page.tsx
│   │   ├── journal/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── share/page.tsx
│   │   └── couples/page.tsx
├── components/
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Avatar.tsx
│   │   └── Input.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── BottomNav.tsx
│   ├── QuestionCard.tsx
│   ├── RecommendationCard.tsx
│   └── StreaksAndBadges.tsx
├── lib/
│   ├── supabase.ts                 # Supabase client
│   └── types.ts                   # Shared TypeScript types
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Task 1: Scaffold Next.js app + design tokens

**Files:**
- Create: `web/package.json`
- Create: `web/next.config.js`
- Create: `web/tailwind.config.ts`
- Create: `web/app/globals.css`
- Create: `web/app/layout.tsx`
- Create: `web/lib/types.ts`
- Create: `web/lib/supabase.ts`
- Create: `web/.env.local`

**Interfaces:**
- Produces: `colors` object via CSS variables, `fonts` via Tailwind config, `Database` type, `createClient()` function

- [ ] **Step 1: Init Next.js app**

```bash
cd E:\Longevity-App
npx create-next-app@14 web --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"
```

When prompted: use `app/` directory = yes, src dir = no, import alias = `@/*`.

- [ ] **Step 2: Install deps**

```bash
cd web
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 3: Write tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:        '#3C4A3E',
        secondary:      '#546342',
        'secondary-light': '#E8F0DC',
        accent:         '#887369',
        background:     '#FDF9F2',
        surface:        '#F1EDE6',
        'surface-high': '#EBE8E1',
        'surface-elevated': '#FFFFFF',
        'text-primary': '#1C1C18',
        'text-secondary':'#4A4E46',
        'text-muted':   '#887369',
        'secondary-container': '#D8E9BE',
        'on-secondary-container': '#5A6948',
        'outline-variant': '#E3E5E0',
        outline:        '#887369',
        border:         '#E3E5E0',
        'border-light': '#EDE8E1',
        'text-light':   '#FDF9F2',
        'text-light-muted': '#B8C4A8',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
        'pill': '9999px',
        'chip': '24px',
      },
      boxShadow: {
        'subtle':  '0 2px 6px rgba(0,0,0,0.06)',
        'card':    '0 2px 8px rgba(0,0,0,0.10)',
        'active':  '0 3px 12px rgba(84,99,66,0.15)',
        'elevated':'0 4px 16px rgba(0,0,0,0.20)',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 4: Write globals.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-serif: 'Lora', Georgia, serif;
  --font-sans:  'Inter', system-ui, sans-serif;
}

body {
  background-color: #FDF9F2;
  color: #1C1C18;
  font-family: var(--font-sans);
}

@layer utilities {
  .font-serif { font-family: var(--font-serif); }
}
```

- [ ] **Step 5: Write lib/types.ts**

```ts
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

export const CATEGORY_META: Record<CategorySlug, { label: string; icon: string }> = {
  nutrition:   { label: 'Nutrition',            icon: '🥗' },
  exercise:    { label: 'Exercise',             icon: '🏋️' },
  sleep:       { label: 'Sleep',                icon: '😴' },
  stress:      { label: 'Stress',               icon: '🧘' },
  preventive:  { label: 'Preventive Medicine',  icon: '🩺' },
  biohacking:  { label: 'Biohacking',           icon: '⚡' },
  social:      { label: 'Social Connections',   icon: '👥' },
  environment: { label: 'Environment',          icon: '🌿' },
  cognitive:   { label: 'Cognitive Health',     icon: '🧠' },
  medical:     { label: 'Medical Interventions',icon: '💊' },
  'work-life': { label: 'Work-Life Integration',icon: '⚖️' },
  financial:   { label: 'Financial Wellness',   icon: '💰' },
  supplements: { label: 'Supplements',          icon: '🧪' },
  aging:       { label: 'Aging Gracefully',     icon: '🌸' },
  legacy:      { label: 'Legacy & Purpose',     icon: '🌟' },
}

export const ARCHETYPE_META: Record<ArchetypeType, { label: string; emoji: string; tagline: string }> = {
  'healthspan-maximizer':      { label: 'Healthspan Maximizer',      emoji: '⚡', tagline: 'Quality of life above all else' },
  'prevention-first-optimizer':{ label: 'Prevention-First Optimizer',emoji: '🛡️', tagline: 'Stop problems before they start' },
  'natural-balance-seeker':    { label: 'Natural Balance Seeker',    emoji: '🌿', tagline: 'Nature knows best' },
  'tech-forward-biohacker':    { label: 'Tech-Forward Biohacker',    emoji: '🔬', tagline: 'Optimize everything' },
  'purpose-driven-ageless':    { label: 'Purpose-Driven Ageless',    emoji: '🌟', tagline: 'Meaning fuels longevity' },
  'social-wellness-connector': { label: 'Social Wellness Connector', emoji: '👥', tagline: 'Relationships are medicine' },
  'longevity-realist':         { label: 'Longevity Realist',         emoji: '⚖️', tagline: 'Balanced, evidence-based living' },
}
```

- [ ] **Step 6: Write lib/supabase.ts**

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 7: Write .env.local**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

- [ ] **Step 8: Write app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Longevity Game',
  description: 'Discover your longevity philosophy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
cd web && npm run dev
```

Expected: Server on http://localhost:3000, no TypeScript errors.

- [ ] **Step 10: Commit**

```bash
git add web/
git commit -m "feat: scaffold Next.js web app with design tokens and Supabase client"
```

---

## Task 2: UI component library

**Files:**
- Create: `web/components/ui/Card.tsx`
- Create: `web/components/ui/Badge.tsx`
- Create: `web/components/ui/Button.tsx`
- Create: `web/components/ui/ProgressBar.tsx`
- Create: `web/components/ui/Avatar.tsx`
- Create: `web/components/ui/Input.tsx`

**Interfaces:**
- Produces: `Card`, `Badge`, `Button`, `ProgressBar`, `Avatar`, `Input` — used by all page components

- [ ] **Step 1: Write Card.tsx**

```tsx
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured' | 'accent-left'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card bg-surface-elevated p-5',
        variant === 'default'    && 'border border-border shadow-subtle',
        variant === 'featured'   && 'border-2 border-secondary shadow-active',
        variant === 'accent-left'&& 'border border-border border-l-4 border-l-secondary shadow-subtle',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Write lib/utils.ts (cn helper)**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 3: Write Badge.tsx**

```tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'active' | 'inactive' | 'category' | 'muted'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'active', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      variant === 'active'   && 'bg-secondary text-white',
      variant === 'inactive' && 'border border-border bg-white text-text-primary',
      variant === 'category' && 'bg-secondary-light text-on-secondary-container',
      variant === 'muted'    && 'bg-surface text-text-muted',
      className
    )}>
      {children}
    </span>
  )
}
```

- [ ] **Step 4: Write Button.tsx**

```tsx
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function Button({
  variant = 'secondary', size = 'md', fullWidth, className, children, ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-opacity disabled:opacity-50',
        variant === 'primary'   && 'rounded-pill bg-text-primary text-white shadow-card hover:opacity-90',
        variant === 'secondary' && 'rounded-card bg-secondary text-white shadow-active hover:opacity-90',
        variant === 'ghost'     && 'rounded-card border border-border bg-transparent text-text-secondary hover:bg-surface',
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-5 py-3 text-base',
        size === 'lg' && 'px-6 py-4 text-lg',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 5: Write ProgressBar.tsx**

```tsx
interface ProgressBarProps {
  value: number   // 0–100
  height?: number // px, default 8
  className?: string
}

export function ProgressBar({ value, height = 8, className }: ProgressBarProps) {
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-outline-variant ${className ?? ''}`}
      style={{ height }}
    >
      <div
        className="h-full rounded-full bg-secondary transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
```

- [ ] **Step 6: Write Avatar.tsx**

```tsx
interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-9 h-9 text-sm', md: 'w-11 h-11 text-base', lg: 'w-14 h-14 text-lg' }

export function Avatar({ name, size = 'md' }: AvatarProps) {
  const initial = name?.[0]?.toUpperCase() ?? '?'
  return (
    <div className={`${sizes[size]} flex items-center justify-center rounded-full border-2 border-outline-variant bg-secondary font-semibold text-white`}>
      {initial}
    </div>
  )
}
```

- [ ] **Step 7: Write Input.tsx**

```tsx
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  variant?: 'default' | 'underline'
}

export function Input({ label, variant = 'default', className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none',
          variant === 'default'   && 'rounded-lg border border-outline-variant focus:border-secondary',
          variant === 'underline' && 'border-b border-secondary bg-transparent font-serif text-xl italic',
          className
        )}
        {...props}
      />
    </div>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add web/components/ui/ web/lib/utils.ts
git commit -m "feat: add UI component library (Card, Badge, Button, ProgressBar, Avatar, Input)"
```

---

## Task 3: Layout — Sidebar + BottomNav + authenticated shell

**Files:**
- Create: `web/components/layout/Sidebar.tsx`
- Create: `web/components/layout/BottomNav.tsx`
- Create: `web/app/(app)/layout.tsx`

**Interfaces:**
- Consumes: `UserProfile` from `lib/types.ts`
- Produces: Authenticated layout wrapping all `(app)` routes

- [ ] **Step 1: Write Sidebar.tsx**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/today',   emoji: '🌿', label: 'Daily Quest' },
  { href: '/explore', emoji: '🗺️', label: 'Explore' },
  { href: '/journal', emoji: '✍️',  label: 'Journal' },
  { href: '/profile', emoji: '👤', label: 'Profile' },
  { href: '/share',   emoji: '🔗', label: 'Share' },
  { href: '/couples', emoji: '💑', label: 'Couples' },
]

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 border-r border-border bg-surface px-4 py-6 gap-6">
      <div className="flex items-center gap-2 px-2">
        <span className="text-2xl">🌿</span>
        <span className="font-serif italic text-xl text-primary">The Longevity Game</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, emoji, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-secondary-light text-secondary font-semibold'
                : 'text-text-secondary hover:bg-surface-high'
            )}
          >
            <span className="text-xl">{emoji}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 px-2 pt-4 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white font-semibold text-sm">
          {userName?.[0]?.toUpperCase() ?? '?'}
        </div>
        <span className="text-sm font-medium text-text-primary truncate">{userName}</span>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Write BottomNav.tsx**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/today',   emoji: '🌿', label: 'Daily Quest' },
  { href: '/explore', emoji: '🗺️', label: 'Explore' },
  { href: '/journal', emoji: '✍️',  label: 'Journal' },
  { href: '/profile', emoji: '👤', label: 'Profile' },
  { href: '/share',   emoji: '🔗', label: 'Share' },
  { href: '/couples', emoji: '💑', label: 'Couples' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex border-t border-outline-variant bg-surface pb-safe">
      {NAV.map(({ href, emoji, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-0.5 py-2"
          >
            <span className={cn('text-xl transition-transform', active ? 'scale-110' : 'opacity-50')}>
              {emoji}
            </span>
            <span className={cn('text-[10px] font-semibold', active ? 'text-secondary' : 'text-text-muted')}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 3: Write app/(app)/layout.tsx**

```tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // TODO Task 6: replace 'Explorer' with real user name from Supabase session
  const userName = 'Explorer'
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={userName} />
      <main className="lg:pl-60 pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
```

- [ ] **Step 4: Verify layout renders**

Visit http://localhost:3000/today — should see sidebar on desktop, bottom nav on mobile (resize browser).

- [ ] **Step 5: Commit**

```bash
git add web/components/layout/ web/app/\(app\)/layout.tsx
git commit -m "feat: add responsive layout with sidebar (desktop) and bottom nav (mobile)"
```

---

## Task 4: Landing page `/`

**Files:**
- Create: `web/app/page.tsx`
- Create: `web/components/LandingNav.tsx`

- [ ] **Step 1: Write LandingNav.tsx**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-serif italic text-xl text-primary">The Longevity Game</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-primary">
            Log in
          </Link>
          <Button size="sm" as={Link} href="/signup">Get Started</Button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Write app/page.tsx**

```tsx
import Link from 'next/link'
import { LandingNav } from '@/components/LandingNav'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CATEGORY_META, ARCHETYPE_META } from '@/lib/types'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="max-w-screen-xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif italic text-5xl md:text-6xl text-primary leading-tight mb-6">
          Discover your longevity<br />philosophy.
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Answer thought-provoking dilemmas. Uncover how you really think about health, aging, and purpose.
        </p>
        <Button size="lg" variant="secondary" className="rounded-pill">
          <Link href="/signup">Begin the practice</Link>
        </Button>
      </section>

      {/* Social proof */}
      <section className="border-y border-border bg-surface py-5">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-xs font-semibold uppercase tracking-widest text-text-muted">
          <span>10,000+ explorers</span>
          <span>180 longevity dilemmas</span>
          <span>7 unique archetypes</span>
          <span>15 wellness dimensions</span>
        </div>
      </section>

      {/* Sample question */}
      <section className="max-w-screen-xl mx-auto px-6 py-20">
        <h2 className="font-serif italic text-3xl text-primary text-center mb-10">
          How it works
        </h2>
        <div className="max-w-xl mx-auto">
          <Card className="text-center">
            <span className="inline-block mb-3 rounded-pill bg-secondary px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Daily Quest
            </span>
            <h3 className="font-serif italic text-2xl text-primary mb-2">Would You Rather...</h3>
            <p className="text-text-secondary text-sm italic mb-6">A choice for the long-term self.</p>
            <p className="text-text-primary text-lg mb-8">
              Live to 100 with limited mobility, or live to 80 in peak health?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Live to 100 🧓', 'Live to 80 💪'].map((opt) => (
                <div key={opt} className="rounded-card-lg border-2 border-outline-variant bg-surface p-4 text-sm font-medium text-text-primary">
                  {opt}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* 15 Categories */}
      <section className="bg-surface py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="font-serif italic text-3xl text-primary text-center mb-10">
            15 dimensions of longevity
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {Object.values(CATEGORY_META).map(({ label, icon }) => (
              <Card key={label} className="flex flex-col items-center gap-2 py-4 text-center">
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-medium text-text-secondary">{label}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Archetypes */}
      <section className="max-w-screen-xl mx-auto px-6 py-20">
        <h2 className="font-serif italic text-3xl text-primary text-center mb-3">
          Which longevity type are you?
        </h2>
        <p className="text-center text-text-secondary mb-10">Answer 10 questions to find out.</p>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {Object.values(ARCHETYPE_META).map(({ label, emoji, tagline }) => (
            <Card key={label} className="min-w-[200px] snap-start flex flex-col items-center gap-2 py-6 text-center">
              <span className="text-4xl">{emoji}</span>
              <p className="font-semibold text-text-primary text-sm">{label}</p>
              <p className="text-xs text-text-muted italic">{tagline}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-surface py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="font-serif italic text-3xl text-primary text-center mb-10">Simple pricing</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">Free</p>
              <p className="font-serif italic text-3xl text-primary mb-4">$0</p>
              <ul className="text-sm text-text-secondary space-y-2 mb-6">
                <li>✓ Daily question</li>
                <li>✓ Basic profile</li>
                <li>✓ Journal</li>
              </ul>
              <Button variant="ghost" fullWidth>
                <Link href="/signup">Get started free</Link>
              </Button>
            </Card>
            <Card variant="featured">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Premium</p>
              <p className="font-serif italic text-3xl text-primary mb-1">$9.99<span className="text-lg">/mo</span></p>
              <p className="text-sm text-text-muted mb-4">or $79/year</p>
              <ul className="text-sm text-text-secondary space-y-2 mb-6">
                <li>✓ Unlimited questions</li>
                <li>✓ Full analytics</li>
                <li>✓ AI insights</li>
                <li>✓ Couples mode</li>
                <li>✓ Downloadable reports</li>
              </ul>
              <Button variant="secondary" fullWidth className="rounded-pill">
                <Link href="/signup">Start free trial</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <span className="font-serif italic">The Longevity Game™</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">About</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Step 3: Verify landing page**

Visit http://localhost:3000 — should see hero, categories grid, archetype horizontal scroll, pricing cards, footer.

- [ ] **Step 4: Commit**

```bash
git add web/app/page.tsx web/components/LandingNav.tsx
git commit -m "feat: add landing page with hero, categories, archetypes, and pricing"
```

---

## Task 5: Auth pages `/login` and `/signup`

**Files:**
- Create: `web/app/(auth)/login/page.tsx`
- Create: `web/app/(auth)/signup/page.tsx`
- Create: `web/app/(auth)/layout.tsx`

- [ ] **Step 1: Write (auth)/layout.tsx**

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🌿</span>
          <p className="font-serif italic text-xl text-primary mt-2">The Longevity Game</p>
        </div>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write login/page.tsx**

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/today')
  }

  return (
    <Card>
      <h1 className="font-serif italic text-2xl text-primary mb-6 text-center">Welcome back</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-secondary font-medium hover:underline">Sign up</Link>
      </div>
    </Card>
  )
}
```

- [ ] **Step 3: Write signup/page.tsx**

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/onboarding')
  }

  return (
    <Card>
      <h1 className="font-serif italic text-2xl text-primary mb-6 text-center">Begin your practice</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Your name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-text-muted">
        Already a member?{' '}
        <Link href="/login" className="text-secondary font-medium hover:underline">Log in</Link>
      </div>
    </Card>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add web/app/\(auth\)/
git commit -m "feat: add login and signup pages with Supabase auth"
```

---

## Task 6: Today page `/today`

**Files:**
- Create: `web/app/(app)/today/page.tsx`
- Create: `web/components/QuestionCard.tsx`

- [ ] **Step 1: Write QuestionCard.tsx**

```tsx
'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Question } from '@/lib/types'

interface QuestionCardProps {
  question: Question
  answeredCount: number
  totalQuestions: number
  onSubmit: (choice: 'A' | 'B', reflection?: string) => Promise<void>
  onNext: () => void
}

export function QuestionCard({ question, answeredCount, totalQuestions, onSubmit, onNext }: QuestionCardProps) {
  const [selected, setSelected] = useState<'A' | 'B' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [reflection, setReflection] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!selected) return
    setLoading(true)
    await onSubmit(selected, reflection || undefined)
    setSubmitted(true)
    setLoading(false)
  }

  const options = [
    { key: 'A' as const, text: question.option_a_text, insight: question.option_a_insight },
    { key: 'B' as const, text: question.option_b_text, insight: question.option_b_insight },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-center">
        <Badge variant="active" className="mb-4">Daily Quest</Badge>
        <h2 className="font-serif italic text-3xl text-primary mb-2">Would You Rather...</h2>
        <p className="font-serif italic text-sm text-text-secondary">A choice for the long-term self.</p>
      </div>

      <Card>
        <p className="text-text-primary text-lg text-center leading-relaxed mb-6">
          {question.question_text}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {options.map(({ key, text }) => (
            <button
              key={key}
              onClick={() => !submitted && setSelected(key)}
              disabled={submitted}
              className={`flex items-center gap-3 rounded-card-lg border-2 p-5 text-left transition-all ${
                selected === key
                  ? 'border-secondary bg-white shadow-active'
                  : 'border-outline-variant bg-surface hover:border-secondary/40'
              }`}
            >
              <div className="flex-1">
                <span className="block text-xs font-semibold uppercase tracking-widest text-secondary opacity-75 mb-1">
                  Option {key}
                </span>
                <span className="font-serif text-base text-text-primary">{text}</span>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${
                selected === key ? 'bg-secondary shadow-active' : 'bg-outline-variant'
              }`}>
                {key === 'A' ? '🌱' : '⚡'}
              </div>
            </button>
          ))}
        </div>

        {/* Submit */}
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!selected || loading}
            fullWidth
            className="rounded-card"
          >
            {loading ? 'Saving…' : 'Submit Answer 🌱'}
          </Button>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Insight */}
            {options.find(o => o.key === selected)?.insight && (
              <Card variant="accent-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">✨ Insight</p>
                <p className="text-sm text-text-primary leading-relaxed">
                  {options.find(o => o.key === selected)?.insight}
                </p>
              </Card>
            )}

            {/* Reflection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-text-muted">Your reflection (optional)</label>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="What made you choose this?"
                rows={3}
                className="w-full rounded-card bg-surface border border-outline-variant px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary resize-none"
              />
            </div>

            <Button onClick={onNext} fullWidth className="rounded-card">
              {answeredCount + 1 >= totalQuestions ? 'Finish 🎉' : 'Next Question →'}
            </Button>
          </div>
        )}
      </Card>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        <ProgressBar value={((answeredCount) / totalQuestions) * 100} />
        <p className="text-xs text-text-muted text-center">{answeredCount} of {totalQuestions} completed</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write today/page.tsx**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { QuestionCard } from '@/components/QuestionCard'
import { Card } from '@/components/ui/Card'
import type { Question } from '@/lib/types'

export default function TodayPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(3)
      setQuestions(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(choice: 'A' | 'B', reflection?: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !questions[currentIndex]) return
    await supabase.from('user_choices').upsert({
      user_id: user.id,
      question_id: questions[currentIndex].id,
      selected_option: choice,
      reflection: reflection ?? null,
      answered_at: new Date().toISOString(),
    }, { onConflict: 'user_id,question_id' })
  }

  function handleNext() {
    setAnsweredCount(c => c + 1)
    if (currentIndex + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-text-muted font-serif italic text-xl">Loading your questions…</div>
  }

  if (done) {
    return (
      <Card className="text-center py-12">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="font-serif italic text-2xl text-primary mb-2">All done for today!</h2>
        <p className="text-text-secondary">Come back tomorrow for more questions.</p>
      </Card>
    )
  }

  if (!questions.length) {
    return (
      <Card className="text-center py-12">
        <p className="text-5xl mb-4">🌿</p>
        <h2 className="font-serif italic text-xl text-primary">No questions available</h2>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif italic text-3xl text-primary">Daily Quest</h1>
        <p className="text-text-secondary text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
      <QuestionCard
        question={questions[currentIndex]}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onSubmit={handleSubmit}
        onNext={handleNext}
      />
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Visit http://localhost:3000/today — should show a question card with two option buttons, submit, insight after answering, next button.

- [ ] **Step 4: Commit**

```bash
git add web/components/QuestionCard.tsx web/app/\(app\)/today/
git commit -m "feat: add daily quest page with interactive question card"
```

---

## Task 7: Explore pages `/explore` and `/explore/[category]`

**Files:**
- Create: `web/app/(app)/explore/page.tsx`
- Create: `web/app/(app)/explore/[category]/page.tsx`

- [ ] **Step 1: Write explore/page.tsx**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CATEGORY_META, type CategorySlug } from '@/lib/types'

export default function ExplorePage() {
  const router = useRouter()
  const [progress, setProgress] = useState<Record<string, { answered: number; total: number }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: questions }, { data: choices }] = await Promise.all([
        supabase.from('questions').select('id,category').eq('is_active', true),
        supabase.from('user_choices').select('question_id').eq('user_id', user.id),
      ])

      const answeredIds = new Set(choices?.map(c => c.question_id) ?? [])
      const map: Record<string, { answered: number; total: number }> = {}

      for (const q of questions ?? []) {
        if (!map[q.category]) map[q.category] = { answered: 0, total: 0 }
        map[q.category].total++
        if (answeredIds.has(q.id)) map[q.category].answered++
      }

      setProgress(map)
      setLoading(false)
    }
    load()
  }, [])

  const totalAnswered = Object.values(progress).reduce((s, v) => s + v.answered, 0)
  const totalQuestions = Object.values(progress).reduce((s, v) => s + v.total, 0)
  const overallPct = totalQuestions ? Math.round((totalAnswered / totalQuestions) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">Explore</h1>
        <p className="text-text-secondary text-sm mt-1">All 15 dimensions of longevity</p>
      </div>

      {/* Overall progress */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Overall Progress</p>
        <p className="text-sm text-text-secondary mb-3">{totalAnswered} / {totalQuestions} questions</p>
        <ProgressBar value={overallPct} height={8} />
      </Card>

      {/* Category grid */}
      {loading ? (
        <p className="text-text-muted text-center py-10 font-serif italic">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(CATEGORY_META) as [CategorySlug, { label: string; icon: string }][]).map(([slug, { label, icon }]) => {
            const p = progress[slug] ?? { answered: 0, total: 0 }
            const pct = p.total ? Math.round((p.answered / p.total) * 100) : 0
            const done = p.answered === p.total && p.total > 0
            return (
              <button
                key={slug}
                onClick={() => router.push(`/explore/${slug}`)}
                className="text-left w-full"
              >
                <Card className="hover:shadow-card transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-card flex items-center justify-center bg-secondary-light text-2xl shrink-0">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-sm truncate">{label}</p>
                      <p className="text-xs text-text-muted">{p.answered}/{p.total} questions</p>
                    </div>
                    {done ? <Badge variant="active">Done</Badge> : <span className="text-text-muted text-lg">›</span>}
                  </div>
                  <ProgressBar value={pct} height={6} />
                </Card>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write explore/[category]/page.tsx**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { QuestionCard } from '@/components/QuestionCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CATEGORY_META, type CategorySlug, type Question } from '@/lib/types'

export default function CategoryPage() {
  const { category } = useParams<{ category: CategorySlug }>()
  const router = useRouter()
  const meta = CATEGORY_META[category]
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)

      if (!user || !questions) { setLoading(false); return }

      const { data: choices } = await supabase
        .from('user_choices')
        .select('question_id')
        .eq('user_id', user.id)

      const answeredIds = new Set(choices?.map(c => c.question_id) ?? [])
      const unanswered = questions.filter(q => !answeredIds.has(q.id))
      setAnsweredCount(questions.length - unanswered.length)
      setQuestions(unanswered)
      if (unanswered.length === 0) setDone(true)
      setLoading(false)
    }
    load()
  }, [category])

  async function handleSubmit(choice: 'A' | 'B', reflection?: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !questions[currentIndex]) return
    await supabase.from('user_choices').upsert({
      user_id: user.id,
      question_id: questions[currentIndex].id,
      selected_option: choice,
      reflection: reflection ?? null,
      answered_at: new Date().toISOString(),
    }, { onConflict: 'user_id,question_id' })
  }

  function handleNext() {
    setAnsweredCount(c => c + 1)
    if (currentIndex + 1 >= questions.length) setDone(true)
    else setCurrentIndex(i => i + 1)
  }

  if (loading) return <div className="text-center py-20 text-text-muted font-serif italic">Loading…</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/explore')} className="text-text-secondary text-2xl hover:text-primary">‹</button>
        <h1 className="font-serif italic text-2xl text-primary flex-1">
          {meta?.icon} {meta?.label}
        </h1>
        <Badge variant="category">{answeredCount} / {answeredCount + questions.length}</Badge>
      </div>

      {done ? (
        <Card className="text-center py-12">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="font-serif italic text-2xl text-primary mb-2">Category Complete!</h2>
          <p className="text-text-secondary mb-6">You answered all questions in {meta?.label}.</p>
          <button onClick={() => router.push('/explore')} className="text-secondary font-medium hover:underline">
            ← Back to Explore
          </button>
        </Card>
      ) : (
        <QuestionCard
          question={questions[currentIndex]}
          answeredCount={answeredCount}
          totalQuestions={answeredCount + questions.length}
          onSubmit={handleSubmit}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add web/app/\(app\)/explore/
git commit -m "feat: add explore page and category drill-down with progress tracking"
```

---

## Task 8: Journal, Profile, Share, Couples pages

**Files:**
- Create: `web/app/(app)/journal/page.tsx`
- Create: `web/app/(app)/profile/page.tsx`
- Create: `web/app/(app)/share/page.tsx`
- Create: `web/app/(app)/couples/page.tsx`

- [ ] **Step 1: Write journal/page.tsx**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { UserChoice } from '@/lib/types'

interface ChoiceWithQuestion extends UserChoice {
  questions: { question_text: string; category: string } | null
}

export default function JournalPage() {
  const [entries, setEntries] = useState<ChoiceWithQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('user_choices')
        .select('*, questions(question_text, category)')
        .eq('user_id', user.id)
        .not('reflection', 'is', null)
        .order('answered_at', { ascending: false })
      setEntries((data as ChoiceWithQuestion[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const withReflection = entries.filter(e => e.reflection && e.reflection.trim())

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">Journal</h1>
        <p className="text-text-secondary text-sm mt-1">Your reflections, patterns, and notes</p>
      </div>

      {/* Summary */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="font-serif italic text-4xl text-primary">{withReflection.length}</span>
          <Badge variant="active">Private journal</Badge>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Reflections saved</p>
      </Card>

      {loading ? (
        <p className="text-center text-text-muted font-serif italic py-10">Loading…</p>
      ) : withReflection.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-5xl mb-4">✍️</p>
          <h2 className="font-serif italic text-xl text-primary mb-2">No reflections yet</h2>
          <p className="text-text-secondary text-sm">Add a reflection when answering a question.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {withReflection.map(entry => (
            <Card key={entry.id} variant="accent-left">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="category">{entry.questions?.category ?? 'general'}</Badge>
                <span className="text-xs text-text-muted">
                  {new Date(entry.answered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              {entry.questions?.question_text && (
                <p className="text-xs text-text-secondary mb-2 line-clamp-2">{entry.questions.question_text}</p>
              )}
              <p className="text-text-primary text-base leading-relaxed">{entry.reflection}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-text-muted">Choice: {entry.selected_option}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write profile/page.tsx**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CATEGORY_META, ARCHETYPE_META, type UserProfile, type CategorySlug } from '@/lib/types'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [choiceCount, setChoiceCount] = useState(0)
  const [categoryProgress, setCategoryProgress] = useState<Record<string, { answered: number; total: number }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: prof }, { count }, { data: questions }, { data: choices }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_choices').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('questions').select('id,category').eq('is_active', true),
        supabase.from('user_choices').select('question_id').eq('user_id', user.id),
      ])

      setProfile(prof as UserProfile)
      setChoiceCount(count ?? 0)

      const answeredIds = new Set(choices?.map(c => c.question_id) ?? [])
      const map: Record<string, { answered: number; total: number }> = {}
      for (const q of questions ?? []) {
        if (!map[q.category]) map[q.category] = { answered: 0, total: 0 }
        map[q.category].total++
        if (answeredIds.has(q.id)) map[q.category].answered++
      }
      setCategoryProgress(map)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-center py-20 text-text-muted font-serif italic">Loading…</div>
  if (!profile) return null

  const archetypeMeta = profile.archetype ? ARCHETYPE_META[profile.archetype] : null
  const topScore = Math.max(...Object.values(categoryProgress).map(p => p.total ? Math.round((p.answered / p.total) * 100) : 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">Profile</h1>
        <p className="text-text-secondary text-sm mt-1">Your longevity dimensions at a glance</p>
      </div>

      {/* Hero */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Current Profile</p>
        <div className="flex items-center gap-4 mb-4">
          <Avatar name={profile.name} size="lg" />
          <div>
            <p className="font-serif italic text-2xl text-primary">{profile.name}</p>
            {archetypeMeta && (
              <Badge variant="category" className="mt-1">{archetypeMeta.emoji} {archetypeMeta.label}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <div className="text-center flex-1">
            <p className="font-serif text-2xl text-primary">{choiceCount}</p>
            <p className="text-xs text-text-muted">choices saved</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center flex-1">
            <p className="font-serif text-2xl text-primary">{topScore}%</p>
            <p className="text-xs text-text-muted">top dimension</p>
          </div>
        </div>
      </Card>

      {/* Dimension scores */}
      <div>
        <h2 className="font-serif italic text-xl text-primary mb-3">Dimension scores</h2>
        <p className="text-text-secondary text-sm mb-4">Percent of each category you have explored</p>
        <Card>
          <div className="flex flex-col gap-4">
            {(Object.entries(CATEGORY_META) as [CategorySlug, { label: string; icon: string }][]).map(([slug, { label, icon }]) => {
              const p = categoryProgress[slug] ?? { answered: 0, total: 0 }
              const pct = p.total ? Math.round((p.answered / p.total) * 100) : 0
              return (
                <div key={slug}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text-primary">{icon} {label}</span>
                    <span className="text-sm font-semibold text-secondary">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} height={8} />
                  <p className="text-xs text-text-muted mt-1">{p.answered} of {p.total} questions</p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write share/page.tsx**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ARCHETYPE_META, type UserProfile } from '@/lib/types'

export default function SharePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [choiceCount, setChoiceCount] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: prof }, { count }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_choices').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      setProfile(prof as UserProfile)
      setChoiceCount(count ?? 0)
    }
    load()
  }, [])

  const meta = profile?.archetype ? ARCHETYPE_META[profile.archetype] : null

  function handleCopy() {
    navigator.clipboard.writeText(`${window.location.origin}/share/${profile?.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!profile?.archetype) {
    return (
      <Card className="text-center py-12">
        <p className="text-5xl mb-4">🌿</p>
        <h2 className="font-serif italic text-xl text-primary mb-2">Complete questions to unlock sharing</h2>
        <p className="text-text-secondary text-sm">Answer more questions to discover your archetype.</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">Share Your Results</h1>
      </div>

      {/* Card preview */}
      <Card variant="featured" className="text-center py-8">
        <p className="text-6xl mb-4">{meta?.emoji}</p>
        <h2 className="font-serif italic text-2xl text-primary mb-2">{meta?.label}</h2>
        <p className="text-text-secondary text-sm mb-4">{meta?.tagline}</p>
        <p className="text-secondary text-sm font-semibold mb-4">{choiceCount} Choices Made</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">The Longevity Game</p>
      </Card>

      <Button onClick={handleCopy} fullWidth className="rounded-card">
        {copied ? '✓ Copied!' : '🔗 Copy Share Link'}
      </Button>

      <Card>
        <h3 className="font-semibold text-text-primary mb-3">Why Share?</h3>
        <ul className="text-sm text-text-secondary space-y-2">
          <li>• Spark conversations about healthy aging</li>
          <li>• Find others with your longevity philosophy</li>
          <li>• Inspire friends to discover their archetype</li>
        </ul>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Write couples/page.tsx**

```tsx
'use client'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'

export default function CouplesPage() {
  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">💑 Couples Mode</h1>
        <p className="text-text-secondary text-sm mt-1">Compare your longevity philosophies</p>
      </div>

      <Card>
        <p className="text-text-secondary text-sm leading-relaxed">
          Invite your partner to compare answers, discover shared values, and explore your longevity compatibility.
        </p>
      </Card>

      <Card>
        <Input label="Partner's Email or Invite Code" placeholder="partner@email.com or ABC12345" />
        <Button fullWidth className="mt-4 rounded-card">Send Invitation 💌</Button>
        <p className="text-xs text-text-muted mt-3 text-center">
          Ask your partner to share their invite code from their Profile page.
        </p>
      </Card>

      {/* Premium upsell */}
      <Card variant="featured">
        <Badge variant="active" className="mb-3">Premium Feature</Badge>
        <h3 className="font-serif italic text-xl text-primary mb-3">✨ What you'll unlock</h3>
        <ul className="text-sm text-text-secondary space-y-2">
          <li>💯 Wellness compatibility score</li>
          <li>💬 Personalized discussion prompts</li>
          <li>📊 Side-by-side answer comparison</li>
          <li>🌱 Growth areas to explore together</li>
        </ul>
      </Card>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add web/app/\(app\)/journal/ web/app/\(app\)/profile/ web/app/\(app\)/share/ web/app/\(app\)/couples/
git commit -m "feat: add journal, profile, share, and couples pages"
```

---

## Task 9: Onboarding page `/onboarding`

**Files:**
- Create: `web/app/(app)/onboarding/page.tsx`

- [ ] **Step 1: Write onboarding/page.tsx**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const INTERESTS = [
  'Healthy aging', 'Biohacking', 'Cognitive health', 'Relationships',
  'Fitness', 'Prevention', 'Mental wellness', 'Retirement wellness',
  'Stress reduction', 'Purpose & legacy',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  function toggleInterest(item: string) {
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  async function finish() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        name,
        interests,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
    }
    router.push('/today')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-light text-3xl mb-3">🌿</div>
          <p className="font-serif italic text-lg text-primary">Longevity</p>
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center">
            <h1 className="font-serif italic text-4xl text-primary mb-4">
              Discover your longevity philosophy.
            </h1>
            <p className="text-text-secondary mb-10 leading-relaxed">
              Answer thought-provoking dilemmas to uncover your personal approach to health, aging, and purpose.
            </p>
            <Button size="lg" fullWidth className="rounded-pill" onClick={() => setStep(1)}>
              Begin the practice
            </Button>
          </div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-6 text-center">Step 1 of 2</p>
            <h2 className="font-serif italic text-3xl text-primary mb-8 text-center">What may I call you?</h2>
            <Input
              variant="underline"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="text-center mb-8"
            />
            <Button size="lg" fullWidth className="rounded-pill" disabled={!name.trim()} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-4 text-center">Step 2 of 2</p>
            <h2 className="font-serif italic text-2xl text-primary mb-2 text-center">
              What pulls you toward this practice?
            </h2>
            <p className="text-text-secondary text-sm text-center mb-6">Choose any that resonate.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {INTERESTS.map(item => (
                <button
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={cn(
                    'px-4 py-2 rounded-chip text-sm font-medium transition-all border',
                    interests.includes(item)
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-text-primary border-border hover:border-secondary'
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <Button size="lg" fullWidth className="rounded-pill" onClick={finish} disabled={saving}>
              {saving ? 'Saving…' : 'Start exploring →'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify flow**

Visit http://localhost:3000/onboarding — step through Welcome → Name → Interests → redirects to /today.

- [ ] **Step 3: Commit**

```bash
git add web/app/\(app\)/onboarding/
git commit -m "feat: add multi-step onboarding flow"
```

---

## Task 10: Final polish + production readiness

**Files:**
- Modify: `web/next.config.js`
- Create: `web/middleware.ts`

- [ ] **Step 1: Write middleware.ts (auth redirect)**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookies) => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  const isAppRoute = request.nextUrl.pathname.startsWith('/today') ||
    request.nextUrl.pathname.startsWith('/explore') ||
    request.nextUrl.pathname.startsWith('/journal') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/share') ||
    request.nextUrl.pathname.startsWith('/couples') ||
    request.nextUrl.pathname.startsWith('/onboarding')

  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/today', request.url))
  }
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```

- [ ] **Step 2: Update next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: [] },
}
module.exports = nextConfig
```

- [ ] **Step 3: Final build check**

```bash
cd web && npm run build
```

Expected: No TypeScript errors, no build failures.

- [ ] **Step 4: Final commit**

```bash
git add web/middleware.ts web/next.config.js
git commit -m "feat: add auth middleware and production build config"
```
