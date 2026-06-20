import { Request, Response, NextFunction } from 'express'
import { supabase } from '../services/supabase'

export interface AuthRequest extends Request {
  userId: string
  userEmail: string
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ data: null, error: { message: 'Missing token', code: 'UNAUTHENTICATED' } })
  }

  const token = header.slice(7)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    return res.status(401).json({ data: null, error: { message: 'Invalid or expired token', code: 'UNAUTHENTICATED' } })
  }

  ;(req as AuthRequest).userId = data.user.id
  ;(req as AuthRequest).userEmail = data.user.email ?? ''
  next()
}
