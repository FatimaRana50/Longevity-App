'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Share2, X, Link2, Check } from 'lucide-react'
import { profile as profileApi, billing as billingApi, streaks as streaksApi, choices as choicesApi, clearSession, type UserProfile, type ProfileScores, type Streak, type UserChoice } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RadarChart } from '@/components/RadarChart'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_META, ARCHETYPE_META, type CategorySlug } from '@/lib/types'

const COUNT_BADGES = [
  { id: 'first-step',      emoji: '🌱', name: 'First Step',     desc: 'Answer your first question',  req: 1   },
  { id: 'explorer-10',     emoji: '🗺️', name: 'Explorer',       desc: 'Answer 10 questions',          req: 10  },
  { id: 'committed-30',    emoji: '🔥', name: 'Committed',      desc: 'Answer 30 questions',          req: 30  },
  { id: 'centurion-100',   emoji: '💯', name: 'Centurion',      desc: 'Answer 100 questions',         req: 100 },
  { id: 'philosopher-180', emoji: '🧠', name: 'Philosopher',    desc: 'Complete all 180 questions',   req: 180 },
  { id: 'streak-7',        emoji: '⚡', name: 'Week Warrior',   desc: '7-day streak',                 streakReq: 7  },
  { id: 'streak-30',       emoji: '🌟', name: 'Monthly Master', desc: '30-day streak',                streakReq: 30 },
]

const CATEGORY_BADGES: { id: string; emoji: string; name: string; desc: string; category: CategorySlug }[] = [
  { id: 'nutrition-master',     emoji: '🥗', name: 'Nutrition Master',      desc: 'Complete all Nutrition questions',           category: 'nutrition'   },
  { id: 'sleep-explorer',       emoji: '🌙', name: 'Sleep Explorer',        desc: 'Complete all Sleep questions',               category: 'sleep'       },
  { id: 'prevention-champion',  emoji: '🛡️', name: 'Prevention Champion',   desc: 'Complete all Preventive Medicine questions', category: 'preventive'  },
  { id: 'purpose-seeker',       emoji: '⭐', name: 'Purpose Seeker',        desc: 'Complete all Legacy & Purpose questions',    category: 'legacy'      },
  { id: 'biohacker',            emoji: '⚗️', name: 'Biohacker',             desc: 'Complete all Biohacking questions',          category: 'biohacking'  },
  { id: 'mind-master',          emoji: '🧠', name: 'Mind Master',           desc: 'Complete all Cognitive Health questions',    category: 'cognitive'   },
  { id: 'social-butterfly',     emoji: '🦋', name: 'Social Butterfly',      desc: 'Complete all Social Connections questions',  category: 'social'      },
  { id: 'fitness-fanatic',      emoji: '💪', name: 'Fitness Fanatic',        desc: 'Complete all Exercise questions',            category: 'exercise'    },
]

const ARCH_COLORS = ['#C4654A', '#546342', '#C49B6C', '#8B7355', '#A35C4A', '#7A8B66', '#9A958B']

