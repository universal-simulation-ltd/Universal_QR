import { useRef, type ReactNode } from 'react'
import { useQrStore } from '../../stores/qrStore'
import {
  CORNER_DOT_TYPES,
  CORNER_SQUARE_TYPES,
  DOT_TYPES,
  PRESETS,
  type CornerDotType,
  type CornerSquareType,
  type DotType
} from '../../lib/qr'

export default function Controls() {
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
      {/* ── Content ─────────────────────────────────────────────────────── */}
      <Section title="Content" desc="What the QR code points to.">
        <TextField
          label="Name"
          value={config.name}
          onChange={(v) => update({ name: v })}
          placeholder="My QR code"
        />
        <TextField
          label="URL or text"
          value={config.data}
          onChange={(v) => update({ data: v })}
          placeholder="https://example.com"
          type="url"
        />
      </Section>

      {/* ── Presets ─────────────────────────────────────────────────────── */}
      <Section title="Style presets" desc="A starting point — tweak anything below.">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPatch(p.patch)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Colours ─────────────────────────────────────────────────────── */}
      <Section title="Colours">
        <div className="grid grid-cols-2 gap-3">
          <Swatch label="Modules" value={config.fgColor} onChange={(v) => update({ fgColor: v })} />
          <Swatch
            label="Background"
            value={config.bgColor}
            onChange={(v) => update({ bgColor: v })}
            disabled={config.bgTransparent}
          />
        </div>

        <Toggle
          label="Transparent background"
          checked={config.bgTransparent}
          onChange={(v) => update({ bgTransparent: v })}
          hint="Export a PNG/SVG with no background fill."
        />

        <Toggle
          label="Gradient modules"
          checked={config.useGradient}
          onChange={(v) => update({ useGradient: v })}
        />
        {config.useGradient && (
          <div className="pl-1 space-y-3 border-l-2 border-indigo-100 ml-1">
            <div className="pl-3 space-y-3">
              <Swatch
                label="Gradient end"
                value={config.gradientColor}
                onChange={(v) => update({ gradientColor: v })}
              />
              <RangeField
                label="Gradient angle"
                value={config.gradientRotation}
                min={0}
                max={360}
                step={5}
                suffix="°"
                onChange={(v) => update({ gradientRotation: v })}
              />
            </div>
          </div>
        )}

        <Toggle
          label="Two-tone corners"
          checked={!config.matchCornerColor}
          onChange={(v) => update({ matchCornerColor: !v })}
          hint="Give the three finder corners their own colour."
        />
        {!config.matchCornerColor && (
          <div className="pl-4">
            <Swatch
              label="Corner colour"
              value={config.cornerColor}
              onChange={(v) => update({ cornerColor: v })}
            />
          </div>
        )}
      </Section>

      {/* ── Shape & size ────────────────────────────────────────────────── */}
      <Section title="Shape &amp; size" desc="Module rounding, corner styling and dimensions.">
        <OptionRow
          label="Module style"
          value={config.dotType}
          options={DOT_TYPES}
          onChange={(v) => update({ dotType: v as DotType })}
        />
        <div className="grid grid-cols-2 gap-3">
          <OptionRow
            label="Corner frame"
            value={config.cornerSquareType}
            options={CORNER_SQUARE_TYPES}
            onChange={(v) => update({ cornerSquareType: v as CornerSquareType })}
            compact
          />
          <OptionRow
            label="Corner dot"
            value={config.cornerDotType}
            options={CORNER_DOT_TYPES}
            onChange={(v) => update({ cornerDotType: v as CornerDotType })}
            compact
          />
        </div>
        <RangeField
          label="Size"
          value={config.size}
          min={128}
          max={1024}
          step={16}
          suffix=" px"
          onChange={(v) => update({ size: v })}
        />
        <RangeField
          label="Quiet-zone margin"
          value={config.margin}
          min={0}
          max={64}
          step={2}
          suffix=" px"
          onChange={(v) => update({ margin: v })}
        />
      </Section>

      {/* ── Logo & branding ─────────────────────────────────────────────── */}
      <Section title="Logo &amp; branding" desc="Drop your brand mark into the centre.">
        <input ref={fileRef} type="file" accept="image/*,.svg" hidden onChange={onLogoPick} />
        {config.logoDataUrl ? (
          <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
            <img
              src={config.logoDataUrl}
              alt="Logo preview"
              className="w-12 h-12 rounded-lg object-contain bg-white ring-1 ring-slate-200 p-1"
            />
            <div className="flex-1 text-sm text-slate-600">Custom logo added</div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs font-medium text-slate-600 hover:text-indigo-700 px-2 py-1"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={clearLogo}
              className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-700 transition-colors"
          >
            <span aria-hidden="true">🖼</span> Upload a logo (PNG, JPG, SVG)
          </button>
        )}

        {config.logoDataUrl && (
          <>
            <RangeField
              label="Logo size"
              value={Math.round(config.logoSize * 100)}
              min={10}
              max={50}
              step={1}
              suffix="%"
              onChange={(v) => update({ logoSize: v / 100 })}
            />
            <RangeField
              label="Logo padding"
              value={config.logoMargin}
              min={0}
              max={24}
              step={1}
              suffix=" px"
              onChange={(v) => update({ logoMargin: v })}
            />
          </>
        )}

        <Toggle
          label="Clear modules behind logo"
          checked={config.hideBackgroundDots}
          onChange={(v) => update({ hideBackgroundDots: v })}
        />

        <Toggle
          label="Include UNI·SIM mark"
          checked={config.unisimMark}
          onChange={(v) => update({ unisimMark: v })}
          hint={
            config.logoDataUrl
              ? 'Adds a small UNI·SIM badge in the bottom-right corner.'
              : 'Shown in the centre until you add your own logo.'
          }
        />
      </Section>
    </div>
  )
}

// ── Reusable field primitives ──────────────────────────────────────────────

function Section({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900" dangerouslySetInnerHTML={{ __html: title }} />
      {desc && <p className="mt-0.5 mb-3 text-xs text-slate-500">{desc}</p>}
      <div className={desc ? 'space-y-3' : 'mt-3 space-y-3'}>{children}</div>
    </section>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1.5">{children}</label>
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
      />
    </div>
  )
}

function Swatch({
  label,
  value,
  onChange,
  disabled
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-slate-300">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 shrink-0"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 text-sm font-mono uppercase text-slate-700 focus:outline-none"
        />
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  hint
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  hint?: string
}) {
  return (
    <div>
      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            checked ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
      {hint && <p className="mt-1 text-xs text-slate-500 pr-14">{hint}</p>}
    </div>
  )
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-xs font-medium text-slate-500 tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-600"
      />
    </div>
  )
}

function OptionRow({
  label,
  value,
  options,
  onChange,
  compact
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
  compact?: boolean
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className={`grid gap-1.5 ${compact ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'}`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              value === opt.value
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
