import type { Messages } from '../en'

const controls: Messages['controls'] = {
  // ── Name section (Advanced) ────────────────────────────────────────────
  name_title: 'Nom',
  name_desc: 'Affiché sur ce code dans vos sauvegardes en ligne.',
  name_label: 'Nom',
  name_placeholder: 'Mon QR code',

  // ── Style presets ──────────────────────────────────────────────────────
  presets_title: 'Styles prédéfinis',
  presets_desc: 'Un point de départ — ajustez ce que vous voulez ci-dessous.',
  // Preset names, on chips — keep short, one word
  preset_classic: 'Classique',
  preset_rounded: 'Arrondi',
  preset_dots: 'Points',
  preset_sunset: 'Crépuscule',
  preset_radial: 'Radial',
  preset_star: 'Étoile',

  // ── Colours ────────────────────────────────────────────────────────────
  colours_title: 'Couleurs',
  colour_modules: 'Modules',
  colour_background: 'Fond',
  colour_hex_aria: '{label} : valeur hexadécimale',
  transparent_background: 'Fond transparent',
  transparent_background_hint: 'Exporte un PNG/SVG sans couleur de fond.',
  gradient_modules: 'Modules en dégradé',
  gradient_end: 'Fin du dégradé',
  gradient_angle: 'Angle du dégradé',
  two_tone_corners: 'Coins bicolores',
  two_tone_corners_hint: 'Donne aux trois coins de repérage leur propre couleur.',
  corner_colour: 'Couleur des coins',

  // Contrast warnings (amber box under the colours)
  contrast_inverted_background_title: 'Modules clairs sur fond sombre.',
  contrast_inverted_background_body:
    'La norme QR prévoit l’inverse, et les lecteurs stricts refusent purement et simplement un code inversé — l’onglet Scanner de cette application en fait partie. La plupart des appareils photo de téléphone s’en accommodent, mais inversez les deux couleurs si le code doit fonctionner partout.',
  contrast_inverted_star_title: 'Modules clairs sur une étoile sombre.',
  contrast_inverted_star_body:
    'La norme QR prévoit l’inverse, et les lecteurs stricts refusent purement et simplement un code inversé — l’onglet Scanner de cette application en fait partie. La plupart des appareils photo de téléphone s’en accommodent, mais foncez les modules ou éclaircissez l’étoile derrière eux si le code doit fonctionner partout.',
  contrast_low_star_title: 'Contraste insuffisant entre les modules et l’étoile derrière eux.',
  contrast_low_star_body:
    '{ratio}:1, alors qu’un lecteur demande au moins {min}:1. L’étoile se trouve sous la majeure partie du code : pour un scanner, c’est donc un fond — aussi clair que soit la page autour. Éclaircissez l’étoile ou foncez les modules.',
  contrast_low_modules_title: 'Contraste insuffisant entre les modules et le fond.',
  contrast_low_modules_body:
    '{ratio}:1, alors qu’un lecteur demande au moins {min}:1. Des codes aussi peu contrastés se scannent souvent à l’écran, puis échouent une fois imprimés ou vus de loin. Foncez la couleur des modules ou éclaircissez le fond.',
  contrast_low_corners_title: 'Contraste insuffisant entre les coins et le fond.',
  contrast_low_corners_body:
    '{ratio}:1, alors qu’un lecteur demande au moins {min}:1. Un scanner repère les trois carrés des coins avant de lire quoi que ce soit d’autre : c’est donc là qu’un manque de contraste est le plus risqué. Foncez la couleur des coins ou éclaircissez le fond.',

  // ── Shape & size ───────────────────────────────────────────────────────
  shape_title: 'Forme et taille',
  shape_desc: 'Le contour du code, l’arrondi des modules, le style des coins et les dimensions.',
  code_shape: 'Forme du code',
  // Shape buttons — keep short, one word (a grid of six)
  shape_square: 'Carré',
  shape_rounded: 'Arrondi',
  shape_circle: 'Cercle',
  shape_squircle: 'Carré arrondi',
  shape_hexagon: 'Hexagone',
  shape_star: 'Étoile',
  star_placement: 'Position de l’étoile',
  star_placement_inside: 'Dans l’étoile',
  star_placement_behind: 'Étoile derrière',
  star_colour: 'Couleur de l’étoile',
  star_behind_desc:
    'L’étoile se place derrière le code comme une toile de fond, ses branches dépassant tout autour — le style de l’étoile QR d’Universal PDF. Le code est dessiné par-dessus l’étoile au lieu d’être comprimé entre ses branches : il est donc environ une fois et demie plus grand que le même design réglé sur Dans l’étoile, et d’autant plus facile à scanner. Dans cette disposition, la décoration n’a pas d’anneau à remplir : elle n’est donc pas proposée.',
  star_inside_desc:
    'Le code se place à l’intérieur de l’étoile, sans jamais dépasser de ses bords. L’étoile reste ainsi entière, au prix d’un code beaucoup plus petit — les cinq creux de l’étoile entament chaque côté du carré qui peut y tenir.',
  decoration: 'Décoration',
  // Decoration buttons — keep short, one word
  decor_none: 'Aucune',
  decor_burst: 'Rayonnante',
  decor_scatter: 'Éparpillée',
  decoration_matches: 'Décoration assortie aux modules',
  decoration_matches_hint: 'Désactivez pour donner à la décoration sa propre couleur.',
  decoration_colour: 'Couleur de la décoration',
  decoration_on_note:
    'La décoration remplit l’espace que la forme laisse autour du code — et elle a besoin de cet espace : le code est donc dessiné plus petit pour lui en faire. Exportez en plus grand que d’habitude et testez le scan avant d’imprimer. Elle se trouve en dehors du code : sa couleur est donc libre, aucune règle de contraste ne s’applique.',
  decoration_off_note:
    'Remplit l’espace qu’une forme laisse autour du code. En choisir une transforme un code carré en cercle, puisqu’une forme carrée ne laisse aucun espace à remplir.',
  // How much of the image the code fills on a shaped plate
  frame_note_rounded: 'Le code occupe {pct} % de l’image de {size} px ({inner} px) — le reste est le carré à coins arrondis qui l’entoure.',
  frame_note_circle: 'Le code occupe {pct} % de l’image de {size} px ({inner} px) — le reste est le cercle qui l’entoure.',
  frame_note_squircle: 'Le code occupe {pct} % de l’image de {size} px ({inner} px) — le reste est le carré arrondi qui l’entoure.',
  frame_note_hexagon: 'Le code occupe {pct} % de l’image de {size} px ({inner} px) — le reste est l’hexagone qui l’entoure.',
  frame_note_star: 'Le code occupe {pct} % de l’image de {size} px ({inner} px) — le reste est l’étoile qui l’entoure.',
  frame_note_star_behind: 'Le code occupe {pct} % de l’image de {size} px ({inner} px) — les branches de l’étoile dépassent tout autour.',
  frame_note_never_trimmed: 'Le code n’est jamais rogné pour épouser la forme — il ne pourrait plus être scanné.',
  module_style: 'Style des modules',
  // Module-shape buttons — keep short (a grid of six)
  dot_square: 'Carré',
  dot_rounded: 'Arrondi',
  dot_extra_rounded: 'Très arrondi',
  dot_dots: 'Points',
  dot_classy: 'Élégant',
  dot_classy_rounded: 'Élégant arrondi',
  corner_frame: 'Cadre des coins',
  corner_frame_square: 'Carré',
  corner_frame_rounded: 'Arrondi',
  corner_frame_dot: 'Point',
  corner_dot: 'Centre des coins',
  corner_dot_square: 'Carré',
  corner_dot_dot: 'Point',
  size: 'Taille',
  quiet_zone: 'Zone de silence',

  // ── Logo & branding ────────────────────────────────────────────────────
  logo_title: 'Logo et image de marque',
  logo_desc: 'Placez l’emblème de votre marque au centre.',
  logo_drop_label: 'Déposez un logo ici, ou cliquez pour en choisir un',
  logo_not_image: 'Veuillez choisir un fichier image (PNG, JPG ou SVG).',
  logo_preview_alt: 'Aperçu du logo',
  logo_added: 'Logo personnalisé ajouté',
  logo_replace: 'Remplacer',
  logo_remove: 'Retirer',
  logo_pick_touch: 'Touchez pour choisir un logo (PNG, JPG, SVG)',
  logo_pick_desktop: 'Déposez un logo ici, ou cliquez pour en choisir un (PNG, JPG, SVG)',
  logo_size: 'Taille du logo',
  logo_padding: 'Marge autour du logo',
  clear_behind_logo: 'Effacer les modules derrière le logo',
  remove_unisim_mark: 'Retirer la marque UNI·SIM',
  remove_unisim_mark_hint_logo: 'Retire le petit badge UNI·SIM dans le coin inférieur droit.',
  remove_unisim_mark_hint: 'Retire la marque UNI·SIM du centre.',

  // ── "What's it for?" card ──────────────────────────────────────────────
  content_title: 'À quoi sert-il ?',
  // Kinds of code: chips (keep short, one word) AND the title on the preview card
  kind_link: 'Lien',
  kind_wifi: 'Wi-Fi',
  kind_contact: 'Contact',
  kind_email: 'E-mail',
  kind_phone: 'Téléphone',
  kind_sms: 'SMS',
  kind_location: 'Lieu',
  kind_event: 'Événement',
  kind_barcode: 'Code-barres',
  kind_more: 'Plus',
  more_kinds_aria: 'Autres types de code',

  // Content form fields
  optional: 'Facultatif',
  link_label: 'Adresse du site ou texte',
  wifi_ssid: 'Nom du réseau (SSID)',
  wifi_ssid_placeholder: 'MonWiFi',
  wifi_password: 'Mot de passe',
  wifi_password_placeholder: 'laisser vide si le réseau est ouvert',
  wifi_hidden: 'Réseau masqué',
  email_to: 'À',
  email_subject: 'Objet',
  email_message: 'Message',
  phone_number: 'Numéro de téléphone',
  sms_message: 'Message',
  sms_message_placeholder: 'Texte prérempli (facultatif)',
  contact_first_name: 'Prénom',
  contact_first_name_placeholder: 'Marie',
  contact_last_name: 'Nom',
  contact_last_name_placeholder: 'Dupont',
  contact_org: 'Organisation',
  contact_phone: 'Téléphone',
  contact_email: 'E-mail',
  contact_website: 'Site web',
  geo_latitude: 'Latitude',
  geo_longitude: 'Longitude',
  event_title: 'Titre',
  event_title_placeholder: 'Réunion d’équipe',
  event_location: 'Lieu',
  event_starts: 'Début',
  event_ends: 'Fin',
  event_description: 'Description',

  // ── Barcode ────────────────────────────────────────────────────────────
  barcode_type: 'Type de code-barres',
  barcode_value: 'Valeur',
  barcode_value_aria: 'Valeur {format}',
  barcode_static_note: 'Les codes-barres sont statiques et sans style — ni couleurs, ni logo, ni forme.',
  // One-line hint under the field, per format
  barcode_hint_code128: 'Texte ou chiffres, au choix — le code-barres polyvalent le plus courant.',
  barcode_hint_ean13: '12 chiffres (le 13e, de contrôle, est ajouté pour vous), ou collez les 13.',
  barcode_hint_upca: '11 chiffres (chiffre de contrôle ajouté), ou collez les 12.',
  barcode_hint_code39: 'Majuscules A–Z, 0–9 et - . $ / + % ou espace.',
  barcode_hint_itf14: 'Code des cartons d’expédition — 13 chiffres (chiffre de contrôle ajouté) ou les 14.',
  // Validation errors, in red under the field
  barcode_error_code128: 'Saisissez {max} caractères au maximum.',
  barcode_error_ean13: 'EAN-13 : 12 ou 13 chiffres requis.',
  barcode_error_upca: 'UPC-A : 11 ou 12 chiffres requis.',
  barcode_error_code39: 'Utilisez uniquement les majuscules A–Z, 0–9 et - . $ / + %.',
  barcode_error_itf14: 'ITF-14 : 13 ou 14 chiffres requis.',

  // ── Branding controls (dynamic codes) ──────────────────────────────────
  brand_style: 'Style',
  brand_use_org: 'par défaut',
  brand_transparent: 'Transparent',
  brand_gradient: 'Dégradé',
  brand_gradient_end: 'Fin',
  brand_angle: 'Angle',
  brand_corners: 'Coins',
  brand_centre_logo: 'Logo central',
  brand_logo_none_preview: 'aucun',
  brand_org_icon: 'Icône org.',
  brand_upload: 'Choisir…',
  brand_none: 'Aucun',
}

export default controls
