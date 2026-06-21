import Link from 'next/link'
import Image from 'next/image'
import { Leaf } from 'lucide-react'

const METRICS = [
  { label: 'Nutrition',        value: '82%', trend: '+4%',  color: 'bg-emerald-400', icon: '🥗' },
  { label: 'Sleep Quality',    value: '91%', trend: '+7%',  color: 'bg-violet-400',  icon: '🌙' },
  { label: 'Mental Wellness',  value: '74%', trend: '+2%',  color: 'bg-blue-400',    icon: '🧠' },
  { label: 'Movement',         value: '68%', trend: '+9%',  color: 'bg-orange-400',  icon: '💪' },
  { label: 'Stress & Rest',    value: '79%', trend: '+1%',  color: 'bg-rose-400',    icon: '🫁' },
  { label: 'Longevity Score',  value: '86%', trend: '+5%',  color: 'bg-teal-400',    icon: '⚡' },
]

const STATS = [
  { num: '180', label: 'Dilemmas' },
  { num: '7',   label: 'Archetypes' },
  { num: '15',  label: 'Dimensions' },
  { num: '4k+', label: 'Members' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">

      {/* ══════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] flex-col bg-primary relative overflow-hidden select-none">

        {/* Background hero image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85"
            alt="Forest — longevity backdrop"
            fill
            sizes="52vw"
            className="object-cover object-center"
            priority
          />
          {/* Layered gradient: bottom-heavy so text always reads */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/75 to-primary/95" />
          {/* Vignette edges */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />
        </div>

        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col h-full px-10 py-10 justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
              <Leaf className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-serif italic text-white/95 text-[17px] tracking-wide">The Longevity Game</span>
          </Link>

          {/* Centre block */}
          <div className="flex flex-col gap-8">

            {/* Quote */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="block w-5 h-[2px] rounded-full bg-terracotta" />
                <span className="text-terracotta text-[10px] font-semibold uppercase tracking-[0.18em]">Your longevity practice</span>
              </div>
              <h2 className="font-serif italic text-white/95 text-[1.7rem] leading-[1.35] mb-2">
                "The choices you make today<br/>shape the life you live tomorrow."
              </h2>
              <p className="text-white/35 text-[11px] tracking-wide">— Valentina Teekapa</p>
            </div>

            {/* ── Dashboard preview card ── */}
            <div className="bg-white/[0.09] border border-white/[0.13] rounded-2xl p-5 backdrop-blur-md">
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Archetype</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌿</span>
                    <span className="text-white text-sm font-semibold">Healthspan Maximiser</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Overall</p>
                  <p className="text-white font-bold text-lg leading-none">86<span className="text-white/40 text-xs font-normal">%</span></p>
                </div>
              </div>

              {/* Metric grid — 2 columns */}
              <div className="grid grid-cols-2 gap-2">
                {METRICS.map(({ label, value, trend, color, icon }) => (
                  <div
                    key={label}
                    className="bg-white/[0.07] border border-white/[0.08] rounded-xl px-3 py-2.5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px]">{icon}</span>
                      <span className="text-[10px] text-emerald-400 font-medium">{trend}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: value }} />
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-white/55 text-[10px] leading-tight">{label}</span>
                      <span className="text-white text-xs font-bold">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <p className="mt-3 text-center text-white/25 text-[10px]">
                Unlock your full dashboard after signup
              </p>
            </div>
          </div>

          {/* Bottom stats row */}
          <div className="flex items-end justify-between">
            <div className="flex gap-8">
              {STATS.map(({ num, label }) => (
                <div key={label}>
                  <p className="font-serif italic text-white text-xl font-bold leading-none">{num}</p>
                  <p className="text-white/35 text-[11px] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT PANEL
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-[#FAFAF7]">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif italic text-primary text-lg">The Longevity Game</span>
        </Link>

        <div className="w-full max-w-[360px]">
          {children}
        </div>
      </div>
    </div>
  )
}
