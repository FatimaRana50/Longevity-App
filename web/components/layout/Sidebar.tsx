'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Leaf, Map, BookOpen, User, Share2, Heart,
} from 'lucide-react'

const NAV = [
  { href: '/today',   icon: Leaf,     label: 'Daily Quest' },
  { href: '/explore', icon: Map,      label: 'Explore' },
  { href: '/journal', icon: BookOpen, label: 'Journal' },
  { href: '/profile', icon: User,     label: 'Profile' },
  { href: '/share',   icon: Share2,   label: 'Share' },
  { href: '/couples', icon: Heart,    label: 'Couples' },
]

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 border-r border-border bg-surface px-4 py-6 gap-6 z-40">
      <div className="flex items-center gap-2 px-2">
        <Leaf className="w-6 h-6 text-secondary" />
        <span className="font-serif italic text-xl text-primary">The Longevity Game</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-secondary-light text-secondary font-semibold'
                : 'text-text-secondary hover:bg-surface-high'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 px-2 pt-4 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white font-semibold text-sm shrink-0">
          {userName?.[0]?.toUpperCase() ?? '?'}
        </div>
        <span className="text-sm font-medium text-text-primary truncate">{userName}</span>
      </div>
    </aside>
  )
}
