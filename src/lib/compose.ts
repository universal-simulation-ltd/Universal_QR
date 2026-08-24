import QRCodeStyling from 'qr-code-styling'
import { buildQrOptions, cornerStampGeometry, decorColour, showsCornerMark, type QrConfig } from './qr'
import { frameGeometry, framePathData, starIsBehind, traceFrame } from './frames'
import { DECOR_CODE_SCALE, decorSvg, drawDecor } from './decor'
import { UNISIM_MARK } from './unisimMark'

/** The scale the code is drawn at for a config — 1 unless decoration needs
 *  room. One helper, so the canvas, the SVG and the UI's size note cannot
 *  disagree about how big the code actually is. */
export function decorScaleOf(config: QrConfig): number {
  if (starBehind(config)) return 1
  return config.decorStyle && config.decorStyle !== 'none' ? DECOR_CODE_SCALE : 1
}

/** True when this design puts the star behind the code rather than under it as
 *  a plate. Decoration is off in that arrangement — there is no ring to fill,
 *  the code covers the middle of the star — and it is switched off HERE rather
 *  than by clearing the user's decorStyle, so switching back to 'inside' gets
 *  the burst they chose back rather than a design quietly stripped of it. */
export function starBehind(config: QrConfig): boolean {
  return starIsBehind(config.frameShape, config.starPlacement)
}

/** True when the composed image fills its whole square with `bgColor` — a
 *  behind-the-code star is the one shaped arrangement that does, because the
 *  code hangs off the silhouette and needs a defined ground under it. The UI
 *  uses this to decide whether the transparency checker belongs behind the
 *  preview. */
export function fillsWholeImage(config: QrConfig): boolean {
  return starBehind(config) && !config.bgTransparent
}

// Composing a shaped QR: a plate in the chosen silhouette, with the code drawn
// full-strength inside the largest square that fits. See frames.ts for why the
// code can never be clipped to the shape.
//
// `frameShape === 'square'` never reaches this module. That is deliberate: the
// square path is what every existing code, saved design and hosted export
// already goes through, and it is left byte-for-byte alone. Only a user who
// picks a shape gets the new pipeline.

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}

/** Draw the white-tiled UNI·SIM corner stamp — shared by the plain and the
 *  shaped renderers so the two cannot drift. */
export function drawCornerStamp(
  ctx: CanvasRenderingContext2D,
  mark: HTMLImageElement,
  x: number,
  y: number,
  badge: number
) {
  const pad = Math.round(badge * 0.08)
  const r = Math.round(badge * 0.16)
  ctx.save()
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(0,0,0,0.06)'
  ctx.lineWidth = Math.max(1, Math.round(badge * 0.02))
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath()
    ctx.roundRect(x, y, badge, badge, r)
    ctx.fill()
    ctx.stroke()
  } else {
    ctx.fillRect(x, y, badge, badge)
    ctx.strokeRect(x, y, badge, badge)
  }
  ctx.restore()
  ctx.drawImage(mark, x + pad, y + pad, badge - 2 * pad, badge - 2 * pad)
}

/** The inner code's config: same design, rendered at the size that fits inside
 *  the plate, with its own background switched off so the plate shows through.
 *  The quiet-zone margin is scaled with it — a fixed 12 px margin around a code
 *  that is now 70% of the size would be a proportionally smaller quiet zone. */
function innerConfig(config: QrConfig, inner: number): QrConfig {
  return {
    ...config,
    size: inner,
    margin: Math.max(4, Math.round((config.margin / config.size) * inner)),
    bgTransparent: true
  }
}

/**
 * Render `config` onto a `size`-square canvas with its shaped plate.
 * Throws for `frameShape === 'square'` — callers must take the plain path.
 */
