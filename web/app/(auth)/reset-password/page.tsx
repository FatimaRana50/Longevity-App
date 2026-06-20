'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
const inputCls = 'w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#DDE0D8] bg-white text-[#1C1C18] text-[14px] placeholder:text-[#A8ADA4] focus:outline-none focus:border-[#546342] focus:ring-3 focus:ring-[#546342]/12 transition-all duration-150'

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''

  const [password, setPassword]     = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [done, setDone]             = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message ?? 'Reset failed')
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div className="animate-fade-slide-up text-center py-4">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-100">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h1 className="font-serif italic text-[2rem] text-[#3C4A3E] leading-tight mb-3">Invalid reset link</h1>
      <p className="text-[#6B7069] text-[13px] mb-8">This link is missing a token. Please request a new one.</p>
      <Link href="/forgot-password" className="text-[13px] text-[#546342] font-semibold hover:underline">
        Request new link
      </Link>
    </div>
  )

  if (done) return (
    <div className="animate-fade-slide-up text-center py-4">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8A9A6B] mb-2">All done</p>
      <h1 className="font-serif italic text-[2rem] text-[#3C4A3E] leading-tight mb-3">Password updated</h1>
      <p className="text-[#6B7069] text-[13px] mb-8">You can now sign in with your new password.</p>
      <button
        onClick={() => router.push('/login')}
        className="inline-flex items-center gap-2 rounded-xl bg-[#3C4A3E] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#2e3930] transition-colors"
      >
        Go to sign in <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <div className="animate-fade-slide-up">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8A9A6B] mb-2">New password</p>
        <h1 className="font-serif italic text-[2rem] text-[#3C4A3E] leading-tight mb-1">Set a new password</h1>
        <p className="text-[#6B7069] text-[13px]">Choose something strong and memorable.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7069]">New password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8ADA4] pointer-events-none" />
            <input
              type={showPw ? 'text' : 'password'} required minLength={8}
              autoComplete="new-password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" className={`${inputCls} pr-11`}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8ADA4] hover:text-[#3C4A3E] transition-colors p-0.5"
              aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-[#A8ADA4]">Minimum 8 characters</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3 text-[13px] text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#3C4A3E] hover:bg-[#2e3930] py-3.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 disabled:opacity-50">
          {loading
            ? <><Spinner />Updating…</>
            : <><span>Set New Password</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="mt-7 text-center text-[12px] text-[#A8ADA4]">
        Remember it?{' '}
        <Link href="/login" className="text-[#546342] font-semibold hover:underline">Back to sign in</Link>
      </p>
    </div>
  )
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
}
