'use client'
import { useState } from 'react'
import { Lock, Loader2 } from 'lucide-react'
import { billing as billingApi } from '@/lib/api'
import { Card } from './Card'

interface Props {
  title: string
  description: string
}

export function PremiumUpgradeCard({ title, description }: Props) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const { url } = await billingApi.checkout(plan)
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card variant="featured">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Premium Feature</p>
          <p className="font-serif italic text-lg text-primary">{title}</p>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-5">{description}</p>

      {/* Plan toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden mb-4">
        <button
          type="button"
          onClick={() => setPlan('monthly')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            plan === 'monthly'
              ? 'bg-secondary text-white'
              : 'bg-surface text-text-secondary hover:bg-surface-elevated'
          }`}
        >
          $9.99 / month
        </button>
        <button
          type="button"
          onClick={() => setPlan('annual')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${
            plan === 'annual'
              ? 'bg-secondary text-white'
              : 'bg-surface text-text-secondary hover:bg-surface-elevated'
          }`}
        >
          $79 / year
          <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            plan === 'annual' ? 'bg-white/20 text-white' : 'bg-secondary/10 text-secondary'
          }`}>
            SAVE 34%
          </span>
        </button>
      </div>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-pill bg-secondary py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting…</>
        ) : (
          `Upgrade — ${plan === 'monthly' ? '$9.99/mo' : '$79/yr'}`
        )}
      </button>
    </Card>
  )
}
