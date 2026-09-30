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
