import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  variant?: 'default' | 'underline'
}

export function Input({ label, variant = 'default', className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none',
          variant === 'default'   && 'rounded-lg border border-outline-variant focus:border-secondary',
          variant === 'underline' && 'border-b border-secondary bg-transparent font-serif text-xl italic px-0',
          className
        )}
        {...props}
      />
    </div>
  )
}
