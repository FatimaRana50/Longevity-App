import { Router, Response } from 'express'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /questions?category=&page=&limit=
router.get('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { category, page = '1', limit = '20' } = req.query
  const from = (Number(page) - 1) * Number(limit)
  const to = from + Number(limit) - 1

  // Check if user is premium
  const { data: profile } = await supabase
    .from('profiles').select('subscription_status').eq('id', userId).single()
  const isPremium = profile?.subscription_status === 'premium'

  let query = supabase.from('questions').select('*').eq('is_active', true).range(from, to)
  if (category) query = query.eq('category', category)
  if (!isPremium) query = query.eq('is_premium', false)

  const { data, error } = await query
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data, error: null })
})

// GET /questions/daily?date=YYYY-MM-DD
router.get('/daily', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const date = (req.query.date as string) ?? new Date().toISOString().slice(0, 10)

  // Check for cached daily selection
  const { data: existing } = await supabase
    .from('daily_challenges')
    .select('question_ids')
    .eq('user_id', userId)
    .eq('challenge_date', date)
    .single()

  if (existing?.question_ids?.length) {
    const { data: questions } = await supabase
      .from('questions').select('*').in('id', existing.question_ids)
    return res.json({ data: questions, error: null })
  }

  // Generate new daily selection: 3 questions, one per random category
  const { data: allQ } = await supabase
    .from('questions').select('id,category').eq('is_active', true).eq('is_premium', false)
  if (!allQ?.length) return res.json({ data: [], error: null })

  // Group by category, pick one from each of 3 random categories
  const byCategory: Record<string, string[]> = {}
  for (const q of allQ) {
    if (!byCategory[q.category]) byCategory[q.category] = []
    byCategory[q.category].push(q.id)
  }
  const cats = Object.keys(byCategory).sort(() => Math.random() - 0.5).slice(0, 3)
  const ids = cats.map(c => byCategory[c][Math.floor(Math.random() * byCategory[c].length)])

  // Cache it
  await supabase.from('daily_challenges').upsert({
    user_id: userId, challenge_date: date, question_ids: ids,
  }, { onConflict: 'user_id,challenge_date' })

  const { data: questions } = await supabase.from('questions').select('*').in('id', ids)
  res.json({ data: questions, error: null })
})

export default router
