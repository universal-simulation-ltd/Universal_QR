import QRCodeStyling from 'qr-code-styling'
import { buildQrOptions, cornerStampGeometry, qrDisplayName, showsCornerMark, type ExportFormat, type QrConfig } from '@unisim/qr'
import { composeShapedCanvas, composeShapedSvg } from '@unisim/qr'
import { UNISIM_MARK } from '@unisim/qr'
import { saveBlob } from './saveFile'

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

/** Decode a raster Blob into something `drawImage` accepts.
 *
 *  `createImageBitmap` decodes off the main thread and hands back a bitmap with
 *  no object URL to mint, hand to the loader and revoke. On Android's WebView
 *  the `<img>` round trip is a main-thread decode of a 900 px PNG in the middle
 *  of an interaction, which is exactly where it was being felt. Falls back to
 *  the old path wherever the bitmap decoder is missing or refuses the blob.
 *
 *  Callers must `release()` when done: an ImageBitmap holds its pixels until
 *  closed, and these are ~800 kB apiece. */
async function decodeBlob(blob: Blob): Promise<{ img: CanvasImageSource; release: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob)
      return { img: bitmap, release: () => bitmap.close() }
    } catch {
      /* Older WebView, or a blob it won't take — fall through to the <img>. */
    }
  }
  const url = URL.createObjectURL(blob)
  try {
    const img = await loadImage(url)
    return { img, release: () => URL.revokeObjectURL(url) }
  } catch (e) {
    URL.revokeObjectURL(url)
    throw e
  }
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
  if (config.frameShape !== 'square') {
    // Shaped designs go through the composer, or the gallery thumbnail would
    // show a plain square code that the saved design is not.
    const canvas = await composeShapedCanvas(config, size)
    return canvas.toDataURL('image/png')
  }
  const margin = Math.max(2, Math.round((config.margin / config.size) * size))
  const qr = new QRCodeStyling(buildQrOptions({ ...config, size, margin }, 'canvas'))
  const raw = (await qr.getRawData('png')) as Blob | null
  if (!raw) throw new Error('Could not render thumbnail')
  return blobToDataUrl(raw)
}

/** Render `config` to a PNG data URL at `size` — the same pixels `downloadQr`
 *  would produce, corner stamp and shaped plate baked in.
 *
 *  A `data:` URL rather than a `blob:` one on purpose: this feeds an `<img>` the
 *  user is meant to long-press on a phone, and iOS Safari's "Save Image" /
 *  "Share" sheet does not reliably act on blob: sources. A 900 px QR is a few
 *  tens of KB base64'd, so the cost is nothing.
 *
 *  The quiet-zone margin is scaled with the size, so a code blown up to 900 px
 *  keeps the same proportions as the 512 px preview instead of losing its
 *  border. */
export async function renderPngDataUrl(config: QrConfig, size: number): Promise<string> {
  const margin = Math.max(2, Math.round((config.margin / config.size) * size))
  const { blob } = await renderQrBlob({ ...config, size, margin }, 'png')
  return blobToDataUrl(blob)
}

/** `renderPngDataUrl`, memoised per design and size.
 *
 *  Two callers hit this with the same arguments on purpose: the preview's
 *  pointerdown starts the render, and the modal that opens on the click that
 *  follows asks for the same thing a frame or two later. Without the cache that
 *  is the work done twice; with it, the modal usually finds the render already
 *  finished or already in flight, and the pointerdown head start is real.
 *
 *  Keyed on the config OBJECT, not on a serialisation of it — a design carries
 *  a logo data URL that can run to tens of kB, and stringifying that on every
 *  tap would cost more than it saves. Both call sites hold a stable reference
 *  (zustand's `s.config`, and a `useMemo` in the dynamic card), so identity is
 *  the right key. A WeakMap means a design that goes away takes its cached PNG
 *  with it rather than pinning ~800 kB of base64 for the session.
 *
 *  A rejection is evicted, so a transient failure doesn't poison every reopen. */
const enlargedPngs = new WeakMap<QrConfig, Map<number, Promise<string>>>()

export function enlargedPngDataUrl(config: QrConfig, size: number): Promise<string> {
  let bySize = enlargedPngs.get(config)
  if (!bySize) {
    bySize = new Map()
    enlargedPngs.set(config, bySize)
  }
  const cached = bySize.get(size)
  if (cached) return cached
  const pending = renderPngDataUrl(config, size).catch((err) => {
    bySize?.delete(size)
    throw err
  })
  bySize.set(size, pending)
  return pending
}

