import { Router, Response } from 'express'
import OpenAI from 'openai'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { requirePremium } from '../middleware/premium'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const router = Router()

// GET /insights
router.get('/', requireAuth, requirePremium, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { data, error } = await supabase
    .from('ai_insights').select('*').eq('user_id', userId).order('generated_at', { ascending: false })
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data, error: null })
})

// POST /insights/generate
router.post('/generate', requireAuth, requirePremium, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const insightType: string = req.body.insight_type ?? 'general'

  // Rate limit: 1 per type per day
  const today = new Date().toISOString().slice(0, 10)
  const { data: existing } = await supabase
    .from('ai_insights')
    .select('id')
    .eq('user_id', userId)
    .eq('insight_type', insightType)
    .gte('generated_at', today)
    .single()

  if (existing) {
    return res.status(429).json({ data: null, error: { message: 'Already generated today', code: 'RATE_LIMITED' } })
  }

  // Build summary of user choices for prompt
  const { data: choices } = await supabase
    .from('user_choices')
    .select('category,selected_option,selected_archetype')
    .eq('user_id', userId)
    .limit(50)

  const summary = Object.entries(
    (choices ?? []).reduce<Record<string, { A: number; B: number }>>((acc, c) => {
      if (!acc[c.category]) acc[c.category] = { A: 0, B: 0 }
      acc[c.category][c.selected_option as 'A' | 'B']++
      return acc
    }, {})
  ).map(([cat, v]) => `${cat}: ${v.A}x A, ${v.B}x B`).join('\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a longevity reflection coach. Provide thoughtful, educational insights about the user\'s choices. IMPORTANT: Never give medical advice. Always frame insights as reflections and patterns, not recommendations.',
      },
      {
        role: 'user',
        content: `Based on my choices across longevity dimensions:\n${summary}\n\nGive me a ${insightType} insight about my patterns in 2-3 sentences.`,
      },
    ],
    max_tokens: 200,
  })

  const content = completion.choices[0].message.content ?? ''

  const { data, error } = await supabase.from('ai_insights').insert({
    user_id: userId,
    insight_type: insightType,
    content,
    generated_at: new Date().toISOString(),
  }).select().single()

  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.status(201).json({ data, error: null })
})

export default router
