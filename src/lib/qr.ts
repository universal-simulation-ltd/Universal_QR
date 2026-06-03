import type { Options as QrOptions, DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from 'qr-code-styling'
import { UNISIM_MARK } from './unisimMark'

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
  data: 'https://www.unisim.co.uk',
  size: 512,
  margin: 12,
  // Always highest correction so a centre logo never breaks scanning.
  ecLevel: 'H',
  fgColor: '#fe8c01',
  bgColor: '#000000',
  bgTransparent: false,
  useGradient: false,
  gradientColor: '#fe8c01',
  gradientRotation: 45,
  matchCornerColor: true,
  cornerColor: '#fe8c01',
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  logoDataUrl: null,
  logoSize: 0.28,
  logoMargin: 6,
  hideBackgroundDots: true,
  unisimMark: true
}

/** One-click starting points shown as a row of chips above the controls.
 *
 *  Every preset sets an explicit, opaque background alongside its module
 *  colours. A preset patch is merged onto the user's current config, so if it
 *  only specified foreground colours it could land dark-on-dark (e.g. the
 *  default background is black) and leave the QR unscannable. Pinning the
 *  background here guarantees each preset keeps a strong module↔background
 *  contrast ratio — comfortably above what a scanner needs — no matter what the
 *  user had selected before. */
export const PRESETS: { name: string; patch: Partial<QrConfig> }[] = [
  {
    name: 'Classic',
    patch: {
      dotType: 'square',
      cornerSquareType: 'square',
      cornerDotType: 'square',
      fgColor: '#000000',
      bgColor: '#ffffff',
      bgTransparent: false,
      useGradient: false,
      matchCornerColor: true
    }
  },
  {
    name: 'Rounded',
    patch: {
      dotType: 'rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      bgTransparent: false,
      useGradient: false,
      matchCornerColor: true
    }
  },
  {
    name: 'Dots',
    patch: {
      dotType: 'dots',
      cornerSquareType: 'dot',
      cornerDotType: 'dot',
      fgColor: '#1e293b',
      bgColor: '#ffffff',
      bgTransparent: false,
      useGradient: false,
      matchCornerColor: false,
      cornerColor: '#4f46e5'
    }
  },
  {
    name: 'Indigo',
    patch: {
      dotType: 'classy-rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      useGradient: true,
      fgColor: '#4f46e5',
      gradientColor: '#9333ea',
      gradientRotation: 45,
      bgColor: '#ffffff',
      bgTransparent: false,
      matchCornerColor: true
    }
  },
  {
    name: 'Sunset',
    patch: {
      dotType: 'extra-rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      useGradient: true,
      fgColor: '#ea580c',
      gradientColor: '#db2777',
      gradientRotation: 30,
      // Warm modules sit on a deep dusk background — both gradient stops keep a
      // ~4:1+ contrast here, far stronger than the ~3.7:1 they'd manage on white.
      bgColor: '#1a1025',
      bgTransparent: false,
      matchCornerColor: true
    }
  }
]

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
