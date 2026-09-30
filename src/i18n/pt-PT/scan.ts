import type { Messages } from '../en'

const scan: Messages['scan'] = {
  // Heading
  'headline': 'Ler um {em}',
  'headline_em': 'código QR ou código de barras',
  'intro': 'Aponte a câmara para qualquer código QR ou código de barras 1D (EAN, UPC, Code 128, Code 39…). A descodificação é feita no seu dispositivo — a imagem da câmara nunca sai dele.',

  // Over the viewfinder while the camera is not running
  'status_waiting': 'A aguardar acesso à câmara…',
  'status_scan_another': 'Pode ler outro código quando quiser.',
  'status_camera_off': 'A câmara está desligada.',
  'button_starting': 'A iniciar a câmara…',
  'button_scan_again': 'Ler novamente',
  'button_start': 'Iniciar leitura',
  'button_stop': 'Parar',

  // Camera errors, shown over the viewfinder
  'error_no_camera': 'Não foi encontrada nenhuma câmara neste dispositivo.',
  'error_camera_start': 'Não foi possível iniciar a câmara. Feche qualquer outra app que a esteja a usar e tente novamente.',

  // Ask-on-open checkbox
  'ask_on_open': 'Pedir acesso à câmara ao abrir o separador Ler',

  // Result card
  'format_unknown': 'Desconhecido',
  'copy': 'Copiar',
  'copied': '✓ Copiado',
  'open_link': 'Abrir ligação ↗',

  // Camera permission help (lib/cameraAccess.ts)
  'blocked_ios': 'O acesso à câmara está desativado para o Universal QR. Ative-o em Definições ▸ Universal QR ▸ Câmara e depois volte a este separador.',
  'blocked_android': 'O acesso à câmara está desativado para o Universal QR. Ative-o em Definições ▸ Aplicações ▸ Universal QR ▸ Autorizações ▸ Câmara e depois volte a este separador.',
  'blocked_browser': 'O acesso à câmara está bloqueado para este site. Permita-o no ícone da câmara na barra de endereço do navegador e tente novamente.',
  'remembered_native': 'O dispositivo memoriza a resposta, por isso o pedido só aparece uma vez.',
  'remembered_browser': 'O navegador memoriza a autorização de acesso à câmara deste site.',
  'granted_native': 'O acesso à câmara está autorizado neste dispositivo — o separador Ler abre diretamente no visor.',
  'granted_browser': 'O acesso à câmara está autorizado para este site — o separador Ler abre diretamente no visor.',
}

export default scan
