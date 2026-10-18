import { useEffect, useMemo, useState } from 'react'
import { fetchContent, normalize, readCache } from '../lib/content'
import { defaultContent } from '../lib/defaults'
import { supabase } from '../lib/supabase'
import { applyTheme } from '../lib/theme'
import type { Mode, SiteContent } from '../lib/types'
import Clean from './layouts/Clean'
import Neon from './layouts/Neon'
import Terminal from './layouts/Terminal'
import { SiteContext, useReducedMotion, type SiteCtx } from './shared'

const MODE_KEY = 'pf-visitor-mode'
export const PREVIEW_MSG = 'portfolio-preview'

const isPreview = new URLSearchParams(location.search).has('preview')

function readVisitorMode(): Mode | null {
  try {
    const v = localStorage.getItem(MODE_KEY)
    return v === 'dark' || v === 'light' ? v : null
  } catch {
    return null
  }
}

function setMeta(name: string, value: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = value
}

export default function SiteApp() {
  // Preview (inside /admin) waits for the editor to send its draft; the live
  // site shows cached content instantly and refreshes from Supabase.
  const [content, setContent] = useState<SiteContent | null>(() =>
    isPreview ? null : supabase ? readCache() : defaultContent,
  )
  const [visitorMode, setVisitorMode] = useState<Mode | null>(() => (isPreview ? null : readVisitorMode()))
  const reduced = useReducedMotion()

  useEffect(() => {
    if (isPreview) {
      const onMsg = (e: MessageEvent) => {
        if (e.origin !== location.origin || e.data?.type !== PREVIEW_MSG) return
        setContent(normalize(e.data.content))
        if (e.data.mode === 'dark' || e.data.mode === 'light') setVisitorMode(e.data.mode)
        else setVisitorMode(null)
      }
      window.addEventListener('message', onMsg)
      window.parent?.postMessage({ type: `${PREVIEW_MSG}-ready` }, location.origin)
      return () => window.removeEventListener('message', onMsg)
    }
    if (!supabase) return
    let alive = true
    const fallback = window.setTimeout(() => alive && setContent((c) => c ?? defaultContent), 5000)
    fetchContent()
      .then((res) => alive && setContent(res?.content ?? defaultContent))
      .catch((err) => {
        console.warn('Could not load content from Supabase, using fallback.', err)
        if (alive) setContent((c) => c ?? defaultContent)
      })
      .finally(() => window.clearTimeout(fallback))
    return () => {
      alive = false
      window.clearTimeout(fallback)
    }
  }, [])

  const mode: Mode = content?.theme.effects.modeToggle && visitorMode ? visitorMode : content?.theme.mode ?? 'dark'

  useEffect(() => {
    if (!content) return
    applyTheme(content.theme, mode, content.profile.initials)
    document.title = content.seo.title || content.profile.name
    setMeta('description', content.seo.description)
    setMeta('og:title', content.seo.title, 'property')
    setMeta('og:description', content.seo.description, 'property')
    if (content.profile.photo) setMeta('og:image', new URL(content.profile.photo, location.origin).href, 'property')
  }, [content, mode])

  const ctx = useMemo<SiteCtx | null>(() => {
    if (!content) return null
    return {
      c: content,
      mode,
      anim: content.theme.effects.animations && !reduced,
      toggleMode: () => {
        const next: Mode = mode === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.add('theme-fade')
        window.setTimeout(() => document.documentElement.classList.remove('theme-fade'), 400)
        setVisitorMode(next)
        if (!isPreview) {
          try {
            localStorage.setItem(MODE_KEY, next)
          } catch {
            /* ignore */
          }
        }
      },
    }
  }, [content, mode, reduced])

  if (!ctx) {
    return (
      <div className="min-h-screen grid place-items-center bg-bg" aria-busy="true">
        <div className="h-8 w-8 rounded-full border-2 border-line border-t-a1 animate-spin" />
      </div>
    )
  }

  const Layout = { terminal: Terminal, neon: Neon, clean: Clean }[ctx.c.theme.layout] ?? Terminal
  return (
    <SiteContext.Provider value={ctx}>
      <div className={`site ${ctx.anim ? 'anim' : ''}`}>
        <Layout />
      </div>
    </SiteContext.Provider>
  )
}
