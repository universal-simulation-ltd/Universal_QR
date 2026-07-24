// 1D barcode generation for the QR app's "Barcode" tab.
//
// The QR designer uses `qr-code-styling`; 1D barcodes are a separate,
// standalone path built on `bwip-js` ("Barcode Writer in Pure JavaScript" —
// 100+ symbologies, pure-JS/no-WASM, renders to canvas or SVG). Both bwip-js
// and the ZXing scanner are LAZY-loaded (dynamic import) so they only enter the
// bundle when a user actually opens the Barcode / Scan tabs — the QR designer's
// first paint is unchanged.
//
// Everything here runs on the device: no upload, no network — the same promise
// as the rest of the app.

export type BarcodeSymbology =
  | 'code128'
  | 'ean13'
  | 'ean8'
  | 'upca'
  | 'upce'
  | 'code39'
  | 'itf14'

export interface SymbologyDef {
  id: BarcodeSymbology
  /** Short label for the selector. */
  label: string
  /** The bwip-js `bcid` for this symbology. */
  bcid: string
  /** One-line guidance shown under the input. */
  hint: string
  /** Input placeholder / example value. */
  placeholder: string
  /**
   * Validate the raw input. Returns an error string to show, or null when the
   * value is acceptable for rendering. Empty input is handled by the caller
   * (no preview, no error) so each validator can assume a non-empty string.
   */
  validate: (value: string) => string | null
}

const digits = (re: RegExp, msg: string) => (v: string) => (re.test(v) ? null : msg)

// The retail symbologies carry a trailing check digit. bwip-js computes it for
// you when you supply the payload one short (e.g. 12 digits for EAN-13), and
// validates it when you supply the full length — so we accept either length and
// let bwip-js do the maths, surfacing its error if a full-length value's check
// digit is wrong.
export const SYMBOLOGIES: SymbologyDef[] = [
  {
    id: 'code128',
    label: 'Code 128',
    bcid: 'code128',
    hint: 'Any text or numbers — the most common general-purpose barcode.',
    placeholder: 'PKG-000123',
    validate: (v) => (v.length > 0 && v.length <= 80 ? null : 'Enter up to 80 characters.'),
  },
  {
    id: 'ean13',
    label: 'EAN-13',
    bcid: 'ean13',
    hint: '12 digits (the 13th check digit is added for you), or paste all 13.',
    placeholder: '501234567890',
    validate: digits(/^\d{12,13}$/, 'EAN-13 needs 12 or 13 digits.'),
  },
  {
    id: 'ean8',
    label: 'EAN-8',
    bcid: 'ean8',
    hint: '7 digits (check digit added), or paste all 8.',
    placeholder: '9638507',
    validate: digits(/^\d{7,8}$/, 'EAN-8 needs 7 or 8 digits.'),
  },
  {
    id: 'upca',
    label: 'UPC-A',
    bcid: 'upca',
    hint: '11 digits (check digit added), or paste all 12.',
    placeholder: '03600029145',
    validate: digits(/^\d{11,12}$/, 'UPC-A needs 11 or 12 digits.'),
  },
  {
    id: 'upce',
    label: 'UPC-E',
    bcid: 'upce',
    hint: 'The compact UPC form — 6 to 8 digits.',
    placeholder: '01234565',
    validate: digits(/^\d{6,8}$/, 'UPC-E needs 6 to 8 digits.'),
  },
  {
    id: 'code39',
    label: 'Code 39',
    bcid: 'code39',
    hint: 'Uppercase A–Z, 0–9 and - . $ / + % or space.',
    placeholder: 'ABC-123',
    validate: (v) =>
      /^[0-9A-Z\-.$/+%\s]+$/.test(v) ? null : 'Use uppercase A–Z, 0–9 and - . $ / + % only.',
  },
  {
    id: 'itf14',
    label: 'ITF-14',
    bcid: 'itf14',
    hint: 'Shipping-carton code — 13 digits (check digit added) or all 14.',
    placeholder: '1540014128876',
    validate: digits(/^\d{13,14}$/, 'ITF-14 needs 13 or 14 digits.'),
  },
]

export function symbologyById(id: BarcodeSymbology): SymbologyDef {
  return SYMBOLOGIES.find((s) => s.id === id) ?? SYMBOLOGIES[0]
}

/** Shared bwip-js render options for a crisp, human-readable barcode. */
function renderOptions(def: SymbologyDef, value: string) {
  return {
    bcid: def.bcid,
    text: value,
    scale: 3,
    height: 12, // bar height in mm
    includetext: true, // print the human-readable value under the bars
    textxalign: 'center' as const,
    paddingwidth: 8,
    paddingheight: 8,
    backgroundcolor: 'ffffff',
  }
}

/**
 * Render a barcode onto a canvas. Throws if the value is invalid for the
 * symbology (bwip-js raises on a bad check digit / illegal characters) — the
 * caller catches and shows the message. bwip-js is dynamically imported so it
 * stays out of the main bundle.
 */
export async function renderBarcodeToCanvas(
  canvas: HTMLCanvasElement,
  symbology: BarcodeSymbology,
  value: string,
): Promise<void> {
  const bwipjs = (await import('bwip-js/browser')).default
  const def = symbologyById(symbology)
  bwipjs.toCanvas(canvas, renderOptions(def, value))
}

/** Render a barcode to an SVG string (for the SVG download). */
export async function renderBarcodeToSvg(
  symbology: BarcodeSymbology,
  value: string,
): Promise<string> {
  const bwipjs = (await import('bwip-js/browser')).default
  const def = symbologyById(symbology)
  return bwipjs.toSVG(renderOptions(def, value))
}

/** Slugify a barcode value into a safe filename stem. */
export function barcodeFileStem(symbology: BarcodeSymbology, value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${symbology}-${slug || 'barcode'}`
}
