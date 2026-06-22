'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  questions as questionsApi,
  choices as choicesApi,
  streaks as streaksApi,
  profile as profileApi,
  type Question,
  type Streak,
  type UserProfile,
  type ProfileScores,
} from '@/lib/api'
import { QuestionCard } from '@/components/QuestionCard'
import { ARCHETYPE_META } from '@/lib/types'

function greeting(name?: string) {
  const h = new Date().getHours()
  const time = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  return `Good ${time}${name ? `, ${name.split(' ')[0]}` : ''}`
}

export default function TodayPage() {
  const router = useRouter()
  const [qs, setQs] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [done, setDone] = useState(false)
  const [streak, setStreak] = useState<Streak | null>(null)
  const [prof, setProf] = useState<UserProfile | null>(null)
  const [scores, setScores] = useState<ProfileScores | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      questionsApi.daily(),
      profileApi.get(),
      profileApi.scores(),
      streaksApi.get(),
    ])
      .then(([dailyQs, p, s, st]) => {
        setQs(dailyQs)
        setProf(p)
        setScores(s)
        setStreak(st)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(choice: 'A' | 'B', reflection?: string) {
    await choicesApi.save({
      question_id: qs[currentIndex].id,
      selected_option: choice,
      reflection,
    })
    streaksApi.update().catch(() => {})
  }

  function handleNext() {
    setAnsweredCount(c => c + 1)
    if (currentIndex + 1 >= qs.length) {
      setDone(true)
      streaksApi.get().then(setStreak).catch(() => {})
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  if (loading) return (
    <div className="text-center py-20 text-text-muted font-serif italic text-xl">Loading your questions…</div>
  )

  if (error) return (
    <div className="text-center py-20">
      <p className="font-serif italic text-xl text-primary mb-2">Could not load questions</p>
      <p className="text-sm text-text-muted">{error}</p>
    </div>
  )

  if (done) return (
    <div className="flex flex-col items-center text-center py-16 gap-6 max-w-sm mx-auto">
      <div className="text-6xl">🌿</div>
      <div>
        <p className="font-serif italic text-3xl text-primary mb-2">Practice complete</p>
        <p className="text-text-secondary">You've finished today's longevity reflections.</p>
      </div>

      {streak && (
        <div className="w-full rounded-card-lg border border-border bg-surface-elevated p-5 flex gap-4 justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">🔥 {streak.current_streak}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mt-1">Day Streak</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{streak.total_questions_answered}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mt-1">Total Answered</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => router.push('/explore')}
          className="w-full rounded-pill bg-secondary py-3.5 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity"
        >
          Explore more questions
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="w-full rounded-pill border border-border py-3.5 text-sm font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors"
        >
          View my profile
        </button>
      </div>

      <Link href="/journal" className="text-xs text-text-muted hover:text-secondary transition-colors">
        Recent from your journal →
      </Link>

      <p className="text-xs text-text-muted">Come back tomorrow for new reflections.</p>
    </div>
  )

  if (!qs.length) return (
    <div className="text-center py-16">
      <p className="font-serif italic text-xl text-primary mb-2">No questions available today</p>
      <p className="text-sm text-text-muted mb-6">Try exploring by category instead.</p>
      <button onClick={() => router.push('/explore')} className="rounded-pill bg-secondary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
        Explore questions
      </button>
    </div>
  )

  const archetypeMeta = prof?.archetype ? ARCHETYPE_META[prof.archetype as keyof typeof ARCHETYPE_META] : null
  const totalAnswered = scores?.totalAnswered ?? 0
  const categoriesStarted = Object.values(scores?.categoryProgress ?? {}).filter(p => p.answered > 0).length
  const currentStreakVal = streak?.current_streak ?? 0

  return (
    <div className="flex flex-col gap-5">
      {/* Greeting */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">Daily Quest</p>
        <h1 className="font-serif italic text-2xl text-primary">{greeting(prof?.name)}</h1>
        <p className="text-text-muted text-xs mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats strip */}
      <div className="flex gap-3">
        {[
          { value: `🔥 ${currentStreakVal}`, label: 'Day Streak' },
          { value: totalAnswered, label: 'Total Choices' },
          { value: categoriesStarted, label: 'Categories' },
        ].map(({ value, label }) => (
          <div key={label} className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="font-serif italic text-xl text-primary">{value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Archetype chip */}
      {archetypeMeta && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/30 bg-secondary/8 w-fit">
          <archetypeMeta.icon className="w-3.5 h-3.5 text-secondary" />
          <span className="text-xs font-semibold text-secondary">{archetypeMeta.label}</span>
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted whitespace-nowrap">
          Today's Reflection — {currentIndex + 1} of {qs.length}
        </p>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Question */}
      <QuestionCard
        key={qs[currentIndex].id}
        question={qs[currentIndex]}
        answeredCount={answeredCount}
        totalQuestions={qs.length}
        onSubmit={handleSubmit}
        onNext={handleNext}
      />
    </div>
  )
}
