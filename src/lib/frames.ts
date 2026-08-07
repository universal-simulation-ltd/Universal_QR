// Shaped QR codes — a circle, a hexagon, a star instead of the usual square
// plate.
//
// ⚠️ The one rule this file exists to keep: **the code itself is never
// clipped.** A QR is only readable if every module and its quiet zone are
// present, so the shape can only ever be the *plate the code sits on*. The
// code is rendered smaller and centred inside the largest square that fits
// within the shape; the shape is what gets drawn around it. Anything that
// trims the silhouette out of the modules produces a picture of a QR code, not
// a QR code.
//
// Both the canvas renderer and the SVG exporter draw from the SAME polygon
// returned by `framePolygon`, deliberately — including for the circle and the
// rounded square, where SVG could express a truer curve with an arc. A 256-gon
// circle is visually exact at these sizes (sub-pixel sagitta at 512 px) and
// having one source of geometry means the PNG and the SVG cannot disagree,
// which is the failure this app has no way to notice.

export type FrameShape = 'square' | 'rounded' | 'circle' | 'squircle' | 'hexagon' | 'star'

export const FRAME_SHAPES: { value: FrameShape; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
  { value: 'squircle', label: 'Squircle' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'star', label: 'Star' }
]

/** A closed polygon in the unit square [0,1]², y down (canvas/SVG convention). */
type UnitPolygon = [number, number][]

const CURVE_SEGMENTS = 256

function circlePolygon(): UnitPolygon {
  const pts: UnitPolygon = []
  for (let i = 0; i < CURVE_SEGMENTS; i++) {
    const t = (i / CURVE_SEGMENTS) * Math.PI * 2
    pts.push([0.5 + 0.5 * Math.cos(t), 0.5 + 0.5 * Math.sin(t)])
  }
  return pts
}

// Superellipse |x|^n + |y|^n = 1 with n = 4 — the "squircle" corner most people
// recognise from app icons. Signed powers keep all four quadrants.
function squirclePolygon(): UnitPolygon {
  const n = 4
  const pts: UnitPolygon = []
  for (let i = 0; i < CURVE_SEGMENTS; i++) {
    const t = (i / CURVE_SEGMENTS) * Math.PI * 2
    const c = Math.cos(t)
    const s = Math.sin(t)
    const x = Math.sign(c) * Math.abs(c) ** (2 / n)
    const y = Math.sign(s) * Math.abs(s) ** (2 / n)
    pts.push([0.5 + 0.5 * x, 0.5 + 0.5 * y])
  }
  return pts
}

const ROUNDED_RADIUS = 0.18

function roundedPolygon(): UnitPolygon {
  const r = ROUNDED_RADIUS
  const per = Math.round(CURVE_SEGMENTS / 4)
  const corners: [number, number, number][] = [
    // [centre x, centre y, start angle] going clockwise from top-right
    [1 - r, r, -Math.PI / 2],
    [1 - r, 1 - r, 0],
    [r, 1 - r, Math.PI / 2],
    [r, r, Math.PI]
  ]
  const pts: UnitPolygon = []
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= per; i++) {
      const a = a0 + (i / per) * (Math.PI / 2)
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  }
  return pts
}

// Pointy-top regular hexagon, height 1, horizontally centred. Its bounding box
// is narrower than tall (width = √3/2), which is fine: the plate stays square
// and the hexagon is centred in it.
function hexagonPolygon(): UnitPolygon {
  const pts: UnitPolygon = []
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 3
    pts.push([0.5 + 0.5 * Math.cos(a), 0.5 + 0.5 * Math.sin(a)])
  }
  return pts
}

// A five-point star. The inner radius is deliberately generous (0.62 of the
// outer, rather than the ~0.38 of a classic thin star): the inscribed square —
// and therefore the code — grows with it, and a thin star leaves so little room
// that the modules become unscannably small at ordinary export sizes.
const STAR_INNER_RATIO = 0.62

function starPolygon(): UnitPolygon {
  const pts: UnitPolygon = []
  for (let i = 0; i < 10; i++) {
    const r = (i % 2 === 0 ? 0.5 : 0.5 * STAR_INNER_RATIO)
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    pts.push([0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)])
  }
  return pts
}

