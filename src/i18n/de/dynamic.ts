import type { Messages } from '../en'

const dynamic: Messages['dynamic'] = {
  // Shared across this namespace
  'loading': 'Wird geladen…',
  'cancel': 'Abbrechen',
  'delete': 'Löschen',
  'saving': 'Wird gespeichert…',
  'need_more': 'Du brauchst mehr? Sag es uns',
  'signin_button': 'Universal ID erstellen / anmelden →',

  // Dynamic tab — header
  'title': 'Dynamische QR-Codes',
  'requires_universal_id': 'Erfordert eine Universal ID',
  'intro': 'Ein gedruckter Code, ein Ziel, das du jederzeit ändern kannst – dazu eine Live-Zählung der Scans. Der Link bleibt gleich ({link}); wohin er führt, legst du fest, wann immer du willst.',

  // Dynamic tab — signed out
  'signin_title': 'Leg dir eine Universal ID an und erstelle dynamische QR-Codes KOSTENLOS.',
  'signin_body': 'Dynamische Codes werden über deine {id} gehostet, damit sie weiterleiten und Scans erfassen können. Der normale Tab {qr} bleibt zu 100 % kostenlos und auf deinem Gerät.',
  'signin_body_qr_tab': 'QR',

  // Dynamic tab — branding for new codes
  'branding_title': 'Branding für neue Codes',
  'branding_hint_org': 'Standardmäßig mit dem Logo und der Farbe deiner Organisation. Jeder Code behält das Aussehen, mit dem er erstellt wurde – ändere einen bestehenden über „Branding bearbeiten“ auf seiner Karte.',
  'branding_hint_no_org': 'Jeder Code behält das Aussehen, mit dem er erstellt wurde – ändere einen bestehenden über „Branding bearbeiten“ auf seiner Karte. Füge deiner Organisation ein Logo und eine Markenfarbe hinzu, dann erscheinen sie hier automatisch.',
  'branding_reset': 'Zurücksetzen',
  'branding_preview_caption': 'Beispiel · unisim.co.uk',
  'branding_preview_label': 'Beispiel für einen dynamischen QR-Code mit deinem Branding',

  // Dynamic tab — create a code
  'new_code_title': 'Neuer dynamischer Code',
  'purchased_tokens_one': '{count} gekaufter Token',
  'purchased_tokens_other': '{count} gekaufte Tokens',
  'signed_in_as': 'Angemeldet als {email}',
  'destination_label': 'Ziel-URL',
  'name_label': 'Bezeichnung {optional}',
  'optional': '(optional)',
  'name_placeholder': 'Flyer Frühjahrsaktion',
  'creating': 'Wird erstellt…',
  'create': 'Dynamischen Code erstellen',
  'checking_account': 'Dein Konto wird geprüft…',

  // Dynamic tab — reaching the limit
  'near_limit': 'Du hast {used} von {limit} kostenlosen dynamischen Codes genutzt.',
  'at_limit': 'Du hast deine kostenlosen dynamischen Codes aufgebraucht.',
  'at_limit_make_room': 'Du hast deine kostenlosen dynamischen Codes aufgebraucht. Lösche einen, um Platz zu schaffen.',

  // Dynamic tab — errors
  'error_branding_too_large': 'Dieses Branding ist zu groß zum Speichern – versuch es mit einem kleineren Logo in der Mitte.',
  'error_no_org': 'Online-Codes werden bei deinem Unternehmen gespeichert, und deine Universal ID hat noch keins. Die Einrichtung ist kostenlos.',
  'setup_company_button': 'Unternehmen einrichten →',
  'error_could_not_create': 'Dieser dynamische Code konnte nicht erstellt werden.',
  'error_could_not_delete': 'Dieser Code konnte nicht gelöscht werden.',
  'confirm_delete': '„{name}“ löschen? Wer ihn danach scannt, landet auf einer „Nicht aktiv“-Seite.',

  // Dynamic tab — the list of codes
  'your_codes': 'Deine dynamischen Codes',
  'empty': 'Noch keine dynamischen Codes. Erstelle links deinen ersten – du kannst sein Ziel jederzeit ändern und zusehen, wie die Scans eintrudeln.',

  // A dynamic code's card
  'tap_to_enlarge': 'Zum Vergrößern tippen',
  'enlarge_label': 'QR-Code für {target} vergrößern',
  'qr_label': 'Dynamischer QR-Code für {target}',
  'edit_branding': '✏️ Branding bearbeiten',
  'close_branding': 'Branding schließen',
  'copy': 'Kopieren',
  'copy_link_label': 'Dynamischen Link kopieren',
  'delete_title': 'Diesen Code löschen',
  'redirects_to': 'Leitet weiter zu',
  'change_destination': 'Ziel ändern',
  'save_destination': 'Ziel speichern',
  'destination_hint': 'Der gedruckte Code bleibt gleich – nur das Ziel ändert sich.',
  'error_could_not_update_destination': 'Das Ziel konnte nicht aktualisiert werden.',
  'total_scans': 'Scans insgesamt',
  'last_scan': 'Letzter Scan',
  'no_scans_yet': 'Noch keine Scans',
  'scans_chart_label': 'Scans der letzten 30 Tage',
  'scans_one': '{count} Scan',
  'scans_other': '{count} Scans',

  // A dynamic code's card — editing its branding
  'brand_own_hint': 'Das eigene Branding dieses Codes. Eine Änderung zeichnet nur diesen Code neu, sonst nichts.',
  'brand_legacy_hint': 'Dieser Code wurde erstellt, bevor Codes ihr eigenes Branding hatten, deshalb folgt er noch dem Bereich oben. Wenn du hier speicherst, wird das Aussehen fest an diesen Code gebunden.',
  'match_branding': 'Branding für neue Codes übernehmen',
  'brand_preview_caption': 'Vorschau · {target}',
  'brand_preview_label': 'Vorschau von {name} mit diesem Branding',
  'save_branding': 'Branding speichern',
  'brand_save_hint': 'Link und Scanzahl bleiben unverändert – bereits Gedrucktes behält aber das alte Aussehen, lade den Code also neu herunter.',
  'error_could_not_save_branding': 'Das Branding dieses Codes konnte nicht gespeichert werden.',
  'error_design_too_large': 'Dieses Design ist zu groß zum Speichern – versuch es mit einem kleineren Logo in der Mitte.',

  // "Back up this QR code" dialog
  'backup_title': 'Diesen QR-Code sichern',
  'backup_close': 'Schließen',
  'backup_sign_in': 'Leg dir eine {id} an, um deine QR-Codes KOSTENLOS online zu sichern.',
  'backup_backing_up': 'Wird gesichert…',
  'backup_backed_up': '✓ Gesichert',
  'backup_back_up_online': 'Diesen QR-Code online sichern',
  'backup_needs_data': 'Gib eine URL oder Text ein, um deinen QR-Code zu sichern.',
  'backup_near_limit': 'Du hast {used} von {limit} kostenlosen Online-Sicherungen genutzt.',
  'backup_used_up': 'Du hast deine kostenlosen Online-Sicherungen aufgebraucht. Lösche unten eine, um Platz zu schaffen.',
  'backup_your_backups': 'Deine Sicherungen',
  'backup_none_yet': 'Noch keine.',
  'backup_open': 'Öffnen',
  'backup_delete_title': 'Diese Sicherung löschen',
  'backup_missing': '{file} ist hier aufgeführt, aber dahinter steckt keine Datei – dieses Speichern wurde nie abgeschlossen, also wurde auch nie etwas abgelegt. Dein Speicherplatz ist dafür weiterhin reserviert.',
  'backup_remove_entry': 'Eintrag entfernen und Speicherplatz freigeben',
  'backup_could_not_store': 'Dieser QR-Code konnte nicht gespeichert werden.',
  'backup_could_not_delete': 'Dieser QR-Code konnte nicht gelöscht werden.',
  'backup_could_not_save_now': 'Speichern ist gerade nicht möglich.',
  'backup_could_not_delete_now': 'Diese Sicherung kann gerade nicht gelöscht werden.',
}

export default dynamic
