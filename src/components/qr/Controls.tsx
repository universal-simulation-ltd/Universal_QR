import { useRef, useState, type ReactNode } from 'react'
import { useQrStore } from '../../stores/qrStore'
import {
  CORNER_DOT_TYPES,
  CORNER_SQUARE_TYPES,
  DOT_TYPES,
  PRESETS,
  qrContrastIssue,
  MIN_QR_CONTRAST,
  type CornerDotType,
  type CornerSquareType,
  type DotType
} from '../../lib/qr'
import { FRAME_SHAPES, frameSizeNote, type FrameShape } from '../../lib/frames'
import { DECOR_STYLES, type DecorStyle } from '../../lib/decor'
import { decorScaleOf } from '../../lib/compose'
import { SYMBOLOGIES, symbologyById, type BarcodeSymbology } from '../../lib/barcode'

export default function Controls() {
  const config = useQrStore((s) => s.config)
  const update = useQrStore((s) => s.update)
  const applyPatch = useQrStore((s) => s.applyPatch)
  const setLogo = useQrStore((s) => s.setLogo)
  const clearLogo = useQrStore((s) => s.clearLogo)
  const fileRef = useRef<HTMLInputElement>(null)
  const frameNote = frameSizeNote(config.frameShape, config.size, decorScaleOf(config))
  const contrast = qrContrastIssue(config)
  const codeType = useQrStore((s) => s.codeType)
  const setCodeType = useQrStore((s) => s.setCodeType)
  const symbology = useQrStore((s) => s.barcodeSymbology)
  const setSymbology = useQrStore((s) => s.setBarcodeSymbology)
  const barcodeValue = useQrStore((s) => s.barcodeValue)
  const setBarcodeValue = useQrStore((s) => s.setBarcodeValue)
  const isBarcode = codeType === 'barcode'

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
      {/* ── Type ────────────────────────────────────────────────────────────
          Two choices only: what you are making. WHICH kind of QR (link, Wi-Fi,
          contact…) or WHICH barcode symbology is a content decision, so both
          live one level down, in the Content section — the QR side already
          worked that way, and the barcode side now matches it rather than
          spraying seven unrelated options across one row.

          1D barcodes had a top-level tab until 2026-08-09; that was more
          prominence than the usage justified. Picking Barcode swaps the whole
          panel below — colours, shapes and logos are QR-only ideas, and leaving
          them on screen would imply a barcode could carry them. */}
      <Section title="Type" desc="What you're making.">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Code type">
          <TypeChip label="QR Code" active={!isBarcode} onClick={() => setCodeType('qr')} />
          <TypeChip label="Barcode" active={isBarcode} onClick={() => setCodeType('barcode')} />
        </div>
      </Section>

      {isBarcode ? (
        <BarcodeFields
          symbology={symbology}
          setSymbology={setSymbology}
          value={barcodeValue}
          onChange={setBarcodeValue}
        />
      ) : (
      <>
      {/* ── Content ─────────────────────────────────────────────────────── */}
      <Section title="Content" desc="What the QR code points to.">
        <TextField
          label="Name"
          value={config.name}
          onChange={(v) => update({ name: v })}
          placeholder="My QR code"
        />
        <ContentBuilder data={config.data} update={update} />
      </Section>

      {/* ── Presets ─────────────────────────────────────────────────────── */}
      <Section title="Style presets" desc="A starting point — tweak anything below.">
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
          <div className="pl-1 space-y-3 border-l-2 border-orange-100 ml-1">
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

        {contrast?.kind === 'inverted' && (
          <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
            <strong className="font-semibold">Light modules on a dark background.</strong>{' '}
            The QR standard expects the opposite, and strict readers refuse an inverted
            code outright — this app's own Scan tab is one of them. Most phone cameras
            cope, but swap the two colours if the code has to work everywhere.
          </p>
        )}

        {contrast?.kind === 'low' && (
          <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
            <strong className="font-semibold">
              Not much contrast between the {contrast.where === 'corners' ? 'corners' : 'modules'} and the
              background.
            </strong>{' '}
            {contrast.ratio.toFixed(1)}:1, where a reader wants at least {MIN_QR_CONTRAST}:1.
            {contrast.where === 'corners'
              ? ' A scanner finds the three corner squares before it reads anything else, so this is the riskiest place to be short.'
              : ' Codes this close tend to scan on screen and then fail printed or at a distance.'}{' '}
            Darken the {contrast.where === 'corners' ? 'corner' : 'module'} colour or lighten the background.
          </p>
        )}
      </Section>

      {/* ── Shape & size ────────────────────────────────────────────────── */}
      <Section title="Shape & size" desc="The code's outline, module rounding, corner styling and dimensions.">
        <OptionRow
          label="Code shape"
          value={config.frameShape}
          options={FRAME_SHAPES}
          onChange={(v) => {
            // A shaped plate arrives DECORATED. The empty ring is the thing that
            // makes a shaped code look like a square one dropped on a circle, so
            // "shape with nothing in the gap" is the state nobody actually wants
            // as a starting point — they can still turn it off. Square goes back
            // to none, because there is no gap to fill and leaving a style set
            // would silently re-decorate the next shape they picked.
            const frameShape = v as FrameShape
            if (frameShape === 'square') update({ frameShape, decorStyle: 'none' })
            else if (config.decorStyle === 'none') update({ frameShape, decorStyle: 'burst' })
            else update({ frameShape })
          }}
        />

        {/* ALWAYS shown, including on a square plate.
            It was hidden unless the shape was already non-square, on the
            reasoning that a square plate has no space to decorate — true, and
            beside the point: the default shape IS square, so the control was
            invisible on a fresh load and the only way to find decoration at all
            was to happen to click the Radial preset. A control you cannot
            discover is not a control. Picking a decoration on a square plate
            therefore switches the shape too, so the option is never a dead end. */}
        <OptionRow
          label="Decoration"
          value={config.decorStyle}
          options={DECOR_STYLES}
          onChange={(v) => {
            const decorStyle = v as DecorStyle
            update(
              decorStyle !== 'none' && config.frameShape === 'square'
                ? { decorStyle, frameShape: 'circle' }
                : { decorStyle }
            )
          }}
          compact
        />
        {config.decorStyle !== 'none' ? (
          <p className="text-xs text-slate-500">
            Decoration fills the space the shape leaves around the code — and needs that
            space, so the code is drawn smaller to make it. Export larger than usual, and
            scan-test before printing.
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Fills the space a shaped plate leaves around the code. Choosing one switches a
            square code to a circle, since a square plate has no space to fill.
          </p>
        )}
        {frameNote && (
          <p className="-mt-1 text-xs text-slate-500">
            {frameNote} The code is never trimmed to fit the shape — that would stop it scanning.
          </p>
        )}
        <OptionRow
          label="Module style"
          value={config.dotType}
          options={DOT_TYPES}
          onChange={(v) => update({ dotType: v as DotType })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      <Section title="Logo & branding" desc="Drop your brand mark into the centre.">
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
              className="text-xs font-medium text-slate-600 hover:text-orange-700 px-2 py-1"
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-700 transition-colors"
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
      </>
      )}
    </div>
  )
}

