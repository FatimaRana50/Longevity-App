'use client'
import { useEffect, useState } from 'react'
import { UserPlus, Users, X, Check, Loader2, UserMinus, ChevronRight } from 'lucide-react'
import { friends as friendsApi, type FriendEntry, type FriendRequest } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { ARCHETYPE_META } from '@/lib/types'

export default function FriendsPage() {
  const [friendsList, setFriendsList] = useState<FriendEntry[]>([])
  const [pending, setPending] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteErr, setInviteErr] = useState('')
  const [comparing, setComparing] = useState<string | null>(null)
  const [comparison, setComparison] = useState<Record<string, { shared: number; agreements: number; compatibility: number | null }>>({})

  async function load() {
    setLoading(true)
    try {
      const [f, p] = await Promise.all([friendsApi.list(), friendsApi.pending()])
      setFriendsList(f)
      setPending(p)
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true); setInviteMsg(''); setInviteErr('')
    try {
      const res = await friendsApi.invite(inviteEmail.trim())
      setInviteMsg(`Invitation sent to ${res.friend_name}!`)
      setInviteEmail('')
    } catch (err: unknown) {
      setInviteErr(err instanceof Error ? err.message : 'Could not send invitation')
    } finally {
      setInviting(false)
    }
  }

  async function handleAccept(id: string) {
    await friendsApi.accept(id)
    load()
  }

  async function handleDecline(id: string) {
    await friendsApi.decline(id)
    setPending(p => p.filter(r => r.request_id !== id))
  }

  async function handleRemove(id: string) {
    await friendsApi.remove(id)
    setFriendsList(f => f.filter(fr => fr.friendship_id !== id))
  }

  async function handleCompare(friendId: string) {
    if (comparison[friendId]) { setComparing(friendId); return }
    setComparing(friendId)
    try {
      const data = await friendsApi.compare(friendId)
      setComparison(prev => ({ ...prev, [friendId]: { shared: data.shared_questions, agreements: data.agreements, compatibility: data.compatibility } }))
    } catch { /* silent */ }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif italic text-3xl text-primary">Friends</h1>
        <p className="text-text-secondary text-sm mt-1">Compare longevity philosophies with people you know</p>
      </div>

      {/* Invite */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Invite a Friend</p>
        <form onSubmit={handleInvite} className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="friend@example.com"
            className="flex-1 rounded-card border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary"
          />
          <button
            type="submit"
            disabled={inviting || !inviteEmail.trim()}
            className="flex items-center gap-1.5 rounded-pill bg-secondary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Invite
          </button>
        </form>
        {inviteMsg && <p className="mt-2 text-sm text-secondary">{inviteMsg}</p>}
        {inviteErr && <p className="mt-2 text-sm text-red-500">{inviteErr}</p>}
      </Card>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Pending Requests ({pending.length})</p>
          {pending.map(req => (
            <div key={req.request_id} className="flex items-center gap-3 rounded-card-lg border border-border bg-surface-elevated p-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-primary">{req.from?.name ?? 'Someone'}</p>
                <p className="text-xs text-text-muted">{req.from?.email}</p>
              </div>
              <button onClick={() => handleAccept(req.request_id)}
                className="flex items-center gap-1 rounded-pill bg-secondary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
                <Check className="w-3 h-3" /> Accept
              </button>
              <button onClick={() => handleDecline(req.request_id)}
                className="flex items-center gap-1 rounded-pill border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors">
                <X className="w-3 h-3" /> Decline
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Friends list */}
      {loading ? (
        <p className="text-center text-text-muted font-serif italic py-10">Loading…</p>
      ) : friendsList.length === 0 ? (
        <div className="text-center py-16 px-6">
          <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="font-serif italic text-2xl text-primary mb-2">No friends yet</p>
          <p className="text-text-secondary text-sm">Invite someone above to start comparing longevity philosophies.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{friendsList.length} Friends</p>
          {friendsList.map(f => {
            const archetypeMeta = f.friend?.archetype ? ARCHETYPE_META[f.friend.archetype as keyof typeof ARCHETYPE_META] : null
            const comp = f.friend ? comparison[f.friend.id] : undefined
            const isComparing = comparing === f.friend?.id

            return (
              <div key={f.friendship_id} className="rounded-card-lg border border-border bg-surface-elevated overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center shrink-0">
                    <span className="font-serif text-secondary font-bold text-sm">
                      {(f.friend?.name ?? '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary">{f.friend?.name}</p>
                    <p className="text-xs text-text-muted">{archetypeMeta?.label ?? f.friend?.archetype ?? 'Archetype unknown'}</p>
                  </div>
                  <button
                    onClick={() => f.friend && handleCompare(f.friend.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                  >
                    Compare <ChevronRight className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleRemove(f.friendship_id)} className="text-text-muted hover:text-red-500 transition-colors ml-1">
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>

                {/* Comparison panel */}
                {isComparing && (
                  <div className="border-t border-border bg-surface px-4 py-4">
                    {comp ? (
                      <div className="flex gap-4 items-center">
                        <div className="text-center flex-1">
                          <p className="text-2xl font-bold text-secondary">{comp.compatibility !== null ? `${comp.compatibility}%` : '—'}</p>
                          <p className="text-xs text-text-muted mt-0.5">Compatibility</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-2xl font-bold text-primary">{comp.shared}</p>
                          <p className="text-xs text-text-muted mt-0.5">Shared Qs</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-2xl font-bold text-primary">{comp.agreements}</p>
                          <p className="text-xs text-text-muted mt-0.5">Agreements</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-text-muted text-center">
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Comparing…
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
