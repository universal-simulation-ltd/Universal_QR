// src/i18n/it/scan.ts
import type { Messages } from '../en'

const scan: Messages['scan'] = {
  // Heading
  'headline': 'Scansiona un {em}',
  'headline_em': 'codice QR o a barre',
  'intro': 'Inquadra con la fotocamera qualsiasi codice QR o codice a barre 1D (EAN, UPC, Code 128, Code 39…). La decodifica avviene sul tuo dispositivo: le immagini della fotocamera non ne escono mai.',

  // Over the viewfinder while the camera is not running
  'status_waiting': 'In attesa dell’accesso alla fotocamera…',
  'status_scan_another': 'Scansiona un altro codice quando vuoi.',
  'status_camera_off': 'La fotocamera è spenta.',
  'button_starting': 'Avvio fotocamera…',
  'button_scan_again': 'Nuova scansione',
  'button_start': 'Avvia scansione',
  'button_stop': 'Ferma',

  // Camera errors, shown over the viewfinder
  'error_no_camera': 'Nessuna fotocamera trovata su questo dispositivo.',
  'error_camera_start': 'Impossibile avviare la fotocamera. Chiudi le altre app che la stanno usando, poi riprova.',

  // Ask-on-open checkbox
  'dont_ask_on_open': 'Non chiedere l’accesso alla fotocamera quando apro Scansiona',

  // Result card
  'format_unknown': 'Sconosciuto',
  'copy': 'Copia',
  'copied': '✓ Copiato',
  'open_link': 'Apri link ↗',
  'open_link_anyway': 'Apri comunque ↗',
  'goes_to': 'Porta a',
  'warn_insecure': 'Non cifrato (http://): chiunque sia sulla stessa rete può vedere o modificare la pagina.',
  'warn_lookalike': 'Questo indirizzo usa lettere di un altro alfabeto, che possono imitare un nome familiare. Il browser lo mostrerà come {host}.',
  'warn_credentials': 'La parte prima di «@» non è la destinazione del link. In realtà apre {host}.',
  'warn_ip': 'Punta a un numero (un indirizzo IP) invece che a un sito con un nome.',
  'warn_shortener': 'È un link abbreviato: non puoi vedere dove porta finché non lo apri.',
  'blocked': 'Questo codice contiene un indirizzo «{scheme}:», che potrebbe eseguire codice o aprire file sul tuo dispositivo. Universal QR non lo aprirà.',
  'wifi_network': 'Rete Wi-Fi',
  'wifi_password': 'Password',
  'wifi_open': 'Nessuna password (rete aperta)',
  'wifi_join_hint': 'Per connetterti, apri le impostazioni Wi-Fi, scegli questa rete e incolla la password.',
  'copy_password': 'Copia password',
  'call': 'Chiama {number}',
  'write_email': 'Scrivi a {address}',
  'send_text': 'Invia SMS a {number}',
  'scan_image': 'Scansiona un’immagine',
  'reading_image': 'Lettura dell’immagine…',
  'image_no_code': 'In questa immagine non è stato trovato nessun codice QR o codice a barre. Prova con una foto più nitida e più da vicino.',

  // Camera permission help (lib/cameraAccess.ts)
  'blocked_ios': 'L’accesso alla fotocamera è disattivato per Universal QR. Attivalo in Impostazioni ▸ Universal QR ▸ Fotocamera, poi torna a questa scheda.',
  'blocked_android': 'L’accesso alla fotocamera è disattivato per Universal QR. Attivalo in Impostazioni ▸ App ▸ Universal QR ▸ Autorizzazioni ▸ Fotocamera, poi torna a questa scheda.',
  'blocked_browser': 'L’accesso alla fotocamera è bloccato per questo sito. Consentilo dall’icona della fotocamera nella barra degli indirizzi del browser, poi riprova.',
  'remembered_native': 'Il tuo dispositivo ricorda la risposta, quindi te lo chiede una sola volta.',
  'remembered_browser': 'Il tuo browser ricorda l’autorizzazione alla fotocamera per questo sito.',
  'granted_native': 'L’accesso alla fotocamera è consentito su questo dispositivo: Scansiona si apre direttamente sul mirino.',
  'granted_browser': 'L’accesso alla fotocamera è consentito per questo sito: Scansiona si apre direttamente sul mirino.',
}

export default scan
