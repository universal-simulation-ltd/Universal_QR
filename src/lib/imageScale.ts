// Shrink an uploaded centre logo before it becomes part of a design.
//
// It matters more here than it looks. A dynamic code's design is stored on its
// database row (migration 0129), logo and all, as a data URI inside JSON — so a
// 3 MB phone photo dropped into the centre of a QR is 4 MB of base64 on every
// list query, in Universal QR *and* in Universal PDF's dialog, forever. The
// backend refuses anything over 1 MB with `design_too_large`; this is what
// stops anyone meeting that wall in the first place.
//
// 512 px is generous for the job: the logo occupies ~28% of a code rendered at
// 1024, so it is drawn at roughly 290 px even at placement resolution.

/** Longest edge, in px, an uploaded logo is reduced to. */
export const LOGO_MAX_PX = 512

/**
 * Re-encode a data URI as a PNG no larger than `max` px on its longest edge.
 *
 * Returns the input unchanged when it is already small enough, and on any
 * failure — a corrupt file, an SVG with no intrinsic size, a canvas the browser
 * won't give us. A logo that is bigger than ideal is a much better outcome than
 * an upload that silently does nothing.
 */
export function downscaleDataUrl(dataUrl: string, max = LOGO_MAX_PX): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const w = img.naturalWidth || max
        const h = img.naturalHeight || max
        const scale = Math.min(1, max / Math.max(w, h))
        if (scale >= 1 && dataUrl.length < 400_000) return resolve(dataUrl)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(w * scale))
        canvas.height = Math.max(1, Math.round(h * scale))
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(dataUrl)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png'))
      } catch {
        resolve(dataUrl) // tainted canvas / no 2d context — keep the original
      }
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}