// A download in a browser, the share sheet on a phone — see `saveFile.ts` for
// why the two cannot be the same thing.
const triggerDownload = saveBlob

const MIME: Record<Exclude<ExportFormat, 'svg'>, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp'
}

/** Render `config` to `format` as a Blob (the optional corner UNI·SIM stamp
 *  baked in so it matches the live preview), plus the download filename.
 *  Shared by `downloadQr` and the "Hosted by UNI·SIM" cloud store. */
export async function renderQrBlob(
  config: QrConfig,
  format: ExportFormat,
): Promise<{ blob: Blob; fileName: string; contentType: string }> {
  const stem = fileStem(qrDisplayName(config))

  // ── Shaped plate (circle / hexagon / star / …) ──────────────────────────
  // Handled first and completely separately. 'square' below is the original
  // code path, unchanged, so nothing that already works can regress.
  if (config.frameShape !== 'square') {
    if (format === 'svg') {
      const svg = await composeShapedSvg(config, config.size)
      return { blob: new Blob([svg], { type: 'image/svg+xml' }), fileName: `${stem}.svg`, contentType: 'image/svg+xml' }
    }
    const shaped = await composeShapedCanvas(config, config.size)
    let out = shaped
    // JPEG has no alpha, and a shaped plate leaves the corners transparent by
    // definition — without this flatten they would render black.
    if (format === 'jpeg') {
      const flat = document.createElement('canvas')
      flat.width = shaped.width
      flat.height = shaped.height
      const fctx = flat.getContext('2d')
      if (!fctx) throw new Error('Canvas not supported')
      fctx.fillStyle = '#ffffff'
      fctx.fillRect(0, 0, flat.width, flat.height)
      fctx.drawImage(shaped, 0, 0)
      out = flat
    }
    const blob: Blob = await new Promise((resolve, reject) =>
      out.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), MIME[format], 0.92)
    )
    return { blob, fileName: `${stem}.${format}`, contentType: MIME[format] }
  }

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
    return { blob: new Blob([svg], { type: 'image/svg+xml' }), fileName: `${stem}.svg`, contentType: 'image/svg+xml' }
  }

  // Raster: render to a clean PNG, then composite onto our own canvas so we can
  // (a) flatten onto white for JPEG, and (b) stamp the corner mark.
  const qr = new QRCodeStyling(buildQrOptions(config, 'canvas'))
  const raw = (await qr.getRawData('png')) as Blob | null
  if (!raw) throw new Error('Could not render QR code')

  // ⚠️ The composite below is only ever needed for one of those two reasons,
  // and a PNG without a corner stamp has neither. It was still being run: the
  // library's PNG was decoded, redrawn 1:1 onto a fresh canvas and re-encoded
  // to produce the blob the library had already handed over. That is a second
  // full-size PNG encode and a second decode per export, and at the 900 px the
  // enlarge modal asks for it is the bulk of the wait before the code appears.
  //
  // `showsCornerMark` is `unisimMark && logoDataUrl`, so the DEFAULT design —
  // UNI·SIM mark in the centre, no uploaded logo — takes this path.
  //
  // The short circuit is not just faster, it is marginally more faithful: a
  // canvas round trip premultiplies alpha, which can shift the antialiased edge
  // of a rounded dot by a level on a transparent background.
  if (format === 'png' && !showsCornerMark(config)) {
    return { blob: raw, fileName: `${stem}.png`, contentType: MIME.png }
  }

  const { img: qrImg, release } = await decodeBlob(raw)

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
  release()

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
  return { blob, fileName: `${stem}.${format}`, contentType: MIME[format] }
}

/** Render `config` to `format` and start a browser download. */
export async function downloadQr(config: QrConfig, format: ExportFormat): Promise<void> {
  const { blob, fileName } = await renderQrBlob(config, format)
  triggerDownload(blob, fileName)
}

/** Copy the rendered QR (PNG, with corner stamp) to the clipboard. Returns
 *  false when the browser blocks clipboard image writes. */
export async function copyQrToClipboard(config: QrConfig): Promise<boolean> {
  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') return false

  if (config.frameShape !== 'square') {
    const canvas = await composeShapedCanvas(config, config.size)
    const shaped: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!shaped) return false
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': shaped })])
      return true
    } catch {
      return false
    }
  }

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
