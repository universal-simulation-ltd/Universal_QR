// src/i18n/it/dynamic.ts
import type { Messages } from '../en'

const dynamic: Messages['dynamic'] = {
  // Shared across this namespace
  'loading': 'Caricamento…',
  'cancel': 'Annulla',
  'delete': 'Elimina',
  'saving': 'Salvataggio…',
  'need_more': 'Ti serve di più? Faccelo sapere',
  'signin_button': 'Crea un Universal ID o accedi →',

  // Dynamic tab — header
  'title': 'Codici QR dinamici',
  'requires_universal_id': 'Richiede un Universal ID',
  'intro': 'Un solo codice stampato, una destinazione che puoi cambiare in qualsiasi momento e in più un conteggio delle scansioni in tempo reale. Il link resta fisso ({link}): sei tu a decidere dove indirizza le persone, quando vuoi.',

  // Dynamic tab — signed out
  'signin_title': 'Crea un Universal ID per realizzare codici QR dinamici GRATIS.',
  'signin_body': 'Un codice QR dinamico contiene un link breve che conserviamo per te con il tuo {id}: è così che puoi cambiare dove porta dopo averlo stampato e vedere quante volte viene scansionato. La normale scheda {qr} resta gratuita al 100% e sul tuo dispositivo.',
  'signin_body_qr_tab': 'QR',

  // Dynamic tab — branding for new codes
  'branding_title': 'Branding per i nuovi codici',
  'branding_hint_org': 'Di default usa l’icona e il colore della tua organizzazione. Ogni codice mantiene l’aspetto con cui è stato creato: per cambiarne uno esistente usa «Perfeziona branding» nel suo riquadro.',
  'branding_hint_no_org': 'Ogni codice mantiene l’aspetto con cui è stato creato: per cambiarne uno esistente usa «Perfeziona branding» nel suo riquadro. Aggiungi un logo e un colore del brand alla tua organizzazione e compariranno qui automaticamente.',
  'branding_reset': 'Ripristina',
  'branding_preview_caption': 'Esempio · unisim.co.uk',
  'branding_preview_label': 'Esempio di QR dinamico con il tuo branding',

  // Dynamic tab — create a code
  'new_code_title': 'Nuovo codice dinamico',
  'purchased_tokens_one': '{count} token acquistato',
  'purchased_tokens_other': '{count} token acquistati',
  'signed_in_as': 'Accesso effettuato come {email}',
  'destination_label': 'URL di destinazione',
  'name_label': 'Etichetta {optional}',
  'optional': '(facoltativa)',
  'name_placeholder': 'Volantino campagna di primavera',
  'creating': 'Creazione…',
  'create': 'Crea codice dinamico',
  'checking_account': 'Verifica del tuo account…',

  // Dynamic tab — reaching the limit
  'near_limit': 'Hai usato {used} dei tuoi {limit} codici dinamici gratuiti.',
  'at_limit': 'Hai usato tutti i tuoi codici dinamici gratuiti.',
  'at_limit_make_room': 'Hai usato tutti i tuoi codici dinamici gratuiti. Eliminane uno per fare spazio.',

  // Dynamic tab — errors
  'error_branding_too_large': 'Questo branding è troppo grande per essere salvato: prova un logo centrale più piccolo.',
  'error_no_org': 'I codici online vengono salvati con la tua azienda, e il tuo Universal ID non ne ha ancora una. Crearla è gratis.',
  'setup_company_button': 'Crea un’azienda →',
  'error_could_not_create': 'Impossibile creare questo codice dinamico.',
  'error_could_not_delete': 'Impossibile eliminare questo codice.',
  'confirm_delete': 'Eliminare «{name}»? Chi lo scansiona finirà su una pagina «non attivo».',

  // Dynamic tab — the list of codes
  'your_codes': 'I tuoi codici dinamici',
  'empty': 'Ancora nessun codice dinamico. Crea il primo qui a sinistra: potrai cambiarne la destinazione e veder arrivare le scansioni.',

  // A dynamic code's card
  'tap_to_enlarge': 'Tocca per ingrandire',
  'enlarge_label': 'Ingrandisci il codice QR per {target}',
  'qr_label': 'Codice QR dinamico per {target}',
  'edit_branding': '✏️ Perfeziona branding',
  'close_branding': 'Chiudi branding',
  'copy': 'Copia',
  'copy_link_label': 'Copia il link dinamico',
  'delete_title': 'Elimina questo codice',
  'redirects_to': 'Reindirizza a',
  'change_destination': 'Cambia destinazione',
  'save_destination': 'Salva destinazione',
  'destination_hint': 'Il codice stampato resta lo stesso: cambia solo dove indirizza le persone.',
  'error_could_not_update_destination': 'Impossibile aggiornare la destinazione.',
  'total_scans': 'Scansioni totali',
  'last_scan': 'Ultima scansione',
  'no_scans_yet': 'Ancora nessuna scansione',
  'scans_chart_label': 'Scansioni degli ultimi 30 giorni',
  'scans_one': '{count} scansione',
  'scans_other': '{count} scansioni',

  // A dynamic code's card — editing its branding
  'brand_own_hint': 'Il branding di questo codice. Se lo modifichi, cambia l’aspetto di questo codice e di nessun altro.',
  'brand_legacy_hint': 'Questo codice è stato creato prima che i codici avessero un branding proprio, quindi segue ancora il pannello qui sopra. Salvando qui, l’aspetto resta fissato su questo codice.',
  'match_branding': 'Usa il branding dei nuovi codici',
  'brand_preview_caption': 'Anteprima · {target}',
  'brand_preview_label': 'Anteprima di {name} con questo branding',
  'save_branding': 'Salva branding',
  'brand_save_hint': 'Il link e il conteggio delle scansioni non cambiano, ma ciò che è già stampato mantiene il vecchio aspetto: scaricalo di nuovo.',
  'error_could_not_save_branding': 'Impossibile salvare il branding di questo codice.',
  'error_design_too_large': 'Questo design è troppo grande per essere salvato: prova un logo centrale più piccolo.',

  // "Back up this QR code" dialog
  'backup_title': 'Salva questo codice QR',
  'backup_close': 'Chiudi',
  'backup_sign_in': 'Crea un {id} per fare il backup online dei tuoi codici QR GRATIS e riaprirli su qualsiasi dispositivo.',
  'backup_backing_up': 'Backup in corso…',
  'backup_backed_up': '✓ Backup eseguito',
  'backup_back_up_online': 'Fai il backup online di questo QR',
  'backup_needs_data': 'Inserisci un URL o del testo per fare il backup del tuo codice QR.',
  'backup_near_limit': 'Hai usato {used} dei tuoi {limit} backup online gratuiti.',
  'backup_used_up': 'Hai usato tutti i tuoi backup online gratuiti. Eliminane uno qui sotto per fare spazio.',
  'backup_your_backups': 'I tuoi backup',
  'backup_none_yet': 'Ancora nessuno.',
  'backup_open': 'Apri',
  'backup_delete_title': 'Elimina questo backup',
  'backup_missing': '{file} compare in questo elenco, ma non c’è nessun file associato: il salvataggio non è mai stato completato, quindi non è stato archiviato nulla. Lo spazio di salvataggio resta comunque riservato a questa voce.',
  'backup_remove_entry': 'Rimuovi questa voce e libera lo spazio',
  'backup_could_not_store': 'Impossibile archiviare questo codice QR.',
  'backup_could_not_delete': 'Impossibile eliminare questo codice QR.',
  'backup_could_not_save_now': 'Impossibile salvare in questo momento.',
  'backup_could_not_delete_now': 'Impossibile eliminare questo backup in questo momento.',
}

export default dynamic
