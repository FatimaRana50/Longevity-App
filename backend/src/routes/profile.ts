import { Router, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /profile
router.get('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) return res.status(404).json({ data: null, error: { message: 'Profile not found' } })
  res.json({ data, error: null })
})

// GET /profile/scores — dimension progress + archetype + category completion
router.get('/scores', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest

  const [{ data: choices }, { data: questions }, { data: profile }] = await Promise.all([
    supabase.from('user_choices').select('question_id,selected_archetype,category').eq('user_id', userId),
    supabase.from('questions').select('id,category').eq('is_active', true),
    supabase.from('profiles').select('archetype,subscription_status').eq('id', userId).single(),
  ])

  const answeredIds = new Set(choices?.map(c => c.question_id) ?? [])
  const categoryMap: Record<string, { answered: number; total: number }> = {}
  for (const q of questions ?? []) {
    if (!categoryMap[q.category]) categoryMap[q.category] = { answered: 0, total: 0 }
    categoryMap[q.category].total++
    if (answeredIds.has(q.id)) categoryMap[q.category].answered++
  }

  const archetypeCounts: Record<string, number> = {}
  for (const c of choices ?? []) {
    if (c.selected_archetype) archetypeCounts[c.selected_archetype] = (archetypeCounts[c.selected_archetype] ?? 0) + 1
  }

  res.json({
    data: {
      archetype: profile?.archetype,
      categoryProgress: categoryMap,
      archetypeDistribution: archetypeCounts,
      totalAnswered: answeredIds.size,
    },
    error: null,
  })
})

// PATCH /profile
router.patch('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const allowed = z.object({
    name: z.string().min(1).max(100).optional(),
    avatar_url: z.string().url().optional(),
    risk_tolerance: z.string().optional(),
  })
  const parsed = allowed.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: 'Invalid input' } })
  const { data, error } = await supabase
    .from('profiles').update(parsed.data).eq('id', userId).select().single()
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data, error: null })
})

export default router
