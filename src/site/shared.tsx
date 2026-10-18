import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Globe, Link2, Moon, Sun } from 'lucide-react'
import type { LinkIcon, Mode, Section, SiteContent } from '../lib/types'

/* ── context ─────────────────────────────────────────────────────────── */

export interface SiteCtx {
  c: SiteContent
  mode: Mode
  toggleMode: () => void
  /** Animations on and not reduced by the visitor's OS setting. */
  anim: boolean
}

export const SiteContext = createContext<SiteCtx | null>(null)

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite outside SiteContext')
  return ctx
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Visible sections, in the saved order, skipping ones with nothing to show. */
export function visibleSections(c: SiteContent): Section[] {
  const hasData: Record<Section['id'], boolean> = {
    about: c.about.paragraphs.length > 0 || c.about.facts.length > 0,
    skills: c.skills.length > 0,
    projects: c.projects.length > 0,
    achievements:
      c.achievements.rating.enabled ||
      c.achievements.items.length > 0 ||
      c.achievements.leadership.length > 0,
    education: c.education.length > 0,
    contact: true,
  }
  return c.sections.filter((s) => s.visible && hasData[s.id])
}

export function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name
}

/** "Sazzad Ahmed" → "SazzadAhmed" for the terminal class name. */
export function pascal(s: string) {
  const out = s.replace(/[^a-z0-9]+(.)?/gi, (_, ch: string | undefined) => (ch ? ch.toUpperCase() : '')).replace(/^./, (m) => m.toUpperCase())
  return /^[A-Za-z_]/.test(out) ? out : `_${out}`
}

export function camel(s: string) {
  const p = pascal(s)
  return p.charAt(0).toLowerCase() + p.slice(1)
}

/* ── rich text: **bold** and [label](https://…) ──────────────────────── */

export function RichText({ text, strongClass = 'text-fg font-semibold' }: { text: string; strongClass?: string }) {
  const parts: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/|#)[^)\s]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1] !== undefined) parts.push(<strong key={i++} className={strongClass}>{m[1]}</strong>)
    else
      parts.push(
        <a key={i++} href={m[3]} target={m[3].startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="underline decoration-a1/50 underline-offset-4 hover:text-a1">
          {m[2]}
        </a>,
      )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

/* ── scroll reveal ───────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { anim } = useSite()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(!anim)
  useEffect(() => {
    if (!anim) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [anim])
  return (
    <div
      ref={ref}
      className={`${anim ? 'reveal' : ''} ${shown ? 'shown' : ''} ${className}`}
      style={anim ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ── hooks ───────────────────────────────────────────────────────────── */

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  const key = ids.join(',')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  return active
}

export function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const on = () => {
      const y = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > threshold)
      setProgress(total > 0 ? Math.min(1, y / total) : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [threshold])
  return { scrolled, progress }
}

export function useTyped(words: string[], enabled: boolean) {
  const list = words.filter(Boolean)
  const key = list.join('|')
  const [text, setText] = useState(enabled ? '' : list[0] ?? '')
  useEffect(() => {
    if (!list.length) return setText('')
    if (!enabled) return setText(list[0])
    let word = 0
    let ch = 0
    let deleting = false
    let timer: number
    const tick = () => {
      const w = list[word]
      if (deleting) {
        ch--
        setText(w.slice(0, ch))
        if (ch === 0) {
          deleting = false
          word = (word + 1) % list.length
          timer = window.setTimeout(tick, 500)
          return
        }
        timer = window.setTimeout(tick, 45)
      } else {
        ch++
        setText(w.slice(0, ch))
        if (ch === w.length) {
          deleting = true
          timer = window.setTimeout(tick, 2200)
          return
        }
        timer = window.setTimeout(tick, 85)
      }
    }
    timer = window.setTimeout(tick, 900)
    return () => window.clearTimeout(timer)
  }, [key, enabled])
  return text
}

