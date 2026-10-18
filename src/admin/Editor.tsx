import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  Award,
  Code2,
  ExternalLink,
  Eye,
  FolderGit2,
  GraduationCap,
  LayoutList,
  Loader2,
  LogOut,
  Mail,
  Monitor,
  Palette,
  Pencil,
  Settings,
  Smartphone,
  Undo2,
  User,
  UserRound,
} from 'lucide-react'
import { fetchContent, saveContent } from '../lib/content'
import { defaultContent } from '../lib/defaults'
import { supabase } from '../lib/supabase'
import type { Mode, SiteContent } from '../lib/types'
import { PREVIEW_MSG } from '../site/SiteApp'
import {
  AboutPanel,
  AchievementsPanel,
  ContactPanel,
  EducationPanel,
  ProfilePanel,
  ProjectsPanel,
  SectionsPanel,
  SitePanel,
  SkillsPanel,
  ThemePanel,
  type Update,
} from './panels'

const TABS = [
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'about', label: 'About', icon: UserRound },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'sections', label: 'Sections', icon: LayoutList },
  { id: 'site', label: 'Site & backup', icon: Settings },
] as const
type TabId = (typeof TABS)[number]['id']

function timeAgo(iso: string) {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 45) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  if (s < 86400) return `${Math.round(s / 3600)} h ago`
  return new Date(iso).toLocaleDateString()
}

/* Renders the real site in an iframe at true device width, scaled to fit. */
function Preview({ content, device, mode }: { content: SiteContent; device: 'desktop' | 'mobile'; mode: Mode | null }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const latest = useRef({ content, mode })
  latest.current = { content, mode }

  const send = useCallback(() => {
    frame.current?.contentWindow?.postMessage(
      { type: PREVIEW_MSG, content: latest.current.content, mode: latest.current.mode },
      location.origin,
    )
  }, [])

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin === location.origin && e.data?.type === `${PREVIEW_MSG}-ready`) send()
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [send])

  useEffect(() => {
    const t = window.setTimeout(send, 120)
    return () => window.clearTimeout(t)
  }, [content, mode, send])

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const W = device === 'desktop' ? 1280 : 390
  const pad = device === 'mobile' ? 24 : 0
  const scale = size.w ? Math.min(1, (size.w - pad * 2) / W) : 1
  const H = device === 'mobile' ? Math.min(844, (size.h - pad * 2) / scale) : size.h / scale

  return (
    <div ref={box} className={`relative h-full w-full overflow-hidden ${device === 'mobile' ? 'grid place-items-center' : ''}`}>
      <div
        style={{ width: W * scale, height: H * scale }}
        className={device === 'mobile' ? 'rounded-[28px] border-[6px] border-zinc-800 overflow-hidden shadow-2xl' : ''}
      >
        <iframe
          ref={frame}
          title="Live preview"
          src="/?preview"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: '0 0', border: 0, display: 'block' }}
        />
      </div>
    </div>
  )
}

