'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { profile as profileApi, type ProfileScores, type UserProfile } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CATEGORY_META, type CategorySlug } from '@/lib/types'

export default function ExplorePage() {
  const router = useRouter()
  const [scores, setScores] = useState<ProfileScores | null>(null)
  const [prof, setProf] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([profileApi.scores(), profileApi.get()])
      .then(([s, p]) => { setScores(s); setProf(p) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const isFree = prof?.subscription_status === 'free'
  const progress = scores?.categoryProgress ?? {}
  const totalAnswered = scores?.totalAnswered ?? 0
  const totalQuestions = Object.values(progress).reduce((s, v) => s + v.total, 0)
  const overallPct = totalQuestions ? totalAnswered / totalQuestions : 0

  const categories = Object.entries(CATEGORY_META) as [CategorySlug, typeof CATEGORY_META[CategorySlug]][]

  const recommended = [...categories]
    .map(([slug, meta]) => ({
      slug, ...meta,
      pct: progress[slug] ? progress[slug].answered / Math.max(1, progress[slug].total) : 0,
    }))
    .sort((a, b) => a.pct - b.pct)[0]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">Explore</h1>
        <p className="text-text-secondary text-sm mt-1">All 15 dimensions of longevity</p>
      </div>

      {/* Free plan notice */}
      {isFree && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm">
          <div>
            <p className="font-semibold text-text-primary">Free plan · 3 questions/day</p>
            <p className="text-text-muted text-xs mt-0.5">Upgrade for unlimited access to all categories</p>
          </div>
          <a href="/profile" className="rounded-pill bg-secondary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity shrink-0">Upgrade</a>
        </div>
      )}

      {/* Overall progress */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta mb-2">Overall Progress</p>
        <div className="mb-1">
          <span className="font-serif italic text-5xl text-primary">{totalAnswered}</span>
          <span className="font-serif italic text-2xl text-text-muted"> / {totalQuestions}</span>
        </div>
        <p className="text-xs text-text-muted mb-4">questions answered</p>
        <ProgressBar value={overallPct} />
      </Card>

      {/* Recommended */}
      {!loading && recommended && (
        <button onClick={() => router.push(`/explore/${recommended.slug}`)} className="text-left w-full">
          <Card variant="accent-left" className="hover:shadow-card transition-shadow">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Suggested for you</p>
            <p className="font-serif italic text-xl text-primary">Continue with {recommended.label}</p>
            <p className="text-sm text-text-secondary mt-1">A balanced practice covers every dimension.</p>
          </Card>
        </button>
      )}

      {loading ? (
        <p className="text-text-muted text-center py-10 font-serif italic">Loading…</p>
      ) : (
        <div className="flex flex-col gap-3">
          {categories.map(([slug, { label, icon: Icon, color }]) => {
            const p = progress[slug] ?? { answered: 0, total: 0 }
            const pct = p.total ? p.answered / p.total : 0
            const done = p.total > 0 && p.answered >= p.total
            return (
              <button key={slug} onClick={() => router.push(`/explore/${slug}`)} className="text-left w-full">
                <div className={`flex items-center gap-4 rounded-card-lg border p-4 bg-surface-elevated transition-all hover:shadow-card ${done ? 'border-secondary/30' : 'border-border'}`}>
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border border-border ${color}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif text-base text-primary">{label}</span>
                      {done && (
                        <span className="rounded-pill bg-secondary px-2.5 py-0.5 text-xs font-semibold text-white">Complete</span>
                      )}
                    </div>
                    <ProgressBar value={pct} color={done ? 'secondary' : 'terracotta'} />
                    <p className="text-xs text-text-muted mt-1.5">{p.answered} of {p.total} answered</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
