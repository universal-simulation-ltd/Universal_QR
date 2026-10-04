import { useEffect, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'
import { CONTAINER } from '../../lib/layout'
import {
  blockedCameraHelp,
  grantedHint,
  loadAskOnOpen,
  onCameraPermissionChange,
  readCameraPermission,
  rememberedByHint,
  saveAskOnOpen,
  type CameraPermission,
} from '../../lib/cameraAccess'
import { getT, useT } from '../../i18n'
import { classifyScan, type ScanContent, type UrlWarning } from '../../lib/scanResult'

// The camera "Scan" tab — decodes both QR codes and 1D barcodes from a live
// camera stream via @zxing/browser (lazy-loaded on first use). The stream is
// on-device only; frames are never uploaded.
//
// Opening the tab shows the camera rather than a "Start scanning" button. The
// PERMISSION is the only gate:
//
//   granted → start, always. No preference read, no tap, no overlay. Somebody
//              who has already said yes should not have to say it again.
//   denied  → never start. That request fails instantly and silently, so show
//              how to unblock instead, worded for the platform.
//   neither → nobody has answered, so this is the one state where asking is a
//              choice: the ask-on-open preference decides, and its checkbox is
//              shown only here because it means nothing anywhere else.
//
// See lib/cameraAccess.ts for who remembers the answer on each platform.

interface ScanResult {
  text: string
  format: string
  /** What the text is and, for a link, what to warn about — lib/scanResult.ts. */
  content: ScanContent
}

function toResult(text: string, format: string): ScanResult {
  return { text, format: format.replace(/_/g, ' '), content: classifyScan(text) }
}

export default function ScanStudio() {
  const t = useT()
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  // Bumped by every start and every stop. A start that finishes after its own
  // token has moved on has been superseded — under StrictMode the mount effect
  // runs, unmounts and runs again, and without this the first (already
  // cancelled) start hands back live controls nothing is holding, i.e. a camera
  // left on with no way to turn it off.
  const startToken = useRef(0)
  const [scanning, setScanning] = useState(false)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [copied, setCopied] = useState<'text' | 'password' | null>(null)
  const [readingImage, setReadingImage] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [askOnOpen, setAskOnOpen] = useState(loadAskOnOpen)
  // null until the first read resolves, so the controls below render nothing
  // rather than flashing the wrong affordance for a frame.
  const [permission, setPermission] = useState<CameraPermission | null>(null)

  function stop() {
    startToken.current += 1
    controlsRef.current?.stop()
    controlsRef.current = null
    setScanning(false)
    // A start still waiting on the permission prompt has just been superseded,
    // and its own `finally` only clears this for the CURRENT token — so
    // without this, stopping mid-start (or picking an image then) left the
    // overlay saying "Starting camera…" for good.
    setStarting(false)
  }

  async function start() {
    const token = (startToken.current += 1)
    setError(null)
    setResult(null)
    setStarting(true)
    try {
      // BarcodeFormat is re-exported by @zxing/browser (from @zxing/library), so
      // we don't depend on the transitive package directly.
      const { BrowserMultiFormatReader, BarcodeFormat } = await import('@zxing/browser')
      const reader = new BrowserMultiFormatReader()
      const controls = await reader.decodeFromVideoDevice(
        undefined, // default camera (the browser picks the rear camera on mobile)
        videoRef.current ?? undefined,
        (res) => {
          if (!res) return
          const text = res.getText()
          const fmt = BarcodeFormat[res.getBarcodeFormat()] ?? getT()('scan.format_unknown')
          setResult(toResult(text, fmt))
          stop()
        },
      )
      if (token !== startToken.current) {
        controls.stop()
        return
      }
      controlsRef.current = controls
      setScanning(true)
      // A stream we are holding IS a grant, whatever `permissions.query` can or
      // cannot tell us — this is how Safari and the Capacitor WebViews ever
      // leave 'unknown'.
      setPermission('granted')
    } catch (err) {
      if (token !== startToken.current) return
      const name = (err as { name?: string })?.name
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setPermission('denied')
        setError(blockedCameraHelp())
      } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        setError(getT()('scan.error_no_camera'))
      } else {
        // The raw message ("Not supported", "Could not start video source")
        // means nothing to anyone, and it sat in a red box under an overlay
        // that already said the camera could not start. One sentence instead.
        console.error(err)
        setError(getT()('scan.error_camera_start'))
      }
    } finally {
      if (token === startToken.current) setStarting(false)
    }
  }

  // Permission decides; the preference only gets a say when there is nothing to
  // decide from yet. The read is deliberately not blocking the mount: on the
  // browsers that don't implement it, it settles as 'unknown' and we ask anyway.
  useEffect(() => {
    let cancelled = false
    let unwatch = () => {}
    void (async () => {
      const state = await readCameraPermission()
      if (cancelled) return
      setPermission(state)
      if (state === 'granted') void start()
      else if (state === 'denied') setError(blockedCameraHelp())
      else if (askOnOpen) void start()
      // Granting from browser/OS settings with the tab open shouldn't need a
      // reload to take effect.
      unwatch = onCameraPermissionChange((next) => {
        if (cancelled) return
        setPermission(next)
        if (next === 'granted') setError(null)
      })
    })()
    return () => {
      cancelled = true
      unwatch()
      stop()
    }
    // Mount only: `askOnOpen` is read once here on purpose, and re-running this
    // on every change would restart a live scan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onToggleAskOnOpen(on: boolean) {
    setAskOnOpen(on)
    saveAskOnOpen(on)
    // Ticking the box IS a user gesture, so ask now rather than only next visit.
    // Unticking leaves a running scan alone: it decides whether we ask, not
    // whether the camera may run.
    if (on && !scanning && !starting) void start()
  }

  async function onCopy(value: string, which: 'text' | 'password') {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(which)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      /* clipboard blocked — the value is still visible to select manually */
    }
  }

  // A photo or screenshot with a code in it: the desktop case (somebody sent
  // you a QR code, it is on your screen, and the webcam cannot point at its
  // own monitor), and the "I took a picture of the poster" case on a phone.
  // Decoded on the device by the same reader as the camera; nothing uploads.
  async function onImage(file: File) {
    stop()
    setError(null)
    setResult(null)
    setReadingImage(true)
    const url = URL.createObjectURL(file)
    try {
      const { BrowserMultiFormatReader, BarcodeFormat } = await import('@zxing/browser')
      const res = await new BrowserMultiFormatReader().decodeFromImageUrl(url)
      const fmt = BarcodeFormat[res.getBarcodeFormat()] ?? getT()('scan.format_unknown')
      setResult(toResult(res.getText(), fmt))
    } catch {
      // zxing throws NotFoundException for "no code in this picture", and an
      // undecodable file (a HEIC the browser can't draw) lands here too. Both
      // get the same advice.
      setError(getT()('scan.image_no_code'))
    } finally {
      URL.revokeObjectURL(url)
      setReadingImage(false)
    }
  }

  return (
    <div className={`${CONTAINER} py-6 lg:py-10`}>
      <header className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t.rich('scan.headline', {
            em: <span className="text-orange-600 dark:text-orange-400">{t('scan.headline_em')}</span>,
          })}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {t('scan.intro')}
        </p>
      </header>

      <div className="mt-6 max-w-xl space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm dark:border-slate-800">
          <video
            ref={videoRef}
            className="aspect-[4/3] w-full object-cover"
            muted
            playsInline
          />
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/70 text-center px-6">
              <p className="text-sm text-slate-200">
                {readingImage
                  ? t('scan.reading_image')
                  : starting
                  ? t('scan.status_waiting')
                  : result
                    ? t('scan.status_scan_another')
                    : error ?? t('scan.status_camera_off')}
              </p>
              <button
                type="button"
                onClick={start}
                disabled={starting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-700 text-white text-sm font-semibold shadow-sm hover:bg-orange-800 disabled:opacity-60 transition-colors"
              >
                {starting ? t('scan.button_starting') : result ? t('scan.button_scan_again') : t('scan.button_start')}
              </button>
            </div>
          )}
          {scanning && (
            <button
              type="button"
              onClick={stop}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow hover:bg-white"
            >
              {t('scan.button_stop')}
            </button>
          )}
        </div>

        {/* Only ever shown while nobody has answered. Once permission is
            granted this is a control over a decision that no longer exists, and
            leaving it up invites someone to gate a camera they already allowed;
            once it is denied, "ask on open" is a promise the platform will not
            keep. Both states get a plain line of text instead. */}
        {permission !== null && permission !== 'granted' && permission !== 'denied' && (
          <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <input
              type="checkbox"
              checked={askOnOpen}
              onChange={(e) => onToggleAskOnOpen(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600"
            />
            <span className="text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {t('scan.ask_on_open')}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{rememberedByHint()}</span>
            </span>
          </label>
        )}

        {permission === 'granted' && (
          <p className="px-1 text-xs text-slate-500 dark:text-slate-400">{grantedHint()}</p>
        )}

        <div>
          {/* image/* and nothing broader: on iOS the accept list decides the
              action sheet, and this one should offer the photo library and
              the camera, never a document picker. */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              // Reset, or picking the same picture twice fires no change event.
              e.target.value = ''
              if (file) void onImage(file)
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={readingImage}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 disabled:opacity-60 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-orange-500/10"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2.5" y="4" width="15" height="12" rx="2" />
              <circle cx="7" cy="8.5" r="1.5" />
              <path d="M17.5 13l-4-4-7 7" />
            </svg>
            {readingImage ? t('scan.reading_image') : t('scan.scan_image')}
          </button>
        </div>

        {result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                {result.format}
              </span>
            </div>
            <p className="break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">
              {result.text}
            </p>
            <ResultDetails content={result.content} copied={copied} onCopy={onCopy} />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onCopy(result.text, 'text')}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-orange-500/10"
              >
                {copied === 'text' ? t('scan.copied') : t('scan.copy')}
              </button>
              <ResultAction content={result.content} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const WARNING_KEYS: Record<UrlWarning, 'scan.warn_insecure' | 'scan.warn_lookalike' | 'scan.warn_credentials' | 'scan.warn_ip' | 'scan.warn_shortener'> = {
  http: 'scan.warn_insecure',
  userinfo: 'scan.warn_credentials',
  lookalike: 'scan.warn_lookalike',
  ip: 'scan.warn_ip',
  shortener: 'scan.warn_shortener',
}

/** What a careful person should see before acting on the code: the website a
 *  link REALLY opens, anything odd about it, or the Wi-Fi details. */
function ResultDetails({
  content,
  copied,
  onCopy,
}: {
  content: ScanContent
  copied: 'text' | 'password' | null
  onCopy: (value: string, which: 'text' | 'password') => Promise<void>
}) {
  const t = useT()

  if (content.kind === 'web') {
    return (
      <div className="space-y-2">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t('scan.goes_to')}{' '}
          <strong className="break-all font-semibold text-slate-900 dark:text-white">{content.host}</strong>
        </p>
        {content.warnings.length > 0 && (
          <ul className="space-y-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            {content.warnings.map((w) => (
              <li key={w} className="flex gap-2">
                <span aria-hidden="true">⚠</span>
                <span>{t(WARNING_KEYS[w], { host: content.host })}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (content.kind === 'blocked') {
    return (
      <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
        {t('scan.blocked', { scheme: content.scheme })}
      </p>
    )
  }

  if (content.kind === 'wifi') {
    return (
      <div className="space-y-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{t('scan.wifi_network')}</div>
          <div className="break-all font-semibold text-slate-900 dark:text-white">{content.ssid}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{t('scan.wifi_password')}</div>
          {content.password ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="break-all font-mono text-slate-900 dark:text-white">{content.password}</span>
              <button
                type="button"
                onClick={() => void onCopy(content.password, 'password')}
                className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-orange-400 dark:border-slate-700 dark:text-slate-200"
              >
                {copied === 'password' ? t('scan.copied') : t('scan.copy_password')}
              </button>
            </div>
          ) : (
            <div className="text-slate-700 dark:text-slate-300">{t('scan.wifi_open')}</div>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{t('scan.wifi_join_hint')}</p>
      </div>
    )
  }

  return null
}

const ACTION_CLASS =
  'flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold transition-colors'

/** The one thing to DO with the code, when there is one. A `blocked` scheme
 *  never gets here as a link: it is only ever text to copy. */
function ResultAction({ content }: { content: ScanContent }) {
  const t = useT()
  if (content.kind === 'web') {
    const warned = content.warnings.length > 0
    return (
      <a
        href={content.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ACTION_CLASS} ${
          warned
            ? 'border border-amber-400 bg-white text-amber-900 hover:bg-amber-50 dark:border-amber-500/60 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-amber-500/10'
            : 'bg-orange-700 text-white hover:bg-orange-800'
        }`}
      >
        {warned ? t('scan.open_link_anyway') : t('scan.open_link')}
      </a>
    )
  }
  const primary = `${ACTION_CLASS} bg-orange-700 text-white hover:bg-orange-800 break-all`
  if (content.kind === 'tel') return <a href={content.href} className={primary}>{t('scan.call', { number: content.number })}</a>
  if (content.kind === 'sms') return <a href={content.href} className={primary}>{t('scan.send_text', { number: content.number })}</a>
  if (content.kind === 'email') return <a href={content.href} className={primary}>{t('scan.write_email', { address: content.address })}</a>
  return null
}
