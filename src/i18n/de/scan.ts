import type { Messages } from '../en'

const scan: Messages['scan'] = {
  // Heading
  'headline': 'Scanne einen {em}',
  'headline_em': 'QR-Code oder Barcode',
  'intro': 'Richte deine Kamera auf einen beliebigen QR-Code oder 1D-Barcode (EAN, UPC, Code 128, Code 39…). Die Auswertung erfolgt auf deinem Gerät – das Kamerabild verlässt es nie.',

  // Over the viewfinder while the camera is not running
  'status_waiting': 'Warte auf Kamerazugriff…',
  'status_scan_another': 'Scanne den nächsten Code, wenn du bereit bist.',
  'status_camera_off': 'Die Kamera ist aus.',
  'button_starting': 'Kamera startet…',
  'button_scan_again': 'Erneut scannen',
  'button_start': 'Scannen starten',
  'button_stop': 'Stopp',

  // Camera errors, shown over the viewfinder
  'error_no_camera': 'Auf diesem Gerät wurde keine Kamera gefunden.',
  'error_camera_start': 'Die Kamera konnte nicht gestartet werden. Schließe alle anderen Apps, die sie gerade verwenden, und versuche es erneut.',

  // Ask-on-open checkbox — only shown while camera access has not been answered
  'dont_ask_on_open': 'Beim Öffnen von „Scannen“ nicht nach Kamerazugriff fragen',

  // Result card
  'format_unknown': 'Unbekannt',
  'copy': 'Kopieren',
  'copied': '✓ Kopiert',
  'open_link': 'Link öffnen ↗',
  'open_link_anyway': 'Trotzdem öffnen ↗',
  'goes_to': 'Führt zu',
  'warn_insecure': 'Nicht verschlüsselt (http://): Jeder im selben Netzwerk kann die Seite sehen oder verändern.',
  'warn_lookalike': 'Diese Adresse enthält Buchstaben aus einem anderen Alphabet, die einen bekannten Namen nachahmen können. Dein Browser zeigt sie als {host} an.',
  'warn_credentials': 'Der Teil vor „@“ ist nicht das Ziel dieses Links. Tatsächlich öffnet er {host}.',
  'warn_ip': 'Er führt zu einer Nummer (einer IP-Adresse) statt zu einer benannten Website.',
  'warn_shortener': 'Das ist ein gekürzter Link – wohin er wirklich führt, siehst du erst nach dem Öffnen.',
  'blocked': 'Dieser Code enthält eine „{scheme}:“-Adresse, die Code ausführen oder Dateien auf deinem Gerät öffnen könnte. Universal QR öffnet sie nicht.',
  'wifi_network': 'Wi-Fi-Netzwerk',
  'wifi_password': 'Passwort',
  'wifi_open': 'Kein Passwort (offenes Netzwerk)',
  'wifi_join_hint': 'Öffne zum Verbinden deine Wi-Fi-Einstellungen, wähle dieses Netzwerk und füge das Passwort ein.',
  'copy_password': 'Passwort kopieren',
  'call': '{number} anrufen',
  'write_email': 'E-Mail an {address}',
  'send_text': 'SMS an {number}',
  'scan_image': 'Bild scannen',
  'reading_image': 'Bild wird gelesen…',
  'image_no_code': 'In diesem Bild wurde kein QR-Code oder Barcode gefunden. Versuche es mit einem schärferen Foto aus geringerer Entfernung.',

  // Camera permission help (lib/cameraAccess.ts)
  'blocked_ios': 'Der Kamerazugriff für Universal QR ist deaktiviert. Aktiviere ihn unter Einstellungen ▸ Universal QR ▸ Kamera und kehre dann zu diesem Tab zurück.',
  'blocked_android': 'Der Kamerazugriff für Universal QR ist deaktiviert. Aktiviere ihn unter Einstellungen ▸ Apps ▸ Universal QR ▸ Berechtigungen ▸ Kamera und kehre dann zu diesem Tab zurück.',
  'blocked_browser': 'Der Kamerazugriff ist für diese Website blockiert. Erlaube ihn über das Kamerasymbol in der Adressleiste deines Browsers und versuche es dann erneut.',
  'remembered_native': 'Dein Gerät merkt sich die Antwort, du wirst also nur einmal gefragt.',
  'remembered_browser': 'Dein Browser merkt sich die Kameraberechtigung dieser Website.',
  'granted_native': 'Der Kamerazugriff ist auf diesem Gerät erlaubt – „Scannen“ öffnet direkt den Sucher.',
  'granted_browser': 'Der Kamerazugriff ist für diese Website erlaubt – „Scannen“ öffnet direkt den Sucher.',
}

export default scan
