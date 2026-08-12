import type { Options as QrOptions, DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from 'qr-code-styling'
import { UNISIM_MARK } from './unisimMark'
import type { FrameShape } from './frames'
import type { DecorStyle } from './decor'

export type { DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel }
export type ExportFormat = 'png' | 'svg' | 'jpeg' | 'webp'

/** The full, serialisable description of a QR code the user is designing. */
export interface QrConfig {
  /** Human label — used as the download filename and shown under the preview. */
  name: string
  /** The encoded payload (a URL, but any text works). */
  data: string

  // ── Geometry ──────────────────────────────────────────────────────────────
  /** Rendered size in px (square). */
  size: number
  /** Quiet-zone margin in px. */
  margin: number
  /** QR error-correction level. Fixed at 'H' (the highest) so the code stays
   *  scannable even when a centre logo obscures part of it. */
  ecLevel: ErrorCorrectionLevel

  // ── Colours ─────────────────────────────────────────────────────────────--
  fgColor: string
  bgColor: string
  /** Knock the background out (transparent PNG/SVG). */
  bgTransparent: boolean
  /** Blend the modules from fgColor → gradientColor. */
  useGradient: boolean
  gradientColor: string
  /** Gradient angle in degrees. */
  gradientRotation: number
  /** When true the finder corners follow the module colour; otherwise use
   *  cornerColor for a two-tone look. */
  matchCornerColor: boolean
  cornerColor: string

  // ── Module shapes ──────────────────────────────────────────────────────────
  dotType: DotType
  cornerSquareType: CornerSquareType
  cornerDotType: CornerDotType

  /** The silhouette of the whole code — a circle, hexagon or star instead of
   *  the usual square. This shapes the PLATE the code sits on; the code itself
   *  is rendered smaller and centred inside it, never clipped (see frames.ts).
   *  'square' is the default and takes the original render path untouched. */
  frameShape: FrameShape

  /** Marks filling the space a shaped plate leaves around the code, so the
   *  shape reads as designed rather than as a square code on a round
   *  background. Turning it on SHRINKS the code to make room (see decor.ts) —
   *  which is why it is opt-in, and why it does nothing at all on a square
   *  plate, where there is no space to fill. */
  decorStyle: DecorStyle

  /** Decoration follows the module colour. Off to give it its own. */
  matchDecorColor: boolean
  /** Decoration colour, used when matchDecorColor is false. */
  decorColor: string

  // ── Logo / branding ────────────────────────────────────────────────────────
  /** A user-supplied brand logo (data URI), placed in the centre. */
  logoDataUrl: string | null
  /** Centre-logo size as a fraction of the QR (0.1–0.5). */
  logoSize: number
  /** Padding in px between the logo and the surrounding modules. */
  logoMargin: number
  /** Clear the modules sitting directly behind the logo. */
  hideBackgroundDots: boolean
  /** Include the UNI·SIM mark — as the centre logo when no brand logo is set,
   *  or as a small bottom-right stamp when one is. */
  unisimMark: boolean
}

export const DOT_TYPES: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy rounded' }
]

export const CORNER_SQUARE_TYPES: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'extra-rounded', label: 'Rounded' },
  { value: 'dot', label: 'Dot' }
]

export const CORNER_DOT_TYPES: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' }
]

