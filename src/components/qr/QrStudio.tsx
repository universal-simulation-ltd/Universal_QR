import { useState } from 'react'
import Controls from './Controls'
import QrPreview from './QrPreview'
import { useQrStore } from '../../stores/qrStore'
import { copyQrToClipboard, downloadQr } from '../../lib/download'
import type { ExportFormat } from '../../lib/qr'

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'svg', label: 'SVG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' }
]

export default function QrStudio() {
  const config = useQrStore((s) => s.config)
  const [format, setFormat] = useState<ExportFormat>('png')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')

  const hasData = config.data.trim().length > 0

  async function onDownload() {
    if (!hasData || busy) return
    setBusy(true)
    try {
      await downloadQr(config, format)
    } catch (err) {
      console.error(err)
      alert(`Sorry, that export failed: ${(err as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  async function onCopy() {
    if (!hasData) return
    const ok = await copyQrToClipboard(config)
    setCopied(ok ? 'ok' : 'fail')
    setTimeout(() => setCopied('idle'), 1800)
  }

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <header className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            QR codes that <span className="text-orange-600">look like you</span>.
          </h1>
          <p className="mt-2 text-slate-600">
            Pick your colours, shape the modules, drop in a logo — it renders live and never leaves
            your device. Download as PNG, SVG, JPEG or WebP.
          </p>
        </header>

        <div className="mt-6 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-10 items-start">
          {/* Controls */}
          <div className="order-2 lg:order-1">
            <Controls />
          </div>

          {/* Preview + export */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-6 space-y-4">
            <QrPreview />

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div>
                <span className="block text-sm font-medium text-slate-700 mb-1.5">Format</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFormat(f.value)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        format === f.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onDownload}
                disabled={!hasData || busy}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M4 16h12" />
                </svg>
                {busy ? 'Preparing…' : `Download ${format.toUpperCase()}`}
              </button>

              <button
                type="button"
                onClick={onCopy}
                disabled={!hasData}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/40 disabled:opacity-50 transition-colors"
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
    </div>
  )
}
