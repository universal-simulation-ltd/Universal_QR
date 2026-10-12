import { useMemo, useRef, useState } from 'react'
import { parseLink, probeLink, type ProbeResult } from '../../lib/linkCheck'
import { useT } from '../../i18n'

// "Test link is working" — the honest test (a tab, a human, a real page), plus
// a best-effort tick from the browser, asked for only when the visitor presses
// "Check link". See lib/linkCheck.ts for why the tick is
// worded as narrowly as it is: an opaque cross-origin response cannot tell a
// real page from a 404, so the tick claims only that the address answered.

export default function LinkCheck({
  value,
  onFix,
}: {
  value: string
  /** Offered when the address has no scheme — writes the `https://` form back
   *  into the field. Omitted where the field isn't directly editable. */
  onFix?: (href: string) => void
}) {
  const t = useT()
  const shape = useMemo(() => parseLink(value), [value])
  // The result belongs to the address it was asked about, so an answer that
  // arrives after the address has changed is never shown against the new one.
  const [result, setResult] = useState<{ href: string; status: 'checking' | ProbeResult } | null>(null)
  const latest = useRef<string | null>(null)

  // Only https gets probed. An http:// address from this https page is blocked
  // as mixed content before it leaves the browser, so probing one would report
  // every plain-http site on earth as dead.
  const probeHref = shape.kind === 'web' ? shape.href : null
  latest.current = probeHref
  // A new address starts with no answer: going back to one checked earlier
  // asks again rather than showing what it said then.
  const [askedOf, setAskedOf] = useState(probeHref)
  if (askedOf !== probeHref) {
    setAskedOf(probeHref)
    setResult(null)
  }
  const status = result && result.href === probeHref ? result.status : 'idle'

  // Nothing is fetched until the visitor presses "Check link". Probing while
  // they type would reach out to every half-finished hostname, and to the site
  // itself, without being asked.
  const check = async () => {
    if (!probeHref || status === 'checking') return
    const href = probeHref
    setResult({ href, status: 'checking' })
    const answer = await probeLink(href)
    if (latest.current !== href) return
    setResult({ href, status: answer })
  }

  if (shape.kind === 'empty' || shape.kind === 'other') return null

  const openHref = shape.kind === 'no-scheme' ? shape.suggestion : shape.href

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-800 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-orange-500/60 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4h5v5" />
            <path d="M16 4l-7 7" />
            <path d="M15 12v3.5A1.5 1.5 0 0 1 13.5 17h-9A1.5 1.5 0 0 1 3 15.5v-9A1.5 1.5 0 0 1 4.5 5H8" />
          </svg>
          {t('studio.test_link')}
        </a>
        {probeHref && (
          <button
            type="button"
            onClick={check}
            disabled={status === 'checking'}
            title={t('studio.check_link_title')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-800 transition-colors disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-orange-500/60 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="10" cy="10" r="7.5" />
              <path d="M6.8 10.2l2.2 2.2 4.2-4.6" />
            </svg>
            {t('studio.check_link')}
          </button>
        )}
        <Status status={status} shape={shape.kind} />
      </div>

      {shape.kind === 'no-scheme' && (
        <p className="text-xs text-amber-800 dark:text-amber-300">
          {t.rich('studio.no_scheme', { https: <code className="font-mono">https://</code> })}{' '}
          {onFix && (
            <button
              type="button"
              onClick={() => onFix(shape.suggestion)}
              className="font-semibold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-200"
            >
              {t('studio.add_https')}
            </button>
          )}
        </p>
      )}

      {shape.kind === 'insecure' && (
        <p className="text-xs text-amber-800 dark:text-amber-300">
          {t.rich('studio.insecure', { http: <code className="font-mono">http://</code> })}
        </p>
      )}
    </div>
  )
}

function Status({ status, shape }: { status: 'idle' | 'checking' | ProbeResult; shape: string }) {
  const t = useT()
  if (shape !== 'web' || status === 'idle') return null

  if (status === 'checking') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
        {t('studio.checking')}
      </span>
    )
  }

  if (status === 'ok') {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
        title={t('studio.responds_title')}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" strokeWidth="1.5" />
          <path d="M6.5 10.3l2.4 2.4 4.6-5" />
        </svg>
        {t('studio.responds')}
      </span>
    )
  }

  const message =
    status === 'offline'
      ? t('studio.offline')
      : status === 'timeout'
        ? t('studio.timeout')
        : t('studio.unreachable')

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400"
      title={t('studio.not_proof_title')}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" strokeWidth="1.5" />
        <path d="M10 6.5v4M10 13.5v.01" />
      </svg>
      {message}
    </span>
  )
}
