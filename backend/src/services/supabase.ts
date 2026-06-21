import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Service-role client — bypasses RLS, server-side only, never exposed to clients
export const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})
