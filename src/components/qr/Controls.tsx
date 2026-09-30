import { useState, type ReactNode } from 'react'
import { ChipToggle, isNativeShell, useFileDrop } from '@unisim/sdk'
import { useQrStore, type ContentKind } from '../../stores/qrStore'
import {
  CORNER_DOT_TYPES,
  CORNER_SQUARE_TYPES,
  DOT_TYPES,
  PRESETS,
  qrContrastIssue,
  starPlacementPatch,
  MIN_QR_CONTRAST,
  type CornerDotType,
  type CornerSquareType,
  type DotType
} from '@unisim/qr'
import { FRAME_SHAPES, STAR_PLACEMENTS, frameSizeNote, type FrameShape, type StarPlacement } from '@unisim/qr'
import { DECOR_STYLES, type DecorStyle } from '@unisim/qr'
import { decorScaleOf, starBehind } from '@unisim/qr'
import { SYMBOLOGIES, symbologyById, type BarcodeSymbology } from '../../lib/barcode'
import LinkCheck from './LinkCheck'
import { getT, intlLocale, useT, type BasicTranslator, type MessageKey } from '../../i18n'

// ── Labels from @unisim/qr, translated here ───────────────────────────────
// The option lists and the preset names live in the shared package, in
// English. The package is not ours to translate, so each list is mapped here
// from its option id (a preset: its name) to a key. An id with no key — one
// the package added after this map was written — shows the package's English
// label rather than breaking.
const PRESET_KEYS: Record<string, MessageKey> = {
  Classic: 'controls.preset_classic',
  Rounded: 'controls.preset_rounded',
  Dots: 'controls.preset_dots',
  Sunset: 'controls.preset_sunset',
  Radial: 'controls.preset_radial',
  Star: 'controls.preset_star',
}
const FRAME_SHAPE_KEYS: Record<string, MessageKey> = {
  square: 'controls.shape_square',
  rounded: 'controls.shape_rounded',
  circle: 'controls.shape_circle',
  squircle: 'controls.shape_squircle',
  hexagon: 'controls.shape_hexagon',
  star: 'controls.shape_star',
}
const STAR_PLACEMENT_KEYS: Record<string, MessageKey> = {
  inside: 'controls.star_placement_inside',
  behind: 'controls.star_placement_behind',
}
const DECOR_STYLE_KEYS: Record<string, MessageKey> = {
  none: 'controls.decor_none',
  burst: 'controls.decor_burst',
  scatter: 'controls.decor_scatter',
}
const DOT_TYPE_KEYS: Record<string, MessageKey> = {
  square: 'controls.dot_square',
  rounded: 'controls.dot_rounded',
  'extra-rounded': 'controls.dot_extra_rounded',
  dots: 'controls.dot_dots',
  classy: 'controls.dot_classy',
  'classy-rounded': 'controls.dot_classy_rounded',
}
const CORNER_SQUARE_KEYS: Record<string, MessageKey> = {
  square: 'controls.corner_frame_square',
  'extra-rounded': 'controls.corner_frame_rounded',
  dot: 'controls.corner_frame_dot',
}
const CORNER_DOT_KEYS: Record<string, MessageKey> = {
  square: 'controls.corner_dot_square',
  dot: 'controls.corner_dot_dot',
}

function localiseOptions(
  t: BasicTranslator,
  options: readonly { value: string; label: string }[],
  keys: Record<string, MessageKey>,
): { value: string; label: string }[] {
  return options.map((o) => ({ value: o.value, label: keys[o.value] ? t(keys[o.value]) : o.label }))
}

/** A preset's name in the current language. The English name stays the id —
 *  it is what the store remembers as the active preset. */
/** A contrast ratio in the reader's number format: "2.4" in English, "2,4" in
 *  French, German, Portuguese… `toFixed` always wrote the English point. */
