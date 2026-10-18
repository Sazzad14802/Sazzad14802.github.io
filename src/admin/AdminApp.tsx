import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, Lock } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Editor from './Editor'
import { input } from './fields'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid place-items-center bg-zinc-950 text-zinc-100 px-4 font-[Inter,system-ui,sans-serif]">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'error' | 'info'; text: string } | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setMsg({ kind: 'error', text: error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message })
  }

  const forgot = async () => {
    if (!supabase) return
    if (!email.trim()) return setMsg({ kind: 'error', text: 'Type your email first, then click “Forgot password”.' })
    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/admin` })
    setBusy(false)
    setMsg(error ? { kind: 'error', text: error.message } : { kind: 'info', text: 'If that email has an account, a reset link is on its way.' })
  }

  return (
    <Shell>
      <form onSubmit={submit} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-400/10 text-emerald-300 grid place-items-center">
            <Lock size={17} />
          </div>
          <div>
            <h1 className="font-semibold">Sign in</h1>
            <p className="text-xs text-zinc-400">Edit your portfolio</p>
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-zinc-300 mb-1.5">
            Email
          </label>
          <input id="email" type="email" autoComplete="username" required className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-zinc-300 mb-1.5">
            Password
          </label>
          <input id="password" type="password" autoComplete="current-password" required className={input} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && <p className={`text-xs ${msg.kind === 'error' ? 'text-red-300' : 'text-sky-300'}`}>{msg.text}</p>}
        <button type="submit" disabled={busy} className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-emerald-400 text-zinc-950 py-2 text-sm font-semibold hover:bg-emerald-300 disabled:opacity-60">
          {busy && <Loader2 size={15} className="animate-spin" />}
          Sign in
        </button>
        <div className="flex justify-between text-xs">
          <button type="button" onClick={forgot} className="text-zinc-400 hover:text-zinc-100">
            Forgot password?
          </button>
          <a href="/" className="text-zinc-400 hover:text-zinc-100">
            ← Back to site
          </a>
        </div>
      </form>
    </Shell>
  )
}

function SetPassword({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    if (pw.length < 8) return setErr('Use at least 8 characters.')
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    setBusy(false)
    if (error) setErr(error.message)
    else onDone()
  }
  return (
    <Shell>
      <form onSubmit={submit} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <h1 className="font-semibold">Choose a new password</h1>
        <input type="password" autoComplete="new-password" className={input} value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        {err && <p className="text-xs text-red-300">{err}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-lg bg-emerald-400 text-zinc-950 py-2 text-sm font-semibold hover:bg-emerald-300 disabled:opacity-60">
          Save password
        </button>
      </form>
    </Shell>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null)
  const [recovering, setRecovering] = useState(false)

  useEffect(() => {
    document.documentElement.style.colorScheme = 'dark'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s)
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
    })
    return () => {
      data.subscription.unsubscribe()
      robots.remove()
    }
  }, [])

  if (!supabase) return <Editor />
  if (session === undefined)
    return (
      <Shell>
        <div className="grid place-items-center text-zinc-500">
          <Loader2 className="animate-spin" />
        </div>
      </Shell>
    )
  if (recovering && session) return <SetPassword onDone={() => setRecovering(false)} />
  if (!session) return <Login />
  return <Editor email={session.user.email} onSignOut={() => supabase!.auth.signOut()} />
}
