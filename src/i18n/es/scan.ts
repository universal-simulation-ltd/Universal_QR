import type { Messages } from '../en'

const scan: Messages['scan'] = {
  // Heading
  'headline': 'Escanea un {em}',
  'headline_em': 'código QR o de barras',
  'intro': 'Apunta la cámara a cualquier código QR o código de barras 1D (EAN, UPC, Code 128, Code 39…). La descodificación se hace en tu dispositivo: la imagen de la cámara nunca sale de él.',

  // Over the viewfinder while the camera is not running
  'status_waiting': 'Esperando el acceso a la cámara…',
  'status_scan_another': 'Escanea otro código cuando quieras.',
  'status_camera_off': 'La cámara está apagada.',
  'button_starting': 'Iniciando la cámara…',
  'button_scan_again': 'Escanear otra vez',
  'button_start': 'Empezar a escanear',
  'button_stop': 'Detener',

  // Camera errors, shown over the viewfinder
  'error_no_camera': 'No se ha encontrado ninguna cámara en este dispositivo.',
  'error_camera_start': 'No se ha podido iniciar la cámara. Cierra cualquier otra app que la esté usando y vuelve a intentarlo.',

  // Ask-on-open checkbox — only shown while camera access has not been answered
  'ask_on_open': 'Pedir acceso a la cámara al abrir Escanear',

  // Result card
  'format_unknown': 'Desconocido',
  'copy': 'Copiar',
  'copied': '✓ Copiado',
  'open_link': 'Abrir enlace ↗',
  'open_link_anyway': 'Abrir de todos modos ↗',
  'goes_to': 'Lleva a',
  'warn_insecure': 'Sin cifrar (http://): cualquiera en la misma red puede ver o cambiar la página.',
  'warn_lookalike': 'Esta dirección usa letras de otro alfabeto, que pueden imitar un nombre conocido. Tu navegador la mostrará como {host}.',
  'warn_credentials': 'La parte antes de «@» no es adonde lleva este enlace. En realidad abre {host}.',
  'warn_ip': 'Apunta a un número (una dirección IP) en lugar de a un sitio web con nombre.',
  'warn_shortener': 'Es un enlace acortado, así que no puedes ver adónde lleva hasta que lo abras.',
  'blocked': 'Este código contiene una dirección «{scheme}:», que podría ejecutar código o abrir archivos en tu dispositivo. Universal QR no la abrirá.',
  'wifi_network': 'Red Wi-Fi',
  'wifi_password': 'Contraseña',
  'wifi_open': 'Sin contraseña (red abierta)',
  'wifi_join_hint': 'Para conectarte, abre los ajustes de Wi-Fi, elige esta red y pega la contraseña.',
  'copy_password': 'Copiar contraseña',
  'call': 'Llamar al {number}',
  'write_email': 'Escribir a {address}',
  'send_text': 'Enviar SMS al {number}',
  'scan_image': 'Escanear una imagen',
  'reading_image': 'Leyendo la imagen…',
  'image_no_code': 'No se ha encontrado ningún código QR ni código de barras en esa imagen. Prueba con una foto más nítida y más cercana.',

  // Camera permission help (lib/cameraAccess.ts)
  'blocked_ios': 'El acceso a la cámara está desactivado para Universal QR. Actívalo en Ajustes ▸ Universal QR ▸ Cámara y vuelve a esta pestaña.',
  'blocked_android': 'El acceso a la cámara está desactivado para Universal QR. Actívalo en Ajustes ▸ Aplicaciones ▸ Universal QR ▸ Permisos ▸ Cámara y vuelve a esta pestaña.',
  'blocked_browser': 'El acceso a la cámara está bloqueado para este sitio. Permítelo desde el icono de la cámara de la barra de direcciones del navegador y vuelve a intentarlo.',
  'remembered_native': 'Tu dispositivo recuerda la respuesta, así que solo se te pregunta una vez.',
  'remembered_browser': 'Tu navegador recuerda el permiso de cámara de este sitio.',
  'granted_native': 'El acceso a la cámara está permitido en este dispositivo: Escanear se abre directamente en el visor.',
  'granted_browser': 'El acceso a la cámara está permitido para este sitio: Escanear se abre directamente en el visor.',
}

export default scan
