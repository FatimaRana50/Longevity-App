import { Router, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

const JournalSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  related_question_id: z.string().uuid().optional(),
})

// GET /journal?page=&limit=&q=
router.get('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { page = '1', limit = '20', q } = req.query
  const from = (Number(page) - 1) * Number(limit)
  const to = from + Number(limit) - 1

  let query = supabase.from('journal_entries')
    .select('*').eq('user_id', userId).range(from, to).order('created_at', { ascending: false })

  if (q) query = query.textSearch('body', q as string)

  const { data, error } = await query
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data, error: null })
})

// GET /journal/:id
router.get('/:id', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { data, error } = await supabase
    .from('journal_entries').select('*').eq('id', req.params.id).eq('user_id', userId).single()
  if (error) return res.status(404).json({ data: null, error: { message: 'Not found' } })
  res.json({ data, error: null })
})

// POST /journal
router.post('/', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const parsed = JournalSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ data: null, error: { message: 'Invalid input', details: parsed.error.flatten() } })
  }
  const { data, error } = await supabase
    .from('journal_entries').insert({ user_id: userId, ...parsed.data }).select().single()
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.status(201).json({ data, error: null })
})

// PUT /journal/:id
router.put('/:id', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const parsed = JournalSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ data: null, error: { message: 'Invalid input' } })
  }
  const { data, error } = await supabase
    .from('journal_entries').update(parsed.data).eq('id', req.params.id).eq('user_id', userId).select().single()
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data, error: null })
})

// DELETE /journal/:id
router.delete('/:id', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { error } = await supabase
    .from('journal_entries').delete().eq('id', req.params.id).eq('user_id', userId)
  if (error) return res.status(500).json({ data: null, error: { message: error.message } })
  res.json({ data: { deleted: true }, error: null })
})

export default router
