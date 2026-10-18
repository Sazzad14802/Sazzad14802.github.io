import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowRight, Download, Mail, Phone } from 'lucide-react'
import type { Section, SiteContent } from '../../lib/types'
import {
  BrandIcon,
  Counter,
  hostOf,
  ModeToggle,
  Neko,
  pad2,
  Reveal,
  RichText,
  telHref,
  useActiveSection,
  useScrolled,
  useSite,
  useTyped,
  visibleSections,
} from '../shared'

const wrap = 'max-w-[1120px] mx-auto px-4 sm:px-8'

function Heading({ n, s, mb = 'mb-14' }: { n: number; s: Section; mb?: string }) {
  return (
    <>
      <p className="font-mono text-[0.78rem] text-a1 uppercase tracking-[2.5px] mb-[0.9rem]">
        {pad2(n)} — {s.label}
      </p>
      <Reveal>
        <h2 className={`font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-1.5px] leading-[1.1] ${mb}`}>
          {s.title}
        </h2>
      </Reveal>
    </>
  )
}

/* ── matrix rain of CP symbols ─────────────────────────────────────── */

const POOL = ['0', '1', '0', '1', '0', '1', '{', '}', '[', ']', '(', ')', '+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '^', '&', '&&', '||', '==', '!=', '++', 'if', 'dp', 'n', 'i', 'j', 'k', '∑', '∀', '∈', '∞']

function hexToRgb(hex: string) {
  let h = hex.trim().replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return Number.isFinite(n) ? `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}` : '0,212,255'
}

function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { anim } = useSite()
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const pick = () => POOL[Math.floor(Math.random() * POOL.length)]
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const COL = 28
    const CH = 18
    type Stream = { x: number; y: number; speed: number; len: number; chars: string[] }
    let streams: Stream[] = []
    let raf = 0
    let running = false
    let rgb = '0,212,255'
    let frame = 0

    const build = () => {
      const r = canvas.parentElement!.getBoundingClientRect()
      canvas.width = r.width
      canvas.height = r.height
      streams = Array.from({ length: Math.ceil(canvas.width / COL) }, (_, i) => ({
        x: i * COL + COL / 2,
        y: rand(-canvas.height * 0.5, canvas.height),
        speed: rand(0.5, 1.4),
        len: Math.floor(rand(8, 22)),
        chars: Array.from({ length: 22 }, pick),
      }))
    }
    const draw = () => {
      if (frame++ % 60 === 0) rgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--a1'))
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `11px ${getComputedStyle(document.documentElement).getPropertyValue('--fm') || 'monospace'}`
      ctx.textAlign = 'center'
      for (const s of streams) {
        s.y += s.speed
        if (Math.random() < 0.004) s.chars[Math.floor(Math.random() * s.len)] = pick()
        if (s.y - s.len * CH > canvas.height) {
          s.y = rand(-200, -s.len * CH)
          s.speed = rand(0.5, 1.4)
          s.len = Math.floor(rand(8, 22))
        }
        for (let i = 0; i < s.len; i++) {
          const cy = s.y - i * CH
          if (cy < -CH || cy > canvas.height + CH) continue
          const fade = 1 - i / s.len
          ctx.fillStyle = `rgba(${rgb},${i === 0 ? Math.min(fade * 1.4, 0.8) : fade * 0.28})`
          ctx.fillText(s.chars[i], s.x, cy)
        }
      }
      if (running) raf = requestAnimationFrame(draw)
    }
    build()
    if (!anim) {
      // one static frame
      draw()
      return
    }
    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
    io.observe(canvas)
    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement!)
    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
    }
  }, [anim])
  return <canvas ref={ref} className="absolute inset-0 z-0" aria-hidden />
}

/* ── nav ───────────────────────────────────────────────────────────── */

