import type { FontId, LayoutId, Mode, PaletteId, ThemeConfig } from './types'

interface Tokens {
  bg: string
  surface: string
  panel: string
  panel2: string
  line: string
  fg: string
  muted: string
  a1: string
  a2: string
  a3: string
  a4: string
}

export const PALETTES: Record<PaletteId, { label: string; dark: Tokens; light: Tokens }> = {
  lime: {
    label: 'Lime terminal',
    dark: {
      bg: '#05060a', surface: '#090b11', panel: '#0c0f17', panel2: '#121623', line: '#1e2536',
      fg: '#e8ecf6', muted: '#8b93a7', a1: '#b6f36a', a2: '#4fd6ff', a3: '#a78bfa', a4: '#ffb454',
    },
    light: {
      bg: '#f7f8f3', surface: '#eef0e8', panel: '#ffffff', panel2: '#f2f4ec', line: '#dde1d3',
      fg: '#11141b', muted: '#596173', a1: '#4d7c0f', a2: '#0e7490', a3: '#6d28d9', a4: '#b45309',
    },
  },
  cyber: {
    label: 'Cyber neon',
    dark: {
      bg: '#060610', surface: '#0c0c1c', panel: '#0e0e1f', panel2: '#14142a', line: '#1d1d33',
      fg: '#e2e8f0', muted: '#8590a6', a1: '#00d4ff', a2: '#a855f7', a3: '#22c55e', a4: '#f59e0b',
    },
    light: {
      bg: '#f8fafc', surface: '#eef2f7', panel: '#ffffff', panel2: '#f1f5f9', line: '#dde3ec',
      fg: '#0f172a', muted: '#5b6b80', a1: '#0089a8', a2: '#8b44d4', a3: '#15803d', a4: '#b45309',
    },
  },
  teal: {
    label: 'Teal glass',
    dark: {
      bg: '#0f172a', surface: '#0b1222', panel: '#1a2438', panel2: '#1e293b', line: '#27344b',
      fg: '#f8fafc', muted: '#94a3b8', a1: '#2dd4bf', a2: '#06b6d4', a3: '#60a5fa', a4: '#f472b6',
    },
    light: {
      bg: '#f8fafc', surface: '#f0f5f9', panel: '#ffffff', panel2: '#f1f5f9', line: '#e2e8f0',
      fg: '#0f172a', muted: '#5f6e82', a1: '#0f766e', a2: '#0e7490', a3: '#2563eb', a4: '#be185d',
    },
  },
  sunset: {
    label: 'Sunset',
    dark: {
      bg: '#0d0908', surface: '#130e0c', panel: '#17110f', panel2: '#1f1714', line: '#2e231e',
      fg: '#f6ede8', muted: '#a3948c', a1: '#ff8a5c', a2: '#ffc65c', a3: '#f472b6', a4: '#a78bfa',
    },
    light: {
      bg: '#fdf8f4', surface: '#f8efe8', panel: '#ffffff', panel2: '#faf1ea', line: '#ecdcd0',
      fg: '#1f1410', muted: '#6e5e55', a1: '#c2410c', a2: '#a16207', a3: '#be185d', a4: '#6d28d9',
    },
  },
  ocean: {
    label: 'Ocean',
    dark: {
      bg: '#050b14', surface: '#08111d', panel: '#0b1626', panel2: '#102035', line: '#1a2c45',
      fg: '#e6eef8', muted: '#8a9ab0', a1: '#5b9dff', a2: '#38e1c6', a3: '#c084fc', a4: '#fbbf24',
    },
    light: {
      bg: '#f5f8fc', surface: '#ebf1f8', panel: '#ffffff', panel2: '#eef3fa', line: '#d9e3ef',
      fg: '#0b1626', muted: '#56667c', a1: '#1d4ed8', a2: '#0f766e', a3: '#7e22ce', a4: '#a16207',
    },
  },
  mono: {
    label: 'Monochrome',
    dark: {
      bg: '#0a0a0a', surface: '#0f0f0f', panel: '#131313', panel2: '#1a1a1a', line: '#262626',
      fg: '#f2f2f2', muted: '#949494', a1: '#f2f2f2', a2: '#bdbdbd', a3: '#d4d4d4', a4: '#a3a3a3',
    },
    light: {
      bg: '#fafafa', surface: '#f2f2f2', panel: '#ffffff', panel2: '#f4f4f4', line: '#e2e2e2',
      fg: '#0a0a0a', muted: '#5c5c5c', a1: '#0a0a0a', a2: '#404040', a3: '#262626', a4: '#525252',
    },
  },
}

