import { useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import type { Section, SiteContent } from '../../lib/types'
import {
  BrandIcon,
  camel,
  ModeToggle,
  Neko,
  pad2,
  pascal,
  Reveal,
  RichText,
  telHref,
  useActiveSection,
  useSite,
  visibleSections,
} from '../shared'

const ACCENTS = ['var(--a1)', 'var(--a2)', 'var(--a3)', 'var(--a4)']
const accentText = ['text-a1', 'text-a2', 'text-a3', 'text-a4']

function Label({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-sm text-a1">{pad2(index)}</span>
      <span className="h-px w-8 bg-line" />
      <h2 className="font-mono text-sm tracking-[0.25em] uppercase text-muted">{children}</h2>
    </div>
  )
}

function Nav({ sections }: { sections: Section[] }) {
  const { c } = useSite()
  const active = useActiveSection(sections.map((s) => s.id))
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-bg/75 border-b border-line">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-mono font-semibold tracking-tight min-w-0">
          <Neko />
          <span className="truncate">
            <span className="text-a1">~/</span>
            {c.profile.logo}
            <span className="text-muted">.dev</span>
          </span>
        </a>
        <ul className="hidden md:flex items-center gap-7 font-mono text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`lowercase transition-colors ${active === s.id ? 'text-a1' : 'text-muted hover:text-fg'}`}
              >
                <span className="text-line">/</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {c.profile.resume && (
            <a
              href={c.profile.resume}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-block font-mono text-sm px-4 py-2 rounded-md border border-a1/40 text-a1 hover:bg-a1 hover:text-on-a1 transition-colors"
            >
              resume ↓
            </a>
          )}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-line text-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-t border-line bg-bg/95 px-4 py-4 font-mono text-sm">
          <ul className="flex flex-col gap-3">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={() => setOpen(false)} className="lowercase text-muted hover:text-a1">
                  <span className="text-line">/</span>
                  {s.label}
                </a>
              </li>
            ))}
            {c.profile.resume && (
              <li>
                <a href={c.profile.resume} target="_blank" rel="noreferrer" className="text-a1">
                  resume ↓
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}

function Hero({ c, hasProjects, hasContact }: { c: SiteContent; hasProjects: boolean; hasContact: boolean }) {
  const words = c.profile.name.trim().split(/\s+/)
  const first = words[0] ?? ''
  const rest = words.slice(1).join(' ')
  const p = c.profile
  return (
    <section className={`pt-32 sm:pt-36 pb-20 sm:pb-24 grid gap-12 lg:gap-14 items-center ${p.photo ? 'lg:grid-cols-[1.35fr_1fr]' : ''}`}>
      <div className="rise min-w-0">
        {p.role && (
          <p className="font-mono text-sm text-a2 mb-6 break-words">
            <span className="text-muted">const</span> role = <span className="text-a4">&quot;{p.role}&quot;</span>
          </p>
        )}
        <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-[clamp(2.6rem,7vw,5.2rem)] break-words">
          {first}
          {rest && <br />}
          {rest}
          <span className="text-a1">.</span>
        </h1>
        {p.headline && (
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            <RichText text={p.headline} strongClass="text-fg font-normal" />
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          {hasProjects && (
            <a href="#projects" className="font-mono text-sm px-5 py-3 rounded-md bg-a1 text-on-a1 font-semibold hover:brightness-110 transition">
              view projects →
            </a>
          )}
          {hasContact && (
            <a href="#contact" className="font-mono text-sm px-5 py-3 rounded-md border border-line hover:border-fg/40 transition-colors">
              get in touch
            </a>
          )}
        </div>
        {p.highlights.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-muted">
            {p.highlights.map((h, i) => (
              <span key={i}>
                <span className={accentText[i % 4]}>◈</span> {h}
              </span>
            ))}
          </div>
        )}
      </div>

      {p.photo && (
        <div className="relative floaty max-w-md w-full mx-auto lg:max-w-none">
          <div
            className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
            style={{ background: 'radial-gradient(circle at 30% 20%, var(--a1), transparent 60%)' }}
          />
          <div className="relative rounded-2xl border border-line bg-panel p-2 shadow-2xl">
            <div className="flex items-center gap-1.5 px-2 py-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-muted truncate">{p.logo || 'me'}.png</span>
            </div>
            <div
              className="overflow-hidden rounded-xl"
              style={{ background: 'linear-gradient(160deg, color-mix(in oklab, var(--a2) 22%, var(--panel)), var(--panel))' }}
            >
              <img src={p.photo} alt={p.name} className="w-full aspect-square object-cover" />
            </div>
            <div className="px-3 py-3 font-mono text-xs text-muted flex justify-between gap-3">
              <span className="truncate">{p.handle}</span>
              {p.status && <span className="text-a1 shrink-0">status: {p.status} ●</span>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function Marquee({ words }: { words: string[] }) {
  if (!words.length) return null
  return (
    <div className="border-y border-line bg-panel/40 py-4 overflow-hidden" aria-hidden>
      <div className="marquee flex w-max whitespace-nowrap font-mono text-sm text-muted">
        {[0, 1].map((r) => (
          <div key={r} className="flex">
            {words.map((w, i) => (
              <span key={i} className="mx-6 flex items-center gap-6">
                {w} <span className="text-a1">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function About({ c, s, n }: { c: SiteContent; s: Section; n: number }) {
  return (
    <section id="about" className="py-20 sm:py-24 grid lg:grid-cols-[1fr_1.1fr] gap-12">
      <Reveal>
        <Label index={n}>{s.label}</Label>
        <p className="text-2xl font-display font-semibold leading-snug max-w-md">{s.title}</p>
        <div className="mt-6 space-y-4 text-muted leading-relaxed max-w-lg">
          {c.about.paragraphs.map((p, i) => (
            <p key={i}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      </Reveal>
      {c.about.facts.length > 0 && (
        <Reveal delay={120}>
          <div className="rounded-xl border border-line bg-panel p-5 sm:p-6 font-mono text-sm leading-7 overflow-x-auto">
            <p className="text-muted whitespace-nowrap">
              <span className="text-a3">class</span> <span className="text-a2">{pascal(c.profile.name)}</span> {'{'}
            </p>
            {c.about.facts.map((f, i) => (
              <p key={i} className="pl-6 whitespace-nowrap">
                <span className="text-a4">{camel(f.title)}</span> = <span className="text-a1">&quot;{f.text}&quot;</span>;
              </p>
            ))}
            <p className="text-muted">{'}'}</p>
          </div>
        </Reveal>
      )}
    </section>
  )
}

function Skills({ c, s, n }: { c: SiteContent; s: Section; n: number }) {
  return (
    <section id="skills" className="py-20 sm:py-24">
      <Reveal>
        <Label index={n}>{s.label}</Label>
        <h3 className="sr-only">{s.title}</h3>
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-5">
        {c.skills.map((g, i) => (
          <Reveal key={i} delay={i * 90}>
            <div className="group rounded-xl border border-line bg-panel p-6 h-full hover:border-fg/25 transition-colors">
              <div className={`font-mono text-xs uppercase tracking-widest ${accentText[i % 4]} mb-4`}>
                ./{g.group.toLowerCase().replace(/\s+/g, '-')}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span key={it} className="font-mono text-sm px-3 py-1.5 rounded-md border border-line bg-panel-2 text-fg/90">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Projects({ c, s, n }: { c: SiteContent; s: Section; n: number }) {
  return (
    <section id="projects" className="py-20 sm:py-24">
      <Reveal>
        <Label index={n}>{s.label}</Label>
      </Reveal>
      <div className="space-y-4">
        {c.projects.map((p, i) => {
          const href = p.link || p.repo
          return (
            <Reveal key={i} delay={i * 60}>
              <article
                className="group grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 items-start rounded-xl border border-line bg-panel p-5 sm:p-6 hover:bg-panel-2 transition-colors"
                style={{ borderLeft: `3px solid ${ACCENTS[i % 4]}` }}
              >
                <span className="font-mono text-sm text-muted md:pt-1">{pad2(i + 1)}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                    {p.tag && <span className="font-mono text-xs text-muted">// {p.tag}</span>}
                  </div>
                  <p className="mt-3 max-w-2xl text-muted leading-relaxed">{p.description}</p>
                  {p.features.length > 0 && (
                    <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted">
                      {p.features.map((f, j) => (
                        <li key={j}>
                          <span style={{ color: ACCENTS[i % 4] }}>›</span> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {p.stack.map((t) => (
                      <span key={t} className="font-mono text-xs px-2.5 py-1 rounded border border-line text-fg/80">
                        {t}
                      </span>
                    ))}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="font-mono text-xs text-a1 hover:underline ml-1">
                        live ↗
                      </a>
                    )}
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noreferrer" className="font-mono text-xs text-a2 hover:underline ml-1">
                        source ↗
                      </a>
                    )}
                  </div>
                </div>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${p.title}`}
                    className="hidden md:block font-mono text-2xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: ACCENTS[i % 4] }}
                  >
                    ↗
                  </a>
                ) : (
                  <span className="hidden md:block font-mono text-sm text-muted/60 pt-1">{p.icon}</span>
                )}
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Achievements({ c, s, n }: { c: SiteContent; s: Section; n: number }) {
  const a = c.achievements
  const r = a.rating
  const pct = r.max > 0 ? Math.max(0, Math.min(100, (r.rating / r.max) * 100)) : 0
  return (
    <section id="achievements" className="py-20 sm:py-24">
      <Reveal>
        <Label index={n}>{s.label}</Label>
      </Reveal>
      {r.enabled && (
        <Reveal>
          <a
            href={r.url || undefined}
            target="_blank"
            rel="noreferrer"
            className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 rounded-xl border border-a1/30 bg-panel p-6 hover:border-a1/60 transition-colors"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted">{r.platform}</div>
              <div className="font-display text-5xl font-extrabold text-a1 leading-none mt-2">{r.rating}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between font-mono text-xs text-muted mb-2">
                <span className="text-fg">{r.rank}</span>
                <span>@{r.handle}</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <div className="h-full bg-gradient rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between font-mono text-[11px] text-muted mt-2">
                <span>0</span>
                <span>{r.max}</span>
              </div>
            </div>
          </a>
        </Reveal>
      )}
      {a.items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {a.items.map((it, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="rounded-xl border border-line bg-panel p-6 h-full">
                <div className="font-display text-4xl font-extrabold text-a1">{it.metric}</div>
                <div className="mt-3 text-sm text-fg">{it.label}</div>
                {it.detail && <div className="mt-1 text-sm text-muted leading-snug">{it.detail}</div>}
              </div>
            </Reveal>
          ))}
        </div>
      )}
      {a.leadership.map((l, i) => (
        <Reveal key={i} delay={120}>
          <div className="mt-4 rounded-xl border border-line bg-panel-2 p-6 flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-a4">leadership</span>
            <p className="text-muted">
              <span className="text-fg">{l.role}</span>
              {l.org && <> at {l.org}</>}
              {l.description && <> — {l.description}</>}
            </p>
          </div>
        </Reveal>
      ))}
      {a.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
          {a.tags.map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-full border border-line text-muted">
              {t}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}

function Education({ c, s, n }: { c: SiteContent; s: Section; n: number }) {
  return (
    <section id="education" className="py-20 sm:py-24">
      <Reveal>
        <Label index={n}>{s.label}</Label>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-4">
        {c.education.map((e, i) => (
          <Reveal key={i} delay={i * 90}>
            <div className="rounded-xl border border-line bg-panel p-6 h-full font-mono text-sm">
              <div className={accentText[i % 4]}>{e.period}</div>
              <div className="mt-3 font-display text-lg font-semibold text-fg leading-snug">{e.degree}</div>
              <div className="mt-1 text-muted">{e.institution}</div>
              {e.score && <div className="mt-4 text-xs text-fg/80">{e.score}</div>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Contact({ c, s, n }: { c: SiteContent; s: Section; n: number }) {
  const ct = c.contact
  return (
    <section id="contact" className="py-20 sm:py-24">
      <Reveal>
        <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8 md:p-14 text-center relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full blur-3xl opacity-30"
            style={{ background: 'var(--a1)' }}
          />
          <div className="relative flex justify-center">
            <Label index={n}>{s.label}</Label>
          </div>
          <h2 className="relative font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            {s.title.replace(/[.!]$/, '')}
            <span className="text-a1">.</span>
          </h2>
          {ct.message && <p className="relative mt-5 text-muted max-w-lg mx-auto">{ct.message}</p>}
          <div className="relative mt-9 flex flex-wrap justify-center gap-3 font-mono text-sm">
            {ct.email && (
              <a href={`mailto:${ct.email}`} className="px-5 py-3 rounded-md bg-a1 text-on-a1 font-semibold hover:brightness-110 transition break-all">
                {ct.email}
              </a>
            )}
            {ct.showPhone && ct.phone && (
              <a href={telHref(ct.phone)} className="px-5 py-3 rounded-md border border-line hover:border-fg/40 transition-colors">
                {ct.phone}
              </a>
            )}
            {ct.links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-line hover:border-fg/40 transition-colors"
              >
                <BrandIcon icon={l.icon} size={15} />
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Terminal() {
  const { c } = useSite()
  const sections = visibleSections(c)
  const has = (id: string) => sections.some((s) => s.id === id)
  const render = (s: Section, i: number) => {
    const props = { c, s, n: i + 1 }
    switch (s.id) {
      case 'about': return <About key={s.id} {...props} />
      case 'skills': return <Skills key={s.id} {...props} />
      case 'projects': return <Projects key={s.id} {...props} />
      case 'achievements': return <Achievements key={s.id} {...props} />
      case 'education': return <Education key={s.id} {...props} />
      case 'contact': return <Contact key={s.id} {...props} />
    }
  }
  return (
    <div className="min-h-screen bg-bg text-fg font-body overflow-x-clip">
      {c.theme.effects.background && (
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, #000 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, #000 20%, transparent 75%)',
          }}
        />
      )}
      <Nav sections={sections} />
      <div id="top" className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Hero c={c} hasProjects={has('projects')} hasContact={has('contact')} />
      </div>
      <Marquee words={c.profile.keywords} />
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6">{sections.map(render)}</main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-muted">
          <span>
            © {new Date().getFullYear()} {c.footer || c.profile.name}
          </span>
          {c.profile.status && (
            <span className="flex items-center gap-2">
              <span className="cursor-blink text-a1">▮</span> {c.profile.status}
            </span>
          )}
        </div>
      </footer>
    </div>
  )
}
