'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, ChevronRight, Check } from 'lucide-react'
import { profile as profileApi } from '@/lib/api'
import { cn } from '@/lib/utils'

/* ─── Onboarding assessment questions ─── */
const ASSESSMENT_QUESTIONS = [
  {
    id: 'q1', question: 'Would you rather live to 100 with limited mobility, or live to 80 in peak physical health?',
    optionA: { text: 'Live to 100 with limited mobility', archetype: 'longevity-realist' },
    optionB: { text: 'Live to 80 in peak physical health', archetype: 'healthspan-maximizer' },
  },
  {
    id: 'q2', question: 'Would you rather rely on cutting-edge medical technology, or trust natural remedies and lifestyle changes?',
    optionA: { text: 'Cutting-edge medical technology', archetype: 'tech-forward-biohacker' },
    optionB: { text: 'Natural remedies and lifestyle', archetype: 'natural-balance-seeker' },
  },
  {
    id: 'q3', question: 'Would you rather spend your later years pursuing a meaningful purpose, or enjoying complete freedom and relaxation?',
    optionA: { text: 'Pursue a meaningful purpose', archetype: 'purpose-driven-ageless' },
    optionB: { text: 'Complete freedom and relaxation', archetype: 'longevity-realist' },
  },
  {
    id: 'q4', question: 'Would you rather follow a strict preventive health regimen, or live spontaneously and deal with health issues as they arise?',
    optionA: { text: 'Strict preventive health regimen', archetype: 'prevention-first-optimizer' },
    optionB: { text: 'Live spontaneously and adapt', archetype: 'longevity-realist' },
  },
  {
    id: 'q5', question: 'Would you rather prioritise deep social connections, or focus on personal optimisation and self-improvement?',
    optionA: { text: 'Deep social connections', archetype: 'social-wellness-connector' },
    optionB: { text: 'Personal optimisation', archetype: 'prevention-first-optimizer' },
  },
  {
    id: 'q6', question: 'Would you rather track every biomarker to optimise your health, or trust your body\'s natural signals?',
    optionA: { text: 'Track every biomarker', archetype: 'tech-forward-biohacker' },
    optionB: { text: 'Trust natural body signals', archetype: 'natural-balance-seeker' },
  },
  {
    id: 'q7', question: 'Would you rather invest heavily in your health now (time, money, discipline), or balance health with other life pleasures?',
    optionA: { text: 'Invest heavily in health now', archetype: 'prevention-first-optimizer' },
    optionB: { text: 'Balance health with life pleasures', archetype: 'healthspan-maximizer' },
  },
  {
    id: 'q8', question: 'Would you rather age in a vibrant community surrounded by people, or in peaceful solitude close to nature?',
    optionA: { text: 'Vibrant community', archetype: 'social-wellness-connector' },
    optionB: { text: 'Peaceful solitude in nature', archetype: 'natural-balance-seeker' },
  },
  {
    id: 'q9', question: 'Would you rather leave behind a lasting legacy, or live fully in the present without concern for legacy?',
    optionA: { text: 'Leave a lasting legacy', archetype: 'purpose-driven-ageless' },
    optionB: { text: 'Live fully in the present', archetype: 'longevity-realist' },
  },
  {
    id: 'q10', question: 'Would you rather accept the natural aging process gracefully, or actively resist aging through every available means?',
    optionA: { text: 'Accept aging gracefully', archetype: 'natural-balance-seeker' },
    optionB: { text: 'Actively resist aging', archetype: 'tech-forward-biohacker' },
  },
]

