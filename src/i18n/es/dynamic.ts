import type { Messages } from '../en'

const dynamic: Messages['dynamic'] = {
  // Shared across this namespace
  'loading': 'Cargando…',
  'cancel': 'Cancelar',
  'delete': 'Eliminar',
  'saving': 'Guardando…',
  'need_more': '¿Necesitas más? Cuéntanoslo',
  'signin_button': 'Crear un Universal ID / iniciar sesión →',

  // Dynamic tab — header
  'title': 'Códigos QR dinámicos',
  'requires_universal_id': 'Requiere un Universal ID',
  'intro': 'Un único código impreso y un destino que puedes cambiar cuando quieras, además de un recuento de escaneos en directo. El enlace no cambia ({link}); tú decides a dónde lleva a la gente en cada momento.',

  // Dynamic tab — signed out
  'signin_title': 'Crea un Universal ID para hacer códigos QR dinámicos GRATIS.',
  'signin_body': 'Los códigos dinámicos se alojan vinculados a tu {id} para poder redirigir y registrar los escaneos. La pestaña {qr} normal sigue siendo 100 % gratuita y en tu dispositivo.',
  'signin_body_qr_tab': 'QR',

  // Dynamic tab — branding for new codes
  'branding_title': 'Marca de los códigos nuevos',
  'branding_hint_org': 'Se usan por defecto el icono y el color de tu organización. Cada código conserva el aspecto con el que se creó; para cambiar uno existente, usa Editar marca en su tarjeta.',
  'branding_hint_no_org': 'Cada código conserva el aspecto con el que se creó; para cambiar uno existente, usa Editar marca en su tarjeta. Añade un logotipo y un color de marca a tu organización y aparecerán aquí automáticamente.',
  'branding_reset': 'Restablecer',
  'branding_preview_caption': 'Ejemplo · unisim.co.uk',
  'branding_preview_label': 'Ejemplo de QR dinámico con tu marca',

  // Dynamic tab — create a code
  'new_code_title': 'Nuevo código dinámico',
  'purchased_tokens_one': '{count} token comprado',
  'purchased_tokens_other': '{count} tokens comprados',
  'signed_in_as': 'Sesión iniciada como {email}',
  'destination_label': 'URL de destino',
  'name_label': 'Etiqueta {optional}',
  'optional': '(opcional)',
  'name_placeholder': 'Folleto de la campaña de primavera',
  'creating': 'Creando…',
  'create': 'Crear código dinámico',
  'checking_account': 'Comprobando tu cuenta…',

  // Dynamic tab — reaching the limit
  'near_limit': 'Has usado {used} de tus {limit} códigos dinámicos gratuitos.',
  'at_limit': 'Has usado tus códigos dinámicos gratuitos.',
  'at_limit_make_room': 'Has usado tus códigos dinámicos gratuitos. Elimina uno para hacer sitio.',

  // Dynamic tab — errors
  'error_branding_too_large': 'Esa marca es demasiado grande para guardarla: prueba con un logotipo central más pequeño.',
  'error_no_org': 'Los códigos en línea se guardan con tu empresa, y tu Universal ID aún no tiene una. Crearla es gratis.',
  'setup_company_button': 'Crear una empresa →',
  'error_could_not_create': 'No se ha podido crear este código dinámico.',
  'error_could_not_delete': 'No se ha podido eliminar este código.',
  'confirm_delete': '¿Eliminar «{name}»? Quien lo escanee llegará a una página de «no activo».',

  // Dynamic tab — the list of codes
  'your_codes': 'Tus códigos dinámicos',
  'empty': 'Aún no hay códigos dinámicos. Crea el primero a la izquierda: podrás cambiar su destino y ver cómo llegan los escaneos.',

  // A dynamic code's card
  'tap_to_enlarge': 'Toca para ampliar',
  'enlarge_label': 'Ampliar el código QR para {target}',
  'qr_label': 'Código QR dinámico para {target}',
  'edit_branding': '✏️ Editar marca',
  'close_branding': 'Cerrar marca',
  'copy': 'Copiar',
  'copy_link_label': 'Copiar enlace dinámico',
  'delete_title': 'Eliminar este código',
  'redirects_to': 'Redirige a',
  'change_destination': 'Cambiar destino',
  'save_destination': 'Guardar destino',
  'destination_hint': 'El código impreso no cambia; solo cambia a dónde lleva a la gente.',
  'error_could_not_update_destination': 'No se ha podido actualizar el destino.',
  'total_scans': 'Escaneos totales',
  'last_scan': 'Último escaneo',
  'no_scans_yet': 'Aún no hay escaneos',
  'scans_chart_label': 'Escaneos de los últimos 30 días',
  'scans_one': '{count} escaneo',
  'scans_other': '{count} escaneos',

  // A dynamic code's card — editing its branding
  'brand_own_hint': 'La marca propia de este código. Al cambiarla, se vuelve a dibujar este código y ningún otro.',
  'brand_legacy_hint': 'Este código se creó antes de que cada código tuviera su propia marca, así que sigue el panel de arriba. Al guardar aquí, su aspecto queda fijado en este código.',
  'match_branding': 'Usar la marca de los códigos nuevos',
  'brand_preview_caption': 'Vista previa · {target}',
  'brand_preview_label': 'Vista previa de {name} con esta marca',
  'save_branding': 'Guardar marca',
  'brand_save_hint': 'El enlace y el recuento de escaneos no cambian, pero lo que ya esté impreso conserva el aspecto anterior, así que vuelve a descargarlo.',
  'error_could_not_save_branding': 'No se ha podido guardar la marca de este código.',
  'error_design_too_large': 'Ese diseño es demasiado grande para guardarlo: prueba con un logotipo central más pequeño.',

  // "Back up this QR code" dialog
  'backup_title': 'Hacer una copia de seguridad de este código QR',
  'backup_close': 'Cerrar',
  'backup_sign_in': 'Crea un {id} para hacer copias de seguridad de tus códigos QR en línea GRATIS.',
  'backup_backing_up': 'Haciendo copia de seguridad…',
  'backup_backed_up': '✓ Copia de seguridad hecha',
  'backup_back_up_online': 'Hacer copia de seguridad en línea de este QR',
  'backup_needs_data': 'Introduce una URL o un texto para hacer una copia de seguridad de tu código QR.',
  'backup_near_limit': 'Has usado {used} de tus {limit} copias de seguridad en línea gratuitas.',
  'backup_used_up': 'Has usado tus copias de seguridad en línea gratuitas. Elimina una abajo para hacer sitio.',
  'backup_your_backups': 'Tus copias de seguridad',
  'backup_none_yet': 'Aún no hay ninguna.',
  'backup_open': 'Abrir',
  'backup_delete_title': 'Eliminar esta copia de seguridad',
  'backup_missing': '{file} aparece aquí, pero no hay ningún archivo detrás: este guardado no llegó a terminar, así que nunca se almacenó nada. Tu espacio de guardado sigue reservado para él.',
  'backup_remove_entry': 'Quitar esta entrada y liberar el espacio',
  'backup_could_not_store': 'No se ha podido almacenar este código QR.',
  'backup_could_not_delete': 'No se ha podido eliminar este código QR.',
  'backup_could_not_save_now': 'No se ha podido guardar en este momento.',
  'backup_could_not_delete_now': 'No se ha podido eliminar esta copia de seguridad en este momento.',
}

export default dynamic
