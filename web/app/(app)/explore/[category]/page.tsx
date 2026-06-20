'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { questions as questionsApi, choices as choicesApi, streaks as streaksApi, type Question } from '@/lib/api'
import { QuestionCard } from '@/components/QuestionCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CATEGORY_META, type CategorySlug } from '@/lib/types'

export default function CategoryPage() {
  const { category } = useParams<{ category: CategorySlug }>()
  const router = useRouter()
  const meta = CATEGORY_META[category]

  const [qs, setQs] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [allQs, myChoices] = await Promise.all([
          questionsApi.byCategory(category),
          choicesApi.list(),
        ])
        const answeredIds = new Set(myChoices.map(c => c.question_id))
        const unanswered = allQs.filter(q => !answeredIds.has(q.id))
        setAnsweredCount(allQs.length - unanswered.length)
        setQs(unanswered)
        if (unanswered.length === 0) setDone(true)
      } catch { /* silent */ } finally {
        setLoading(false)
      }
    }
    load()
  }, [category])

  async function handleSubmit(choice: 'A' | 'B', reflection?: string) {
    await choicesApi.save({ question_id: qs[currentIndex].id, selected_option: choice, reflection })
    streaksApi.update().catch(() => {})
  }

  function handleNext() {
    setAnsweredCount(c => c + 1)
    if (currentIndex + 1 >= qs.length) setDone(true)
    else setCurrentIndex(i => i + 1)
  }

  if (loading) return <div className="text-center py-20 text-text-muted font-serif italic">Loading…</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/explore')} className="text-text-secondary hover:text-primary transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-serif italic text-2xl text-primary flex-1 flex items-center gap-2">
          {meta && <span className={`inline-flex w-8 h-8 items-center justify-center rounded-card ${meta.color}`}><meta.icon className="w-4 h-4" /></span>}
          {meta?.label}
        </h1>
        <Badge variant="category">{answeredCount} / {answeredCount + qs.length}</Badge>
      </div>

      {done || !qs[currentIndex] ? (
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
          key={qs[currentIndex].id}
          question={qs[currentIndex]}
          answeredCount={answeredCount}
          totalQuestions={answeredCount + qs.length}
          onSubmit={handleSubmit}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
