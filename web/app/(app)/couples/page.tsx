'use client'
import { useEffect, useState } from 'react'
import { couples as couplesApi, profile as profileApi, type UserProfile } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PremiumUpgradeCard } from '@/components/ui/PremiumUpgradeCard'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function CouplesPage() {
  const [prof, setProf] = useState<UserProfile | null>(null)
  const [inviteCode, setInviteCode] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [comparison, setComparison] = useState<{ compatibility: number | null; shared_questions: number; agreements: number } | null>(null)
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'inviting' | 'joining'>('loading')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [p, comp] = await Promise.allSettled([profileApi.get(), couplesApi.comparison()])
        if (p.status === 'fulfilled') setProf(p.value)
        if (comp.status === 'fulfilled') setComparison(comp.value)
      } finally {
        setLoadingState('idle')
      }
    }
    load()
  }, [])

  async function handleGetInvite() {
    setLoadingState('inviting'); setError('')
    try {
      const { invite_code } = await couplesApi.invite()
      setInviteCode(invite_code)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate code')
    } finally {
      setLoadingState('idle')
    }
  }

  async function handleJoin() {
    if (!inputValue.trim()) return
    setLoadingState('joining'); setError('')
    try {
      await couplesApi.join(inputValue.trim())
      const comp = await couplesApi.comparison()
      setComparison(comp)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to join')
    } finally {
      setLoadingState('idle')
    }
  }

  function copyCode() {
    if (!inviteCode) return
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPremium = prof?.subscription_status === 'premium'
  const hasPartner = comparison !== null && comparison.shared_questions > 0

  if (loadingState === 'loading') return (
    <div className="text-center py-20 text-text-muted font-serif italic">Loading…</div>
  )

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">💑 Couples Mode</h1>
        <p className="text-text-secondary text-sm mt-1">Compare your longevity philosophies</p>
      </div>

      {/* Premium gate */}
      {!isPremium && (
        <PremiumUpgradeCard
          title="Unlock Couples Mode"
          description="Compare your longevity values side-by-side with your partner, get a compatibility score, and discover growth areas together."
        />
      )}

      {/* Partner comparison — shown if already paired */}
      {isPremium && hasPartner && comparison && (
        <>
          <Card variant="featured" className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Wellness Compatibility</p>
            <p className="font-serif italic text-6xl text-primary mb-1">
              {comparison.compatibility !== null ? `${Math.round(comparison.compatibility)}%` : '—'}
            </p>
            {comparison.compatibility !== null && (
              <div className="my-4"><ProgressBar value={comparison.compatibility / 100} color="secondary" /></div>
            )}
            <p className="text-sm text-text-secondary">
              {comparison.shared_questions} shared questions · {comparison.agreements} agreements
            </p>
          </Card>

          <Card>
            <h3 className="font-serif italic text-lg text-primary mb-3">💬 Discussion Topics</h3>
            <ul className="text-sm text-text-secondary space-y-3">
              <li>🌿 What does a healthy 80 look like for each of you?</li>
              <li>⚡ How do you each approach biohacking and technology?</li>
              <li>🧘 Where do your stress-management styles differ most?</li>
            </ul>
          </Card>
        </>
      )}

      {/* Invite / join — only for premium */}
      {isPremium && (
        <>
          {/* Generate invite code */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Your Invite Code</p>
            {inviteCode ? (
              <div className="flex items-center gap-3">
                <span className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 font-mono text-lg font-bold text-primary tracking-widest text-center">
                  {inviteCode}
                </span>
                <button
                  onClick={copyCode}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-surface transition-colors shrink-0"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleGetInvite}
                disabled={loadingState === 'inviting'}
                className="w-full rounded-pill bg-secondary py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loadingState === 'inviting' ? 'Generating…' : 'Generate My Invite Code'}
              </button>
            )}
            <p className="text-xs text-text-muted mt-3 text-center">Share this code with your partner so they can join</p>
          </Card>

          {/* Join with partner's code */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Join a Partner</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Partner's email or invite code"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1 rounded-xl border border-[#DDE0D8] bg-white px-4 py-3 text-[14px] text-[#1C1C18] placeholder:text-[#A8ADA4] focus:outline-none focus:border-[#546342] focus:ring-2 focus:ring-[#546342]/20 transition-all"
              />
              <button
                onClick={handleJoin}
                disabled={!inputValue.trim() || loadingState === 'joining'}
                className="rounded-xl bg-[#3C4A3E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2e3930] transition-colors disabled:opacity-50"
              >
                {loadingState === 'joining' ? '…' : 'Join 💌'}
              </button>
            </div>
          </Card>
        </>
      )}

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      {/* Features preview — always visible */}
      {!hasPartner && (
        <Card>
          <h3 className="font-serif italic text-lg text-primary mb-3">✨ What you&apos;ll unlock</h3>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>💯 Wellness compatibility score</li>
            <li>💬 Personalised discussion prompts</li>
            <li>📊 Side-by-side answer comparison</li>
            <li>🌱 Growth areas to explore together</li>
          </ul>
        </Card>
      )}
    </div>
  )
}
