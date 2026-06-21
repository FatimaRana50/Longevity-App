import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'active' | 'inactive' | 'category' | 'muted'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'active', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      variant === 'active'   && 'bg-secondary text-white',
      variant === 'inactive' && 'border border-border bg-white text-text-primary',
      variant === 'category' && 'bg-secondary-light text-on-secondary-container',
      variant === 'muted'    && 'bg-surface text-text-muted',
      className
    )}>
      {children}
    </span>
  )
}
