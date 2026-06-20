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
      // Build a simple text export and trigger download
      const lines = [
        `The Longevity Game — Journal Export`,
        `User: ${data.profile?.name ?? ''} (${data.profile?.email ?? ''})`,
        `Archetype: ${data.profile?.archetype ?? 'Not yet determined'}`,
        `Exported: ${new Date(data.exported_at).toLocaleDateString()}`,
        `Streak: ${data.streak?.current_streak ?? 0} days current`,
        '',
        '─'.repeat(60),
        '',
        ...data.entries.map(e => [
          `📅 ${fmt(e.created_at)}`,
          `📝 ${e.title ?? 'Untitled'}`,
          e.mood ? `😊 Mood: ${e.mood}` : '',
          '',
          e.body,
          e.tags?.length ? `🏷 Tags: ${e.tags.join(', ')}` : '',
          '',
          '─'.repeat(40),
          '',
        ].filter(l => l !== undefined).join('\n')),
      ].join('\n')

      const blob = new Blob([lines], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `longevity-journal-${new Date().toISOString().slice(0, 10)}.txt`
      a.click()
      URL.revokeObjectURL(url)
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
            title="Export journal"
          >
            <Download className="w-4 h-4" />
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
