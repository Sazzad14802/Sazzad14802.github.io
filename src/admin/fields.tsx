import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp, Copy, Loader2, Plus, Trash2, Upload as UploadIcon, X } from 'lucide-react'
import { uploadMedia } from '../lib/content'
import { supabase } from '../lib/supabase'

export const input =
  'w-full rounded-lg bg-zinc-900 border border-zinc-700/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/15 transition'

export function Card({ title, desc, children, action }: { title: string; desc?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          {desc && <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{desc}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: ReactNode; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-zinc-300 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  )
}

export function Text({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: ReactNode
  type?: string
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input id={id} type={type} className={input} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

export function Num({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: ReactNode }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type="number"
        className={input}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      />
    </Field>
  )
}

export function Area({
  label,
  value,
  onChange,
  rows = 3,
  hint,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  hint?: ReactNode
  placeholder?: string
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <textarea id={id} rows={rows} className={`${input} resize-y leading-relaxed`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: ReactNode }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer select-none">
      <span>
        <span className="block text-sm text-zinc-200">{label}</span>
        {hint && <span className="block text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{hint}</span>}
      </span>
      <span className="relative shrink-0 mt-0.5">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="block w-9 h-5 rounded-full bg-zinc-700 peer-checked:bg-emerald-500 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400/40" />
        <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  )
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  hint?: ReactNode
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <select id={id} className={input} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

/** Chips: type and press Enter or comma to add. */
export function Tags({ label, value, onChange, placeholder = 'Type and press Enter', hint }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; hint?: ReactNode }) {
  const [text, setText] = useState('')
  const id = useId()
  const add = (raw: string) => {
    const next = raw.split(',').map((s) => s.trim()).filter((s) => s && !value.includes(s))
    if (next.length) onChange([...value, ...next])
    setText('')
  }
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className={`${input} flex flex-wrap gap-1.5 items-center min-h-[42px] py-1.5`}>
        {value.map((t, i) => (
          <span key={`${t}-${i}`} className="inline-flex items-center gap-1 rounded-md bg-zinc-800 border border-zinc-700 pl-2 pr-1 py-0.5 text-xs">
            {t}
            <button type="button" className="text-zinc-500 hover:text-red-400" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <X size={13} />
            </button>
          </span>
        ))}
        <input
          id={id}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-zinc-500"
          value={text}
          placeholder={value.length ? '' : placeholder}
          onChange={(e) => (e.target.value.includes(',') ? add(e.target.value) : setText(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add(text)
            } else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1))
          }}
          onBlur={() => text.trim() && add(text)}
        />
      </div>
    </Field>
  )
}

/** One item per line. Keeps its own text so blank lines can be typed. */
export function Lines({ label, value, onChange, hint, rows = 4 }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: ReactNode; rows?: number }) {
  const [text, setText] = useState(value.join('\n'))
  const last = useRef(value)
  useEffect(() => {
    if (value !== last.current && value.join('\n') !== text.split('\n').map((s) => s.trim()).filter(Boolean).join('\n')) setText(value.join('\n'))
    last.current = value
  }, [value])
  const id = useId()
  return (
    <Field label={label} hint={hint ?? 'One per line.'} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        className={`${input} resize-y leading-relaxed`}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          const next = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
          last.current = next
          onChange(next)
        }}
      />
    </Field>
  )
}

