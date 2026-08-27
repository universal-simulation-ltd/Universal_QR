import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useUniversal, useUser, useHostedUploads, type HostedUpload } from '@unisim/sdk'
import { useQrStore } from '../../stores/qrStore'
import { storeCurrentQr, deleteHostedQr, openHostedQr, HostedObjectMissingError } from '../../lib/hostedStore'
import SavePanel from './SavePanel'

const SIGNIN_URL = 'https://app.unisim.co.uk/login'
const GET_TOKENS_URL = 'https://www.unisim.co.uk/subscription.html'

// "Back up this QR code" — the free device gallery (SavePanel) plus online
// save against a Universal ID. Every account gets five free static QR saves
// (deliberately not advertised in the UI — migration 0127); past those the
// backend falls back to purchased tokens, which is when the "Get tokens"
// prompt appears. Dynamic codes keep their own single free token and are
// untouched by any of this. Backend: 0041 + 0127 + the SDK hosted helpers.
export default function HostedStoreDialog() {
  const open = useQrStore((s) => s.hostedStoreOpen)
  const setOpen = useQrStore((s) => s.setHostedStoreOpen)
  const config = useQrStore((s) => s.config)

  const { supabase, session, activeOrgId } = useUniversal()
  const { user } = useUser()
  const { uploads, loading: listLoading, refresh: refreshList } = useHostedUploads('qr')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // The backend has refused for lack of tokens (past the free saves AND the
  // wallet) — the one moment tokens are worth mentioning.
  const [outOfTokens, setOutOfTokens] = useState(false)
  // The one listed save that turned out to have no file behind it, if any.
  const [missingId, setMissingId] = useState<string | null>(null)
  const [justStored, setJustStored] = useState(false)

  if (!open) return null

  const signedIn = !!session?.user && session.user.is_anonymous !== true
  const hasData = config.data.trim().length > 0

  function close() {
    setOpen(false)
    setError(null)
    setOutOfTokens(false)
    setMissingId(null)
    setJustStored(false)
  }

  async function onStore() {
    if (!hasData || !activeOrgId || busy) return
    setBusy(true)
    setError(null)
    setOutOfTokens(false)
    try {
      const res = await storeCurrentQr(supabase, activeOrgId, config)
      if (!res.ok) {
        if (res.error === 'no_credits') setOutOfTokens(true)
        else setError(res.error ?? 'Could not store this QR code.')
      } else {
        setJustStored(true)
        refreshList()
        window.setTimeout(() => setJustStored(false), 2200)
      }
    } finally {
      setBusy(false)
    }
  }

  async function onOpen(upload: HostedUpload) {
    if (busy) return
    setBusy(true)
    setError(null)
    setMissingId(null)
    try {
      await openHostedQr(supabase, upload)
    } catch (e) {
      // A genuinely absent file is not an error to shrug at the user — it is a
      // dead entry, and the only useful thing to say is which one and what to
      // do about it. Anything else (offline, session expired) still surfaces as
      // an ordinary message, because deleting the save would be the wrong
      // advice.
      if (e instanceof HostedObjectMissingError) setMissingId(upload.id)
      else setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(upload: HostedUpload) {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const res = await deleteHostedQr(supabase, upload)
      if (!res.ok) setError(res.error ?? 'Could not delete this QR code.')
      else {
        setOutOfTokens(false)
        setMissingId((id) => (id === upload.id ? null : id))
        refreshList()
      }
    } finally {
      setBusy(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Back up this QR code</h2>
          <button onClick={close} aria-label="Close" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Save to browser (local, this device only): the device gallery. */}
          <SavePanel />

          {/* Save to your account — online, against a Universal ID. Saved codes
              also surface in Universal PDF's QR dialog for the same account. */}
          <div className="rounded-xl border border-orange-200 bg-white p-4">
            {!signedIn ? (
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm text-slate-700">Sign in with your <strong>Universal ID</strong> to store QR codes online.</p>
                <a href={SIGNIN_URL} className="mt-2 inline-flex rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800">
                  Create / sign in with Universal ID →
                </a>
              </div>
            ) : (
              <div>
                <div className="rounded-lg bg-orange-50/60 px-3 py-2 text-sm text-slate-600">{user?.email}</div>

                {hasData ? (
                  <button
                    onClick={onStore}
                    disabled={busy}
                    className="mt-3 w-full rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-50"
                  >
                    {busy ? 'Backing up…' : justStored ? '✓ Backed up' : 'Back up this QR online'}
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">Enter a URL or some text to back up your QR code.</p>
                )}

                {outOfTokens && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm text-amber-800">
                      You have no tokens left. Get more to keep storing QR codes online, or delete a backup below.
                    </p>
                    <a href={GET_TOKENS_URL} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg bg-orange-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-800">
                      Get tokens →
                    </a>
                  </div>
                )}

                {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

                {/* The user's hosted QR codes */}
                <div className="mt-4">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Your backups</p>
                  {listLoading ? (
                    <p className="text-xs text-slate-400">Loading…</p>
                  ) : uploads.length === 0 ? (
                    <p className="text-xs text-slate-400">None yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {uploads.map((u) => (
                        <li key={u.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                          <div className="flex items-center gap-2">
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-medium text-slate-700">{u.file_name || 'qr-code.png'}</span>
                              <span className="block text-[10px] text-slate-400">{new Date(u.created_at).toLocaleDateString()}</span>
                            </span>
                            <button onClick={() => onOpen(u)} disabled={busy} className="shrink-0 rounded-md bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800 disabled:opacity-50">Open</button>
                            <button onClick={() => onDelete(u)} disabled={busy} className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-600 disabled:opacity-50" title="Delete this backup">Delete</button>
                          </div>

                          {/* A save with nothing behind it. Say which file, say
                              plainly that the upload never finished, and make
                              clearing it up one click — the save slot comes
                              back with it, so there is nothing to lose by
                              tidying. This replaces storage's bare "Object not
                              found", which read like the app had mislaid the
                              user's QR code. */}
                          {missingId === u.id && (
                            <div
                              role="alert"
                              data-testid="hosted-missing"
                              className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2"
                            >
                              <p className="text-[11px] leading-snug text-amber-900">
                                <strong className="font-semibold">{u.file_name || 'qr-code.png'}</strong> is listed here,
                                but there is no file behind it — this save never finished, so nothing was ever stored.
                                Your save slot is still being held for it.
                              </p>
                              <button
                                type="button"
                                onClick={() => onDelete(u)}
                                disabled={busy}
                                className="mt-2 inline-flex rounded-md bg-amber-700 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
                              >
                                Remove this entry and free the save
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
