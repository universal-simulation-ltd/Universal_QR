import type { Messages } from '../en'

const app: Messages['app'] = {
  // Footer
  'footer_with_love': 'Avec {heart} de la part de {link}',
  'footer_love_sr': 'amour',
  'github_aria': 'Universal QR sur GitHub',
  'github_title': 'Voir le code source sur GitHub',

  // Top tabs (QrApp)
  'tab_qr': 'QR',
  'tab_qr_hint': 'Gratuit · sur votre appareil',
  'tab_scan': 'Scanner',
  'tab_scan_hint': 'Appareil photo · QR + codes-barres',
  'tab_dynamic': 'Dynamique',
  'tab_dynamic_hint': 'Nécessite un Universal ID',

  // Tune this app rows (App.tsx)
  'pref_opens_on': 'S’ouvre sur',
  'pref_designer_opens_in': 'Le designer s’ouvre en',

  // Profile menu rows (AppMenu)
  'menu_remove_logo': 'Retirer le logo',

  // Render errors (lib/download.ts)
  'error_load_image': 'Échec du chargement de l’image',
  'error_read_image': 'Échec de la lecture de l’image',
  'error_render_thumbnail': 'Impossible de générer la miniature',
  'error_canvas_unsupported': 'Canvas non pris en charge',
  'error_export_failed': 'Échec de l’exportation',
  'error_render_svg': 'Impossible de générer le SVG',
  'error_render_qr': 'Impossible de générer le QR code',
}

export default app