export default function Editor({ email, onSignOut }: { email?: string; onSignOut?: () => void }) {
  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [saved, setSaved] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loadNote, setLoadNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState('')
  const [tab, setTab] = useState<TabId>('theme')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [previewMode, setPreviewMode] = useState<Mode | null>(null)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [, tick] = useState(0)

  useEffect(() => {
    let alive = true
    const start = (c: SiteContent, note = '') => {
      if (!alive) return
      setDraft(c)
      setSaved(JSON.stringify(c))
      setLoadNote(note)
    }
    if (!supabase) return start(structuredClone(defaultContent))
    fetchContent()
      .then((res) => {
        if (res) {
          start(res.content)
          setUpdatedAt(res.updatedAt)
        } else start(structuredClone(defaultContent), 'Nothing is saved yet — this is the starter content. Press Save to publish it.')
      })
      .catch((e) => {
        start(structuredClone(defaultContent), '')
        setError(`Could not load saved content: ${e.message ?? e}. Check the database setup in the README.`)
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const t = window.setInterval(() => tick((n) => n + 1), 30000)
    return () => window.clearInterval(t)
  }, [])

  const dirty = draft !== null && JSON.stringify(draft) !== saved

  const update: Update = useCallback((recipe) => {
    setDraft((d) => {
      if (!d) return d
      const next = structuredClone(d)
      recipe(next)
      return next
    })
  }, [])

  const save = useCallback(async () => {
    if (!draft || !supabase || saving) return
    setSaving(true)
    setError('')
    try {
      const at = await saveContent(draft)
      setSaved(JSON.stringify(draft))
      setUpdatedAt(at)
      setLoadNote('')
      setFlash('Published — your site is updated.')
      window.setTimeout(() => setFlash(''), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }, [draft, saving])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (dirty) save()
      }
    }
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('beforeunload', onLeave)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('beforeunload', onLeave)
    }
  }, [dirty, save])

  useEffect(() => {
    document.title = `${dirty ? '• ' : ''}Edit portfolio`
  }, [dirty])

  if (!draft) {
    return (
      <div className="min-h-screen grid place-items-center bg-zinc-950 text-zinc-400">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  const panelProps = { c: draft, update }
  const panels: Record<TabId, ReactNode> = {
    theme: <ThemePanel {...panelProps} />,
    profile: <ProfilePanel {...panelProps} />,
    about: <AboutPanel {...panelProps} />,
    skills: <SkillsPanel {...panelProps} />,
    projects: <ProjectsPanel {...panelProps} />,
    achievements: <AchievementsPanel {...panelProps} />,
    education: <EducationPanel {...panelProps} />,
    contact: <ContactPanel {...panelProps} />,
    sections: <SectionsPanel {...panelProps} />,
    site: <SitePanel {...panelProps} onReplace={(c) => setDraft(c)} />,
  }
  const effectiveMode = previewMode ?? draft.theme.mode

  return (
    <div className="h-dvh flex flex-col bg-zinc-950 text-zinc-100 font-[Inter,system-ui,sans-serif]">
      {/* top bar */}
      <header className="h-14 shrink-0 border-b border-zinc-800 flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-md bg-emerald-400 text-zinc-950 grid place-items-center text-xs font-bold shrink-0">
            {draft.profile.initials.slice(0, 2) || 'P'}
          </div>
          <div className="min-w-0 hidden sm:block">
            <div className="text-sm font-semibold leading-tight truncate">Portfolio editor</div>
            <div className="text-[11px] text-zinc-500 leading-tight truncate">
              {dirty ? 'Unsaved changes' : updatedAt ? `Published ${timeAgo(updatedAt)}` : supabase ? 'Not published yet' : 'Offline mode'}
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="lg:hidden inline-flex rounded-lg border border-zinc-700 p-0.5">
          {(['edit', 'preview'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setMobileView(v)}
              className={`px-2.5 py-1 text-xs rounded-md inline-flex items-center gap-1 ${mobileView === v ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
            >
              {v === 'edit' ? <Pencil size={12} /> : <Eye size={12} />}
              <span className="capitalize">{v}</span>
            </button>
          ))}
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 px-2">
          View site <ExternalLink size={14} />
        </a>
        {dirty && (
          <button
            type="button"
            onClick={() => confirm('Discard all unsaved changes?') && setDraft(JSON.parse(saved))}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 px-2"
            title="Discard changes"
          >
            <Undo2 size={15} />
            <span className="hidden md:inline">Discard</span>
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving || !supabase}
          title={supabase ? 'Save and publish (Ctrl+S)' : 'Connect Supabase to save'}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400 text-zinc-950 px-3.5 py-1.5 text-sm font-semibold hover:bg-emerald-300 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Saving…' : dirty ? 'Save & publish' : 'Saved'}
        </button>
        {onSignOut && (
          <button type="button" onClick={onSignOut} title={`Sign out ${email ?? ''}`} aria-label="Sign out" className="p-2 text-zinc-500 hover:text-zinc-100">
            <LogOut size={16} />
          </button>
        )}
      </header>

      {(error || flash || loadNote || !supabase) && (
        <div className="shrink-0 px-4 py-2 text-xs border-b border-zinc-800 flex items-center gap-2">
          {error ? (
            <span className="text-red-300 flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </span>
          ) : flash ? (
            <span className="text-emerald-300">{flash}</span>
          ) : !supabase ? (
            <span className="text-amber-300 flex items-center gap-2">
              <AlertTriangle size={14} /> Offline mode: Supabase isn’t connected, so changes can’t be published. You can still try things out and download a backup. See README → Setup.
            </span>
          ) : (
            <span className="text-sky-300">{loadNote}</span>
          )}
        </div>
      )}

      <div className="flex-1 min-h-0 flex">
        {/* tabs */}
        <nav className={`${mobileView === 'edit' ? 'flex' : 'hidden'} lg:flex flex-col w-14 md:w-48 shrink-0 border-r border-zinc-800 py-3 gap-0.5 overflow-y-auto`}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              title={t.label}
              className={`mx-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                tab === t.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <t.icon size={16} className="shrink-0" />
              <span className="hidden md:inline truncate">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* form */}
        <main className={`${mobileView === 'edit' ? 'block' : 'hidden'} lg:block flex-1 lg:flex-none lg:w-[460px] xl:w-[520px] min-w-0 overflow-y-auto border-r border-zinc-800`}>
          <div className="p-3 sm:p-5 space-y-4 pb-24">
            <h2 className="text-lg font-semibold">{TABS.find((t) => t.id === tab)?.label}</h2>
            {panels[tab]}
          </div>
        </main>

        {/* preview */}
        <section className={`${mobileView === 'preview' ? 'flex' : 'hidden'} lg:flex flex-1 min-w-0 flex-col bg-zinc-900/40`}>
          <div className="h-11 shrink-0 flex items-center justify-between gap-2 px-3 border-b border-zinc-800">
            <span className="text-xs text-zinc-500">Live preview — not published until you save</span>
            <div className="flex items-center gap-1">
              {draft.theme.effects.modeToggle && (
                <button
                  type="button"
                  onClick={() => setPreviewMode(effectiveMode === 'dark' ? 'light' : 'dark')}
                  className="text-xs text-zinc-400 hover:text-zinc-100 px-2 py-1 rounded-md hover:bg-zinc-800"
                  title="Preview the other mode"
                >
                  {effectiveMode === 'dark' ? 'Dark' : 'Light'}
                </button>
              )}
              {(
                [
                  ['desktop', Monitor],
                  ['mobile', Smartphone],
                ] as const
              ).map(([d, Icon]) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDevice(d)}
                  aria-label={`${d} preview`}
                  className={`p-1.5 rounded-md ${device === d ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-100'}`}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Preview content={draft} device={device} mode={previewMode} />
          </div>
        </section>
      </div>
    </div>
  )
}