function Nav({ sections }: { sections: Section[] }) {
  const { c } = useSite()
  const { scrolled, progress } = useScrolled(50)
  const active = useActiveSection(sections.map((s) => s.id))
  const [open, setOpen] = useState(false)
  const links = sections.filter((s) => s.id !== 'contact')
  const hasContact = sections.some((s) => s.id === 'contact')
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-bg/90 backdrop-blur-xl border-b border-line' : ''
        }`}
      >
        <div className={`flex items-center justify-between h-[68px] gap-4 ${wrap}`}>
          <div className="flex items-center gap-3">
            <Neko />
            <a href="#hero" className="font-mono text-xl font-bold tracking-tighter text-a1 hover:opacity-80 transition-opacity">
              &lt;{c.profile.initials}/&gt;
            </a>
          </div>
          <ul className="hidden md:flex items-center gap-5 lg:gap-8">
            {links.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-a1 after:transition-all ${
                    active === s.id ? 'text-fg after:w-full' : 'text-muted hover:text-fg after:w-0 hover:after:w-full'
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
            {hasContact && (
              <li>
                <a
                  href="#contact"
                  className="whitespace-nowrap text-sm font-semibold bg-a1 text-on-a1 px-5 py-[0.45rem] rounded-full hover:opacity-85 hover:-translate-y-px transition-all"
                >
                  Let’s Talk
                </a>
              </li>
            )}
          </ul>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="md:hidden flex flex-col gap-[5px] p-1"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-[22px] h-0.5 bg-fg rounded transition-all duration-300"
                  style={
                    open
                      ? i === 0
                        ? { transform: 'translateY(7px) rotate(45deg)' }
                        : i === 1
                          ? { opacity: 0, transform: 'scaleX(0)' }
                          : { transform: 'translateY(-7px) rotate(-45deg)' }
                      : undefined
                  }
                />
              ))}
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-gradient" style={{ width: `${progress * 100}%` }} />
      </nav>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/55 z-[150] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        className="fixed top-0 w-[260px] h-screen z-[200] bg-surface pt-[88px] px-8 pb-8 border-l border-line transition-[right] duration-300"
        style={{ right: open ? 0 : '-100%' }}
      >
        <ul className="flex flex-col gap-6">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={() => setOpen(false)} className="text-[1.05rem] font-medium text-muted hover:text-fg transition-colors">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

/* ── hero ──────────────────────────────────────────────────────────── */

function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="block w-full h-full rounded-full overflow-hidden border-[0.03em] border-a1/70 bg-gradient-to-br from-a1/25 to-a2/25 shadow-[0_0_0.4em_color-mix(in_oklab,var(--a1)_35%,transparent)]">
      {/* zoom toward the face — most photos are head-and-shoulders or wider */}
      <img src={src} alt={alt} className="block w-full h-full object-cover scale-[1.3] origin-[50%_22%]" />
    </span>
  )
}

/* The cutout photo stands on the last word of the name and fades into it,
   as wide as that word. Two fits (Profile → Cutout size):
   - full: the whole figure; the name moves down as far as needed to fit it.
   - bust: the text stays put; shows at least the top BUST of the figure
     (head and shoulders), getting narrower rather than cropping to a face.
   Sizes are in em of the heading so the photo scales with the text. */
const CUT_MIN = 1.3 // below this it looks lost; use the round fallback instead
const BUST = 0.6 // smallest share of the figure's height to show (bust fit)
const CLIMB = 1.6 // how far above the heading's top edge it may reach (bust fit)
const NAV_CLEAR = 84 // px from the page top kept free for the fixed nav
const SINK = 0.2 // how far the faded bottom sinks into the word
const FADE = 'linear-gradient(to bottom, #000 58%, transparent 97%)'

type Fit = 'full' | 'bust'

/* "Hi, I'm" + name with the cutout above the last word. Falls back to a small
   round photo after "Hi, I'm" when there is no gap above that word (one-word
   name, the name wraps, or the word sits under "Hi, I'm"). */
function HeroName({ name, cutout, photo, fit, style }: { name: string; cutout: string; photo: string; fit: Fit; style?: CSSProperties }) {
  const words = name.trim().split(/\s+/)
  const last = words.length > 1 ? words.pop()! : ''
  const lead = words.join(' ')
  const h1 = useRef<HTMLHeadingElement>(null)
  const hi = useRef<HTMLSpanElement>(null)
  const leadRef = useRef<HTMLSpanElement>(null)
  const lastRef = useRef<HTMLSpanElement>(null)
  // photo size in em, or null for the round fallback
  const [cut, setCut] = useState<{ w: number; h: number } | null>(null)
  // extra space above the heading (px) that the full fit needs
  const [push, setPush] = useState(0)
  const pushRef = useRef(0)
  const [aspect, setAspect] = useState(0.75)

  useEffect(() => {
    if (!cutout) return
    const im = new Image()
    im.onload = () => im.naturalHeight && setAspect(im.naturalWidth / im.naturalHeight)
    im.src = cutout
  }, [cutout])

  useLayoutEffect(() => {
    const el = h1.current
    const apply = (c: { w: number; h: number } | null, px = 0) => {
      setCut(c)
      pushRef.current = px
      setPush(px)
    }
    if (!el || !cutout || !last) return apply(null)
    const check = () => {
      const a = hi.current?.getBoundingClientRect()
      const l = leadRef.current?.getBoundingClientRect()
      const b = lastRef.current?.getBoundingClientRect()
      if (!a || !l || !b) return
      const fs = parseFloat(getComputedStyle(el).fontSize)
      // Inline and inline-block boxes have different heights, so compare centers.
      const sameLine = Math.abs(l.top + l.height / 2 - (b.top + b.height / 2)) < fs * 0.3
      // The photo rises through the "Hi, I'm" line, so it must be clear of it sideways.
      if (!sameLine || b.left < a.right + fs * 0.1) return apply(null)
      const badge = el.previousElementSibling?.getBoundingClientRect()
      const overBadge = (left: number, right: number) => !!badge && left < badge.right && right > badge.left

      if (fit !== 'bust') {
        const w = b.width
        const h = w / aspect
        // where the photo's top would be with no push
        const top = b.top - pushRef.current + fs * SINK - h
        let need = NAV_CLEAR - window.scrollY
        if (overBadge(b.left, b.right)) need = Math.max(need, badge!.bottom + 8)
        return apply({ w: w / fs, h: h / fs }, Math.max(0, Math.ceil(need - top)))
      }

      const ceiling = Math.max(el.getBoundingClientRect().top - pushRef.current - fs * CLIMB, NAV_CLEAR - window.scrollY)
      const bottom = b.top - pushRef.current + fs * SINK
      const mid = b.left + b.width / 2
      // Tallest first (never taller than the whole figure at full word width).
      for (let h = b.width / aspect; h >= fs * CUT_MIN; h -= fs * 0.05) {
        const w = Math.min(b.width, (h * aspect) / BUST)
        const box = { left: mid - w / 2, right: mid + w / 2, top: bottom - h, bottom }
        if (box.top >= ceiling && !(overBadge(box.left, box.right) && box.top < badge!.bottom)) return apply({ w: w / fs, h: h / fs })
      }
      apply(null)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    // positions shift while the entrance animation runs
    const host = el.parentElement
    host?.addEventListener('animationend', check)
    document.fonts?.ready.then(check)
    document.fonts?.addEventListener('loadingdone', check)
    return () => {
      ro.disconnect()
      host?.removeEventListener('animationend', check)
      document.fonts?.removeEventListener('loadingdone', check)
    }
  }, [name, cutout, last, aspect, fit])

  const small = photo || cutout
  return (
    <h1
      ref={h1}
      className="isolate font-display text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[1.02] tracking-[-0.03em] mb-5 break-words"
      style={{ ...style, marginTop: push || undefined }}
    >
      <span className="block">
        <span ref={hi}>Hi, I’m</span>
        {small && !cut && (
          <span className="inline-block align-middle w-[0.9em] h-[0.9em] ml-[0.25em] -mt-[0.14em]">
            <Avatar src={small} alt={name} />
          </span>
        )}
      </span>
      <span className="block text-gradient pb-1">
        <span ref={leadRef}>{lead || name}</span>
        {last && (
          <>
            {' '}
            <span ref={lastRef} className="relative inline-block">
              {last}
              {cutout && cut && (
                <img
                  src={cutout}
                  alt={name}
                  className="absolute left-1/2 -translate-x-1/2 max-w-none -z-10 object-cover object-top pointer-events-none select-none"
                  style={{ width: `${cut.w}em`, height: `${cut.h}em`, bottom: `calc(100% - ${SINK}em)`, maskImage: FADE, WebkitMaskImage: FADE }}
                />
              )}
            </span>
          </>
        )}
      </span>
    </h1>
  )
}

function Hero({ c, hasProjects }: { c: SiteContent; hasProjects: boolean }) {
  const { anim } = useSite()
  const p = c.profile
  const typed = useTyped(p.typedRoles, anim)
  const fade = (d: number) => (anim ? { animation: `rise 0.8s ease ${d}s both` } : undefined)
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {c.theme.effects.background && <MatrixRain />}
      <div className="absolute rounded-full pointer-events-none z-0 blur-[110px] w-[640px] h-[640px] bg-a1/[0.07] -top-[220px] -left-[180px]" />
      <div className="absolute rounded-full pointer-events-none z-0 blur-[110px] w-[520px] h-[520px] bg-a2/[0.07] -bottom-[200px] -right-[100px]" />
      <div className={`relative z-10 w-full pt-[120px] sm:pt-[140px] ${p.cutoutFit === 'bust' && (p.cutout || p.photo) ? 'lg:pt-[180px]' : ''} pb-[100px] ${wrap}`}>
        {/* shrink to the widest line (usually the name) and center that block;
            text inside stays left-aligned */}
        <div className="w-fit max-w-full mx-auto">
          {p.availability && (
            <div
              className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full text-[0.8rem] font-medium text-a1 mb-8 bg-a1/[0.08] border border-a1/25"
              style={fade(0.2)}
            >
              <span className="pulse-dot w-2 h-2 rounded-full bg-a1 shrink-0" />
              {p.availability}
            </div>
          )}
          <HeroName name={p.name} cutout={p.cutout || p.photo} photo={p.photo} fit={p.cutoutFit} style={fade(0.35)} />
          {p.typedRoles.length > 0 && (
            <p className="font-mono text-[clamp(1rem,2.5vw,1.35rem)] text-muted mb-4 min-h-[1.6em]" style={fade(0.5)}>
              I <span className="text-a1">{typed}</span>
              <span className="text-a1 cursor-blink">|</span>
            </p>
          )}
          {p.headline && (
            <p className="max-w-[540px] text-[1.05rem] text-muted leading-[1.75] mb-10" style={fade(0.65)}>
              <RichText text={p.headline} />
            </p>
          )}
          <div className="flex gap-4 flex-wrap mb-14" style={fade(0.8)}>
            {hasProjects && (
              <a
                href="#projects"
                className="inline-flex items-center gap-2 bg-a1 text-on-a1 font-semibold px-[1.6rem] py-[0.72rem] rounded-lg text-[0.9rem] hover:opacity-90 hover:-translate-y-0.5 transition-all"
              >
                Explore Work <ArrowRight size={16} />
              </a>
            )}
            {p.resume && (
              <a
                href={p.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-line font-semibold px-[1.6rem] py-[0.72rem] rounded-lg text-[0.9rem] hover:border-a1 hover:text-a1 hover:-translate-y-0.5 transition-all"
              >
                <Download size={16} /> Resume
              </a>
            )}
          </div>
          {p.stats.length > 0 && (
            <div className="flex items-center gap-x-8 gap-y-6 flex-wrap" style={fade(0.95)}>
              {p.stats.map((st, i) => (
                <div key={i} className="flex items-center gap-8">
                  {i > 0 && <span className="w-px h-9 bg-line hidden sm:block" />}
                  <div className="text-center">
                    <span className="block font-display text-[2.1rem] font-extrabold leading-none">
                      <Counter value={st.value} />
                    </span>
                    <span className="block text-[0.72rem] text-muted uppercase tracking-[1px] mt-[5px]">{st.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── sections ──────────────────────────────────────────────────────── */

function Shell({ id, alt, children }: { id: string; alt: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`relative py-20 md:py-[120px] ${alt ? 'bg-surface' : 'bg-bg'}`}>
      <div className={wrap}>{children}</div>
    </section>
  )
}

function About({ c }: { c: SiteContent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
      <Reveal>
        {c.about.paragraphs.map((p, i) => (
          <p key={i} className="text-muted text-[1.025rem] leading-[1.8] mb-5">
            <RichText text={p} />
          </p>
        ))}
        {c.contact.links.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-8">
            {c.contact.links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-[7px] px-4 py-[0.45rem] border border-line rounded-lg text-[0.85rem] font-medium text-muted hover:border-a1 hover:text-a1 hover:-translate-y-0.5 transition-all"
              >
                <BrandIcon icon={l.icon} size={16} /> {l.label}
              </a>
            ))}
          </div>
        )}
      </Reveal>
      <Reveal delay={100}>
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 gap-4">
          {c.about.facts.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-panel border border-line rounded-xl p-[1.2rem] hover:border-a1/25 hover:-translate-y-[3px] transition-all"
            >
              {f.icon && <span className="text-[1.65rem] shrink-0">{f.icon}</span>}
              <div className="min-w-0">
                <span className="block font-semibold text-[0.88rem] mb-[3px]">{f.title}</span>
                <span className="block text-[0.75rem] text-muted">{f.text}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

const TAG_VARIANTS = [
  'bg-panel border-line text-fg',
  'bg-a1/[0.08] border-a1/25 text-a1',
  'bg-a2/[0.08] border-a2/25 text-a2',
  'bg-a3/[0.08] border-a3/25 text-a3',
]

function Skills({ c }: { c: SiteContent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {c.skills.map((g, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className="bg-panel border border-line rounded-xl p-[1.6rem] h-full hover:border-a1/20 transition-colors">
            <h3 className="text-[0.75rem] font-bold uppercase tracking-[2px] text-muted mb-4">{g.group}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <span
                  key={it}
                  className={`inline-flex items-center px-[0.8rem] py-[0.32rem] rounded-md text-[0.8rem] font-medium border hover:-translate-y-0.5 transition-transform ${TAG_VARIANTS[i % 4]}`}
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function Projects({ c }: { c: SiteContent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {c.projects.map((p, i) => (
        <Reveal key={i} delay={(i % 3) * 80} className={p.featured ? 'md:col-span-2' : ''}>
          <div className="pcard bg-panel border border-line rounded-xl p-[1.6rem] h-full flex flex-col hover:border-a1/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[0.7rem] text-a1 font-medium mr-auto">{pad2(i + 1)}</span>
              {p.icon && <span className="text-[1.4rem]">{p.icon}</span>}
              {p.tag && (
                <span className="text-[0.68rem] font-semibold px-[9px] py-[2px] rounded-full text-a2 bg-a2/[0.12] border border-a2/30">
                  {p.tag}
                </span>
              )}
            </div>
            <h3 className="text-[1rem] font-bold leading-[1.3] mb-3">{p.title}</h3>
            <p className="text-[0.85rem] text-muted leading-[1.7] mb-4">{p.description}</p>
            <div className="flex flex-wrap gap-[0.4rem] mb-4">
              {p.stack.map((t) => (
                <span key={t} className="font-mono text-[0.7rem] font-medium px-2 py-[3px] rounded text-a1 bg-a1/[0.07] border border-a1/15">
                  {t}
                </span>
              ))}
            </div>
            {p.features.length > 0 && (
              <ul className="flex flex-col gap-1 mb-4">
                {p.features.map((f, j) => (
                  <li key={j} className="text-[0.8rem] text-muted pl-4 relative">
                    <span className="absolute left-0 text-a3 text-[0.7rem]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {(p.link || p.repo) && (
              <div className="mt-auto pt-2 flex gap-4 text-[0.8rem] font-semibold">
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-a1 hover:underline">
                    Live demo ↗
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="text-muted hover:text-a1 inline-flex items-center gap-1.5">
                    <BrandIcon icon="github" size={14} /> Source
                  </a>
                )}
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function RatingCard({ c }: { c: SiteContent }) {
  const r = c.achievements.rating
  const [w, setW] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const pct = r.max > 0 ? Math.max(0, Math.min(100, (r.rating / r.max) * 100)) : 0
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setW(pct)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [pct])
  return (
    <div ref={ref} className="rounded-xl p-8 border border-a1/20 bg-gradient-to-br from-a1/5 to-a2/5">
      <div className="flex justify-between items-center gap-3 mb-6">
        <span className="text-[0.72rem] font-bold uppercase tracking-[2.5px] text-muted">{r.platform}</span>
        {r.url ? (
          <a href={r.url} target="_blank" rel="noreferrer" className="font-mono text-[0.78rem] text-a1 hover:underline truncate">
            @{r.handle}
          </a>
        ) : (
          <span className="font-mono text-[0.78rem] text-a1 truncate">@{r.handle}</span>
        )}
      </div>
      <div className="font-display text-[5.5rem] font-black leading-none text-center mb-2 text-gradient">{r.rating}</div>
      <div className="text-center text-[0.85rem] font-bold text-a1 uppercase tracking-[3px] mb-7">{r.rank}</div>
      <div className="h-[5px] rounded-full overflow-hidden mb-[0.6rem] bg-line">
        <div className="h-full bg-gradient rounded-full transition-[width] duration-[1600ms] ease-out" style={{ width: `${w}%` }} />
      </div>
      <div className="flex justify-between text-[0.68rem] text-muted">
        <span>0</span>
        <span>{r.rank} tier</span>
        <span>{r.max}</span>
      </div>
    </div>
  )
}

function Achievements({ c }: { c: SiteContent }) {
  const a = c.achievements
  const cards = [
    ...a.items.map((it) => ({ icon: it.icon, big: it.metric, title: it.label, text: it.detail })),
    ...a.leadership.map((l) => ({ icon: '🎙️', big: l.role, title: l.org, text: l.description, small: true })),
  ]
  return (
    <>
      <div className={`grid grid-cols-1 gap-6 mb-8 items-start ${a.rating.enabled ? 'lg:grid-cols-[300px_1fr]' : ''}`}>
        {a.rating.enabled && (
          <Reveal>
            <RatingCard c={c} />
          </Reveal>
        )}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
          {cards.map((k, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="bg-panel border border-line rounded-xl p-5 h-full hover:border-a1/20 hover:-translate-y-[3px] transition-all">
                {k.icon && <div className="text-[1.4rem] mb-3">{k.icon}</div>}
                <div className={`font-display font-extrabold leading-[1.15] mb-1 ${'small' in k ? 'text-[1.3rem]' : 'text-[2.1rem]'}`}>
                  {'small' in k ? k.big : <Counter value={k.big} />}
                </div>
                <div className="font-semibold text-[0.88rem] mb-1">{k.title}</div>
                {k.text && <div className="text-[0.75rem] text-muted leading-[1.5]">{k.text}</div>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      {a.tags.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {a.tags.map((t) => (
            <span key={t} className="px-4 py-[0.38rem] border border-line rounded-full text-[0.8rem] font-medium text-muted hover:border-a1 hover:text-a1 transition-colors">
              {t}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

function Education({ c }: { c: SiteContent }) {
  return (
    <div className="relative pl-9 max-w-[720px]">
      <div className="absolute top-1.5 bottom-0 left-1.5 w-0.5 rounded bg-gradient-to-b from-a1 via-a2 to-transparent" />
      {c.education.map((e, i) => (
        <Reveal key={i} className={i < c.education.length - 1 ? 'mb-12' : ''}>
          <div className="relative">
            <div
              className="absolute top-1 -left-9 w-[14px] h-[14px] rounded-full bg-bg border-2 border-a1 translate-x-px"
              style={{ boxShadow: '0 0 10px color-mix(in oklab, var(--a1) 45%, transparent)' }}
            />
            <span className="block font-mono text-[0.78rem] text-a1 tracking-[1px] mb-[0.45rem]">{e.period}</span>
            <h3 className="text-[1.1rem] font-bold mb-1">{e.degree}</h3>
            <p className="text-[0.9rem] text-muted mb-1">{e.institution}</p>
            {e.score && <p className="font-mono text-[0.78rem] text-a1/80">{e.score}</p>}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function ContactCard({ href, icon, label, value }: { href: string; icon: ReactNode; label: string; value: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="flex items-center gap-4 bg-panel border border-line rounded-xl p-[1.4rem] hover:border-a1/30 hover:-translate-y-[3px] transition-all min-w-0"
    >
      <div className="w-11 h-11 flex items-center justify-center rounded-[10px] text-a1 shrink-0 bg-a1/[0.07] border border-a1/15">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[0.72rem] text-muted uppercase tracking-[0.5px] mb-[3px]">{label}</div>
        <div className="text-[0.875rem] font-medium truncate">{value}</div>
      </div>
    </a>
  )
}

function Contact({ c }: { c: SiteContent }) {
  const ct = c.contact
  return (
    <>
      {ct.message && (
        <Reveal>
          <p className="text-muted text-[1.05rem] max-w-[480px] leading-[1.75] mb-11">{ct.message}</p>
        </Reveal>
      )}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[680px]">
          {ct.email && <ContactCard href={`mailto:${ct.email}`} icon={<Mail size={18} />} label="Email" value={ct.email} />}
          {ct.links.map((l, i) => (
            <ContactCard key={i} href={l.url} icon={<BrandIcon icon={l.icon} size={18} />} label={l.label} value={hostOf(l.url)} />
          ))}
          {ct.showPhone && ct.phone && <ContactCard href={telHref(ct.phone)} icon={<Phone size={18} />} label="Phone" value={ct.phone} />}
        </div>
      </Reveal>
    </>
  )
}

export default function Neon() {
  const { c } = useSite()
  const sections = visibleSections(c)
  const body: Record<Section['id'], (c: SiteContent) => ReactNode> = {
    about: (c) => <About c={c} />,
    skills: (c) => <Skills c={c} />,
    projects: (c) => <Projects c={c} />,
    achievements: (c) => <Achievements c={c} />,
    education: (c) => <Education c={c} />,
    contact: (c) => <Contact c={c} />,
  }
  return (
    <div
      className={`min-h-screen bg-bg text-fg font-body leading-relaxed overflow-x-clip ${c.theme.effects.background ? 'grain' : ''}`}
      style={
        c.theme.effects.background
          ? {
              backgroundImage:
                'linear-gradient(color-mix(in oklab, var(--a1) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--a1) 5%, transparent) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }
          : undefined
      }
    >
      <Nav sections={sections} />
      <main>
        <Hero c={c} hasProjects={sections.some((s) => s.id === 'projects')} />
        {sections.map((s, i) => (
          <Shell key={s.id} id={s.id} alt={i % 2 === 0}>
            <Heading n={i + 1} s={s} mb={s.id === 'contact' ? 'mb-6' : 'mb-14'} />
            {body[s.id](c)}
          </Shell>
        ))}
      </main>
      <footer className="border-t border-line py-7 bg-bg">
        <div className={`flex items-center justify-between flex-wrap gap-4 ${wrap}`}>
          <span className="font-mono text-[1rem] text-a1">&lt;{c.profile.initials}/&gt;</span>
          <span className="text-[0.82rem] text-muted">
            {c.footer || c.profile.name} © {new Date().getFullYear()}
          </span>
          <a href="#hero" className="text-[0.82rem] text-muted hover:text-a1 transition-colors">
            ↑ Back to top
          </a>
        </div>
      </footer>
    </div>
  )
}
