interface ProgressBarProps {
  value: number       // 0–1
  height?: number
  color?: 'secondary' | 'terracotta'
  className?: string
}

export function ProgressBar({ value, height = 8, color = 'secondary', className }: ProgressBarProps) {
  const fill = color === 'terracotta' ? 'bg-terracotta' : 'bg-secondary'
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-outline-variant ${className ?? ''}`}
      style={{ height }}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${fill}`}
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      />
    </div>
  )
}
