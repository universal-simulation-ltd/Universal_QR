import type { Messages } from '../en'

const studio: Messages['studio'] = {
  // Shared
  'remove': 'Kaldır',
  'close': 'Kapat',

  // Header
  'headline': 'QR kodlar {em}. Sonsuza dek.',
  'headline_em': 'sorunsuz çalışır',
  'lead': 'Renklerinizi seçin, modüllere şekil verin, bir logo ekleyin — kod cihazınızda anında oluşturulur. PNG, SVG, JPEG veya WebP olarak indirin.',

  // Mode switch + reset
  'mode_aria': 'Düzenleyici modu',
  'mode_simple': 'Basit',
  'mode_branding': 'Marka',
  'mode_advanced': 'Gelişmiş',
  'reset_all': 'Tümünü sıfırla',

  // Export button + menu
  'save_or_share': 'Kaydet veya paylaş',
  'download_png': 'PNG indir',
  'preparing': 'Hazırlanıyor…',
  'more_export_aria': 'Diğer dışa aktarma seçenekleri',
  'more_options': 'Diğer seçenekler',
  'download_as': 'Şu biçimde indir',
  'copy_png': 'PNG’yi panoya kopyala',
  'back_up_online': 'unisim.co.uk sitesine çevrimiçi yedekle',
  'copied': '✓ Panoya kopyalandı',
  'copy_unsupported': 'Kopyalama desteklenmiyor — İndir’i kullanın',
  'scan_test_hint': 'Küçük boyutlarda basmadan önce mutlaka tarayarak test edin.',
  'export_failed': 'Üzgünüz, dışa aktarma başarısız oldu: {message}',
  'nothing_to_export': 'Henüz dışa aktarılacak bir şey yok.',
  'export_failed_reason': 'Dışa aktarma başarısız oldu',

  // Branding panel
  'presets_title': 'Hazır stiller',
  'presets_hint': 'Bir başlangıç noktası — renkleri ve logoyu aşağıdan ayarlayın.',
  'colours_title': 'Renkler',
  'modules': 'Modüller',
  'background': 'Arka plan',
  'transparent_background': 'Saydam arka plan',
  'transparent_background_hint': 'PNG/SVG’yi arka plan dolgusu olmadan dışa aktarın.',
  'gradient_modules': 'Renk geçişli modüller',
  'gradient_end': 'Geçiş bitiş rengi',
  'gradient_angle': 'Geçiş açısı',
  'two_tone_corners': 'İki renkli köşeler',
  'two_tone_corners_hint': 'Üç köşe işaretine kendi rengini verin.',
  'corner_colour': 'Köşe rengi',
  'hex_value_aria': 'Hex değeri: {label}',
  'logo_title': 'Logo ve marka',
  'logo_drop_label': 'Logoyu buraya bırakın veya seçmek için tıklayın',
  'logo_not_image': 'Lütfen bir görsel dosyası seçin (PNG, JPG veya SVG).',
  'logo_preview_alt': 'Logo önizlemesi',
  'logo_added': 'Özel logo eklendi',
  'logo_replace': 'Değiştir',
  'logo_size': 'Logo boyutu',
  'logo_padding': 'Logo boşluğu',
  'clear_behind_logo': 'Logonun arkasındaki modülleri temizle',

  // Preview
  'enlarge_aria': 'Taramak için QR kodu büyüt',
  'qr_code_for': 'QR kod: {name}',
  'nothing_yet': 'Henüz gösterilecek bir şey yok.',
  'enter_to_generate': 'QR kodunuzu oluşturmak için bir URL veya metin girin.',
  'tap_to_enlarge': 'Büyütmek için dokunun',
  'tap_code_to_enlarge': 'Büyütmek için koda dokunun',

  // Pinned preview (phone)
  'hide_pinned': 'Sabitlenmiş önizlemeyi gizle',
  'show_preview': 'QR önizlemesini göster',

  // Enlarged code
  'enlarged_aria': 'Büyütülmüş QR kod: {name}',
  'click_to_dismiss': 'Kapatmak için tıklayın',
  'point_camera': 'Başka bir telefonun kamerasını bu koda doğrultun',
  'scan_trouble': 'Sorun mu yaşıyorsunuz? Ekran parlaklığını en yükseğe çıkarın ve kameranın yakın çekim (makro) modunda olmadığından emin olun — kodun tamamı kadraja girecek şekilde biraz geri çekin.',
  'press_to_save': 'Telefonda, kodu görsel olarak kaydetmek veya paylaşmak için üzerine basılı tutun.',

  // Regenerate style
  'regenerate': 'Stili yenile',
  'regenerate_title': 'Rastgele bir stil seç',
  'regenerate_title_from': '{preset} — rastgele başka bir stil seç',

  // Link test (under the address box)
  'test_link': 'Bağlantıyı test et',
  'no_scheme': 'Başında {https} yok — bazı tarayıcılar bunu açar, bazıları ise düz metin olarak okur.',
  'add_https': 'https:// ekle',
  'insecure': 'Bir {http} adresi. Açılır, ancak telefonlar bunu “Güvenli değil” olarak gösterir — ve bu sayfadan kontrol edilemez.',
  'checking': 'Adres kontrol ediliyor…',
  'responds': 'Adres yanıt veriyor',
  'responds_title': 'O adreste bir şey yanıt verdi. Gerçek bir sayfayı 404’ten ayırt edemez — emin olmak için açın.',
  'offline': 'Çevrimdışı — kontrol edilmedi',
  'timeout': 'Henüz yanıt yok — yalnızca yavaş olabilir',
  'unreachable': 'Bu tarayıcıdan ulaşılamadı',
  'not_proof_title': 'Bu, bağlantının bozuk olduğunu kanıtlamaz — bazı siteler bu tür kontrolleri reddeder. Emin olmak için bir sekmede açın.',

  // Barcode preview
  'barcode_enter': 'Barkodunuzu önizlemek için bir değer girin.',
  'barcode_fix': 'Barkodunuzu önizlemek için yukarıdaki değeri düzeltin.',
  'barcode_cant_encode': 'Bu değer kodlanamıyor.',

  // Save to this device
  'save_title': 'Tasarımınızı kaydedin',
  'no_account': 'Hesapsız',
  'save_body': 'Bu QR kodu bu cihazda tutun ve daha sonra yeniden açın — ücretsiz, giriş yapmadan. Tarayıcınızda kalır ve oradan hiç çıkmaz.',
  'saved': '✓ Bu cihaza kaydedildi',
  'saving': 'Kaydediliyor…',
  'enter_url_to_save': 'Kaydetmek için bir URL girin',
  'save_to_device': 'Bu cihaza kaydet',
  'save_failed': 'Üzgünüz, bu kaydedilemedi: {message}',
  'untitled_design': 'QR kod',
  'open': 'Aç',
  'remove_design_aria': 'Kaldır: {name}',
  'remove_saved_design_aria': 'Kayıtlı tasarımı kaldır',
}

export default studio
