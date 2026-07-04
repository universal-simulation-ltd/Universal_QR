import { useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import Controls from './Controls'
import QrPreview from './QrPreview'
import HostedStoreDialog from './HostedStoreDialog'
import { useQrStore, type StudioMode } from '../../stores/qrStore'
import { copyQrToClipboard, downloadQr } from '../../lib/download'
import { DEFAULT_CONFIG, PRESETS, type ExportFormat, type QrConfig } from '../../lib/qr'

// Which config keys count as "branding has been customised" — used to decide
// whether to nudge the user towards the Branding tab (see ModeToggle). The
// Advanced keys only gate the "Reset all" button, which clears both tabs.
const BRANDING_KEYS: (keyof QrConfig)[] = [
  'fgColor', 'bgColor', 'bgTransparent', 'useGradient', 'gradientColor',
  'gradientRotation', 'matchCornerColor', 'cornerColor',
  'logoDataUrl', 'logoSize', 'logoMargin', 'hideBackgroundDots', 'unisimMark',
]
const ADVANCED_KEYS: (keyof QrConfig)[] = [
  'dotType', 'cornerSquareType', 'cornerDotType', 'size', 'margin',
]

function hasChangedFrom(config: QrConfig, keys: (keyof QrConfig)[]): boolean {
  return keys.some((k) => JSON.stringify(config[k]) !== JSON.stringify(DEFAULT_CONFIG[k]))
}

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'svg', label: 'SVG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' }
]

export default function QrStudio() {
  const config = useQrStore((s) => s.config)
  const mode = useQrStore((s) => s.mode)
  const setMode = useQrStore((s) => s.setMode)
  const reset = useQrStore((s) => s.reset)
  const setHostedStoreOpen = useQrStore((s) => s.setHostedStoreOpen)
  const [format, setFormat] = useState<ExportFormat>('png')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')

  const { session } = useUniversal()
  const signedIn = !!session?.user && session.user.is_anonymous !== true

  const hasData = config.data.trim().length > 0
  const brandingChanged = hasChangedFrom(config, BRANDING_KEYS)
  const advancedChanged = hasChangedFrom(config, ADVANCED_KEYS)
  // Nudge un-branded visitors towards the Branding tab. A signed-in user is
  // treated as already having company branding, so they don't get nudged.
  const brandingNudge = !brandingChanged && !signedIn

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
    <div>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <header className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            QR codes that <span className="text-orange-600">just work</span>.
          </h1>
          <p className="mt-2 text-slate-600">
            Pick your colours, shape the modules, drop in a logo — it renders live and never leaves
            your device. Download as PNG, SVG, JPEG or WebP.
          </p>
        </header>

        <div className="mt-6 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-10 items-start">
          {/* Controls */}
          <div className="order-1 lg:order-1 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <ModeToggle
                mode={mode}
                setMode={setMode}
                brandingNudge={brandingNudge}
              />
              {(brandingChanged || advancedChanged) && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-slate-500 hover:text-orange-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-orange-300 transition-colors"
                >
                  Reset all
                </button>
              )}
            </div>
            {mode === 'simple' && <SimplePanel />}
            {mode === 'branding' && <BrandingPanel />}
            {mode === 'advanced' && <Controls />}
          </div>

          {/* Preview + export */}
          <div className="order-2 lg:order-2 lg:sticky lg:top-6 space-y-4">
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
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onDownload}
                  disabled={!hasData || busy}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold shadow-sm hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M4 16h12" />
                  </svg>
                  {busy ? 'Preparing…' : `Download ${format.toUpperCase()}`}
                </button>
                <button
                  type="button"
                  onClick={() => setHostedStoreOpen(true)}
                  title="Back up — save to this device or online"
                  aria-label="Back up"
                  className="shrink-0 inline-flex items-center justify-center px-3 rounded-xl border border-slate-300 text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <path d="M17 21v-8H7v8" />
                    <path d="M7 3v5h8" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={onCopy}
                disabled={!hasData}
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

      <HostedStoreDialog />
    </div>
  )
}

// Three-tab Simple / Branding / Advanced switcher.
// The Branding tab shows a small orange dot to nudge un-branded, signed-out
// visitors towards customising their code (see brandingNudge in QrStudio).
function ModeToggle({
  mode,
  setMode,
  brandingNudge,
}: {
  mode: StudioMode
  setMode: (m: StudioMode) => void
  brandingNudge: boolean
}) {
  const tabs: { id: StudioMode; label: string; nudge?: boolean }[] = [
    { id: 'simple', label: 'Simple' },
    { id: 'branding', label: 'Branding', nudge: brandingNudge },
    { id: 'advanced', label: 'Advanced' },
  ]
  return (
    <div className="inline-flex p-1 bg-slate-200/70 rounded-xl" role="tablist" aria-label="Editor mode">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={mode === t.id}
          onClick={() => setMode(t.id)}
          className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === t.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.label}
          {t.nudge && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  )
}

// Simple mode: just paste a URL and go.
function SimplePanel() {
  const data = useQrStore((s) => s.config.data)
  const update = useQrStore((s) => s.update)
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <label htmlFor="simple-url" className="block font-semibold text-slate-900">
        Website address
      </label>
      <p className="mt-0.5 mb-3 text-sm text-slate-500">
        Paste the link your QR code should open.
      </p>
      <input
        id="simple-url"
        type="url"
        inputMode="url"
        value={data}
        onChange={(e) => update({ data: e.target.value })}
        placeholder="https://example.com"
        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
      />
    </section>
  )
}

