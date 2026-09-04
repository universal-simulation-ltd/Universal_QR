import { useEffect, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'
import { CONTAINER } from '../../lib/layout'
import {
  blockedCameraHelp,
  loadAutoStart,
  readCameraPermission,
  rememberedByHint,
  saveAutoStart,
} from '../../lib/cameraAccess'

// The camera "Scan" tab — decodes both QR codes and 1D barcodes from a live
// camera stream via @zxing/browser (lazy-loaded on first use). The stream is
// on-device only; frames are never uploaded.
//
// ⚠️ Opening the tab now asks for the camera immediately (it used to be
// start-on-tap). The permission answer is remembered by the platform, not by
// us — see `lib/cameraAccess.ts` for what each platform actually does and for
// the opt-out, which is the only part of "remember it" that is ours to keep.
// The one state we never auto-start from is `denied`: that request fails
// instantly and silently, so the tab shows how to unblock instead.

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
  const [autoStart, setAutoStart] = useState(loadAutoStart)

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
    } catch (err) {
      if (token !== startToken.current) return
      const name = (err as { name?: string })?.name
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
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

  // Opening the tab reaches for the camera, and leaving it always releases it.
  // The permission read is deliberately not awaited before mount finishes: on
  // the browsers that don't implement it, it settles as 'unknown' and we ask
  // anyway.
  useEffect(() => {
    let cancelled = false
    if (autoStart) {
      void (async () => {
        const state = await readCameraPermission()
        if (cancelled) return
        if (state === 'denied') setError(blockedCameraHelp())
        else void start()
      })()
    }
    return () => {
      cancelled = true
      stop()
    }
    // Mount only: toggling the checkbox later starts the camera itself (below),
    // and re-running this on every change would restart a live scan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onToggleAutoStart(on: boolean) {
    setAutoStart(on)
    saveAutoStart(on)
    // Ticking the box IS a user gesture, so honour it now rather than only on
    // the next visit. Unticking leaves a running scan alone — it only decides
    // what happens when the tab is opened.
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

        <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <input
            type="checkbox"
            checked={autoStart}
            onChange={(e) => onToggleAutoStart(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600"
          />
          <span className="text-sm">
            <span className="font-medium text-slate-800">
              Start the camera when I open Scan
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">{rememberedByHint()}</span>
          </span>
        </label>

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