export const DEFAULT_CONFIG: QrConfig = {
  name: '',
  // Prefilled with the UNI·SIM address rather than left blank.
  //
  // It was blank for a while, so that a fresh generator could never bake a
  // stale URL into someone's download. That is a fear about a HIDDEN default,
  // though, and this one is not hidden: it arrives sitting in the address
  // field, is printed under the preview, and is one select-all away from being
  // replaced. Nothing gets encoded that the page is not also saying out loud.
  //
  // Blank also cost the page its demonstration. The preview sat behind an
  // "enter a URL" curtain, which since every load started dealing a random
  // style meant arriving to a curtain instead of to the thing the app makes.
  data: 'https://unisim.co.uk',
  size: 512,
  margin: 12,
  // Always highest correction so a centre logo never breaks scanning.
  ecLevel: 'H',
  // UNI·SIM branding, in the one arrangement that actually scans.
  //
  // This used to be brand orange #fe8c01 on black, which is an INVERTED code —
  // light modules on a dark ground. Strict readers refuse those outright, and
  // this app's own Scan tab is one of them: verified 2026-08-09 by rendering
  // through this exact pipeline and decoding with @zxing/library, the default
  // failed to decode at 512, 256, 160 and 96 px. Every size. It was unscannable
  // by its own scanner.
  //
  // Orange cannot be the dark element. #fe8c01 sits at a 2.3:1 contrast ratio
  // against white — below the 3:1 floor a decoder needs — and measuring rather
  // than guessing bore that out: orange-on-white decoded at small sizes but
  // FAILED at 512 px, which is exactly the marginal behaviour you do not ship.
  //
  // So the brand comes from the suite's actual scheme (white paper, dark ink,
  // orange as the spotlight) rather than from the module colour: near-black
  // modules on white for maximum contrast, the three finder patterns in
  // orange-600, and the UNI·SIM mark in the centre. Decodes at all four sizes.
  //
  // WARM off-black (#1C1917), not slate-900 (#0F172A). Slate is a blue-leaning
  // dark and pulls the opposite way from the orange eyes on the temperature
  // axis; a warm neutral of the same depth shares the orange's hue family, so
  // the two read as one palette instead of two decisions. Costs nothing in
  // legibility — 17.5:1 on white against slate's 17.9:1, both far above the 3:1
  // a decoder needs — so this is purely colour harmony.
  fgColor: '#1c1917',
  bgColor: '#ffffff',
  bgTransparent: false,
  useGradient: false,
  gradientColor: '#e05504',
  gradientRotation: 45,
  // The orange is on the EYES, where it reads as brand without being asked to
  // carry the data. #e05504 (Orange 600) not #fe8c01 (Orange 500): the deeper
  // of the canonical pair clears 3:1 on white, and the lighter one measurably
  // did not — it failed to decode at 512 px in the same harness.
  matchCornerColor: false,
  cornerColor: '#e05504',
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  frameShape: 'square',
  decorStyle: 'none',
  // Decoration follows the modules by default: it frames the code rather than
  // competing with it, and matching means switching decoration on can never
  // introduce a colour the user did not pick.
  matchDecorColor: true,
  decorColor: '#e05504',
  logoDataUrl: null,
  logoSize: 0.28,
  logoMargin: 6,
  hideBackgroundDots: true,
  unisimMark: true
}

/** One-click starting points shown as a row of chips above the controls.
 *
 *  Every preset pins the fields another preset might have changed — background,
 *  frameShape, decorStyle, logo size, gradient stops — not just the ones it
 *  cares about. A patch merges onto whatever the user already had, so without
 *  pinning them "Classic" would quietly keep a star silhouette and a burst
 *  around it.
 *
 *  That rule stopped being a nicety when loads started on a random preset: the
 *  app now switches style far more often than anyone clicking pills ever did,
 *  so an unpinned field is a value that follows you around. Two were, until
 *  the randomiser found them — Radial's enlarged centre mark (logoSize 0.3) and
 *  Sunset's gradient stops stayed behind on the next style, the second one
 *  invisibly, waiting to reappear the moment gradients were switched back on.
 *  Hence the repeated defaults below: 0.28, #e05504 at 45°.
 *
 *  Every preset sets an explicit, opaque background alongside its module
 *  colours. A preset patch is merged onto the user's current config, so if it
 *  only specified foreground colours it could land dark-on-dark (e.g. the
 *  default background is black) and leave the QR unscannable. Pinning the
 *  background here guarantees each preset keeps a strong module↔background
 *  contrast ratio — comfortably above what a scanner needs — no matter what the
 *  user had selected before. */
export interface Preset {
  name: string
  patch: Partial<QrConfig>
}

