'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { auth } from '@/lib/api'

const PW_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One letter',            test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: 'One number',            test: (p: string) => /\d/.test(p) },
]

const inputCls = 'w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#DDE0D8] bg-white text-[#1C1C18] text-[14px] placeholder:text-[#A8ADA4] focus:outline-none focus:border-[#546342] focus:ring-3 focus:ring-[#546342]/12 transition-all duration-150'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7069]">{label}</label>
      {children}
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [pwFocus, setPwFocus]   = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [social, setSocial]     = useState<'google' | 'apple' | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await auth.signup(email, password, name)
      router.push('/onboarding')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed')
      setLoading(false)
    }
  }

  async function handleSocial(provider: 'google' | 'apple') {
    setSocial(provider); setError('')
    setError(`${provider} sign-in coming soon`)
    setSocial(null)
  }

  const pwStrength = PW_RULES.filter(r => r.test(password)).length
  const strengthLabel = pwStrength === 0 ? '' : pwStrength === 1 ? 'Weak' : pwStrength === 2 ? 'Fair' : 'Strong'
  const strengthColor = pwStrength === 1 ? 'bg-red-400' : pwStrength === 2 ? 'bg-amber-400' : 'bg-emerald-500'

  return (
    <div className="animate-fade-slide-up">
      {/* Heading */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8A9A6B] mb-2">Get started free</p>
        <h1 className="font-serif italic text-[2rem] text-[#3C4A3E] leading-tight mb-1">Begin your practice</h1>
        <p className="text-[#6B7069] text-[13px]">Discover your personal longevity archetype.</p>
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        <SocialBtn provider="google" loading={social === 'google'} onClick={() => handleSocial('google')} disabled={!!social} />
        <SocialBtn provider="apple"  loading={social === 'apple'}  onClick={() => handleSocial('apple')}  disabled={!!social} />
      </div>

      <Divider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
        <Field label="Full name">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8ADA4] pointer-events-none" />
            <input type="text" required autoComplete="name" value={name} onChange={e => setName(e.target.value)}
              placeholder="Jane Smith" className={inputCls} />
          </div>
        </Field>

        <Field label="Email address">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8ADA4] pointer-events-none" />
            <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className={inputCls} />
          </div>
        </Field>

        <Field label="Password">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8ADA4] pointer-events-none" />
            <input
              type={showPw ? 'text' : 'password'} required minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPwFocus(true)}
              onBlur={() => setPwFocus(false)}
              placeholder="••••••••"
              className={`${inputCls} pr-11`}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8ADA4] hover:text-[#3C4A3E] transition-colors p-0.5"
              aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength meter */}
          {(pwFocus || password) && (
            <div className="mt-1">
              <div className="flex gap-1 mb-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < pwStrength ? strengthColor : 'bg-[#E8EAE4]'}`} />
                ))}
                {strengthLabel && (
                  <span className={`text-[10px] font-semibold ml-1 ${
                    pwStrength === 1 ? 'text-red-500' : pwStrength === 2 ? 'text-amber-500' : 'text-emerald-600'
                  }`}>{strengthLabel}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {PW_RULES.map(({ label, test }) => {
                  const ok = test(password)
                  return (
                    <div key={label} className="flex items-center gap-1.5">
                      <CheckCircle2 className={`w-3 h-3 shrink-0 transition-colors ${ok ? 'text-emerald-500' : 'text-[#C8CCC4]'}`} />
                      <span className={`text-[11px] transition-colors ${ok ? 'text-emerald-700' : 'text-[#A8ADA4]'}`}>{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Field>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        <button type="submit" disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#3C4A3E] hover:bg-[#2e3930] py-3.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading
            ? <><Spinner />Creating account…</>
            : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
        </button>

        <p className="text-center text-[11px] text-[#A8ADA4]">
          By signing up you agree to our{' '}
          <a href="#" className="underline text-[#6B7069] hover:text-[#3C4A3E]">Terms</a>{' '}and{' '}
          <a href="#" className="underline text-[#6B7069] hover:text-[#3C4A3E]">Privacy Policy</a>.
        </p>
      </form>

      <p className="mt-6 text-center text-[12px] text-[#A8ADA4]">
        Already a member?{' '}
        <Link href="/login" className="text-[#546342] font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

function SocialBtn({ provider, loading, onClick, disabled }: {
  provider: 'google' | 'apple'; loading: boolean; onClick: () => void; disabled: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled} type="button"
      className="flex items-center justify-center gap-2.5 w-full border border-[#DDE0D8] rounded-xl py-3 text-[13px] font-medium text-[#1C1C18] bg-white hover:bg-[#F5F5F0] transition-all duration-150 disabled:opacity-50">
      {loading ? <Spinner /> : provider === 'google' ? <GoogleIcon /> : <AppleIcon />}
      {provider === 'google' ? 'Google' : 'Apple'}
    </button>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[#E8EAE4]" />
      <span className="text-[11px] text-[#A8ADA4] font-medium">or continue with email</span>
      <div className="flex-1 h-px bg-[#E8EAE4]" />
    </div>
  )
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3 text-[13px] text-red-700">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
      <span>{children}</span>
    </div>
  )
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.39.07 2.33.74 3.18.78 1.22-.24 2.39-.93 3.68-.84 1.57.12 2.75.72 3.52 1.9-3.22 1.94-2.45 5.9.6 7.04-.57 1.5-1.32 2.98-3 4zm-3.22-17.6c.06 2.29-2.05 4.22-4.23 4.02-.31-2.16 1.93-4.27 4.23-4.02z"/>
    </svg>
  )
}
