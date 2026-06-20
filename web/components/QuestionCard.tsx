'use client'
import { useState } from 'react'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
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
    <div className="flex flex-col gap-5">
      {/* Progress strip */}
      <div>
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>Question {answeredCount + 1} of {totalQuestions}</span>
          <span>{answeredCount}/{totalQuestions} today</span>
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
                <span className={`font-sans text-base leading-relaxed pt-0.5 ${isSelected ? 'text-primary' : 'text-text-secondary'}`}>
                  {text}
                </span>
              </button>
            )
          })}
        </div>

        {/* Reflection — always visible */}
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
        {submitted && options.find(o => o.key === selected)?.insight && (
          <div className="mb-5 rounded-card border-l-4 border-l-secondary bg-secondary-light/50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Insight
            </p>
            <p className="text-sm text-text-primary leading-relaxed">
              {options.find(o => o.key === selected)?.insight}
            </p>
          </div>
        )}

        {/* Action button */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selected || loading}
            className="w-full flex items-center justify-center gap-2 rounded-pill bg-terracotta py-3.5 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Submit Answer'}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 rounded-pill bg-secondary py-3.5 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity"
          >
            {answeredCount + 1 >= totalQuestions ? 'Complete Today' : <><span>Next Question</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        )}
      </Card>
    </div>
  )
}
