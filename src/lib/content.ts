import { defaultContent } from './defaults'
import { MEDIA_BUCKET, supabase } from './supabase'
import type { SiteContent } from './types'

const TABLE = 'site_content'
const ROW_ID = 1
const CACHE_KEY = 'pf-content-cache'

type Json = Record<string, unknown>

function isObject(v: unknown): v is Json {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Fill in any fields missing from saved content (e.g. fields added in a later version). */
function mergeDefaults<T>(base: T, saved: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(saved) ? saved : base) as T
  if (isObject(base)) {
    if (!isObject(saved)) return base
    const out: Json = { ...base }
    for (const k of Object.keys(base)) {
      if (k in saved) out[k] = mergeDefaults((base as Json)[k], saved[k])
    }
    return out as T
  }
  return (saved === undefined || saved === null || typeof saved !== typeof base ? base : saved) as T
}

export function normalize(saved: unknown): SiteContent {
  const c = mergeDefaults(defaultContent, saved)
  // Keep every section present exactly once, in the saved order.
  const seen = new Set<string>()
  const sections = c.sections.filter((s) => {
    const known = defaultContent.sections.some((d) => d.id === s.id)
    if (!known || seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })
  for (const d of defaultContent.sections) if (!seen.has(d.id)) sections.push(d)
  return { ...c, sections }
}

export function readCache(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? normalize(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function writeCache(c: SiteContent) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c))
  } catch {
    /* storage unavailable — fine */
  }
}

/** Returns saved content, or null if nothing has been saved yet. Throws on network/config errors. */
export async function fetchContent(): Promise<{ content: SiteContent; updatedAt: string } | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from(TABLE).select('data, updated_at').eq('id', ROW_ID).maybeSingle()
  if (error) throw error
  if (!data) return null
  const content = normalize(data.data)
  writeCache(content)
  return { content, updatedAt: data.updated_at as string }
}

export async function saveContent(content: SiteContent): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const updated_at = new Date().toISOString()
  const { error } = await supabase.from(TABLE).upsert({ id: ROW_ID, data: content, updated_at })
  if (error) {
    if (error.code === '42501' || /row-level security/i.test(error.message))
      throw new Error('This account is not allowed to edit. Add its email to the admins table (see README).')
    throw error
  }
  writeCache(content)
  return updated_at
}

/** Uploads a file to the public media bucket and returns its public URL. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'bin'
  const safe = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]+/gi, '-').slice(0, 40) || 'file'
  const path = `${folder}/${Date.now()}-${safe}.${ext}`
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type || undefined,
  })
  if (error) throw error
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}
