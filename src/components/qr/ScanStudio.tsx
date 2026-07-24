import { useEffect, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'
import { CONTAINER } from '../../lib/layout'

// The camera "Scan" tab — decodes both QR codes and 1D barcodes from a live
// camera stream via @zxing/browser (lazy-loaded on first use). The stream is
// on-device only; frames are never uploaded. Scanning is start-on-tap so simply
// opening the tab never triggers a camera-permission prompt.

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
  const [scanning, setScanning] = useState(false)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [copied, setCopied] = useState(false)

  function stop() {
    controlsRef.current?.stop()
    controlsRef.current = null
    setScanning(false)
  }

  // Always release the camera when the component unmounts (tab switch away).
  useEffect(() => () => stop(), [])

  async function start() {
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
      controlsRef.current = controls
      setScanning(true)
    } catch (err) {
      const name = (err as { name?: string })?.name
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError('Camera access was blocked. Allow camera access in your browser, then try again.')
      } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        setError('No camera was found on this device.')
      } else {
        setError(err instanceof Error ? err.message : 'Could not start the camera.')
      }
    } finally {
      setStarting(false)
    }
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
                {result
                  ? 'Scan another code when you’re ready.'
                  : 'The camera is off until you start scanning.'}
              </p>
              <button
                type="button"
                onClick={start}
                disabled={starting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold shadow-sm hover:bg-orange-700 disabled:opacity-60 transition-colors"
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
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
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
