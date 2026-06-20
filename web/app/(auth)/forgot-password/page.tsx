'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { auth } from '@/lib/api'

const inputCls = 'w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#DDE0D8] bg-white text-[#1C1C18] text-[14px] placeholder:text-[#A8ADA4] focus:outline-none focus:border-[#546342] focus:ring-3 focus:ring-[#546342]/12 transition-all duration-150'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await auth.forgotPassword(email)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  if (sent) return (
    <div className="animate-fade-slide-up text-center py-4">
      {/* Success icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8A9A6B] mb-2">Email sent</p>
      <h1 className="font-serif italic text-[2rem] text-[#3C4A3E] leading-tight mb-3">Check your inbox</h1>
      <p className="text-[#6B7069] text-[13px] leading-relaxed mb-1">
        A reset link is on its way to
      </p>
      <p className="text-[#3C4A3E] text-[13px] font-semibold mb-8">{email}</p>

      <div className="bg-[#F5F7F2] border border-[#DDE0D8] rounded-xl px-4 py-3.5 text-left mb-8">
        <p className="text-[12px] text-[#6B7069] leading-relaxed">
          💡 Check your spam folder if it doesn&apos;t arrive within 2 minutes. The link expires after 1 hour.
        </p>
      </div>

      <button
        onClick={() => { setSent(false); setEmail('') }}
        className="text-[13px] text-[#546342] font-semibold hover:underline"
      >
        Try a different email
      </button>

      <p className="mt-6 text-[12px] text-[#A8ADA4]">
        Remembered it?{' '}
        <Link href="/login" className="text-[#546342] font-semibold hover:underline">Back to sign in</Link>
      </p>
    </div>
  )

  return (
    <div className="animate-fade-slide-up">
      <Link href="/login"
        className="inline-flex items-center gap-1.5 text-[12px] text-[#A8ADA4] hover:text-[#3C4A3E] mb-8 transition-colors group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to sign in
      </Link>

      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8A9A6B] mb-2">Account recovery</p>
        <h1 className="font-serif italic text-[2rem] text-[#3C4A3E] leading-tight mb-1">Reset your password</h1>
        <p className="text-[#6B7069] text-[13px]">
          Enter the email you signed up with and we&apos;ll send a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7069]">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8ADA4] pointer-events-none" />
            <input
              type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>
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
            ? <><Spinner />Sending…</>
            : <><span>Send Reset Link</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="mt-7 text-center text-[12px] text-[#A8ADA4]">
        Know your password?{' '}
        <Link href="/login" className="text-[#546342] font-semibold hover:underline">Sign in instead</Link>
      </p>
    </div>
  )
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
}