export const FONTS: Record<FontId, { label: string; display: string; body: string; mono: string; query: string }> = {
  sora: {
    label: 'Sora + Inter',
    display: "'Sora', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
    query: 'family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600',
  },
  inter: {
    label: 'Inter Black',
    display: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Fira Code', monospace",
    query: 'family=Inter:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500',
  },
  outfit: {
    label: 'Outfit',
    display: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
    mono: "'JetBrains Mono', monospace",
    query: 'family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500',
  },
  grotesk: {
    label: 'Space Grotesk',
    display: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Space Mono', monospace",
    query: 'family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700',
  },
  serif: {
    label: 'Fraunces (serif)',
    display: "'Fraunces', serif",
    body: "'Inter', sans-serif",
    mono: "'IBM Plex Mono', monospace",
    query: 'family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500',
  },
  mono: {
    label: 'All monospace',
    display: "'JetBrains Mono', monospace",
    body: "'JetBrains Mono', monospace",
    mono: "'JetBrains Mono', monospace",
    query: 'family=JetBrains+Mono:wght@400;500;600;700;800',
  },
}

export const LAYOUTS: Record<LayoutId, { label: string; blurb: string; palette: PaletteId; font: FontId }> = {
  terminal: {
    label: 'Terminal',
    blurb: 'Code-editor look with your photo, marquee and numbered sections.',
    palette: 'lime',
    font: 'sora',
  },
  neon: {
    label: 'Neon',
    blurb: 'Matrix-rain hero, typing roles, rating card and education timeline.',
    palette: 'cyber',
    font: 'inter',
  },
  clean: {
    label: 'Clean',
    blurb: 'Centered hero, glass cards and a calm, minimal feel.',
    palette: 'teal',
    font: 'outfit',
  },
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export function isHex(v: string) {
  return HEX.test(v.trim())
}

/** Black or near-white text, whichever reads better on the given color. */
export function onColor(hex: string) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return L > 0.36 ? '#07080b' : '#fbfcfe'
}

export function resolveTokens(theme: ThemeConfig, mode: Mode): Tokens {
  const base = { ...PALETTES[theme.palette]?.[mode] ?? PALETTES.lime[mode] }
  if (isHex(theme.accent)) base.a1 = theme.accent.trim()
  if (isHex(theme.accent2)) base.a2 = theme.accent2.trim()
  return base
}

let fontLink: HTMLLinkElement | null = null

export function applyTheme(theme: ThemeConfig, mode: Mode, initials: string) {
  const t = resolveTokens(theme, mode)
  const font = FONTS[theme.font] ?? FONTS.sora
  const root = document.documentElement
  const vars: Record<string, string> = {
    '--bg': t.bg,
    '--surface': t.surface,
    '--panel': t.panel,
    '--panel-2': t.panel2,
    '--line': t.line,
    '--fg': t.fg,
    '--muted': t.muted,
    '--a1': t.a1,
    '--a2': t.a2,
    '--a3': t.a3,
    '--a4': t.a4,
    '--on-a1': onColor(t.a1),
    '--fd': font.display,
    '--fb': font.body,
    '--fm': font.mono,
  }
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
  root.dataset.mode = mode
  root.style.colorScheme = mode

  const href = `https://fonts.googleapis.com/css2?${font.query}&display=swap`
  if (!fontLink) {
    fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)
  }
  if (fontLink.href !== href) fontLink.href = href

  setFavicon(initials, t.a1, t.bg)
}

function setFavicon(initials: string, accent: string, bg: string) {
  const text = (initials || '•').slice(0, 2).replace(/[<&>]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${bg}"/><text x="32" y="42" font-family="ui-monospace,monospace" font-size="26" font-weight="700" text-anchor="middle" fill="${accent}">${text}</text></svg>`
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/svg+xml'
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`
}
