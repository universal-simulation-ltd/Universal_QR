import type { Messages } from '../en'

const studio: Messages['studio'] = {
  // Shared
  'remove': 'Entfernen',
  'close': 'Schließen',

  // Header
  'headline': 'QR-Codes, die {em}. Für immer.',
  'headline_em': 'einfach funktionieren',
  'lead': 'Wähle deine Farben, forme die Module, füge ein Logo ein – alles entsteht live auf deinem Gerät. Lade den Code als PNG, SVG, JPEG oder WebP herunter.',

  // Mode switch + reset
  'mode_aria': 'Editormodus',
  'mode_simple': 'Einfach',
  'mode_branding': 'Branding',
  'mode_advanced': 'Erweitert',
  'reset_all': 'Alles zurücksetzen',

  // Export button + menu
  'save_or_share': 'Speichern oder teilen',
  'download_png': 'PNG herunterladen',
  'preparing': 'Wird erstellt…',
  'more_export_aria': 'Weitere Exportoptionen',
  'more_options': 'Weitere Optionen',
  'download_as': 'Herunterladen als',
  'copy_png': 'PNG in die Zwischenablage kopieren',
  'back_up_online': 'Zum späteren Öffnen speichern',
  'copied': '✓ In die Zwischenablage kopiert',
  'copy_unsupported': 'Kopieren nicht unterstützt – lade die Datei herunter',
  'scan_test_hint': 'Teste den Code immer per Scan, bevor du ihn klein druckst.',
  'export_failed': 'Der Export ist leider fehlgeschlagen: {message}',
  'nothing_to_export': 'Noch nichts zu exportieren.',
  'export_failed_reason': 'Export fehlgeschlagen',

  // Branding panel
  'presets_title': 'Stilvorlagen',
  'presets_hint': 'Ein Ausgangspunkt – passe Farben und Logo unten an.',
  'colours_title': 'Farben',
  'modules': 'Module',
  'background': 'Hintergrund',
  'transparent_background': 'Transparenter Hintergrund',
  'transparent_background_hint': 'PNG/SVG ohne Hintergrundfüllung exportieren.',
  'gradient_modules': 'Module mit Verlauf',
  'gradient_end': 'Verlaufsende',
  'gradient_angle': 'Verlaufswinkel',
  'two_tone_corners': 'Zweifarbige Ecken',
  'two_tone_corners_hint': 'Gib den drei Eckmarken eine eigene Farbe.',
  'corner_colour': 'Eckfarbe',
  'hex_value_aria': 'Hexwert für {label}',
  'logo_title': 'Logo & Branding',
  'logo_drop_label': 'Logo hier ablegen oder klicken, um eines auszuwählen',
  'logo_not_image': 'Bitte wähle eine Bilddatei aus (PNG, JPG oder SVG).',
  'logo_preview_alt': 'Vorschau des Logos',
  'logo_added': 'Eigenes Logo hinzugefügt',
  'logo_replace': 'Ersetzen',
  'logo_size': 'Logogröße',
  'logo_padding': 'Abstand um das Logo',
  'clear_behind_logo': 'Module hinter dem Logo entfernen',

  // Preview
  'enlarge_aria': 'QR-Code zum Scannen vergrößern',
  'qr_code_for': 'QR-Code für {name}',
  'nothing_yet': 'Noch nichts zu sehen.',
  'enter_to_generate': 'Gib eine URL oder Text ein, um deinen QR-Code zu erstellen.',
  'tap_to_enlarge': 'Zum Vergrößern tippen',
  'tap_code_to_enlarge': 'Zum Vergrößern Code antippen',

  // Pinned preview (phone)
  'hide_pinned': 'Angeheftete Vorschau ausblenden',
  'show_preview': 'QR-Vorschau anzeigen',

  // Enlarged code
  'enlarged_aria': 'Vergrößerter QR-Code für {name}',
  'click_to_dismiss': 'Zum Schließen klicken',
  'point_camera': 'Richte die Kamera eines anderen Handys auf diesen Code',
  'scan_trouble': 'Klappt es nicht? Stell die Bildschirmhelligkeit auf das Maximum und achte darauf, dass die Kamera nicht im Nahaufnahmemodus (Makro) ist – geh etwas zurück, damit der ganze Code im Bild ist.',
  'press_to_save': 'Halte auf dem Handy den Code gedrückt, um ihn als Bild zu speichern oder zu teilen.',

  // Regenerate style
  'regenerate': 'Stil neu würfeln',
  'regenerate_title': 'Zufällig einen Stil wählen',
  'regenerate_title_from': '{preset} – zufällig einen anderen Stil wählen',

  // Link test (under the address box)
  'test_link': 'Link testen',
  'no_scheme': 'Kein {https} am Anfang – manche Scanner öffnen das, andere lesen es als reinen Text.',
  'add_https': 'https:// hinzufügen',
  'insecure': 'Eine {http}-Adresse. Sie öffnet sich, aber Handys zeigen sie als „Nicht sicher“ an – und von dieser Seite aus lässt sie sich nicht prüfen.',
  'checking': 'Adresse wird geprüft…',
  'responds': 'Die Adresse antwortet',
  'responds_title': 'Unter dieser Adresse hat etwas geantwortet. Eine echte Seite lässt sich dabei nicht von einem 404-Fehler unterscheiden – öffne sie, um sicherzugehen.',
  'offline': 'Du bist offline – nicht geprüft',
  'timeout': 'Noch keine Antwort – vielleicht nur langsam',
  'unreachable': 'Von diesem Browser aus nicht erreichbar',
  'not_proof_title': 'Kein Beweis, dass der Link kaputt ist – manche Websites lehnen diese Art der Prüfung ab. Öffne ihn in einem Tab, um sicherzugehen.',

  // Barcode preview
  'barcode_enter': 'Gib einen Wert ein, um die Vorschau deines Barcodes zu sehen.',
  'barcode_fix': 'Korrigiere den Wert oben, um die Vorschau deines Barcodes zu sehen.',
  'barcode_cant_encode': 'Dieser Wert lässt sich nicht kodieren.',

  // Save to this device
  'save_title': 'Dein Design speichern',
  'no_account': 'Ohne Konto',
  'save_body': 'Behalte diesen QR-Code auf diesem Gerät und öffne ihn später wieder – kostenlos, ohne Anmeldung. Er bleibt in deinem Browser und verlässt ihn nie.',
  'saved': '✓ Auf diesem Gerät gespeichert',
  'saving': 'Wird gespeichert…',
  'enter_url_to_save': 'URL zum Speichern eingeben',
  'save_to_device': 'Auf diesem Gerät speichern',
  'save_failed': 'Das konnte leider nicht gespeichert werden: {message}',
  'untitled_design': 'QR-Code',
  'open': 'Öffnen',
  'remove_design_aria': '{name} entfernen',
  'remove_saved_design_aria': 'Gespeichertes Design entfernen',
}

export default studio
