import type { Messages } from '../en'

const studio: Messages['studio'] = {
  // Shared
  'remove': 'Quitar',
  'close': 'Cerrar',

  // Header
  'headline': 'Códigos QR que {em}. Para siempre.',
  'headline_em': 'simplemente funcionan',
  'lead': 'Elige tus colores, da forma a los módulos, añade un logotipo: se genera en directo, en tu dispositivo. Descárgalo en PNG, SVG, JPEG o WebP.',

  // Mode switch + reset
  'mode_aria': 'Modo del editor',
  'mode_simple': 'Sencillo',
  'mode_branding': 'Marca',
  'mode_advanced': 'Avanzado',
  'reset_all': 'Restablecer todo',

  // Export button + menu
  'save_or_share': 'Guardar o compartir',
  'download_png': 'Descargar PNG',
  'preparing': 'Preparando…',
  'more_export_aria': 'Más opciones de exportación',
  'more_options': 'Más opciones',
  'download_as': 'Descargar como',
  'copy_png': 'Copiar PNG al portapapeles',
  'back_up_online': 'Hacer copia de seguridad en unisim.co.uk',
  'copied': '✓ Copiado al portapapeles',
  'copy_unsupported': 'No se puede copiar: usa Descargar',
  'scan_test_hint': 'Comprueba siempre que se escanea antes de imprimirlo en tamaño pequeño.',
  'export_failed': 'Lo sentimos, no se ha podido exportar: {message}',
  'nothing_to_export': 'Aún no hay nada que exportar.',
  'export_failed_reason': 'Error al exportar',

  // Branding panel
  'presets_title': 'Estilos predefinidos',
  'presets_hint': 'Un punto de partida: ajusta abajo los colores y el logotipo.',
  'colours_title': 'Colores',
  'modules': 'Módulos',
  'background': 'Fondo',
  'transparent_background': 'Fondo transparente',
  'transparent_background_hint': 'Exporta un PNG o SVG sin relleno de fondo.',
  'gradient_modules': 'Módulos con degradado',
  'gradient_end': 'Final del degradado',
  'gradient_angle': 'Ángulo del degradado',
  'two_tone_corners': 'Esquinas de dos tonos',
  'two_tone_corners_hint': 'Da a las tres esquinas de posición su propio color.',
  'corner_colour': 'Color de las esquinas',
  'hex_value_aria': 'Valor hexadecimal de {label}',
  'logo_title': 'Logotipo y marca',
  'logo_drop_label': 'Suelta aquí un logotipo o haz clic para elegir uno',
  'logo_not_image': 'Elige un archivo de imagen (PNG, JPG o SVG).',
  'logo_preview_alt': 'Vista previa del logotipo',
  'logo_added': 'Logotipo personalizado añadido',
  'logo_replace': 'Sustituir',
  'logo_size': 'Tamaño del logotipo',
  'logo_padding': 'Margen del logotipo',
  'clear_behind_logo': 'Despejar los módulos tras el logotipo',

  // Preview
  'enlarge_aria': 'Ampliar el código QR para escanearlo',
  'qr_code_for': 'Código QR para {name}',
  'nothing_yet': 'Aún no hay nada.',
  'enter_to_generate': 'Introduce una URL o un texto para generar tu código QR.',
  'tap_to_enlarge': 'Toca para ampliar',
  'tap_code_to_enlarge': 'Toca el código para ampliarlo',

  // Pinned preview (phone)
  'hide_pinned': 'Ocultar la vista previa fijada',
  'show_preview': 'Mostrar la vista previa del QR',

  // Enlarged code
  'enlarged_aria': 'Código QR ampliado para {name}',
  'click_to_dismiss': 'Haz clic para cerrar',
  'point_camera': 'Apunta la cámara de otro móvil a este código',
  'scan_trouble': '¿No funciona? Sube el brillo de la pantalla al máximo y asegúrate de que la cámara no está en modo macro: aléjala un poco para que el código entero quepa en el encuadre.',
  'press_to_save': 'En un móvil, mantén pulsado el código para guardarlo o compartirlo como imagen.',

  // Regenerate style
  'regenerate': 'Cambiar de estilo',
  'regenerate_title': 'Elegir un estilo al azar',
  'regenerate_title_from': '{preset}: elegir otro estilo al azar',

  // Link test (under the address box)
  'test_link': 'Probar enlace',
  'no_scheme': 'No lleva {https} delante: algunos escáneres lo abrirán y otros lo leerán como texto plano.',
  'add_https': 'Añadir https://',
  'insecure': 'Una dirección {http}. Se abrirá, pero los móviles la marcan como «No es seguro», y desde esta página no se puede comprobar.',
  'checking': 'Comprobando la dirección…',
  'responds': 'La dirección responde',
  'responds_title': 'Algo ha respondido en esa dirección. No distingue una página real de un error 404: ábrela para asegurarte.',
  'offline': 'Sin conexión: no comprobada',
  'timeout': 'Aún sin respuesta: quizá solo va lenta',
  'unreachable': 'No se ha podido acceder desde este navegador',
  'not_proof_title': 'No demuestra que el enlace esté roto: algunos sitios rechazan este tipo de comprobación. Ábrelo en una pestaña para asegurarte.',

  // Barcode preview
  'barcode_enter': 'Introduce un valor para ver la vista previa del código de barras.',
  'barcode_fix': 'Corrige el valor de arriba para ver la vista previa del código de barras.',
  'barcode_cant_encode': 'Ese valor no se puede codificar.',

  // Save to this device
  'save_title': 'Guarda tu diseño',
  'no_account': 'Sin cuenta',
  'save_body': 'Conserva este código QR en este dispositivo y vuelve a abrirlo cuando quieras: gratis y sin iniciar sesión. Se queda en tu navegador y nunca sale de él.',
  'saved': '✓ Guardado en este dispositivo',
  'saving': 'Guardando…',
  'enter_url_to_save': 'Introduce una URL para guardar',
  'save_to_device': 'Guardar en este dispositivo',
  'save_failed': 'Lo sentimos, no se ha podido guardar: {message}',
  'untitled_design': 'Código QR',
  'open': 'Abrir',
  'remove_design_aria': 'Quitar {name}',
  'remove_saved_design_aria': 'Quitar el diseño guardado',
}

export default studio
