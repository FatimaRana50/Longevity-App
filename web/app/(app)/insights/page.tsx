'use client'
import { useEffect, useState } from 'react'
import { Sparkles, RefreshCw, Lock } from 'lucide-react'
import { insights as insightsApi, profile as profileApi, billing as billingApi, type Insight, type UserProfile } from '@/lib/api'
import { Card } from '@/components/ui/Card'

const INSIGHT_TYPES = [
  { type: 'general',    emoji: '🧠', label: 'Overall Pattern',   desc: 'A summary of your longevity philosophy' },
  { type: 'nutrition',  emoji: '🥗', label: 'Nutrition',         desc: 'How you approach food and diet' },
  { type: 'stress',     emoji: '🌬️', label: 'Stress & Recovery', desc: 'Your stress management style' },
  { type: 'social',     emoji: '💞', label: 'Social Wellness',   desc: 'How relationships shape your health' },
  { type: 'mindset',    emoji: '✨', label: 'Mindset & Purpose', desc: 'Your purpose-driven patterns' },
]

function fmt(dateStr: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr))
}

export default function InsightsPage() {
  const [prof, setProf]         = useState<UserProfile | null>(null)
  const [insightList, setInsightList] = useState<Insight[]>([])
  const [generating, setGenerating] = useState<string | null>(null)
  const [upgrading, setUpgrading]   = useState(false)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [p, list] = await Promise.allSettled([profileApi.get(), insightsApi.list()])
        if (p.status === 'fulfilled') setProf(p.value)
        if (list.status === 'fulfilled') setInsightList(list.value)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const isPremium = prof?.subscription_status === 'premium'

  async function handleGenerate(type: string) {
    setGenerating(type); setError('')
    try {
      const insight = await insightsApi.generate(type)
      setInsightList(prev => [insight, ...prev.filter(i => i.insight_type !== type)])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate insight')
    } finally {
      setGenerating(null)
    }
  }

  async function handleUpgrade() {
    setUpgrading(true)
    try {
      const { url } = await billingApi.checkout('monthly')
      window.location.href = url
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-text-muted font-serif italic">Loading…</div>

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-serif italic text-3xl text-primary">AI Insights</h1>
        <p className="text-text-secondary text-sm mt-1">Personalised patterns from your choices — educational only, never medical advice</p>
      </div>

      {/* Premium gate */}
      {!isPremium && (
        <Card variant="featured">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Premium Feature</p>
              <p className="font-serif italic text-lg text-primary">Unlock AI Insights</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Get personalised analysis of your longevity patterns, mindset tendencies, and growth areas — generated fresh each day.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full rounded-pill bg-secondary py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {upgrading ? 'Redirecting…' : 'Upgrade to Premium — $9.99/mo'}
          </button>
        </Card>
      )}

      {/* Insight generators */}
      {isPremium && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Generate Insights</p>
          {INSIGHT_TYPES.map(({ type, emoji, label, desc }) => {
            const existing = insightList.find(i => i.insight_type === type)
            const isGenerating = generating === type
            return (
              <Card key={type} className="flex items-start gap-4">
                <span className="text-3xl shrink-0 mt-0.5">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text-primary">{label}</p>
                  <p className="text-xs text-text-muted">{desc}</p>
                  {existing && (
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed italic">&ldquo;{existing.content}&rdquo;</p>
                  )}
                  {existing && (
                    <p className="text-[10px] text-text-muted mt-1">Generated {fmt(existing.generated_at)}</p>
                  )}
                </div>
                <button
                  onClick={() => handleGenerate(type)}
                  disabled={isGenerating}
                  className="shrink-0 flex items-center gap-1.5 rounded-pill border border-secondary px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-secondary-light transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generating…' : existing ? 'Refresh' : 'Generate'}
                </button>
              </Card>
            )
          })}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 text-center bg-red-50 rounded-xl p-3">{error}</p>
      )}

      {/* Past insights list */}
      {insightList.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">All Insights</p>
          {insightList.map(insight => {
            const meta = INSIGHT_TYPES.find(t => t.type === insight.insight_type)
            return (
              <Card key={insight.id} variant="accent-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{meta?.emoji ?? '✨'}</span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary">{meta?.label ?? insight.insight_type}</p>
                  <span className="ml-auto text-[10px] text-text-muted">{fmt(insight.generated_at)}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed italic">&ldquo;{insight.content}&rdquo;</p>
              </Card>
            )
          })}
        </div>
      )}

      {isPremium && insightList.length === 0 && !loading && (
        <Card className="text-center py-12">
          <Sparkles className="w-10 h-10 text-secondary/40 mx-auto mb-4" />
          <p className="font-serif italic text-xl text-primary mb-2">No insights yet</p>
          <p className="text-sm text-text-secondary">Generate your first insight above to get started.</p>
        </Card>
      )}
    </div>
  )
}
