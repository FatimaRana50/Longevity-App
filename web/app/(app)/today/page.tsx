'use client'
import { useEffect, useState } from 'react'
import { questions as questionsApi, choices as choicesApi, streaks as streaksApi, type Question } from '@/lib/api'
import { QuestionCard } from '@/components/QuestionCard'

export default function TodayPage() {
  const [qs, setQs] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [done, setDone] = useState(false)
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
    // update streak in background
    streaksApi.update().catch(() => {})
  }

  function handleNext() {
    setAnsweredCount(c => c + 1)
    if (currentIndex + 1 >= qs.length) setDone(true)
    else setCurrentIndex(i => i + 1)
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
    <div className="text-center py-16">
      <p className="font-serif italic text-3xl text-primary mb-2">You're complete for today</p>
      <p className="text-text-secondary">Return tomorrow for new reflections.</p>
    </div>
  )

  if (!qs.length) return (
    <div className="text-center py-16">
      <p className="font-serif italic text-xl text-primary">No questions available yet</p>
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
