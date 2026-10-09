// src/i18n/it/app.ts
import type { Messages } from '../en'

const app: Messages['app'] = {
  // Footer
  'footer_with_love': 'Con {heart} da {link}',
  'footer_love_sr': 'amore',
  'github_aria': 'Universal QR su GitHub',
  'github_title': 'Visualizza il codice sorgente su GitHub',

  // Top tabs (QrApp)
  'tab_qr': 'Progetta',
  'tab_qr_hint': 'Gratuito · sul tuo dispositivo',
  'tab_scan': 'Scansiona',
  'tab_scan_hint': 'Fotocamera · QR + codici a barre',
  'tab_dynamic': 'Dinamico',
  'tab_dynamic_hint': 'Richiede un Universal ID',

  // Tune this app rows (App.tsx)
  'pref_opens_on': 'Si apre su',
  'pref_designer_opens_in': 'Il designer si apre in',

  // Profile menu rows (AppMenu)
  'menu_remove_logo': 'Rimuovi logo',

  // Render errors (lib/download.ts)
  'error_load_image': 'Impossibile caricare l’immagine',
  'error_read_image': 'Impossibile leggere l’immagine',
  'error_render_thumbnail': 'Impossibile generare la miniatura',
  'error_canvas_unsupported': 'Canvas non supportato',
  'error_export_failed': 'Esportazione non riuscita',
  'error_render_svg': 'Impossibile generare l’SVG',
  'error_render_qr': 'Impossibile generare il codice QR',
}

export default app
