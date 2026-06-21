import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { supabase } from '../services/supabase'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
})

const forgotSchema = z.object({
  email: z.string().email(),
  redirectTo: z.string().url().optional(),
})

router.post('/signup', async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ data: null, error: { message: 'Invalid signup data', code: 'VALIDATION_ERROR' } })
  }

  const { email, password, name } = parsed.data
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name: name ?? '' },
    email_confirm: true,
  })

  if (error || !data.user) {
    return res.status(400).json({ data: null, error: { message: error?.message ?? 'Signup failed', code: 'AUTH_ERROR' } })
  }

  // Create profile row (Supabase trigger may not exist)
  await supabase.from('profiles').upsert({
    id: data.user.id,
    email,
    name: name ?? email.split('@')[0],
  }, { onConflict: 'id' })

  // Sign in immediately to get a session
  const { data: session, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError || !session.session) {
    return res.status(201).json({ data: { user: { id: data.user.id, email: data.user.email } }, error: null })
  }

  return res.status(201).json({
    data: {
      accessToken: session.session.access_token,
      refreshToken: session.session.refresh_token,
      expiresAt: session.session.expires_at,
      user: { id: data.user.id, email: data.user.email },
    },
    error: null,
  })
})

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ data: null, error: { message: 'Invalid email or password format', code: 'VALIDATION_ERROR' } })
  }

  const { email, password } = parsed.data
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return res.status(401).json({ data: null, error: { message: error?.message ?? 'Login failed', code: 'AUTH_ERROR' } })
  }

  return res.json({
    data: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    },
    error: null,
  })
})

router.post('/forgot-password', async (req: Request, res: Response) => {
  const parsed = forgotSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ data: null, error: { message: 'Invalid email', code: 'VALIDATION_ERROR' } })
  }

  const { email, redirectTo } = parsed.data
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo ?? `${process.env.ALLOWED_ORIGINS?.split(',')[0]}/reset-password`,
  })

  if (error) {
    return res.status(400).json({ data: null, error: { message: error.message, code: 'AUTH_ERROR' } })
  }

  // Always return success to avoid email enumeration
  return res.json({ data: { message: 'If that email exists, a reset link has been sent.' }, error: null })
})

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

router.post('/reset-password', async (req: Request, res: Response) => {
  const parsed = resetSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ data: null, error: { message: 'Invalid request', code: 'VALIDATION_ERROR' } })
  }

  const { token, password } = parsed.data
  const { error } = await supabase.auth.admin.updateUserById(
    // token here is actually the user's access token — exchange it first
    (await supabase.auth.getUser(token)).data.user?.id ?? '',
    { password }
  )

  if (error) {
    return res.status(400).json({ data: null, error: { message: error.message, code: 'AUTH_ERROR' } })
  }

  return res.json({ data: { message: 'Password updated successfully' }, error: null })
})

export default router