export const PRESETS: Preset[] = [
  {
    name: 'Classic',
    patch: {
      matchDecorColor: true,
      decorStyle: 'none',
      dotType: 'square',
      cornerSquareType: 'square',
      cornerDotType: 'square',
      fgColor: '#000000',
      bgColor: '#ffffff',
      bgTransparent: false,
      useGradient: false,
      gradientColor: '#e05504',
      gradientRotation: 45,
      matchCornerColor: true,
      logoSize: 0.28,
      frameShape: 'square'
    }
  },
  {
    name: 'Rounded',
    patch: {
      matchDecorColor: true,
      decorStyle: 'none',
      dotType: 'rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      bgTransparent: false,
      useGradient: false,
      gradientColor: '#e05504',
      gradientRotation: 45,
      matchCornerColor: true,
      logoSize: 0.28,
      frameShape: 'square'
    }
  },
  {
    name: 'Dots',
    patch: {
      matchDecorColor: true,
      decorStyle: 'none',
      dotType: 'dots',
      cornerSquareType: 'dot',
      cornerDotType: 'dot',
      fgColor: '#1e293b',
      bgColor: '#ffffff',
      bgTransparent: false,
      useGradient: false,
      gradientColor: '#e05504',
      gradientRotation: 45,
      matchCornerColor: false,
      cornerColor: '#e05504',
      logoSize: 0.28,
      frameShape: 'square'
    }
  },
  {
    name: 'Sunset',
    patch: {
      matchDecorColor: true,
      decorStyle: 'none',
      dotType: 'extra-rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      useGradient: true,
      // Deep warm modules on cream, NOT warm modules on dusk. The old pairing
      // reasoned about contrast RATIO and got the polarity backwards: a high
      // ratio with the modules lighter than the ground is still an inverted
      // code, and it failed to decode at every size in the same harness that
      // caught the default. These two stops sit at ~4.9:1 and ~7.5:1 against
      // the cream, dark-side-down, and decode at 512/256/160/96 px.
      fgColor: '#c2410c',
      gradientColor: '#9f1239',
      gradientRotation: 30,
      bgColor: '#fff7ed',
      bgTransparent: false,
      matchCornerColor: true,
      logoSize: 0.28,
      frameShape: 'square'
    }
  },
  {
    // The look the branded circular codes people point at have: dotted modules,
    // ROUND finder eyes (concentric circles, the closest a real QR gets to the
    // reference), a large centre mark, and the ring around it filled in rather
    // than left as blank background.
    name: 'Radial',
    patch: {
      matchDecorColor: true,
      dotType: 'dots',
      cornerSquareType: 'dot',
      cornerDotType: 'dot',
      fgColor: '#1c1917',
      bgColor: '#ffffff',
      bgTransparent: false,
      useGradient: false,
      gradientColor: '#e05504',
      gradientRotation: 45,
      matchCornerColor: false,
      cornerColor: '#e05504',
      frameShape: 'circle',
      decorStyle: 'burst',
      logoSize: 0.3,
      hideBackgroundDots: true
    }
  },
  {
    // BLACK on orange, not white on orange. White modules on an orange plate is
    // an INVERTED code — the exact fault that made the old default unscannable —
    // and it survived that clean-up because the decode harness was run with the
    // star SHAPE and its own colours, never with this preset's palette. Black on
    // #e05504 is 5.5:1 with the dark side down, which is what a reader needs.
    // The plate also moves to the canonical brand orange; #ea580c was the
    // Tailwind pair BRANDING.md retired.
    name: 'Star',
    patch: {
      matchDecorColor: true,
      decorStyle: 'burst',
      dotType: 'extra-rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      fgColor: '#000000',
      bgColor: '#e05504',
      bgTransparent: false,
      useGradient: false,
      gradientColor: '#e05504',
      gradientRotation: 45,
      matchCornerColor: true,
      logoSize: 0.28,
      frameShape: 'star'
    }
  }
]

/** A preset picked at random — the design a fresh load starts on, and what the
 *  Regenerate button hands out.
 *
 *  `exclude` is the preset already showing, and it is dropped from the pool
 *  rather than merely re-rolled: with six presets, one in six clicks of a button
 *  labelled "Regenerate" would otherwise change nothing on screen, which reads
 *  as a broken button rather than as chance.
 *
 *  Picking from PRESETS and nothing else is deliberate. Generating a style from
 *  scratch — random colours, random shapes — would happily produce a light-on-
 *  dark or thin-contrast code, the exact failure qrContrastIssue exists to catch
 *  and the one this file's comments are a long record of. Every preset here has
 *  been decoded through this pipeline, so a random one is always scannable. */
export function randomPreset(exclude?: string | null): Preset {
  const pool = PRESETS.filter((p) => p.name !== exclude)
  const choices = pool.length > 0 ? pool : PRESETS
  return choices[Math.floor(Math.random() * choices.length)]
}

/** The colour the decoration is actually drawn in.
 *
 *  One helper, because the canvas renderer, the SVG exporter and the controls
 *  all need the same answer — two places deciding the same thing is the class
 *  of bug this file keeps having to design against. */
export function decorColour(config: QrConfig): string {
  return config.matchDecorColor ? config.fgColor : config.decorColor
}

/** WCAG relative luminance (0–1) of a `#rrggbb` colour.
 *
 *  Gamma-corrected, unlike the plain channel average this replaced. That matters
 *  here rather than being pedantry: the naive version rates brand orange at 0.60
 *  against white's 1.0 and calls it a comfortable gap, where the correct figure
 *  is 0.40 — a 2.3:1 ratio, under the 3:1 a decoder needs. It was the metric
 *  that made the orange-on-something default look defensible. */
function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return 0
  const n = parseInt(m[1], 16)
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return (
    0.2126 * channel((n >> 16) & 0xff) +
    0.7152 * channel((n >> 8) & 0xff) +
    0.0722 * channel(n & 0xff)
  )
}

/** WCAG contrast ratio between two `#rrggbb` colours, 1–21. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** The minimum module↔background ratio a decoder can rely on. ISO/IEC 18004
 *  talks in reflectance rather than WCAG ratios; 3:1 is the practical floor the
 *  measurements here agree with — everything below it decoded only at some
 *  sizes, which is worse than failing outright because it looks fine on the
 *  desk and fails on a poster. */
export const MIN_QR_CONTRAST = 3

export type ContrastIssue =
  | { kind: 'inverted' }
  | { kind: 'low'; ratio: number; where: 'modules' | 'corners' }
  | null

