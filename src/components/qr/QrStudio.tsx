import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChipToggle, isNativeShell, useFileDrop } from '@unisim/sdk'
import Controls, { ContentCard, UnisimMarkToggle, logoPickerLabel, presetLabel } from './Controls'
import QrPreview from './QrPreview'
import PinnedPreview from './PinnedPreview'
import BarcodePreview from './BarcodePreview'
import HostedStoreDialog from './HostedStoreDialog'
import { useQrStore, type StudioMode } from '../../stores/qrStore'
import { CONTAINER } from '../../lib/layout'
import { copyQrToClipboard, downloadQr } from '../../lib/download'
import { saveBlob } from '@unisim/media/save'
import { DEFAULT_CONFIG, PRESETS, type ExportFormat, type QrConfig } from '@unisim/qr'
import { barcodeFileStem, renderBarcodeToSvg, symbologyById } from '../../lib/barcode'
import { useT, type MessageKey } from '../../i18n'

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

// Tailwind's `lg`: the width at which the studio splits into two columns and the
// preview already has a sticky column of its own. Below it there is one column,
// and the preview moves to the pinned bar instead.
const TWO_COLUMN = '(min-width: 1024px)'

/** True while the studio is in its single-column layout.
 *
 *  A media QUERY rather than `lg:hidden` / `hidden lg:block` on purpose. Both
 *  previews would then be mounted at every width, which means two live
 *  QRCodeStyling instances re-rendering on every keystroke — double the work on
 *  the phone, which is the device that can least afford it — and two elements
 *  carrying the same `role="img"` and label. Only one preview should exist. */
