import type { Messages } from '../en'

const controls: Messages['controls'] = {
  // ── Name section (Advanced) ────────────────────────────────────────────
  name_title: 'Name',
  name_desc: 'Wird in deinen Online-Sicherungen bei diesem Code angezeigt.',
  name_label: 'Name',
  name_placeholder: 'Mein QR-Code',

  // ── Style presets ──────────────────────────────────────────────────────
  presets_title: 'Stilvorlagen',
  presets_desc: 'Ein Ausgangspunkt – passe unten alles nach Belieben an.',
  // Preset names, on chips — keep short, one word
  preset_classic: 'Klassisch',
  preset_rounded: 'Rund',
  preset_dots: 'Punkte',
  preset_sunset: 'Abendrot',
  preset_radial: 'Radial',
  preset_star: 'Stern',

  // ── Colours ────────────────────────────────────────────────────────────
  colours_title: 'Farben',
  colour_modules: 'Module',
  colour_background: 'Hintergrund',
  colour_hex_aria: 'Hexwert für {label}',
  transparent_background: 'Transparenter Hintergrund',
  transparent_background_hint: 'PNG/SVG ohne Hintergrundfüllung exportieren.',
  gradient_modules: 'Module mit Verlauf',
  gradient_end: 'Verlaufsende',
  gradient_angle: 'Verlaufswinkel',
  two_tone_corners: 'Zweifarbige Ecken',
  two_tone_corners_hint: 'Gib den drei Eckmarken eine eigene Farbe.',
  corner_colour: 'Eckfarbe',

  // Contrast warnings (amber box under the colours)
  contrast_inverted_background_title: 'Helle Module auf dunklem Hintergrund.',
  contrast_inverted_background_body:
    'Der QR-Standard sieht es umgekehrt vor, und strenge Lesegeräte lehnen einen invertierten Code rundweg ab – der Tab „Scannen“ dieser App gehört dazu. Die meisten Handykameras kommen damit zurecht, aber tausche die beiden Farben, wenn der Code überall funktionieren muss.',
  contrast_inverted_star_title: 'Helle Module auf dunklem Stern.',
  contrast_inverted_star_body:
    'Der QR-Standard sieht es umgekehrt vor, und strenge Lesegeräte lehnen einen invertierten Code rundweg ab – der Tab „Scannen“ dieser App gehört dazu. Die meisten Handykameras kommen damit zurecht, aber mach die Module dunkler oder den Stern dahinter heller, wenn der Code überall funktionieren muss.',
  contrast_low_star_title: 'Wenig Kontrast zwischen den Modulen und dem Stern dahinter.',
  contrast_low_star_body:
    '{ratio}:1, wo ein Lesegerät mindestens {min}:1 erwartet. Der Stern liegt unter dem größten Teil des Codes und ist für einen Scanner daher der Hintergrund – egal wie hell die Seite drumherum ist. Mach den Stern heller oder die Module dunkler.',
  contrast_low_modules_title: 'Wenig Kontrast zwischen den Modulen und dem Hintergrund.',
  contrast_low_modules_body:
    '{ratio}:1, wo ein Lesegerät mindestens {min}:1 erwartet. So knappe Codes lassen sich oft auf dem Bildschirm scannen, versagen dann aber gedruckt oder aus der Entfernung. Mach die Modulfarbe dunkler oder den Hintergrund heller.',
  contrast_low_corners_title: 'Wenig Kontrast zwischen den Ecken und dem Hintergrund.',
  contrast_low_corners_body:
    '{ratio}:1, wo ein Lesegerät mindestens {min}:1 erwartet. Ein Scanner sucht zuerst die drei Eckquadrate, bevor er irgendetwas anderes liest – zu wenig Kontrast ist hier also am riskantesten. Mach die Eckfarbe dunkler oder den Hintergrund heller.',

  // ── Shape & size ───────────────────────────────────────────────────────
  shape_title: 'Form & Größe',
  shape_desc: 'Umriss des Codes, Rundung der Module, Gestaltung der Ecken und Abmessungen.',
  code_shape: 'Codeform',
  // Shape buttons — keep short, one word (a grid of six)
  shape_square: 'Quadrat',
  shape_rounded: 'Abgerundet',
  shape_circle: 'Kreis',
  shape_squircle: 'Squircle',
  shape_hexagon: 'Sechseck',
  shape_star: 'Stern',
  star_placement: 'Sternposition',
  star_placement_inside: 'Im Stern',
  star_placement_behind: 'Stern dahinter',
  star_colour: 'Sternfarbe',
  star_behind_desc:
    'Der Stern liegt als Hintergrund hinter dem Code, und seine Zacken ragen rundherum hervor – der Look des QR-Sterns in Universal PDF. Der Code wird über den Stern gezeichnet, statt zwischen seine Zacken gequetscht zu werden. Er ist daher etwa anderthalbmal so groß wie dasselbe Design mit „Im Stern“ und entsprechend leichter zu scannen. In dieser Anordnung gibt es keinen Ring, den eine Verzierung füllen könnte, daher wird sie nicht angeboten.',
  star_inside_desc:
    'Der Code sitzt im Stern und überschreitet nie seine Kanten. So bleibt der Stern ganz, allerdings auf Kosten eines viel kleineren Codes – die fünf Kerben schneiden in jede Seite des Quadrats, das hineinpasst.',
  decoration: 'Verzierung',
  // Decoration buttons — keep short, one word
  decor_none: 'Keine',
  decor_burst: 'Strahlen',
  decor_scatter: 'Streuung',
  decoration_matches: 'Verzierung in Modulfarbe',
  decoration_matches_hint: 'Schalte es aus, um der Verzierung eine eigene Farbe zu geben.',
  decoration_colour: 'Farbe der Verzierung',
  decoration_on_note:
    'Die Verzierung füllt den Raum, den die Form um den Code lässt – und braucht diesen Raum, daher wird der Code kleiner gezeichnet. Exportiere größer als sonst und teste das Scannen vor dem Druck. Sie liegt außerhalb des Codes, ihre Farbe ist also frei wählbar – es gibt keine Kontrastregel zu beachten.',
  decoration_off_note:
    'Füllt den Raum, den eine geformte Grundfläche um den Code lässt. Wählst du eine aus, wird ein quadratischer Code zum Kreis, da eine quadratische Grundfläche keinen Raum zum Füllen hat.',
  // How much of the image the code fills on a shaped plate
  frame_note_rounded: 'Der Code füllt {pct} % des {size} px großen Bildes ({inner} px) – der Rest ist das abgerundete Quadrat um ihn herum.',
  frame_note_circle: 'Der Code füllt {pct} % des {size} px großen Bildes ({inner} px) – der Rest ist der Kreis um ihn herum.',
  frame_note_squircle: 'Der Code füllt {pct} % des {size} px großen Bildes ({inner} px) – der Rest ist die Squircle-Form um ihn herum.',
  frame_note_hexagon: 'Der Code füllt {pct} % des {size} px großen Bildes ({inner} px) – der Rest ist das Sechseck um ihn herum.',
  frame_note_star: 'Der Code füllt {pct} % des {size} px großen Bildes ({inner} px) – der Rest ist der Stern um ihn herum.',
  frame_note_star_behind: 'Der Code füllt {pct} % des {size} px großen Bildes ({inner} px) – die Zacken des Sterns ragen um ihn herum hervor.',
  frame_note_never_trimmed: 'Der Code wird nie auf die Form zugeschnitten – dann ließe er sich nicht mehr scannen.',
  module_style: 'Modulstil',
  // Module-shape buttons — keep short (a grid of six)
  dot_square: 'Quadrat',
  dot_rounded: 'Abgerundet',
  dot_extra_rounded: 'Extra rund',
  dot_dots: 'Punkte',
  dot_classy: 'Elegant',
  dot_classy_rounded: 'Elegant rund',
  corner_frame: 'Eckrahmen',
  corner_frame_square: 'Quadrat',
  corner_frame_rounded: 'Abgerundet',
  corner_frame_dot: 'Punkt',
  corner_dot: 'Eckpunkt',
  corner_dot_square: 'Quadrat',
  corner_dot_dot: 'Punkt',
  size: 'Größe',
  quiet_zone: 'Ruhezone (Rand)',

  // ── Logo & branding ────────────────────────────────────────────────────
  logo_title: 'Logo & Branding',
  logo_desc: 'Platziere dein Markenzeichen in der Mitte.',
  logo_drop_label: 'Logo hier ablegen oder klicken, um eines auszuwählen',
  logo_not_image: 'Bitte wähle eine Bilddatei aus (PNG, JPG oder SVG).',
  logo_preview_alt: 'Vorschau des Logos',
  logo_added: 'Eigenes Logo hinzugefügt',
  logo_replace: 'Ersetzen',
  logo_remove: 'Entfernen',
  logo_pick_touch: 'Tippe, um ein Logo auszuwählen (PNG, JPG, SVG)',
  logo_pick_desktop: 'Logo hier ablegen oder klicken zum Auswählen (PNG, JPG, SVG)',
  logo_size: 'Logogröße',
  logo_padding: 'Abstand um das Logo',
  clear_behind_logo: 'Module hinter dem Logo entfernen',
  remove_unisim_mark: 'UNI·SIM-Zeichen entfernen',
  remove_unisim_mark_hint_logo: 'Entfernt das kleine UNI·SIM-Zeichen in der Ecke unten rechts.',
  remove_unisim_mark_hint: 'Entfernt das UNI·SIM-Zeichen aus der Mitte.',

  // ── "What's it for?" card ──────────────────────────────────────────────
  content_title: 'Wofür ist er?',
  // Kinds of code: chips (keep short, one word) AND the title on the preview card
  kind_link: 'Link',
  kind_wifi: 'Wi-Fi',
  kind_contact: 'Kontakt',
  kind_email: 'E-Mail',
  kind_phone: 'Telefon',
  kind_sms: 'SMS',
  kind_location: 'Ort',
  kind_event: 'Termin',
  kind_barcode: 'Barcode',
  kind_more: 'Mehr',
  more_kinds_aria: 'Weitere Code-Arten',

  // Content form fields
  optional: 'Optional',
  link_label: 'Webadresse oder Text',
  wifi_ssid: 'Netzwerkname (SSID)',
  wifi_ssid_placeholder: 'MeinWLAN',
  wifi_password: 'Passwort',
  wifi_password_placeholder: 'leer lassen, wenn offen',
  wifi_hidden: 'Verstecktes Netzwerk',
  email_to: 'An',
  email_subject: 'Betreff',
  email_message: 'Nachricht',
  phone_number: 'Telefonnummer',
  sms_message: 'Nachricht',
  sms_message_placeholder: 'Optionaler vorausgefüllter Text',
  contact_first_name: 'Vorname',
  contact_first_name_placeholder: 'Erika',
  contact_last_name: 'Nachname',
  contact_last_name_placeholder: 'Mustermann',
  contact_org: 'Organisation',
  contact_phone: 'Telefon',
  contact_email: 'E-Mail',
  contact_website: 'Website',
  geo_latitude: 'Breitengrad',
  geo_longitude: 'Längengrad',
  event_title: 'Titel',
  event_title_placeholder: 'Teambesprechung',
  event_location: 'Ort',
  event_starts: 'Beginn',
  event_ends: 'Ende',
  event_description: 'Beschreibung',

  // ── Barcode ────────────────────────────────────────────────────────────
  barcode_type: 'Barcode-Typ',
  barcode_value: 'Wert',
  barcode_value_aria: '{format}-Wert',
  barcode_static_note: 'Barcodes sind statisch und ungestaltet – keine Farben, kein Logo, keine Form.',
  // One-line hint under the field, per format
  barcode_hint_code128: 'Beliebiger Text oder Zahlen – der gängigste Allzweck-Barcode.',
  barcode_hint_ean13: '12 Ziffern (die 13. Ziffer, die Prüfziffer, wird ergänzt) oder alle 13 einfügen.',
  barcode_hint_upca: '11 Ziffern (Prüfziffer wird ergänzt) oder alle 12 einfügen.',
  barcode_hint_code39: 'Großbuchstaben A–Z, 0–9 und - . $ / + % oder Leerzeichen.',
  barcode_hint_itf14: 'Versandkarton-Code – 13 Ziffern (Prüfziffer wird ergänzt) oder alle 14.',
  // Validation errors, in red under the field
  barcode_error_code128: 'Gib bis zu {max} Zeichen ein.',
  barcode_error_ean13: 'EAN-13 braucht 12 oder 13 Ziffern.',
  barcode_error_upca: 'UPC-A braucht 11 oder 12 Ziffern.',
  barcode_error_code39: 'Nur Großbuchstaben A–Z, 0–9 und - . $ / + % verwenden.',
  barcode_error_itf14: 'ITF-14 braucht 13 oder 14 Ziffern.',

  // ── Branding controls (dynamic codes) ──────────────────────────────────
  brand_style: 'Stil',
  brand_use_org: 'wie Org.',
  brand_transparent: 'Transparent',
  brand_gradient: 'Verlauf',
  brand_gradient_end: 'Ende',
  brand_angle: 'Winkel',
  brand_corners: 'Ecken',
  brand_centre_logo: 'Logo in der Mitte',
  brand_logo_none_preview: 'keins',
  brand_org_icon: 'Org.-Logo',
  brand_upload: 'Hochladen…',
  brand_none: 'Keins',
}

export default controls
