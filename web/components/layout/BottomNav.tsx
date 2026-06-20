'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Leaf, Map, BookOpen, User, Sparkles, Users } from 'lucide-react'

const NAV = [
  { href: '/today',    icon: Leaf,     label: 'Today' },
  { href: '/explore',  icon: Map,      label: 'Explore' },
  { href: '/journal',  icon: BookOpen, label: 'Journal' },
  { href: '/insights', icon: Sparkles, label: 'Insights' },
  { href: '/friends',  icon: Users,    label: 'Friends' },
  { href: '/profile',  icon: User,     label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex border-t border-outline-variant bg-surface">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-0.5 py-2">
            <Icon className={cn('w-5 h-5 transition-all', active ? 'text-secondary scale-110' : 'text-text-muted opacity-60')} />
            <span className={cn('text-[10px] font-semibold', active ? 'text-secondary' : 'text-text-muted')}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
