'use client'
import { useEffect, useMemo, useState } from 'react'
import { journal as journalApi, type JournalEntry } from '@/lib/api'

const ACCENT_PALETTE = ['#C4654A', '#546342', '#C49B6C', '#8B7355', '#A35C4A']
function accentFor(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length]
}

function fmt(dateStr: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(dateStr))
}

type Sort = 'recent' | 'title'

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<Sort>('recent')

  useEffect(() => {
    journalApi.list()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const sorted = useMemo(() => {
    const arr = [...entries]
    if (sort === 'title') arr.sort((a, b) => a.title.localeCompare(b.title))
    return arr
  }, [entries, sort])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">Journal</h1>
        <p className="text-text-secondary text-sm mt-1">Your reflections, patterns, and notes</p>
      </div>

      {/* Sort + count */}
      <div className="flex items-center gap-2">
        {(['recent', 'title'] as Sort[]).map(s => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`rounded-pill border px-4 py-2 text-xs font-semibold capitalize transition-colors ${
              sort === s
                ? 'bg-primary border-primary text-white'
                : 'border-border bg-surface-elevated text-text-secondary hover:border-primary/40'
            }`}
          >
            {s === 'recent' ? 'Recent' : 'By title'}
          </button>
        ))}
        <span className="ml-auto text-xs text-text-muted">{sorted.length} {sorted.length === 1 ? 'entry' : 'entries'}</span>
      </div>

      {loading ? (
        <p className="text-center text-text-muted font-serif italic py-10">Loading…</p>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="font-serif italic text-2xl text-primary mb-2">No entries yet</p>
          <p className="text-text-secondary text-sm">Your journal entries will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map(entry => {
            const accent = accentFor(entry.title)
            return (
              <div
                key={entry.id}
                className="rounded-card-lg border border-border bg-surface-elevated p-5"
                style={{ borderLeftWidth: 3, borderLeftColor: accent }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                    {entry.mood ?? 'Journal'}
                  </span>
                  <span className="text-xs text-text-muted">{fmt(entry.created_at)}</span>
                </div>
                <p className="font-serif text-base text-primary leading-snug mb-2">{entry.title}</p>
                <p className="font-serif italic text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {entry.body}
                </p>
                {entry.tags?.length ? (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.tags.map(tag => (
                      <span key={tag} className="rounded-pill bg-surface px-2.5 py-0.5 text-xs text-text-muted border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