/* ─── Options ─── */
const AGE_RANGES = ['Under 25', '25–34', '35–44', '45–54', '55–64', '65+']
const GENDERS    = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const COUNTRIES  = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Sweden', 'Singapore', 'India', 'Other',
]
const INTERESTS  = [
  'Healthy aging', 'Biohacking', 'Cognitive health', 'Relationships',
  'Fitness', 'Disease prevention', 'Mental wellness', 'Retirement wellness',
  'Stress reduction', 'Purpose & legacy', 'Nutrition', 'Sleep optimization',
]
const GOALS = [
  { value: 'live-longer',      label: 'Live a longer life',            emoji: '🕰️' },
  { value: 'live-better',      label: 'Improve quality of life',       emoji: '✨' },
  { value: 'prevent-disease',  label: 'Prevent chronic disease',       emoji: '🛡️' },
  { value: 'mental-clarity',   label: 'Sharpen mental clarity',        emoji: '🧠' },
  { value: 'energy',           label: 'Boost daily energy',            emoji: '⚡' },
  { value: 'relationships',    label: 'Strengthen relationships',       emoji: '❤️' },
  { value: 'purpose',          label: 'Discover purpose & meaning',    emoji: '🌟' },
  { value: 'fitness',          label: 'Reach peak physical fitness',   emoji: '💪' },
]

const TOTAL_STEPS = 6

function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className={cn('h-1.5 rounded-full transition-all duration-300',
          i < current ? 'bg-secondary w-6' : i === current ? 'bg-secondary w-8' : 'bg-border w-4')} />
      ))}
    </div>
  )
}

