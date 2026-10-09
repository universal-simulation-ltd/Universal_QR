import type { Messages } from '../en'

const dynamic: Messages['dynamic'] = {
  // Shared across this namespace
  'loading': 'Yükleniyor…',
  'cancel': 'İptal',
  'delete': 'Sil',
  'saving': 'Kaydediliyor…',
  'need_more': 'Daha fazlası mı gerekiyor? Bize söyleyin',
  'signin_button': 'Universal ID oluşturun / giriş yapın →',

  // Dynamic tab — header
  'title': 'Dinamik QR kodlar',
  'requires_universal_id': 'Universal ID gerektirir',
  'intro': 'Tek bir basılı kod, istediğiniz zaman değiştirebileceğiniz bir hedef — üstelik canlı bir tarama sayısı. Bağlantı sabit kalır ({link}); insanları nereye gönderdiğini istediğiniz zaman değiştirirsiniz.',

  // Dynamic tab — signed out
  'signin_title': 'ÜCRETSİZ dinamik QR kodlar hazırlamak için bir Universal ID oluşturun.',
  'signin_body': 'Dinamik kod, {id} hesabınızda sizin için tuttuğumuz kısa bir bağlantı içerir — böylece basıldıktan sonra nereye gittiğini değiştirebilir ve kaç kez tarandığını görebilirsiniz. Sade {qr} sekmesi %100 ücretsiz kalır ve cihazınızda çalışır.',
  'signin_body_qr_tab': 'QR',

  // Dynamic tab — branding for new codes
  'branding_title': 'Yeni kodlar için marka',
  'branding_hint_org': 'Varsayılan olarak kurumunuzun simgesi ve rengi kullanılır. Her kod oluşturulduğu görünümü korur — mevcut bir kodu değiştirmek için kartındaki Markaya ince ayar yap bağlantısını kullanın.',
  'branding_hint_no_org': 'Her kod oluşturulduğu görünümü korur — mevcut bir kodu değiştirmek için kartındaki Markaya ince ayar yap bağlantısını kullanın. Kurumunuza bir logo ve marka rengi eklerseniz burası otomatik olarak dolar.',
  'branding_reset': 'Sıfırla',
  'branding_preview_caption': 'Örnek · unisim.co.uk',
  'branding_preview_label': 'Markanızı taşıyan örnek dinamik QR',

  // Dynamic tab — create a code
  'new_code_title': 'Yeni dinamik kod',
  'purchased_tokens_one': '{count} satın alınmış jeton',
  'purchased_tokens_other': '{count} satın alınmış jeton',
  'signed_in_as': 'Giriş yapan: {email}',
  'destination_label': 'Hedef URL',
  'name_label': 'Etiket {optional}',
  'optional': '(isteğe bağlı)',
  'name_placeholder': 'Bahar kampanyası broşürü',
  'creating': 'Oluşturuluyor…',
  'create': 'Dinamik kod oluştur',
  'checking_account': 'Hesabınız kontrol ediliyor…',

  // Dynamic tab — reaching the limit
  'near_limit': '{limit} ücretsiz dinamik kodunuzun {used} tanesini kullandınız.',
  'at_limit': 'Ücretsiz dinamik kodlarınızı kullandınız.',
  'at_limit_make_room': 'Ücretsiz dinamik kodlarınızı kullandınız. Yer açmak için birini silin.',

  // Dynamic tab — errors
  'error_branding_too_large': 'Bu marka ayarı kaydedilemeyecek kadar büyük — daha küçük bir orta logo deneyin.',
  'error_no_org': 'Çevrimiçi kodlar şirketinizle birlikte saklanır ve Universal ID’nizin henüz bir şirketi yok. Şirket oluşturmak ücretsizdir.',
  'setup_company_button': 'Şirket oluştur →',
  'error_could_not_create': 'Bu dinamik kod oluşturulamadı.',
  'error_could_not_delete': 'Bu kod silinemedi.',
  'confirm_delete': '“{name}” silinsin mi? Onu tarayan herkes “etkin değil” sayfasıyla karşılaşır.',

  // Dynamic tab — the list of codes
  'your_codes': 'Dinamik kodlarınız',
  'empty': 'Henüz dinamik kod yok. İlkini soldan oluşturun — hedefini istediğiniz zaman değiştirebilir ve gelen taramaları izleyebilirsiniz.',

  // A dynamic code's card
  'tap_to_enlarge': 'Büyütmek için dokunun',
  'enlarge_label': '{target} için QR kodu büyüt',
  'qr_label': '{target} için dinamik QR kod',
  'edit_branding': '✏️ Markaya ince ayar yap',
  'close_branding': 'Marka düzenlemeyi kapat',
  'copy': 'Kopyala',
  'copy_link_label': 'Dinamik bağlantıyı kopyala',
  'delete_title': 'Bu kodu sil',
  'redirects_to': 'Yönlendirme hedefi',
  'change_destination': 'Hedefi değiştir',
  'save_destination': 'Hedefi kaydet',
  'destination_hint': 'Basılı kod aynı kalır — yalnızca insanları gönderdiği yer değişir.',
  'error_could_not_update_destination': 'Hedef güncellenemedi.',
  'total_scans': 'Toplam tarama',
  'last_scan': 'Son tarama',
  'no_scans_yet': 'Henüz tarama yok',
  'scans_chart_label': 'Son 30 gündeki taramalar',
  'scans_one': '{count} tarama',
  'scans_other': '{count} tarama',

  // A dynamic code's card — editing its branding
  'brand_own_hint': 'Bu kodun kendi markası. Değiştirmek yalnızca bu kodu yeniden çizer, başka hiçbir şeyi değil.',
  'brand_legacy_hint': 'Bu kod, kodlar kendi markalarını korumaya başlamadan önce oluşturuldu; bu yüzden hâlâ yukarıdaki paneli izliyor. Burada kaydetmek görünümü bu koda sabitler.',
  'match_branding': 'Yeni kodların markasını uygula',
  'brand_preview_caption': 'Önizleme · {target}',
  'brand_preview_label': 'Bu markayla {name} önizlemesi',
  'save_branding': 'Markayı kaydet',
  'brand_save_hint': 'Bağlantı ve tarama sayısı değişmez — ancak basılmış olanlar eski görünümü korur, bu yüzden kodu yeniden indirin.',
  'error_could_not_save_branding': 'Bu kodun markası kaydedilemedi.',
  'error_design_too_large': 'Bu tasarım kaydedilemeyecek kadar büyük — daha küçük bir orta logo deneyin.',

  // "Back up this QR code" dialog
  'backup_title': 'Bu QR kodu kaydet',
  'backup_close': 'Kapat',
  'backup_sign_in': 'QR kodlarınızı ÜCRETSİZ olarak çevrimiçi yedeklemek ve her cihazda açmak için bir {id} oluşturun.',
  'backup_backing_up': 'Yedekleniyor…',
  'backup_backed_up': '✓ Yedeklendi',
  'backup_back_up_online': 'Bu QR kodu çevrimiçi yedekle',
  'backup_needs_data': 'QR kodunuzu yedeklemek için bir URL veya metin girin.',
  'backup_near_limit': '{limit} ücretsiz çevrimiçi yedeğinizin {used} tanesini kullandınız.',
  'backup_used_up': 'Ücretsiz çevrimiçi yedeklerinizi kullandınız. Yer açmak için aşağıdan birini silin.',
  'backup_your_backups': 'Yedekleriniz',
  'backup_none_yet': 'Henüz yok.',
  'backup_open': 'Aç',
  'backup_delete_title': 'Bu yedeği sil',
  'backup_missing': '{file} burada listeleniyor, ancak arkasında bir dosya yok — bu kayıt hiç tamamlanmadı, bu yüzden hiçbir şey depolanmadı. Kayıt yeriniz hâlâ onun için ayrılmış durumda.',
  'backup_remove_entry': 'Bu girişi kaldır ve kayıt yerini boşalt',
  'backup_could_not_store': 'Bu QR kod depolanamadı.',
  'backup_could_not_delete': 'Bu QR kod silinemedi.',
  'backup_could_not_save_now': 'Şu anda kaydedilemedi.',
  'backup_could_not_delete_now': 'Bu yedek şu anda silinemedi.',
}

export default dynamic