/** Animates the leading number of a value like "1200+" or "1,420" when scrolled into view. */
export function Counter({ value }: { value: string }) {
  const { anim } = useSite()
  const m = value.match(/^(\D*)([\d,]+)(.*)$/)
  const target = m ? parseInt(m[2].replace(/,/g, ''), 10) : NaN
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState<number | null>(null)
  useEffect(() => {
    if (!anim || !m || !Number.isFinite(target)) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (t: number) => {
        const p = Math.min((t - start) / 1600, 1)
        setN(Math.floor((1 - (1 - p) ** 3) * target))
        if (p < 1) raf = requestAnimationFrame(step)
        else setN(null)
      }
      setN(0)
      raf = requestAnimationFrame(step)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [anim, value])
  if (!m || n === null) return <span ref={ref}>{value}</span>
  const useComma = m[2].includes(',')
  return (
    <span ref={ref}>
      {m[1]}
      {useComma ? n.toLocaleString('en-US') : n}
      {m[3]}
    </span>
  )
}

/* ── icons ───────────────────────────────────────────────────────────── */

export function BrandIcon({ icon, size = 18 }: { icon: LinkIcon; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true } as const
  switch (icon) {
    case 'github':
      return (
        <svg {...common}>
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'codeforces':
      return (
        <svg {...common}>
          <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3A1.5 1.5 0 0 1 0 19.5V9a1.5 1.5 0 0 1 1.5-1.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5v-15A1.5 1.5 0 0 1 10.5 3h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5h3z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      )
    case 'website':
      return <Globe size={size} aria-hidden />
    default:
      return <Link2 size={size} aria-hidden />
  }
}

export function ModeToggle({ className = '' }: { className?: string }) {
  const { mode, toggleMode, c } = useSite()
  if (!c.theme.effects.modeToggle) return null
  const dark = mode === 'dark'
  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-line text-muted hover:text-a1 hover:border-a1/60 transition-colors ${className}`}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}

/* ── the pixel cat (port of oneko) ───────────────────────────────────── */

const SPRITES: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
  tired: [[-3, -2]],
  sleeping: [[-2, 0], [-2, -1]],
  W: [[-4, -2], [-4, -3]],
}

export function Neko() {
  const { c, anim } = useSite()
  const anchor = useRef<HTMLSpanElement>(null)
  const enabled = c.theme.effects.cat && anim

  useEffect(() => {
    const host = anchor.current
    if (!enabled || !host) return
    const el = document.createElement('div')
    el.setAttribute('aria-hidden', 'true')
    el.title = 'meow'
    Object.assign(el.style, {
      width: '32px',
      height: '32px',
      position: 'fixed',
      cursor: 'pointer',
      imageRendering: 'pixelated',
      backgroundImage: 'url(/oneko.gif)',
      filter: 'sepia(1) saturate(5) hue-rotate(-15deg) brightness(1.1) contrast(1.2)',
      zIndex: '70',
    } satisfies Partial<CSSStyleDeclaration>)
    document.body.appendChild(el)

    let state: 'idle' | 'running' | 'gone' = 'idle'
    let x = 0
    let frame = 0
    let idleTime = 0
    let idleAnim: 'sleeping' | 'scratchSelf' = 'sleeping'
    let idleFrame = 0
    let last = 0
    let raf = 0

    const sprite = (name: string, f: number) => {
      const set = SPRITES[name]
      const [sx, sy] = set[f % set.length]
      el.style.backgroundPosition = `${sx * 32}px ${sy * 32}px`
    }
    const place = () => {
      if (state !== 'idle') return
      const r = host.getBoundingClientRect()
      x = r.left
      el.style.left = `${r.left}px`
      el.style.top = `${r.top}px`
      el.style.display = r.width ? 'block' : 'none'
    }
    const step = () => {
      frame++
      if (state === 'idle') {
        idleTime++
        if (idleTime > 50) {
          if (idleFrame === 0) idleAnim = Math.random() > 0.5 ? 'sleeping' : 'scratchSelf'
          if (idleAnim === 'sleeping') {
            sprite(idleFrame < 8 ? 'tired' : 'sleeping', Math.floor(idleFrame / 4))
            if (idleFrame++ > 100) idleFrame = idleTime = 0
          } else {
            sprite('scratchSelf', idleFrame)
            if (idleFrame++ > 9) idleFrame = idleTime = 0
          }
        } else sprite('idle', 0)
      } else if (state === 'running') {
        x -= 25
        sprite('W', frame)
        el.style.left = `${x}px`
        if (x < -40) {
          state = 'gone'
          el.style.display = 'none'
        }
      }
    }
    const loop = (t: number) => {
      if (t - last > 100) {
        last = t
        step()
      }
      raf = requestAnimationFrame(loop)
    }
    const onClick = () => {
      if (state === 'idle') {
        state = 'running'
        sprite('alert', 0)
      }
    }
    el.addEventListener('click', onClick)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, { passive: true })
    const ro = new ResizeObserver(place)
    ro.observe(document.body)
    place()
    sprite('idle', 0)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place)
      el.remove()
    }
  }, [enabled])

  if (!enabled) return null
  return <span ref={anchor} className="inline-block w-8 h-8 shrink-0" aria-hidden />
}

export function mailto(email: string) {
  return `mailto:${email}`
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}
