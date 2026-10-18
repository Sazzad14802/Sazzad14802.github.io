import { useState, type ReactNode } from 'react'
import { ArrowRight, Download, ExternalLink, Mail, Menu, Phone, X } from 'lucide-react'
import type { Section, SiteContent } from '../../lib/types'
import {
  BrandIcon,
  ModeToggle,
  Neko,
  Reveal,
  RichText,
  telHref,
  useActiveSection,
  useScrolled,
  useSite,
  visibleSections,
} from '../shared'

const wrap = 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'
const glass = 'bg-panel/70 backdrop-blur-md border border-fg/[0.07]'
const card = `${glass} rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-a1/30 hover:shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--a1)_35%,transparent)]`
const iconTint = ['text-a1', 'text-a2', 'text-a3', 'text-a4']

function Title({ s }: { s: Section }) {
  const words = s.title.split(' ')
  const last = words.pop()
  return (
    <Reveal className="text-center mb-14 md:mb-16">
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
        {words.join(' ')} <span className="text-a1">{last}</span>
      </h2>
      <div className="w-20 h-1 bg-gradient mx-auto rounded-full" />
    </Reveal>
  )
}

function Nav({ sections }: { sections: Section[] }) {
  const { c } = useSite()
  const { scrolled } = useScrolled(20)
  const active = useActiveSection(sections.map((s) => s.id))
  const [open, setOpen] = useState(false)
  const links = sections.filter((s) => s.id !== 'contact')
  const social = (size: number) => (
    <>
      {c.contact.links.slice(0, 3).map((l, i) => (
        <a key={i} href={l.url} target="_blank" rel="noreferrer" aria-label={l.label} className="text-muted hover:text-a1 transition-colors">
          <BrandIcon icon={l.icon} size={size} />
        </a>
      ))}
      {c.contact.email && (
        <a href={`mailto:${c.contact.email}`} aria-label="Email" className="text-muted hover:text-a1 transition-colors">
          <Mail size={size} />
        </a>
      )}
    </>
  )
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || open ? `${glass} py-3 shadow-lg` : 'py-5'}`}>
      <div className={`${wrap} flex justify-between items-center gap-4`}>
        <a href="#home" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tighter text-gradient uppercase">
          <Neko />
          {c.profile.logo}.
        </a>
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-7">
            {links.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={`text-sm font-medium transition-colors ${active === s.id ? 'text-a1' : 'text-fg/80 hover:text-a1'}`}>
                {s.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 border-l border-line pl-6">
            {social(19)}
            <ModeToggle />
          </div>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <button type="button" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="text-fg/80 p-1">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden mt-3 border-t border-line">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-fg/80 hover:text-a1 hover:bg-panel-2">
                {s.label}
              </a>
            ))}
            <div className="flex gap-5 px-3 pt-4 mt-3 border-t border-line">{social(22)}</div>
          </div>
        </div>
      )}
    </nav>
  )
}

function Hero({ c, hasProjects }: { c: SiteContent; hasProjects: boolean }) {
  const p = c.profile
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {c.theme.effects.background && (
        <>
          <div className="blob absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-a1/20 rounded-full blur-3xl opacity-50" />
          <div className="blob absolute top-1/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-a2/20 rounded-full blur-3xl opacity-50" style={{ animationDelay: '-4s' }} />
          <div className="blob absolute bottom-1/4 left-1/3 w-72 h-72 sm:w-96 sm:h-96 bg-a3/20 rounded-full blur-3xl opacity-50" style={{ animationDelay: '-8s' }} />
        </>
      )}
      <div className={`relative z-10 ${wrap} text-center rise`}>
        {p.photo && (
          <img
            src={p.photo}
            alt={p.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mx-auto mb-8 border-2 border-a1/40 shadow-[0_0_40px_color-mix(in_oklab,var(--a1)_30%,transparent)] bg-panel"
          />
        )}
        {p.role && (
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${glass} border-a1/30 text-a1 text-sm font-medium mb-8`}>
            <span className="pulse-dot w-2 h-2 rounded-full bg-a1 mr-2" />
            {p.role}
          </div>
        )}
        <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold tracking-tight mb-6 leading-[1.1]">
          Hi, I’m <span className="text-gradient">{p.name}</span>
        </h1>
        {p.headline && (
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-muted mb-10 leading-relaxed">
            <RichText text={p.headline} strongClass="text-fg font-medium" />
          </p>
        )}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          {hasProjects && (
            <a
              href="#projects"
              className="group px-8 py-3 bg-a1 text-on-a1 font-semibold rounded-lg transition-all duration-300 shadow-[0_0_20px_color-mix(in_oklab,var(--a1)_40%,transparent)] hover:shadow-[0_0_30px_color-mix(in_oklab,var(--a1)_60%,transparent)] flex items-center"
            >
              View Projects <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
          )}
          {p.resume && (
            <a href={p.resume} target="_blank" rel="noreferrer" className={`px-8 py-3 ${glass} font-medium rounded-lg transition-all flex items-center hover:border-a1/50`}>
              <Download className="mr-2" size={20} /> Resume
            </a>
          )}
        </div>
        {p.stats.length > 0 && (
          <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4">
            {p.stats.map((s, i) => (
              <div key={i}>
                <div className="font-display text-2xl font-bold">{s.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function About({ c }: { c: SiteContent }) {
  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
      <Reveal>
        <div className={`${glass} p-6 sm:p-8 rounded-2xl`}>
          <h3 className="font-display text-2xl font-bold mb-4">My Journey</h3>
          {c.about.paragraphs.map((p, i) => (
            <p key={i} className="text-muted leading-relaxed mb-4 last:mb-0">
              <RichText text={p} />
            </p>
          ))}
        </div>
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-4">
        {c.about.facts.map((f, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className={`${card} p-5 h-full`}>
              {f.icon && <div className="text-2xl mb-3">{f.icon}</div>}
              <div className="font-bold">{f.title}</div>
              <div className="text-sm text-muted mt-1">{f.text}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function Skills({ c }: { c: SiteContent }) {
  const cols = c.skills.length % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  return (
    <div className={`grid ${cols} gap-6 md:gap-8`}>
      {c.skills.map((g, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className={`${card} p-6 sm:p-8 h-full`}>
            <h3 className={`font-display text-xl font-bold mb-6 ${iconTint[i % 4]}`}>{g.group}</h3>
            <div className="flex flex-wrap gap-3">
              {g.items.map((s) => (
                <span key={s} className="px-4 py-2 bg-panel-2/60 text-fg/90 text-sm font-medium rounded-lg border border-line hover:border-a1/50 hover:text-a1 transition-colors">
                  {s}
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {c.projects.map((p, i) => {
        const href = p.link || p.repo
        return (
          <Reveal key={i} delay={(i % 3) * 80}>
            <div className={`${card} p-6 sm:p-8 flex flex-col h-full group`}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-panel-2 rounded-xl group-hover:bg-a1/10 transition-colors">
                  {p.icon || '◆'}
                </div>
                <div className="flex gap-3">
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" aria-label="Source code" className="text-muted hover:text-a1 transition-colors">
                      <BrandIcon icon="github" size={20} />
                    </a>
                  )}
                  {href && p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" aria-label="Live site" className="text-muted hover:text-a1 transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{p.title}</h3>
              <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">{p.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {p.stack.map((t) => (
                  <span key={t} className="text-xs font-semibold text-a1 bg-a1/10 px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

function Achievements({ c }: { c: SiteContent }) {
  const a = c.achievements
  const r = a.rating
  const items: { icon: string; title: string; text: string }[] = [
    ...(r.enabled
      ? [{ icon: '⭐', title: `${r.platform} ${r.rank}`, text: `Max rating ${r.rating} under the handle ${r.handle}.` }]
      : []),
    ...a.items.map((it) => ({ icon: it.icon, title: `${it.metric} · ${it.label}`, text: it.detail })),
    ...a.leadership.map((l) => ({ icon: '👥', title: l.role, text: [l.org, l.description].filter(Boolean).join(' — ') })),
  ]
  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {items.map((it, i) => (
        <Reveal key={i} delay={(i % 2) * 80}>
          <div className={`${glass} flex items-start p-6 sm:p-8 rounded-2xl hover:border-a1/50 transition-colors group h-full`}>
            <div className="w-14 h-14 shrink-0 flex items-center justify-center text-2xl bg-panel-2 rounded-2xl mr-5 group-hover:bg-a1/10 transition-colors">
              {it.icon || '🏆'}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold mb-2">{it.title}</h3>
              {it.text && <p className="text-muted leading-relaxed">{it.text}</p>}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function Education({ c }: { c: SiteContent }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {c.education.map((e, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className={`${glass} p-6 rounded-xl border-l-4 border-l-a1 hover:bg-panel-2/80 transition-colors`}>
            <h4 className="font-display text-xl font-bold">{e.institution}</h4>
            <p className={`${iconTint[i % 3]} font-medium mt-1`}>{e.degree}</p>
            <div className="flex flex-col sm:flex-row sm:items-center mt-3 text-sm text-muted gap-1 sm:gap-4">
              <span>{e.period}</span>
              {e.score && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-fg/85 font-medium">{e.score}</span>
                </>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function Contact({ c, s }: { c: SiteContent; s: Section }) {
  const ct = c.contact
  const row = (href: string, icon: ReactNode, text: string) => (
    <a href={href} className="flex items-center text-fg/85 hover:text-a1 transition-colors group min-w-0">
      <div className="p-3 bg-panel-2 rounded-xl mr-4 group-hover:bg-a1/10 transition-colors text-a1 shrink-0">{icon}</div>
      <span className="truncate">{text}</span>
    </a>
  )
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <Reveal>
        <h2 className="font-display text-3xl font-bold mb-4">{s.title}</h2>
        {ct.message && <p className="text-muted max-w-md mb-8">{ct.message}</p>}
        <div className="space-y-4">
          {ct.email && row(`mailto:${ct.email}`, <Mail size={20} />, ct.email)}
          {ct.showPhone && ct.phone && row(telHref(ct.phone), <Phone size={20} />, ct.phone)}
        </div>
      </Reveal>
      {ct.links.length > 0 && (
        <Reveal delay={100} className="flex flex-col md:items-end justify-center">
          <h3 className="font-display text-xl font-bold mb-6">Social profiles</h3>
          <div className="flex flex-wrap gap-4">
            {ct.links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                aria-label={l.label}
                title={l.label}
                className="p-4 bg-panel-2 hover:bg-panel rounded-2xl text-fg/85 hover:text-a1 transition-all hover:-translate-y-1"
              >
                <BrandIcon icon={l.icon} size={24} />
              </a>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  )
}

export default function Clean() {
  const { c } = useSite()
  const sections = visibleSections(c)
  const contact = sections.find((s) => s.id === 'contact')
  const body = sections.filter((s) => s.id !== 'contact')
  const render: Record<Exclude<Section['id'], 'contact'>, ReactNode> = {
    about: <About c={c} />,
    skills: <Skills c={c} />,
    projects: <Projects c={c} />,
    achievements: <Achievements c={c} />,
    education: <Education c={c} />,
  }
  return (
    <div className="bg-bg text-fg font-body min-h-screen overflow-x-clip">
      <Nav sections={sections} />
      <main>
        <Hero c={c} hasProjects={sections.some((s) => s.id === 'projects')} />
        {body.map((s, i) => (
          <section key={s.id} id={s.id} className={`py-20 ${i % 2 === 0 ? '' : 'bg-surface/60'}`}>
            <div className={wrap}>
              <Title s={s} />
              {render[s.id as Exclude<Section['id'], 'contact'>]}
            </div>
          </section>
        ))}
      </main>
      <footer id={contact ? 'contact' : undefined} className="relative pt-20 pb-10 border-t border-line bg-surface">
        <div className={wrap}>
          {contact && (
            <div className="mb-16">
              <Contact c={c} s={contact} />
            </div>
          )}
          <div className="border-t border-line pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted">
            <p>
              © {new Date().getFullYear()} {c.profile.name}. All rights reserved.
            </p>
            <p>{c.footer}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
