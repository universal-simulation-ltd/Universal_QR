import type { Messages } from '../en'

const scan: Messages['scan'] = {
  // Heading
  'headline': 'Scanner un {em}',
  'headline_em': 'QR code ou un code-barres',
  'intro': 'Pointez votre appareil photo vers n’importe quel QR code ou code-barres 1D (EAN, UPC, Code 128, Code 39…). Le décodage se fait sur votre appareil — l’image de l’appareil photo ne le quitte jamais.',

  // Over the viewfinder while the camera is not running
  'status_waiting': 'En attente de l’accès à l’appareil photo…',
  'status_scan_another': 'Scannez un autre code quand vous le souhaitez.',
  'status_camera_off': 'L’appareil photo est désactivé.',
  'button_starting': 'Démarrage de l’appareil photo…',
  'button_scan_again': 'Scanner à nouveau',
  'button_start': 'Lancer le scan',
  'button_stop': 'Arrêter',

  // Camera errors, shown over the viewfinder
  'error_no_camera': 'Aucun appareil photo n’a été détecté sur cet appareil.',
  'error_camera_start': 'L’appareil photo n’a pas pu démarrer. Fermez toute autre application qui l’utilise, puis réessayez.',

  // Ask-on-open checkbox — only shown while camera access has not been answered
  'ask_on_open': 'Demander l’accès à l’appareil photo à l’ouverture de Scanner',

  // Result card
  'format_unknown': 'Inconnu',
  'copy': 'Copier',
  'copied': '✓ Copié',
  'open_link': 'Ouvrir le lien ↗',
  'open_link_anyway': 'Ouvrir quand même ↗',
  'goes_to': 'Mène à',
  'warn_insecure': 'Non chiffré (http://) : toute personne sur le même réseau peut voir ou modifier la page.',
  'warn_lookalike': 'Cette adresse utilise des lettres d’un autre alphabet, qui peuvent imiter un nom familier. Votre navigateur l’affichera sous la forme {host}.',
  'warn_credentials': 'La partie avant « @ » n’est pas la destination de ce lien. Il ouvre en réalité {host}.',
  'warn_ip': 'Il pointe vers un numéro (une adresse IP) au lieu d’un site nommé.',
  'warn_shortener': 'C’est un lien raccourci : vous ne pouvez pas voir où il mène avant de l’ouvrir.',
  'blocked': 'Ce code contient une adresse « {scheme}: », qui pourrait exécuter du code ou ouvrir des fichiers sur votre appareil. Universal QR ne l’ouvrira pas.',
  'wifi_network': 'Réseau Wi-Fi',
  'wifi_password': 'Mot de passe',
  'wifi_open': 'Aucun mot de passe (réseau ouvert)',
  'wifi_join_hint': 'Pour vous connecter, ouvrez vos réglages Wi-Fi, choisissez ce réseau et collez le mot de passe.',
  'copy_password': 'Copier le mot de passe',
  'call': 'Appeler le {number}',
  'write_email': 'Écrire à {address}',
  'send_text': 'Envoyer un SMS au {number}',
  'scan_image': 'Scanner une image',
  'reading_image': 'Lecture de l’image…',
  'image_no_code': 'Aucun QR code ni code-barres n’a été trouvé dans cette image. Essayez une photo plus nette, prise de plus près.',

  // Camera permission help (lib/cameraAccess.ts)
  'blocked_ios': 'L’accès à l’appareil photo est désactivé pour Universal QR. Activez-le dans Réglages ▸ Universal QR ▸ Appareil photo, puis revenez à cet onglet.',
  'blocked_android': 'L’accès à l’appareil photo est désactivé pour Universal QR. Activez-le dans Paramètres ▸ Applications ▸ Universal QR ▸ Autorisations ▸ Appareil photo, puis revenez à cet onglet.',
  'blocked_browser': 'L’accès à l’appareil photo est bloqué pour ce site. Autorisez-le depuis l’icône d’appareil photo dans la barre d’adresse de votre navigateur, puis réessayez.',
  'remembered_native': 'Votre appareil mémorise la réponse : la question ne vous est posée qu’une seule fois.',
  'remembered_browser': 'Votre navigateur mémorise l’autorisation d’accès à l’appareil photo pour ce site.',
  'granted_native': 'L’accès à l’appareil photo est autorisé sur cet appareil — Scanner s’ouvre directement sur le viseur.',
  'granted_browser': 'L’accès à l’appareil photo est autorisé pour ce site — Scanner s’ouvre directement sur le viseur.',
}

export default scan
