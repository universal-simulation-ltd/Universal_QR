import type { Messages } from '../en'

const studio: Messages['studio'] = {
  // Shared
  'remove': 'Retirer',
  'close': 'Fermer',

  // Header
  'headline': 'Des QR codes qui {em}. Pour toujours.',
  'headline_em': 'marchent, tout simplement',
  'lead': 'Choisissez vos couleurs, façonnez les modules, ajoutez un logo — le rendu se fait en direct, sur votre appareil. Téléchargez en PNG, SVG, JPEG ou WebP.',

  // Mode switch + reset
  'mode_aria': 'Mode de l’éditeur',
  'mode_simple': 'Simple',
  'mode_branding': 'Marque',
  'mode_advanced': 'Avancé',
  'reset_all': 'Tout réinitialiser',

  // Export button + menu
  'save_or_share': 'Enregistrer ou partager',
  'download_png': 'Télécharger en PNG',
  'preparing': 'Préparation…',
  'more_export_aria': 'Plus d’options d’exportation',
  'more_options': 'Plus d’options',
  'download_as': 'Télécharger en',
  'copy_png': 'Copier le PNG dans le presse-papiers',
  'back_up_online': 'Enregistrer pour rouvrir plus tard',
  'copied': '✓ Copié dans le presse-papiers',
  'copy_unsupported': 'Copie non prise en charge — utilisez Télécharger',
  'scan_test_hint': 'Testez toujours le scan avant d’imprimer en petit format.',
  'export_failed': 'Désolé, l’exportation a échoué : {message}',
  'nothing_to_export': 'Rien à exporter pour l’instant.',
  'export_failed_reason': 'Échec de l’exportation',

  // Branding panel
  'presets_title': 'Styles prédéfinis',
  'presets_hint': 'Un point de départ — ajustez les couleurs et le logo ci-dessous.',
  'colours_title': 'Couleurs',
  'modules': 'Modules',
  'background': 'Fond',
  'transparent_background': 'Fond transparent',
  'transparent_background_hint': 'Exporte un PNG/SVG sans couleur de fond.',
  'gradient_modules': 'Modules en dégradé',
  'gradient_end': 'Fin du dégradé',
  'gradient_angle': 'Angle du dégradé',
  'two_tone_corners': 'Coins bicolores',
  'two_tone_corners_hint': 'Donne aux trois coins de repérage leur propre couleur.',
  'corner_colour': 'Couleur des coins',
  'hex_value_aria': '{label} : valeur hexadécimale',
  'logo_title': 'Logo et image de marque',
  'logo_drop_label': 'Déposez un logo ici, ou cliquez pour en choisir un',
  'logo_not_image': 'Veuillez choisir un fichier image (PNG, JPG ou SVG).',
  'logo_preview_alt': 'Aperçu du logo',
  'logo_added': 'Logo personnalisé ajouté',
  'logo_replace': 'Remplacer',
  'logo_size': 'Taille du logo',
  'logo_padding': 'Marge autour du logo',
  'clear_behind_logo': 'Effacer les modules derrière le logo',

  // Preview
  'enlarge_aria': 'Agrandir le QR code pour le scanner',
  'qr_code_for': 'QR code pour {name}',
  'nothing_yet': 'Rien à afficher pour l’instant.',
  'enter_to_generate': 'Saisissez une URL ou du texte pour générer votre QR code.',
  'tap_to_enlarge': 'Touchez pour agrandir',
  'tap_code_to_enlarge': 'Touchez le code pour l’agrandir',

  // Pinned preview (phone)
  'hide_pinned': 'Masquer l’aperçu épinglé',
  'show_preview': 'Afficher l’aperçu du QR code',

  // Enlarged code
  'enlarged_aria': 'QR code agrandi pour {name}',
  'click_to_dismiss': 'Cliquez pour fermer',
  'point_camera': 'Pointez l’appareil photo d’un autre téléphone vers ce code',
  'scan_trouble': 'Des difficultés ? Réglez la luminosité de l’écran au maximum et vérifiez que l’appareil photo n’est pas en mode gros plan (macro) — reculez un peu pour que tout le code soit dans le cadre.',
  'press_to_save': 'Sur un téléphone, appuyez longuement sur le code pour l’enregistrer ou le partager en tant qu’image.',

  // Regenerate style
  'regenerate': 'Changer de style',
  'regenerate_title': 'Choisir un style au hasard',
  'regenerate_title_from': '{preset} — choisir un autre style au hasard',

  // Link test (under the address box)
  'test_link': 'Tester le lien',
  'no_scheme': 'Pas de {https} au début — certains lecteurs ouvriront cette adresse, d’autres la liront comme du simple texte.',
  'add_https': 'Ajouter https://',
  'insecure': 'Une adresse en {http}. Elle s’ouvrira, mais les téléphones l’afficheront comme « Non sécurisé » — et elle ne peut pas être vérifiée depuis cette page.',
  'checking': 'Vérification de l’adresse…',
  'responds': 'L’adresse répond',
  'responds_title': 'Quelque chose a répondu à cette adresse. Impossible de distinguer une vraie page d’une erreur 404 — ouvrez-la pour vous en assurer.',
  'offline': 'Vous êtes hors ligne — non vérifié',
  'timeout': 'Pas encore de réponse — c’est peut-être juste lent',
  'unreachable': 'Injoignable depuis ce navigateur',
  'not_proof_title': 'Cela ne prouve pas que le lien est cassé — certains sites refusent ce type de vérification. Ouvrez-le dans un onglet pour vous en assurer.',

  // Barcode preview
  'barcode_enter': 'Saisissez une valeur pour prévisualiser votre code-barres.',
  'barcode_fix': 'Corrigez la valeur ci-dessus pour prévisualiser votre code-barres.',
  'barcode_cant_encode': 'Cette valeur ne peut pas être encodée.',

  // Save to this device
  'save_title': 'Enregistrer votre création',
  'no_account': 'Sans compte',
  'save_body': 'Conservez ce QR code sur cet appareil et rouvrez-le plus tard — gratuitement, sans connexion. Il reste dans votre navigateur et ne le quitte jamais.',
  'saved': '✓ Enregistré sur cet appareil',
  'saving': 'Enregistrement…',
  'enter_url_to_save': 'Saisissez une URL à enregistrer',
  'save_to_device': 'Enregistrer sur cet appareil',
  'save_failed': 'Désolé, l’enregistrement a échoué : {message}',
  'untitled_design': 'QR code',
  'open': 'Ouvrir',
  'remove_design_aria': 'Retirer {name}',
  'remove_saved_design_aria': 'Retirer la création enregistrée',
}

export default studio
