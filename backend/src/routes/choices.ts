import { Router, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

const ChoiceSchema = z.object({
  question_id: z.string(),
  selected_option: z.enum(['A', 'B']).optional(),
  skipped: z.boolean().optional(),
  reflection: z.string().max(2000).optional(),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).refine(d => d.skipped || d.selected_option, { message: 'selected_option required unless skipped' })

// POST /choices
router.post('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const parsed = ChoiceSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ data: null, error: { message: 'Invalid input', code: 'VALIDATION_ERROR', details: parsed.error.flatten() } })
  }

  const { question_id, selected_option, skipped, reflection, mood, tags } = parsed.data

  let selected_archetype: string | null = null
  let category: string | null = null

  if (!skipped && selected_option) {
    const { data: question } = await supabase
      .from('questions').select('option_a_archetype,option_b_archetype,category').eq('id', question_id).single()
    selected_archetype = (selected_option === 'A' ? question?.option_a_archetype : question?.option_b_archetype) ?? null
    category = question?.category ?? null
  }

  const { data, error } = await supabase.from('user_choices').upsert({
    user_id: userId,
    question_id,
    selected_option: selected_option ?? null,
    selected_archetype,
    skipped: skipped ?? false,
    category,
    reflection: reflection ?? null,
    mood: mood ?? null,
    tags: tags ?? [],
    answered_at: new Date().toISOString(),
  }, { onConflict: 'user_id,question_id' }).select().single()

  if (error) return res.status(500).json({ data: null, error: { message: error.message } })

  if (!skipped) recalculateArchetype(userId).catch(() => {})

  res.status(201).json({ data, error: null })
})

// GET /choices
router.get('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { data, error } = await supabase
    .from('user_choices').select('*').eq('user_id', userId).order('answered_at', { ascending: false })
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data, error: null })
})

// GET /choices/stats/:questionId — community A/B split (anonymous)
router.get('/stats/:questionId', requireAuth, async (req, res: Response) => {
  const { data } = await supabase
    .from('user_choices')
    .select('selected_option')
    .eq('question_id', req.params.questionId)
  const total = data?.length ?? 0
  const aCount = data?.filter(c => c.selected_option === 'A').length ?? 0
  res.json({ data: { total, A: aCount, B: total - aCount }, error: null })
})

async function recalculateArchetype(userId: string) {
  const { data: choices } = await supabase
    .from('user_choices').select('selected_archetype').eq('user_id', userId)
  if (!choices?.length) return

  const counts: Record<string, number> = {}
  for (const c of choices) {
    if (c.selected_archetype) counts[c.selected_archetype] = (counts[c.selected_archetype] ?? 0) + 1
  }
  const primary = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
  if (primary) {
    await supabase.from('profiles').update({ archetype: primary }).eq('id', userId)
  }
}

export default router
