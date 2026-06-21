import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured' | 'accent-left'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card bg-surface-elevated p-5',
        variant === 'default'     && 'border border-border shadow-subtle',
        variant === 'featured'    && 'border-2 border-secondary shadow-active',
        variant === 'accent-left' && 'border border-border border-l-4 border-l-secondary shadow-subtle',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
