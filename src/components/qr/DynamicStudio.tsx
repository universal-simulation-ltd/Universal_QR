import { useCallback, useEffect, useState } from 'react'
import { useUniversal, useUser, useCredits, useAppFreeToken } from '@unisim/sdk'
import { CONTAINER } from '../../lib/layout'
import { useQrStore } from '../../stores/qrStore'
import {
  createDynamicCode,
  deleteDynamicCode,
  listDynamicCodes,
  type DynamicCode,
} from '../../lib/dynamicCodes'
import DynamicCodeCard from './DynamicCodeCard'

const SIGNIN_URL = 'https://app.unisim.co.uk/login'
const GET_TOKENS_URL = 'https://www.unisim.co.uk/subscription.html'

// The "Dynamic" tab — a hosted/PRO feature. A dynamic code encodes a short
// redirect the owner can re-point later, and every scan is counted. Each live
// code holds one token (the org's free "Everyday" token first, then a purchased
// credit), returned when the code is deleted. The free static designer is a
// sibling tab and is never touched by any of this.
export default function DynamicStudio() {
  const { supabase, session, activeOrgId } = useUniversal()
  const { user } = useUser()
  const { credits, refresh: refreshCredits } = useCredits()
  const { status: freeToken, refresh: refreshFreeToken } = useAppFreeToken('qr')
  const setView = useQrStore((s) => s.setView)

  const [codes, setCodes] = useState<DynamicCode[] | null>(null)
  const [target, setTarget] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signedIn = !!session?.user && session.user.is_anonymous !== true
  const tokens = credits ?? 0
  const canCreate = freeToken === 'available' || tokens > 0

  const refreshList = useCallback(() => {
    if (!signedIn) { setCodes([]); return }
    listDynamicCodes(supabase)
      .then(setCodes)
      .catch(() => setCodes([]))
  }, [supabase, signedIn])

  useEffect(() => { refreshList() }, [refreshList, activeOrgId])

  // Pick up a sign-in that completed on the hub (another tab / full-page login)
  // without needing a manual refresh. When signed out, watch for the tab regaining
  // focus or an auth event; if a real (non-anonymous) session now exists but the
  // app still initialised signed-out, reload once so the SDK — and its token /
  // credit hooks — re-read it. Runs only while signed out, so it can't loop.
  useEffect(() => {
    if (signedIn) return
    let cancelled = false
    const catchUp = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const s = data.session
        if (!cancelled && s?.user && s.user.is_anonymous !== true) window.location.reload()
      } catch { /* offline / not signed in — nothing to catch up */ }
    }
    const onAuth = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') catchUp()
    })
    const onVisible = () => { if (document.visibilityState === 'visible') catchUp() }
    window.addEventListener('focus', catchUp)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      onAuth.data.subscription.unsubscribe()
      window.removeEventListener('focus', catchUp)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [signedIn, supabase])

  async function onCreate() {
    if (!target.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      const res = await createDynamicCode(supabase, target, name)
      if (!res.ok) {
        setError(
          res.error === 'no_credits'
            ? 'You have no tokens left. Get more to create another dynamic code.'
            : res.error === 'token_in_use'
              ? `Your free QR token is already in use${res.heldBy ? ` (${res.heldBy})` : ''} — delete that code or add tokens.`
              : res.error === 'no_org'
                ? 'Your Universal ID has no organisation yet — open the hub once to finish setup.'
                : res.error ?? 'Could not create this dynamic code.',
        )
      } else {
        setTarget('')
        setName('')
        refreshCredits()
        refreshFreeToken()
        refreshList()
      }
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(code: DynamicCode) {
    if (busy) return
    if (!window.confirm(`Delete "${code.name?.trim() || code.code}"? Anyone who scans it will hit a "not active" page, and its token comes back to you.`)) return
    setBusy(true)
    setError(null)
    try {
      const res = await deleteDynamicCode(supabase, code.id)
      if (!res.ok) setError(res.error ?? 'Could not delete this code.')
      else {
        refreshCredits()
        refreshFreeToken()
        refreshList()
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`${CONTAINER} py-6 lg:py-10`}>
      <header className="max-w-2xl">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Dynamic QR codes
          </h1>
          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">Hosted</span>
        </div>
        <p className="mt-2 text-slate-600">
          One printed code, a destination you can change any time — plus a live scan count.
          The link stays fixed (<code className="text-slate-500">opensource.unisim.co.uk/qr/r/…</code>); you
          repoint where it sends people whenever you like.
        </p>
      </header>

      {!signedIn ? (
        <div className="mt-6 max-w-2xl rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Sign in to create dynamic codes</h2>
          <p className="mt-1 text-sm text-slate-600">
            Dynamic codes are hosted against your <strong>Universal ID</strong> so they can redirect and
            record scans. Each live code uses one token — every account gets one free, and deleting a code
            returns its token. The plain <button type="button" className="font-semibold text-orange-600 hover:text-orange-700" onClick={() => setView('static')}>Static</button> designer stays 100% free and on-device.
          </p>
          <a href={SIGNIN_URL} className="mt-4 inline-flex rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700">
            Create / sign in with Universal ID →
          </a>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
          {/* Create panel */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">New dynamic code</h2>
              <span className="rounded-lg bg-orange-50/70 px-2.5 py-1 text-xs font-semibold text-orange-700">
                {freeToken === 'available'
                  ? tokens > 0 ? `Free token + ${tokens} purchased` : 'Free token available'
                  : `${tokens} token${tokens === 1 ? '' : 's'}`}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Signed in as {user?.email}</p>

            <label htmlFor="dyn-target" className="mt-4 block text-sm font-medium text-slate-700">Destination URL</label>
            <input
              id="dyn-target"
              type="url"
              inputMode="url"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="https://example.com/landing"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />

            <label htmlFor="dyn-name" className="mt-3 block text-sm font-medium text-slate-700">Label <span className="font-normal text-slate-400">(optional)</span></label>
            <input
              id="dyn-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Spring campaign flyer"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />

            {canCreate ? (
              <button
                type="button"
                onClick={onCreate}
                disabled={busy || !target.trim()}
                className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {busy ? 'Creating…' : 'Create dynamic code (1 token)'}
              </button>
            ) : freeToken === null ? (
              <p className="mt-4 text-sm text-slate-500">Checking your tokens…</p>
            ) : (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  {freeToken === 'held'
                    ? 'Your free QR token is in use — delete a code below to get it back, or add tokens.'
                    : 'You have no tokens left.'}
                </p>
                <a href={GET_TOKENS_URL} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg bg-orange-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-700">
                  Get tokens →
                </a>
              </div>
            )}
            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          </section>

          {/* Codes list */}
          <section>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">Your dynamic codes</h2>
            {codes === null ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : codes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
                <p className="text-sm text-slate-500">No dynamic codes yet. Create your first one on the left — you can re-point it and watch the scans roll in.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {codes.map((c) => (
                  <DynamicCodeCard key={c.id} code={c} busy={busy} onChanged={refreshList} onDelete={onDelete} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
