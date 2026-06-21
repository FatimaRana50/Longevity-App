'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, Sparkles, Users, BookOpen, Brain,
  CheckCircle2, Zap, Heart, Shield, MessageCircle, Leaf,
} from 'lucide-react'
import { FaInstagram, FaXTwitter, FaYoutube, FaTiktok } from 'react-icons/fa6'
import { LandingNav } from '@/components/LandingNav'
import { Card } from '@/components/ui/Card'
import { AnimateIn, StaggerContainer, StaggerItem } from '@/components/ui/AnimateIn'
import { CATEGORY_META, ARCHETYPE_META } from '@/lib/types'

const STATS = [
  { icon: Users,    value: '10,000+', label: 'Explorers' },
  { icon: BookOpen, value: '180',     label: 'Dilemmas' },
  { icon: Brain,    value: '7',       label: 'Archetypes' },
  { icon: Sparkles, value: '15',      label: 'Dimensions' },
]

const HOW_IT_WORKS = [
  {
    step: '01', icon: MessageCircle,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconBg: 'bg-emerald-100',
    title: 'Answer dilemmas',
    desc: 'Each day you get 3 thought-provoking "Would You Rather" choices about health, aging, and purpose.',
  },
  {
    step: '02', icon: Brain,
    color: 'bg-violet-50 text-violet-700 border-violet-200', iconBg: 'bg-violet-100',
    title: 'Discover your archetype',
    desc: 'Your answers are scored across 10 longevity dimensions to reveal your unique philosophy.',
  },
  {
    step: '03', icon: Heart,
    color: 'bg-rose-50 text-rose-700 border-rose-200', iconBg: 'bg-rose-100',
    title: 'Grow & connect',
    desc: 'Track your evolution over time, share insights, and compare values with partners and friends.',
  },
]

const FEATURES = [
  { icon: Zap,          color: 'text-amber-500',  bg: 'bg-amber-50',   title: 'Daily Quest',        desc: '3 fresh questions every day to keep the practice alive.' },
  { icon: Brain,        color: 'text-violet-500', bg: 'bg-violet-50',  title: 'Personality Engine', desc: 'Calculates your archetype across 10 dimensions in real time.' },
  { icon: Shield,       color: 'text-blue-500',   bg: 'bg-blue-50',    title: 'Private Journal',    desc: 'Capture reflections on every answer — searchable, exportable.' },
  { icon: Heart,        color: 'text-rose-500',   bg: 'bg-rose-50',    title: 'Couples Mode',       desc: 'Compare your longevity values side-by-side with a partner.' },
  { icon: Sparkles,     color: 'text-emerald-500',bg: 'bg-emerald-50', title: 'AI Insights',        desc: 'Personalised pattern analysis — never medical advice.' },
  { icon: Users,        color: 'text-orange-500', bg: 'bg-orange-50',  title: 'Friends Mode',       desc: 'Create challenge groups and compare profiles with your circle.' },
]

const TESTIMONIALS = [
  {
    quote: "I never knew I was a Natural Balance Seeker until this app showed me exactly why I resist supplements and love sleep hygiene.",
    name: 'Sarah M.', role: 'Wellness coach, 42', color: 'border-t-4 border-t-emerald-400',
  },
  {
    quote: "My partner and I did the Couples Mode together. 74% compatibility — but our 26% difference sparked the best health conversation we've ever had.",
    name: 'James & Priya K.', role: 'Couple, 38 & 35', color: 'border-t-4 border-t-violet-400',
  },
  {
    quote: "As a biohacker I expected to just be called Optimizer. My actual archetype surprised me — and made me rethink my whole approach.",
    name: 'Derek T.', role: 'Tech founder & biohacker, 45', color: 'border-t-4 border-t-rose-400',
  },
]

