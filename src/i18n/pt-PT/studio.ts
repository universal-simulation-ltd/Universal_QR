import type { Messages } from '../en'

const studio: Messages['studio'] = {
  // Shared
  'remove': 'Remover',
  'close': 'Fechar',

  // Header
  'headline': 'Códigos QR que {em}. Para sempre.',
  'headline_em': 'simplesmente funcionam',
  'lead': 'Escolha as cores, dê forma aos módulos, acrescente um logótipo — tudo é desenhado em tempo real, no seu dispositivo. Transfira em PNG, SVG, JPEG ou WebP.',

  // Mode switch + reset
  'mode_aria': 'Modo do editor',
  'mode_simple': 'Simples',
  'mode_branding': 'Marca',
  'mode_advanced': 'Avançado',
  'reset_all': 'Repor tudo',

  // Export button + menu
  'save_or_share': 'Guardar ou partilhar',
  'download_png': 'Transferir PNG',
  'preparing': 'A preparar…',
  'more_export_aria': 'Mais opções de exportação',
  'more_options': 'Mais opções',
  'download_as': 'Transferir como',
  'copy_png': 'Copiar PNG para a área de transferência',
  'back_up_online': 'Fazer cópia de segurança online em unisim.co.uk',
  'copied': '✓ Copiado para a área de transferência',
  'copy_unsupported': 'Copiar não é suportado — use Transferir',
  'scan_test_hint': 'Teste sempre a leitura antes de imprimir em tamanhos pequenos.',
  'export_failed': 'Lamentamos, a exportação falhou: {message}',
  'nothing_to_export': 'Ainda não há nada para exportar.',
  'export_failed_reason': 'Falha na exportação',

  // Branding panel
  'presets_title': 'Estilos predefinidos',
  'presets_hint': 'Um ponto de partida — ajuste as cores e o logótipo abaixo.',
  'colours_title': 'Cores',
  'modules': 'Módulos',
  'background': 'Fundo',
  'transparent_background': 'Fundo transparente',
  'transparent_background_hint': 'Exportar um PNG/SVG sem cor de fundo.',
  'gradient_modules': 'Módulos em gradiente',
  'gradient_end': 'Fim do gradiente',
  'gradient_angle': 'Ângulo do gradiente',
  'two_tone_corners': 'Cantos em dois tons',
  'two_tone_corners_hint': 'Dar uma cor própria aos três cantos de posição.',
  'corner_colour': 'Cor dos cantos',
  'hex_value_aria': '{label}: valor hexadecimal',
  'logo_title': 'Logótipo e marca',
  'logo_drop_label': 'Largue um logótipo aqui ou clique para escolher um',
  'logo_not_image': 'Escolha um ficheiro de imagem (PNG, JPG ou SVG).',
  'logo_preview_alt': 'Pré-visualização do logótipo',
  'logo_added': 'Logótipo personalizado adicionado',
  'logo_replace': 'Substituir',
  'logo_size': 'Tamanho do logótipo',
  'logo_padding': 'Margem do logótipo',
  'clear_behind_logo': 'Limpar módulos por trás do logótipo',

  // Preview
  'enlarge_aria': 'Ampliar o código QR para leitura',
  'qr_code_for': 'Código QR de {name}',
  'nothing_yet': 'Nada para mostrar ainda.',
  'enter_to_generate': 'Introduza um URL ou algum texto para gerar o código QR.',
  'tap_to_enlarge': 'Toque para ampliar',
  'tap_code_to_enlarge': 'Toque no código para ampliar',

  // Pinned preview (phone)
  'hide_pinned': 'Ocultar a pré-visualização fixada',
  'show_preview': 'Mostrar pré-visualização do QR',

  // Enlarged code
  'enlarged_aria': 'Código QR ampliado de {name}',
  'click_to_dismiss': 'Clique para fechar',
  'point_camera': 'Aponte a câmara de outro telemóvel para este código',
  'scan_trouble': 'Com dificuldades? Aumente o brilho do ecrã ao máximo e confirme que a câmara não está em modo de grande plano (macro) — afaste-a um pouco para que o código inteiro fique enquadrado.',
  'press_to_save': 'Num telemóvel, mantenha o código premido para o guardar ou partilhar como imagem.',

  // Regenerate style
  'regenerate': 'Trocar estilo',
  'regenerate_title': 'Escolher um estilo ao acaso',
  'regenerate_title_from': '{preset} — escolher outro estilo ao acaso',

  // Link test (under the address box)
  'test_link': 'Testar ligação',
  'no_scheme': 'Sem {https} no início — alguns leitores abrem isto, outros leem-no como texto simples.',
  'add_https': 'Adicionar https://',
  'insecure': 'Um endereço {http}. Abre, mas os telemóveis mostram-no como «Não seguro» — e não pode ser verificado a partir desta página.',
  'checking': 'A verificar o endereço…',
  'responds': 'O endereço responde',
  'responds_title': 'Alguma coisa respondeu nesse endereço. Não é possível distinguir uma página real de um erro 404 — abra-a para ter a certeza.',
  'offline': 'Está offline — não verificado',
  'timeout': 'Ainda sem resposta — pode estar só lento',
  'unreachable': 'Inacessível a partir deste navegador',
  'not_proof_title': 'Não prova que a ligação está quebrada — alguns sites recusam este tipo de verificação. Abra-a num separador para ter a certeza.',

  // Barcode preview
  'barcode_enter': 'Introduza um valor para pré-visualizar o código de barras.',
  'barcode_fix': 'Corrija o valor acima para pré-visualizar o código de barras.',
  'barcode_cant_encode': 'Esse valor não pode ser codificado.',

  // Save to this device
  'save_title': 'Guardar o design',
  'no_account': 'Sem conta',
  'save_body': 'Mantenha este código QR neste dispositivo e volte a abri-lo mais tarde — gratuito, sem iniciar sessão. Fica no seu navegador e nunca sai dele.',
  'saved': '✓ Guardado neste dispositivo',
  'saving': 'A guardar…',
  'enter_url_to_save': 'Introduza um URL para guardar',
  'save_to_device': 'Guardar neste dispositivo',
  'save_failed': 'Lamentamos, não foi possível guardar: {message}',
  'untitled_design': 'Código QR',
  'open': 'Abrir',
  'remove_design_aria': 'Remover {name}',
  'remove_saved_design_aria': 'Remover design guardado',
}

export default studio
