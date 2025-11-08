import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client with service role key
 * DO NOT use this in client components - it bypasses RLS
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

