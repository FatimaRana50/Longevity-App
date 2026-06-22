'use client'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { Plus, X, Loader2, Search, Download } from 'lucide-react'
import { journal as journalApi, exportApi, type JournalEntry } from '@/lib/api'

const ACCENT_PALETTE = ['#C4654A', '#546342', '#C49B6C', '#8B7355', '#A35C4A']
function accentFor(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length]
}

function fmt(dateStr: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(dateStr))
}

const MOODS = ['great', 'good', 'neutral', 'reflective', 'uncertain'] as const
type Mood = typeof MOODS[number]
const MOOD_EMOJI: Record<Mood, string> = { great: '😄', good: '🙂', neutral: '😐', reflective: '🤔', uncertain: '😕' }

type Sort = 'recent' | 'title'

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<Sort>('recent')
  const [view, setView] = useState<'list' | 'timeline'>('list')
  const [search, setSearch] = useState('')
  const [moodFilter, setMoodFilter] = useState<Mood | ''>('')
  const [showForm, setShowForm] = useState(false)
  const [exporting, setExporting] = useState(false)

  // form state
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [mood, setMood] = useState<Mood | ''>('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    journalApi.list().then(setEntries).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let arr = [...entries]
    if (search.trim()) {
      const q = search.toLowerCase()
      arr = arr.filter(e => e.title?.toLowerCase().includes(q) || e.body.toLowerCase().includes(q))
    }
    if (moodFilter) arr = arr.filter(e => e.mood === moodFilter)
    if (sort === 'title') arr.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    return arr
  }, [entries, search, moodFilter, sort])

  function openForm() {
    setTitle(''); setBody(''); setMood(''); setTags(''); setFormErr('')
    setShowForm(true)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) { setFormErr('Title and content are required.'); return }
    setSaving(true); setFormErr('')
    try {
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean)
      const entry = await journalApi.create({ title: title.trim(), body: body.trim(), mood: mood || undefined, tags: tagArr })
      setEntries(prev => [entry, ...prev])
      setShowForm(false)
    } catch (err: unknown) {
      setFormErr(err instanceof Error ? err.message : 'Could not save entry.')
    } finally {
      setSaving(false)
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      const data = await exportApi.journal()
      const fmt2 = (d: string) => new Intl.DateTimeFormat('en', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(d))
      const entryHtml = data.entries.map(e => `
        <div class="entry">
          <div class="entry-meta">${fmt2(e.created_at)}${e.mood ? ` · ${e.mood}` : ''}</div>
          <h2>${e.title ?? 'Untitled'}</h2>
          <p>${e.body.replace(/\n/g, '<br>')}</p>
          ${e.tags?.length ? `<div class="tags">${e.tags.map((t: string) => `<span>${t}</span>`).join('')}</div>` : ''}
        </div>
      `).join('')
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Longevity Journal</title>
      <style>
        body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; color: #1C1C18; line-height: 1.6; }
        h1 { font-style: italic; font-size: 2rem; color: #3C4A3E; border-bottom: 2px solid #546342; padding-bottom: 12px; }
        .meta { color: #887369; font-size: 0.85rem; margin-bottom: 32px; }
        .entry { margin-bottom: 36px; padding-bottom: 36px; border-bottom: 1px solid #E8EAE4; }
        .entry h2 { font-style: italic; font-size: 1.2rem; color: #3C4A3E; margin: 0 0 8px; }
        .entry-meta { font-size: 0.78rem; color: #887369; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .entry p { color: #4A4E46; margin: 0 0 10px; }
        .tags span { display: inline-block; background: #E8F0DC; color: #546342; border-radius: 99px; padding: 2px 10px; font-size: 0.75rem; margin-right: 6px; }
        @media print { body { margin: 20px; } }
      </style></head><body>
      <h1>The Longevity Game — Journal</h1>
      <div class="meta">
        ${data.profile?.name ?? ''} · Archetype: ${data.profile?.archetype ?? 'In progress'} ·
        ${data.streak?.current_streak ?? 0} day streak · Exported ${new Date().toLocaleDateString()}
      </div>
      ${entryHtml}
      </body></html>`
      const win = window.open('', '_blank')
      if (win) {
        win.document.write(html)
        win.document.close()
        setTimeout(() => win.print(), 400)
      }
    } catch { /* silent */ } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif italic text-3xl text-primary">Journal</h1>
          <p className="text-text-secondary text-sm mt-1">Your reflections, patterns, and notes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting || entries.length === 0}
            className="flex items-center gap-1.5 rounded-pill border border-border px-3 py-2.5 text-sm font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
            title="Export as PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">PDF</span>
          </button>
          <button
            onClick={openForm}
            className="flex items-center gap-1.5 rounded-pill bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search entries…"
          className="w-full pl-10 pr-4 py-3 rounded-card border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mood filter + sort */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMoodFilter('')}
          className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors ${!moodFilter ? 'bg-primary border-primary text-white' : 'border-border text-text-secondary hover:border-primary/40'}`}
        >
          All moods
        </button>
        {MOODS.map(m => (
          <button
            key={m}
            onClick={() => setMoodFilter(prev => prev === m ? '' : m)}
            className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors ${moodFilter === m ? 'bg-primary border-primary text-white' : 'border-border text-text-secondary hover:border-primary/40'}`}
          >
            {MOOD_EMOJI[m]} {m}
          </button>
        ))}
        <div className="ml-auto flex gap-1.5">
          {(['recent', 'title'] as Sort[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors ${sort === s ? 'bg-primary border-primary text-white' : 'border-border text-text-secondary hover:border-primary/40'}`}
            >
              {s === 'recent' ? 'Recent' : 'A–Z'}
            </button>
          ))}
          <button onClick={() => setView('list')}
            className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors ${view === 'list' ? 'bg-primary border-primary text-white' : 'border-border text-text-secondary hover:border-primary/40'}`}>
            List
          </button>
          <button onClick={() => setView('timeline')}
            className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors ${view === 'timeline' ? 'bg-primary border-primary text-white' : 'border-border text-text-secondary hover:border-primary/40'}`}>
            Timeline
          </button>
        </div>
      </div>

      <p className="text-xs text-text-muted">{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}</p>

      {loading ? (
        <p className="text-center text-text-muted font-serif italic py-10">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-6">
          {entries.length === 0 ? (
            <>
              <p className="font-serif italic text-2xl text-primary mb-2">No entries yet</p>
              <p className="text-text-secondary text-sm mb-6">Start capturing your longevity reflections.</p>
              <button onClick={openForm} className="rounded-pill bg-secondary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                Write your first entry
              </button>
            </>
          ) : (
            <>
              <p className="font-serif italic text-xl text-primary mb-2">No entries match</p>
              <p className="text-text-secondary text-sm">Try a different search or filter.</p>
            </>
          )}
        </div>
      ) : view === 'timeline' ? (
        (() => {
          const groups: Record<string, JournalEntry[]> = {}
          filtered.forEach(e => {
            const key = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(e.created_at))
            if (!groups[key]) groups[key] = []
            groups[key].push(e)
          })
          return (
            <div className="flex flex-col gap-0">
              {Object.entries(groups).map(([month, monthEntries]) => (
                <div key={month} className="flex gap-4">
                  <div className="flex flex-col items-center w-16 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                    <div className="w-0.5 bg-border flex-1 mt-1" />
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 -mt-0.5">{month}</p>
                    <div className="flex flex-col gap-3">
                      {monthEntries.map(entry => {
                        const accent = accentFor(entry.title ?? 'entry')
                        return (
                          <div key={entry.id} className="rounded-card-lg border border-border bg-surface-elevated p-4"
                            style={{ borderLeftWidth: 3, borderLeftColor: accent }}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                                {entry.mood ? `${MOOD_EMOJI[entry.mood as Mood] ?? ''} ${entry.mood}` : 'Journal'}
                              </span>
                              <span className="text-xs text-text-muted">
                                {new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(entry.created_at))}
                              </span>
                            </div>
                            <p className="font-serif text-sm text-primary leading-snug mb-1">{entry.title}</p>
                            <p className="font-serif italic text-xs text-text-secondary leading-relaxed line-clamp-2">{entry.body}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })()
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(entry => {
            const accent = accentFor(entry.title ?? 'entry')
            return (
              <div
                key={entry.id}
                className="rounded-card-lg border border-border bg-surface-elevated p-5"
                style={{ borderLeftWidth: 3, borderLeftColor: accent }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                    {entry.mood ? `${MOOD_EMOJI[entry.mood as Mood] ?? ''} ${entry.mood}` : 'Journal'}
                  </span>
                  <span className="text-xs text-text-muted">{fmt(entry.created_at)}</span>
                </div>
                <p className="font-serif text-base text-primary leading-snug mb-2">{entry.title}</p>
                <p className="font-serif italic text-sm text-text-secondary leading-relaxed line-clamp-3">{entry.body}</p>
                {entry.tags?.length ? (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearch(tag)}
                        className="rounded-pill bg-surface px-2.5 py-0.5 text-xs text-text-muted border border-border hover:border-secondary hover:text-secondary transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      {/* Create entry modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-background rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 pb-8 animate-fade-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif italic text-2xl text-primary">New Entry</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-1.5">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-1.5">Reflection</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write your thoughts here…"
                  rows={5}
                  className="w-full rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">Mood</label>
                <div className="flex gap-2 flex-wrap">
                  {MOODS.map(m => (
                    <button key={m} type="button" onClick={() => setMood(prev => prev === m ? '' : m)}
                      className={`rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors ${mood === m ? 'bg-secondary border-secondary text-white' : 'border-border text-text-secondary hover:border-secondary'}`}>
                      {MOOD_EMOJI[m]} {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-1.5">Tags <span className="normal-case font-normal">(comma separated)</span></label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="sleep, nutrition, stress"
                  className="w-full rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary" />
              </div>

              {formErr && <p className="text-sm text-red-500">{formErr}</p>}

              <button type="submit" disabled={saving}
                className="w-full rounded-pill bg-secondary py-3.5 text-sm font-semibold text-white shadow-active hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