// Branding mode: colours, gradient and logo only — the most common customisation.
function BrandingPanel() {
  const config = useQrStore((s) => s.config)
  const update = useQrStore((s) => s.update)
  const applyPatch = useQrStore((s) => s.applyPatch)
  const setLogo = useQrStore((s) => s.setLogo)
  const clearLogo = useQrStore((s) => s.clearLogo)
  const fileRef = useRef<HTMLInputElement>(null)

  function onLogoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, or SVG).')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogo(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-5">
      {/* URL input so users don't have to switch back to Simple */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <label htmlFor="branding-url" className="block font-semibold text-slate-900">Website address</label>
        <p className="mt-0.5 mb-3 text-sm text-slate-500">The link your QR code opens.</p>
        <input
          id="branding-url"
          type="url"
          inputMode="url"
          value={config.data}
          onChange={(e) => update({ data: e.target.value })}
          placeholder="https://example.com"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
        />
      </section>

      {/* Style presets */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Style presets</h2>
        <p className="mt-0.5 mb-3 text-xs text-slate-500">A starting point — tweak the colours and logo below.</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPatch(p.patch)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* Colours */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Colours</h2>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <BrandSwatch label="Modules" value={config.fgColor} onChange={(v) => update({ fgColor: v })} />
            <BrandSwatch label="Background" value={config.bgColor} onChange={(v) => update({ bgColor: v })} disabled={config.bgTransparent} />
          </div>
          <BrandToggle label="Transparent background" checked={config.bgTransparent} onChange={(v) => update({ bgTransparent: v })} hint="Export a PNG/SVG with no background fill." />
          <BrandToggle label="Gradient modules" checked={config.useGradient} onChange={(v) => update({ useGradient: v })} />
          {config.useGradient && (
            <div className="pl-4 space-y-3 border-l-2 border-orange-100">
              <BrandSwatch label="Gradient end" value={config.gradientColor} onChange={(v) => update({ gradientColor: v })} />
              <BrandRange label="Gradient angle" value={config.gradientRotation} min={0} max={360} step={5} suffix="°" onChange={(v) => update({ gradientRotation: v })} />
            </div>
          )}
          <BrandToggle label="Two-tone corners" checked={!config.matchCornerColor} onChange={(v) => update({ matchCornerColor: !v })} hint="Give the three finder corners their own colour." />
          {!config.matchCornerColor && (
            <div className="pl-4">
              <BrandSwatch label="Corner colour" value={config.cornerColor} onChange={(v) => update({ cornerColor: v })} />
            </div>
          )}
        </div>
      </section>

      {/* Logo & branding */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Logo & branding</h2>
        <div className="mt-3 space-y-3">
          <input ref={fileRef} type="file" accept="image/*,.svg" hidden onChange={onLogoPick} />
          {config.logoDataUrl ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <img src={config.logoDataUrl} alt="Logo preview" className="w-12 h-12 rounded-lg object-contain bg-white ring-1 ring-slate-200 p-1" />
              <div className="flex-1 text-sm text-slate-600">Custom logo added</div>
              <button type="button" onClick={() => fileRef.current?.click()} className="text-xs font-medium text-slate-600 hover:text-orange-700 px-2 py-1">Replace</button>
              <button type="button" onClick={clearLogo} className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1">Remove</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-700 transition-colors"
            >
              <span aria-hidden="true">🖼</span> Upload a logo (PNG, JPG, SVG)
            </button>
          )}
          {config.logoDataUrl && (
            <>
              <BrandRange label="Logo size" value={Math.round(config.logoSize * 100)} min={10} max={50} step={1} suffix="%" onChange={(v) => update({ logoSize: v / 100 })} />
              <BrandRange label="Logo padding" value={config.logoMargin} min={0} max={24} step={1} suffix=" px" onChange={(v) => update({ logoMargin: v })} />
            </>
          )}
          <BrandToggle label="Clear modules behind logo" checked={config.hideBackgroundDots} onChange={(v) => update({ hideBackgroundDots: v })} />
          <BrandToggle
            label="Include UNI·SIM mark"
            checked={config.unisimMark}
            onChange={(v) => update({ unisimMark: v })}
            hint={config.logoDataUrl ? 'Adds a small UNI·SIM badge in the bottom-right corner.' : 'Shown in the centre until you add your own logo.'}
          />
        </div>
      </section>
    </div>
  )
}

function BrandSwatch({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-slate-300">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 shrink-0" aria-label={label} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${label} hex value`} className="w-full min-w-0 text-sm font-mono uppercase text-slate-700 focus:outline-none" />
      </div>
    </div>
  )
}

function BrandToggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div>
      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <button type="button" role="switch" aria-checked={checked ? 'true' : 'false'} onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-orange-600' : 'bg-slate-300'}`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </label>
      {hint && <p className="mt-1 text-xs text-slate-500 pr-14">{hint}</p>}
    </div>
  )
}

function BrandRange({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix?: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <span className="text-xs font-medium text-slate-500 tabular-nums">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} className="w-full accent-orange-600" />
    </div>
  )
}
