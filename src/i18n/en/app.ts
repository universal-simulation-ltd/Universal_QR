// app strings. English (en-GB) is the source; every other language is typed
// against this file. Keys are snake_case; a comment after a key tells the
// translator where it shows and any length limit.
//
// App shell (footer), the QR / Scan / Dynamic tab strip, the profile menu's
// app rows, and the render errors from lib/download.ts.
//
// NOT here: "About this app"'s subject, caveat and headline (App.tsx's ABOUT).
// The SDK translates those itself from a catalogue keyed by their exact
// English, so they must reach it in English — see the comment on ABOUT.
export default {
  // Footer
  'footer_with_love': 'With {heart} from {link}', // {heart} is a heart symbol meaning "love"; {link} is "UNISIM.co.uk"
  'footer_love_sr': 'love', // screen-reader text for the heart symbol in "With ♥ from UNISIM.co.uk"
  'github_aria': 'Universal QR on GitHub', // screen-reader label of the footer's GitHub link
  'github_title': 'View source on GitHub', // hover tooltip of the footer's GitHub link

  // Top tabs (QrApp). Tab names sit side by side on the narrowest phone: keep
  // them to one short word. The hints show under them from tablet width only,
  // in small type on one line: keep them short too.
  'tab_qr': 'QR', // the free QR code designer; keep short
  'tab_qr_hint': 'Free · on your device', // under the QR tab; keep short
  'tab_scan': 'Scan', // the camera scanner (noun or verb — a tab name); keep short
  'tab_scan_hint': 'Camera · QR + barcodes', // under the Scan tab; keep short
  'tab_dynamic': 'Dynamic', // dynamic (hosted, editable) QR codes; never "Pro" or "Premium"; keep short
  'tab_dynamic_hint': 'Requires Universal ID', // under the Dynamic tab; "Universal ID" is a product name, never translated; keep short

  // Profile menu rows (AppMenu)
  'menu_remove_logo': 'Remove logo', // menu row that clears the logo uploaded into the QR code

  // Render errors (lib/download.ts). Shown after "Sorry, that export failed:"
  // or "Sorry, that couldn't be saved:" in an alert.
  'error_load_image': 'Failed to load image',
  'error_read_image': 'Failed to read image',
  'error_render_thumbnail': 'Could not render thumbnail', // the small preview image of a saved design
  'error_canvas_unsupported': 'Canvas not supported', // the browser cannot draw images (HTML canvas)
  'error_export_failed': 'Export failed',
  'error_render_svg': 'Could not render SVG', // SVG is a file format, never translated
  'error_render_qr': 'Could not render QR code',
} as const
