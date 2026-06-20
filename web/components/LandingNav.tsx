'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Leaf, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works',  id: 'how-it-works' },
  { href: '#categories',   label: 'Categories',    id: 'categories'   },
  { href: '#archetypes',   label: 'Archetypes',    id: 'archetypes'   },
  { href: '#pricing',      label: 'Pricing',        id: 'pricing'      },
]

export function LandingNav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary shadow-active">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif italic text-lg text-primary">The Longevity Game</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, id }) => {
            const isActive = active === id
            return (
              <a
                key={href}
                href={href}
                className={`relative px-3 py-2 text-sm font-medium rounded-card transition-colors ${
                  isActive
                    ? 'text-secondary bg-secondary-light'
                    : 'text-text-secondary hover:text-primary hover:bg-surface-high'
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-secondary" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden md:block px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="rounded-pill bg-secondary px-5 py-2 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity">
            Get Started
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-primary"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ href, label, id }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium py-1 transition-colors ${
                active === id ? 'text-secondary font-semibold' : 'text-text-secondary hover:text-primary'
              }`}
            >
              {label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-border">
            <Link href="/login" className="flex-1 py-2 text-center text-sm font-medium border border-border rounded-card text-text-secondary">
              Log in
            </Link>
            <Link href="/signup" className="flex-1 py-2 text-center text-sm font-semibold bg-secondary rounded-pill text-white">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
