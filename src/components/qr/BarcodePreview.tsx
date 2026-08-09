import { useEffect, useRef } from 'react'
import { useQrStore } from '../../stores/qrStore'
import { renderBarcodeToCanvas, symbologyById } from '../../lib/barcode'

/**
 * The 1D preview, shown in place of QrPreview when Advanced ▸ Type is a barcode.
 *
 * Kept as its own component rather than a branch inside QrPreview: that file
 * carries two carefully-sequenced render paths (the library's live canvas, and
 * the async composited one for shaped codes) plus the corner-stamp overlay
 * geometry, and none of it applies to a barcode. Threading a third path through
 * it would put the fragile part at risk for no shared behaviour.
 *
 * The canvas stays MOUNTED even when there's nothing to draw, so the render
 * effect always has its ref — the placeholder sits over it rather than
 * replacing it.
 */
export default function BarcodePreview({ onError }: { onError: (message: string | null) => void }) {
  const symbology = useQrStore((s) => s.barcodeSymbology)
  const value = useQrStore((s) => s.barcodeValue)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const def = symbologyById(symbology)
  const trimmed = value.trim()
  const validationError = trimmed.length === 0 ? null : def.validate(trimmed)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const clear = () => canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)

    if (trimmed.length === 0 || validationError) {
      clear()
      onError(validationError)
      return
    }

    // bwip-js throws on a value the cheap regex let through (a wrong check
    // digit, say), so the real validation is the render itself.
    let cancelled = false
    renderBarcodeToCanvas(canvas, symbology, trimmed)
      .then(() => { if (!cancelled) onError(null) })
      .catch((err: unknown) => {
        if (cancelled) return
        clear()
        onError(err instanceof Error ? err.message : 'That value can’t be encoded.')
      })
    return () => { cancelled = true }
  }, [symbology, trimmed, validationError, onError])

  const drawable = trimmed.length > 0 && !validationError

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[360px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex min-h-[140px] items-center justify-center rounded-xl bg-slate-50 p-4">
          <canvas ref={canvasRef} className={drawable ? 'max-w-full' : 'hidden'} />
          {!drawable && (
            <p className="text-center text-sm text-slate-400">
              {trimmed.length === 0
                ? 'Enter a value to preview your barcode.'
                : 'Fix the value above to preview your barcode.'}
            </p>
          )}
        </div>
      </div>

      <div className="min-w-0 max-w-[360px] text-center">
        <div className="truncate font-semibold text-slate-900">{def.label}</div>
        {drawable && (
          <div className="truncate font-mono text-xs text-slate-500" title={trimmed}>
            {trimmed}
          </div>
        )}
      </div>
    </div>
  )
}
