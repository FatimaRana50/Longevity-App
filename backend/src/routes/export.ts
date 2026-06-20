import { Router, Response } from 'express'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /export/journal — returns structured JSON for PDF generation on client
// (Server-side PDF generation would require puppeteer/pdfkit — keeping it lightweight)
router.get('/journal', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest

  const [{ data: profile }, { data: entries }, { data: streak }] = await Promise.all([
    supabase.from('profiles').select('name,email,archetype,created_at').eq('id', userId).single(),
    supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('streaks').select('*').eq('user_id', userId).single(),
  ])

  res.json({
    data: {
      profile,
      entries: entries ?? [],
      streak,
      exported_at: new Date().toISOString(),
    },
    error: null,
  })
})

export default router
