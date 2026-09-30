import type { Messages } from '../en'

const controls: Messages['controls'] = {
  // ── Name section (Advanced) ────────────────────────────────────────────
  'name_title': 'Nome',
  'name_desc': 'Aparece neste código nos seus backups on-line.',
  'name_label': 'Nome',
  'name_placeholder': 'Meu QR code',

  // ── Style presets ──────────────────────────────────────────────────────
  'presets_title': 'Estilos predefinidos',
  'presets_desc': 'Um ponto de partida — ajuste o que quiser abaixo.',
  // Preset names, on chips — keep short, one word
  'preset_classic': 'Clássico',
  'preset_rounded': 'Arredondado',
  'preset_dots': 'Pontos',
  'preset_sunset': 'Poente',
  'preset_radial': 'Radial',
  'preset_star': 'Estrela',

  // ── Colours ────────────────────────────────────────────────────────────
  'colours_title': 'Cores',
  'colour_modules': 'Módulos',
  'colour_background': 'Fundo',
  'colour_hex_aria': 'Valor hexadecimal de {label}',
  'transparent_background': 'Fundo transparente',
  'transparent_background_hint': 'Exporte um PNG/SVG sem preenchimento de fundo.',
  'gradient_modules': 'Módulos em degradê',
  'gradient_end': 'Fim do degradê',
  'gradient_angle': 'Ângulo do degradê',
  'two_tone_corners': 'Cantos em duas cores',
  'two_tone_corners_hint': 'Dê aos três cantos de posição uma cor própria.',
  'corner_colour': 'Cor dos cantos',

  // Contrast warnings (amber box under the colours). Each is a bold first
  // sentence followed by the rest. {ratio} is like "2.4", {min} is "3".
  'contrast_inverted_background_title': 'Módulos claros sobre fundo escuro.',
  'contrast_inverted_background_body':
    'O padrão QR espera o contrário, e leitores mais rigorosos recusam na hora um código invertido — a própria aba Ler deste app é um deles. A maioria das câmeras de celular consegue ler, mas troque as duas cores de lugar se o código precisar funcionar em qualquer leitor.',
  'contrast_inverted_star_title': 'Módulos claros sobre uma estrela escura.',
  'contrast_inverted_star_body':
    'O padrão QR espera o contrário, e leitores mais rigorosos recusam na hora um código invertido — a própria aba Ler deste app é um deles. A maioria das câmeras de celular consegue ler, mas escureça os módulos ou clareie a estrela atrás deles se o código precisar funcionar em qualquer leitor.',
  'contrast_low_star_title': 'Pouco contraste entre os módulos e a estrela atrás deles.',
  'contrast_low_star_body':
    '{ratio}:1, quando um leitor precisa de pelo menos {min}:1. A estrela fica sob a maior parte do código, então, para um leitor, ela é o fundo — por mais clara que seja a página em volta. Clareie a estrela ou escureça os módulos.',
  'contrast_low_modules_title': 'Pouco contraste entre os módulos e o fundo.',
  'contrast_low_modules_body':
    '{ratio}:1, quando um leitor precisa de pelo menos {min}:1. Códigos com cores tão próximas costumam ser lidos na tela e depois falhar quando impressos ou vistos de longe. Escureça a cor dos módulos ou clareie o fundo.',
  'contrast_low_corners_title': 'Pouco contraste entre os cantos e o fundo.',
  'contrast_low_corners_body':
    '{ratio}:1, quando um leitor precisa de pelo menos {min}:1. O leitor encontra os três quadrados dos cantos antes de ler qualquer outra coisa, então este é o pior lugar para faltar contraste. Escureça a cor dos cantos ou clareie o fundo.',

  // ── Shape & size ───────────────────────────────────────────────────────
  'shape_title': 'Formato e tamanho',
  'shape_desc': 'O contorno do código, o arredondamento dos módulos, o estilo dos cantos e as dimensões.',
  'code_shape': 'Formato do código',
  // Shape buttons — keep short, one word (a grid of six)
  'shape_square': 'Quadrado',
  'shape_rounded': 'Arredondado',
  'shape_circle': 'Círculo',
  'shape_squircle': 'Superelipse',
  'shape_hexagon': 'Hexágono',
  'shape_star': 'Estrela',
  'star_placement': 'Posição da estrela',
  'star_placement_inside': 'Dentro da estrela',
  'star_placement_behind': 'Estrela ao fundo',
  'star_colour': 'Cor da estrela',
  'star_behind_desc':
    'A estrela fica atrás do código como pano de fundo, com as pontas aparecendo em volta dele — o visual da marca de QR em estrela do Universal PDF. O código é desenhado por cima da estrela em vez de espremido entre as pontas, então fica cerca de uma vez e meia maior que o mesmo design em Dentro da estrela, e bem mais fácil de ler. Nesse arranjo não sobra um anel para o enfeite preencher, por isso essa opção não aparece.',
  'star_inside_desc':
    'O código fica dentro da estrela, sem nunca passar das bordas dela. Assim a estrela fica inteira, mas o código fica bem menor — as cinco reentrâncias da estrela cortam todos os lados do quadrado que cabe ali dentro.',
  'decoration': 'Enfeite',
  // Decoration buttons — keep short, one word
  'decor_none': 'Nenhum',
  'decor_burst': 'Explosão',
  'decor_scatter': 'Dispersão',
  'decoration_matches': 'Enfeite na cor dos módulos',
  'decoration_matches_hint': 'Desative para dar ao enfeite uma cor própria.',
  'decoration_colour': 'Cor do enfeite',
  'decoration_on_note':
    'O enfeite preenche o espaço que o formato deixa em volta do código — e precisa desse espaço, então o código é desenhado menor para abrir lugar. Exporte em um tamanho maior que o normal e teste a leitura antes de imprimir. Ele fica fora do código, então a cor é livre — não há regra de contraste a cumprir.',
  'decoration_off_note':
    'Preenche o espaço que um fundo com formato deixa em volta do código. Escolher um enfeite transforma um código quadrado em círculo, já que um fundo quadrado não deixa espaço para preencher.',
  // How much of the image the code fills on a shaped plate. {pct} is a
  // percentage number, {size} and {inner} are pixel counts.
  'frame_note_rounded': 'O código ocupa {pct}% da imagem de {size} px ({inner} px) — o resto é o quadrado arredondado em volta.',
  'frame_note_circle': 'O código ocupa {pct}% da imagem de {size} px ({inner} px) — o resto é o círculo em volta.',
  'frame_note_squircle': 'O código ocupa {pct}% da imagem de {size} px ({inner} px) — o resto é a superelipse em volta.',
  'frame_note_hexagon': 'O código ocupa {pct}% da imagem de {size} px ({inner} px) — o resto é o hexágono em volta.',
  'frame_note_star': 'O código ocupa {pct}% da imagem de {size} px ({inner} px) — o resto é a estrela em volta.',
  'frame_note_star_behind': 'O código ocupa {pct}% da imagem de {size} px ({inner} px) — as pontas da estrela aparecem em volta dele.',
  'frame_note_never_trimmed': 'O código nunca é cortado para caber no formato — isso impediria a leitura.',
  'module_style': 'Estilo dos módulos',
  // Module-shape buttons — keep short (a grid of six)
  'dot_square': 'Quadrado',
  'dot_rounded': 'Arredondado',
  'dot_extra_rounded': 'Bem redondo',
  'dot_dots': 'Pontos',
  'dot_classy': 'Elegante',
  'dot_classy_rounded': 'Elegante redondo',
  'corner_frame': 'Moldura dos cantos',
  'corner_frame_square': 'Quadrada',
  'corner_frame_rounded': 'Arredondada',
  'corner_frame_dot': 'Ponto',
  'corner_dot': 'Centro dos cantos',
  'corner_dot_square': 'Quadrado',
  'corner_dot_dot': 'Ponto',
  'size': 'Tamanho',
  'quiet_zone': 'Margem (zona de silêncio)',

  // ── Logo & branding ────────────────────────────────────────────────────
  'logo_title': 'Logotipo e marca',
  'logo_desc': 'Coloque a sua marca no centro.',
  'logo_drop_label': 'Solte um logotipo aqui ou clique para escolher um',
  'logo_not_image': 'Escolha um arquivo de imagem (PNG, JPG ou SVG).',
  'logo_preview_alt': 'Prévia do logotipo',
  'logo_added': 'Logotipo personalizado adicionado',
  'logo_replace': 'Substituir',
  'logo_remove': 'Remover',
  'logo_pick_touch': 'Toque para escolher um logotipo (PNG, JPG, SVG)',
  'logo_pick_desktop': 'Solte um logotipo aqui ou clique para escolher (PNG, JPG, SVG)',
  'logo_size': 'Tamanho do logotipo',
  'logo_padding': 'Espaço em volta do logotipo',
  'clear_behind_logo': 'Limpar módulos atrás do logotipo',
  'remove_unisim_mark': 'Remover a marca UNI·SIM',
  'remove_unisim_mark_hint_logo': 'Tira o pequeno selo UNI·SIM do canto inferior direito.',
  'remove_unisim_mark_hint': 'Tira a marca UNI·SIM do centro.',

  // ── "What's it for?" card ──────────────────────────────────────────────
  'content_title': 'Para que serve?',
  // Kinds of code: chips (keep short, one word) AND the title on the preview card
  'kind_link': 'Link',
  'kind_wifi': 'Wi-Fi',
  'kind_contact': 'Contato',
  'kind_email': 'E-mail',
  'kind_phone': 'Telefone',
  'kind_sms': 'SMS',
  'kind_location': 'Local',
  'kind_event': 'Evento',
  'kind_barcode': 'Código de barras',
  'kind_more': 'Mais',
  'more_kinds_aria': 'Mais tipos de código',

  // Content form fields
  'optional': 'Opcional',
  'link_label': 'Endereço do site ou texto',
  'wifi_ssid': 'Nome da rede (SSID)',
  'wifi_ssid_placeholder': 'MeuWiFi',
  'wifi_password': 'Senha',
  'wifi_password_placeholder': 'deixe em branco se for aberta',
  'wifi_hidden': 'Rede oculta',
  'email_to': 'Para',
  'email_subject': 'Assunto',
  'email_message': 'Mensagem',
  'phone_number': 'Número de telefone',
  'sms_message': 'Mensagem',
  'sms_message_placeholder': 'Texto pré-preenchido (opcional)',
  'contact_first_name': 'Nome',
  'contact_first_name_placeholder': 'Maria',
  'contact_last_name': 'Sobrenome',
  'contact_last_name_placeholder': 'Silva',
  'contact_org': 'Organização',
  'contact_phone': 'Telefone',
  'contact_email': 'E-mail',
  'contact_website': 'Site',
  'geo_latitude': 'Latitude',
  'geo_longitude': 'Longitude',
  'event_title': 'Título',
  'event_title_placeholder': 'Reunião de equipe',
  'event_location': 'Local',
  'event_starts': 'Início',
  'event_ends': 'Término',
  'event_description': 'Descrição',

  // ── Barcode ────────────────────────────────────────────────────────────
  'barcode_type': 'Tipo de código de barras',
  'barcode_value': 'Valor',
  'barcode_value_aria': 'Valor do {format}',
  'barcode_static_note': 'Os códigos de barras são estáticos e sem estilo — sem cores, logotipo nem formato.',
  // One-line hint under the field, per format
  'barcode_hint_code128': 'Qualquer texto ou número — o código de barras de uso geral mais comum.',
  'barcode_hint_ean13': '12 dígitos (o 13º, verificador, é adicionado para você) ou cole os 13.',
  'barcode_hint_upca': '11 dígitos (dígito verificador adicionado) ou cole os 12.',
  'barcode_hint_code39': 'Maiúsculas A–Z, 0–9 e - . $ / + % ou espaço.',
  'barcode_hint_itf14': 'Código de caixas de embarque — 13 dígitos (dígito verificador adicionado) ou os 14.',
  // Validation errors, in red under the field
  'barcode_error_code128': 'Digite até {max} caracteres.',
  'barcode_error_ean13': 'O EAN-13 precisa de 12 ou 13 dígitos.',
  'barcode_error_upca': 'O UPC-A precisa de 11 ou 12 dígitos.',
  'barcode_error_code39': 'Use apenas maiúsculas A–Z, 0–9 e - . $ / + %.',
  'barcode_error_itf14': 'O ITF-14 precisa de 13 ou 14 dígitos.',

  // ── Branding controls (dynamic codes) ──────────────────────────────────
  'brand_style': 'Estilo',
  'brand_use_org': 'usar da org.',
  'brand_transparent': 'Transparente',
  'brand_gradient': 'Degradê',
  'brand_gradient_end': 'Fim',
  'brand_angle': 'Ângulo',
  'brand_corners': 'Cantos',
  'brand_centre_logo': 'Logotipo central',
  'brand_logo_none_preview': 'nenhum',
  'brand_org_icon': 'Ícone da org.',
  'brand_upload': 'Enviar…',
  'brand_none': 'Nenhum',
}

export default controls
