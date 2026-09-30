import type { Messages } from '../en'

const studio: Messages['studio'] = {
  // Shared
  'remove': 'Remover',
  'close': 'Fechar',

  // Header
  'headline': 'QR codes que {em}. Para sempre.',
  'headline_em': 'simplesmente funcionam',
  'lead': 'Escolha as cores, dê forma aos módulos, coloque um logotipo — tudo aparece em tempo real, no seu dispositivo. Baixe em PNG, SVG, JPEG ou WebP.',

  // Mode switch + reset
  'mode_aria': 'Modo do editor',
  'mode_simple': 'Simples',
  'mode_branding': 'Marca',
  'mode_advanced': 'Avançado',
  'reset_all': 'Redefinir tudo',

  // Export button + menu
  'save_or_share': 'Salvar ou compartilhar',
  'download_png': 'Baixar PNG',
  'preparing': 'Preparando…',
  'more_export_aria': 'Mais opções de exportação',
  'more_options': 'Mais opções',
  'download_as': 'Baixar como',
  'copy_png': 'Copiar PNG para a área de transferência',
  'back_up_online': 'Fazer backup on-line no unisim.co.uk',
  'copied': '✓ Copiado para a área de transferência',
  'copy_unsupported': 'Não é possível copiar — use Baixar',
  'scan_test_hint': 'Sempre teste a leitura antes de imprimir em tamanhos pequenos.',
  'export_failed': 'Desculpe, a exportação falhou: {message}',
  'nothing_to_export': 'Nada para exportar ainda.',
  'export_failed_reason': 'Falha na exportação',

  // Branding panel
  'presets_title': 'Estilos predefinidos',
  'presets_hint': 'Um ponto de partida — ajuste as cores e o logotipo abaixo.',
  'colours_title': 'Cores',
  'modules': 'Módulos',
  'background': 'Fundo',
  'transparent_background': 'Fundo transparente',
  'transparent_background_hint': 'Exporte um PNG/SVG sem preenchimento de fundo.',
  'gradient_modules': 'Módulos em degradê',
  'gradient_end': 'Fim do degradê',
  'gradient_angle': 'Ângulo do degradê',
  'two_tone_corners': 'Cantos em duas cores',
  'two_tone_corners_hint': 'Dê aos três cantos de posição uma cor própria.',
  'corner_colour': 'Cor dos cantos',
  'hex_value_aria': 'Valor hexadecimal de {label}',
  'logo_title': 'Logotipo e marca',
  'logo_drop_label': 'Solte um logotipo aqui ou clique para escolher um',
  'logo_not_image': 'Escolha um arquivo de imagem (PNG, JPG ou SVG).',
  'logo_preview_alt': 'Prévia do logotipo',
  'logo_added': 'Logotipo personalizado adicionado',
  'logo_replace': 'Substituir',
  'logo_size': 'Tamanho do logotipo',
  'logo_padding': 'Espaço em volta do logotipo',
  'clear_behind_logo': 'Limpar módulos atrás do logotipo',

  // Preview
  'enlarge_aria': 'Ampliar o QR code para leitura',
  'qr_code_for': 'QR code de {name}',
  'nothing_yet': 'Nada para mostrar ainda.',
  'enter_to_generate': 'Digite uma URL ou um texto para gerar seu QR code.',
  'tap_to_enlarge': 'Toque para ampliar',
  'tap_code_to_enlarge': 'Toque no código para ampliar',

  // Pinned preview (phone)
  'hide_pinned': 'Ocultar a prévia fixada',
  'show_preview': 'Mostrar prévia do QR',

  // Enlarged code
  'enlarged_aria': 'QR code ampliado de {name}',
  'click_to_dismiss': 'Clique para fechar',
  'point_camera': 'Aponte a câmera de outro celular para este código',
  'scan_trouble': 'Com dificuldade? Aumente o brilho da tela ao máximo e confira se a câmera não está no modo de close (macro) — afaste um pouco o celular para que o código inteiro caiba no enquadramento.',
  'press_to_save': 'No celular, toque e segure o código para salvá-lo ou compartilhá-lo como imagem.',

  // Regenerate style
  'regenerate': 'Trocar estilo',
  'regenerate_title': 'Escolher um estilo aleatório',
  'regenerate_title_from': '{preset} — escolher outro estilo aleatório',

  // Link test (under the address box)
  'test_link': 'Testar link',
  'no_scheme': 'Sem {https} no início — alguns leitores vão abrir o endereço, outros vão lê-lo como texto simples.',
  'add_https': 'Adicionar https://',
  'insecure': 'Um endereço {http}. Ele abre, mas os celulares o mostram como “Não seguro” — e não é possível verificá-lo por esta página.',
  'checking': 'Verificando o endereço…',
  'responds': 'O endereço responde',
  'responds_title': 'Algo respondeu nesse endereço. Não dá para distinguir uma página real de um erro 404 — abra o link para ter certeza.',
  'offline': 'Você está off-line — não verificado',
  'timeout': 'Sem resposta ainda — pode ser só lentidão',
  'unreachable': 'Não foi possível acessar deste navegador',
  'not_proof_title': 'Isso não prova que o link está quebrado — alguns sites recusam esse tipo de verificação. Abra em uma aba para ter certeza.',

  // Barcode preview
  'barcode_enter': 'Digite um valor para ver a prévia do código de barras.',
  'barcode_fix': 'Corrija o valor acima para ver a prévia do código de barras.',
  'barcode_cant_encode': 'Não é possível codificar esse valor.',

  // Save to this device
  'save_title': 'Salve seu design',
  'no_account': 'Sem conta',
  'save_body': 'Guarde este QR code neste dispositivo e abra de novo quando quiser — gratuito e sem login. Ele fica no seu navegador e nunca sai dele.',
  'saved': '✓ Salvo neste dispositivo',
  'saving': 'Salvando…',
  'enter_url_to_save': 'Digite uma URL para salvar',
  'save_to_device': 'Salvar neste dispositivo',
  'save_failed': 'Desculpe, não foi possível salvar: {message}',
  'untitled_design': 'QR code',
  'open': 'Abrir',
  'remove_design_aria': 'Remover {name}',
  'remove_saved_design_aria': 'Remover design salvo',
}

export default studio