export default function ProfilePage() {
  const router = useRouter()
  const [prof, setProf]     = useState<UserProfile | null>(null)
  const [scores, setScores] = useState<ProfileScores | null>(null)
  const [streak, setStreak] = useState<Streak | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [tab, setTab] = useState<'overview' | 'analytics' | 'badges'>('overview')
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const [choices, setChoices] = useState<UserChoice[]>([])

  useEffect(() => {
    Promise.all([profileApi.get(), profileApi.scores(), streaksApi.get(), choicesApi.list()])
      .then(([p, s, st, ch]) => { setProf(p); setScores(s); setStreak(st); setChoices(ch) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleUpgrade(plan: 'monthly' | 'annual') {
    setUpgrading(true)
    try {
      const { url } = await billingApi.checkout(plan)
      window.location.href = url
    } finally { setUpgrading(false) }
  }

  function handleLogout() { clearSession(); router.push('/login') }

  if (loading) return <div className="text-center py-20 text-text-muted font-serif italic">Loading…</div>
  if (!prof) return null

  const archetypeMeta = prof.archetype ? ARCHETYPE_META[prof.archetype as keyof typeof ARCHETYPE_META] : null
  const archetypeLabel = archetypeMeta?.label ?? prof.archetype ?? ''
  const archEntries = Object.entries(scores?.archetypeDistribution ?? {}).filter(([, v]) => v > 0)
  const totalArch = archEntries.reduce((a, [, v]) => a + v, 0) || 1
  const categoryProgress = scores?.categoryProgress ?? {}
  const totalAnswered = scores?.totalAnswered ?? 0
  const currentStreak = streak?.current_streak ?? 0
  const bestStreak = streak?.longest_streak ?? 0

  const earnedCountBadges = COUNT_BADGES.filter(b => {
    if (b.streakReq) return currentStreak >= b.streakReq
    return totalAnswered >= (b.req ?? 0)
  })
  const earnedCategoryBadges = CATEGORY_BADGES.filter(b => {
    const p = categoryProgress[b.category]
    return p && p.total > 0 && p.answered >= p.total
  })
  const allEarnedBadges = [...earnedCountBadges, ...earnedCategoryBadges]
  const nextCountBadge = COUNT_BADGES.find(b => {
    if (b.streakReq) return currentStreak < b.streakReq
    return totalAnswered < (b.req ?? 0)
  })

  const radarData = (Object.entries(CATEGORY_META) as [CategorySlug, { label: string }][]).map(([slug, { label }]) => {
    const p = categoryProgress[slug] ?? { answered: 0, total: 12 }
    return {
      subject: label.split(' ')[0],
      value: p.total > 0 ? Math.round((p.answered / p.total) * 100) : 0,
      fullMark: 100,
    }
  })

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisWeek = choices.filter(c => new Date(c.answered_at) >= weekAgo).length
  const thisMonth = choices.filter(c => new Date(c.answered_at) >= monthStart).length

  const trendData = (() => {
    const days: { date: string; count: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
      const count = choices.filter(c => c.answered_at?.slice(0, 10) === key).length
      days.push({ date: label, count })
    }
    return days
  })()
  const hasTrendData = trendData.some(d => d.count > 0)

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://thelongevitygame.com'
  const shareText = `I'm a "${archetypeLabel}" on The Longevity Game! I've made ${totalAnswered} longevity choices. What's your archetype? 🌿`

  function handleCopy() {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({ title: 'My Longevity Archetype', text: shareText, url: shareUrl }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif italic text-3xl text-primary">Profile</h1>
          <p className="text-text-secondary text-sm mt-1">Your longevity journey</p>
        </div>
        <div className="flex items-center gap-2">
          {prof.archetype && (
            <button onClick={() => setShowShare(true)}
              className="flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-secondary transition-colors border border-border rounded-pill px-3 py-1.5">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          )}
          <button onClick={handleLogout}
            className="text-xs font-semibold text-text-muted hover:text-primary transition-colors border border-border rounded-pill px-3 py-1.5">
            Sign out
          </button>
        </div>
      </div>

      {/* Hero card — always visible */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <Avatar name={prof.name} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-serif italic text-2xl text-primary truncate">{prof.name}</p>
            <p className="text-xs text-text-muted mt-0.5">{prof.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 py-3 border-y border-border mb-4">
          {[
            { val: totalAnswered, label: 'Choices' },
            { val: currentStreak, label: 'Day Streak' },
            { val: allEarnedBadges.length, label: 'Badges' },
          ].map(({ val, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <div className="w-px h-8 bg-border" />}
              <div className="text-center flex-1">
                <p className="font-serif italic text-2xl text-primary">{val}</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">{label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>

        {archetypeMeta ? (
          <div className="rounded-xl bg-secondary/8 border border-secondary/20 px-4 py-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${archetypeMeta.color}`}>
              <archetypeMeta.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Primary Archetype</p>
              <p className="font-serif italic text-lg text-primary leading-tight">{archetypeMeta.label}</p>
              <p className="text-xs text-text-secondary italic mt-0.5">{archetypeMeta.tagline}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-surface border border-border px-4 py-3 text-center">
            <p className="text-sm text-text-secondary">Answer more questions to reveal your archetype</p>
          </div>
        )}
      </Card>

      {/* Tab bar */}
      <div className="flex rounded-xl border border-border overflow-hidden">
        {(['overview', 'analytics', 'badges'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors ${
              tab === t ? 'bg-secondary text-white' : 'bg-surface text-text-secondary hover:bg-surface-elevated'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {tab === 'overview' && (
        <>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Streaks</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🔥', val: currentStreak, label: 'Current streak' },
                { emoji: '⭐', val: bestStreak, label: 'Best streak' },
              ].map(({ emoji, val, label }) => (
                <div key={label} className="rounded-xl bg-surface border border-border px-4 py-3 text-center">
                  <p className="text-3xl mb-1">{emoji}</p>
                  <p className="font-serif italic text-3xl text-primary">{val}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Activity</p>
            <div className="grid grid-cols-2 gap-3">
              {[{ emoji: '📅', val: thisWeek, label: 'This week' }, { emoji: '🗓️', val: thisMonth, label: 'This month' }].map(({ emoji, val, label }) => (
                <div key={label} className="rounded-xl bg-surface border border-border px-4 py-3 text-center">
                  <p className="text-3xl mb-1">{emoji}</p>
                  <p className="font-serif italic text-3xl text-primary">{val}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          {prof.subscription_status === 'free' && (
            <Card variant="featured">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Unlock Premium</p>
              <p className="font-serif italic text-xl text-primary mb-3">AI insights, couples mode & more</p>
              <div className="flex gap-2">
                <button onClick={() => handleUpgrade('monthly')} disabled={upgrading}
                  className="flex-1 rounded-pill bg-secondary py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                  $9.99/mo
                </button>
                <button onClick={() => handleUpgrade('annual')} disabled={upgrading}
                  className="flex-1 rounded-pill border-2 border-secondary py-2.5 text-sm font-semibold text-secondary hover:bg-secondary-light transition-colors disabled:opacity-50">
                  $79/yr — save 34%
                </button>
              </div>
            </Card>
          )}

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
        </>
      )}

      {/* ── Analytics tab ── */}
      {tab === 'analytics' && (
        <>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Activity Trend</p>
            <p className="font-serif italic text-lg text-primary mb-3">Questions answered — last 30 days</p>
            {!hasTrendData ? (
              <p className="text-sm text-text-muted text-center py-6">No activity yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={trendData} margin={{ top: 4, right: 4, bottom: 4, left: -28 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#887369' }} interval={6} />
                  <YAxis tick={{ fontSize: 9, fill: '#887369' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #DDE0D8', background: '#FDF9F2' }}
                    labelStyle={{ color: '#3C4A3E', fontWeight: 600 }}
                  />
                  <Bar dataKey="count" fill="#546342" radius={[3, 3, 0, 0]} name="Questions" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Dimension Radar</p>
            <p className="font-serif italic text-lg text-primary mb-2">Your exploration coverage</p>
            {totalAnswered === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">Answer questions to see your radar chart</p>
            ) : (
              <RadarChart data={radarData} />
            )}
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">15 Dimensions</p>
            <p className="font-serif italic text-lg text-primary mb-4">Your exploration progress</p>
            <div className="flex flex-col gap-4">
              {(Object.entries(CATEGORY_META) as [CategorySlug, { label: string; icon: React.ElementType; color: string }][]).map(([slug, { label, icon: Icon, color }]) => {
                const p = categoryProgress[slug] ?? { answered: 0, total: 0 }
                const pct = p.total ? p.answered / p.total : 0
                const done = p.total > 0 && p.answered >= p.total
                return (
                  <div key={slug}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-sm text-text-primary">
                        <span className={`inline-flex w-5 h-5 items-center justify-center rounded ${color}`}>
                          <Icon className="w-3 h-3" />
                        </span>
                        {label}
                      </span>
                      <span className="text-xs text-text-muted">{p.answered}/{p.total}{done ? ' ✓' : ''}</span>
                    </div>
                    <ProgressBar value={pct} color={done ? 'secondary' : 'terracotta'} />
                  </div>
                )
              })}
            </div>
          </Card>

          {archEntries.length > 0 && (
            <Card>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Archetype Distribution</p>
              <p className="font-serif italic text-lg text-primary mb-4">How your answers map across archetypes</p>
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
        </>
      )}

      {/* ── Badges tab ── */}
      {tab === 'badges' && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Badges</p>

          {nextCountBadge && (
            <div className="flex items-center gap-3 rounded-xl border-2 border-secondary/30 bg-secondary-light/40 px-4 py-3 mb-4">
              <span className="text-3xl opacity-40">{nextCountBadge.emoji}</span>
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary mb-0.5">Next badge</p>
                <p className="font-semibold text-sm text-primary">{nextCountBadge.name}</p>
                <p className="text-xs text-text-muted">{nextCountBadge.desc}</p>
              </div>
            </div>
          )}

          {allEarnedBadges.length > 0 ? (
            <>
              <p className="text-xs text-text-muted mb-2">{allEarnedBadges.length} earned</p>
              <div className="grid grid-cols-4 gap-2">
                {[...COUNT_BADGES, ...CATEGORY_BADGES].map(badge => {
                  const earned = allEarnedBadges.some(b => b.id === badge.id)
                  return (
                    <div key={badge.id} title={badge.desc}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-all ${earned ? 'border-secondary/30 bg-secondary-light/30' : 'border-border bg-surface opacity-30'}`}>
                      <span className="text-2xl">{badge.emoji}</span>
                      <span className="text-[10px] font-medium text-text-secondary leading-tight">{badge.name}</span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-text-muted text-center py-4">Answer your first question to earn a badge</p>
          )}
        </Card>
      )}

      {/* ── Share modal ── */}
      {showShare && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowShare(false)}>
          <div className="w-full max-w-sm bg-background rounded-2xl p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <h2 className="font-serif italic text-xl text-primary">Share Your Archetype</h2>
              <button onClick={() => setShowShare(false)} className="text-text-muted hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Archetype preview card */}
            {archetypeMeta && (
              <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-5 text-center flex flex-col items-center gap-2">
                <archetypeMeta.icon className={`w-10 h-10 ${archetypeMeta.color.split(' ')[0]}`} />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Longevity Archetype</p>
                <p className="font-serif italic text-xl text-primary">{archetypeMeta.label}</p>
                <p className="text-xs text-text-secondary">{archetypeMeta.tagline}</p>
                <p className="text-xs text-text-muted">{totalAnswered} choices made</p>
              </div>
            )}

            {/* Social share grid */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-primary hover:bg-black hover:text-white hover:border-black transition-all">
                𝕏 Twitter
              </button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank')}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-primary hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all">
                Facebook
              </button>
              <button onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`, '_blank')}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-primary hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all">
                LinkedIn
              </button>
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`, '_blank')}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-primary hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all">
                WhatsApp
              </button>
              <button onClick={() => {
                const ogUrl = `/api/og?archetype=${encodeURIComponent(prof?.archetype ?? '')}&name=${encodeURIComponent(prof?.name ?? '')}&answered=${totalAnswered}`
                const a = document.createElement('a')
                a.href = ogUrl; a.download = 'my-longevity-archetype.png'; a.click()
                setTimeout(() => window.open('https://www.tiktok.com/upload', '_blank'), 500)
              }}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-primary hover:bg-black hover:text-white hover:border-black transition-all col-span-2">
                🎵 TikTok — download card &amp; upload
              </button>
            </div>

            {'share' in navigator && (
              <button onClick={handleNativeShare}
                className="w-full rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-all">
                More options…
              </button>
            )}

            <button onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 rounded-pill bg-secondary py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Link2 className="w-4 h-4" /> Copy Link</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
