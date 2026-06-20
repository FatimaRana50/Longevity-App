import { Request, Response, NextFunction } from 'express'
import { supabase } from '../services/supabase'
import { AuthRequest } from './auth'

export async function requirePremium(req: Request, res: Response, next: NextFunction) {
  const { userId } = req as AuthRequest
  const { data } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', userId)
    .single()

  if (data?.subscription_status !== 'premium') {
    return res.status(403).json({ data: null, error: { message: 'Premium subscription required', code: 'PREMIUM_REQUIRED' } })
  }
  next()
}
