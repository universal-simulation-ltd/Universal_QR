import type { Messages } from '../en'

const controls: Messages['controls'] = {
  // ── Name section (Advanced) ────────────────────────────────────────────
  name_title: 'Nombre',
  name_desc: 'Se muestra en este código en tus copias de seguridad en línea.',
  name_label: 'Nombre',
  name_placeholder: 'Mi código QR',

  // ── Style presets ──────────────────────────────────────────────────────
  presets_title: 'Estilos predefinidos',
  presets_desc: 'Un punto de partida: ajusta lo que quieras abajo.',
  // Preset names, on chips — keep short, one word
  preset_classic: 'Clásico',
  preset_rounded: 'Redondeado',
  preset_dots: 'Puntos',
  preset_sunset: 'Atardecer',
  preset_radial: 'Radial',
  preset_star: 'Estrella',

  // ── Colours ────────────────────────────────────────────────────────────
  colours_title: 'Colores',
  colour_modules: 'Módulos',
  colour_background: 'Fondo',
  colour_hex_aria: 'Valor hexadecimal de {label}',
  transparent_background: 'Fondo transparente',
  transparent_background_hint: 'Exporta un PNG o SVG sin relleno de fondo.',
  gradient_modules: 'Módulos con degradado',
  gradient_end: 'Final del degradado',
  gradient_angle: 'Ángulo del degradado',
  two_tone_corners: 'Esquinas de dos tonos',
  two_tone_corners_hint: 'Da a las tres esquinas de posición su propio color.',
  corner_colour: 'Color de las esquinas',

  // Contrast warnings (amber box under the colours)
  contrast_inverted_background_title: 'Módulos claros sobre un fondo oscuro.',
  contrast_inverted_background_body:
    'El estándar QR espera lo contrario, y los lectores estrictos rechazan directamente un código invertido; la propia pestaña Escanear de esta app es uno de ellos. La mayoría de las cámaras de móvil se las arreglan, pero intercambia los dos colores si el código tiene que funcionar en todas partes.',
  contrast_inverted_star_title: 'Módulos claros sobre una estrella oscura.',
  contrast_inverted_star_body:
    'El estándar QR espera lo contrario, y los lectores estrictos rechazan directamente un código invertido; la propia pestaña Escanear de esta app es uno de ellos. La mayoría de las cámaras de móvil se las arreglan, pero oscurece los módulos o aclara la estrella que tienen detrás si el código tiene que funcionar en todas partes.',
  contrast_low_star_title: 'Poco contraste entre los módulos y la estrella que tienen detrás.',
  contrast_low_star_body:
    '{ratio}:1, cuando un lector necesita al menos {min}:1. La estrella queda bajo la mayor parte del código, así que para un escáner es el fondo, por muy clara que sea la página que la rodea. Aclara la estrella u oscurece los módulos.',
  contrast_low_modules_title: 'Poco contraste entre los módulos y el fondo.',
  contrast_low_modules_body:
    '{ratio}:1, cuando un lector necesita al menos {min}:1. Los códigos con tan poco contraste suelen escanearse en pantalla y luego fallar impresos o a distancia. Oscurece el color de los módulos o aclara el fondo.',
  contrast_low_corners_title: 'Poco contraste entre las esquinas y el fondo.',
  contrast_low_corners_body:
    '{ratio}:1, cuando un lector necesita al menos {min}:1. Un escáner localiza los tres cuadrados de las esquinas antes de leer nada más, así que es el peor sitio para quedarse corto. Oscurece el color de las esquinas o aclara el fondo.',

  // ── Shape & size ───────────────────────────────────────────────────────
  shape_title: 'Forma y tamaño',
  shape_desc: 'El contorno del código, el redondeo de los módulos, el estilo de las esquinas y las dimensiones.',
  code_shape: 'Forma del código',
  // Shape buttons — keep short, one word (a grid of six)
  shape_square: 'Cuadrado',
  shape_rounded: 'Redondeado',
  shape_circle: 'Círculo',
  shape_squircle: 'Supercírculo',
  shape_hexagon: 'Hexágono',
  shape_star: 'Estrella',
  star_placement: 'Posición de la estrella',
  star_placement_inside: 'Dentro de la estrella',
  star_placement_behind: 'Estrella detrás',
  star_colour: 'Color de la estrella',
  star_behind_desc:
    'La estrella queda detrás del código como fondo, con las puntas asomando a su alrededor: el aspecto del sello QR con estrella de Universal PDF. El código se dibuja sobre la estrella en lugar de encajarse entre sus puntas, así que es aproximadamente la mitad más grande que el mismo diseño con «Dentro de la estrella», y en proporción más fácil de escanear. En esta disposición la decoración no tiene ningún anillo que rellenar, así que no se ofrece.',
  star_inside_desc:
    'El código queda dentro de la estrella, sin cruzar nunca sus bordes. Así la estrella se mantiene entera, a cambio de un código mucho más pequeño, porque las cinco muescas de la estrella recortan todos los lados del cuadrado que cabe dentro.',
  decoration: 'Decoración',
  // Decoration buttons — keep short, one word
  decor_none: 'Ninguna',
  decor_burst: 'Rayos',
  decor_scatter: 'Dispersión',
  decoration_matches: 'Decoración del color de los módulos',
  decoration_matches_hint: 'Desactívalo para dar a la decoración su propio color.',
  decoration_colour: 'Color de la decoración',
  decoration_on_note:
    'La decoración rellena el espacio que la forma deja alrededor del código, y necesita ese espacio, así que el código se dibuja más pequeño para dejárselo. Exporta a un tamaño mayor de lo habitual y comprueba que se escanea antes de imprimir. Queda fuera del código, así que puedes elegir su color libremente: no hay ninguna regla de contraste que cumplir.',
  decoration_off_note:
    'Rellena el espacio que un fondo con forma deja alrededor del código. Al elegir una, un código cuadrado pasa a ser un círculo, ya que un fondo cuadrado no tiene espacio que rellenar.',
  // How much of the image the code fills on a shaped plate
  frame_note_rounded: 'El código ocupa el {pct} % de la imagen de {size} px ({inner} px); el resto es el cuadrado redondeado que lo rodea.',
  frame_note_circle: 'El código ocupa el {pct} % de la imagen de {size} px ({inner} px); el resto es el círculo que lo rodea.',
  frame_note_squircle: 'El código ocupa el {pct} % de la imagen de {size} px ({inner} px); el resto es el supercírculo que lo rodea.',
  frame_note_hexagon: 'El código ocupa el {pct} % de la imagen de {size} px ({inner} px); el resto es el hexágono que lo rodea.',
  frame_note_star: 'El código ocupa el {pct} % de la imagen de {size} px ({inner} px); el resto es la estrella que lo rodea.',
  frame_note_star_behind: 'El código ocupa el {pct} % de la imagen de {size} px ({inner} px); las puntas de la estrella asoman a su alrededor.',
  frame_note_never_trimmed: 'El código nunca se recorta para encajar en la forma: dejaría de escanearse.',
  module_style: 'Estilo de los módulos',
  // Module-shape buttons — keep short (a grid of six)
  dot_square: 'Cuadrado',
  dot_rounded: 'Redondeado',
  dot_extra_rounded: 'Muy redondeado',
  dot_dots: 'Puntos',
  dot_classy: 'Elegante',
  dot_classy_rounded: 'Elegante redondeado',
  corner_frame: 'Marco de las esquinas',
  corner_frame_square: 'Cuadrado',
  corner_frame_rounded: 'Redondeado',
  corner_frame_dot: 'Punto',
  corner_dot: 'Centro de las esquinas',
  corner_dot_square: 'Cuadrado',
  corner_dot_dot: 'Punto',
  size: 'Tamaño',
  quiet_zone: 'Margen (zona de silencio)',

  // ── Logo & branding ────────────────────────────────────────────────────
  logo_title: 'Logotipo y marca',
  logo_desc: 'Pon el logotipo de tu marca en el centro.',
  logo_drop_label: 'Suelta aquí un logotipo o haz clic para elegir uno',
  logo_not_image: 'Elige un archivo de imagen (PNG, JPG o SVG).',
  logo_preview_alt: 'Vista previa del logotipo',
  logo_added: 'Logotipo personalizado añadido',
  logo_replace: 'Sustituir',
  logo_remove: 'Quitar',
  logo_pick_touch: 'Toca para elegir un logotipo (PNG, JPG, SVG)',
  logo_pick_desktop: 'Suelta aquí un logotipo o haz clic para elegirlo (PNG, JPG, SVG)',
  logo_size: 'Tamaño del logotipo',
  logo_padding: 'Margen del logotipo',
  clear_behind_logo: 'Despejar los módulos tras el logotipo',
  remove_unisim_mark: 'Quitar la marca de UNI·SIM',
  remove_unisim_mark_hint_logo: 'Quita la pequeña insignia de UNI·SIM de la esquina inferior derecha.',
  remove_unisim_mark_hint: 'Quita la marca de UNI·SIM del centro.',

  // ── "What's it for?" card ──────────────────────────────────────────────
  content_title: '¿Para qué es?',
  // Kinds of code: chips (keep short, one word) AND the title on the preview card
  kind_link: 'Enlace',
  kind_wifi: 'Wi-Fi',
  kind_contact: 'Contacto',
  kind_email: 'Correo',
  kind_phone: 'Teléfono',
  kind_sms: 'SMS',
  kind_location: 'Ubicación',
  kind_event: 'Evento',
  kind_barcode: 'Código de barras',
  kind_more: 'Más',
  more_kinds_aria: 'Más tipos de código',

  // Content form fields
  optional: 'Opcional',
  link_label: 'Dirección web o texto',
  wifi_ssid: 'Nombre de la red (SSID)',
  wifi_ssid_placeholder: 'WiFi_Casa',
  wifi_password: 'Contraseña',
  wifi_password_placeholder: 'déjala en blanco si la red es abierta',
  wifi_hidden: 'Red oculta',
  email_to: 'Para',
  email_subject: 'Asunto',
  email_message: 'Mensaje',
  phone_number: 'Número de teléfono',
  sms_message: 'Mensaje',
  sms_message_placeholder: 'Texto predefinido opcional',
  contact_first_name: 'Nombre',
  contact_first_name_placeholder: 'Lucía',
  contact_last_name: 'Apellidos',
  contact_last_name_placeholder: 'García',
  contact_org: 'Organización',
  contact_phone: 'Teléfono',
  contact_email: 'Correo electrónico',
  contact_website: 'Sitio web',
  geo_latitude: 'Latitud',
  geo_longitude: 'Longitud',
  event_title: 'Título',
  event_title_placeholder: 'Reunión de equipo',
  event_location: 'Lugar',
  event_starts: 'Inicio',
  event_ends: 'Fin',
  event_description: 'Descripción',

  // ── Barcode ────────────────────────────────────────────────────────────
  barcode_type: 'Tipo de código de barras',
  barcode_value: 'Valor',
  barcode_value_aria: 'Valor de {format}',
  barcode_static_note: 'Los códigos de barras son estáticos y no admiten estilo: sin colores, logotipo ni forma.',
  // One-line hint under the field, per format
  barcode_hint_code128: 'Cualquier texto o número: el código de barras de uso general más habitual.',
  barcode_hint_ean13: '12 dígitos (el 13.º, de control, se añade solo) o pega los 13.',
  barcode_hint_upca: '11 dígitos (se añade el de control) o pega los 12.',
  barcode_hint_code39: 'Mayúsculas A–Z, 0–9 y - . $ / + % o espacio.',
  barcode_hint_itf14: 'Código para cajas de envío: 13 dígitos (se añade el de control) o los 14.',
  // Validation errors, in red under the field
  barcode_error_code128: 'Introduce hasta {max} caracteres.',
  barcode_error_ean13: 'EAN-13 necesita 12 o 13 dígitos.',
  barcode_error_upca: 'UPC-A necesita 11 o 12 dígitos.',
  barcode_error_code39: 'Usa solo mayúsculas A–Z, 0–9 y - . $ / + %.',
  barcode_error_itf14: 'ITF-14 necesita 13 o 14 dígitos.',

  // ── Branding controls (dynamic codes) ──────────────────────────────────
  brand_style: 'Estilo',
  brand_use_org: 'usar el de la org.',
  brand_transparent: 'Transparente',
  brand_gradient: 'Degradado',
  brand_gradient_end: 'Final',
  brand_angle: 'Ángulo',
  brand_corners: 'Esquinas',
  brand_centre_logo: 'Logotipo central',
  brand_logo_none_preview: 'ninguno',
  brand_org_icon: 'Icono org.',
  brand_upload: 'Subir…',
  brand_none: 'Ninguno',
}

export default controls
