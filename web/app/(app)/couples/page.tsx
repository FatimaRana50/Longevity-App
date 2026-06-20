'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function CouplesPage() {
  const [inviteValue, setInviteValue] = useState('')

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">💑 Couples Mode</h1>
        <p className="text-text-secondary text-sm mt-1">Compare your longevity philosophies</p>
      </div>

      <Card>
        <p className="text-text-secondary text-sm leading-relaxed">
          Invite your partner to compare answers, discover shared values, and explore your longevity compatibility together.
        </p>
      </Card>

      <Card>
        <Input
          label="Partner's Email or Invite Code"
          placeholder="partner@email.com or ABC12345"
          value={inviteValue}
          onChange={e => setInviteValue(e.target.value)}
        />
        <Button fullWidth className="mt-4 rounded-card" disabled={!inviteValue.trim()}>
          Send Invitation 💌
        </Button>
        <p className="text-xs text-text-muted mt-3 text-center">
          Ask your partner to share their invite code from their Profile page.
        </p>
      </Card>

      <Card variant="featured">
        <Badge variant="active" className="mb-3">Premium Feature</Badge>
        <h3 className="font-serif italic text-xl text-primary mb-3">✨ What you&apos;ll unlock</h3>
        <ul className="text-sm text-text-secondary space-y-2">
          <li>💯 Wellness compatibility score</li>
          <li>💬 Personalized discussion prompts</li>
          <li>📊 Side-by-side answer comparison</li>
          <li>🌱 Growth areas to explore together</li>
        </ul>
      </Card>
    </div>
  )
}
