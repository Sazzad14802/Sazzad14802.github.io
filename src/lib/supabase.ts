import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** null when the env vars aren't set — the site then runs on the built-in default content. */
export const supabase: SupabaseClient | null =
  url && key && !url.includes('YOUR-PROJECT-REF') ? createClient(url, key) : null

export const MEDIA_BUCKET = 'media'
