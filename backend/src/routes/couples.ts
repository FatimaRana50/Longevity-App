import { Router, Response } from 'express'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { requirePremium } from '../middleware/premium'

const router = Router()

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

// POST /couples/invite
router.post('/invite', requireAuth, requirePremium, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const code = generateCode()
  const { data, error } = await supabase.from('couples').insert({
    user1_id: userId, invite_code: code, status: 'pending',
  }).select().single()
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.status(201).json({ data: { invite_code: code, couple: data }, error: null })
})

// POST /couples/join
router.post('/join', requireAuth, requirePremium, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { invite_code } = req.body
  if (!invite_code) return res.status(400).json({ data: null, error: { message: 'invite_code required' } })

  const { data: couple } = await supabase
    .from('couples').select('*').eq('invite_code', invite_code).eq('status', 'pending').single()
  if (!couple) return res.status(404).json({ data: null, error: { message: 'Invalid or expired invite code' } })
  if (couple.user1_id === userId) return res.status(400).json({ data: null, error: { message: 'Cannot join your own invite' } })

  const { data, error } = await supabase.from('couples')
    .update({ user2_id: userId, status: 'active' }).eq('id', couple.id).select().single()
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data, error: null })
})

// GET /couples/comparison
router.get('/comparison', requireAuth, requirePremium, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { data: couple } = await supabase
    .from('couples').select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq('status', 'active').single()

  if (!couple) return res.status(404).json({ data: null, error: { message: 'No active couple found' } })

  const partnerId = couple.user1_id === userId ? couple.user2_id : couple.user1_id
  const [{ data: myChoices }, { data: partnerChoices }] = await Promise.all([
    supabase.from('user_choices').select('question_id,selected_option').eq('user_id', userId),
    supabase.from('user_choices').select('question_id,selected_option').eq('user_id', partnerId),
  ])

  const myMap = Object.fromEntries((myChoices ?? []).map(c => [c.question_id, c.selected_option]))
  const partnerMap = Object.fromEntries((partnerChoices ?? []).map(c => [c.question_id, c.selected_option]))
  const shared = Object.keys(myMap).filter(id => id in partnerMap)
  const agreements = shared.filter(id => myMap[id] === partnerMap[id])
  const compatibility = shared.length ? Math.round((agreements.length / shared.length) * 100) : null

  res.json({
    data: { compatibility, shared_questions: shared.length, agreements: agreements.length },
    error: null,
  })
})

export default router
