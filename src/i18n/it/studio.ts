// src/i18n/it/studio.ts
import type { Messages } from '../en'

const studio: Messages['studio'] = {
  // Shared
  'remove': 'Rimuovi',
  'close': 'Chiudi',

  // Header
  'headline': 'Codici QR che {em}. Per sempre.',
  'headline_em': 'funzionano e basta',
  'lead': 'Scegli i colori, dai forma ai moduli, aggiungi un logo: l’anteprima si aggiorna in tempo reale, sul tuo dispositivo. Scarica in PNG, SVG, JPEG o WebP.',

  // Mode switch + reset
  'mode_aria': 'Modalità dell’editor',
  'mode_simple': 'Semplice',
  'mode_branding': 'Branding',
  'mode_advanced': 'Avanzate',
  'reset_all': 'Ripristina tutto',

  // Export button + menu
  'save_or_share': 'Salva o condividi',
  'download_png': 'Scarica PNG',
  'preparing': 'Preparazione…',
  'more_export_aria': 'Altre opzioni di esportazione',
  'more_options': 'Altre opzioni',
  'download_as': 'Scarica come',
  'copy_png': 'Copia PNG negli appunti',
  'back_up_online': 'Fai il backup online su unisim.co.uk',
  'copied': '✓ Copiato negli appunti',
  'copy_unsupported': 'Copia non supportata: usa Scarica',
  'scan_test_hint': 'Prima di stampare in piccolo, fai sempre una prova di scansione.',
  'export_failed': 'Purtroppo l’esportazione non è riuscita: {message}',
  'nothing_to_export': 'Non c’è ancora nulla da esportare.',
  'export_failed_reason': 'Esportazione non riuscita',

  // Branding panel
  'presets_title': 'Stili predefiniti',
  'presets_hint': 'Un punto di partenza: personalizza colori e logo qui sotto.',
  'colours_title': 'Colori',
  'modules': 'Moduli',
  'background': 'Sfondo',
  'transparent_background': 'Sfondo trasparente',
  'transparent_background_hint': 'Esporta un PNG/SVG senza riempimento dello sfondo.',
  'gradient_modules': 'Moduli sfumati',
  'gradient_end': 'Fine sfumatura',
  'gradient_angle': 'Angolo della sfumatura',
  'two_tone_corners': 'Angoli bicolore',
  'two_tone_corners_hint': 'Dai ai tre angoli di posizione un colore tutto loro.',
  'corner_colour': 'Colore degli angoli',
  'hex_value_aria': 'Valore esadecimale di {label}',
  'logo_title': 'Logo e branding',
  'logo_drop_label': 'Rilascia qui un logo o fai clic per sceglierne uno',
  'logo_not_image': 'Scegli un file immagine (PNG, JPG o SVG).',
  'logo_preview_alt': 'Anteprima del logo',
  'logo_added': 'Logo personalizzato aggiunto',
  'logo_replace': 'Sostituisci',
  'logo_size': 'Dimensione del logo',
  'logo_padding': 'Margine del logo',
  'clear_behind_logo': 'Libera i moduli dietro il logo',

  // Preview
  'enlarge_aria': 'Ingrandisci il codice QR per la scansione',
  'qr_code_for': 'Codice QR per {name}',
  'nothing_yet': 'Ancora niente da mostrare.',
  'enter_to_generate': 'Inserisci un URL o del testo per generare il tuo codice QR.',
  'tap_to_enlarge': 'Tocca per ingrandire',
  'tap_code_to_enlarge': 'Tocca il codice per ingrandirlo',

  // Pinned preview (phone)
  'hide_pinned': 'Nascondi l’anteprima fissata',
  'show_preview': 'Mostra l’anteprima del QR',

  // Enlarged code
  'enlarged_aria': 'Codice QR ingrandito per {name}',
  'click_to_dismiss': 'Fai clic per chiudere',
  'point_camera': 'Inquadra questo codice con la fotocamera di un altro telefono',
  'scan_trouble': 'Problemi? Porta la luminosità dello schermo al massimo e assicurati che la fotocamera non sia in modalità macro: allontanati un po’ in modo che l’intero codice sia inquadrato.',
  'press_to_save': 'Su un telefono, tieni premuto il codice per salvarlo o condividerlo come immagine.',

  // Regenerate style
  'regenerate': 'Cambia stile',
  'regenerate_title': 'Scegli uno stile a caso',
  'regenerate_title_from': '{preset}: scegli un altro stile a caso',

  // Link test (under the address box)
  'test_link': 'Prova il link',
  'no_scheme': 'Manca {https} all’inizio: alcuni scanner lo apriranno, altri lo leggeranno come semplice testo.',
  'add_https': 'Aggiungi https://',
  'insecure': 'Un indirizzo {http}. Si aprirà, ma i telefoni lo mostrano come «Non sicuro» e non è possibile verificarlo da questa pagina.',
  'checking': 'Verifica dell’indirizzo…',
  'responds': 'L’indirizzo risponde',
  'responds_title': 'A quell’indirizzo ha risposto qualcosa. Il controllo non distingue una pagina vera da un 404: aprilo per averne la certezza.',
  'offline': 'Sei offline: non verificato',
  'timeout': 'Ancora nessuna risposta: forse è solo lento',
  'unreachable': 'Non raggiungibile da questo browser',
  'not_proof_title': 'Non significa che il link non funzioni: alcuni siti rifiutano questo tipo di controllo. Aprilo in una scheda per averne la certezza.',

  // Barcode preview
  'barcode_enter': 'Inserisci un valore per vedere l’anteprima del codice a barre.',
  'barcode_fix': 'Correggi il valore qui sopra per vedere l’anteprima del codice a barre.',
  'barcode_cant_encode': 'Questo valore non può essere codificato.',

  // Save to this device
  'save_title': 'Salva il tuo progetto',
  'no_account': 'Senza account',
  'save_body': 'Conserva questo codice QR su questo dispositivo e riaprilo più tardi: è gratuito e non serve accedere. Resta nel tuo browser e non ne esce mai.',
  'saved': '✓ Salvato su questo dispositivo',
  'saving': 'Salvataggio…',
  'enter_url_to_save': 'Inserisci un URL per salvare',
  'save_to_device': 'Salva su questo dispositivo',
  'save_failed': 'Purtroppo non è stato possibile salvarlo: {message}',
  'untitled_design': 'Codice QR',
  'open': 'Apri',
  'remove_design_aria': 'Rimuovi {name}',
  'remove_saved_design_aria': 'Rimuovi il progetto salvato',
}

export default studio
