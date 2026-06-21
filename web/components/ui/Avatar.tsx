const sizes = { sm: 'w-9 h-9 text-sm', md: 'w-11 h-11 text-base', lg: 'w-14 h-14 text-lg' }

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initial = name?.[0]?.toUpperCase() ?? '?'
  return (
    <div className={`${sizes[size]} flex items-center justify-center rounded-full border-2 border-outline-variant bg-secondary font-semibold text-white`}>
      {initial}
    </div>
  )
}
