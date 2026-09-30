import type { Messages } from '../en'

const dynamic: Messages['dynamic'] = {
  // Shared across this namespace
  'loading': 'Chargement…',
  'cancel': 'Annuler',
  'delete': 'Supprimer',
  'saving': 'Enregistrement…',
  'get_more': 'En obtenir plus →',
  'signin_button': 'Créer un Universal ID / se connecter →',

  // Dynamic tab — header
  'title': 'QR codes dynamiques',
  'requires_universal_id': 'Nécessite un Universal ID',
  'intro': 'Un seul code imprimé, une destination modifiable à tout moment — et un compteur de scans en direct. Le lien reste fixe ({link}) ; c’est vous qui choisissez où il mène, quand vous le souhaitez.',

  // Dynamic tab — signed out
  'signin_title': 'Créez un Universal ID pour concevoir des QR codes dynamiques GRATUITEMENT.',
  'signin_body': 'Les codes dynamiques sont hébergés et associés à votre {id}, ce qui leur permet de rediriger et de comptabiliser les scans. L’onglet {qr} classique reste 100 % gratuit et sur votre appareil.',
  'signin_body_qr_tab': 'QR',

  // Dynamic tab — branding for new codes
  'branding_title': 'Image de marque des nouveaux codes',
  'branding_hint_org': 'Par défaut, l’icône et la couleur de votre organisation. Chaque code conserve l’apparence qu’il avait à sa création — pour en modifier un existant, utilisez Modifier l’image de marque sur sa carte.',
  'branding_hint_no_org': 'Chaque code conserve l’apparence qu’il avait à sa création — pour en modifier un existant, utilisez Modifier l’image de marque sur sa carte. Ajoutez un logo et une couleur de marque à votre organisation : ils s’afficheront ici automatiquement.',
  'branding_reset': 'Réinitialiser',
  'branding_preview_caption': 'Exemple · unisim.co.uk',
  'branding_preview_label': 'Exemple de QR code dynamique avec votre image de marque',

  // Dynamic tab — create a code
  'new_code_title': 'Nouveau code dynamique',
  'purchased_tokens_one': '{count} jeton acheté',
  'purchased_tokens_other': '{count} jetons achetés',
  'signed_in_as': 'Connecté en tant que {email}',
  'destination_label': 'URL de destination',
  'name_label': 'Libellé {optional}',
  'optional': '(facultatif)',
  'name_placeholder': 'Flyer campagne de printemps',
  'creating': 'Création…',
  'create': 'Créer un code dynamique',
  'checking_account': 'Vérification de votre compte…',

  // Dynamic tab — reaching the limit
  'near_limit': 'Vous avez utilisé {used} codes dynamiques gratuits sur {limit}.',
  'at_limit': 'Vous avez utilisé tous vos codes dynamiques gratuits.',
  'at_limit_make_room': 'Vous avez utilisé tous vos codes dynamiques gratuits. Supprimez-en un pour faire de la place, ou obtenez-en plus.',
  'at_limit_make_room_native': 'Vous avez utilisé tous vos codes dynamiques gratuits. Supprimez-en un pour faire de la place.',

  // Dynamic tab — errors
  'error_branding_too_large': 'Cette image de marque est trop volumineuse pour être enregistrée — essayez un logo central plus petit.',
  'error_no_org': 'Votre Universal ID n’a pas encore d’organisation — ouvrez une fois le hub UNI·SIM pour terminer la configuration.',
  'error_could_not_create': 'Impossible de créer ce code dynamique.',
  'error_could_not_delete': 'Impossible de supprimer ce code.',
  'confirm_delete': 'Supprimer « {name} » ? Toute personne qui le scannera tombera sur une page « non actif ».',

  // Dynamic tab — the list of codes
  'your_codes': 'Vos codes dynamiques',
  'empty': 'Aucun code dynamique pour l’instant. Créez le premier à gauche — vous pourrez changer sa destination et voir les scans arriver.',

  // A dynamic code's card
  'tap_to_enlarge': 'Touchez pour agrandir',
  'enlarge_label': 'Agrandir le QR code pour {target}',
  'qr_label': 'QR code dynamique pour {target}',
  'edit_branding': '✏️ Modifier l’image de marque',
  'close_branding': 'Fermer l’image de marque',
  'copy': 'Copier',
  'copy_link_label': 'Copier le lien dynamique',
  'delete_title': 'Supprimer ce code',
  'redirects_to': 'Redirige vers',
  'change_destination': 'Changer la destination',
  'save_destination': 'Enregistrer la destination',
  'destination_hint': 'Le code imprimé reste le même — seule sa destination change.',
  'error_could_not_update_destination': 'Impossible de mettre à jour la destination.',
  'total_scans': 'Scans au total',
  'last_scan': 'Dernier scan',
  'no_scans_yet': 'Aucun scan pour l’instant',
  'scans_chart_label': 'Scans des 30 derniers jours',
  'scans_one': '{count} scan',
  'scans_other': '{count} scans',

  // A dynamic code's card — editing its branding
  'brand_own_hint': 'L’image de marque propre à ce code. La modifier redessine ce code et rien d’autre.',
  'brand_legacy_hint': 'Ce code a été créé avant que chaque code ait sa propre image de marque : il suit donc encore le panneau ci-dessus. Enregistrer ici fixe l’apparence de ce code.',
  'match_branding': 'Reprendre l’image de marque des nouveaux codes',
  'brand_preview_caption': 'Aperçu · {target}',
  'brand_preview_label': 'Aperçu de {name} avec cette image de marque',
  'save_branding': 'Enregistrer l’image de marque',
  'brand_save_hint': 'Le lien et le nombre de scans ne changent pas — mais tout ce qui est déjà imprimé garde l’ancienne apparence : téléchargez-le à nouveau.',
  'error_could_not_save_branding': 'Impossible d’enregistrer l’image de marque de ce code.',
  'error_design_too_large': 'Cette création est trop volumineuse pour être enregistrée — essayez un logo central plus petit.',

  // "Back up this QR code" dialog
  'backup_title': 'Sauvegarder ce QR code',
  'backup_close': 'Fermer',
  'backup_sign_in': 'Créez un {id} pour sauvegarder vos QR codes en ligne GRATUITEMENT.',
  'backup_backing_up': 'Sauvegarde…',
  'backup_backed_up': '✓ Sauvegardé',
  'backup_back_up_online': 'Sauvegarder ce QR code en ligne',
  'backup_needs_data': 'Saisissez une URL ou du texte pour sauvegarder votre QR code.',
  'backup_near_limit': 'Vous avez utilisé {used} sauvegardes en ligne gratuites sur {limit}.',
  'backup_used_up': 'Vous avez utilisé toutes vos sauvegardes en ligne gratuites. Supprimez-en une ci-dessous pour faire de la place, ou obtenez-en plus.',
  'backup_used_up_native': 'Vous avez utilisé toutes vos sauvegardes en ligne gratuites. Supprimez-en une ci-dessous pour faire de la place.',
  'backup_your_backups': 'Vos sauvegardes',
  'backup_none_yet': 'Aucune pour l’instant.',
  'backup_open': 'Ouvrir',
  'backup_delete_title': 'Supprimer cette sauvegarde',
  'backup_missing': '{file} figure dans la liste, mais aucun fichier n’y correspond — cet enregistrement ne s’est jamais terminé, donc rien n’a été stocké. Votre emplacement de sauvegarde lui est toujours réservé.',
  'backup_remove_entry': 'Retirer cette entrée et libérer l’emplacement',
  'backup_could_not_store': 'Impossible de stocker ce QR code.',
  'backup_could_not_delete': 'Impossible de supprimer ce QR code.',
  'backup_could_not_save_now': 'Impossible d’enregistrer pour le moment.',
  'backup_could_not_delete_now': 'Impossible de supprimer cette sauvegarde pour le moment.',
}

export default dynamic
