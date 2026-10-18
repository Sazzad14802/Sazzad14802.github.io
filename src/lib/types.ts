/* Everything the site shows lives in one SiteContent object.
   It is stored as a single JSON document in Supabase and edited in /admin. */

export type LayoutId = 'terminal' | 'neon' | 'clean'
export type PaletteId = 'lime' | 'cyber' | 'teal' | 'sunset' | 'ocean' | 'mono'
export type FontId = 'sora' | 'inter' | 'outfit' | 'grotesk' | 'serif' | 'mono'
export type Mode = 'dark' | 'light'
export type SectionId = 'about' | 'skills' | 'projects' | 'achievements' | 'education' | 'contact'
export type LinkIcon = 'github' | 'linkedin' | 'codeforces' | 'x' | 'facebook' | 'website' | 'other'

export interface ThemeConfig {
  layout: LayoutId
  palette: PaletteId
  mode: Mode
  /** Optional hex overrides for the palette's first two accents ('' = use palette). */
  accent: string
  accent2: string
  font: FontId
  effects: {
    /** Animated hero background (matrix rain / grid / glow blobs). */
    background: boolean
    /** Scroll reveal, typing and counter animations. */
    animations: boolean
    /** The pixel cat next to the logo. */
    cat: boolean
    /** Let visitors switch between light and dark. */
    modeToggle: boolean
  }
}

export interface Section {
  id: SectionId
  /** Short name used in the nav and small labels, e.g. "Projects". */
  label: string
  /** Big heading, e.g. "Things I've built". */
  title: string
  visible: boolean
}

export interface Stat {
  value: string
  label: string
}

export interface Fact {
  icon: string
  title: string
  text: string
}

export interface SkillGroup {
  group: string
  items: string[]
}

export interface Project {
  title: string
  tag: string
  icon: string
  description: string
  stack: string[]
  features: string[]
  link: string
  repo: string
  featured: boolean
}

export interface Achievement {
  icon: string
  metric: string
  label: string
  detail: string
}

export interface Leadership {
  role: string
  org: string
  description: string
}

export interface Education {
  period: string
  degree: string
  institution: string
  score: string
}

export interface SocialLink {
  label: string
  url: string
  icon: LinkIcon
}

export interface SiteContent {
  version: 1
  seo: {
    title: string
    description: string
  }
  profile: {
    name: string
    /** Short logo text, e.g. "sazzad" → "~/sazzad.dev" in the terminal layout. */
    logo: string
    initials: string
    role: string
    headline: string
    availability: string
    typedRoles: string[]
    keywords: string[]
    highlights: string[]
    stats: Stat[]
    photo: string
    /** Photo with the background removed — the Neon hero stands it on your name. */
    cutout: string
    /** full = whole figure (text moves down to fit), bust = head & shoulders. */
    cutoutFit: 'full' | 'bust'
    resume: string
    handle: string
    status: string
  }
  about: {
    paragraphs: string[]
    facts: Fact[]
  }
  skills: SkillGroup[]
  projects: Project[]
  achievements: {
    rating: {
      enabled: boolean
      platform: string
      handle: string
      url: string
      rating: number
      max: number
      rank: string
    }
    items: Achievement[]
    leadership: Leadership[]
    tags: string[]
  }
  education: Education[]
  contact: {
    message: string
    email: string
    phone: string
    showPhone: boolean
    links: SocialLink[]
  }
  footer: string
  sections: Section[]
  theme: ThemeConfig
}
