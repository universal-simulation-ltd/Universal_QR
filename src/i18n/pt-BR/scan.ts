import type { Messages } from '../en'

const scan: Messages['scan'] = {
  // Heading
  'headline': 'Leia um {em}',
  'headline_em': 'QR code ou código de barras',
  'intro': 'Aponte a câmera para qualquer QR code ou código de barras 1D (EAN, UPC, Code 128, Code 39…). A decodificação acontece no seu dispositivo — a imagem da câmera nunca sai dele.',

  // Over the viewfinder while the camera is not running
  'status_waiting': 'Aguardando acesso à câmera…',
  'status_scan_another': 'Leia outro código quando quiser.',
  'status_camera_off': 'A câmera está desligada.',
  'button_starting': 'Iniciando a câmera…',
  'button_scan_again': 'Ler de novo',
  'button_start': 'Começar a ler',
  'button_stop': 'Parar',

  // Camera errors, shown over the viewfinder
  'error_no_camera': 'Nenhuma câmera foi encontrada neste dispositivo.',
  'error_camera_start': 'Não foi possível iniciar a câmera. Feche qualquer outro app que esteja usando a câmera e tente novamente.',

  // Ask-on-open checkbox — only shown while camera access has not been answered
  'ask_on_open': 'Pedir acesso à câmera quando eu abrir a aba Ler',

  // Result card
  'format_unknown': 'Desconhecido',
  'copy': 'Copiar',
  'copied': '✓ Copiado',
  'open_link': 'Abrir link ↗',

  // Camera permission help (lib/cameraAccess.ts). The native-app (iOS/Android)
  // and browser versions differ on purpose: a phone app has no address bar.
  'blocked_ios': 'O acesso à câmera está desativado para o Universal QR. Ative em Ajustes ▸ Universal QR ▸ Câmera e depois volte para esta aba.',
  'blocked_android': 'O acesso à câmera está desativado para o Universal QR. Ative em Configurações ▸ Apps ▸ Universal QR ▸ Permissões ▸ Câmera e depois volte para esta aba.',
  'blocked_browser': 'O acesso à câmera está bloqueado para este site. Permita pelo ícone da câmera na barra de endereço do navegador e tente novamente.',
  'remembered_native': 'Seu dispositivo lembra a resposta, então a pergunta só aparece uma vez.',
  'remembered_browser': 'Seu navegador lembra a permissão de câmera deste site.',
  'granted_native': 'O acesso à câmera está permitido neste dispositivo — a aba Ler abre direto no visor.',
  'granted_browser': 'O acesso à câmera está permitido para este site — a aba Ler abre direto no visor.',
}

export default scan
