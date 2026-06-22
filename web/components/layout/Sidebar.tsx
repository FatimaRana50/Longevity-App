'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Leaf, Map, BookOpen, User, Heart, Sparkles, LogOut, Users } from 'lucide-react'
import { clearSession } from '@/lib/api'

const NAV = [
  { href: '/today',    icon: Leaf,     label: 'Daily Quest' },
  { href: '/explore',  icon: Map,      label: 'Explore' },
  { href: '/journal',  icon: BookOpen, label: 'Journal' },
  { href: '/insights', icon: Sparkles, label: 'AI Insights' },
  { href: '/friends',  icon: Users,    label: 'Friends' },
  { href: '/couples',  icon: Heart,    label: 'Couples' },
  { href: '/profile',  icon: User,     label: 'Profile' },
]

export function Sidebar({ userName, userEmail }: { userName: string; userEmail?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 border-r border-border bg-surface px-4 py-6 gap-6 z-40">
      <div className="flex items-center gap-2 px-2">
        <Leaf className="w-6 h-6 text-secondary" />
        <span className="font-serif italic text-xl text-primary">The Longevity Game</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={cn(
              'flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-secondary-light text-secondary font-semibold'
                : 'text-text-secondary hover:bg-surface-high'
            )}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border pt-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {userName?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">{userName || '…'}</p>
            {userEmail && <p className="text-xs text-text-muted truncate">{userEmail}</p>}
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 rounded-card px-3 py-2 text-sm text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors w-full">
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