function oneDecimal(n: number, lang: string): string {
  return new Intl.NumberFormat(intlLocale(lang), { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n)
}

export function presetLabel(name: string, t: BasicTranslator = getT()): string {
  return PRESET_KEYS[name] ? t(PRESET_KEYS[name]) : name
}

// frameSizeNote's sentence, rebuilt from its numbers. Matched by its shape
// rather than recomputed, so the figures are exactly the package's; a note in a
// shape this does not know is shown as the package wrote it.
const FRAME_NOTE_KEYS: Record<string, MessageKey> = {
  rounded: 'controls.frame_note_rounded',
  circle: 'controls.frame_note_circle',
  squircle: 'controls.frame_note_squircle',
  hexagon: 'controls.frame_note_hexagon',
  star: 'controls.frame_note_star',
}
function localiseFrameNote(t: BasicTranslator, note: string, shape: string, behind: boolean): string {
  const m = /^The code fills (\d+)% of the (\d+)px image \((\d+)px\) — /.exec(note)
  const key = behind ? 'controls.frame_note_star_behind' : FRAME_NOTE_KEYS[shape]
  if (!m || !key) return note
  return t(key, { pct: m[1], size: m[2], inner: m[3] })
}

export default function Controls() {
  const t = useT()
  const config = useQrStore((s) => s.config)
  const update = useQrStore((s) => s.update)
  const applyPreset = useQrStore((s) => s.applyPreset)
  const activePreset = useQrStore((s) => s.presetName)
  const setLogo = useQrStore((s) => s.setLogo)
  const clearLogo = useQrStore((s) => s.clearLogo)
  const frameNote = frameSizeNote(config.frameShape, config.size, decorScaleOf(config), config.starPlacement)
  const behind = starBehind(config)
  const contrast = qrContrastIssue(config)
  const codeType = useQrStore((s) => s.codeType)
  const isBarcode = codeType === 'barcode'

  // Mechanics from the SDK, so the empty state below can take a dragged image
  // as well as a click — the panel has always said "drop your brand mark" and
  // now it means it.
  const logo = useFileDrop({
    onFiles: (files) => onLogoFile(files[0]),
    accept: 'image/*,.svg',
    multiple: false,
    label: t('controls.logo_drop_label'),
  })

  function onLogoFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert(t('controls.logo_not_image'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogo(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // What the code holds — and whether it is a QR code or a barcode at all — is
  // chosen on the "What's it for?" card above every panel (ContentCard), so
  // this panel is style only. A barcode has no style to set: colours, shapes
  // and logos are QR-only ideas, and showing them would imply otherwise.
  if (isBarcode) return null

  return (
    <div className="space-y-5">
      {/* ── Name ────────────────────────────────────────────────────────── */}
      <Section title={t('controls.name_title')} desc={t('controls.name_desc')}>
        <TextField
          label={t('controls.name_label')}
          value={config.name}
          onChange={(v) => update({ name: v })}
          placeholder={t('controls.name_placeholder')}
        />
      </Section>

      {/* ── Presets ─────────────────────────────────────────────────────── */}
      <Section title={t('controls.presets_title')} desc={t('controls.presets_desc')}>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('controls.presets_title')}>
          {PRESETS.map((p) => (
            <PresetPill
              key={p.name}
              name={presetLabel(p.name, t)}
              active={p.name === activePreset}
              onClick={() => applyPreset(p.name, p.patch)}
            />
          ))}
        </div>
      </Section>

      {/* ── Colours ─────────────────────────────────────────────────────── */}
      <Section title={t('controls.colours_title')}>
        <div className="grid grid-cols-2 gap-3">
          <Swatch label={t('controls.colour_modules')} value={config.fgColor} onChange={(v) => update({ fgColor: v })} />
          <Swatch
            label={t('controls.colour_background')}
            value={config.bgColor}
            onChange={(v) => update({ bgColor: v })}
            disabled={config.bgTransparent}
          />
        </div>

        <Toggle
          label={t('controls.transparent_background')}
          checked={config.bgTransparent}
          onChange={(v) => update({ bgTransparent: v })}
          hint={t('controls.transparent_background_hint')}
        />

        <Toggle
          label={t('controls.gradient_modules')}
          checked={config.useGradient}
          onChange={(v) => update({ useGradient: v })}
        />
        {config.useGradient && (
          <div className="pl-1 space-y-3 border-l-2 border-orange-100 ml-1 dark:border-orange-500/30">
            <div className="pl-3 space-y-3">
              <Swatch
                label={t('controls.gradient_end')}
                value={config.gradientColor}
                onChange={(v) => update({ gradientColor: v })}
              />
              <RangeField
                label={t('controls.gradient_angle')}
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
          label={t('controls.two_tone_corners')}
          checked={!config.matchCornerColor}
          onChange={(v) => update({ matchCornerColor: !v })}
          hint={t('controls.two_tone_corners_hint')}
        />
        {!config.matchCornerColor && (
          <div className="pl-4">
            <Swatch
              label={t('controls.corner_colour')}
              value={config.cornerColor}
              onChange={(v) => update({ cornerColor: v })}
            />
          </div>
        )}

        {contrast?.kind === 'inverted' && (
          <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
            <strong className="font-semibold">
              {contrast.where === 'star'
                ? t('controls.contrast_inverted_star_title')
                : t('controls.contrast_inverted_background_title')}
            </strong>{' '}
            {contrast.where === 'star'
              ? t('controls.contrast_inverted_star_body')
              : t('controls.contrast_inverted_background_body')}
          </p>
        )}

        {contrast?.kind === 'low' && contrast.where === 'star' && (
          <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
            <strong className="font-semibold">{t('controls.contrast_low_star_title')}</strong>{' '}
            {t('controls.contrast_low_star_body', { ratio: oneDecimal(contrast.ratio, t.lang), min: oneDecimal(MIN_QR_CONTRAST, t.lang) })}
          </p>
        )}

        {contrast?.kind === 'low' && contrast.where !== 'star' && (
          <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
            <strong className="font-semibold">
              {contrast.where === 'corners'
                ? t('controls.contrast_low_corners_title')
                : t('controls.contrast_low_modules_title')}
            </strong>{' '}
            {contrast.where === 'corners'
              ? t('controls.contrast_low_corners_body', { ratio: oneDecimal(contrast.ratio, t.lang), min: oneDecimal(MIN_QR_CONTRAST, t.lang) })
              : t('controls.contrast_low_modules_body', { ratio: oneDecimal(contrast.ratio, t.lang), min: oneDecimal(MIN_QR_CONTRAST, t.lang) })}
          </p>
        )}
      </Section>

      {/* ── Shape & size ────────────────────────────────────────────────── */}
      <Section title={t('controls.shape_title')} desc={t('controls.shape_desc')}>
        <OptionRow
          label={t('controls.code_shape')}
          value={config.frameShape}
          options={localiseOptions(t, FRAME_SHAPES, FRAME_SHAPE_KEYS)}
          onChange={(v) => {
            // A shaped plate arrives DECORATED. The empty ring is the thing that
            // makes a shaped code look like a square one dropped on a circle, so
            // "shape with nothing in the gap" is the state nobody actually wants
            // as a starting point — they can still turn it off. Square goes back
            // to none, because there is no gap to fill and leaving a style set
            // would silently re-decorate the next shape they picked.
            //
            // A star arrives with the code IN FRONT of it, for the same reason
            // and one more: the arrangement it would otherwise land in fits the
            // code into 37% of the image, which is the version people try once
            // and abandon. Inside is one click away and keeps the burst that
            // was just switched on.
            const frameShape = v as FrameShape
            const decor =
              frameShape === 'square'
                ? { decorStyle: 'none' as DecorStyle }
                : config.decorStyle === 'none'
                  ? { decorStyle: 'burst' as DecorStyle }
                  : {}
            const star =
              frameShape === 'star' && config.starPlacement !== 'behind'
                ? starPlacementPatch(config, 'behind')
                : {}
            update({ frameShape, ...decor, ...star })
          }}
        />

        {/* Star only, because "behind" is the one arrangement that isn't a
            plate and the other shapes have nothing to gain from it: a circle or
            a hexagon behind a square code shows a sliver of curve, where a star
            shows five points. */}
        {config.frameShape === 'star' && (
          <>
            <OptionRow
              label={t('controls.star_placement')}
              value={config.starPlacement}
              options={localiseOptions(t, STAR_PLACEMENTS, STAR_PLACEMENT_KEYS)}
              // The colours move WITH the switch — see starPlacementPatch for
              // why a placement change cannot be just a placement change.
              onChange={(v) => update(starPlacementPatch(config, v as StarPlacement))}
              compact
            />
            {behind && (
              <Swatch
                label={t('controls.star_colour')}
                value={config.starColor}
                onChange={(v) => update({ starColor: v })}
              />
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {behind ? t('controls.star_behind_desc') : t('controls.star_inside_desc')}
            </p>
          </>
        )}

        {/* Shown on every shape INCLUDING square, and hidden on exactly one
            arrangement — the star behind the code.
            It was hidden unless the shape was already non-square, on the
            reasoning that a square plate has no space to decorate — true, and
            beside the point: the default shape IS square, so the control was
            invisible on a fresh load and the only way to find decoration at all
            was to happen to click the Radial preset. A control you cannot
            discover is not a control. Picking a decoration on a square plate
            therefore switches the shape too, so the option is never a dead end.
            A star behind the code is the different case: there is no ring
            between the two to fill, and decorating anyway would only shrink the
            code that just got bigger. The chosen style is kept, not cleared, so
            switching back to Inside brings the burst back with it. */}
        {!behind && (
          <OptionRow
            label={t('controls.decoration')}
            value={config.decorStyle}
            options={localiseOptions(t, DECOR_STYLES, DECOR_STYLE_KEYS)}
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
        )}
        {!behind && config.decorStyle !== 'none' && (
          <>
            <Toggle
              label={t('controls.decoration_matches')}
              checked={config.matchDecorColor}
              onChange={(v) => update({ matchDecorColor: v })}
              hint={t('controls.decoration_matches_hint')}
            />
            {!config.matchDecorColor && (
              <div className="pl-3 border-l-2 border-orange-100 dark:border-orange-500/30">
                <Swatch
                  label={t('controls.decoration_colour')}
                  value={config.decorColor}
                  onChange={(v) => update({ decorColor: v })}
                />
              </div>
            )}
          </>
        )}

        {behind ? null : config.decorStyle !== 'none' ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('controls.decoration_on_note')}</p>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('controls.decoration_off_note')}</p>
        )}
        {frameNote && (
          <p className="-mt-1 text-xs text-slate-500 dark:text-slate-400">
            {localiseFrameNote(t, frameNote, config.frameShape, behind)} {t('controls.frame_note_never_trimmed')}
          </p>
        )}
        <OptionRow
          label={t('controls.module_style')}
          value={config.dotType}
          options={localiseOptions(t, DOT_TYPES, DOT_TYPE_KEYS)}
          onChange={(v) => update({ dotType: v as DotType })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <OptionRow
            label={t('controls.corner_frame')}
            value={config.cornerSquareType}
            options={localiseOptions(t, CORNER_SQUARE_TYPES, CORNER_SQUARE_KEYS)}
            onChange={(v) => update({ cornerSquareType: v as CornerSquareType })}
            compact
          />
          <OptionRow
            label={t('controls.corner_dot')}
            value={config.cornerDotType}
            options={localiseOptions(t, CORNER_DOT_TYPES, CORNER_DOT_KEYS)}
            onChange={(v) => update({ cornerDotType: v as CornerDotType })}
            compact
          />
        </div>
        <RangeField
          label={t('controls.size')}
          value={config.size}
          min={128}
          max={1024}
          step={16}
          suffix=" px"
          onChange={(v) => update({ size: v })}
        />
        <RangeField
          label={t('controls.quiet_zone')}
          value={config.margin}
          min={0}
          max={64}
          step={2}
          suffix=" px"
          onChange={(v) => update({ margin: v })}
        />
      </Section>

      {/* ── Logo & branding ─────────────────────────────────────────────── */}
      <Section title={t('controls.logo_title')} desc={t('controls.logo_desc')}>
        <input {...logo.inputProps} hidden />
        {config.logoDataUrl ? (
          <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <img
              src={config.logoDataUrl}
              alt={t('controls.logo_preview_alt')}
              className="w-12 h-12 rounded-lg object-contain bg-white ring-1 ring-slate-200 p-1 dark:ring-slate-600"
            />
            <div className="flex-1 text-sm text-slate-600 dark:text-slate-300">{t('controls.logo_added')}</div>
            <button
              type="button"
              onClick={logo.open}
              className="text-xs font-medium text-slate-600 hover:text-orange-700 px-2 py-1 dark:text-slate-300 dark:hover:text-orange-400"
            >
              {t('controls.logo_replace')}
            </button>
            <button
              type="button"
              onClick={clearLogo}
              className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 dark:text-red-400 dark:hover:text-red-300"
            >
              {t('controls.logo_remove')}
            </button>
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
            <RangeField
              label={t('controls.logo_size')}
              value={Math.round(config.logoSize * 100)}
              min={10}
              max={50}
              step={1}
              suffix="%"
              onChange={(v) => update({ logoSize: v / 100 })}
            />
            <RangeField
              label={t('controls.logo_padding')}
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
          label={t('controls.clear_behind_logo')}
          checked={config.hideBackgroundDots}
          onChange={(v) => update({ hideBackgroundDots: v })}
        />

        <UnisimMarkToggle />
      </Section>
    </div>
  )
}

/**
 * "Remove UNI·SIM mark" — worded as a removal on purpose (James, 2026-09-30).
 * The mark is ON by default so a code nobody customised advertises UNI·SIM;
 * the switch starts off, like every other one, and turning it on takes the
 * mark away. `unisimMark` itself is unchanged, so saved designs and the
 * renderer read it exactly as before. Shared by Branding and Advanced.
 */
export function UnisimMarkToggle() {
  const unisimMark = useQrStore((s) => s.config.unisimMark)
  const hasLogo = useQrStore((s) => !!s.config.logoDataUrl)
  const update = useQrStore((s) => s.update)
  const t = useT()
  return (
    <Toggle
      label={t('controls.remove_unisim_mark')}
      checked={!unisimMark}
      onChange={(remove) => update({ unisimMark: !remove })}
      hint={
        hasLogo
          ? t('controls.remove_unisim_mark_hint_logo')
          : t('controls.remove_unisim_mark_hint')
      }
    />
  )
}

/** "Drop a logo here, or click to choose" is a desktop sentence: on a phone
 *  there is nothing to drop and nobody clicks. Coarse pointer ⇒ touch. */
export function logoPickerLabel(): string {
  const touch = isNativeShell() || (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches)
  const t = getT()
  return touch ? t('controls.logo_pick_touch') : t('controls.logo_pick_desktop')
}

/** A style-preset pill. Shows its SELECTED state, not just hover — a row where
 *  nothing ever looks chosen gives no feedback that the click landed, and no way
 *  to tell later which preset a design started from. */
function PresetPill({ name, active, onClick }: { name: string; active: boolean; onClick: () => void }) {
  return (
    <ChipToggle selected={active} role="radio" onClick={onClick}>
      {name}
    </ChipToggle>
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
  const t = useT()
  const def = symbologyById(symbology)
  const trimmed = value.trim()
  const error = trimmed.length === 0 ? null : def.validate(trimmed)
  return (
    <div className="space-y-3">
      <OptionRow
        label={t('controls.barcode_type')}
        value={symbology}
        options={SYMBOLOGIES.map((s) => ({ value: s.id, label: s.label }))}
        onChange={(v) => setSymbology(v as BarcodeSymbology)}
      />
      <FieldLabel>{t('controls.barcode_value')}</FieldLabel>
      <input
        id="barcode-value"
        type="text"
        inputMode={def.id === 'code128' || def.id === 'code39' ? 'text' : 'numeric'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={def.placeholder}
        aria-label={t('controls.barcode_value_aria', { format: def.label })}
        aria-invalid={!!error}
        className={`w-full rounded-xl border px-4 py-3 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-slate-100 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
            : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/40 dark:border-slate-700'
        }`}
      />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {def.hint} {t('controls.barcode_static_note')}
      </p>
    </div>
  )
}

// ── Reusable field primitives ──────────────────────────────────────────────

// `title` is rendered as plain text. It used to use dangerouslySetInnerHTML to
// decode an `&amp;` entity in a couple of titles — that's an XSS footgun the
// moment anyone passes dynamic text, for zero benefit. Titles are now literal
// strings with a real "&".
function Section({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {desc && <p className="mt-0.5 mb-3 text-xs text-slate-500 dark:text-slate-400">{desc}</p>}
      <div className={desc ? 'space-y-3' : 'mt-3 space-y-3'}>{children}</div>
    </section>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">{children}</label>
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
        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
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
  const t = useT()
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
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
          aria-label={t('controls.colour_hex_aria', { label })}
          className="w-full min-w-0 text-sm font-mono uppercase text-slate-700 focus:outline-none dark:text-slate-200"
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
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            checked ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
      {hint && <p className="mt-1 text-xs text-slate-500 pr-14 dark:text-slate-400">{hint}</p>}
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
        <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
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
                ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500'
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
// Link and Wi-Fi are what most people come for, so they are the row (James,
// 2026-09-30: "just have link, wifi, more"); everything else waits behind More.
// Barcode sits there too: a different kind of code altogether, and rarer than
// any QR payload.
// Labels are keys, read at render, so the chips follow the language.
const PRIMARY_KINDS: { id: ContentKind; labelKey: MessageKey }[] = [
  { id: 'text', labelKey: 'controls.kind_link' },
  { id: 'wifi', labelKey: 'controls.kind_wifi' },
]
const MORE_KINDS: { id: ContentKind | 'barcode'; labelKey: MessageKey }[] = [
  { id: 'vcard', labelKey: 'controls.kind_contact' },
  { id: 'email', labelKey: 'controls.kind_email' },
  { id: 'phone', labelKey: 'controls.kind_phone' },
  { id: 'sms', labelKey: 'controls.kind_sms' },
  { id: 'geo', labelKey: 'controls.kind_location' },
  { id: 'event', labelKey: 'controls.kind_event' },
  { id: 'barcode', labelKey: 'controls.kind_barcode' },
]

/**
 * What the preview card calls the code: "Wi-Fi · Cafe Guest" rather than the
 * raw `WIFI:T:WPA;S:Cafe Guest;P:…` payload it used to print, which also put
 * the network password on screen for anyone looking over a shoulder. A name
 * the user typed (Advanced ▸ Name) still wins as the title.
 */
export function contentSummary(kind: ContentKind, f: Record<string, string>, data: string): { title: string | null; detail: string } {
  const joined = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ')
  const t = getT()
  switch (kind) {
    case 'wifi': return { title: t('controls.kind_wifi'), detail: f.ssid || '' }
    case 'vcard': return { title: t('controls.kind_contact'), detail: joined(f.firstName, f.lastName) || f.org || '' }
    case 'email': return { title: t('controls.kind_email'), detail: f.to || '' }
    case 'phone': return { title: t('controls.kind_phone'), detail: f.phone || '' }
    case 'sms': return { title: t('controls.kind_sms'), detail: f.phone || '' }
    case 'geo': return { title: t('controls.kind_location'), detail: f.lat && f.lng ? `${f.lat}, ${f.lng}` : '' }
    case 'event': return { title: t('controls.kind_event'), detail: f.title || '' }
    default: return { title: null, detail: data }
  }
}

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

/**
 * "What's it for?" — the first card in every panel (Simple, Branding and
 * Advanced alike), because what a code holds comes before how it looks.
 *
 * Until 2026-09-30 Simple offered only a website address, and Wi-Fi, contacts
 * and barcodes sat three levels down under Advanced ▸ Type — while the store
 * listing sold them as the headline features.
 */
export function ContentCard() {
  const t = useT()
  const data = useQrStore((s) => s.config.data)
  const update = useQrStore((s) => s.update)
  const kind = useQrStore((s) => s.contentKind)
  const f = useQrStore((s) => s.contentFields)
  const setContent = useQrStore((s) => s.setContent)
  const codeType = useQrStore((s) => s.codeType)
  const setCodeType = useQrStore((s) => s.setCodeType)
  const symbology = useQrStore((s) => s.barcodeSymbology)
  const setSymbology = useQrStore((s) => s.setBarcodeSymbology)
  const barcodeValue = useQrStore((s) => s.barcodeValue)
  const setBarcodeValue = useQrStore((s) => s.setBarcodeValue)
  const isBarcode = codeType === 'barcode'
  const current: ContentKind | 'barcode' = isBarcode ? 'barcode' : kind
  const inMore = MORE_KINDS.some((k) => k.id === current)
  const [moreOpen, setMoreOpen] = useState(inMore)

  function setField(key: string, val: string) {
    const next = { ...f, [key]: val }
    setContent(kind, next)
    update({ data: composeContent(kind, next) })
  }

  function pick(next: ContentKind | 'barcode') {
    if (next === 'barcode') {
      setCodeType('barcode')
      return
    }
    setCodeType('qr')
    // A link is typed straight into config.data, so park it before another
    // kind overwrites data with its payload, and hand it back on return —
    // otherwise going Link → Wi-Fi → Link left the raw `WIFI:` string in the
    // link box.
    const fields = kind === 'text' && !isBarcode ? { ...f, text: data } : f
    setContent(next, fields)
    update({ data: next === 'text' ? (fields.text ?? '') : composeContent(next, fields) })
  }

  function Kind({ id, labelKey }: { id: ContentKind | 'barcode'; labelKey: MessageKey }) {
    return (
      <ChipToggle selected={current === id} role="radio" onClick={() => pick(id)}>
        {t(labelKey)}
      </ChipToggle>
    )
  }

  return (
    <Section title={t('controls.content_title')}>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('controls.content_title')}>
        {PRIMARY_KINDS.map((k) => (
          <Kind key={k.id} {...k} />
        ))}
        {/* More opens a row, it is not itself a choice, so it carries an arrow
            that flips while the row is open rather than the tick a chosen chip
            gets. When the choice lives in that row, More is highlighted (the
            chip's own pressed look) so the answer is visible even with the
            row shut; the tick stays on the real choice. Built from the SDK
            chip's classes because ChipToggle swaps its icon for a tick. */}
        <button
          type="button"
          className="u-chip u-chip--pick"
          aria-pressed={inMore}
          aria-expanded={moreOpen || inMore}
          // A second tap closes the row AND drops a choice made inside it, back
          // to Link (James, 2026-09-30) — the row can't hide a ticked chip, so
          // shutting it means "none of these".
          onClick={() => {
            if (moreOpen || inMore) {
              if (inMore) pick('text')
              setMoreOpen(false)
            } else {
              setMoreOpen(true)
            }
          }}
        >
          {t('controls.kind_more')}
          <span className="u-chip__icon" aria-hidden="true">
            <svg
              viewBox="0 0 20 20"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${moreOpen || inMore ? 'rotate-180' : ''}`}
            >
              <path d="M5 7.5l5 5 5-5" />
            </svg>
          </span>
        </button>
      </div>
      {(moreOpen || inMore) && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('controls.more_kinds_aria')}>
          {MORE_KINDS.map((k) => (
            <Kind key={k.id} {...k} />
          ))}
        </div>
      )}

      {isBarcode && (
        <BarcodeFields symbology={symbology} setSymbology={setSymbology} value={barcodeValue} onChange={setBarcodeValue} />
      )}

      {!isBarcode && kind === 'text' && (
        <div>
          <TextField label={t('controls.link_label')} value={data} onChange={(v) => update({ data: v })} placeholder="https://example.com" type="url" />
          <LinkCheck value={data} onFix={(href) => update({ data: href })} />
        </div>
      )}

      {!isBarcode && kind === 'wifi' && (
        <>
          <TextField label={t('controls.wifi_ssid')} value={f.ssid || ''} onChange={(v) => setField('ssid', v)} placeholder={t('controls.wifi_ssid_placeholder')} />
          <TextField label={t('controls.wifi_password')} value={f.password || ''} onChange={(v) => setField('password', v)} placeholder={t('controls.wifi_password_placeholder')} />
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={f.hidden === 'true'} onChange={(e) => setField('hidden', e.target.checked ? 'true' : '')} />
            {t('controls.wifi_hidden')}
          </label>
        </>
      )}

      {!isBarcode && kind === 'email' && (
        <>
          <TextField label={t('controls.email_to')} value={f.to || ''} onChange={(v) => setField('to', v)} placeholder="name@example.com" type="email" />
          <TextField label={t('controls.email_subject')} value={f.subject || ''} onChange={(v) => setField('subject', v)} placeholder={t('controls.optional')} />
          <TextField label={t('controls.email_message')} value={f.body || ''} onChange={(v) => setField('body', v)} placeholder={t('controls.optional')} />
        </>
      )}

      {!isBarcode && kind === 'phone' && (
        <TextField label={t('controls.phone_number')} value={f.phone || ''} onChange={(v) => setField('phone', v)} placeholder="+44 7700 900000" type="tel" />
      )}

      {!isBarcode && kind === 'sms' && (
        <>
          <TextField label={t('controls.phone_number')} value={f.phone || ''} onChange={(v) => setField('phone', v)} placeholder="+44 7700 900000" type="tel" />
          <TextField label={t('controls.sms_message')} value={f.message || ''} onChange={(v) => setField('message', v)} placeholder={t('controls.sms_message_placeholder')} />
        </>
      )}

      {!isBarcode && kind === 'vcard' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <TextField label={t('controls.contact_first_name')} value={f.firstName || ''} onChange={(v) => setField('firstName', v)} placeholder={t('controls.contact_first_name_placeholder')} />
            <TextField label={t('controls.contact_last_name')} value={f.lastName || ''} onChange={(v) => setField('lastName', v)} placeholder={t('controls.contact_last_name_placeholder')} />
          </div>
          <TextField label={t('controls.contact_org')} value={f.org || ''} onChange={(v) => setField('org', v)} placeholder={t('controls.optional')} />
          <TextField label={t('controls.contact_phone')} value={f.phone2 || ''} onChange={(v) => setField('phone2', v)} placeholder="+44 7700 900000" type="tel" />
          <TextField label={t('controls.contact_email')} value={f.email2 || ''} onChange={(v) => setField('email2', v)} placeholder="name@example.com" type="email" />
          <TextField label={t('controls.contact_website')} value={f.url || ''} onChange={(v) => setField('url', v)} placeholder="https://example.com" type="url" />
        </>
      )}

      {!isBarcode && kind === 'geo' && (
        <div className="grid grid-cols-2 gap-3">
          <TextField label={t('controls.geo_latitude')} value={f.lat || ''} onChange={(v) => setField('lat', v)} placeholder="51.5074" />
          <TextField label={t('controls.geo_longitude')} value={f.lng || ''} onChange={(v) => setField('lng', v)} placeholder="-0.1278" />
        </div>
      )}

      {!isBarcode && kind === 'event' && (
        <>
          <TextField label={t('controls.event_title')} value={f.title || ''} onChange={(v) => setField('title', v)} placeholder={t('controls.event_title_placeholder')} />
          <TextField label={t('controls.event_location')} value={f.location || ''} onChange={(v) => setField('location', v)} placeholder={t('controls.optional')} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label={t('controls.event_starts')} value={f.start || ''} onChange={(v) => setField('start', v)} type="datetime-local" />
            <TextField label={t('controls.event_ends')} value={f.end || ''} onChange={(v) => setField('end', v)} type="datetime-local" />
          </div>
          <TextField label={t('controls.event_description')} value={f.desc || ''} onChange={(v) => setField('desc', v)} placeholder={t('controls.optional')} />
        </>
      )}
    </Section>
  )
}