export async function composeShapedCanvas(config: QrConfig, size: number): Promise<HTMLCanvasElement> {
  if (config.frameShape === 'square') throw new Error('composeShapedCanvas: square has no plate')

  const { inner, offset } = frameGeometry(config.frameShape, size, decorScaleOf(config), config.starPlacement)

  const qr = new QRCodeStyling(buildQrOptions(innerConfig(config, inner), 'canvas'))
  const raw = (await qr.getRawData('png')) as Blob | null
  if (!raw) throw new Error('Could not render QR code')
  const url = URL.createObjectURL(raw)
  const qrImg = await loadImage(url)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  // A star BEHIND the code inverts the layering: the background is the whole
  // square (the code overhangs the star, so the silhouette cannot be the thing
  // that carries it), and the star is painted on top of that as a backdrop in
  // its own colour. Everything else — code, stamp — is unchanged.
  if (starBehind(config)) {
    if (!config.bgTransparent) {
      ctx.fillStyle = config.bgColor
      ctx.fillRect(0, 0, size, size)
    }
    // Drawn even on a transparent background: it is the picture, not the plate,
    // so knocking the background out should leave a star-backed code on
    // transparency rather than nothing at all.
    ctx.save()
    traceFrame(ctx, config.frameShape, size)
    ctx.fillStyle = config.starColor
    ctx.fill()
    ctx.restore()
  }

  // The plate. With a transparent background this is skipped entirely, which
  // gives the genuinely useful result: a circular (or star, or hexagon) sticker
  // on transparency, rather than a shape you cannot see.
  if (!config.bgTransparent && !starBehind(config)) {
    ctx.save()
    traceFrame(ctx, config.frameShape, size)
    ctx.clip()
    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, size, size)
    ctx.restore()
  }

  // Decoration goes UNDER the code and is clipped to the silhouette, so the
  // same marks fill a circle, a hexagon or a star without decor.ts knowing
  // which. It is generated outside the code's circumscribed circle, so the
  // draw order is belt and braces rather than load-bearing.
  if (config.decorStyle && config.decorStyle !== 'none' && !starBehind(config)) {
    ctx.save()
    traceFrame(ctx, config.frameShape, size)
    ctx.clip()
    drawDecor(ctx, config.decorStyle, config.frameShape, size, inner, decorColour(config))
    ctx.restore()
  }

  ctx.drawImage(qrImg, offset, offset, inner, inner)
  URL.revokeObjectURL(url)

  if (showsCornerMark(config)) {
    const { badge, x, y } = cornerStampGeometry(inner, innerConfig(config, inner).margin)
    const mark = await loadImage(UNISIM_MARK)
    drawCornerStamp(ctx, mark, offset + x, offset + y, badge)
  }

  return canvas
}

/** The SVG twin of `composeShapedCanvas`. The code is embedded as a NESTED
 *  `<svg>` rather than rasterised, so a shaped export stays fully vector. */
export async function composeShapedSvg(config: QrConfig, size: number): Promise<string> {
  if (config.frameShape === 'square') throw new Error('composeShapedSvg: square has no plate')

  const { inner, offset } = frameGeometry(config.frameShape, size, decorScaleOf(config), config.starPlacement)
  const cfg = innerConfig(config, inner)

  const qr = new QRCodeStyling(buildQrOptions(cfg, 'svg'))
  const raw = (await qr.getRawData('svg')) as Blob | null
  if (!raw) throw new Error('Could not render SVG')
  let innerSvg = await raw.text()

  // ⚠️ qr-code-styling prefixes its output with `<?xml version="1.0"
  // standalone="no"?>`. An XML declaration is only legal at the very start of a
  // document, so nesting it produced a malformed SVG that every browser refused
  // to render — the export downloaded fine and then showed nothing. Strip the
  // declaration (and any doctype) before embedding.
  innerSvg = innerSvg.replace(/^\s*<\?xml[^>]*\?>\s*/i, '').replace(/^\s*<!DOCTYPE[^>]*>\s*/i, '')

  // Position the nested svg. It already carries width/height = inner, so only
  // x/y need adding; SVG nests natively and establishes its own viewport.
  innerSvg = innerSvg.replace('<svg', `<svg x="${offset}" y="${offset}"`)

  if (showsCornerMark(config)) {
    const { badge, x, y } = cornerStampGeometry(inner, cfg.margin)
    const pad = Math.round(badge * 0.08)
    const r = Math.round(badge * 0.16)
    const tile = `<rect x="${x}" y="${y}" width="${badge}" height="${badge}" rx="${r}" fill="#ffffff" stroke="rgba(0,0,0,0.06)" stroke-width="1" />`
    const img = `<image href="${UNISIM_MARK}" x="${x + pad}" y="${y + pad}" width="${badge - 2 * pad}" height="${badge - 2 * pad}" />`
    innerSvg = innerSvg.replace('</svg>', `${tile}${img}</svg>`)
  }

  // Same layering as the canvas: a behind-the-code star gets a full-square
  // background with the star painted over it, everything else gets the plate.
  const plate = starBehind(config)
    ? (config.bgTransparent ? '' : `<rect width="${size}" height="${size}" fill="${config.bgColor}" />`) +
      `<path d="${framePathData(config.frameShape, size)}" fill="${config.starColor}" />`
    : config.bgTransparent
      ? ''
      : `<path d="${framePathData(config.frameShape, size)}" fill="${config.bgColor}" />`

  // Same marks as the canvas, clipped by the same outline — a real clipPath
  // rather than a re-derived polygon, so the vector export cannot drift from
  // the raster one.
  let decor = ''
  let clip = ''
  if (config.decorStyle && config.decorStyle !== 'none' && !starBehind(config)) {
    const id = 'plate-clip'
    clip =
      `<clipPath id="${id}"><path d="${framePathData(config.frameShape, size)}" /></clipPath>`
    decor = `<g clip-path="url(#${id})">${decorSvg(config.decorStyle, config.frameShape, size, inner, decorColour(config))}</g>`
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    (clip ? `<defs>${clip}</defs>` : '') +
    plate +
    decor +
    innerSvg +
    `</svg>`
  )
}
