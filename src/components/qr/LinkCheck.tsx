import { useEffect, useMemo, useState } from 'react'
import { parseLink, probeLink, type ProbeResult } from '../../lib/linkCheck'

// "Test link is working" — the honest test (a tab, a human, a real page), plus
// a best-effort tick from the browser. See lib/linkCheck.ts for why the tick is
// worded as narrowly as it is: an opaque cross-origin response cannot tell a
// real page from a 404, so the tick claims only that the address answered.

/** Successful probes only, keyed by href, for the life of the tab. A miss is
 *  deliberately NOT cached — the usual cause is the network, and a visitor who
 *  fixes theirs should get a fresh answer rather than a stale cross. */
const ANSWERED = new Set<string>()

const DEBOUNCE_MS = 900

export default function LinkCheck({
  value,
  onFix,
}: {
  value: string
  /** Offered when the address has no scheme — writes the `https://` form back
   *  into the field. Omitted where the field isn't directly editable. */
  onFix?: (href: string) => void
}) {
  const shape = useMemo(() => parseLink(value), [value])
  const [status, setStatus] = useState<'idle' | 'checking' | ProbeResult>('idle')

  // Only https gets probed. An http:// address from this https page is blocked
  // as mixed content before it leaves the browser, so probing one would report
  // every plain-http site on earth as dead.
  const probeHref = shape.kind === 'web' ? shape.href : null

  useEffect(() => {
    if (!probeHref) {
      setStatus('idle')
      return
    }
    if (ANSWERED.has(probeHref)) {
      setStatus('ok')
      return
    }
    setStatus('idle')
    let cancelled = false
    // Debounced: this fires while someone is still typing their URL, and every
    // keystroke reaching out to a half-finished hostname is both wasteful and
    // a stream of red herrings.
    const timer = setTimeout(async () => {
      setStatus('checking')
      const result = await probeLink(probeHref)
      if (cancelled) return
      if (result === 'ok') ANSWERED.add(probeHref)
      setStatus(result)
    }, DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [probeHref])

  if (shape.kind === 'empty' || shape.kind === 'other') return null

  const openHref = shape.kind === 'no-scheme' ? shape.suggestion : shape.href

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-800 transition-colors"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4h5v5" />
            <path d="M16 4l-7 7" />
            <path d="M15 12v3.5A1.5 1.5 0 0 1 13.5 17h-9A1.5 1.5 0 0 1 3 15.5v-9A1.5 1.5 0 0 1 4.5 5H8" />
          </svg>
          Test link is working
        </a>
        <Status status={status} shape={shape.kind} />
      </div>

      {shape.kind === 'no-scheme' && (
        <p className="text-xs text-amber-800">
          No <code className="font-mono">https://</code> in front — some scanners will open this,
          others will read it as plain text.{' '}
          {onFix && (
            <button
              type="button"
              onClick={() => onFix(shape.suggestion)}
              className="font-semibold underline underline-offset-2 hover:text-amber-900"
            >
              Add https://
            </button>
          )}
        </p>
      )}

      {shape.kind === 'insecure' && (
        <p className="text-xs text-amber-800">
          An <code className="font-mono">http://</code> address. It will open, but phones show it as
          “Not secure” — and it can’t be checked from this page.
        </p>
      )}
    </div>
  )
}

function Status({ status, shape }: { status: 'idle' | 'checking' | ProbeResult; shape: string }) {
  if (shape !== 'web' || status === 'idle') return null

  if (status === 'checking') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-300" aria-hidden="true" />
        Checking the address…
      </span>
    )
  }

  if (status === 'ok') {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700"
        title="Something answered at that address. It can't tell a real page from a 404 — open it to be sure."
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" strokeWidth="1.5" />
          <path d="M6.5 10.3l2.4 2.4 4.6-5" />
        </svg>
        The address responds
      </span>
    )
  }

  const message =
    status === 'offline'
      ? 'You’re offline — not checked'
      : status === 'timeout'
        ? 'No answer yet — it may just be slow'
        : 'Couldn’t reach it from this browser'

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700"
      title="Not proof the link is broken — some sites refuse this kind of check. Open it in a tab to be sure."
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" strokeWidth="1.5" />
        <path d="M10 6.5v4M10 13.5v.01" />
      </svg>
      {message}
    </span>
  )
}
