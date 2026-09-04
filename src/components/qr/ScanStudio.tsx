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
  isUrl: boolean
}

function looksLikeUrl(text: string): boolean {
  return /^https?:\/\/\S+$/i.test(text.trim())
}

export default function ScanStudio() {
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
  const [copied, setCopied] = useState(false)
  const [askOnOpen, setAskOnOpen] = useState(loadAskOnOpen)
  // null until the first read resolves, so the controls below render nothing
  // rather than flashing the wrong affordance for a frame.
  const [permission, setPermission] = useState<CameraPermission | null>(null)

  function stop() {
    startToken.current += 1
    controlsRef.current?.stop()
    controlsRef.current = null
    setScanning(false)
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
          const fmt = BarcodeFormat[res.getBarcodeFormat()] ?? 'Unknown'
          setResult({ text, format: fmt.replace(/_/g, ' '), isUrl: looksLikeUrl(text) })
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
        setError('No camera was found on this device.')
      } else {
        setError(err instanceof Error ? err.message : 'Could not start the camera.')
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

  async function onCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the value is still visible to select manually */
    }
  }

  return (
    <div className={`${CONTAINER} py-6 lg:py-10`}>
      <header className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Scan a <span className="text-orange-600">QR code or barcode</span>
        </h1>
        <p className="mt-2 text-slate-600">
          Point your camera at any QR code or 1D barcode (EAN, UPC, Code 128, Code 39…). Decoding
          happens on your device — the camera feed never leaves your browser.
        </p>
      </header>

      <div className="mt-6 max-w-xl space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm">
          <video
            ref={videoRef}
            className="aspect-[4/3] w-full object-cover"
            muted
            playsInline
          />
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/70 text-center px-6">
              <p className="text-sm text-slate-200">
                {starting
                  ? 'Waiting for camera access…'
                  : result
                    ? 'Scan another code when you’re ready.'
                    : error
                      ? 'The camera could not start.'
                      : 'The camera is off.'}
              </p>
              <button
                type="button"
                onClick={start}
                disabled={starting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-700 text-white text-sm font-semibold shadow-sm hover:bg-orange-800 disabled:opacity-60 transition-colors"
              >
                {starting ? 'Starting camera…' : result ? 'Scan again' : 'Start scanning'}
              </button>
            </div>
          )}
          {scanning && (
            <button
              type="button"
              onClick={stop}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow hover:bg-white"
            >
              Stop
            </button>
          )}
        </div>

        {/* Only ever shown while nobody has answered. Once permission is
            granted this is a control over a decision that no longer exists, and
            leaving it up invites someone to gate a camera they already allowed;
            once it is denied, "ask on open" is a promise the platform will not
            keep. Both states get a plain line of text instead. */}
        {permission !== null && permission !== 'granted' && permission !== 'denied' && (
          <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <input
              type="checkbox"
              checked={askOnOpen}
              onChange={(e) => onToggleAskOnOpen(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600"
            />
            <span className="text-sm">
              <span className="font-medium text-slate-800">
                Ask for camera access when I open Scan
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">{rememberedByHint()}</span>
            </span>
          </label>
        )}

        {permission === 'granted' && (
          <p className="px-1 text-xs text-slate-500">{grantedHint()}</p>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                {result.format}
              </span>
            </div>
            <p className="break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">
              {result.text}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCopy}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              {result.isUrl && (
                <a
                  href={result.text}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-orange-700 text-white text-sm font-semibold hover:bg-orange-800 transition-colors"
                >
                  Open link ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