const UNIT_POLYGONS: Record<FrameShape, UnitPolygon> = {
  square: [[0, 0], [1, 0], [1, 1], [0, 1]],
  rounded: roundedPolygon(),
  circle: circlePolygon(),
  squircle: squirclePolygon(),
  hexagon: hexagonPolygon(),
  star: starPolygon()
}

/** Ray-cast point-in-polygon. */
function inside(poly: UnitPolygon, x: number, y: number): boolean {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

/** True when a centred axis-aligned square of half-side `a` lies wholly inside. */
function squareFits(poly: UnitPolygon, a: number): boolean {
  // Sample the square's PERIMETER, not just its four corners. Four corners is
  // enough for a convex shape but wrong for the star, whose inward notches can
  // cut through an edge while leaving every corner inside.
  const N = 240
  for (let i = 0; i < N; i++) {
    const t = (i / N) * 4
    const side = Math.floor(t)
    const f = t - side
    const lo = 0.5 - a
    const hi = 0.5 + a
    let x: number, y: number
    if (side === 0) { x = lo + f * 2 * a; y = lo }
    else if (side === 1) { x = hi; y = lo + f * 2 * a }
    else if (side === 2) { x = hi - f * 2 * a; y = hi }
    else { x = lo; y = hi - f * 2 * a }
    if (!inside(poly, x, y)) return false
  }
  return true
}

/** Side of the largest centred square that fits in `shape`, as a fraction of
 *  the plate. Binary-searched from the shape's own polygon rather than
 *  hand-derived per shape, so adding a shape cannot land a wrong constant. */
function computeInscribedFactor(shape: FrameShape): number {
  const poly = UNIT_POLYGONS[shape]
  if (shape === 'square') return 1
  let lo = 0
  let hi = 0.5
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2
    if (squareFits(poly, mid)) lo = mid
    else hi = mid
  }
  // Shave a hair off so a rounding-up of `inner` cannot poke a module over the
  // edge of the plate.
  return lo * 2 * 0.995
}

const INSCRIBED: Record<FrameShape, number> = {
  square: 1,
  rounded: computeInscribedFactor('rounded'),
  circle: computeInscribedFactor('circle'),
  squircle: computeInscribedFactor('squircle'),
  hexagon: computeInscribedFactor('hexagon'),
  star: computeInscribedFactor('star')
}

/** Exposed for the geometry check in scripts/verify-frames — not used by the app. */
export const INSCRIBED_FACTORS = INSCRIBED

/** Where the code goes inside a `size`-square plate of the given shape. */
export function frameGeometry(shape: FrameShape, size: number): { inner: number; offset: number } {
  const inner = Math.max(64, Math.round(size * INSCRIBED[shape]))
  return { inner, offset: Math.round((size - inner) / 2) }
}

/** The shape's outline at a given plate size, in device pixels. */
export function framePolygon(shape: FrameShape, size: number): [number, number][] {
  return UNIT_POLYGONS[shape].map(([x, y]) => [x * size, y * size] as [number, number])
}

/** The same outline as an SVG path `d` string. */
export function framePathData(shape: FrameShape, size: number): string {
  const pts = framePolygon(shape, size)
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ') + ' Z'
}

/** Trace the outline onto a 2D context (caller fills or clips). */
export function traceFrame(ctx: CanvasRenderingContext2D, shape: FrameShape, size: number): void {
  const pts = framePolygon(shape, size)
  ctx.beginPath()
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
  ctx.closePath()
}

/** A shaped plate makes the code smaller, and by a lot for the star. Surfaced
 *  in the UI so the trade-off is visible before the user exports something
 *  unscannable rather than after. */
export function frameSizeNote(shape: FrameShape, size: number): string | null {
  if (shape === 'square') return null
  const { inner } = frameGeometry(shape, size)
  const pct = Math.round((inner / size) * 100)
  return `The code fills ${pct}% of the ${size}px image (${inner}px) — the rest is the ${
    FRAME_SHAPES.find((s) => s.value === shape)!.label.toLowerCase()
  } around it.`
}
