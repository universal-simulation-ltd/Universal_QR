import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'what-is-a-qr-code',
    title: "QR kod aslında nedir?",
    summary: "Metin saklayan bir kareler ızgarası ve kameranın onu nasıl geri okuduğu.",
    group: "Temel bilgiler",
    body: `QR kod, kısa bir metni bir kameranın hızlı ve güvenilir biçimde okuyabileceği koyu ve açık karelerden oluşan bir desen olarak yazmanın bir yoludur. QR, İngilizcede Quick Response (Hızlı Yanıt) anlamına gelir. Biçim, 1994 yılında Japonya'da Denso Wave tarafından fabrikalardaki otomobil parçalarını izlemek için icat edildi ve bugün herkesin lisans ücreti ödemeden kullanabileceği açık bir uluslararası standarttır.

## İçinde ne var

Her kod metin saklar. Bu metin genellikle bir web adresidir, ancak herhangi bir şey olabilir: bir cümle, bir telefon numarası, bir Wi-Fi ağına katılmak için gereken bilgiler ya da bir kartvizit. Metinle ne yapılacağına kodu tarayan telefon karar verir. Metin bir web adresine benziyorsa telefon onu açmayı önerir. Wi-Fi bilgilerine benziyorsa ağa katılmayı önerir.

Kod bir web sayfası, resim ya da dosya içermez. Yalnızca kelimeleri içerir. Web adresi taşıyan bir kod, aslında o adresi birisi için yazmanın çok kısa bir yoludur.

## Bir kodun parçaları

- **Modüller** küçük karelerdir. Her biri tek bir koyu ya da açık veri birimidir.
- **Bulucu desenler** köşelerdeki üç büyük karedir. Tarayıcıya kodun nerede olduğunu, hangi yöne baktığını ve ne kadar büyük olduğunu söylerler. Bir tarayıcı başka bir şey okuyabilmeden önce üçünü de bulmak zorundadır.
- **Zamanlama ve hizalama desenleri**, kod açılı olarak fotoğraflansa ya da kavisli bir yüzeye basılsa bile tarayıcının ızgarayı çözmesine yardımcı olan daha küçük, düzenli işaretlerdir.
- **Sessiz bölge**, dış kenardaki boş kenar boşluğudur. Kodu yanındaki her şeyden ayırır.

## Neden bazı kodlar diğerlerinden daha yoğundur

QR kodlar, sürüm adı verilen 40 boyutta gelir. En küçüğü 21'e 21 modül, en büyüğü 177'ye 177 modüldür. Ne kadar çok metin koyarsanız o kadar çok modül gerekir; bu nedenle uzun bir web adresi, kısa bir adrese göre daha kalabalık bir kod oluşturur. Kalabalık kodların iyi taranması için daha büyük basılması gerekir; bu da mümkün olduğunda kısa adresler kullanmaya değmesinin bir nedenidir.`,
  },
  {
    id: 'error-correction',
    title: "Hata düzeltme ve ortadaki logonun neden yine de taranabildiği",
    summary: "Bir kodun lekelere, çiziklere ve üzerindeki bir resme nasıl dayandığı.",
    group: "Temel bilgiler",
    body: `Bir QR kod metninizi yalnızca bir kez saklamaz. Ayrıca Reed–Solomon hata düzeltmesi adlı matematiksel bir yöntemle hesaplanan ek kurtarma verileri de saklar. Aynı fikir CD'lerde ve uzay sondalarından gönderilen verilerde de kullanılır. Karelerin bir kısmı eksik ya da okunamaz durumdaysa tarayıcı, kaybolanı yeniden oluşturmak için kurtarma verilerini kullanabilir.

## Dört düzey

QR standardı dört hata düzeltme düzeyi sunar. Her biri, kod okunmaya devam ederken yaklaşık olarak ne kadarının hasar görebileceğini belirler:

- **L** (düşük): yaklaşık %7
- **M** (orta): yaklaşık %15
- **Q** (çeyrek): yaklaşık %25
- **H** (yüksek): yaklaşık %30

Daha yüksek düzeyler kurtarma verileri için daha fazla yer gerektirir; bu nedenle aynı metin için kod daha yoğun hale gelir.

## Logo neden işe yarar

Bir kodun ortasına logo yerleştirmek karelerinin bir kısmını örter. Tarayıcı için bu tam olarak hasar gibi görünür. Örtülen alan hata düzeltmenin kurtarabileceği miktarın rahatça içinde kaldığı sürece kod okunmaya devam eder.

Universal QR bu nedenle her zaman en yüksek düzey olan **H** düzeyini kullanır. Varsayılan olarak her kodun ortasında küçük bir işaret bulunur ve birçok kişi kendi logosunu ekler; bu yüzden kodun mümkün olduğunca fazla yedek kapasiteye ihtiyacı vardır. Bir logo eklendiğinde uygulama, logoyu yarı gizlenmiş bir desenin üzerine çizmek yerine normalde arkasındaki kareleri temizler; bu da tarayıcıya üzerinde çalışabileceği daha temiz bir görüntü verir.

## Sınırlar

Hata düzeltme bir güvenlik payıdır, her şeyi örtmeye izin veren bir ruhsat değildir. Düzeltemediği birkaç şey vardır:

- **Bulucu desenler.** Köşedeki üç büyük kare örtülür ya da bozulursa tarayıcı kodu hiç bulamayabilir.
- **Çok büyük bir logo.** Logodan kaynaklanan hasar ile aşınma, parlama ya da kötü baskıdan kaynaklanan hasar aynı bütçeden düşer.
- **Zayıf kontrast.** Hata düzeltme eksik kareleri onarır, ancak tarayıcı en baştan koyuyu açıktan ayırt edemiyorsa yardımcı olamaz.

Dolayısıyla pratik öneri değişmez: logoyu ölçülü tutun ve büyük bir baskı yaptırmadan önce bitmiş kodu mutlaka bir iki telefonla test edin.`,
  },
  {
    id: 'qr-codes-and-barcodes',
    title: "QR kodlar ve barkodlar: fark nedir?",
    summary: "Süpermarketlerin neden hâlâ çizgi kullandığı ve hangi barkod türünün seçileceği.",
    group: "Temel bilgiler",
    body: `Geleneksel bir barkod, bir sıra dikey çizgiden oluşur. Bilgi, soldan sağa okunan çubukların ve aralarındaki boşlukların genişliklerindedir. Yalnızca tek bir yön kullandığı için genellikle tek boyutlu ya da 1D barkod olarak adlandırılır. Bir QR kod ise bilgiyi aynı anda iki yönde, hem yatay hem dikey olarak saklar; bu yüzden iki boyutlu kod olarak adlandırılır.

## Bunun pratikteki anlamı

- **Kapasite.** Bir 1D barkod genellikle kısa bir sayı ya da birkaç karakter tutar. Bir QR kod ise tam bir web adresini ya da bir paragraf metni tutabilir.
- **Okuyucular.** 1D barkodlar, kasada ya da depoda basit ve hızlı lazer tarayıcılarla okunmak üzere tasarlanmıştır. QR kodlar ise telefondaki kamera dahil kameralarla okunmak üzere tasarlanmıştır.
- **Hasar.** QR kodların yerleşik hata düzeltmesi vardır. Çoğu 1D barkodda ise en fazla, hatalı bir okumayı fark edebilen ama onaramayan tek bir kontrol basamağı bulunur.

## Universal QR'daki barkod türleri

Universal QR 1D barkodlar da oluşturabilir. Gelişmiş'i açın, Tür'ü Barkod olarak değiştirin, ardından İçerik altından türü seçin:

- **Code 128** her türlü metni tutar ve genel amaçlı seçenektir.
- **EAN-13**, Avrupa'da ve dünyanın büyük bölümünde standart perakende barkodudur.
- **UPC-A**, Amerika Birleşik Devletleri ve Kanada'da standart perakende barkodudur.
- **Code 39**, demirbaş etiketlerinde ve sanayide hâlâ yaygın olan daha eski bir biçimdir.
- **ITF-14**, dış sevkiyat kolilerinde kullanılır.

## Kontrol basamakları

EAN-13, UPC-A ve ITF-14, diğer basamaklardan hesaplanan bir kontrol basamağıyla biter. Numarayı bir basamak eksik yazarsanız uygulama kontrol basamağını sizin için hesaplar. Numaranın tamamını yazarsanız uygulama son basamağın doğru olup olmadığını kontrol eder.

## Perakende numaraları hakkında bir not

Bir barkod oluşturucu, verdiğiniz numara ne olursa olsun çizgileri çizer. Size o numarayı kullanma hakkı vermez. Çoğu mağaza üzerinden satış yapabilmek için ürün numaraları normalde bu numaraları yöneten kuruluş olan GS1 tarafından verilir. Ürün satıyorsanız ambalajı bastırmadan önce perakendecinizin neye ihtiyaç duyduğunu kontrol edin.

## Uygulama barkodları neden sade tutar

Universal QR'daki barkodlarda logo, renk ya da süsleme yoktur. Bir 1D kodun çoğu zaman basit bir tarayıcıyla okunması gerekir ve çubukların kenarlarını bulanıklaştıran her şey onun çalışmasını engelleyebilir.`,
  },
  {
    id: 'static-and-dynamic-codes',
    title: "Statik ve dinamik kodlar",
    summary: "Dinamik sekmesinin neyi değiştirdiği ve ne zaman kullanmaya değdiği.",
    group: "Nasıl çalışır",
    body: `Universal QR iki tür QR kod oluşturabilir ve bunlar farklı şekillerde çalışır.

## Statik kodlar

Tasarla sekmesinde oluşturulan bir kod statiktir. Web adresiniz ya da yazdığınız metin ne ise doğrudan kare desenine yazılır. Birisi kodu taradığında telefonu adresi koddan okur ve doğrudan oraya gider. Arada hiçbir şey yoktur.

Bunun bazı belirgin güçlü yanları vardır:

- Hedef var olduğu sürece çalışır. Kodun çalışmaya devam etmesi için hiçbir hizmetin çalışır durumda kalması gerekmez.
- Kodu kimin ya da ne zaman taradığını biz dahil hiç kimse göremez.
- Ücretsizdir, hesap gerektirmez ve tamamen cihazınızda oluşturulur.

Tek dezavantajı, onu değiştirememenizdir. Adres değişirse yeni bir kod oluşturup bastırmanız gerekir.

## Dinamik kodlar

Dinamik sekmesinde oluşturulan bir kod hedefinizi içermez. Bunun yerine UNI·SIM web sitesindeki kısa bir bağlantıyı içerir. Birisi kodu taradığında telefonu bu kısa bağlantıyı ziyaret eder, sunucumuz kodun o anda nereyi göstermesi gerektiğine bakar, taramayı sayar ve telefonu hedefinize yönlendirir.

Hedef basılı desende değil sunucumuzda saklandığı için onu istediğiniz zaman değiştirebilirsiniz ve kodun daha önce basılmış tüm kopyaları da bu değişikliği izler. Dinamik sekmesi ayrıca her kodun kaç kez tarandığını, en son ne zaman tarandığını ve son 30 günün grafiğini gösterir.

Ödünleşimler:

- **Oturum açmanız gerekir**; bunun için Universal ID'nizi kullanırsınız. Dinamik kodlar Universal ID'nizle ücretsizdir ve ücretsiz hesapların cömert bir sınırı vardır. Bu sınıra bir gün ulaşırsanız, yer açmak için artık ihtiyacınız olmayan bir kodu silin.
- **Hizmete bağlıdır.** Bir dinamik kod silinirse onu tarayan herkes hedefiniz yerine kodun artık etkin olmadığını belirten bir sayfa görür.
- **Her tarama kaydedilir.** Tam olarak nelerin saklandığını öğrenmek için cihazınızdan nelerin çıktığıyla ilgili makaleye bakın.

## Hangisini seçmelisiniz?

Hedef değişmeyecekse, örneğin ana web siteniz ya da bir Wi-Fi ağı için statik kod kullanın. Gösterdiği sayfadan daha uzun ömürlü olacak bir şey bastırıyorsanız, örneğin değişen bir menü ya da etkinlik için bir afiş, ya da ne sıklıkla tarandığını öğrenmek istiyorsanız dinamik kod kullanın.`,
  },
  {
    id: 'codes-that-scan',
    title: "Her seferinde taranan bir kod oluşturmak",
    summary: "Sessiz bölge, kontrast, boyut ve baskıdan önce test.",
    group: "Nasıl çalışır",
    body: `Güzel görünen ama taranmayan bir QR kod, hiç kod olmamasından daha kötüdür. Başarısızlıkların çoğu, önlenebilir birkaç nedenden kaynaklanır.

## Sessiz bölgeye dokunmayın

Bir kodun etrafındaki boş kenar boşluğu tarayıcıya kodun nerede bittiğini söyler. QR standardı dört modül genişliğinde bir kenar boşluğu ister. Görüntüyü sıkıca kırparsanız ya da metnin veya kalabalık bir fotoğrafın hemen yanına yerleştirirseniz bazı tarayıcılar zorlanır. Kodun etrafında yalnızca görüntüde değil, sayfada da boş alan bırakın.

## Açık zemin üzerinde koyu tutun

Tarayıcılar açık bir arka plan üzerinde koyu kareler bekler. Bazı telefonlar koyu arka plan üzerindeki açık bir kodu okuyabilir, ancak birçok okuyucu okuyamaz. Güçlü kontrast, tam renklerden daha önemlidir: krem üzerinde koyu lacivert uygundur, biraz daha açık gri üzerinde orta gri uygun değildir.

Renkleriniz ters çevrilmiş bir kod oluşturuyorsa ya da kontrast çok zayıfsa Universal QR sizi uyarır; buna tarayıcının ilk bulması gereken köşedeki üç kare de dahildir.

## Yeterince büyük yapın

Yaygın bir pratik kurala göre bir kod, kendi genişliğinin yaklaşık on katı uzaklıktan taranabilir. 2 cm genişliğindeki bir kod kol mesafesinden çalışır; bir odanın öbür ucundaki bir afişte yer alan kodun çok daha büyük olması gerekir. Daha uzun metin daha yoğun bir kod oluşturur; bu nedenle kısa bir web adresi daha küçük basmanıza olanak tanır.

Baskı için SVG dışa aktarımı genellikle en iyi seçimdir. Vektör bir dosya olduğu için her boyutta keskin kalır. PNG kullanıyorsanız küçük bir görüntüyü sonradan büyütmek yerine büyük bir boyutta dışa aktarın.

## Şekiller ve süslemeler

Bir kodu daire, altıgen ya da yıldız üzerine yerleştirmek veya etrafına süsleme eklemek, hiçbir şeyin kesilmemesi için kodun kendisini görüntü içinde küçültür. Bunu telafi etmek için daha büyük bir boyutta dışa aktarın ve taramayı test edin.

## Bastırmadan önce test edin

1. Bitmiş dosyayı ekranda en az iki farklı telefonla tarayın.
2. Gerçek boyutta ve gerçek malzeme üzerine bir kopya basın, ardından kullanılacağı ışıkta yeniden tarayın.
3. Açılan sayfanın kastettiğiniz sayfa olduğunu kontrol edin.

Universal QR, siz yazarken web adresinin kullanılabilir bir biçimde olup olmadığını kontrol eder ve o adreste bir şeyin yanıt verip vermediğini sessizce sorar. Yeşil onay işareti bir şeyin yanıt verdiği anlamına gelir, doğru sayfa olduğu anlamına gelmez; bu yüzden bağlantıyı her zaman kendiniz de açın.`,
  },
  {
    id: 'scanning-safely',
    title: "Kodları güvenle taramak",
    summary: "Bir QR kod, bir bağlantının gerçekte nereye gittiğini gizleyebilir. Nelere dikkat etmeli.",
    group: "Gizlilik ve güvenlik",
    body: `Bir QR kod, gözle okuyamadığınız bir bağlantıdan ibarettir. Bu kolaylık aynı zamanda zayıf noktasıdır: bir kodun nereye gittiğini taramadan bilemezsiniz. Çoğu kod tam olarak göründüğü gibidir, ancak suçlular bazen kod kullanır; örneğin bir otopark ödeme makinesindeki ya da restoran masasındaki gerçek kodun üzerine sahte bir kod yapıştırarak veya e-posta ya da mektupla bir kod göndererek.

## İyi alışkanlıklar

- **Açmadan önce adresi okuyun.** Telefonunuzun gösterdiği web adresine bakın. Ad, beklediğiniz kişi ya da kuruluşla eşleşiyor mu? Yazım hatalarına, fazladan kelimelere ya da alışılmadık uzantılara dikkat edin.
- **Etiketlere karşı dikkatli olun.** Herkese açık her şeyde kodun üzerine yapıştırılmış değil, tabelanın bir parçası olarak basılmış olduğunu kontrol edin.
- **Ödeme yapmanız ya da oturum açmanız istendiğinde durun.** Sizi doğrudan bir ödeme sayfasına ya da giriş ekranına götüren bir kod ekstra özen gerektirir. Şüpheniz varsa kuruluşun adresini kendiniz yazın ya da resmi uygulamasını kullanın.
- **Kaynağından emin olmadığınız sürece bir koddan uygulama yüklemeyin.** Telefonunuzun resmi uygulama mağazasını kullanın.
- **E-postalardaki ve mektuplardaki kodlar**, e-postalardaki ve mektuplardaki bağlantılar kadar şüpheyi hak eder.

## Tara sekmesi nasıl yardımcı olur

Universal QR ile bir kod taradığınızda hiçbir şey otomatik olarak açılmaz. Uygulama size kodun tam metnini, kodun türünü ve bir Kopyala düğmesini gösterir. Metin bir web adresiyse Bağlantıyı aç düğmesi görünür ve siz ona basana kadar hiçbir şey olmaz. Bu, size önce adresi okumanız için bir an tanır.

Taramanın kendisi cihazınızda gerçekleşir. Kamera görüntüsü uygulamada çözülür ve hiçbir zaman yüklenmez. Kamera, bir kod bulunur bulunmaz ya da Tara sekmesinden ayrıldığınızda durur.

## Kötü bir kod taradığınızı düşünüyorsanız

Artık şüphelendiğiniz bir sayfaya bilgi girdiyseniz orada kullandığınız parolayı değiştirin ve bunlar kart ya da banka bilgileriyse hemen bankanızla iletişime geçin. Şüpheli kodları ve mesajları polise ya da ülkenizin resmi dolandırıcılık bildirim hizmetine bildirebilirsiniz.`,
  },
  {
    id: 'what-leaves-your-device',
    title: "Cihazınızdan neler çıkar",
    summary: "Neyin cihazınızda kaldığı, neyin çevrimiçi gittiği ve ne zaman.",
    group: "Gizlilik ve güvenlik",
    body: `Universal QR, işini cihazınızda yapacak şekilde tasarlanmıştır. Neyin orada kaldığı ve neyin kalmadığı tam olarak şöyledir.

## Cihazınızda kalır

- **Kod tasarlama ve dışa aktarma.** QR kod ve barkod görüntüleri uygulamada çizilir. Metniniz, renkleriniz ve eklediğiniz logo yüklenmez.
- **Mevcut tasarımınız**, bir sonraki sefere hâlâ orada olması için bu cihazdaki uygulama depolamasında hatırlanır.
- **Bu cihaza kaydet**, aynı yerel depolamada küçük bir tasarım galerisi tutar. Hesap gerektirmez. Uygulamanın verilerini ya da tarayıcınızın site verilerini temizlemek onu kaldırır.
- **Tarama.** Kamera görüntüsü cihazınızda çözülür ve hiçbir zaman yüklenmez.

## Tek bir otomatik kontrol

https ile başlayan bir web adresi yazdığınızda uygulama, bir şeyin yanıt verip vermediğini görmek için kendi cihazınızdan o adrese bağlanmasını ister. Bu, UNI·SIM üzerinden değil, doğrudan cihazınızdan o web sitesine gider ve bununla ilgili hiçbir şey tarafımızdan kaydedilmez. Yazdığınız web sitesi, onu ziyaret etseydiniz göreceği gibi bağlantınızdan gelen sıradan bir istek görür.

## Yalnızca siz seçtiğinizde

- **Bir kodu hesabınıza kaydetmek.** Bu QR kodunu yedekle, Universal ID'nize bağlı olarak çevrimiçi bir kopya saklayabilir. Yüklenen şey kodun görüntüsü ve eklediğiniz logo dahil tasarım ayarlarıdır. Bunlar, yalnızca sizin ve bir kuruluşa üyeyseniz kuruluşunuzun diğer üyelerinin oturum açtığında açabildiği özel bir depolamada tutulur. Aktarım sırasında ve depolandığı yerde şifrelenir, ancak uçtan uca şifreleme değil sıradan bir bulut depolamadır; yani anahtarlar bizdedir. Bir yedeği silmek onu kaldırır.
- **Dinamik kodlar.** Hedef adres, koda verdiğiniz ad ve tasarımı sunucumuzda saklanır, çünkü bir dinamik kodun basıldıktan sonra değiştirilebilmesi bu sayede mümkündür.

## Bir dinamik kod tarandığında neyi kaydeder

Bir dinamik kodun her taranması şunları içeren bir kayıt ekler:

- tarih ve saat
- ağın bildirdiği şekliyle taramanın geldiği ülke
- varsa ona bağlantı veren web sitesinin adı, adresin geri kalanı olmadan

Tarayan kişiyle ilgili hiçbir IP adresi, cihaz bilgisi ya da kişisel bilgi saklanmaz. Tarayan kişinin bir hesaba ya da herhangi bir uygulamaya ihtiyacı yoktur. Bir dinamik kodu sildiğinizde tarama kayıtları da onunla birlikte silinir.

Sunucumuz telefonu hedefinize yönlendirirken tarayıcıdan, o siteye kısa bağlantı üzerinden geldiğini söylememesini ister.

## Her Universal uygulamasının gönderdikleri

Uygulama açıkken, menünün onu kaç kişinin kullandığını gösterebilmesi için sunucumuza kullanımda olduğunu belirten küçük bir sinyal gönderir. Bu sinyal uygulamanın adını, cihaz türünü (web, telefon ya da masaüstü), bu cihazda oluşturulan rastgele bir kimliği ve oturum açtıysanız hesabınızı içerir. Oturum açtıysanız uygulama, hesabınızın etkinlik sayfası için uygulamayı açtığınızı da kaydeder. Bunların hiçbiri oluşturduğunuz ya da taradığınız kodlarla ilgili bir şey içermez. Üçüncü taraf analiz ya da reklam yoktur.

## Statik kodlar doğaları gereği gizlidir

Tasarla sekmesinde oluşturulan bir kod hedefinizi doğrudan içerir. Onu taramak UNI·SIM'e hiç dokunmaz; dolayısıyla görebileceğimiz ya da sayabileceğimiz hiçbir şey yoktur.`,
  },
]

export default articles