function ChipGrid<T extends string>({ options, selected, onToggle, multi = true }: {
  options: T[]; selected: T | T[]; onToggle: (v: T) => void; multi?: boolean
}) {
  const isSelected = (v: T) => Array.isArray(selected) ? selected.includes(v) : selected === v
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onToggle(opt)}
          className={cn('px-4 py-2 rounded-chip text-sm font-medium transition-all border',
            isSelected(opt) ? 'bg-secondary text-white border-secondary' : 'bg-white text-text-primary border-border hover:border-secondary hover:text-secondary')}>
          {isSelected(opt) && !multi && <Check className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />}
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const [name, setName]         = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [gender, setGender]     = useState('')
  const [country, setCountry]   = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [goals, setGoals]         = useState<string[]>([])
  const [saving, setSaving]       = useState(false)

  // Assessment step state
  const [assessmentIdx, setAssessmentIdx]       = useState(0)
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, 'A' | 'B'>>({})

  function toggleArr<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
  }

  function calcArchetype(answers: Record<string, 'A' | 'B'>): string {
    const counts: Record<string, number> = {}
    ASSESSMENT_QUESTIONS.forEach(q => {
      const ans = answers[q.id]
      if (!ans) return
      const archetype = ans === 'A' ? q.optionA.archetype : q.optionB.archetype
      counts[archetype] = (counts[archetype] ?? 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'longevity-realist'
  }

  function handleAssessmentAnswer(choice: 'A' | 'B') {
    const q = ASSESSMENT_QUESTIONS[assessmentIdx]
    const updated = { ...assessmentAnswers, [q.id]: choice }
    setAssessmentAnswers(updated)
    if (assessmentIdx + 1 < ASSESSMENT_QUESTIONS.length) {
      setAssessmentIdx(i => i + 1)
    } else {
      // Done — move to finish
      finishWithArchetype(updated)
    }
  }

  async function finishWithArchetype(answers: Record<string, 'A' | 'B'>) {
    setSaving(true)
    const archetype = calcArchetype(answers)
    try {
      await profileApi.update({ name, age_range: ageRange, gender, country, interests, goals, onboarding_completed: true, archetype } as never)
    } catch { /* best-effort */ }
    router.push('/today')
  }

  async function finish() {
    setSaving(true)
    try {
      await profileApi.update({ name, age_range: ageRange, gender, country, interests, goals, onboarding_completed: true } as never)
    } catch { /* best-effort */ }
    router.push('/today')
  }

  /* ── Step 0: Welcome ── */
  if (step === 0) return (
    <Screen>
      <div className="flex flex-col items-center text-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <Leaf className="w-8 h-8 text-secondary" />
        </div>
        <div>
          <h1 className="font-serif italic text-4xl text-primary mb-3 leading-tight">Discover your longevity philosophy.</h1>
          <p className="text-text-secondary leading-relaxed max-w-xs mx-auto">
            A short setup personalises your experience and reveals your Longevity Archetype. Takes 3 minutes.
          </p>
        </div>
        <button onClick={() => setStep(1)}
          className="mt-2 w-full max-w-xs rounded-pill bg-secondary py-3.5 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          Begin the practice <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </Screen>
  )

  /* ── Step 1: Name ── */
  if (step === 1) return (
    <Screen>
      <ProgressDots current={0} />
      <h2 className="font-serif italic text-3xl text-primary mb-2">What may I call you?</h2>
      <p className="text-text-secondary text-sm mb-8">Your first name is enough.</p>
      <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane"
        className="w-full border-b-2 border-border bg-transparent text-2xl text-center text-primary py-2 mb-10 focus:outline-none focus:border-secondary transition-colors placeholder:text-text-muted" />
      <NavRow onBack={() => setStep(0)} onNext={() => setStep(2)} disableNext={!name.trim()} />
    </Screen>
  )

  /* ── Step 2: Age & Gender ── */
  if (step === 2) return (
    <Screen>
      <ProgressDots current={1} />
      <h2 className="font-serif italic text-3xl text-primary mb-2">A little about you</h2>
      <p className="text-text-secondary text-sm mb-8">This helps personalise your longevity insights.</p>
      <div className="flex flex-col gap-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">Age range</p>
          <ChipGrid options={AGE_RANGES as unknown as string[]} selected={ageRange} onToggle={v => setAgeRange(v)} multi={false} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">Gender <span className="normal-case font-normal text-text-muted">(optional)</span></p>
          <ChipGrid options={GENDERS as unknown as string[]} selected={gender} onToggle={v => setGender(v)} multi={false} />
        </div>
      </div>
      <div className="mt-10"><NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} disableNext={!ageRange} /></div>
    </Screen>
  )

  /* ── Step 3: Country ── */
  if (step === 3) return (
    <Screen>
      <ProgressDots current={2} />
      <h2 className="font-serif italic text-3xl text-primary mb-2">Where are you based?</h2>
      <p className="text-text-secondary text-sm mb-8">Helps surface region-specific health context.</p>
      <div className="grid grid-cols-2 gap-2">
        {COUNTRIES.map(c => (
          <button key={c} type="button" onClick={() => setCountry(c)}
            className={cn('py-3 px-4 rounded-card text-sm font-medium border text-left transition-all',
              country === c ? 'bg-secondary text-white border-secondary' : 'bg-white text-text-primary border-border hover:border-secondary')}>
            {country === c && <Check className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />}{c}
          </button>
        ))}
      </div>
      <div className="mt-8"><NavRow onBack={() => setStep(2)} onNext={() => setStep(4)} disableNext={!country} /></div>
    </Screen>
  )

  /* ── Step 4: Interests ── */
  if (step === 4) return (
    <Screen>
      <ProgressDots current={3} />
      <h2 className="font-serif italic text-3xl text-primary mb-2">What draws you here?</h2>
      <p className="text-text-secondary text-sm mb-8">Select all that resonate with you.</p>
      <ChipGrid options={INTERESTS} selected={interests} onToggle={v => setInterests(prev => toggleArr(prev, v))} />
      <div className="mt-10"><NavRow onBack={() => setStep(3)} onNext={() => setStep(5)} disableNext={interests.length === 0} /></div>
    </Screen>
  )

  /* ── Step 5: Goals ── */
  if (step === 5) return (
    <Screen>
      <ProgressDots current={4} />
      <h2 className="font-serif italic text-3xl text-primary mb-2">What&apos;s your primary goal?</h2>
      <p className="text-text-secondary text-sm mb-8">Pick up to 3 that matter most right now.</p>
      <div className="grid grid-cols-1 gap-2.5">
        {GOALS.map(({ value, label, emoji }) => {
          const selected = goals.includes(value)
          return (
            <button key={value} type="button"
              onClick={() => { if (selected) setGoals(prev => prev.filter(g => g !== value)); else if (goals.length < 3) setGoals(prev => [...prev, value]) }}
              className={cn('flex items-center gap-3 px-4 py-3.5 rounded-card border text-sm font-medium text-left transition-all',
                selected ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-white border-border text-text-primary hover:border-secondary')}>
              <span className="text-lg w-7 text-center">{emoji}</span>
              <span className="flex-1">{label}</span>
              {selected && <Check className="w-4 h-4 text-secondary shrink-0" />}
            </button>
          )
        })}
      </div>
      <div className="mt-8">
        <NavRow onBack={() => setStep(4)} onNext={() => setStep(6)} disableNext={goals.length === 0} />
      </div>
    </Screen>
  )

  /* ── Step 6: Longevity Assessment ── */
  const currentQ = ASSESSMENT_QUESTIONS[assessmentIdx]
  return (
    <Screen>
      <ProgressDots current={5} />
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-serif italic text-2xl text-primary">Longevity Assessment</h2>
        <span className="text-xs text-text-muted font-semibold">{assessmentIdx + 1}/{ASSESSMENT_QUESTIONS.length}</span>
      </div>
      <p className="text-text-secondary text-sm mb-6">10 quick dilemmas to reveal your archetype. Choose instinctively.</p>

      {/* Mini progress */}
      <div className="h-1.5 rounded-full bg-border mb-8 overflow-hidden">
        <div className="h-full bg-secondary rounded-full transition-all duration-500"
          style={{ width: `${(assessmentIdx / ASSESSMENT_QUESTIONS.length) * 100}%` }} />
      </div>

      <p className="font-serif text-xl text-primary leading-snug mb-6">{currentQ.question}</p>

      <div className="flex flex-col gap-3">
        {(['A', 'B'] as const).map(key => {
          const opt = key === 'A' ? currentQ.optionA : currentQ.optionB
          return (
            <button key={key} type="button" onClick={() => handleAssessmentAnswer(key)}
              disabled={saving}
              className="flex items-start gap-4 rounded-card-lg border-2 border-outline-variant bg-surface p-5 text-left hover:border-secondary hover:bg-secondary-light/30 transition-all duration-200 disabled:opacity-50">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-2 border-outline-variant bg-surface-elevated text-text-muted">
                <span className="font-serif text-sm font-bold">{key}</span>
              </div>
              <span className="font-sans text-base leading-relaxed pt-0.5 text-text-secondary">{opt.text}</span>
            </button>
          )
        })}
      </div>

      {saving && (
        <p className="text-center text-sm text-text-muted mt-6 font-serif italic">Calculating your archetype…</p>
      )}

      <button onClick={() => { if (assessmentIdx > 0) setAssessmentIdx(i => i - 1); else setStep(5) }}
        className="mt-6 text-xs text-text-muted hover:text-primary transition-colors">
        ← Back
      </button>

      <button onClick={finish} disabled={saving}
        className="mt-3 w-full text-center text-xs text-text-muted hover:text-secondary transition-colors">
        Skip assessment and start exploring →
      </button>
    </Screen>
  )
}

/* ─── Shared layout wrappers ─── */
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 pt-16 pb-10">
      <div className="w-full max-w-md animate-fade-slide-up">
        <div className="flex items-center gap-2 mb-12">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/10">
            <Leaf className="w-4 h-4 text-secondary" />
          </div>
          <span className="font-serif italic text-primary text-sm">The Longevity Game</span>
        </div>
        {children}
      </div>
    </div>
  )
}

function NavRow({ onBack, onNext, disableNext = false, nextLabel = 'Continue' }: {
  onBack: () => void; onNext: () => void; disableNext?: boolean; nextLabel?: string
}) {
  return (
    <div className="flex gap-3">
      <button type="button" onClick={onBack}
        className="px-5 py-3 rounded-pill border border-border text-sm font-medium text-text-secondary hover:text-primary hover:border-primary transition-colors">
        Back
      </button>
      <button type="button" onClick={onNext} disabled={disableNext}
        className="flex-1 flex items-center justify-center gap-2 rounded-pill bg-secondary py-3 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity disabled:opacity-40">
        {nextLabel} {nextLabel === 'Continue' && <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  )
}