// Duplicate arrays for seamless infinite marquee
const CATEGORY_LIST = Object.values(CATEGORY_META)
const ARCHETYPE_LIST = Object.values(ARCHETYPE_META)

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingNav />

      {/* Offset for fixed nav */}
      <div className="h-[57px]" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-light via-background to-background" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-secondary opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-[300px] w-[300px] rounded-full bg-emerald-300 opacity-10 blur-3xl" />

        <div className="relative max-w-screen-xl mx-auto px-6 pt-20 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-pill border border-secondary/30 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5" />
            The psychology-driven longevity platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="font-serif italic text-5xl md:text-6xl lg:text-7xl text-primary leading-tight mb-6"
          >
            Discover your<br />
            <span className="text-secondary">longevity</span> philosophy.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Answer thought-provoking dilemmas. Uncover how you really think about health, aging, and purpose — one question at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-pill bg-secondary px-8 py-4 text-base font-semibold text-white shadow-active hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200">
              Begin the practice <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-pill border border-border bg-white/70 px-8 py-4 text-base font-medium text-text-secondary hover:bg-white transition-colors">
              See how it works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-border bg-white py-6">
        <StaggerContainer className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.08}>
          {STATS.map(({ icon: Icon, value, label }) => (
            <StaggerItem key={label} className="flex flex-col items-center gap-1 text-center">
              <Icon className="w-5 h-5 text-secondary mb-1" />
              <span className="font-serif italic text-3xl text-primary">{value}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</span>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="max-w-screen-xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <span className="inline-block rounded-pill bg-secondary-light px-4 py-1 text-xs font-semibold uppercase tracking-widest text-secondary mb-4">The process</span>
            <h2 className="font-serif italic text-3xl md:text-4xl text-primary mb-3">Simple, meaningful, revealing</h2>
            <p className="text-text-secondary max-w-lg mx-auto">Three steps. No biometrics required — just honest choices.</p>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, color, iconBg, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 0.12} direction="up">
                <div className={`relative rounded-card border p-6 h-full ${color}`}>
                  <span className="absolute top-4 right-5 font-serif italic text-5xl font-bold opacity-10">{step}</span>
                  <div className={`w-10 h-10 rounded-card flex items-center justify-center mb-4 ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed opacity-80">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample question ── */}
      <section className="bg-gradient-to-b from-secondary-light/30 to-background py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <AnimateIn className="text-center mb-12">
            <h2 className="font-serif italic text-3xl md:text-4xl text-primary mb-3">Try a question</h2>
            <p className="text-text-secondary">This is what your daily practice looks like.</p>
          </AnimateIn>
          <AnimateIn delay={0.15} className="max-w-xl mx-auto">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <Card className="shadow-elevated border-2 border-secondary/10">
                <div className="text-center mb-6">
                  <span className="inline-block mb-3 rounded-pill bg-secondary px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">Daily Quest</span>
                  <h3 className="font-serif italic text-2xl text-primary mb-1">Would You Rather...</h3>
                  <p className="text-text-secondary text-sm italic">A choice for the long-term self.</p>
                </div>
                <p className="text-text-primary text-lg text-center mb-6 leading-relaxed">
                  Live to 100 with limited mobility, or live to 80 in peak health?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Live to 100', sub: 'More years, less mobility', color: 'hover:border-emerald-400 hover:bg-emerald-50' },
                    { label: 'Live to 80',  sub: 'Fewer years, peak health',  color: 'hover:border-violet-400 hover:bg-violet-50' },
                  ].map((opt, i) => (
                    <motion.div key={opt.label} whileHover={{ scale: 1.03 }}
                      className={`rounded-[16px] border-2 border-outline-variant bg-surface p-4 text-left cursor-pointer transition-all duration-200 ${opt.color}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-secondary opacity-75 mb-1">Option {i === 0 ? 'A' : 'B'}</p>
                      <p className="font-serif text-sm text-text-primary font-medium">{opt.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{opt.sub}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="py-24 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <span className="inline-block rounded-pill bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-violet-700 mb-4">Everything included</span>
            <h2 className="font-serif italic text-3xl md:text-4xl text-primary mb-3">Built for the long game</h2>
            <p className="text-text-secondary max-w-lg mx-auto">Every feature is designed around reflection, not data collection.</p>
          </AnimateIn>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.07}>
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
              <StaggerItem key={title}>
                <motion.div whileHover={{ y: -4 }}
                  className="group p-6 rounded-card border border-border bg-white shadow-subtle hover:shadow-card transition-all duration-200 h-full"
                >
                  <div className={`w-10 h-10 rounded-card flex items-center justify-center mb-4 ${bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── 15 Categories — infinite marquee ── */}
      <section id="categories" className="py-24 bg-gradient-to-b from-surface to-background overflow-hidden">
        <AnimateIn className="text-center mb-12 px-6">
          <span className="inline-block rounded-pill bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-4">15 dimensions</span>
          <h2 className="font-serif italic text-3xl md:text-4xl text-primary mb-3">Every corner of your healthspan</h2>
          <p className="text-text-secondary max-w-lg mx-auto">From nutrition to legacy — explore the full spectrum of longevity.</p>
        </AnimateIn>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee gap-3 py-2" style={{ width: 'max-content' }}>
            {[...CATEGORY_LIST, ...CATEGORY_LIST].map(({ label, icon: Icon, color }, i) => (
              <div key={i} className="inline-flex flex-col items-center gap-2 py-4 px-5 bg-white rounded-card border border-border shadow-subtle mx-1.5 w-[130px]">
                <div className={`w-10 h-10 rounded-card flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-text-secondary text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Archetypes — infinite marquee (dark) ── */}
      <section id="archetypes" className="py-24 bg-primary overflow-hidden">
        <AnimateIn className="text-center mb-12 px-6">
          <span className="inline-block rounded-pill bg-white/10 border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 mb-4">7 archetypes</span>
          <h2 className="font-serif italic text-3xl md:text-4xl text-white mb-3">Which longevity type are you?</h2>
          <p className="text-white/60 max-w-lg mx-auto">Answer questions to find out where you fall.</p>
        </AnimateIn>

        {/* Infinite marquee — reverse direction */}
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div
            className="animate-marquee gap-4 py-2"
            style={{ width: 'max-content', animationDirection: 'reverse', animationDuration: '22s' }}
          >
            {[...ARCHETYPE_LIST, ...ARCHETYPE_LIST].map(({ label, icon: Icon, color, tagline }, i) => (
              <div
                key={i}
                className="inline-flex flex-col items-center gap-3 py-7 px-6 text-center rounded-card border border-white/10 bg-white/5 mx-2 w-[190px]"
              >
                <div className={`w-12 h-12 rounded-card-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm leading-tight mb-1">{label}</p>
                  <p className="text-xs text-white/50 italic">{tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-background">
        <div className="max-w-screen-xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <span className="inline-block rounded-pill bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-rose-700 mb-4">What explorers say</span>
            <h2 className="font-serif italic text-3xl md:text-4xl text-primary mb-3">Real discoveries, real people</h2>
          </AnimateIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {TESTIMONIALS.map(({ quote, name, role, color }) => (
              <StaggerItem key={name}>
                <Card className={`h-full ${color}`}>
                  <p className="text-text-secondary text-sm leading-relaxed mb-5 italic">&ldquo;{quote}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-9 h-9 rounded-full bg-secondary-light flex items-center justify-center text-secondary font-semibold text-sm shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{name}</p>
                      <p className="text-xs text-text-muted">{role}</p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-surface">
        <div className="max-w-screen-xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <span className="inline-block rounded-pill bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-4">Pricing</span>
            <h2 className="font-serif italic text-3xl md:text-4xl text-primary mb-3">Start free, upgrade when ready</h2>
            <p className="text-text-secondary max-w-md mx-auto">No credit card required to begin your practice.</p>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <AnimateIn delay={0.05} direction="left">
              <Card className="h-full">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">Free</p>
                <p className="font-serif italic text-4xl text-primary mb-4">$0</p>
                <ul className="text-sm text-text-secondary space-y-3 mb-6">
                  {['Daily question', 'Basic archetype profile', 'Private journal', 'Streaks & badges'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block w-full rounded-card border-2 border-border py-3 text-center text-sm font-semibold text-text-secondary hover:bg-surface transition-colors">
                  Get started free
                </Link>
              </Card>
            </AnimateIn>

            <AnimateIn delay={0.12} direction="right">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="h-full">
                <Card variant="featured" className="h-full relative overflow-hidden">
                  <div className="absolute top-3 right-3 rounded-pill bg-secondary px-3 py-0.5 text-xs font-bold text-white">Most popular</div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">Premium</p>
                  <div className="mb-4">
                    <p className="font-serif italic text-4xl text-primary">$9.99<span className="text-xl">/mo</span></p>
                    <p className="text-sm text-text-muted">or <strong>$79/year</strong> — save 34%</p>
                  </div>
                  <ul className="text-sm text-text-secondary space-y-3 mb-6">
                    {['Everything in Free', 'Unlimited questions', 'Full radar analytics', 'AI personality insights', 'Couples mode', 'Friends & group challenges', 'Downloadable PDF reports'].map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block w-full rounded-pill bg-secondary py-3 text-center text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity">
                    Start free trial
                  </Link>
                </Card>
              </motion.div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-secondary via-primary to-secondary/80 py-20">
        <AnimateIn className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif italic text-3xl md:text-4xl text-white mb-4">Your longevity philosophy is waiting.</h2>
          <p className="text-white/70 mb-8 text-lg">
            Join thousands of explorers who have discovered how they really think about aging, health, and purpose.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-pill bg-white px-8 py-4 text-base font-semibold text-primary shadow-elevated hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200">
            Begin for free <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimateIn>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary py-12">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col items-center gap-8">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white/70" />
            </div>
            <span className="font-serif italic text-white text-base">The Longevity Game</span>
          </div>

          {/* Real nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <Link href="/signup"        className="hover:text-white transition-colors">Sign up</Link>
            <Link href="/login"         className="hover:text-white transition-colors">Log in</Link>
            <a    href="#pricing"       className="hover:text-white transition-colors">Pricing</a>
            <a    href="#how-it-works"  className="hover:text-white transition-colors">How it works</a>
            <a    href="#categories"    className="hover:text-white transition-colors">Categories</a>
            <a    href="#archetypes"    className="hover:text-white transition-colors">Archetypes</a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {[
              { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: FaXTwitter,  href: 'https://x.com',        label: 'X / Twitter' },
              { icon: FaYoutube,   href: 'https://youtube.com',   label: 'YouTube' },
              { icon: FaTiktok,    href: 'https://tiktok.com',    label: 'TikTok' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="border-t border-white/10 w-full pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/30">
            <p>© 2026 The Longevity Game™. All rights reserved.</p>
            <p>Based on <em>Would You Rather: The Longevity Challenge</em> by Valentina Teekapa</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
