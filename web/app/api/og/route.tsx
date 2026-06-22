import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const ARCHETYPE_COLORS: Record<string, string> = {
  'healthspan-maximizer':       '#C4654A',
  'prevention-first-optimizer': '#546342',
  'natural-balance-seeker':     '#7A8B66',
  'tech-forward-biohacker':     '#3A5580',
  'purpose-driven-ageless':     '#C49B6C',
  'social-wellness-connector':  '#A35C4A',
  'longevity-realist':          '#8B7355',
}

const ARCHETYPE_EMOJI: Record<string, string> = {
  'healthspan-maximizer':       '⚡',
  'prevention-first-optimizer': '🛡️',
  'natural-balance-seeker':     '🌿',
  'tech-forward-biohacker':     '🔬',
  'purpose-driven-ageless':     '⭐',
  'social-wellness-connector':  '🤝',
  'longevity-realist':          '⚖️',
}

function toLabel(slug: string) {
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const archetype = searchParams.get('archetype') ?? 'longevity-realist'
  const name = searchParams.get('name') ?? 'Someone'
  const answered = searchParams.get('answered') ?? '0'

  const color = ARCHETYPE_COLORS[archetype] ?? '#546342'
  const emoji = ARCHETYPE_EMOJI[archetype] ?? '🌿'
  const label = toLabel(archetype)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#FDF9F2',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: color }} />

        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ fontSize: '28px', color: '#546342' }}>🌿</div>
          <div style={{ fontSize: '22px', color: '#3C4A3E', fontStyle: 'italic' }}>The Longevity Game</div>
        </div>

        {/* Archetype card */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px 64px',
            textAlign: 'center',
            boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
            border: `2px solid ${color}22`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            minWidth: '520px',
          }}
        >
          <div style={{ fontSize: '72px', lineHeight: 1 }}>{emoji}</div>
          <div style={{ fontSize: '14px', fontFamily: 'sans-serif', color: color, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
            Longevity Archetype
          </div>
          <div style={{ fontSize: '42px', fontStyle: 'italic', color: '#3C4A3E', lineHeight: 1.1 }}>
            {label}
          </div>
          <div style={{ fontSize: '18px', fontFamily: 'sans-serif', color: '#887369' }}>
            {name} · {answered} choices made
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ marginTop: '40px', fontSize: '16px', fontFamily: 'sans-serif', color: '#887369' }}>
          thelongevitygame.com · Discover your longevity philosophy
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
