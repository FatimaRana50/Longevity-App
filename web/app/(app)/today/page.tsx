'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { questions as questionsApi, choices as choicesApi, streaks as streaksApi, type Question, type Streak } from '@/lib/api'
import { QuestionCard } from '@/components/QuestionCard'

export default function TodayPage() {
  const router = useRouter()
  const [qs, setQs] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [done, setDone] = useState(false)
  const [streak, setStreak] = useState<Streak | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    questionsApi.daily()
      .then(setQs)
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
      // fetch updated streak for completion screen
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

  return (
    <div>
      <div className="mb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">Today's Reflection</p>
        <h1 className="font-serif italic text-2xl text-primary">The Longevity Game</h1>
        <p className="text-text-muted text-xs mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="mt-5">
        <QuestionCard
          key={qs[currentIndex].id}
          question={qs[currentIndex]}
          answeredCount={answeredCount}
          totalQuestions={qs.length}
          onSubmit={handleSubmit}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}