/** One chip in the Type row. */
function TypeChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-orange-500 bg-orange-50 text-orange-700'
          : 'border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700'
      }`}
    >
      {label}
    </button>
  )
}

/** The barcode's Content section: which symbology, then its one value.
 *
 *  Deliberately the same shape as the QR side — an OptionRow labelled "Type"
 *  above the field it configures — so the two halves of the designer read the
 *  same way instead of one using chips and the other a grid. Everything about
 *  the input follows the symbology: hint, placeholder, keyboard and validation. */
function BarcodeFields({
  symbology,
  setSymbology,
  value,
  onChange,
}: {
  symbology: BarcodeSymbology
  setSymbology: (s: BarcodeSymbology) => void
  value: string
  onChange: (v: string) => void
}) {
  const def = symbologyById(symbology)
  const trimmed = value.trim()
  const error = trimmed.length === 0 ? null : def.validate(trimmed)
  return (
    <Section title="Content" desc="The barcode type your scanner or system expects, and its value.">
      <OptionRow
        label="Type"
        value={symbology}
        options={SYMBOLOGIES.map((s) => ({ value: s.id, label: s.label }))}
        onChange={(v) => setSymbology(v as BarcodeSymbology)}
      />
      <FieldLabel>Value</FieldLabel>
      <input
        id="barcode-value"
        type="text"
        inputMode={def.id === 'code128' || def.id === 'code39' ? 'text' : 'numeric'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={def.placeholder}
        aria-label={`${def.label} value`}
        aria-invalid={!!error}
        className={`w-full rounded-xl border px-4 py-3 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
            : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/40'
        }`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-slate-500">
        {def.hint} Barcodes are static and unstyled — no colours, logo or shape.
      </p>
    </Section>
  )
}

// ── Reusable field primitives ──────────────────────────────────────────────

// `title` is rendered as plain text. It used to use dangerouslySetInnerHTML to
// decode an `&amp;` entity in a couple of titles — that's an XSS footgun the
// moment anyone passes dynamic text, for zero benefit. Titles are now literal
// strings with a real "&".
function Section({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
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
        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
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
            checked ? 'bg-orange-600' : 'bg-slate-300'
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
        className="w-full accent-orange-600"
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
  // A labelled radiogroup, not a bare row of buttons. These are single-choice
  // controls and were announcing as unrelated buttons to a screen reader, with
  // nothing tying them to their label or saying which was chosen. It also makes
  // them individually addressable — several rows here offer an option called
  // "Square", which is otherwise ambiguous to anything looking by name.
  return (
    <div role="radiogroup" aria-label={label}>
      <FieldLabel>{label}</FieldLabel>
      <div className={`grid gap-1.5 ${compact ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'}`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`min-w-0 px-2 py-1.5 rounded-lg text-xs font-medium leading-tight break-words border transition-colors ${
              value === opt.value
                ? 'border-orange-500 bg-orange-50 text-orange-700'
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

// ── Content-type builder ──────────────────────────────────────────────────
// The QR encodes a single string (config.data). For anything richer than a
// link we compose the standard QR payload (Wi-Fi, mailto:, tel:, SMSTO:, vCard,
// geo:, VEVENT) from a few fields and write the result into config.data.
const CONTENT_KINDS = [
  { id: 'text', label: 'Link / text' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'sms', label: 'SMS' },
  { id: 'vcard', label: 'Contact' },
  { id: 'geo', label: 'Location' },
  { id: 'event', label: 'Event' }
] as const
type ContentKind = (typeof CONTENT_KINDS)[number]['id']

// Escape the Wi-Fi/vCard reserved characters: \ ; , : "
const escMeca = (s: string) => (s || '').replace(/([\\;,:"])/g, '\\$1')
// datetime-local "YYYY-MM-DDTHH:MM" → iCal "YYYYMMDDTHHMMSS"
const icalDate = (s: string) => {
  if (!s) return ''
  const c = s.replace(/[-:]/g, '')
  return c.length === 13 ? `${c}00` : c
}

function composeContent(kind: ContentKind, f: Record<string, string>): string {
  switch (kind) {
    case 'wifi': {
      if (!f.ssid) return ''
      const auth = f.password ? 'WPA' : 'nopass'
      return `WIFI:T:${auth};S:${escMeca(f.ssid)};${f.password ? `P:${escMeca(f.password)};` : ''}${f.hidden === 'true' ? 'H:true;' : ''};`
    }
    case 'email': {
      if (!f.to) return ''
      const params: string[] = []
      if (f.subject) params.push(`subject=${encodeURIComponent(f.subject)}`)
      if (f.body) params.push(`body=${encodeURIComponent(f.body)}`)
      return `mailto:${f.to.trim()}${params.length ? `?${params.join('&')}` : ''}`
    }
    case 'phone':
      return f.phone ? `tel:${f.phone.replace(/\s+/g, '')}` : ''
    case 'sms': {
      if (!f.phone) return ''
      return `SMSTO:${f.phone.replace(/\s+/g, '')}:${f.message || ''}`
    }
    case 'vcard': {
      if (!f.firstName && !f.lastName && !f.phone2 && !f.email2) return ''
      const full = [f.firstName, f.lastName].filter(Boolean).join(' ')
      const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${f.lastName || ''};${f.firstName || ''}`, `FN:${full}`]
      if (f.org) lines.push(`ORG:${f.org}`)
      if (f.phone2) lines.push(`TEL:${f.phone2}`)
      if (f.email2) lines.push(`EMAIL:${f.email2}`)
      if (f.url) lines.push(`URL:${f.url}`)
      lines.push('END:VCARD')
      return lines.join('\n')
    }
    case 'geo':
      return f.lat && f.lng ? `geo:${f.lat.trim()},${f.lng.trim()}` : ''
    case 'event': {
      if (!f.title && !f.start) return ''
      const lines = ['BEGIN:VEVENT', `SUMMARY:${f.title || ''}`]
      if (f.location) lines.push(`LOCATION:${f.location}`)
      if (f.start) lines.push(`DTSTART:${icalDate(f.start)}`)
      if (f.end) lines.push(`DTEND:${icalDate(f.end)}`)
      if (f.desc) lines.push(`DESCRIPTION:${f.desc}`)
      lines.push('END:VEVENT')
      return lines.join('\n')
    }
    default:
      return ''
  }
}

function ContentBuilder({ data, update }: { data: string; update: (patch: { data: string }) => void }) {
  const [kind, setKind] = useState<ContentKind>('text')
  const [f, setF] = useState<Record<string, string>>({})

  function setField(key: string, val: string) {
    const next = { ...f, [key]: val }
    setF(next)
    update({ data: composeContent(kind, next) })
  }
  function changeKind(k: ContentKind) {
    setKind(k)
    if (k !== 'text') update({ data: composeContent(k, f) })
  }

  return (
    <div className="space-y-3">
      <OptionRow
        label="Type"
        value={kind}
        options={CONTENT_KINDS.map((k) => ({ value: k.id, label: k.label }))}
        onChange={(v) => changeKind(v as ContentKind)}
      />

      {kind === 'text' && (
        <TextField label="URL or text" value={data} onChange={(v) => update({ data: v })} placeholder="https://example.com" type="url" />
      )}

      {kind === 'wifi' && (
        <>
          <TextField label="Network name (SSID)" value={f.ssid || ''} onChange={(v) => setField('ssid', v)} placeholder="MyWiFi" />
          <TextField label="Password" value={f.password || ''} onChange={(v) => setField('password', v)} placeholder="leave blank if open" />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={f.hidden === 'true'} onChange={(e) => setField('hidden', e.target.checked ? 'true' : '')} />
            Hidden network
          </label>
        </>
      )}

      {kind === 'email' && (
        <>
          <TextField label="To" value={f.to || ''} onChange={(v) => setField('to', v)} placeholder="name@example.com" type="email" />
          <TextField label="Subject" value={f.subject || ''} onChange={(v) => setField('subject', v)} placeholder="Optional" />
          <TextField label="Message" value={f.body || ''} onChange={(v) => setField('body', v)} placeholder="Optional" />
        </>
      )}

      {kind === 'phone' && (
        <TextField label="Phone number" value={f.phone || ''} onChange={(v) => setField('phone', v)} placeholder="+44 7700 900000" type="tel" />
      )}

      {kind === 'sms' && (
        <>
          <TextField label="Phone number" value={f.phone || ''} onChange={(v) => setField('phone', v)} placeholder="+44 7700 900000" type="tel" />
          <TextField label="Message" value={f.message || ''} onChange={(v) => setField('message', v)} placeholder="Optional pre-filled text" />
        </>
      )}

      {kind === 'vcard' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="First name" value={f.firstName || ''} onChange={(v) => setField('firstName', v)} placeholder="Jane" />
            <TextField label="Last name" value={f.lastName || ''} onChange={(v) => setField('lastName', v)} placeholder="Doe" />
          </div>
          <TextField label="Organisation" value={f.org || ''} onChange={(v) => setField('org', v)} placeholder="Optional" />
          <TextField label="Phone" value={f.phone2 || ''} onChange={(v) => setField('phone2', v)} placeholder="+44 7700 900000" type="tel" />
          <TextField label="Email" value={f.email2 || ''} onChange={(v) => setField('email2', v)} placeholder="name@example.com" type="email" />
          <TextField label="Website" value={f.url || ''} onChange={(v) => setField('url', v)} placeholder="https://example.com" type="url" />
        </>
      )}

      {kind === 'geo' && (
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Latitude" value={f.lat || ''} onChange={(v) => setField('lat', v)} placeholder="51.5074" />
          <TextField label="Longitude" value={f.lng || ''} onChange={(v) => setField('lng', v)} placeholder="-0.1278" />
        </div>
      )}

      {kind === 'event' && (
        <>
          <TextField label="Title" value={f.title || ''} onChange={(v) => setField('title', v)} placeholder="Team meeting" />
          <TextField label="Location" value={f.location || ''} onChange={(v) => setField('location', v)} placeholder="Optional" />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Starts" value={f.start || ''} onChange={(v) => setField('start', v)} type="datetime-local" />
            <TextField label="Ends" value={f.end || ''} onChange={(v) => setField('end', v)} type="datetime-local" />
          </div>
          <TextField label="Description" value={f.desc || ''} onChange={(v) => setField('desc', v)} placeholder="Optional" />
        </>
      )}
    </div>
  )
}
