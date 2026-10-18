import { useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Check, Eye, EyeOff } from 'lucide-react'
import { normalize } from '../lib/content'
import { defaultContent } from '../lib/defaults'
import { supabase } from '../lib/supabase'
import { FONTS, LAYOUTS, PALETTES, resolveTokens } from '../lib/theme'
import type { FontId, LayoutId, LinkIcon, PaletteId, SiteContent } from '../lib/types'
import { Area, Card, ColorField, input, Lines, List, move, Num, Row, Select, Tags, Text, Toggle, Upload } from './fields'

export type Update = (recipe: (draft: SiteContent) => void) => void
type P = { c: SiteContent; update: Update }

const BOLD_HINT = (
  <>
    Use <code className="text-zinc-300">**bold**</code> for emphasis and <code className="text-zinc-300">[text](https://link)</code> for links.
  </>
)

function Used({ children }: { children: ReactNode }) {
  return <span className="text-emerald-400/80">{children}</span>
}

/* ── Theme ─────────────────────────────────────────────────────────── */

function LayoutThumb({ id }: { id: LayoutId }) {
  // Tiny sketches of each layout so they can be told apart at a glance.
  if (id === 'terminal')
    return (
      <div className="h-16 rounded-md bg-[#05060a] p-2 grid grid-cols-[1.3fr_1fr] gap-2">
        <div className="space-y-1.5 pt-1">
          <div className="h-1 w-8 rounded bg-[#4fd6ff]/70" />
          <div className="h-2.5 w-14 rounded bg-zinc-200" />
          <div className="h-2.5 w-12 rounded bg-zinc-200" />
          <div className="h-1.5 w-8 rounded bg-[#b6f36a]" />
        </div>
        <div className="rounded border border-zinc-700 bg-[#0c0f17] p-1">
          <div className="flex gap-0.5 mb-1">
            <span className="w-1 h-1 rounded-full bg-red-400" />
            <span className="w-1 h-1 rounded-full bg-yellow-400" />
            <span className="w-1 h-1 rounded-full bg-green-400" />
          </div>
          <div className="h-7 rounded-sm bg-[#14324d]" />
        </div>
      </div>
    )
  if (id === 'neon')
    return (
      <div className="h-16 rounded-md bg-[#060610] p-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 font-mono text-[6px] leading-[7px] text-[#00d4ff] break-all p-1">
          01{'{'}dp{'}'}i&lt;n++∑ 10 if j k 0 1 ∞ ( ) 1 0 dp ||
        </div>
        <div className="relative space-y-1.5 pt-1">
          <div className="h-2.5 w-10 rounded bg-zinc-200" />
          <div className="h-2.5 w-20 rounded bg-gradient-to-r from-[#00d4ff] to-[#a855f7]" />
          <div className="h-1 w-12 rounded bg-[#00d4ff]/60" />
          <div className="flex gap-1">
            <div className="h-2 w-6 rounded bg-[#00d4ff]" />
            <div className="h-2 w-6 rounded border border-zinc-600" />
          </div>
        </div>
      </div>
    )
  return (
    <div className="h-16 rounded-md bg-[#0f172a] p-2 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
      <div className="absolute w-12 h-12 rounded-full bg-[#2dd4bf]/25 blur-xl" />
      <div className="relative w-4 h-4 rounded-full bg-zinc-500 border border-[#2dd4bf]" />
      <div className="relative h-2.5 w-20 rounded bg-gradient-to-r from-zinc-200 via-[#2dd4bf] to-[#06b6d4]" />
      <div className="relative h-2 w-8 rounded bg-[#2dd4bf]" />
    </div>
  )
}

export function ThemePanel({ c, update }: P) {
  const t = c.theme
  const tokens = resolveTokens({ ...t, accent: '', accent2: '' }, t.mode)
  return (
    <>
      <Card title="Layout" desc="The overall design. Switching also applies that layout’s recommended colors and fonts — you can change them below.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(LAYOUTS) as LayoutId[]).map((id) => {
            const L = LAYOUTS[id]
            const on = t.layout === id
            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  update((d) => {
                    if (d.theme.layout === id) return
                    d.theme.layout = id
                    d.theme.palette = L.palette
                    d.theme.font = L.font
                    d.theme.accent = ''
                    d.theme.accent2 = ''
                  })
                }
                className={`text-left rounded-xl border p-2.5 transition ${on ? 'border-emerald-400 bg-emerald-400/5 ring-2 ring-emerald-400/20' : 'border-zinc-800 hover:border-zinc-600'}`}
              >
                <LayoutThumb id={id} />
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-sm font-semibold">{L.label}</span>
                  {on && <Check size={15} className="text-emerald-400" />}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{L.blurb}</p>
              </button>
            )
          })}
        </div>
      </Card>

      <Card title="Colors">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(PALETTES) as PaletteId[]).map((id) => {
            const p = PALETTES[id][t.mode]
            const on = t.palette === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => update((d) => void (d.theme.palette = id))}
                className={`rounded-lg border p-2 text-left transition ${on ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-zinc-800 hover:border-zinc-600'}`}
              >
                <div className="h-8 rounded-md flex items-center gap-1 px-2" style={{ background: p.bg, border: `1px solid ${p.line}` }}>
                  {[p.a1, p.a2, p.a3, p.a4].map((col, i) => (
                    <span key={i} className="w-3.5 h-3.5 rounded-full" style={{ background: col }} />
                  ))}
                  <span className="ml-auto h-1.5 w-6 rounded" style={{ background: p.fg }} />
                </div>
                <div className="text-xs mt-1.5 text-zinc-300">{PALETTES[id].label}</div>
              </button>
            )
          })}
        </div>
        <Field2 label="Default mode">
          <div className="inline-flex rounded-lg border border-zinc-700 p-0.5 bg-zinc-900">
            {(['dark', 'light'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update((d) => void (d.theme.mode = m))}
                className={`px-4 py-1.5 text-sm rounded-md capitalize ${t.mode === m ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-100'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field2>
        <Row>
          <ColorField label="Main accent (optional)" value={t.accent} fallback={tokens.a1} onChange={(v) => update((d) => void (d.theme.accent = v))} />
          <ColorField label="Second accent (optional)" value={t.accent2} fallback={tokens.a2} onChange={(v) => update((d) => void (d.theme.accent2 = v))} />
        </Row>
      </Card>

      <Card title="Fonts">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(FONTS) as FontId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => update((d) => void (d.theme.font = id))}
              className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${t.font === id ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              {FONTS[id].label}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Effects">
        <Toggle label="Animated background" hint="Matrix rain (Neon), grid (Terminal) or glowing blobs (Clean)." checked={t.effects.background} onChange={(v) => update((d) => void (d.theme.effects.background = v))} />
        <Toggle label="Animations" hint="Scroll reveals, typing text, counters. Always off for visitors who ask their device to reduce motion." checked={t.effects.animations} onChange={(v) => update((d) => void (d.theme.effects.animations = v))} />
        <Toggle label="Pixel cat" hint="Sits next to your logo. Click it and it runs away." checked={t.effects.cat} onChange={(v) => update((d) => void (d.theme.effects.cat = v))} />
        <Toggle label="Light/dark switch for visitors" hint="Shows a sun/moon button. Their choice is remembered on their device." checked={t.effects.modeToggle} onChange={(v) => update((d) => void (d.theme.effects.modeToggle = v))} />
      </Card>
    </>
  )
}

function Field2({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="block text-xs font-medium text-zinc-300 mb-1.5">{label}</div>
      {children}
    </div>
  )
}

/* ── Profile ───────────────────────────────────────────────────────── */

export function ProfilePanel({ c, update }: P) {
  const p = c.profile
  const set = <K extends keyof SiteContent['profile']>(k: K, v: SiteContent['profile'][K]) => update((d) => void (d.profile[k] = v))
  return (
    <>
      <Card title="Basics">
        <Text label="Full name" value={p.name} onChange={(v) => set('name', v)} />
        <Row>
          <Text label="Logo text" value={p.logo} onChange={(v) => set('logo', v)} hint={<>Shown as <Used>~/{p.logo}.dev</Used> or <Used>{p.logo.toUpperCase()}.</Used></>} />
          <Text label="Initials" value={p.initials} onChange={(v) => set('initials', v)} hint={<>Neon logo <Used>&lt;{p.initials}/&gt;</Used> and the browser tab icon.</>} />
        </Row>
        <Text label="Role / one-liner" value={p.role} onChange={(v) => set('role', v)} placeholder="CSE undergrad @ KUET" />
        <Area label="Intro paragraph" rows={4} value={p.headline} onChange={(v) => set('headline', v)} hint={BOLD_HINT} />
        <Text label="Availability badge" value={p.availability} onChange={(v) => set('availability', v)} hint={<>Neon layout. Leave empty to hide.</>} />
      </Card>

      <Card title="Photo & resume" desc={supabase ? 'Upload a file or paste a link.' : 'Uploading needs Supabase — paste a link for now.'}>
        <Upload label="Profile photo" image value={p.photo} folder="photos" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(v) => set('photo', v)} hint="Square images look best. Leave empty to hide the photo." />
        <Upload
          label="Cutout photo (background removed)"
          image
          value={p.cutout}
          folder="photos"
          accept="image/png,image/webp,image/avif"
          onChange={(v) => set('cutout', v)}
          hint={<>Neon layout: stands on your last name and fades into it. Use a PNG with a transparent background (e.g. made with remove.bg). Empty = uses the profile photo.</>}
        />
        <Select
          label="Cutout size"
          value={p.cutoutFit}
          options={[
            { value: 'full', label: 'Full figure (moves the name down to make room)' },
            { value: 'bust', label: 'Head & shoulders (keeps the text where it is)' },
          ]}
          onChange={(v) => set('cutoutFit', v)}
        />
        <Upload label="Resume (PDF)" value={p.resume} folder="resume" accept="application/pdf" onChange={(v) => set('resume', v)} hint="Leave empty to hide the resume buttons." />
      </Card>

      <Card title="Hero extras">
        <Tags label="Typing roles" value={p.typedRoles} onChange={(v) => set('typedRoles', v)} hint={<>Neon: “I <Used>build full-stack apps</Used>…”, typed one after another.</>} />
        <Tags label="Highlights" value={p.highlights} onChange={(v) => set('highlights', v)} hint="Terminal: small chips under the buttons." />
        <Tags label="Scrolling keywords" value={p.keywords} onChange={(v) => set('keywords', v)} hint="Terminal: the marquee strip under the hero." />
        <Row>
          <Text label="Handle" value={p.handle} onChange={(v) => set('handle', v)} hint="Terminal: under your photo." />
          <Text label="Status" value={p.status} onChange={(v) => set('status', v)} hint="“status: learning ●” and the footer." />
        </Row>
      </Card>

      <Card title="Stats" desc="Big numbers in the hero (Neon & Clean). Numbers count up on load.">
        <List
          items={p.stats}
          onChange={(v) => set('stats', v)}
          newItem={() => ({ value: '0', label: 'New stat' })}
          title={(s) => `${s.value} — ${s.label}`}
          addLabel="Add stat"
          render={(s, setS) => (
            <Row>
              <Text label="Value" value={s.value} onChange={(v) => setS({ value: v })} placeholder="1200+" />
              <Text label="Label" value={s.label} onChange={(v) => setS({ label: v })} />
            </Row>
          )}
        />
      </Card>
    </>
  )
}

/* ── About ─────────────────────────────────────────────────────────── */

export function AboutPanel({ c, update }: P) {
  return (
    <>
      <Card title="Paragraphs" desc={BOLD_HINT}>
        <List
          items={c.about.paragraphs}
          onChange={(v) => update((d) => void (d.about.paragraphs = v))}
          newItem={() => ''}
          title={(t) => t.replace(/\*\*/g, '').slice(0, 60)}
          addLabel="Add paragraph"
          render={(t, _set, i) => (
            <Area
              label={`Paragraph ${i + 1}`}
              rows={4}
              value={t}
              onChange={(v) => update((d) => void (d.about.paragraphs[i] = v))}
            />
          )}
        />
      </Card>
      <Card title="Quick facts" desc="Small cards next to your story. In Terminal they become a code block.">
        <List
          items={c.about.facts}
          onChange={(v) => update((d) => void (d.about.facts = v))}
          newItem={() => ({ icon: '✨', title: 'New fact', text: '' })}
          title={(f) => `${f.icon} ${f.title}`}
          addLabel="Add fact"
          render={(f, set) => (
            <>
              <div className="grid grid-cols-[80px_1fr] gap-4">
                <Text label="Emoji" value={f.icon} onChange={(v) => set({ icon: v })} />
                <Text label="Title" value={f.title} onChange={(v) => set({ title: v })} />
              </div>
              <Text label="Text" value={f.text} onChange={(v) => set({ text: v })} />
            </>
          )}
        />
      </Card>
    </>
  )
}

/* ── Skills ────────────────────────────────────────────────────────── */

export function SkillsPanel({ c, update }: P) {
  return (
    <Card title="Skill groups">
      <List
        items={c.skills}
        startOpen
        onChange={(v) => update((d) => void (d.skills = v))}
        newItem={() => ({ group: 'New group', items: [] })}
        title={(g) => `${g.group} (${g.items.length})`}
        addLabel="Add group"
        render={(g, set) => (
          <>
            <Text label="Group name" value={g.group} onChange={(v) => set({ group: v })} />
            <Tags label="Skills" value={g.items} onChange={(v) => set({ items: v })} />
          </>
        )}
      />
    </Card>
  )
}

/* ── Projects ──────────────────────────────────────────────────────── */

export function ProjectsPanel({ c, update }: P) {
  return (
    <Card title="Projects" desc="Add a live link or GitHub repo so visitors can open them.">
      <List
        items={c.projects}
        onChange={(v) => update((d) => void (d.projects = v))}
        newItem={() => ({ title: 'New project', tag: '', icon: '🚀', description: '', stack: [], features: [], link: '', repo: '', featured: false })}
        title={(p) => `${p.icon} ${p.title}`}
        addLabel="Add project"
        render={(p, set) => (
          <>
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <Text label="Emoji" value={p.icon} onChange={(v) => set({ icon: v })} />
              <Text label="Title" value={p.title} onChange={(v) => set({ title: v })} />
            </div>
            <Text label="Tag" value={p.tag} onChange={(v) => set({ tag: v })} placeholder="full-stack LMS" />
            <Area label="Description" rows={3} value={p.description} onChange={(v) => set({ description: v })} />
            <Tags label="Tech stack" value={p.stack} onChange={(v) => set({ stack: v })} />
            <Lines label="Key features" value={p.features} onChange={(v) => set({ features: v })} rows={3} />
            <Row>
              <Text label="Live link" type="url" value={p.link} onChange={(v) => set({ link: v })} placeholder="https://…" />
              <Text label="Source code (GitHub)" type="url" value={p.repo} onChange={(v) => set({ repo: v })} placeholder="https://github.com/…" />
            </Row>
            <Toggle label="Featured (wide card)" hint="Neon layout: spans two columns." checked={p.featured} onChange={(v) => set({ featured: v })} />
          </>
        )}
      />
    </Card>
  )
}

/* ── Achievements ──────────────────────────────────────────────────── */

export function AchievementsPanel({ c, update }: P) {
  const a = c.achievements
  const r = a.rating
  const setR = <K extends keyof typeof r>(k: K, v: (typeof r)[K]) => update((d) => void (d.achievements.rating[k] = v))
  return (
    <>
      <Card title="Rating card" action={<Toggle label="" checked={r.enabled} onChange={(v) => setR('enabled', v)} />} desc="A big rating with a progress bar, e.g. Codeforces.">
        {r.enabled && (
          <>
            <Row>
              <Text label="Platform" value={r.platform} onChange={(v) => setR('platform', v)} />
              <Text label="Handle" value={r.handle} onChange={(v) => setR('handle', v)} />
            </Row>
            <Row>
              <Num label="Rating" value={r.rating} onChange={(v) => setR('rating', v)} />
              <Num label="Bar maximum" value={r.max} onChange={(v) => setR('max', v)} />
            </Row>
            <Row>
              <Text label="Rank / title" value={r.rank} onChange={(v) => setR('rank', v)} />
              <Text label="Profile link" type="url" value={r.url} onChange={(v) => setR('url', v)} />
            </Row>
          </>
        )}
      </Card>
      <Card title="Achievements">
        <List
          items={a.items}
          onChange={(v) => update((d) => void (d.achievements.items = v))}
          newItem={() => ({ icon: '🏆', metric: '', label: 'New achievement', detail: '' })}
          title={(it) => `${it.icon} ${it.metric} ${it.label}`}
          addLabel="Add achievement"
          render={(it, set) => (
            <>
              <div className="grid grid-cols-[80px_1fr] gap-4">
                <Text label="Emoji" value={it.icon} onChange={(v) => set({ icon: v })} />
                <Text label="Big number / metric" value={it.metric} onChange={(v) => set({ metric: v })} placeholder="26 / 91" />
              </div>
              <Text label="Label" value={it.label} onChange={(v) => set({ label: v })} />
              <Text label="Detail" value={it.detail} onChange={(v) => set({ detail: v })} />
            </>
          )}
        />
      </Card>
      <Card title="Leadership">
        <List
          items={a.leadership}
          onChange={(v) => update((d) => void (d.achievements.leadership = v))}
          newItem={() => ({ role: 'New role', org: '', description: '' })}
          title={(l) => l.role}
          addLabel="Add role"
          render={(l, set) => (
            <>
              <Row>
                <Text label="Role" value={l.role} onChange={(v) => set({ role: v })} />
                <Text label="Organization" value={l.org} onChange={(v) => set({ org: v })} />
              </Row>
              <Area label="Description" rows={2} value={l.description} onChange={(v) => set({ description: v })} />
            </>
          )}
        />
      </Card>
      <Card title="Platforms">
        <Tags label="Tags" value={a.tags} onChange={(v) => update((d) => void (d.achievements.tags = v))} hint="Small chips like Codeforces, AtCoder (Terminal & Neon)." />
      </Card>
    </>
  )
}

/* ── Education ─────────────────────────────────────────────────────── */

export function EducationPanel({ c, update }: P) {
  return (
    <Card title="Education" desc="Newest first.">
      <List
        items={c.education}
        onChange={(v) => update((d) => void (d.education = v))}
        newItem={() => ({ period: '', degree: 'New degree', institution: '', score: '' })}
        title={(e) => `${e.degree}${e.period ? ` · ${e.period}` : ''}`}
        addLabel="Add education"
        render={(e, set) => (
          <>
            <Text label="Degree" value={e.degree} onChange={(v) => set({ degree: v })} />
            <Text label="Institution" value={e.institution} onChange={(v) => set({ institution: v })} />
            <Row>
              <Text label="Period" value={e.period} onChange={(v) => set({ period: v })} placeholder="2024 – Present" />
              <Text label="Score / note" value={e.score} onChange={(v) => set({ score: v })} placeholder="CGPA 3.75/4.00" />
            </Row>
          </>
        )}
      />
    </Card>
  )
}

/* ── Contact ───────────────────────────────────────────────────────── */

const ICONS: { value: LinkIcon; label: string }[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'codeforces', label: 'Codeforces' },
  { value: 'x', label: 'X / Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other link' },
]

export function ContactPanel({ c, update }: P) {
  const ct = c.contact
  return (
    <>
      <Card title="Contact">
        <Area label="Message" rows={3} value={ct.message} onChange={(v) => update((d) => void (d.contact.message = v))} />
        <Text label="Email" type="email" value={ct.email} onChange={(v) => update((d) => void (d.contact.email = v))} />
        <Text label="Phone" value={ct.phone} onChange={(v) => update((d) => void (d.contact.phone = v))} />
        <Toggle label="Show phone number publicly" hint="Anyone (and spam bots) can read it when this is on." checked={ct.showPhone} onChange={(v) => update((d) => void (d.contact.showPhone = v))} />
      </Card>
      <Card title="Links" desc="Used in the nav, about and contact areas.">
        <List
          items={ct.links}
          startOpen
          onChange={(v) => update((d) => void (d.contact.links = v))}
          newItem={() => ({ label: 'Website', url: 'https://', icon: 'website' as LinkIcon })}
          title={(l) => l.label}
          addLabel="Add link"
          render={(l, set) => (
            <>
              <Row>
                <Select label="Icon" value={l.icon} options={ICONS} onChange={(v) => set({ icon: v })} />
                <Text label="Label" value={l.label} onChange={(v) => set({ label: v })} />
              </Row>
              <Text label="URL" type="url" value={l.url} onChange={(v) => set({ url: v })} />
            </>
          )}
        />
      </Card>
    </>
  )
}

/* ── Sections ──────────────────────────────────────────────────────── */

export function SectionsPanel({ c, update }: P) {
  return (
    <Card title="Sections" desc="Reorder, rename or hide whole sections. The hero always comes first.">
      <div className="space-y-2">
        {c.sections.map((s, i) => (
          <div key={s.id} className={`rounded-lg border border-zinc-800 p-3 ${s.visible ? 'bg-zinc-950/50' : 'bg-zinc-950/20 opacity-60'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 flex-1">{s.id}</span>
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => update((d) => void (d.sections = move(d.sections, i, i - 1)))} className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-800 disabled:opacity-25">
                <ArrowUp size={14} />
              </button>
              <button type="button" aria-label="Move down" disabled={i === c.sections.length - 1} onClick={() => update((d) => void (d.sections = move(d.sections, i, i + 1)))} className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-800 disabled:opacity-25">
                <ArrowDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => update((d) => void (d.sections[i].visible = !d.sections[i].visible))}
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs ${s.visible ? 'text-emerald-300 bg-emerald-400/10' : 'text-zinc-400 bg-zinc-800'}`}
              >
                {s.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                {s.visible ? 'Shown' : 'Hidden'}
              </button>
            </div>
            <Row>
              <Text label="Nav label" value={s.label} onChange={(v) => update((d) => void (d.sections[i].label = v))} />
              <Text label="Heading" value={s.title} onChange={(v) => update((d) => void (d.sections[i].title = v))} />
            </Row>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ── Site settings, backup ─────────────────────────────────────────── */

export function SitePanel({ c, update, onReplace }: P & { onReplace: (c: SiteContent) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [pw, setPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const importJson = async (file?: File) => {
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (typeof data !== 'object' || !data || !('profile' in data)) throw new Error('not a portfolio backup')
      onReplace(normalize(data))
    } catch (e) {
      alert(`Could not import that file: ${e instanceof Error ? e.message : e}`)
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }
  const changePassword = async () => {
    if (!supabase) return
    if (pw.length < 8) return setPwMsg('Use at least 8 characters.')
    const { error } = await supabase.auth.updateUser({ password: pw })
    setPwMsg(error ? error.message : 'Password changed.')
    if (!error) setPw('')
  }
  return (
    <>
      <Card title="Search & sharing" desc="What Google and link previews show.">
        <Text label="Page title" value={c.seo.title} onChange={(v) => update((d) => void (d.seo.title = v))} />
        <Area label="Description" rows={3} value={c.seo.description} onChange={(v) => update((d) => void (d.seo.description = v))} />
        <Text label="Footer text" value={c.footer} onChange={(v) => update((d) => void (d.footer = v))} />
      </Card>
      <Card title="Backup" desc="Download everything as a file, or restore from one. Importing replaces the editor content — nothing goes live until you Save.">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportJson} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">
            Download backup
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">
            Import backup…
          </button>
          <button
            type="button"
            onClick={() => confirm('Replace everything in the editor with the original starter content?') && onReplace(structuredClone(defaultContent))}
            className="rounded-lg border border-red-500/30 text-red-300 px-3 py-2 text-sm hover:bg-red-500/10"
          >
            Reset to starter content
          </button>
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => importJson(e.target.files?.[0])} />
      </Card>
      {supabase && (
        <Card title="Account">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5" htmlFor="newpw">
                New password
              </label>
              <input id="newpw" type="password" autoComplete="new-password" className={input} value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
            <button type="button" onClick={changePassword} className="rounded-lg bg-zinc-100 text-zinc-900 px-3 py-2 text-sm font-medium hover:bg-white">
              Change
            </button>
          </div>
          {pwMsg && <p className="text-xs text-zinc-400">{pwMsg}</p>}
        </Card>
      )}
    </>
  )
}
