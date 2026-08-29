import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useFileDrop, useUniversal } from '@unisim/sdk'
import Controls from './Controls'
import QrPreview from './QrPreview'
import BarcodePreview from './BarcodePreview'
import HostedStoreDialog from './HostedStoreDialog'
import LinkCheck from './LinkCheck'
import { useQrStore, type StudioMode } from '../../stores/qrStore'
import { CONTAINER } from '../../lib/layout'
import { copyQrToClipboard, downloadQr } from '../../lib/download'
import { saveBlob } from '../../lib/saveFile'
import { DEFAULT_CONFIG, PRESETS, type ExportFormat, type QrConfig } from '@unisim/qr'
import { barcodeFileStem, renderBarcodeToSvg, symbologyById } from '../../lib/barcode'

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

function hasChangedFrom(config: QrConfig, keys: (keyof QrConfig)[], baseline: QrConfig): boolean {
  return keys.some((k) => JSON.stringify(config[k]) !== JSON.stringify(baseline[k]))
}

/** What "untouched" means for this session.
 *
 *  Not DEFAULT_CONFIG any more. Every load now lands on a random preset, so a
 *  visitor who has changed nothing at all still has a config that differs from
 *  the defaults in half a dozen colour and shape fields — which would light up
 *  "Reset all" before they had done anything to reset, and switch OFF the
 *  Branding nudge for exactly the un-branded visitors it is there to catch.
 *  Measuring against the preset the style came from restores both. */
function presetBaseline(presetName: string | null): QrConfig {
  const patch = PRESETS.find((p) => p.name === presetName)?.patch
  return patch ? { ...DEFAULT_CONFIG, ...patch } : DEFAULT_CONFIG
}

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'svg', label: 'SVG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' }
]

// A barcode exports as PNG or SVG only. JPEG would put lossy artefacts on the
// one thing that has to stay crisp — the bar edges — and WebP is no use to the
// print and label software these end up in.
const BARCODE_FORMATS: { value: ExportFormat; label: string }[] = FORMATS.slice(0, 2)

// The barcode exports share the QR exports' save path — a download in a
// browser, the share sheet on a phone. See `saveFile.ts`.
const triggerDownload = saveBlob

/** The live barcode canvas, found by the same aria-label the preview sets. */
function barcodeCanvas(): HTMLCanvasElement | null {
  return document.querySelector('[data-barcode-canvas] canvas')
}