export function ColorField({ label, value, onChange, fallback, hint }: { label: string; value: string; onChange: (v: string) => void; fallback: string; hint?: ReactNode }) {
  const id = useId()
  const valid = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          aria-label={`${label} picker`}
          className="h-[38px] w-12 shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 p-1 cursor-pointer"
          value={valid ? (value.length === 4 ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}` : value) : fallback}
          onChange={(e) => onChange(e.target.value)}
        />
        <input id={id} className={input} value={value} placeholder={`${fallback} (from palette)`} onChange={(e) => onChange(e.target.value)} />
        {value && (
          <button type="button" className="shrink-0 text-xs text-zinc-400 hover:text-zinc-100 px-2" onClick={() => onChange('')}>
            Reset
          </button>
        )}
      </div>
    </Field>
  )
}

export function Upload({
  label,
  value,
  onChange,
  accept,
  folder,
  image,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  accept: string
  folder: string
  image?: boolean
  hint?: ReactNode
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const pick = async (file: File | undefined) => {
    if (!file) return
    setErr('')
    if (file.size > 10 * 1024 * 1024) return setErr('That file is over 10 MB. Please use a smaller one.')
    setBusy(true)
    try {
      onChange(await uploadMedia(file, folder))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="flex gap-3 items-start">
        {image && (
          <div className="w-16 h-16 shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden grid place-items-center text-[10px] text-zinc-500">
            {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : 'none'}
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-2">
          <input id={id} className={input} value={value} placeholder="https://… or upload a file" onChange={(e) => onChange(e.target.value)} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={busy || !supabase}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <UploadIcon size={13} />}
              {busy ? 'Uploading…' : 'Upload file'}
            </button>
            {value && (
              <a href={value} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-zinc-100 underline underline-offset-2">
                Open
              </a>
            )}
            {value && (
              <button type="button" onClick={() => onChange('')} className="text-xs text-zinc-400 hover:text-red-400">
                Remove
              </button>
            )}
          </div>
          {err && <p className="text-xs text-red-400">{err}</p>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
    </Field>
  )
}

export function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr
  const next = arr.slice()
  const [it] = next.splice(from, 1)
  next.splice(to, 0, it)
  return next
}

/** Editable list of cards with add / reorder / duplicate / delete. */
export function List<T>({
  items,
  onChange,
  newItem,
  title,
  render,
  addLabel = 'Add item',
  startOpen = false,
}: {
  items: T[]
  onChange: (items: T[]) => void
  newItem: () => T
  title: (item: T, i: number) => string
  render: (item: T, set: (patch: Partial<T>) => void, i: number) => ReactNode
  addLabel?: string
  startOpen?: boolean
}) {
  const [open, setOpen] = useState<Set<number>>(() => (startOpen ? new Set(items.map((_, i) => i)) : new Set()))
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
  const set = (i: number, patch: Partial<T>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  const swapOpen = (a: number, b: number) =>
    setOpen((s) => {
      const n = new Set<number>()
      s.forEach((k) => n.add(k === a ? b : k === b ? a : k))
      return n
    })
  return (
    <div className="space-y-2">
      {items.map((it, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-950/50">
            <div className="flex items-center gap-1 pl-3 pr-1.5 py-1.5">
              <button type="button" onClick={() => toggle(i)} className="flex-1 min-w-0 text-left py-1 flex items-center gap-2" aria-expanded={isOpen}>
                <ChevronDown size={15} className={`shrink-0 text-zinc-500 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                <span className="truncate text-sm text-zinc-200">{title(it, i) || <span className="text-zinc-500">Untitled</span>}</span>
              </button>
              <IconBtn label="Move up" disabled={i === 0} onClick={() => (onChange(move(items, i, i - 1)), swapOpen(i, i - 1))}>
                <ChevronUp size={15} />
              </IconBtn>
              <IconBtn label="Move down" disabled={i === items.length - 1} onClick={() => (onChange(move(items, i, i + 1)), swapOpen(i, i + 1))}>
                <ChevronDown size={15} />
              </IconBtn>
              <IconBtn label="Duplicate" onClick={() => onChange([...items.slice(0, i + 1), structuredClone(it), ...items.slice(i + 1)])}>
                <Copy size={14} />
              </IconBtn>
              <IconBtn
                label="Delete"
                danger
                onClick={() => {
                  if (confirm(`Delete “${title(it, i) || 'this item'}”?`)) {
                    onChange(items.filter((_, j) => j !== i))
                    setOpen(new Set())
                  }
                }}
              >
                <Trash2 size={14} />
              </IconBtn>
            </div>
            {isOpen && <div className="border-t border-zinc-800 p-3 sm:p-4 space-y-4">{render(it, (p) => set(i, p), i)}</div>}
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => {
          onChange([...items, newItem()])
          setOpen((s) => new Set(s).add(items.length))
        }}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-700 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
      >
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  )
}

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`p-1.5 rounded-md text-zinc-500 disabled:opacity-25 disabled:pointer-events-none hover:bg-zinc-800 ${danger ? 'hover:text-red-400' : 'hover:text-zinc-100'}`}
    >
      {children}
    </button>
  )
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>
}
