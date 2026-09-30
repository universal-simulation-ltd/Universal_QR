import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useUniversal, useUser, useHostedUploads, isNativeShell, type HostedUpload } from '@unisim/sdk'
import { useQrStore } from '../../stores/qrStore'
import { useFreeAllowance, isNearLimit } from '../../lib/useFreeAllowance'
import { storeCurrentQr, deleteHostedQr, openHostedQr, HostedObjectMissingError } from '../../lib/hostedStore'
import SavePanel from './SavePanel'
import { intlLocale, useT } from '../../i18n'

const SIGNIN_URL = 'https://app.unisim.co.uk/login'
// Was /subscription.html until 2026-09-07, when the marketing site split its
// one pricing page in two. The token card moved to /everyday; /subscription is
// now the Assess Suite's seats and licences and sells no tokens at all — so a
// link left pointing there sends someone who wants one upload to a £5,000/year
// enterprise plan. Not a 404: it renders fine, which is why it needed finding.
const GET_TOKENS_URL = 'https://www.unisim.co.uk/everyday'
// App Review 3.1.1 / 3.1.3: inside the iOS/Android app nothing may send people
// to buy tokens outside the store — no link, no "get more" nudge. The phone
// app still spends tokens bought elsewhere; it just never points at the shop.
// The web and desktop builds keep the link.
const SHOW_TOKEN_PURCHASE = !isNativeShell()

