import { Router, Response } from 'express'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /streaks
router.get('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { data, error } = await supabase
    .from('streaks').select('*').eq('user_id', userId).single()
  if (error) return res.json({ data: { current_streak: 0, longest_streak: 0, total_questions_answered: 0 }, error: null })
  res.json({ data, error: null })
})

// POST /streaks/update — call after saving a choice
router.post('/update', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  const { data: streak } = await supabase
    .from('streaks').select('*').eq('user_id', userId).single()

  if (!streak) {
    const { data } = await supabase.from('streaks').insert({
      user_id: userId, current_streak: 1, longest_streak: 1,
      total_questions_answered: 1, last_activity_date: today,
    }).select().single()
    return res.json({ data, error: null })
  }

  let current = streak.current_streak ?? 0
  if (streak.last_activity_date === today) {
    // already updated today — just increment total
    const { data } = await supabase.from('streaks').update({
      total_questions_answered: (streak.total_questions_answered ?? 0) + 1,
    }).eq('user_id', userId).select().single()
    return res.json({ data, error: null })
  }

  if (streak.last_activity_date === yesterday) {
    current += 1
  } else {
    current = 1
  }

  const longest = Math.max(current, streak.longest_streak ?? 0)
  const { data } = await supabase.from('streaks').update({
    current_streak: current, longest_streak: longest,
    total_questions_answered: (streak.total_questions_answered ?? 0) + 1,
    last_activity_date: today,
  }).eq('user_id', userId).select().single()

  res.json({ data, error: null })
})

export default router
