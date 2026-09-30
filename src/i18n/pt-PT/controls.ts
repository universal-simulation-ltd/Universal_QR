import type { Messages } from '../en'

const controls: Messages['controls'] = {
  // ── Name section (Advanced) ────────────────────────────────────────────
  name_title: 'Nome',
  name_desc: 'Aparece neste código nas suas cópias de segurança online.',
  name_label: 'Nome',
  name_placeholder: 'O meu código QR',

  // ── Style presets ──────────────────────────────────────────────────────
  presets_title: 'Estilos predefinidos',
  presets_desc: 'Um ponto de partida — ajuste o que quiser abaixo.',
  // Preset names, on chips — keep short, one word
  preset_classic: 'Clássico',
  preset_rounded: 'Arredondado',
  preset_dots: 'Pontos',
  preset_sunset: 'Pôr do sol',
  preset_radial: 'Radial',
  preset_star: 'Estrela',

  // ── Colours ────────────────────────────────────────────────────────────
  colours_title: 'Cores',
  colour_modules: 'Módulos',
  colour_background: 'Fundo',
  colour_hex_aria: '{label}: valor hexadecimal',
  transparent_background: 'Fundo transparente',
  transparent_background_hint: 'Exportar um PNG/SVG sem cor de fundo.',
  gradient_modules: 'Módulos em gradiente',
  gradient_end: 'Fim do gradiente',
  gradient_angle: 'Ângulo do gradiente',
  two_tone_corners: 'Cantos em dois tons',
  two_tone_corners_hint: 'Dar uma cor própria aos três cantos de posição.',
  corner_colour: 'Cor dos cantos',

  // Contrast warnings (amber box under the colours)
  contrast_inverted_background_title: 'Módulos claros sobre um fundo escuro.',
  contrast_inverted_background_body:
    'A norma QR espera o contrário, e os leitores mais rigorosos recusam logo um código invertido — o próprio separador Ler desta app é um deles. A maioria das câmaras de telemóvel consegue lê-lo, mas troque as duas cores se o código tiver de funcionar em todo o lado.',
  contrast_inverted_star_title: 'Módulos claros sobre uma estrela escura.',
  contrast_inverted_star_body:
    'A norma QR espera o contrário, e os leitores mais rigorosos recusam logo um código invertido — o próprio separador Ler desta app é um deles. A maioria das câmaras de telemóvel consegue lê-lo, mas escureça os módulos ou clareie a estrela por trás deles se o código tiver de funcionar em todo o lado.',
  contrast_low_star_title: 'Pouco contraste entre os módulos e a estrela por trás deles.',
  contrast_low_star_body:
    '{ratio}:1, quando um leitor precisa de pelo menos {min}:1. A estrela fica por baixo da maior parte do código, por isso, para um leitor, é um fundo — por mais clara que seja a página à volta. Clareie a estrela ou escureça os módulos.',
  contrast_low_modules_title: 'Pouco contraste entre os módulos e o fundo.',
  contrast_low_modules_body:
    '{ratio}:1, quando um leitor precisa de pelo menos {min}:1. Códigos com tão pouco contraste costumam ser lidos no ecrã e depois falhar quando impressos ou vistos à distância. Escureça a cor dos módulos ou clareie o fundo.',
  contrast_low_corners_title: 'Pouco contraste entre os cantos e o fundo.',
  contrast_low_corners_body:
    '{ratio}:1, quando um leitor precisa de pelo menos {min}:1. Um leitor encontra os três quadrados dos cantos antes de ler o que quer que seja, por isso este é o sítio onde a falta de contraste é mais arriscada. Escureça a cor dos cantos ou clareie o fundo.',

  // ── Shape & size ───────────────────────────────────────────────────────
  shape_title: 'Forma e tamanho',
  shape_desc: 'O contorno do código, o arredondamento dos módulos, o estilo dos cantos e as dimensões.',
  code_shape: 'Forma do código',
  // Shape buttons — keep short, one word (a grid of six)
  shape_square: 'Quadrado',
  shape_rounded: 'Arredondado',
  shape_circle: 'Círculo',
  shape_squircle: 'Quadrado arredondado',
  shape_hexagon: 'Hexágono',
  shape_star: 'Estrela',
  star_placement: 'Posição da estrela',
  star_placement_inside: 'Dentro da estrela',
  star_placement_behind: 'Estrela por trás',
  star_colour: 'Cor da estrela',
  star_behind_desc:
    'A estrela fica por trás do código como pano de fundo, com as pontas visíveis à volta — o aspeto da marca da estrela QR no Universal PDF. O código é desenhado por cima da estrela em vez de ser encaixado entre as pontas, por isso fica cerca de uma vez e meia maior do que o mesmo design com a opção «Dentro da estrela», e proporcionalmente mais fácil de ler. Nesta disposição, a decoração não tem nenhum anel para preencher, por isso não está disponível.',
  star_inside_desc:
    'O código fica dentro da estrela, sem nunca ultrapassar as suas arestas. Assim a estrela mantém-se inteira, à custa de um código muito mais pequeno — os cinco recortes da estrela entram em todos os lados do quadrado que lá cabe.',
  decoration: 'Decoração',
  // Decoration buttons — keep short, one word
  decor_none: 'Nenhuma',
  decor_burst: 'Explosão',
  decor_scatter: 'Dispersão',
  decoration_matches: 'Decoração igual aos módulos',
  decoration_matches_hint: 'Desative para dar uma cor própria à decoração.',
  decoration_colour: 'Cor da decoração',
  decoration_on_note:
    'A decoração preenche o espaço que a forma deixa à volta do código — e precisa desse espaço, por isso o código é desenhado mais pequeno para o criar. Exporte num tamanho maior do que o habitual e teste a leitura antes de imprimir. Fica fora do código, por isso a sua cor é livre — não há nenhuma regra de contraste a cumprir.',
  decoration_off_note:
    'Preenche o espaço que uma placa com forma deixa à volta do código. Escolher uma decoração muda um código quadrado para círculo, porque uma placa quadrada não tem espaço para preencher.',
  // How much of the image the code fills on a shaped plate
  frame_note_rounded: 'O código ocupa {pct}% da imagem de {size}px ({inner}px) — o resto é o quadrado de cantos arredondados à volta.',
  frame_note_circle: 'O código ocupa {pct}% da imagem de {size}px ({inner}px) — o resto é o círculo à volta.',
  frame_note_squircle: 'O código ocupa {pct}% da imagem de {size}px ({inner}px) — o resto é o quadrado arredondado à volta.',
  frame_note_hexagon: 'O código ocupa {pct}% da imagem de {size}px ({inner}px) — o resto é o hexágono à volta.',
  frame_note_star: 'O código ocupa {pct}% da imagem de {size}px ({inner}px) — o resto é a estrela à volta.',
  frame_note_star_behind: 'O código ocupa {pct}% da imagem de {size}px ({inner}px) — as pontas da estrela aparecem à volta dele.',
  frame_note_never_trimmed: 'O código nunca é cortado para caber na forma — isso impediria a leitura.',
  module_style: 'Estilo dos módulos',
  // Module-shape buttons — keep short (a grid of six)
  dot_square: 'Quadrado',
  dot_rounded: 'Arredondado',
  dot_extra_rounded: 'Muito arredondado',
  dot_dots: 'Pontos',
  dot_classy: 'Elegante',
  dot_classy_rounded: 'Elegante arredondado',
  corner_frame: 'Moldura dos cantos',
  corner_frame_square: 'Quadrada',
  corner_frame_rounded: 'Arredondada',
  corner_frame_dot: 'Ponto',
  corner_dot: 'Centro dos cantos',
  corner_dot_square: 'Quadrado',
  corner_dot_dot: 'Ponto',
  size: 'Tamanho',
  quiet_zone: 'Margem (zona de silêncio)',

  // ── Logo & branding ────────────────────────────────────────────────────
  logo_title: 'Logótipo e marca',
  logo_desc: 'Coloque o símbolo da sua marca no centro.',
  logo_drop_label: 'Largue um logótipo aqui ou clique para escolher um',
  logo_not_image: 'Escolha um ficheiro de imagem (PNG, JPG ou SVG).',
  logo_preview_alt: 'Pré-visualização do logótipo',
  logo_added: 'Logótipo personalizado adicionado',
  logo_replace: 'Substituir',
  logo_remove: 'Remover',
  logo_pick_touch: 'Toque para escolher um logótipo (PNG, JPG, SVG)',
  logo_pick_desktop: 'Largue um logótipo aqui ou clique para escolher (PNG, JPG, SVG)',
  logo_size: 'Tamanho do logótipo',
  logo_padding: 'Margem do logótipo',
  clear_behind_logo: 'Limpar módulos por trás do logótipo',
  remove_unisim_mark: 'Remover marca UNI·SIM',
  remove_unisim_mark_hint_logo: 'Retira o pequeno selo UNI·SIM do canto inferior direito.',
  remove_unisim_mark_hint: 'Retira a marca UNI·SIM do centro.',

  // ── "What's it for?" card ──────────────────────────────────────────────
  content_title: 'Para que serve?',
  // Kinds of code: chips (keep short, one word) AND the title on the preview card
  kind_link: 'Ligação',
  kind_wifi: 'Wi-Fi',
  kind_contact: 'Contacto',
  kind_email: 'Email',
  kind_phone: 'Telefone',
  kind_sms: 'SMS',
  kind_location: 'Local',
  kind_event: 'Evento',
  kind_barcode: 'Código de barras',
  kind_more: 'Mais',
  more_kinds_aria: 'Mais tipos de código',

  // Content form fields
  optional: 'Opcional',
  link_label: 'Endereço do site ou texto',
  wifi_ssid: 'Nome da rede (SSID)',
  wifi_ssid_placeholder: 'RedeDeCasa',
  wifi_password: 'Palavra-passe',
  wifi_password_placeholder: 'deixar em branco se for aberta',
  wifi_hidden: 'Rede oculta',
  email_to: 'Para',
  email_subject: 'Assunto',
  email_message: 'Mensagem',
  phone_number: 'Número de telefone',
  sms_message: 'Mensagem',
  sms_message_placeholder: 'Texto pré-preenchido opcional',
  contact_first_name: 'Nome próprio',
  contact_first_name_placeholder: 'Maria',
  contact_last_name: 'Apelido',
  contact_last_name_placeholder: 'Silva',
  contact_org: 'Organização',
  contact_phone: 'Telefone',
  contact_email: 'Email',
  contact_website: 'Site',
  geo_latitude: 'Latitude',
  geo_longitude: 'Longitude',
  event_title: 'Título',
  event_title_placeholder: 'Reunião de equipa',
  event_location: 'Local',
  event_starts: 'Início',
  event_ends: 'Fim',
  event_description: 'Descrição',

  // ── Barcode ────────────────────────────────────────────────────────────
  barcode_type: 'Tipo de código de barras',
  barcode_value: 'Valor',
  barcode_value_aria: '{format}: valor',
  barcode_static_note: 'Os códigos de barras são estáticos e sem estilo — sem cores, logótipo nem forma.',
  // One-line hint under the field, per format
  barcode_hint_code128: 'Qualquer texto ou números — o código de barras de uso geral mais comum.',
  barcode_hint_ean13: '12 dígitos (o 13.º, de controlo, é acrescentado automaticamente) ou cole os 13.',
  barcode_hint_upca: '11 dígitos (dígito de controlo acrescentado) ou cole os 12.',
  barcode_hint_code39: 'A–Z em maiúsculas, 0–9 e - . $ / + % ou espaço.',
  barcode_hint_itf14: 'Código de caixas de transporte — 13 dígitos (dígito de controlo acrescentado) ou os 14.',
  // Validation errors, in red under the field
  barcode_error_code128: 'Introduza até {max} caracteres.',
  barcode_error_ean13: 'O EAN-13 precisa de 12 ou 13 dígitos.',
  barcode_error_upca: 'O UPC-A precisa de 11 ou 12 dígitos.',
  barcode_error_code39: 'Use apenas A–Z em maiúsculas, 0–9 e - . $ / + %.',
  barcode_error_itf14: 'O ITF-14 precisa de 13 ou 14 dígitos.',

  // ── Branding controls (dynamic codes) ──────────────────────────────────
  brand_style: 'Estilo',
  brand_use_org: 'usar a da org.',
  brand_transparent: 'Transparente',
  brand_gradient: 'Gradiente',
  brand_gradient_end: 'Fim',
  brand_angle: 'Ângulo',
  brand_corners: 'Cantos',
  brand_centre_logo: 'Logótipo central',
  brand_logo_none_preview: 'nenhum',
  brand_org_icon: 'Ícone da org.',
  brand_upload: 'Carregar…',
  brand_none: 'Nenhum',
}

export default controls
