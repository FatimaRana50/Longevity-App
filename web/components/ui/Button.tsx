import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function Button({
  variant = 'secondary', size = 'md', fullWidth, className, children, ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary'   && 'rounded-pill bg-text-primary text-white shadow-card hover:opacity-90',
        variant === 'secondary' && 'rounded-card bg-secondary text-white shadow-active hover:opacity-90',
        variant === 'ghost'     && 'rounded-card border border-border bg-transparent text-text-secondary hover:bg-surface',
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-5 py-3 text-base',
        size === 'lg' && 'px-6 py-4 text-lg',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
