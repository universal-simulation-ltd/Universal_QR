import type { Messages } from '../en'

const scan: Messages['scan'] = {
  // Heading
  'headline': '{em} tarayın',
  'headline_em': 'QR kod veya barkod',
  'intro': 'Kameranızı herhangi bir QR koda veya 1D barkoda (EAN, UPC, Code 128, Code 39…) doğrultun. Kod çözme cihazınızda gerçekleşir — kamera görüntüsü cihazdan hiç çıkmaz.',

  // Over the viewfinder while the camera is not running
  'status_waiting': 'Kamera erişimi bekleniyor…',
  'status_scan_another': 'Hazır olduğunuzda başka bir kod tarayın.',
  'status_camera_off': 'Kamera kapalı.',
  'button_starting': 'Kamera başlatılıyor…',
  'button_scan_again': 'Yeniden tara',
  'button_start': 'Taramayı başlat',
  'button_stop': 'Durdur',

  // Camera errors, shown over the viewfinder
  'error_no_camera': 'Bu cihazda kamera bulunamadı.',
  'error_camera_start': 'Kamera başlatılamadı. Kamerayı kullanan diğer uygulamaları kapatıp yeniden deneyin.',

  // Ask-on-open checkbox — only shown while camera access has not been answered
  'dont_ask_on_open': 'Tara sekmesini açtığımda kamera erişimi isteme',

  // Result card
  'format_unknown': 'Bilinmiyor',
  'copy': 'Kopyala',
  'copied': '✓ Kopyalandı',
  'open_link': 'Bağlantıyı aç ↗',
  'open_link_anyway': 'Yine de aç ↗',
  'goes_to': 'Gideceği yer',
  'warn_insecure': 'Şifrelenmemiş (http://): aynı ağdaki herkes sayfayı görebilir veya değiştirebilir.',
  'warn_lookalike': 'Bu adres, tanıdık bir adı taklit edebilen başka bir alfabeden harfler kullanıyor. Tarayıcınız onu {host} olarak gösterecek.',
  'warn_credentials': '“@” işaretinden önceki kısım bu bağlantının gittiği yer değil. Bağlantı aslında {host} adresini açar.',
  'warn_ip': 'Adlandırılmış bir web sitesi yerine bir sayıya (IP adresine) yönlendiriyor.',
  'warn_shortener': 'Bu kısaltılmış bir bağlantı; gerçekte nereye gittiğini açana kadar göremezsiniz.',
  'blocked': 'Bu kod, cihazınızda kod çalıştırabilecek veya dosya açabilecek bir “{scheme}:” adresi içeriyor. Universal QR bunu açmaz.',
  'wifi_network': 'Wi-Fi ağı',
  'wifi_password': 'Şifre',
  'wifi_open': 'Şifre yok (açık ağ)',
  'wifi_join_hint': 'Bağlanmak için Wi-Fi ayarlarınızı açın, bu ağı seçin ve şifreyi yapıştırın.',
  'copy_password': 'Şifreyi kopyala',
  'call': '{number} numarasını ara',
  'write_email': '{address} adresine e-posta gönder',
  'send_text': '{number} numarasına SMS gönder',
  'scan_image': 'Görsel tara',
  'reading_image': 'Görsel okunuyor…',
  'image_no_code': 'Bu görselde QR kod veya barkod bulunamadı. Daha net ve daha yakından çekilmiş bir fotoğraf deneyin.',

  // Camera permission help (lib/cameraAccess.ts)
  'blocked_ios': 'Universal QR için kamera erişimi kapalı. Ayarlar ▸ Universal QR ▸ Kamera yolundan açın, sonra bu sekmeye dönün.',
  'blocked_android': 'Universal QR için kamera erişimi kapalı. Ayarlar ▸ Uygulamalar ▸ Universal QR ▸ İzinler ▸ Kamera yolundan açın, sonra bu sekmeye dönün.',
  'blocked_browser': 'Bu site için kamera erişimi engellendi. Tarayıcınızın adres çubuğundaki kamera simgesinden izin verin, sonra yeniden deneyin.',
  'remembered_native': 'Cihazınız yanıtı hatırlar, bu yüzden yalnızca bir kez sorulur.',
  'remembered_browser': 'Tarayıcınız bu sitenin kamera iznini hatırlar.',
  'granted_native': 'Bu cihazda kamera erişimine izin verildi — Tara sekmesi doğrudan kamera görüntüsüyle açılır.',
  'granted_browser': 'Bu site için kamera erişimine izin verildi — Tara sekmesi doğrudan kamera görüntüsüyle açılır.',
}

export default scan
