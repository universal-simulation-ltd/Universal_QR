import type { Messages } from '../en'

const app: Messages['app'] = {
  // Footer
  'footer_with_love': 'Mit {heart} von {link}',
  'footer_love_sr': 'Liebe',
  'github_aria': 'Universal QR auf GitHub',
  'github_title': 'Quellcode auf GitHub ansehen',

  // Top tabs (QrApp)
  'tab_qr': 'QR',
  'tab_qr_hint': 'Kostenlos · auf deinem Gerät',
  'tab_scan': 'Scannen',
  'tab_scan_hint': 'Kamera · QR + Barcodes',
  'tab_dynamic': 'Dynamisch',
  'tab_dynamic_hint': 'Erfordert eine Universal ID',

  // Profile menu rows (AppMenu)
  'menu_remove_logo': 'Logo entfernen',

  // Render errors (lib/download.ts)
  'error_load_image': 'Bild konnte nicht geladen werden',
  'error_read_image': 'Bild konnte nicht gelesen werden',
  'error_render_thumbnail': 'Vorschaubild konnte nicht erstellt werden',
  'error_canvas_unsupported': 'Canvas wird nicht unterstützt',
  'error_export_failed': 'Export fehlgeschlagen',
  'error_render_svg': 'SVG konnte nicht erstellt werden',
  'error_render_qr': 'QR-Code konnte nicht erstellt werden',
}

export default app
