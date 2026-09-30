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
  'ask_on_open': 'Chiedi l’accesso alla fotocamera quando apro Scansiona',

  // Result card
  'format_unknown': 'Sconosciuto',
  'copy': 'Copia',
  'copied': '✓ Copiato',
  'open_link': 'Apri link ↗',

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
