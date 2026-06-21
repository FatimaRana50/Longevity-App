'use client'
import { useState } from 'react'
import { ArrowRight, Loader2, Sparkles, SkipForward } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { choices as choicesApi } from '@/lib/api'
import type { Question } from '@/lib/types'

interface QuestionCardProps {
  question: Question
  answeredCount: number
  totalQuestions: number
  onSubmit: (choice: 'A' | 'B', reflection?: string) => Promise<void>
  onNext: () => void
  onSkip?: () => void
  showSkip?: boolean
}

export function QuestionCard({ question, answeredCount, totalQuestions, onSubmit, onNext, onSkip, showSkip = true }: QuestionCardProps) {
  const [selected, setSelected] = useState<'A' | 'B' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [reflection, setReflection] = useState('')
  const [loading, setLoading] = useState(false)
  const [skipping, setSkipping] = useState(false)
  const [communityStats, setCommunityStats] = useState<{ total: number; A: number; B: number } | null>(null)

  async function handleSubmit() {
    if (!selected) return
    setLoading(true)
    await onSubmit(selected, reflection || undefined)
    // Fetch community stats after submitting
    try {
      const stats = await choicesApi.stats(question.id)
      setCommunityStats(stats)
    } catch { /* silent */ }
    setSubmitted(true)
    setLoading(false)
  }

  async function handleSkip() {
    setSkipping(true)
    try {
      await choicesApi.save({ question_id: question.id, skipped: true })
    } catch { /* silent */ }
    setSkipping(false)
    onSkip?.()
    onNext()
  }

  const options = [
    { key: 'A' as const, text: question.option_a_text, insight: question.option_a_insight },
    { key: 'B' as const, text: question.option_b_text, insight: question.option_b_insight },
  ]

  const selectedInsight = options.find(o => o.key === selected)?.insight

  return (
    <div className="flex flex-col gap-5">
      {/* Progress strip */}
      <div>
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>Question {answeredCount + 1} of {totalQuestions}</span>
          <span>{answeredCount}/{totalQuestions} answered</span>
        </div>
        <ProgressBar value={(answeredCount + 1) / Math.max(1, totalQuestions)} />
      </div>

      <Card>
        {/* Category eyebrow */}
        {question.category && (
          <span className="inline-block mb-4 rounded-pill bg-secondary-light px-3 py-1 text-xs font-semibold uppercase tracking-widest text-secondary">
            {question.category}
          </span>
        )}

        <p className="font-serif text-2xl leading-snug text-primary mb-6 tracking-tight">
          {question.question_text}
        </p>

        {/* A / B options */}
        <div className="flex flex-col gap-3 mb-6">
          {options.map(({ key, text }) => {
            const isSelected = selected === key
            const pct = communityStats && communityStats.total > 0
              ? Math.round((communityStats[key] / communityStats.total) * 100)
              : null

            return (
              <button
                key={key}
                onClick={() => !submitted && setSelected(key)}
                disabled={submitted}
                className={`flex items-start gap-4 rounded-card-lg border-2 p-5 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-terracotta bg-terracotta-light'
                    : 'border-outline-variant bg-surface hover:border-terracotta/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-2 transition-colors ${
                  isSelected
                    ? 'border-terracotta bg-terracotta text-white'
                    : 'border-outline-variant bg-surface-elevated text-text-muted'
                }`}>
                  <span className="font-serif text-sm font-bold">{key}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`font-sans text-base leading-relaxed pt-0.5 ${isSelected ? 'text-primary' : 'text-text-secondary'}`}>
                    {text}
                  </span>
                  {/* Community split bar */}
                  {submitted && pct !== null && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                        <span>{pct}% chose this</span>
                        {isSelected && <span className="text-terracotta font-semibold">Your choice</span>}
                      </div>
                      <div className="h-1.5 rounded-full bg-outline-variant overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isSelected ? 'bg-terracotta' : 'bg-text-muted/40'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Reflection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
            Reflection (optional)
          </label>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="What drew you to this choice?"
            rows={3}
            disabled={submitted}
            className="w-full rounded-card border border-outline-variant bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary resize-none disabled:opacity-60"
          />
        </div>

        {/* Insight after submit */}
        {submitted && selectedInsight && (
          <div className="mb-5 rounded-card border-l-4 border-l-secondary bg-secondary-light/50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Insight
            </p>
            <p className="text-sm text-text-primary leading-relaxed">{selectedInsight}</p>
          </div>
        )}

        {/* Community total */}
        {submitted && communityStats && communityStats.total > 1 && (
          <p className="text-xs text-text-muted text-center mb-4">
            {communityStats.total.toLocaleString()} people have answered this question
          </p>
        )}

        {/* Actions */}
        {!submitted ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSubmit}
              disabled={!selected || loading}
              className="w-full flex items-center justify-center gap-2 rounded-pill bg-terracotta py-3.5 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Submit Answer'}
            </button>
            {showSkip && (
              <button
                onClick={handleSkip}
                disabled={skipping}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
                {skipping ? 'Skipping…' : 'Skip this question'}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 rounded-pill bg-secondary py-3.5 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity"
          >
            {answeredCount + 1 >= totalQuestions
              ? 'Complete'
              : <><span>Next Question</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        )}
      </Card>
    </div>
  )
}
