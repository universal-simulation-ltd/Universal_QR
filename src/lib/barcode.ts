// 1D barcode generation, offered as a "Type" inside the QR designer's Advanced
// controls (it had its own top-level tab until 2026-08-09 — a whole tab was more
// prominence than the feature's usage warranted).
//
// The QR designer uses `qr-code-styling`; 1D barcodes are a separate path built
// on `bwip-js` ("Barcode Writer in Pure JavaScript" — 100+ symbologies,
// pure-JS/no-WASM, renders to canvas or SVG). Both bwip-js and the ZXing scanner
// are LAZY-loaded (dynamic import) so they only enter the bundle when a user
// actually picks a barcode type or opens Scan — the QR designer's first paint is
// unchanged.
//
// The symbology list is deliberately SHORT. bwip-js supports 100-plus; five
// covers general-purpose labelling (Code 128), retail in Europe and the US
// (EAN-13, UPC-A), asset tags and older industrial systems (Code 39), and
// shipping cartons (ITF-14). The compact retail variants EAN-8 and UPC-E were
// dropped with the tab: they are chosen by whoever issues the number, not by
// whoever prints it, so they are not a decision this designer needs to offer.
//
// Everything here runs on the device: no upload, no network — the same promise
// as the rest of the app.
//
// The hint and the validation messages are translated (controls namespace) and
// looked up when read, never at module load, so they follow the language the
// user has now. Labels are format names and placeholders are example values:
// both stay as they are in every language.
import { getT } from '../i18n/runtime.ts'

export type BarcodeSymbology =
  | 'code128'
  | 'ean13'
  | 'upca'
  | 'code39'
  | 'itf14'

export interface SymbologyDef {
  id: BarcodeSymbology
  /** Short label for the selector. */
  label: string
  /** The bwip-js `bcid` for this symbology. */
  bcid: string
  /** One-line guidance shown under the input, in the current language. */
  readonly hint: string
  /** Input placeholder / example value. */
  placeholder: string
  /**
   * Validate the raw input. Returns an error string to show, or null when the
   * value is acceptable for rendering. Empty input is handled by the caller
   * (no preview, no error) so each validator can assume a non-empty string.
   */
  validate: (value: string) => string | null
}

const digits = (re: RegExp, msg: () => string) => (v: string) => (re.test(v) ? null : msg())

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
    get hint() { return getT()('controls.barcode_hint_code128') },
    placeholder: 'PKG-000123',
    validate: (v) => (v.length > 0 && v.length <= 80 ? null : getT()('controls.barcode_error_code128', { max: 80 })),
  },
  {
    id: 'ean13',
    label: 'EAN-13',
    bcid: 'ean13',
    get hint() { return getT()('controls.barcode_hint_ean13') },
    placeholder: '501234567890',
    validate: digits(/^\d{12,13}$/, () => getT()('controls.barcode_error_ean13')),
  },
  {
    id: 'upca',
    label: 'UPC-A',
    bcid: 'upca',
    get hint() { return getT()('controls.barcode_hint_upca') },
    placeholder: '03600029145',
    validate: digits(/^\d{11,12}$/, () => getT()('controls.barcode_error_upca')),
  },
  {
    id: 'code39',
    label: 'Code 39',
    bcid: 'code39',
    get hint() { return getT()('controls.barcode_hint_code39') },
    placeholder: 'ABC-123',
    validate: (v) =>
      /^[0-9A-Z\-.$/+%\s]+$/.test(v) ? null : getT()('controls.barcode_error_code39'),
  },
  {
    id: 'itf14',
    label: 'ITF-14',
    bcid: 'itf14',
    get hint() { return getT()('controls.barcode_hint_itf14') },
    placeholder: '1540014128876',
    validate: digits(/^\d{13,14}$/, () => getT()('controls.barcode_error_itf14')),
  },
]

/** The definition for a symbology id.
 *
 *  Falls back to the first entry rather than throwing, which is what makes
 *  trimming the list safe: someone whose browser remembers `upce` from before
 *  2026-08-09 lands on Code 128 instead of a blank screen. */
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