function useSingleColumn(): boolean {
  const [single, setSingle] = useState(() => !window.matchMedia(TWO_COLUMN).matches)
  useEffect(() => {
    const mq = window.matchMedia(TWO_COLUMN)
    const onChange = () => setSingle(!mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return single
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

// In the phone app the PNG goes to the share sheet (Save Image, Messages…),
// not a Downloads folder, so "Download" was the wrong word there.
const SAVE_LABEL: MessageKey = isNativeShell() ? 'studio.save_or_share' : 'studio.download_png'

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
// browser, the share sheet on a phone. See `@unisim/media/save`.
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
  const t = useT()
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [menuOpen, setMenuOpen] = useState(false)

  const codeType = useQrStore((s) => s.codeType)
  const symbology = useQrStore((s) => s.barcodeSymbology)
  const barcodeValue = useQrStore((s) => s.barcodeValue)
  const [barcodeError, setBarcodeError] = useState<string | null>(null)
  const isBarcode = codeType === 'barcode'

  // Where the QR preview lives. One column ⇒ pinned under the nav bar; two
  // columns ⇒ the right-hand column, exactly as it always has been.
  const pinPreview = useSingleColumn() && !isBarcode

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
          if (!canvas) throw new Error(t('studio.nothing_to_export'))
          const blob: Blob = await new Promise((resolve, reject) =>
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(t('studio.export_failed_reason')))), 'image/png'),
          )
          triggerDownload(blob, `${stem}.png`)
        }
        return
      }
      await downloadQr(config, format)
    } catch (err) {
      console.error(err)
      alert(t('studio.export_failed', { message: (err as Error).message }))
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


  return (
    <div>
      <div className={`${CONTAINER} py-6 lg:py-10`}>
        {/* One line on a phone: the headline and its paragraph used to fill the
            top third of the screen, pushing the code and the box you type into
            below the fold on exactly the device the app ships on. */}
        <header className="max-w-2xl">
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {/* The suite's headline shape — "PDFs that just work.", "Universal
                Images, That just work." — with only "just work" in orange, plus
                the promise a static code keeps: it never expires (James,
                2026-09-30). It was "QR Codes that just. work. FOREVER.". */}
            {t.rich('studio.headline', {
              em: <span className="text-orange-600 dark:text-orange-400">{t('studio.headline_em')}</span>,
            })}
          </h1>
          <p className="mt-2 hidden text-slate-600 sm:block dark:text-slate-300">
            {t('studio.lead')}
          </p>
        </header>

        {/* Narrow screens only, and only for QR: a 1D barcode is a wide strip
            rather than a square, and it lives behind Advanced ▸ Type, so it
            keeps the in-column preview. */}
        {pinPreview && <PinnedPreview />}

        {/* `grid-cols-1` for the same reason as the Dynamic tab's grid: an
            implicit `auto` column is floored at its items' min-content width,
            so anything unbreakable inside (a `truncate`d line, a long URL)
            would widen the column past the viewport and scroll the page
            sideways. See the note in DynamicStudio. */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-10 items-start">
          {/* Controls */}
          {/* What the code holds comes first, then how much styling you want,
              then the style itself (2026-09-30). The Simple / Branding /
              Advanced switch used to sit above everything, with Regenerate
              above the link box, so the first thing on the page was style
              before you had said what the code was for. */}
          <div className="order-1 lg:order-1 space-y-4">
            <ContentCard />
            {/* A barcode has no style to choose, so no style switch either. */}
            {!isBarcode && <div className="flex items-center gap-3 flex-wrap">
              <ModeToggle mode={mode} setMode={setMode} />
              {(brandingChanged || advancedChanged) && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-slate-500 hover:text-orange-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-orange-300 transition-colors dark:text-slate-400 dark:hover:text-orange-400 dark:border-slate-700 dark:hover:border-orange-500/60"
                >
                  {t('studio.reset_all')}
                </button>
              )}
            </div>}
            {mode === 'branding' && !isBarcode && <BrandingPanel />}
            {mode === 'advanced' && <Controls />}
          </div>

          {/* Preview + export */}
          <div className="order-2 lg:order-2 lg:sticky lg:top-6 space-y-4">
            {isBarcode ? (
              <div data-barcode-canvas>
                <BarcodePreview onError={setBarcodeError} />
              </div>
            ) : (
              !pinPreview && <QrPreview />
            )}

            {/* One button, one arrow. PNG is what nearly everyone wants, so it
                is the whole of the visible export UI; the other formats, the
                clipboard and the backup dialog live behind the caret. */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 dark:bg-slate-900 dark:border-slate-800">
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

              <p className="text-xs text-slate-500 text-center dark:text-slate-400">
                {copied === 'ok'
                  ? t('studio.copied')
                  : copied === 'fail'
                    ? t('studio.copy_unsupported')
                    : t('studio.scan_test_hint')}
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
  const t = useT()
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
          {busy ? t('studio.preparing') : t(SAVE_LABEL)}
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label={t('studio.more_export_aria')}
          title={t('studio.more_options')}
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
          className={`absolute right-0 z-20 w-full min-w-[15rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800 ${
            dropUp ? 'bottom-full mb-2' : 'mt-2'
          }`}
        >
          <p className="px-3 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {t('studio.download_as')}
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

          <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

          <MenuItem
            disabled={!hasData}
            onClick={onCopy}
            icon={
              <path d="M7 7V4h9v9h-3 M4 7h9v9H4V7z" />
            }
          >
            {t('studio.copy_png')}
          </MenuItem>
          <MenuItem
            onClick={onBackUp}
            icon={
              <path d="M16 17H4a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 4 3h8l4 4v8.5A1.5 1.5 0 0 1 16 17z M14 17v-6H6v6 M6 3v4h6" />
            }
          >
            {t('studio.back_up_online')}
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
      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-orange-50/70 hover:text-orange-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700 transition-colors dark:text-slate-200 dark:hover:bg-orange-500/15 dark:hover:text-orange-300 dark:disabled:hover:text-slate-200"
    >
      <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icon}
      </svg>
      {children}
    </button>
  )
}

