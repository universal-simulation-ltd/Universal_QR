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
  'open_link_anyway': 'Abrir mesmo assim ↗',
  'goes_to': 'Leva a',
  'warn_insecure': 'Sem criptografia (http://): qualquer pessoa na mesma rede pode ver ou alterar a página.',
  'warn_lookalike': 'Este endereço usa letras de outro alfabeto, que podem imitar um nome conhecido. Seu navegador vai mostrá-lo como {host}.',
  'warn_credentials': 'A parte antes de “@” não é o destino deste link. Na verdade, ele abre {host}.',
  'warn_ip': 'Ele aponta para um número (um endereço IP) em vez de um site com nome.',
  'warn_shortener': 'É um link encurtado, então você só vê para onde ele leva depois de abrir.',
  'blocked': 'Este código contém um endereço “{scheme}:”, que poderia executar código ou abrir arquivos no seu dispositivo. O Universal QR não vai abri-lo.',
  'wifi_network': 'Rede Wi-Fi',
  'wifi_password': 'Senha',
  'wifi_open': 'Sem senha (rede aberta)',
  'wifi_join_hint': 'Para conectar, abra as configurações de Wi-Fi, escolha esta rede e cole a senha.',
  'copy_password': 'Copiar senha',
  'call': 'Ligar para {number}',
  'write_email': 'Enviar e-mail para {address}',
  'send_text': 'Enviar SMS para {number}',
  'scan_image': 'Ler uma imagem',
  'reading_image': 'Lendo a imagem…',
  'image_no_code': 'Nenhum QR code ou código de barras foi encontrado nessa imagem. Tente uma foto mais nítida e mais de perto.',

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
