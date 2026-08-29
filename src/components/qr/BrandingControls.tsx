import { useFileDrop } from '@unisim/sdk'
import { PRESETS, type QrDesign } from '@unisim/qr'
import QrCanvas from './QrCanvas'
import { downscaleDataUrl } from '../../lib/imageScale'

// The branding control set for a hosted dynamic code — a live preview plus the
// style, colour and centre-logo controls.
//
// ONE component with TWO callers, and that is the point. It sets the look new
// codes are born wearing (the Dynamic tab's panel) and it edits the look of one
// existing code (the ✏️ on a card). Those used to be the same thing, because a
// code had no look of its own; now that a code keeps what it was created with
// (migration 0129), they are two jobs — and two copies of a control wall this
// size is how they would quietly stop offering the same options.
//
// It works on a plain `QrDesign` and hands back patches. The caller decides
// where those land: the studio maps them into its `DynamicBrand` store (which
// carries the extra "follow the organisation" state), a card merges them into
// the draft it is about to save. The centre logo is passed separately rather
// than inferred from `logoDataUrl`, because "the org's icon" and "an upload
// that happens to be the same bytes" are different answers and only the caller
// knows which it holds.

export type LogoMode = 'org' | 'custom' | 'none'

export interface BrandingControlsProps {
  /** The design being edited — drives every control and the preview. */
  config: QrDesign
  /** Style / colour changes. Never carries the centre logo (see `logo`). */
  onPatch: (patch: Partial<QrDesign>) => void
  /** What the preview encodes, and the caption under it. */
  previewData: string
  previewCaption: string
  previewLabel: string
  /** Centre-logo source, kept by the caller. */
  logo: {
    mode: LogoMode
    /** False disables the "Org icon" chip — there is no organisation mark. */
    orgIconAvailable: boolean
    onMode: (mode: LogoMode) => void
    /** Already downscaled (see `downscaleDataUrl`). */
    onUpload: (dataUrl: string) => void
  }
  /** Offered by the studio only: put the module colour back to the org's. */
  colorFollowsOrg?: { canFollow: boolean; onFollow: () => void }
}

export default function BrandingControls({
  config,
  onPatch,
  previewData,
  previewCaption,
  previewLabel,
  logo,
  colorFollowsOrg,
}: BrandingControlsProps) {
  // A chip in a row of chips, so no drop target here — the SDK just owns the
  // input, which means re-picking the same logo still fires.
  const logoPicker = useFileDrop({
    onFiles: (files) => onUploadLogo(files[0]),
    accept: 'image/*',
    multiple: false,
    clickToBrowse: false,
  })

  function onUploadLogo(file: File | undefined) {
    if (!file) return
    const fr = new FileReader()
    fr.onload = () => {
      downscaleDataUrl(String(fr.result)).then(logo.onUpload)
    }
    fr.readAsDataURL(file)
  }

  return (
    <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
      {/* Live preview — a large, contained square */}
      <div className="flex shrink-0 flex-col items-center gap-1.5 self-center sm:self-start">
        <BrandPreview config={config} data={previewData} label={previewLabel} />
        <p className="text-center text-[11px] text-slate-400">{previewCaption}</p>
      </div>

      {/* Controls */}
      <div className="min-w-0 flex-1 space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Style</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <BrandChip key={p.name} active={false} onClick={() => onPatch(p.patch)}>{p.name}</BrandChip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ColorField label="Modules" value={config.fgColor} onChange={(v) => onPatch({ fgColor: v })}>
            {colorFollowsOrg?.canFollow
              ? <button type="button" onClick={colorFollowsOrg.onFollow} className="text-[11px] font-semibold text-slate-400 hover:text-orange-700">use org</button>
              : null}
          </ColorField>
          <ColorField label="Background" value={config.bgColor} onChange={(v) => onPatch({ bgColor: v })} disabled={config.bgTransparent} />
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input type="checkbox" checked={config.bgTransparent} onChange={(e) => onPatch({ bgTransparent: e.target.checked })} /> Transparent
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-1.5 text-sm text-slate-700">
            <input type="checkbox" checked={config.useGradient} onChange={(e) => onPatch({ useGradient: e.target.checked })} /> <span className="font-medium">Gradient</span>
          </label>
          {config.useGradient && (
            <>
              <ColorField label="End" value={config.gradientColor} onChange={(v) => onPatch({ gradientColor: v })} />
              <label className="flex items-center gap-2 text-xs text-slate-600">Angle
                <input type="range" min={0} max={360} step={5} value={config.gradientRotation} onChange={(e) => onPatch({ gradientRotation: Number(e.target.value) })} className="w-24 accent-orange-600" />
                <span className="tabular-nums">{config.gradientRotation}°</span>
              </label>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-1.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={!config.matchCornerColor}
              // The flag alone. `cornerColor` is left where it was on purpose —
              // the renderer ignores it while the corners match (design.js
              // resolves `matchCornerColor ? fgColor : cornerColor`), so keeping
              // it means unticking and re-ticking gives back the two-tone you
              // had rather than a fresh pick.
              onChange={(e) => onPatch({ matchCornerColor: !e.target.checked })}
            /> <span className="font-medium">Two-tone corners</span>
          </label>
          {!config.matchCornerColor && <ColorField label="Corners" value={config.cornerColor} onChange={(v) => onPatch({ cornerColor: v })} />}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-700">Centre logo</span>
          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded border border-slate-200 bg-slate-50">
            {config.logoDataUrl
              ? <img src={config.logoDataUrl} alt="" className="h-full w-full object-contain" />
              : <span className="text-[8px] font-semibold text-slate-400">{config.unisimMark ? 'UNI·SIM' : 'none'}</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <BrandChip active={logo.mode === 'org'} disabled={!logo.orgIconAvailable} onClick={() => logo.onMode('org')}>Org icon</BrandChip>
            <BrandChip active={logo.mode === 'custom'} onClick={logoPicker.open}>Upload…</BrandChip>
            <BrandChip active={logo.mode === 'none'} onClick={() => logo.onMode('none')}>None</BrandChip>
          </div>
          <input {...logoPicker.inputProps} className="hidden" />
        </div>
      </div>
    </div>
  )
}

// A live example of the current branding. `data` is whatever the caller wants
// encoded — the UNI·SIM site for the studio's example, the code's own redirect
// when a single card is being re-skinned.
function BrandPreview({ config, data, label }: { config: QrDesign; data: string; label: string }) {
  return (
    <div className="grid aspect-square w-full max-w-[16rem] place-items-center rounded-xl border border-slate-200 bg-white p-2 sm:w-64">
      <QrCanvas
        config={{ ...config, data }}
        size={360}
        margin={8}
        label={label}
        className="h-full w-full leading-[0]"
      />
    </div>
  )
}

// A labelled colour swatch with an optional trailing control.
export function ColorField({ label, value, onChange, disabled, children }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="color"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5 disabled:opacity-40"
        aria-label={label}
      />
      {children}
    </div>
  )
}

// A small toggle chip for the presets and the logo-source choice.
export function BrandChip({ active, disabled, onClick, children }: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-40 ${
        active
          ? 'border-orange-500 bg-orange-50 text-orange-700'
          : 'border-slate-300 text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}
