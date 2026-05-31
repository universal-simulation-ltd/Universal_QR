import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { useQrStore } from '../../stores/qrStore'
import { buildQrOptions, cornerStampGeometry, showsCornerMark } from '../../lib/qr'
import { UNISIM_MARK } from '../../lib/unisimMark'

export default function QrPreview() {
  const config = useQrStore((s) => s.config)
  const holderRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  const hasData = config.data.trim().length > 0

  // Create the instance once and mount its canvas into the holder.
  useEffect(() => {
    const qr = new QRCodeStyling(buildQrOptions(config))
    qrRef.current = qr
    if (holderRef.current) {
      holderRef.current.innerHTML = ''
      qr.append(holderRef.current)
    }
    return () => {
      qrRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-render on any config change and keep the canvas responsive.
  useEffect(() => {
    qrRef.current?.update(buildQrOptions(config))
    const canvas = holderRef.current?.querySelector('canvas')
    if (canvas) {
      canvas.style.width = '100%'
      canvas.style.height = 'auto'
      canvas.style.maxWidth = `${config.size}px`
      canvas.style.display = 'block'
    }
  }, [config])

  const stamp = showsCornerMark(config)
  const { badge, inset } = cornerStampGeometry(config.size, config.margin)
  const badgePct = (badge / config.size) * 100
  const insetPct = (inset / config.size) * 100

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative w-full max-w-[360px] rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 ${
          config.bgTransparent ? 'checker-bg' : ''
        }`}
        style={config.bgTransparent ? undefined : { background: config.bgColor }}
      >
        {/* Tight wrapper so the corner-stamp % coordinates line up with the canvas */}
        <div className="relative leading-[0] qr-pop">
          <div ref={holderRef} aria-label={`QR code for ${config.name}`} role="img" />

          {stamp && (
            <img
              src={UNISIM_MARK}
              alt=""
              aria-hidden="true"
              className="absolute aspect-square rounded-lg shadow-md ring-1 ring-black/5"
              style={{
                width: `${badgePct}%`,
                right: `${insetPct}%`,
                bottom: `${insetPct}%`
              }}
            />
          )}

          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/85 backdrop-blur-sm text-center px-6">
              <p className="text-sm text-slate-500">
                Enter a URL or some text to generate your QR code.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center min-w-0 max-w-[360px]">
        <div className="font-semibold text-slate-900 truncate">{config.name || 'Untitled QR'}</div>
        {hasData && (
          <div className="text-xs text-slate-500 truncate" title={config.data}>
            {config.data}
          </div>
        )}
      </div>
    </div>
  )
}
