import QRCodeStyling from 'qr-code-styling'
import { buildQrOptions, cornerStampGeometry, qrDisplayName, showsCornerMark, type ExportFormat, type QrConfig } from './qr'
import { UNISIM_MARK } from './unisimMark'

/** Slugify the QR's name into a safe filename stem. */
export function fileStem(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug || 'qr-code'
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}

/** Draw the white-tiled UNI·SIM corner stamp onto a canvas — a rounded white
 *  tile (so it reads over dark modules) with the icon padded inside. */
function drawCornerStamp(
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

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(blob)
  })
}

/** Render `config` to a small PNG data URL for a saved-design gallery thumbnail.
 *  Scales the quiet-zone margin down with the size so the thumbnail framing
 *  matches the full-size preview. */
export async function renderThumbnailDataUrl(config: QrConfig, size = 160): Promise<string> {
  const margin = Math.max(2, Math.round((config.margin / config.size) * size))
  const qr = new QRCodeStyling(buildQrOptions({ ...config, size, margin }, 'canvas'))
  const raw = (await qr.getRawData('png')) as Blob | null
  if (!raw) throw new Error('Could not render thumbnail')
  return blobToDataUrl(raw)
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const MIME: Record<Exclude<ExportFormat, 'svg'>, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp'
}

/** Render `config` to `format` and start a browser download. Bakes the optional
 *  corner UNI·SIM stamp into the output so it matches the live preview. */
export async function downloadQr(config: QrConfig, format: ExportFormat): Promise<void> {
  const stem = fileStem(qrDisplayName(config))

  if (format === 'svg') {
    const qr = new QRCodeStyling(buildQrOptions(config, 'svg'))
    const raw = (await qr.getRawData('svg')) as Blob | null
    if (!raw) throw new Error('Could not render SVG')
    let svg = await raw.text()
    if (showsCornerMark(config)) {
      const { badge, x, y } = cornerStampGeometry(config.size, config.margin)
      const pad = Math.round(badge * 0.08)
      const r = Math.round(badge * 0.16)
      const tile = `<rect x="${x}" y="${y}" width="${badge}" height="${badge}" rx="${r}" fill="#ffffff" stroke="rgba(0,0,0,0.06)" stroke-width="1" />`
      const img = `<image href="${UNISIM_MARK}" x="${x + pad}" y="${y + pad}" width="${badge - 2 * pad}" height="${badge - 2 * pad}" />`
      svg = svg.replace('</svg>', `${tile}${img}</svg>`)
    }
    triggerDownload(new Blob([svg], { type: 'image/svg+xml' }), `${stem}.svg`)
    return
  }

  // Raster: render to a clean PNG, then composite onto our own canvas so we can
  // (a) flatten onto white for JPEG, and (b) stamp the corner mark.
  const qr = new QRCodeStyling(buildQrOptions(config, 'canvas'))
  const raw = (await qr.getRawData('png')) as Blob | null
  if (!raw) throw new Error('Could not render QR code')
  const qrImg = await loadImage(URL.createObjectURL(raw))

  const size = config.size
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  // JPEG has no alpha — flatten transparency onto white so it doesn't go black.
  if (format === 'jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
  }
  ctx.drawImage(qrImg, 0, 0, size, size)
  URL.revokeObjectURL(qrImg.src)

  if (showsCornerMark(config)) {
    const { badge, x, y } = cornerStampGeometry(size, config.margin)
    const mark = await loadImage(UNISIM_MARK)
    drawCornerStamp(ctx, mark, x, y, badge)
  }

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Export failed'))),
      MIME[format],
      0.92
    )
  )
  triggerDownload(blob, `${stem}.${format}`)
}

/** Copy the rendered QR (PNG, with corner stamp) to the clipboard. Returns
 *  false when the browser blocks clipboard image writes. */
export async function copyQrToClipboard(config: QrConfig): Promise<boolean> {
  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') return false
  const qr = new QRCodeStyling(buildQrOptions(config, 'canvas'))
  const raw = (await qr.getRawData('png')) as Blob | null
  if (!raw) return false

  let out = raw
  if (showsCornerMark(config)) {
    const qrImg = await loadImage(URL.createObjectURL(raw))
    const size = config.size
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(qrImg, 0, 0, size, size)
      const { badge, x, y } = cornerStampGeometry(size, config.margin)
      const mark = await loadImage(UNISIM_MARK)
      drawCornerStamp(ctx, mark, x, y, badge)
      out = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('copy failed'))), 'image/png')
      )
    }
    URL.revokeObjectURL(qrImg.src)
  }

  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': out })])
    return true
  } catch {
    return false
  }
}
