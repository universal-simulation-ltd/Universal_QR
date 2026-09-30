import type { Messages } from '../en'

const controls: Messages['controls'] = {
  // ── Name section (Advanced) ────────────────────────────────────────────
  name_title: 'Ad',
  name_desc: 'Çevrimiçi yedeklerinizde bu kodla birlikte gösterilir.',
  name_label: 'Ad',
  name_placeholder: 'QR kodum',

  // ── Style presets ──────────────────────────────────────────────────────
  presets_title: 'Hazır stiller',
  presets_desc: 'Bir başlangıç noktası — aşağıdaki her şeyi ayarlayabilirsiniz.',
  // Preset names, on chips — keep short, one word
  preset_classic: 'Klasik',
  preset_rounded: 'Yuvarlak',
  preset_dots: 'Noktalar',
  preset_sunset: 'Gün batımı',
  preset_radial: 'Dairesel',
  preset_star: 'Yıldız',

  // ── Colours ────────────────────────────────────────────────────────────
  colours_title: 'Renkler',
  colour_modules: 'Modüller',
  colour_background: 'Arka plan',
  colour_hex_aria: 'Hex değeri: {label}',
  transparent_background: 'Saydam arka plan',
  transparent_background_hint: 'PNG/SVG’yi arka plan dolgusu olmadan dışa aktarın.',
  gradient_modules: 'Renk geçişli modüller',
  gradient_end: 'Geçiş bitiş rengi',
  gradient_angle: 'Geçiş açısı',
  two_tone_corners: 'İki renkli köşeler',
  two_tone_corners_hint: 'Üç köşe işaretine kendi rengini verin.',
  corner_colour: 'Köşe rengi',

  // Contrast warnings (amber box under the colours). Each is a bold first
  // sentence followed by the rest. {ratio} is like "2.4", {min} is "3".
  contrast_inverted_background_title: 'Koyu arka plan üzerinde açık modüller.',
  contrast_inverted_background_body:
    'QR standardı bunun tersini bekler ve katı okuyucular ters çevrilmiş bir kodu doğrudan reddeder — bu uygulamanın kendi Tara sekmesi de bunlardan biridir. Çoğu telefon kamerası bununla başa çıkar, ancak kodun her yerde çalışması gerekiyorsa iki rengin yerini değiştirin.',
  contrast_inverted_star_title: 'Koyu bir yıldız üzerinde açık modüller.',
  contrast_inverted_star_body:
    'QR standardı bunun tersini bekler ve katı okuyucular ters çevrilmiş bir kodu doğrudan reddeder — bu uygulamanın kendi Tara sekmesi de bunlardan biridir. Çoğu telefon kamerası bununla başa çıkar, ancak kodun her yerde çalışması gerekiyorsa modüllerin rengini koyulaştırın ya da arkalarındaki yıldızın rengini açın.',
  contrast_low_star_title: 'Modüller ile arkalarındaki yıldız arasında kontrast düşük.',
  contrast_low_star_body:
    '{ratio}:1; oysa bir okuyucu en az {min}:1 ister. Yıldız kodun büyük bölümünün altında durur; bu yüzden çevresindeki sayfa ne kadar açık olursa olsun, tarayıcı açısından bir arka plandır. Yıldızın rengini açın ya da modüllerin rengini koyulaştırın.',
  contrast_low_modules_title: 'Modüller ile arka plan arasında kontrast düşük.',
  contrast_low_modules_body:
    '{ratio}:1; oysa bir okuyucu en az {min}:1 ister. Renkleri bu kadar yakın olan kodlar genellikle ekranda taranır, sonra baskıda ya da uzaktan başarısız olur. Modül rengini koyulaştırın ya da arka planın rengini açın.',
  contrast_low_corners_title: 'Köşeler ile arka plan arasında kontrast düşük.',
  contrast_low_corners_body:
    '{ratio}:1; oysa bir okuyucu en az {min}:1 ister. Tarayıcı başka bir şey okumadan önce üç köşe karesini bulur; bu yüzden kontrastın yetersiz kalmasının en riskli olduğu yer burasıdır. Köşe rengini koyulaştırın ya da arka planın rengini açın.',

  // ── Shape & size ───────────────────────────────────────────────────────
  shape_title: 'Şekil ve boyut',
  shape_desc: 'Kodun dış hattı, modül yuvarlaklığı, köşe stili ve boyutları.',
  code_shape: 'Kod şekli',
  // Shape buttons — keep short, one word (a grid of six)
  shape_square: 'Kare',
  shape_rounded: 'Yuvarlatılmış',
  shape_circle: 'Daire',
  shape_squircle: 'Yuvarlak kare',
  shape_hexagon: 'Altıgen',
  shape_star: 'Yıldız',
  star_placement: 'Yıldız yerleşimi',
  star_placement_inside: 'Yıldızın içinde',
  star_placement_behind: 'Yıldız arkada',
  star_colour: 'Yıldız rengi',
  star_behind_desc:
    'Yıldız, kodun arkasında bir fon olarak durur ve uçları kodun çevresinde görünür — Universal PDF’teki QR yıldız işaretinin görünümü. Kod, yıldızın uçlarının arasına sıkıştırılmak yerine yıldızın üzerine çizilir; bu yüzden aynı tasarımın “Yıldızın içinde” ayarındaki hâlinden yaklaşık bir buçuk kat büyüktür ve buna bağlı olarak taranması daha kolaydır. Bu düzende süslemenin dolduracağı bir halka olmadığından süsleme sunulmaz.',
  star_inside_desc:
    'Kod yıldızın içinde durur ve kenarlarını hiçbir zaman aşmaz. Bu, yıldızı bütün tutar, ancak kod çok daha küçük olur — yıldızın beş girintisi, içine sığan karenin her kenarını daraltır.',
  decoration: 'Süsleme',
  // Decoration buttons — keep short, one word
  decor_none: 'Yok',
  decor_burst: 'Patlama',
  decor_scatter: 'Serpme',
  decoration_matches: 'Süsleme modüllerle aynı renkte',
  decoration_matches_hint: 'Süslemeye kendi rengini vermek için kapatın.',
  decoration_colour: 'Süsleme rengi',
  decoration_on_note:
    'Süsleme, şeklin kodun çevresinde bıraktığı alanı doldurur — ve bu alana ihtiyaç duyar; bu yüzden kod, yer açmak için daha küçük çizilir. Her zamankinden büyük dışa aktarın ve basmadan önce tarayarak test edin. Süsleme kodun dışında durduğu için rengi serbesttir — uyulması gereken bir kontrast kuralı yoktur.',
  decoration_off_note:
    'Şekilli bir zeminin kodun çevresinde bıraktığı alanı doldurur. Birini seçmek kare bir kodu daireye çevirir, çünkü kare bir zeminde doldurulacak alan yoktur.',
  // How much of the image the code fills on a shaped plate. {pct} is a
  // percentage number, {size} and {inner} are pixel counts.
  frame_note_rounded: 'Kod, {size}px boyutundaki görselin %{pct} kadarını ({inner}px) doldurur — geri kalanı çevresindeki yuvarlatılmış karedir.',
  frame_note_circle: 'Kod, {size}px boyutundaki görselin %{pct} kadarını ({inner}px) doldurur — geri kalanı çevresindeki dairedir.',
  frame_note_squircle: 'Kod, {size}px boyutundaki görselin %{pct} kadarını ({inner}px) doldurur — geri kalanı çevresindeki yuvarlak karedir.',
  frame_note_hexagon: 'Kod, {size}px boyutundaki görselin %{pct} kadarını ({inner}px) doldurur — geri kalanı çevresindeki altıgendir.',
  frame_note_star: 'Kod, {size}px boyutundaki görselin %{pct} kadarını ({inner}px) doldurur — geri kalanı çevresindeki yıldızdır.',
  frame_note_star_behind: 'Kod, {size}px boyutundaki görselin %{pct} kadarını ({inner}px) doldurur — yıldızın uçları çevresinde görünür.',
  frame_note_never_trimmed: 'Kod hiçbir zaman şekle sığdırmak için kırpılmaz — bu, taranmasını engeller.',
  module_style: 'Modül stili',
  // Module-shape buttons — keep short (a grid of six)
  dot_square: 'Kare',
  dot_rounded: 'Yuvarlatılmış',
  dot_extra_rounded: 'Çok yuvarlak',
  dot_dots: 'Noktalar',
  dot_classy: 'Şık',
  dot_classy_rounded: 'Şık yuvarlak',
  corner_frame: 'Köşe çerçevesi',
  corner_frame_square: 'Kare',
  corner_frame_rounded: 'Yuvarlatılmış',
  corner_frame_dot: 'Nokta',
  corner_dot: 'Köşe noktası',
  corner_dot_square: 'Kare',
  corner_dot_dot: 'Nokta',
  size: 'Boyut',
  quiet_zone: 'Sessiz bölge boşluğu',

  // ── Logo & branding ────────────────────────────────────────────────────
  logo_title: 'Logo ve marka',
  logo_desc: 'Marka logonuzu ortaya yerleştirin.',
  logo_drop_label: 'Logoyu buraya bırakın veya seçmek için tıklayın',
  logo_not_image: 'Lütfen bir görsel dosyası seçin (PNG, JPG veya SVG).',
  logo_preview_alt: 'Logo önizlemesi',
  logo_added: 'Özel logo eklendi',
  logo_replace: 'Değiştir',
  logo_remove: 'Kaldır',
  logo_pick_touch: 'Logo seçmek için dokunun (PNG, JPG, SVG)',
  logo_pick_desktop: 'Logoyu buraya bırakın veya seçmek için tıklayın (PNG, JPG, SVG)',
  logo_size: 'Logo boyutu',
  logo_padding: 'Logo boşluğu',
  clear_behind_logo: 'Logonun arkasındaki modülleri temizle',
  remove_unisim_mark: 'UNI·SIM işaretini kaldır',
  remove_unisim_mark_hint_logo: 'Sağ alt köşedeki küçük UNI·SIM rozetini kaldırır.',
  remove_unisim_mark_hint: 'Ortadaki UNI·SIM işaretini kaldırır.',

  // ── "What's it for?" card ──────────────────────────────────────────────
  content_title: 'Ne için?',
  // Kinds of code: chips (keep short, one word) AND the title on the preview card
  kind_link: 'Bağlantı',
  kind_wifi: 'Wi-Fi',
  kind_contact: 'Kişi',
  kind_email: 'E-posta',
  kind_phone: 'Telefon',
  kind_sms: 'SMS',
  kind_location: 'Konum',
  kind_event: 'Etkinlik',
  kind_barcode: 'Barkod',
  kind_more: 'Diğer',
  more_kinds_aria: 'Diğer kod türleri',

  // Content form fields
  optional: 'İsteğe bağlı',
  link_label: 'Web adresi veya metin',
  wifi_ssid: 'Ağ adı (SSID)',
  wifi_ssid_placeholder: 'EvWiFi',
  wifi_password: 'Şifre',
  wifi_password_placeholder: 'ağ açıksa boş bırakın',
  wifi_hidden: 'Gizli ağ',
  email_to: 'Alıcı',
  email_subject: 'Konu',
  email_message: 'Mesaj',
  phone_number: 'Telefon numarası',
  sms_message: 'Mesaj',
  sms_message_placeholder: 'İsteğe bağlı hazır metin',
  contact_first_name: 'Ad',
  contact_first_name_placeholder: 'Ayşe',
  contact_last_name: 'Soyadı',
  contact_last_name_placeholder: 'Yılmaz',
  contact_org: 'Kurum',
  contact_phone: 'Telefon',
  contact_email: 'E-posta',
  contact_website: 'Web sitesi',
  geo_latitude: 'Enlem',
  geo_longitude: 'Boylam',
  event_title: 'Başlık',
  event_title_placeholder: 'Ekip toplantısı',
  event_location: 'Konum',
  event_starts: 'Başlangıç',
  event_ends: 'Bitiş',
  event_description: 'Açıklama',

  // ── Barcode ────────────────────────────────────────────────────────────
  barcode_type: 'Barkod türü',
  barcode_value: 'Değer',
  barcode_value_aria: '{format} değeri',
  barcode_static_note: 'Barkodlar statik ve sadedir — renk, logo ya da şekil eklenmez.',
  // One-line hint under the field, per format
  barcode_hint_code128: 'Her türlü metin veya sayı — en yaygın genel amaçlı barkod.',
  barcode_hint_ean13: '12 basamak (13. kontrol basamağı otomatik eklenir) ya da 13 basamağın tamamını yapıştırın.',
  barcode_hint_upca: '11 basamak (kontrol basamağı eklenir) ya da 12 basamağın tamamını yapıştırın.',
  barcode_hint_code39: 'Büyük harf A–Z, 0–9 ve - . $ / + % ya da boşluk.',
  barcode_hint_itf14: 'Sevkiyat kolisi kodu — 13 basamak (kontrol basamağı eklenir) ya da 14 basamağın tamamı.',
  // Validation errors, in red under the field
  barcode_error_code128: 'En fazla {max} karakter girin.',
  barcode_error_ean13: 'EAN-13 için 12 veya 13 basamak gerekir.',
  barcode_error_upca: 'UPC-A için 11 veya 12 basamak gerekir.',
  barcode_error_code39: 'Yalnızca büyük harf A–Z, 0–9 ve - . $ / + % kullanın.',
  barcode_error_itf14: 'ITF-14 için 13 veya 14 basamak gerekir.',

  // ── Branding controls (dynamic codes) ──────────────────────────────────
  brand_style: 'Stil',
  brand_use_org: 'kurum rengi',
  brand_transparent: 'Saydam',
  brand_gradient: 'Renk geçişi',
  brand_gradient_end: 'Bitiş',
  brand_angle: 'Açı',
  brand_corners: 'Köşeler',
  brand_centre_logo: 'Orta logo',
  brand_logo_none_preview: 'yok',
  brand_org_icon: 'Kurum simgesi',
  brand_upload: 'Yükle…',
  brand_none: 'Yok',
}

export default controls
