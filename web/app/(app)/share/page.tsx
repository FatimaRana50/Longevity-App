'use client'
import { useEffect, useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { profile as profileApi, type UserProfile, type ProfileScores } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ARCHETYPE_META } from '@/lib/types'

export default function SharePage() {
  const [prof, setProf] = useState<UserProfile | null>(null)
  const [scores, setScores] = useState<ProfileScores | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([profileApi.get(), profileApi.scores()])
      .then(([p, s]) => { setProf(p); setScores(s) })
      .catch(() => {})
  }, [])

  const meta = prof?.archetype ? ARCHETYPE_META[prof.archetype as keyof typeof ARCHETYPE_META] : null

  function handleCopy() {
    navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!prof?.archetype) {
    return (
      <div className="flex flex-col gap-6 max-w-sm mx-auto">
        <h1 className="font-serif italic text-3xl text-primary">Share Your Results</h1>
        <Card className="text-center py-12">
          <p className="text-5xl mb-4">🌿</p>
          <h2 className="font-serif italic text-xl text-primary mb-2">Complete questions to unlock sharing</h2>
          <p className="text-text-secondary text-sm">Answer more questions to discover your archetype.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto">
      <h1 className="font-serif italic text-3xl text-primary">Share Your Results</h1>

      <Card variant="featured" className="text-center py-8">
        <p className="text-6xl mb-4">{meta?.emoji}</p>
        <h2 className="font-serif italic text-2xl text-primary mb-2">{meta?.label}</h2>
        <p className="text-text-secondary text-sm mb-4">{meta?.tagline}</p>
        <p className="text-secondary text-sm font-semibold mb-4">{scores?.totalAnswered ?? 0} Choices Made</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">The Longevity Game</p>
      </Card>

      <Button onClick={handleCopy} fullWidth className="rounded-card">
        {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Link2 className="w-4 h-4" /> Copy Share Link</>}
      </Button>

      <Card>
        <h3 className="font-semibold text-text-primary mb-3">Why Share?</h3>
        <ul className="text-sm text-text-secondary space-y-2">
          <li>• Spark conversations about healthy aging</li>
          <li>• Find others with your longevity philosophy</li>
          <li>• Inspire friends to discover their archetype</li>
        </ul>
      </Card>
    </div>
  )
}