// Three-tab Simple / Branding / Advanced switcher: how much styling to show.
// The Branding tab had an unlabelled orange dot nudging signed-out visitors
// towards it; nobody could tell what it meant, so it went on 2026-09-30.
function ModeToggle({ mode, setMode }: { mode: StudioMode; setMode: (m: StudioMode) => void }) {
  const t = useT()
  const tabs: { id: StudioMode; label: MessageKey }[] = [
    { id: 'simple', label: 'studio.mode_simple' },
    { id: 'branding', label: 'studio.mode_branding' },
    { id: 'advanced', label: 'studio.mode_advanced' },
  ]
  return (
    <div className="inline-flex p-1 bg-slate-200/70 rounded-xl dark:bg-slate-800" role="tablist" aria-label={t('studio.mode_aria')}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={mode === tab.id}
          onClick={() => setMode(tab.id)}
          className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === tab.id
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
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
  const t = useT()
  // Same picker as the Simple tab's Controls panel — SDK mechanics, and the
  // empty state below takes a dragged image as well as a click.
  const logo = useFileDrop({
    onFiles: (files) => onLogoFile(files[0]),
    accept: 'image/*,.svg',
    multiple: false,
    label: t('studio.logo_drop_label'),
  })

  function onLogoFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert(t('studio.logo_not_image'))
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
      {/* Style presets */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('studio.presets_title')}</h2>
        <p className="mt-0.5 mb-3 text-xs text-slate-500 dark:text-slate-400">{t('studio.presets_hint')}</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('studio.presets_title')}>
          {PRESETS.map((p) => {
            const active = p.name === activePreset
            return (
              <ChipToggle
                key={p.name}
                selected={active}
                role="radio"
                onClick={() => applyPreset(p.name, p.patch)}
              >
                {presetLabel(p.name, t)}
              </ChipToggle>
            )
          })}
        </div>
      </section>

      {/* Colours */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('studio.colours_title')}</h2>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <BrandSwatch label={t('studio.modules')} value={config.fgColor} onChange={(v) => update({ fgColor: v })} />
            <BrandSwatch label={t('studio.background')} value={config.bgColor} onChange={(v) => update({ bgColor: v })} disabled={config.bgTransparent} />
          </div>
          <BrandToggle label={t('studio.transparent_background')} checked={config.bgTransparent} onChange={(v) => update({ bgTransparent: v })} hint={t('studio.transparent_background_hint')} />
          <BrandToggle label={t('studio.gradient_modules')} checked={config.useGradient} onChange={(v) => update({ useGradient: v })} />
          {config.useGradient && (
            <div className="pl-4 space-y-3 border-l-2 border-orange-100 dark:border-orange-500/30">
              <BrandSwatch label={t('studio.gradient_end')} value={config.gradientColor} onChange={(v) => update({ gradientColor: v })} />
              <BrandRange label={t('studio.gradient_angle')} value={config.gradientRotation} min={0} max={360} step={5} suffix="°" onChange={(v) => update({ gradientRotation: v })} />
            </div>
          )}
          <BrandToggle label={t('studio.two_tone_corners')} checked={!config.matchCornerColor} onChange={(v) => update({ matchCornerColor: !v })} hint={t('studio.two_tone_corners_hint')} />
          {!config.matchCornerColor && (
            <div className="pl-4">
              <BrandSwatch label={t('studio.corner_colour')} value={config.cornerColor} onChange={(v) => update({ cornerColor: v })} />
            </div>
          )}
        </div>
      </section>

      {/* Logo & branding */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('studio.logo_title')}</h2>
        <div className="mt-3 space-y-3">
          <input {...logo.inputProps} hidden />
          {config.logoDataUrl ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <img src={config.logoDataUrl} alt={t('studio.logo_preview_alt')} className="w-12 h-12 rounded-lg object-contain bg-white ring-1 ring-slate-200 p-1 dark:ring-slate-600" />
              <div className="flex-1 text-sm text-slate-600 dark:text-slate-300">{t('studio.logo_added')}</div>
              <button type="button" onClick={logo.open} className="text-xs font-medium text-slate-600 hover:text-orange-700 px-2 py-1 dark:text-slate-300 dark:hover:text-orange-400">{t('studio.logo_replace')}</button>
              <button type="button" onClick={clearLogo} className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 dark:text-red-400 dark:hover:text-red-300">{t('studio.remove')}</button>
            </div>
          ) : (
            <div
              {...logo.dropzoneProps}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer text-sm font-medium transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-orange-600 ${
                logo.over
                  ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300'
                  : 'border-slate-300 text-slate-600 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-300'
              }`}
            >
              <span aria-hidden="true">🖼</span> {logoPickerLabel()}
            </div>
          )}
          {config.logoDataUrl && (
            <>
              <BrandRange label={t('studio.logo_size')} value={Math.round(config.logoSize * 100)} min={10} max={50} step={1} suffix="%" onChange={(v) => update({ logoSize: v / 100 })} />
              <BrandRange label={t('studio.logo_padding')} value={config.logoMargin} min={0} max={24} step={1} suffix=" px" onChange={(v) => update({ logoMargin: v })} />
            </>
          )}
          <BrandToggle label={t('studio.clear_behind_logo')} checked={config.hideBackgroundDots} onChange={(v) => update({ hideBackgroundDots: v })} />
          <UnisimMarkToggle />
        </div>
      </section>
    </div>
  )
}

function BrandSwatch({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const t = useT()
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">{label}</label>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 shrink-0" aria-label={label} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} aria-label={t('studio.hex_value_aria', { label })} className="w-full min-w-0 text-sm font-mono uppercase text-slate-700 focus:outline-none dark:text-slate-200" />
      </div>
    </div>
  )
}

function BrandToggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div>
      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <button type="button" role="switch" aria-checked={checked ? 'true' : 'false'} onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </label>
      {hint && <p className="mt-1 text-xs text-slate-500 pr-14 dark:text-slate-400">{hint}</p>}
    </div>
  )
}

function BrandRange({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix?: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} className="w-full accent-orange-600" />
    </div>
  )
}
