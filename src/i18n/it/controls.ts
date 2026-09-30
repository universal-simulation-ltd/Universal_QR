// src/i18n/it/controls.ts
import type { Messages } from '../en'

const controls: Messages['controls'] = {
  // ── Name section (Advanced) ────────────────────────────────────────────
  name_title: 'Nome',
  name_desc: 'Compare su questo codice nei tuoi backup online.',
  name_label: 'Nome',
  name_placeholder: 'Il mio codice QR',

  // ── Style presets ──────────────────────────────────────────────────────
  presets_title: 'Stili predefiniti',
  presets_desc: 'Un punto di partenza: personalizza tutto qui sotto.',
  // Preset names, on chips — keep short, one word
  preset_classic: 'Classico',
  preset_rounded: 'Arrotondato',
  preset_dots: 'Punti',
  preset_sunset: 'Tramonto',
  preset_radial: 'Radiale',
  preset_star: 'Stella',

  // ── Colours ────────────────────────────────────────────────────────────
  colours_title: 'Colori',
  colour_modules: 'Moduli',
  colour_background: 'Sfondo',
  colour_hex_aria: 'Valore esadecimale di {label}',
  transparent_background: 'Sfondo trasparente',
  transparent_background_hint: 'Esporta un PNG/SVG senza riempimento dello sfondo.',
  gradient_modules: 'Moduli sfumati',
  gradient_end: 'Fine sfumatura',
  gradient_angle: 'Angolo della sfumatura',
  two_tone_corners: 'Angoli bicolore',
  two_tone_corners_hint: 'Dai ai tre angoli di posizione un colore tutto loro.',
  corner_colour: 'Colore degli angoli',

  // Contrast warnings (amber box under the colours)
  contrast_inverted_background_title: 'Moduli chiari su sfondo scuro.',
  contrast_inverted_background_body:
    'Lo standard QR prevede il contrario, e i lettori più rigorosi rifiutano del tutto un codice invertito: la scheda Scansiona di questa stessa app è uno di questi. La maggior parte delle fotocamere dei telefoni se la cava, ma inverti i due colori se il codice deve funzionare ovunque.',
  contrast_inverted_star_title: 'Moduli chiari su una stella scura.',
  contrast_inverted_star_body:
    'Lo standard QR prevede il contrario, e i lettori più rigorosi rifiutano del tutto un codice invertito: la scheda Scansiona di questa stessa app è uno di questi. La maggior parte delle fotocamere dei telefoni se la cava, ma scurisci i moduli o schiarisci la stella dietro di loro se il codice deve funzionare ovunque.',
  contrast_low_star_title: 'Poco contrasto tra i moduli e la stella dietro di loro.',
  contrast_low_star_body:
    '{ratio}:1, mentre un lettore richiede almeno {min}:1. La stella si trova sotto la maggior parte del codice, quindi per uno scanner è uno sfondo, per quanto chiara sia la pagina intorno. Schiarisci la stella o scurisci i moduli.',
  contrast_low_modules_title: 'Poco contrasto tra i moduli e lo sfondo.',
  contrast_low_modules_body:
    '{ratio}:1, mentre un lettore richiede almeno {min}:1. I codici con un contrasto così ridotto tendono a funzionare sullo schermo e poi a non essere letti una volta stampati o da lontano. Scurisci il colore dei moduli o schiarisci lo sfondo.',
  contrast_low_corners_title: 'Poco contrasto tra gli angoli e lo sfondo.',
  contrast_low_corners_body:
    '{ratio}:1, mentre un lettore richiede almeno {min}:1. Uno scanner individua i tre quadrati negli angoli prima di leggere qualsiasi altra cosa, quindi è il punto in cui un contrasto insufficiente è più rischioso. Scurisci il colore degli angoli o schiarisci lo sfondo.',

  // ── Shape & size ───────────────────────────────────────────────────────
  shape_title: 'Forma e dimensioni',
  shape_desc: 'Il contorno del codice, l’arrotondamento dei moduli, lo stile degli angoli e le dimensioni.',
  code_shape: 'Forma del codice',
  // Shape buttons — keep short, one word (a grid of six)
  shape_square: 'Quadrato',
  shape_rounded: 'Arrotondato',
  shape_circle: 'Cerchio',
  shape_squircle: 'Squircle',
  shape_hexagon: 'Esagono',
  shape_star: 'Stella',
  star_placement: 'Posizione della stella',
  star_placement_inside: 'Dentro la stella',
  star_placement_behind: 'Stella dietro',
  star_colour: 'Colore della stella',
  star_behind_desc:
    'La stella sta dietro il codice come sfondo, con le punte che spuntano tutto intorno: è l’aspetto del marchio a stella QR di Universal PDF. Il codice viene disegnato sopra la stella invece di essere compresso tra le sue punte, quindi è circa una volta e mezza più grande dello stesso design impostato su «Dentro la stella», e di conseguenza più facile da scansionare. In questa disposizione la decorazione non ha un anello da riempire, quindi non è disponibile.',
  star_inside_desc:
    'Il codice sta dentro la stella, senza mai superarne i bordi. Così la stella resta intera, a costo di un codice molto più piccolo: le cinque rientranze tra le punte stringono da ogni lato il quadrato che ci può stare.',
  decoration: 'Decorazione',
  // Decoration buttons — keep short, one word
  decor_none: 'Nessuna',
  decor_burst: 'Raggiera',
  decor_scatter: 'Sparsa',
  decoration_matches: 'Decorazione come i moduli',
  decoration_matches_hint: 'Disattiva per dare alla decorazione un colore tutto suo.',
  decoration_colour: 'Colore della decorazione',
  decoration_on_note:
    'La decorazione riempie lo spazio che la forma lascia intorno al codice, e ha bisogno di quello spazio, quindi il codice viene disegnato più piccolo per ricavarlo. Esporta a una dimensione maggiore del solito e fai una prova di scansione prima di stampare. Sta fuori dal codice, quindi puoi sceglierne liberamente il colore: non c’è nessuna regola di contrasto da rispettare.',
  decoration_off_note:
    'Riempie lo spazio che una sagoma lascia intorno al codice. Se ne scegli una, un codice quadrato diventa circolare, perché una sagoma quadrata non lascia spazio da riempire.',
  // How much of the image the code fills on a shaped plate
  frame_note_rounded: 'Il codice occupa il {pct}% dell’immagine di {size} px ({inner} px): il resto è il quadrato arrotondato che lo circonda.',
  frame_note_circle: 'Il codice occupa il {pct}% dell’immagine di {size} px ({inner} px): il resto è il cerchio che lo circonda.',
  frame_note_squircle: 'Il codice occupa il {pct}% dell’immagine di {size} px ({inner} px): il resto è lo squircle che lo circonda.',
  frame_note_hexagon: 'Il codice occupa il {pct}% dell’immagine di {size} px ({inner} px): il resto è l’esagono che lo circonda.',
  frame_note_star: 'Il codice occupa il {pct}% dell’immagine di {size} px ({inner} px): il resto è la stella che lo circonda.',
  frame_note_star_behind: 'Il codice occupa il {pct}% dell’immagine di {size} px ({inner} px): le punte della stella spuntano tutto intorno.',
  frame_note_never_trimmed: 'Il codice non viene mai ritagliato per adattarlo alla forma: smetterebbe di funzionare.',
  module_style: 'Stile dei moduli',
  // Module-shape buttons — keep short (a grid of six)
  dot_square: 'Quadrato',
  dot_rounded: 'Arrotondato',
  dot_extra_rounded: 'Extra arrotondato',
  dot_dots: 'Punti',
  dot_classy: 'Elegante',
  dot_classy_rounded: 'Elegante arrotondato',
  corner_frame: 'Cornice degli angoli',
  corner_frame_square: 'Quadrata',
  corner_frame_rounded: 'Arrotondata',
  corner_frame_dot: 'Punto',
  corner_dot: 'Centro degli angoli',
  corner_dot_square: 'Quadrato',
  corner_dot_dot: 'Punto',
  size: 'Dimensione',
  quiet_zone: 'Margine (zona di silenzio)',

  // ── Logo & branding ────────────────────────────────────────────────────
  logo_title: 'Logo e branding',
  logo_desc: 'Inserisci il tuo marchio al centro.',
  logo_drop_label: 'Rilascia qui un logo o fai clic per sceglierne uno',
  logo_not_image: 'Scegli un file immagine (PNG, JPG o SVG).',
  logo_preview_alt: 'Anteprima del logo',
  logo_added: 'Logo personalizzato aggiunto',
  logo_replace: 'Sostituisci',
  logo_remove: 'Rimuovi',
  logo_pick_touch: 'Tocca per scegliere un logo (PNG, JPG, SVG)',
  logo_pick_desktop: 'Rilascia qui un logo o fai clic per sceglierlo (PNG, JPG, SVG)',
  logo_size: 'Dimensione del logo',
  logo_padding: 'Margine del logo',
  clear_behind_logo: 'Libera i moduli dietro il logo',
  remove_unisim_mark: 'Rimuovi il marchio UNI·SIM',
  remove_unisim_mark_hint_logo: 'Toglie il piccolo badge UNI·SIM nell’angolo in basso a destra.',
  remove_unisim_mark_hint: 'Toglie il marchio UNI·SIM dal centro.',

  // ── "What's it for?" card ──────────────────────────────────────────────
  content_title: 'A cosa serve?',
  // Kinds of code: chips (keep short, one word) AND the title on the preview card
  kind_link: 'Link',
  kind_wifi: 'Wi-Fi',
  kind_contact: 'Contatto',
  kind_email: 'Email',
  kind_phone: 'Telefono',
  kind_sms: 'SMS',
  kind_location: 'Posizione',
  kind_event: 'Evento',
  kind_barcode: 'Codice a barre',
  kind_more: 'Altro',
  more_kinds_aria: 'Altri tipi di codice',

  // Content form fields
  optional: 'Facoltativo',
  link_label: 'Indirizzo del sito o testo',
  wifi_ssid: 'Nome della rete (SSID)',
  wifi_ssid_placeholder: 'WiFiCasa',
  wifi_password: 'Password',
  wifi_password_placeholder: 'lascia vuoto se è aperta',
  wifi_hidden: 'Rete nascosta',
  email_to: 'A',
  email_subject: 'Oggetto',
  email_message: 'Messaggio',
  phone_number: 'Numero di telefono',
  sms_message: 'Messaggio',
  sms_message_placeholder: 'Testo precompilato facoltativo',
  contact_first_name: 'Nome',
  contact_first_name_placeholder: 'Giulia',
  contact_last_name: 'Cognome',
  contact_last_name_placeholder: 'Rossi',
  contact_org: 'Organizzazione',
  contact_phone: 'Telefono',
  contact_email: 'Email',
  contact_website: 'Sito web',
  geo_latitude: 'Latitudine',
  geo_longitude: 'Longitudine',
  event_title: 'Titolo',
  event_title_placeholder: 'Riunione del team',
  event_location: 'Luogo',
  event_starts: 'Inizio',
  event_ends: 'Fine',
  event_description: 'Descrizione',

  // ── Barcode ────────────────────────────────────────────────────────────
  barcode_type: 'Tipo di codice a barre',
  barcode_value: 'Valore',
  barcode_value_aria: 'Valore {format}',
  barcode_static_note: 'I codici a barre sono statici e senza stile: niente colori, logo o forma.',
  // One-line hint under the field, per format
  barcode_hint_code128: 'Qualsiasi testo o numero: il codice a barre generico più diffuso.',
  barcode_hint_ean13: '12 cifre (la 13ª, di controllo, viene aggiunta per te), oppure incollale tutte e 13.',
  barcode_hint_upca: '11 cifre (cifra di controllo aggiunta), oppure incollale tutte e 12.',
  barcode_hint_code39: 'Lettere maiuscole A–Z, 0–9 e - . $ / + % o spazio.',
  barcode_hint_itf14: 'Codice per imballaggi di spedizione: 13 cifre (cifra di controllo aggiunta) o tutte e 14.',
  // Validation errors, in red under the field
  barcode_error_code128: 'Inserisci al massimo {max} caratteri.',
  barcode_error_ean13: 'EAN-13 richiede 12 o 13 cifre.',
  barcode_error_upca: 'UPC-A richiede 11 o 12 cifre.',
  barcode_error_code39: 'Usa solo lettere maiuscole A–Z, 0–9 e - . $ / + %.',
  barcode_error_itf14: 'ITF-14 richiede 13 o 14 cifre.',

  // ── Branding controls (dynamic codes) ──────────────────────────────────
  brand_style: 'Stile',
  brand_use_org: 'usa org.',
  brand_transparent: 'Trasparente',
  brand_gradient: 'Sfumatura',
  brand_gradient_end: 'Fine',
  brand_angle: 'Angolo',
  brand_corners: 'Angoli',
  brand_centre_logo: 'Logo al centro',
  brand_logo_none_preview: 'nessuno',
  brand_org_icon: 'Icona org.',
  brand_upload: 'Carica…',
  brand_none: 'Nessuno',
}

export default controls