export default function QrStudio() {
  const config = useQrStore((s) => s.config)
  const mode = useQrStore((s) => s.mode)
  const setMode = useQrStore((s) => s.setMode)
  const reset = useQrStore((s) => s.reset)
  const presetName = useQrStore((s) => s.presetName)
  const setHostedStoreOpen = useQrStore((s) => s.setHostedStoreOpen)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [menuOpen, setMenuOpen] = useState(false)

  const codeType = useQrStore((s) => s.codeType)
  const setCodeType = useQrStore((s) => s.setCodeType)
  const symbology = useQrStore((s) => s.barcodeSymbology)
  const barcodeValue = useQrStore((s) => s.barcodeValue)
  const [barcodeError, setBarcodeError] = useState<string | null>(null)
  const isBarcode = codeType === 'barcode'

  const { session } = useUniversal()
  const signedIn = !!session?.user && session.user.is_anonymous !== true

  const trimmedBarcode = barcodeValue.trim()
  // "Is there something to export?" differs by type: a QR needs data, a barcode
  // needs a value its symbology actually accepts AND that bwip-js could draw.
  const hasData = isBarcode
    ? trimmedBarcode.length > 0 &&
      !symbologyById(symbology).validate(trimmedBarcode) &&
      !barcodeError
    : config.data.trim().length > 0
  const baseline = presetBaseline(presetName)
  const brandingChanged = hasChangedFrom(config, BRANDING_KEYS, baseline)
  const advancedChanged = hasChangedFrom(config, ADVANCED_KEYS, baseline)
  // Nudge un-branded visitors towards the Branding tab. A signed-in user is
  // treated as already having company branding, so they don't get nudged.
  const brandingNudge = !brandingChanged && !signedIn

  async function onDownload(format: ExportFormat) {
    if (!hasData || busy) return
    setMenuOpen(false)
    setBusy(true)
    try {
      if (isBarcode) {
        const stem = barcodeFileStem(symbology, trimmedBarcode)
        if (format === 'svg') {
          const svg = await renderBarcodeToSvg(symbology, trimmedBarcode)
          triggerDownload(new Blob([svg], { type: 'image/svg+xml' }), `${stem}.svg`)
        } else {
          const canvas = barcodeCanvas()
          if (!canvas) throw new Error('Nothing to export yet.')
          const blob: Blob = await new Promise((resolve, reject) =>
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/png'),
          )
          triggerDownload(blob, `${stem}.png`)
        }
        return
      }
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
    setMenuOpen(false)
    const ok = isBarcode ? await copyBarcode() : await copyQrToClipboard(config)
    setCopied(ok ? 'ok' : 'fail')
    setTimeout(() => setCopied('idle'), 1800)
  }

  async function copyBarcode(): Promise<boolean> {
    const canvas = barcodeCanvas()
    if (!canvas || !navigator.clipboard || typeof ClipboardItem === 'undefined') return false
    try {
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('copy failed'))), 'image/png'),
      )
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      return true
    } catch {
      return false
    }
  }

  // Simple and Branding are QR ideas — a URL box and a colour picker mean
  // nothing for a barcode. Leaving one of those panels on screen over a barcode
  // preview would be a lie about what the controls do, so changing mode comes
  // back to QR. Type lives in Advanced, which is where it is changed back.
  function onModeChange(next: StudioMode) {
    if (next !== 'advanced' && isBarcode) setCodeType('qr')
    setMode(next)
  }

  return (
    <div>
      <div className={`${CONTAINER} py-6 lg:py-10`}>
        <header className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            QR Codes that <span className="text-orange-600">just. work. FOREVER.</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Pick your colours, shape the modules, drop in a logo — it renders live, on your
            device. Download as PNG, SVG, JPEG or WebP.
          </p>
        </header>

        <div className="mt-6 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-10 items-start">
          {/* Controls */}
          <div className="order-1 lg:order-1 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <ModeToggle
                mode={mode}
                setMode={onModeChange}
                brandingNudge={brandingNudge}
              />
              {(brandingChanged || advancedChanged) && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-slate-500 hover:text-orange-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-orange-300 transition-colors"
                >
                  Reset all
                </button>
              )}
            </div>
            {/* Regenerate — the same roll of the dice a page reload does, minus
                the reload. Moved out of the preview column on 2026-08-12 (owner
                ask): it is a control, and the right-hand column is the code
                itself plus what you do with it. Above the panel rather than
                below it because Advanced is tall — under it, the one styling
                control Simple has would sit off the bottom of a scrolled page.
                Rendered in every mode: the preset row only exists in two of the
                three, and in Simple this is the whole styling UI. */}
            {!isBarcode && <RegenerateStyle />}

            {mode === 'simple' && <SimplePanel />}
            {mode === 'branding' && <BrandingPanel />}
            {mode === 'advanced' && <Controls />}
          </div>

          {/* Preview + export */}
          <div className="order-2 lg:order-2 lg:sticky lg:top-6 space-y-4">
            {isBarcode ? (
              <div data-barcode-canvas>
                <BarcodePreview onError={setBarcodeError} />
              </div>
            ) : (
              <QrPreview />
            )}

            {/* One button, one arrow. PNG is what nearly everyone wants, so it
                is the whole of the visible export UI; the other formats, the
                clipboard and the backup dialog live behind the caret. */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
              <ExportButton
                busy={busy}
                hasData={hasData}
                isBarcode={isBarcode}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                onDownload={onDownload}
                onCopy={onCopy}
                onBackUp={() => {
                  setMenuOpen(false)
                  setHostedStoreOpen(true)
                }}
              />

              <p className="text-xs text-slate-500 text-center">
                {copied === 'ok'
                  ? '✓ Copied to clipboard'
                  : copied === 'fail'
                    ? 'Copy not supported — use Download'
                    : 'Always scan-test before printing at small sizes.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <HostedStoreDialog />
    </div>
  )
}

/** Split button: "Download PNG" plus a caret holding everything else.
 *
 *  Replaced a four-button format grid, a second backup button and a full-width
 *  "Copy PNG" row (2026-08-29, owner ask) — three stacked controls for choices
 *  almost nobody changes, sitting under the one thing the page is for. The
 *  other formats download straight from the menu rather than arming a format
 *  the primary button then has to explain, so the visible label never changes.
 */
