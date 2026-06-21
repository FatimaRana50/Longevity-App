import { Router, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /friends — list accepted friends with basic profile
router.get('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest

  const { data, error } = await supabase
    .from('friends')
    .select('id,status,created_at,user_id,friend_id')
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq('status', 'accepted')

  if (error) return res.status(500).json({ data: null, error: { message: error.message } })

  // Get the other person's profile for each friendship
  const otherIds = (data ?? []).map(f => f.user_id === userId ? f.friend_id : f.user_id)
  const { data: profiles } = await supabase
    .from('profiles').select('id,name,email,archetype').in('id', otherIds)

  const friends = (data ?? []).map(f => {
    const otherId = f.user_id === userId ? f.friend_id : f.user_id
    const profile = profiles?.find(p => p.id === otherId)
    return { friendship_id: f.id, status: f.status, friend: profile }
  })

  res.json({ data: friends, error: null })
})

// GET /friends/pending — incoming friend requests
router.get('/pending', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest

  const { data, error } = await supabase
    .from('friends')
    .select('id,status,created_at,user_id')
    .eq('friend_id', userId)
    .eq('status', 'pending')

  if (error) return res.status(500).json({ data: null, error: { message: error.message } })

  const senderIds = (data ?? []).map(f => f.user_id)
  const { data: profiles } = await supabase
    .from('profiles').select('id,name,email').in('id', senderIds)

  const requests = (data ?? []).map(f => ({
    request_id: f.id,
    from: profiles?.find(p => p.id === f.user_id),
    created_at: f.created_at,
  }))

  res.json({ data: requests, error: null })
})

// POST /friends/invite — invite by email
router.post('/invite', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: 'Invalid email' } })

  const { data: target } = await supabase
    .from('profiles').select('id,name').eq('email', parsed.data.email).single()
  if (!target) return res.status(404).json({ data: null, error: { message: 'No user found with that email' } })
  if (target.id === userId) return res.status(400).json({ data: null, error: { message: 'Cannot invite yourself' } })

  // Check existing
  const { data: existing } = await supabase
    .from('friends')
    .select('id,status')
    .or(`and(user_id.eq.${userId},friend_id.eq.${target.id}),and(user_id.eq.${target.id},friend_id.eq.${userId})`)
    .single()

  if (existing) {
    if (existing.status === 'accepted') return res.status(409).json({ data: null, error: { message: 'Already friends' } })
    if (existing.status === 'pending') return res.status(409).json({ data: null, error: { message: 'Invitation already sent' } })
  }

  const { data, error } = await supabase
    .from('friends').insert({ user_id: userId, friend_id: target.id, status: 'pending' }).select().single()
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })

  res.status(201).json({ data: { ...data, friend_name: target.name }, error: null })
})

// POST /friends/accept/:id
router.post('/accept/:id', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { data, error } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .eq('id', req.params.id)
    .eq('friend_id', userId)
    .eq('status', 'pending')
    .select().single()
  if (error || !data) return res.status(404).json({ data: null, error: { message: 'Request not found' } })
  res.json({ data, error: null })
})

// POST /friends/decline/:id
router.post('/decline/:id', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', req.params.id)
    .eq('friend_id', userId)
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data: { declined: true }, error: null })
})

// DELETE /friends/:id — remove friend
router.delete('/:id', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', req.params.id)
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data: { removed: true }, error: null })
})

// GET /friends/compare/:friendId — compare archetype + category scores
router.get('/compare/:friendId', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { friendId } = req.params

  // Verify they are friends
  const { data: friendship } = await supabase
    .from('friends')
    .select('id')
    .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
    .eq('status', 'accepted')
    .single()
  if (!friendship) return res.status(403).json({ data: null, error: { message: 'Not friends' } })

  const [{ data: myChoices }, { data: theirChoices }, { data: friendProfile }] = await Promise.all([
    supabase.from('user_choices').select('question_id,selected_option,category').eq('user_id', userId),
    supabase.from('user_choices').select('question_id,selected_option,category').eq('user_id', friendId),
    supabase.from('profiles').select('name,archetype').eq('id', friendId).single(),
  ])

  const myMap = new Map((myChoices ?? []).map(c => [c.question_id, c.selected_option]))
  const theirMap = new Map((theirChoices ?? []).map(c => [c.question_id, c.selected_option]))

  const shared = [...myMap.keys()].filter(id => theirMap.has(id))
  const agreements = shared.filter(id => myMap.get(id) === theirMap.get(id))
  const compatibility = shared.length ? Math.round((agreements.length / shared.length) * 100) : null

  res.json({
    data: {
      friend: friendProfile,
      shared_questions: shared.length,
      agreements: agreements.length,
      compatibility,
    },
    error: null,
  })
})

export default router
