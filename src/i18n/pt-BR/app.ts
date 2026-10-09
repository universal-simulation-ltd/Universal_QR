import type { Messages } from '../en'

const app: Messages['app'] = {
  // Footer
  'footer_with_love': 'Com {heart} de {link}',
  'footer_love_sr': 'amor',
  'github_aria': 'Universal QR no GitHub',
  'github_title': 'Ver o código-fonte no GitHub',

  // Top tabs (QrApp)
  'tab_qr': 'Criar',
  'tab_qr_hint': 'Gratuito · no seu dispositivo',
  'tab_scan': 'Ler',
  'tab_scan_hint': 'Câmera · QR + códigos de barras',
  'tab_dynamic': 'Dinâmico',
  'tab_dynamic_hint': 'Requer um Universal ID',

  // Tune this app rows (App.tsx)
  'pref_opens_on': 'Abre em',
  'pref_designer_opens_in': 'O designer abre em',

  // Profile menu rows (AppMenu)
  'menu_remove_logo': 'Remover logotipo',

  // Render errors (lib/download.ts)
  'error_load_image': 'Falha ao carregar a imagem',
  'error_read_image': 'Falha ao ler a imagem',
  'error_render_thumbnail': 'Não foi possível gerar a miniatura',
  'error_canvas_unsupported': 'Canvas não disponível neste navegador',
  'error_export_failed': 'Falha na exportação',
  'error_render_svg': 'Não foi possível gerar o SVG',
  'error_render_qr': 'Não foi possível gerar o QR code',
}

export default app
