import { useEffect, useRef, useState } from 'react'
import { CONTAINER } from '../../lib/layout'
import { useQrStore } from '../../stores/qrStore'
import {
  SYMBOLOGIES,
  symbologyById,
  renderBarcodeToCanvas,
  renderBarcodeToSvg,
  barcodeFileStem,
  type BarcodeSymbology,
} from '../../lib/barcode'

// The standalone 1D-barcode generator (the "Barcode" tab). Separate from the
// QR designer: 1D codes are built with bwip-js (lazy-loaded) and are
// static-only — no branding/logo, no hosted/dynamic variant. Everything renders
// on the device; nothing is uploaded.
type ExportKind = 'png' | 'svg'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function BarcodeStudio() {
  const symbology = useQrStore((s) => s.barcodeSymbology)
  const value = useQrStore((s) => s.barcodeValue)
  const setSymbology = useQrStore((s) => s.setBarcodeSymbology)
  const setValue = useQrStore((s) => s.setBarcodeValue)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [renderError, setRenderError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')

  const def = symbologyById(symbology)
  const trimmed = value.trim()
  const validationError = trimmed.length === 0 ? null : def.validate(trimmed)
  // Whether the current input produced a drawable barcode (no validation error
  // AND bwip-js didn't throw on render).
  const hasBarcode = trimmed.length > 0 && !validationError && !renderError

  // Live preview: re-render whenever the symbology or value changes. bwip-js
  // throws on an unrenderable value (e.g. a wrong check digit that passed the
  // cheap regex) — surface that as an error and clear the canvas.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (trimmed.length === 0 || validationError) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
      setRenderError(null)
      return
    }
    let cancelled = false
    renderBarcodeToCanvas(canvas, symbology, trimmed)
      .then(() => {
        if (!cancelled) setRenderError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
        setRenderError(err instanceof Error ? err.message : 'That value can’t be encoded.')
      })
    return () => {
      cancelled = true
    }
  }, [symbology, trimmed, validationError])

  async function onDownload(kind: ExportKind) {
    if (!hasBarcode || busy) return
    setBusy(true)
    try {
      const stem = barcodeFileStem(symbology, trimmed)
      if (kind === 'svg') {
        const svg = await renderBarcodeToSvg(symbology, trimmed)
        triggerDownload(new Blob([svg], { type: 'image/svg+xml' }), `${stem}.svg`)
      } else {
        const canvas = canvasRef.current
        if (!canvas) return
        const blob: Blob = await new Promise((resolve, reject) =>
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/png'),
        )
        triggerDownload(blob, `${stem}.png`)
      }
    } catch (err) {
      alert(`Sorry, that export failed: ${(err as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  async function onCopy() {
    const canvas = canvasRef.current
    if (!hasBarcode || !canvas) return
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      setCopied('fail')
      setTimeout(() => setCopied('idle'), 1800)
      return
    }
    try {
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('copy failed'))), 'image/png'),
      )
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    setTimeout(() => setCopied('idle'), 1800)
  }

  return (
    <div className={`${CONTAINER} py-6 lg:py-10`}>
      <header className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Barcodes that <span className="text-orange-600">just. work.</span>
        </h1>
        <p className="mt-2 text-slate-600">
          Generate retail and shipping barcodes — EAN, UPC, Code 128, Code 39, ITF-14 — right in your
          browser. Nothing is uploaded. Download as PNG or SVG.
        </p>
      </header>

      <div className="mt-6 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-10 items-start">
        {/* Controls */}
        <div className="order-1 space-y-4">
          <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Barcode type</h2>
            <p className="mt-0.5 mb-3 text-xs text-slate-500">
              Pick the symbology your scanner or system expects.
            </p>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Barcode type">
              {SYMBOLOGIES.map((s) => {
                const active = s.id === symbology
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSymbology(s.id as BarcodeSymbology)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      active
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700'
                    }`}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <label htmlFor="barcode-value" className="block font-semibold text-slate-900">
              Value
            </label>
            <p className="mt-0.5 mb-3 text-sm text-slate-500">{def.hint}</p>
            <input
              id="barcode-value"
              type="text"
              inputMode={def.id === 'code128' || def.id === 'code39' ? 'text' : 'numeric'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={def.placeholder}
              aria-invalid={!!validationError || !!renderError}
              className={`w-full px-4 py-3 rounded-xl border text-base text-slate-900 font-mono focus:outline-none focus:ring-2 ${
                validationError || renderError
                  ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                  : 'border-slate-300 focus:ring-orange-500/40 focus:border-orange-500'
              }`}
            />
            {(validationError || renderError) && (
              <p className="mt-2 text-sm text-red-600">{validationError ?? renderError}</p>
            )}
          </section>
        </div>

        {/* Preview + export */}
        <div className="order-2 lg:sticky lg:top-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex min-h-[140px] items-center justify-center rounded-xl bg-slate-50 p-4">
              {hasBarcode ? (
                <canvas ref={canvasRef} className="max-w-full" />
              ) : (
                <>
                  {/* Keep the canvas mounted (hidden) so the ref exists for the
                      render effect, and show a placeholder over it. */}
                  <canvas ref={canvasRef} className="hidden" />
                  <p className="text-sm text-slate-400 text-center">
                    {trimmed.length === 0
                      ? 'Enter a value to preview your barcode.'
                      : 'Fix the value above to preview your barcode.'}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onDownload('png')}
                disabled={!hasBarcode || busy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold shadow-sm hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {busy ? 'Preparing…' : 'Download PNG'}
              </button>
              <button
                type="button"
                onClick={() => onDownload('svg')}
                disabled={!hasBarcode || busy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Download SVG
              </button>
            </div>
            <button
              type="button"
              onClick={onCopy}
              disabled={!hasBarcode}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 disabled:opacity-50 transition-colors"
            >
              {copied === 'ok'
                ? '✓ Copied to clipboard'
                : copied === 'fail'
                  ? 'Copy not supported — use Download'
                  : 'Copy PNG to clipboard'}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Always scan-test before printing at small sizes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
