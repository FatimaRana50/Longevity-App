'use client'
import React, { useEffect, useState } from 'react'
import { profile as profileApi, billing as billingApi, type UserProfile, type ProfileScores } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CATEGORY_META, ARCHETYPE_META, type CategorySlug } from '@/lib/types'

const ARCH_COLORS = ['#C4654A', '#546342', '#C49B6C', '#8B7355', '#A35C4A', '#7A8B66', '#9A958B']

export default function ProfilePage() {
  const [prof, setProf] = useState<UserProfile | null>(null)
  const [scores, setScores] = useState<ProfileScores | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    Promise.all([profileApi.get(), profileApi.scores()])
      .then(([p, s]) => { setProf(p); setScores(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleUpgrade(plan: 'monthly' | 'annual') {
    setUpgrading(true)
    try {
      const { url } = await billingApi.checkout(plan)
      window.location.href = url
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-text-muted font-serif italic">Loading…</div>
  if (!prof) return null

  const archetypeMeta = prof.archetype ? ARCHETYPE_META[prof.archetype as keyof typeof ARCHETYPE_META] : null
  const archEntries = Object.entries(scores?.archetypeDistribution ?? {}).filter(([, v]) => v > 0)
  const totalArch = archEntries.reduce((a, [, v]) => a + v, 0) || 1
  const categoryProgress = scores?.categoryProgress ?? {}

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">Profile</h1>
        <p className="text-text-secondary text-sm mt-1">Your longevity dimensions</p>
      </div>

      {/* Identity */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <Avatar name={prof.name} size="lg" />
          <div className="flex-1">
            <p className="font-serif italic text-2xl text-primary">{prof.name}</p>
            <p className="text-sm text-text-muted mt-0.5">
              <span className="font-serif text-terracotta text-base">{scores?.totalAnswered ?? 0}</span> choices made
            </p>
          </div>
        </div>
        {archetypeMeta && (
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-terracotta mb-1">Primary Archetype</p>
            <p className="font-serif italic text-xl text-primary">{archetypeMeta.emoji} {archetypeMeta.label}</p>
            {archetypeMeta.tagline && (
              <p className="text-sm text-text-secondary mt-1 italic">{archetypeMeta.tagline}</p>
            )}
          </div>
        )}
      </Card>

      {/* Premium upsell */}
      {prof.subscription_status === 'free' && (
        <Card variant="featured">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Unlock Premium</p>
          <p className="font-serif italic text-xl text-primary mb-3">AI insights, couples mode & more</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpgrade('monthly')}
              disabled={upgrading}
              className="flex-1 rounded-pill bg-secondary py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              $9.99/mo
            </button>
            <button
              onClick={() => handleUpgrade('annual')}
              disabled={upgrading}
              className="flex-1 rounded-pill border-2 border-secondary py-2.5 text-sm font-semibold text-secondary hover:bg-secondary-light transition-colors disabled:opacity-50"
            >
              $79/yr — save 34%
            </button>
          </div>
        </Card>
      )}

      {/* Archetype balance */}
      {archEntries.length > 0 && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Archetype Balance</p>
          <p className="font-serif italic text-lg text-primary mb-4">How your choices distribute</p>
          <div className="flex h-3 rounded-full overflow-hidden bg-outline-variant mb-4">
            {archEntries.map(([key, val], i) => (
              <div key={key} style={{ width: `${(val / totalArch) * 100}%`, backgroundColor: ARCH_COLORS[i % ARCH_COLORS.length] }} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {archEntries.map(([key, val], i) => {
              const meta = ARCHETYPE_META[key as keyof typeof ARCHETYPE_META]
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ARCH_COLORS[i % ARCH_COLORS.length] }} />
                  <span className="flex-1 text-sm text-text-primary">{meta?.label ?? key}</span>
                  <span className="text-sm text-text-muted">{Math.round((val / totalArch) * 100)}%</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* 15 Dimensions */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">15 Dimensions</p>
        <p className="font-serif italic text-lg text-primary mb-4">Your scores</p>
        <div className="flex flex-col gap-4">
          {(Object.entries(CATEGORY_META) as [CategorySlug, { label: string; icon: React.ElementType; color: string }][]).map(([slug, { label, icon: Icon, color }]) => {
            const p = categoryProgress[slug] ?? { answered: 0, total: 0 }
            const pct = p.total ? p.answered / p.total : 0
            return (
              <div key={slug}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-sm text-text-primary">
                    <span className={`inline-flex w-5 h-5 items-center justify-center rounded ${color}`}><Icon className="w-3 h-3" /></span>
                    {label}
                  </span>
                  <span className="font-serif text-sm text-text-muted">{p.answered}</span>
                </div>
                <ProgressBar value={pct} color="secondary" />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
