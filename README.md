# EczaJet

İlaç ve nöbetçi eczane bulma, reçete ile sipariş, eczane (vendor) ve admin panellerini içeren
Next.js 14 (App Router + TypeScript + Tailwind) uygulaması.

## Kurulum

```bash
npm install
npm run dev     # http://localhost:3000
```

## Demo hesapları

Şifre: 4+ karakter herhangi bir değer (örn. `123456`).

| Rol | E-posta | Yönlendirme |
|---|---|---|
| Hasta | `kullanici@eczajet.com` | `/` |
| Eczane | `eczane@eczajet.com` | `/vendor` |
| Admin | `admin@eczajet.com` | `/admin` |

Oturum `localStorage` içinde tutulur; backend'e geçerken `lib/store.tsx` içindeki
`login/register` fonksiyonlarını JWT dönen endpoint'lerle değiştirin.

## Roller ve sayfalar

**Giriş yapmadan:** ana sayfa, eczane listesi, nöbetçi eczaneler, ilaç arama, ilaç detayı.
Navbar'da "Giriş yap" / "Kayıt ol" görünür.

**Hasta (user)** — giriş sonrası navbar'da isim, bildirim zili ve hesap menüsü açılır:

| Route | İçerik |
|---|---|
| `/recete-yukle` | 5 adımlı akış: reçete → ilaçlar → eczane → adres → özet. Raporlu ilaç talebi desteklenir. |
| `/siparislerim`, `/siparislerim/[id]` | Aktif/geçmiş siparişler, 6 aşamalı durum çizelgesi, tekrar sipariş. |
| `/favoriler` | Favori eczaneler (eczane kartındaki kalp ile eklenir). |
| `/adresler` | Adres ekleme, silme, varsayılan yapma. |
| `/bildirimler` | Sipariş, reçete ve stok bildirimleri. |
| `/profil` | Hesap bilgileri, bildirim tercihleri, KVKK alanı. |

**Eczane (vendor)** — `/vendor` altında ayrı layout ve navigasyon:

| Route | İçerik |
|---|---|
| `/vendor` | Bekleyen/hazırlanan/hazır sipariş sayıları, stok uyarıları, haftalık özet. |
| `/vendor/siparisler` | Sipariş detayı (hasta, reçete, ilaçlar, adres) + onayla / reddet / hazırla / hazır / kuryeye ver / teslim edildi. |
| `/vendor/stok` | İlaç ekleme, silme, adet ve stokta var/yok güncelleme, arama. |
| `/vendor/profil` | Eczane bilgileri, çalışma saatleri, nöbet durumu, hizmetler. |

**Admin** — `/admin` altında ayrı layout:

| Route | İçerik |
|---|---|
| `/admin` | Toplam kullanıcı, eczane, aktif sipariş, ilaç sayısı, stok durumu, son aktiviteler. |
| `/admin/kullanicilar` | Listeleme, rol filtresi, hesap askıya alma/aktifleştirme. |
| `/admin/eczaneler` | Eczane onaylama, açık/kapalı yönetimi. |
| `/admin/ilaclar` | Merkezi ilaç kataloğu (etken madde, üretici, form, doz, reçeteli/raporlu). |
| `/admin/siparisler` | Tüm siparişler, durum filtresi. |
| `/admin/receteler` | Reçete belgeleri — varsayılan gizli, "içeriği aç" ile açılır ve erişim loglanır. |
| `/admin/bildirimler` | Hasta/eczane/tekil kullanıcıya sistem duyurusu gönderme. |

## Öne çıkan özellikler

- **Akıllı ilaç bulucu** — isim, etken madde veya kategoriye göre arama + kategori çipleri.
- **Eczane karşılaştırma** — ilaç detayında mesafe / fiyat / hazırlama süresine göre sıralama.
- **Stok bildirimi** — stok yoksa "bana bildir"; vendor stoğu açtığında bekleyen kullanıcılara bildirim düşer.
- **Raporlu ilaç akışı** — rapor numarası girişi, siparişte "Raporlu" rozeti, eczane tarafında uyarı.
- **Güvenli sağlık UX'i** — `SecureNote` bileşeni, reçete içeriğinin varsayılan gizliliği, KVKK onayı.

## Backend (Swagger) bağlantısı

`lib/api.ts` dosyası `authApi`, `userApi`, `vendorApi`, `adminApi` olarak gruplanmıştır.

1. `.env.local` oluşturun:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.ornek.com/v1
   ```
2. İlgili fonksiyonun gövdesini `apiFetch` ile değiştirin:
   ```ts
   pharmacies: () => apiFetch<Pharmacy[]>("/pharmacies"),
   ```
3. Login sonrası dönen token'ı `setToken(token)` ile verin; `apiFetch` otomatik `Authorization` başlığı ekler.
4. `lib/types.ts` içindeki arayüzleri Swagger şemanıza göre güncelleyin.

Şu an sayfalar `lib/store.tsx` üzerinden çalışıyor (optimistik in-memory state). Gerçek API'ye
geçerken store içindeki mutasyon fonksiyonlarının gövdelerine `await vendorApi.setOrderStatus(...)`
gibi çağrılar ekleyip state'i yanıta göre güncellemeniz yeterli — bileşenlerde değişiklik gerekmez.

## Notlar

- `/ilac/[id]` için `generateStaticParams` mock katalogdan beslenir; gerçek API'ye geçerken ya
  API'den besleyin ya da kaldırıp dinamik render'a bırakın.
- Tasarım tokenları `tailwind.config.ts` içinde (`brand`, `alert`, `ink`, `line`, `canvas`).
- İkonlar Material Symbols Rounded, tipografi Sora (başlık) + Inter (metin) + JetBrains Mono (kod/no).
# pharmacy-frontend
