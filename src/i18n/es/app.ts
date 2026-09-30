import type { Messages } from '../en'

const app: Messages['app'] = {
  // Footer
  'footer_with_love': 'Con {heart} de {link}',
  'footer_love_sr': 'amor',
  'github_aria': 'Universal QR en GitHub',
  'github_title': 'Ver el código fuente en GitHub',

  // Top tabs (QrApp)
  'tab_qr': 'QR',
  'tab_qr_hint': 'Gratis · en tu dispositivo',
  'tab_scan': 'Escanear',
  'tab_scan_hint': 'Cámara · QR y códigos de barras',
  'tab_dynamic': 'Dinámico',
  'tab_dynamic_hint': 'Requiere un Universal ID',

  // Profile menu rows (AppMenu)
  'menu_remove_logo': 'Quitar logotipo',

  // Render errors (lib/download.ts)
  'error_load_image': 'No se ha podido cargar la imagen',
  'error_read_image': 'No se ha podido leer la imagen',
  'error_render_thumbnail': 'No se ha podido generar la miniatura',
  'error_canvas_unsupported': 'Canvas no está disponible',
  'error_export_failed': 'Error al exportar',
  'error_render_svg': 'No se ha podido generar el SVG',
  'error_render_qr': 'No se ha podido generar el código QR',
}

export default app
