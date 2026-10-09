import type { Messages } from '../en'

const app: Messages['app'] = {
  // Footer
  'footer_with_love': '{link} tarafından {heart} ile',
  'footer_love_sr': 'sevgi',
  'github_aria': 'GitHub’da Universal QR',
  'github_title': 'Kaynak kodu GitHub’da görüntüle',

  // Top tabs (QrApp)
  'tab_qr': 'QR',
  'tab_qr_hint': 'Ücretsiz · cihazınızda',
  'tab_scan': 'Tara',
  'tab_scan_hint': 'Kamera · QR + barkod',
  'tab_dynamic': 'Dinamik',
  'tab_dynamic_hint': 'Universal ID gerektirir',

  // Tune this app rows (App.tsx)
  'pref_opens_on': 'Açılış sekmesi',
  'pref_designer_opens_in': 'Tasarımcının açılış modu',

  // Profile menu rows (AppMenu)
  'menu_remove_logo': 'Logoyu kaldır',

  // Render errors (lib/download.ts)
  'error_load_image': 'Görsel yüklenemedi',
  'error_read_image': 'Görsel okunamadı',
  'error_render_thumbnail': 'Küçük resim oluşturulamadı',
  'error_canvas_unsupported': 'Canvas desteklenmiyor',
  'error_export_failed': 'Dışa aktarma başarısız oldu',
  'error_render_svg': 'SVG oluşturulamadı',
  'error_render_qr': 'QR kod oluşturulamadı',
}

export default app