function ExportButton({
  busy,
  hasData,
  isBarcode,
  menuOpen,
  setMenuOpen,
  onDownload,
  onCopy,
  onBackUp,
}: {
  busy: boolean
  hasData: boolean
  isBarcode: boolean
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  onDownload: (format: ExportFormat) => void
  onCopy: () => void
  onBackUp: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [dropUp, setDropUp] = useState(false)

  // Close on a click anywhere else, or on Escape. Both listeners only exist
  // while the menu is open.
  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen, setMenuOpen])

  const otherFormats = (isBarcode ? BARCODE_FORMATS : FORMATS).filter((f) => f.value !== 'png')

  // This card is the last thing in the right-hand column, and the page under it
  // is usually too short to scroll — so a menu that always dropped DOWN had its
  // last two items (Copy, Back up) cut off by the bottom of the window with no
  // way to reach them. Measure on open and flip above the button when the room
  // isn't there; the header and item heights below are the Tailwind ones.
  function toggle() {
    if (!menuOpen) {
      const rect = wrapRef.current?.getBoundingClientRect()
      const height = 48 + (otherFormats.length + 2) * 37 + 9
      setDropUp(!!rect && window.innerHeight - rect.bottom < height + 16)
    }
    setMenuOpen(!menuOpen)
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex">
        <button
          type="button"
          onClick={() => onDownload('png')}
          disabled={!hasData || busy}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-l-xl bg-orange-700 text-white text-sm font-semibold shadow-sm hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M4 16h12" />
          </svg>
          {busy ? 'Preparing…' : 'Download PNG'}
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="More export options"
          title="More options"
          className="shrink-0 inline-flex items-center justify-center w-11 rounded-r-xl border-l border-orange-800/40 bg-orange-700 text-white shadow-sm hover:bg-orange-800 transition-colors"
        >
          <svg
            viewBox="0 0 20 20"
            className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 7.5l5 5 5-5" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          role="menu"
          className={`absolute right-0 z-20 w-full min-w-[15rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg ${
            dropUp ? 'bottom-full mb-2' : 'mt-2'
          }`}
        >
          <p className="px-3 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Download as
          </p>
          {otherFormats.map((f) => (
            <MenuItem
              key={f.value}
              disabled={!hasData || busy}
              onClick={() => onDownload(f.value)}
              icon={
                <path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M4 16h12" />
              }
            >
              {f.label}
            </MenuItem>
          ))}

          <div className="my-1 border-t border-slate-100" />

          <MenuItem
            disabled={!hasData}
            onClick={onCopy}
            icon={
              <path d="M7 7V4h9v9h-3 M4 7h9v9H4V7z" />
            }
          >
            Copy PNG to clipboard
          </MenuItem>
          <MenuItem
            onClick={onBackUp}
            icon={
              <path d="M16 17H4a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 4 3h8l4 4v8.5A1.5 1.5 0 0 1 16 17z M14 17v-6H6v6 M6 3v4h6" />
            }
          >
            Back up online to unisim.co.uk
          </MenuItem>
        </div>
      )}
    </div>
  )
}

function MenuItem({
  children,
  icon,
  onClick,
  disabled,
}: {
  children: ReactNode
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-orange-50/70 hover:text-orange-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700 transition-colors"
    >
      <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icon}
      </svg>
      {children}
    </button>
  )
}

// "Give me a different look" — one press, one new style, no reload.
function RegenerateStyle() {
  const shufflePreset = useQrStore((s) => s.shufflePreset)
  const presetName = useQrStore((s) => s.presetName)
  // Sized to its content, not the column: the controls column is the wide one,
  // and a full-width button there reads as the page's primary action — which is
  // Download, over in the preview column.
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={shufflePreset}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 4v5h-5" />
        </svg>
        Regenerate style
      </button>
      <p className="text-xs text-slate-500">
        {presetName ? `${presetName} — pick` : 'Pick'} another at random. Your link and logo stay put.
      </p>
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
      <LinkCheck value={data} onFix={(href) => update({ data: href })} />
    </section>
  )
}

// Branding mode: colours, gradient and logo only — the most common customisation.
function BrandingPanel() {
  const config = useQrStore((s) => s.config)
  const update = useQrStore((s) => s.update)
  const applyPreset = useQrStore((s) => s.applyPreset)
  const activePreset = useQrStore((s) => s.presetName)
  const setLogo = useQrStore((s) => s.setLogo)
  const clearLogo = useQrStore((s) => s.clearLogo)
  // Same picker as the Simple tab's Controls panel — SDK mechanics, and the
  // empty state below takes a dragged image as well as a click.
  const logo = useFileDrop({
    onFiles: (files) => onLogoFile(files[0]),
    accept: 'image/*,.svg',
    multiple: false,
    label: 'Drop a logo here, or click to choose one',
  })

  function onLogoFile(file: File | undefined) {
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
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Style presets">
          {PRESETS.map((p) => {
            const active = p.name === activePreset
            return (
              <button
                key={p.name}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => applyPreset(p.name, p.patch)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700'
                }`}
              >
                {p.name}
              </button>
            )
          })}
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
          <input {...logo.inputProps} hidden />
          {config.logoDataUrl ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <img src={config.logoDataUrl} alt="Logo preview" className="w-12 h-12 rounded-lg object-contain bg-white ring-1 ring-slate-200 p-1" />
              <div className="flex-1 text-sm text-slate-600">Custom logo added</div>
              <button type="button" onClick={logo.open} className="text-xs font-medium text-slate-600 hover:text-orange-700 px-2 py-1">Replace</button>
              <button type="button" onClick={clearLogo} className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1">Remove</button>
            </div>
          ) : (
            <div
              {...logo.dropzoneProps}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer text-sm font-medium transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-orange-600 ${
                logo.over
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-300 text-slate-600 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-700'
              }`}
            >
              <span aria-hidden="true">🖼</span> Drop a logo here, or click to choose (PNG, JPG, SVG)
            </div>
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