// "Back up this QR code" — the free device gallery (SavePanel) plus online
// save against a Universal ID. Every org gets a counted free allowance of
// static QR saves (0127, counted since 0199 — only mentioned from 80%); past it the
// backend falls back to purchased tokens, and only when both are used up does
// the number-free "You've used your free online backups" prompt appear.
// Dynamic codes keep their own single free token and are untouched by any of
// this. Backend: 0041 + 0127 + the SDK hosted helpers.
export default function HostedStoreDialog() {
  const t = useT()
  const open = useQrStore((s) => s.hostedStoreOpen)
  const setOpen = useQrStore((s) => s.setHostedStoreOpen)
  const config = useQrStore((s) => s.config)

  const { supabase, session, activeOrgId } = useUniversal()
  const { user } = useUser()
  const { uploads, loading: listLoading, refresh: refreshList } = useHostedUploads('qr')
  // Fetched only while the dialog is open — it is mounted on every page.
  const { status: allowance, refresh: refreshAllowance } = useFreeAllowance(
    'qr_static',
    open && !!session?.user && session.user.is_anonymous !== true,
  )

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
        else setError(res.error ?? t('dynamic.backup_could_not_store'))
      } else {
        setJustStored(true)
        refreshList()
        refreshAllowance()
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
      if (!res.ok) setError(res.error ?? t('dynamic.backup_could_not_delete'))
      else {
        setOutOfTokens(false)
        setMissingId((id) => (id === upload.id ? null : id))
        refreshList()
        refreshAllowance()
      }
    } finally {
      setBusy(false)
    }
  }

  return createPortal(
    <div
      // ⚠️ z-[1100], not z-50/z-[80]. <UniversalAppsNavBar /> sets an INLINE
      // `zIndex: 1000`, which no Tailwind class can reach (the scale stops at
      // z-50) and which an inline style would win anyway. Below it the bar
      // stays brightly lit on top of the backdrop and — since it is only
      // `position: relative`, so it is in view whenever the page is at scroll
      // top — paints over the top of this dialog, which is what put the header
      // "behind the nav bar".
      //
      // The padding carries the safe-area insets for the Capacitor build: the
      // WKWebView is full-screen and index.html asks for `viewport-fit=cover`,
      // so without them the dialog runs under the Dynamic Island at the top and
      // the home indicator at the bottom. In a browser the insets are 0.
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/50 dark:bg-black/60 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}
    >
      {/* A column that never outgrows the padded overlay: the header is pinned
          and only the body scrolls. `100%` is the overlay minus its safe-area
          padding; `100svh` is the SMALL viewport, which is what is actually on
          screen in mobile Safari while the toolbars are showing. The shorter of
          the two is the one that fits. Previously this whole box was the
          scroller (`max-h-[88vh] overflow-y-auto`), so the title scrolled away
          with the content the moment there was more of it than would fit. */}
      <div className="flex max-h-[min(100%,100svh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900 dark:ring-1 dark:ring-slate-700">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{t('dynamic.backup_title')}</h2>
          <button onClick={close} aria-label={t('dynamic.backup_close')} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* min-h-0 so this can actually shrink inside the flex column — without
            it a flex item's min-height is its content and nothing scrolls. */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-5">
          {/* Save to browser (local, this device only): the device gallery. */}
          <SavePanel />

          {/* Save to your account — online, against a Universal ID. Saved codes
              also surface in Universal PDF's QR dialog for the same account. */}
          <div className="rounded-xl border border-orange-200 bg-white p-4 dark:border-orange-500/30 dark:bg-slate-900">
            {!signedIn ? (
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-700 dark:text-slate-200">{t.rich('dynamic.backup_sign_in', { id: <strong>Universal ID</strong> })}</p>
                <a href={SIGNIN_URL} className="mt-2 inline-flex rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800">
                  {t('dynamic.signin_button')}
                </a>
              </div>
            ) : (
              <div>
                <div className="rounded-lg bg-orange-50/60 px-3 py-2 text-sm text-slate-600 dark:bg-orange-500/10 dark:text-slate-300">{user?.email}</div>

                {hasData ? (
                  <button
                    onClick={onStore}
                    disabled={busy}
                    className="mt-3 w-full rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-50"
                  >
                    {busy ? t('dynamic.backup_backing_up') : justStored ? t('dynamic.backup_backed_up') : t('dynamic.backup_back_up_online')}
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t('dynamic.backup_needs_data')}</p>
                )}

                {/* Only once 80% of the free backups are used, and only while
                    there is still room; numbers from the backend, never typed in. */}
                {!outOfTokens && isNearLimit(allowance) && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {t('dynamic.backup_near_limit', { used: allowance.used, limit: allowance.limit })}
                  </p>
                )}

                {outOfTokens && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/40">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {SHOW_TOKEN_PURCHASE
                        ? t('dynamic.backup_used_up')
                        : t('dynamic.backup_used_up_native')}
                    </p>
                    {SHOW_TOKEN_PURCHASE && (
                    <a href={GET_TOKENS_URL} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg bg-orange-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-800">
                      {t('dynamic.get_more')}
                    </a>
                    )}
                  </div>
                )}

                {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

                {/* The user's hosted QR codes */}
                <div className="mt-4">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('dynamic.backup_your_backups')}</p>
                  {listLoading ? (
                    <p className="text-xs text-slate-400">{t('dynamic.loading')}</p>
                  ) : uploads.length === 0 ? (
                    <p className="text-xs text-slate-400">{t('dynamic.backup_none_yet')}</p>
                  ) : (
                    <ul className="space-y-2">
                      {uploads.map((u) => (
                        <li key={u.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-medium text-slate-700 dark:text-slate-200">{u.file_name || 'qr-code.png'}</span>
                              <span className="block text-[10px] text-slate-400">{new Date(u.created_at).toLocaleDateString(intlLocale(t.lang))}</span>
                            </span>
                            <button onClick={() => onOpen(u)} disabled={busy} className="shrink-0 rounded-md bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800 disabled:opacity-50">{t('dynamic.backup_open')}</button>
                            <button onClick={() => onDelete(u)} disabled={busy} className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-600 disabled:opacity-50 dark:hover:text-rose-400" title={t('dynamic.backup_delete_title')}>{t('dynamic.delete')}</button>
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
                              className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 dark:border-amber-900/60 dark:bg-amber-950/40"
                            >
                              <p className="text-[11px] leading-snug text-amber-900 dark:text-amber-200">
                                {t.rich('dynamic.backup_missing', { file: <strong className="font-semibold">{u.file_name || 'qr-code.png'}</strong> })}
                              </p>
                              <button
                                type="button"
                                onClick={() => onDelete(u)}
                                disabled={busy}
                                className="mt-2 inline-flex rounded-md bg-amber-700 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
                              >
                                {t('dynamic.backup_remove_entry')}
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