/** What is wrong with this design's colours, if anything.
 *
 *  Two distinct faults, because they need different advice:
 *
 *  - `inverted` — the modules are LIGHTER than the background. The QR standard
 *    is dark-on-light and strict decoders reject the inverse rather than
 *    guessing. Verified against @zxing/library (this app's own Scan tab): the
 *    old default and the old Sunset preset decoded at NO size at all.
 *  - `low` — the polarity is right but the ratio is too thin. This is the
 *    quieter failure: brand orange on white decoded at 256 px and below yet
 *    failed at 512 px, so it passes a casual desk test and then fails in the
 *    wild.
 *
 *  Corner (finder-pattern) colour is checked too, and is arguably the more
 *  important of the two — a decoder locates those three squares before it reads
 *  a single module, so a low-contrast eye costs you the whole code. */
export function qrContrastIssue(config: QrConfig): ContrastIssue {
  if (config.bgTransparent) return null
  const bg = luminance(config.bgColor)
  const fgs = [config.fgColor, ...(config.useGradient ? [config.gradientColor] : [])]
  if (fgs.some((c) => luminance(c) > bg + 0.02)) return { kind: 'inverted' }

  const worstModule = Math.min(...fgs.map((c) => contrastRatio(c, config.bgColor)))
  if (worstModule < MIN_QR_CONTRAST) return { kind: 'low', ratio: worstModule, where: 'modules' }

  if (!config.matchCornerColor) {
    if (luminance(config.cornerColor) > bg + 0.02) return { kind: 'inverted' }
    const corner = contrastRatio(config.cornerColor, config.bgColor)
    if (corner < MIN_QR_CONTRAST) return { kind: 'low', ratio: corner, where: 'corners' }
  }
  return null
}

/** Back-compat shim: true when the design is an inverted code. */
export function isInvertedContrast(config: QrConfig): boolean {
  return qrContrastIssue(config)?.kind === 'inverted'
}

/** Best-effort hostname from the encoded data (empty for non-URL text). */
export function hostnameOf(data: string): string {
  try {
    return new URL(data.trim()).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/** The label shown under the preview and used as the export filename. Falls
 *  back to the URL's hostname when the user hasn't named the code (e.g. in
 *  Simple mode, where there's no name field). */
export function qrDisplayName(config: QrConfig): string {
  return config.name.trim() || hostnameOf(config.data) || 'QR code'
}

/** Resolve the image (data URI) that belongs in the centre of the QR, if any. */
export function centerImage(config: QrConfig): string | undefined {
  if (config.logoDataUrl) return config.logoDataUrl
  if (config.unisimMark) return UNISIM_MARK
  return undefined
}

/** True when the UNI·SIM mark should be stamped in the corner (i.e. the centre
 *  is already taken by the user's own brand logo). */
export function showsCornerMark(config: QrConfig): boolean {
  return config.unisimMark && !!config.logoDataUrl
}

/** Geometry of the corner UNI·SIM stamp, in px, for a given rendered size. */
export function cornerStampGeometry(size: number, margin: number) {
  const badge = Math.max(28, Math.round(size * 0.16))
  const inset = margin + Math.round(size * 0.03)
  const pos = size - badge - inset
  return { badge, inset, x: pos, y: pos }
}

/** Map a QrConfig into the options object understood by qr-code-styling. */
export function buildQrOptions(config: QrConfig, type: 'canvas' | 'svg' = 'canvas'): QrOptions {
  const gradient = config.useGradient
    ? {
        type: 'linear' as const,
        rotation: (config.gradientRotation * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: config.fgColor },
          { offset: 1, color: config.gradientColor }
        ]
      }
    : undefined

  const cornerColor = config.matchCornerColor ? config.fgColor : config.cornerColor

  return {
    type,
    width: config.size,
    height: config.size,
    margin: config.margin,
    // qr-code-styling throws on empty data; callers guard against this, but keep
    // a single-space fallback so a transient empty string never crashes a render.
    data: config.data || ' ',
    image: centerImage(config),
    qrOptions: { errorCorrectionLevel: config.ecLevel },
    imageOptions: {
      hideBackgroundDots: config.hideBackgroundDots,
      imageSize: config.logoSize,
      margin: config.logoMargin,
      crossOrigin: 'anonymous'
    },
    dotsOptions: { type: config.dotType, color: config.fgColor, gradient },
    cornersSquareOptions: {
      type: config.cornerSquareType,
      color: cornerColor,
      gradient: config.matchCornerColor ? gradient : undefined
    },
    cornersDotOptions: { type: config.cornerDotType, color: cornerColor },
    backgroundOptions: {
      color: config.bgTransparent ? 'rgba(255,255,255,0)' : config.bgColor
    }
  }
}
