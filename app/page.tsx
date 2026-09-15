"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { medicines, money, stockFor } from "@/lib/data";
import { Badge, Card, Icon } from "@/components/ui";
import { ORDER_LABELS } from "@/lib/types";

const QUICK = ["Parol 500mg", "Biteral", "Augmentin BID", "Aspirin", "Vitamin C"];

const CATEGORIES = [
  { icon: "medication", title: "Reçetesiz İlaçlar", sub: "Ağrı kesici, pastil, sprey", q: "Ağrı kesici", tone: "brand" },
  { icon: "spa", title: "Dermokozmetik", sub: "Güneş, cilt & saç bakımı", q: "Dermokozmetik", tone: "alert" },
  { icon: "child_care", title: "Anne & Bebek", sub: "Mama, pişik kremi, emzik", q: "Bebek", tone: "amber" },
  { icon: "vital_signs", title: "Medikal Cihazlar", sub: "Tansiyon aleti, ateşölçer", q: "Tansiyon", tone: "neutral" },
  { icon: "nutrition", title: "Vitamin & Destek", sub: "C, D3, Omega-3, Kolajen", q: "Vitamin", tone: "brand" },
] as const;

const toneBg: Record<string, string> = {
  brand: "bg-brand-light text-brand",
  alert: "bg-alert-light text-alert",
  amber: "bg-amber-light text-amber",
  neutral: "bg-line-soft text-ink-soft",
};

export default function Home() {
  const router = useRouter();
  const { currentUser, orders, pharmacies } = useStore();
  const [q, setQ] = useState("");

  const dutyCount = pharmacies.filter((p) => p.duty && p.approved).length;
  const activeOrder = currentUser
    ? orders.find((o) => o.userId === currentUser.id && !["delivered", "rejected"].includes(o.status))
    : undefined;

  const search = (term?: string) => {
    const v = (term ?? q).trim();
    router.push(v ? `/ilac-arama?q=${encodeURIComponent(v)}` : "/ilac-arama");
  };

  return (
    <div className="max-w-shell mx-auto px-5">
      {/* ---------- HERO ---------- */}
      <section className="pt-6 pb-10">
        <div className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-brand-light/70 via-canvas to-white px-6 py-12 sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-28 w-[380px] h-[380px] rounded-full bg-brand-tint/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-28 w-[320px] h-[320px] rounded-full bg-alert-light/60 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-line rounded-full px-3.5 py-1.5 text-[12.5px] text-ink-soft mb-5 shadow-card">
              <Icon name="verified_user" className="text-[16px] text-brand ms-fill" />
              İstanbul Anadolu · Kadıköy ve çevresi
              <span className="w-1 h-1 rounded-full bg-line" />
              <span className="inline-flex items-center gap-1.5 text-alert font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-alert animate-pulse" />
                {dutyCount} nöbetçi açık
              </span>
            </span>

            <h1 className="font-display text-[34px] sm:text-[44px] leading-[1.1] font-semibold tracking-tight">
              İhtiyacınız olan ilaç ve{" "}
              <span className="text-brand">nöbetçi eczaneler</span>
              <br className="hidden sm:block" /> dakikalar içinde kapınızda
            </h1>

            <p className="text-[15px] sm:text-[16px] text-ink-soft mt-4 max-w-xl leading-relaxed">
              Lisanslı anlaşmalı eczanelerden doğrudan temin, soğuk zincir güvencesi ve
              onaylı e-reçete entegrasyonu.
            </p>

            {/* Arama */}
            <form
              onSubmit={(e) => { e.preventDefault(); search(); }}
              className="w-full max-w-2xl mt-8 flex items-center gap-2 bg-white border border-line rounded-full p-2 shadow-pop focus-within:border-brand transition-colors"
            >
              <Icon name="search" className="text-[22px] text-brand ml-3" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="İlaç adı, etken madde veya kategori arayın…"
                className="flex-1 bg-transparent outline-none text-[14.5px] py-2.5 placeholder:text-ink-faint"
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-[14px] font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                Ara
                <Icon name="arrow_forward" className="text-[17px]" />
              </button>
            </form>

            <div className="flex items-center flex-wrap justify-center gap-2 mt-4">
              <span className="text-[11.5px] text-ink-faint uppercase tracking-wider mr-1">Sık arananlar</span>
              {QUICK.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => search(t)}
                  className="bg-white border border-line hover:border-brand hover:text-brand text-ink-soft text-[12.5px] px-3 py-1.5 rounded-full transition-colors shadow-card"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- AKTİF SİPARİŞ (yalnızca giriş yapan kullanıcı) ---------- */}
      {activeOrder && (
        <section className="mb-10">
          <Link href={`/siparislerim/${activeOrder.id}`}>
            <Card className="p-4 flex items-center gap-4 hover:border-brand transition-colors">
              <span className="w-11 h-11 rounded-full bg-brand-light text-brand flex items-center justify-center shrink-0">
                <Icon name="receipt_long" className="text-[21px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone="brand" dot>{ORDER_LABELS[activeOrder.status]}</Badge>
                  <span className="font-mono text-[12px] text-ink-faint">#{activeOrder.id}</span>
                </div>
                <p className="text-[14px] mt-1 truncate">
                  {activeOrder.pharmacyName} · {money(activeOrder.total)}
                </p>
              </div>
              <span className="hidden sm:inline text-[13px] text-brand font-medium">Takip et</span>
              <Icon name="chevron_right" className="text-[20px] text-ink-faint" />
            </Card>
          </Link>
        </section>
      )}

      {/* ---------- 4 HIZLI AKSİYON (bento) ---------- */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <ActionCard
          href="/nobetci" accent="bg-alert" icon="emergency" tone="alert"
          badge={<Badge tone="alert" dot>{dutyCount} açık</Badge>}
          title="Nöbetçi Eczaneler"
          desc="Bu gece bölgenizde aktif nöbet tutan açık eczaneleri ve hazırlama sürelerini görüntüleyin."
          cta="Hemen gör" ctaStyle="bg-alert hover:bg-alert-dark text-white"
        />
        <ActionCard
          href="/recete-yukle" accent="bg-brand" icon="receipt_long" tone="brand"
          badge={<Badge tone="neutral">E-Nabız / Fotoğraf</Badge>}
          title="Reçetemle Sipariş Ver"
          desc="E-reçete kodunuzu girin veya reçetenizi fotoğraflayın; eczacı onayından sonra kapınıza gelsin."
          cta={currentUser ? "Reçete yükle" : "Giriş yapıp yükle"}
          ctaStyle="bg-brand hover:bg-brand-dark text-white"
          locked={!currentUser}
        />
        <ActionCard
          href="/ilac-arama" accent="bg-brand-tint" icon="inventory_2" tone="amber"
          badge={<Badge tone="brand">Anlık stok</Badge>}
          title="İlacımı Bul"
          desc="Zor bulunan ilaçları tarayın, en yakın ve en hızlı teslimat sağlayan eczaneleri listeleyin."
          cta="Stok sorgula" ctaStyle="border border-line hover:bg-line-soft text-ink"
        />
        <ActionCard
          href="/eczaneler" accent="bg-line" icon="map" tone="neutral"
          badge={<Badge tone="outline">500 m - 2 km</Badge>}
          title="En Yakın Eczaneler"
          desc="Konumunuza en yakın eczanelerin çalışma saatleri, telefonları ve mesafelerini inceleyin."
          cta="Listeyi aç" ctaStyle="border border-line hover:bg-line-soft text-ink"
        />
      </section>

      {/* ---------- KATEGORİLER ---------- */}
      <section className="mb-16">
        <div className="text-center max-w-lg mx-auto mb-7">
          <h2 className="font-display text-[24px] font-semibold tracking-tight">Sağlık &amp; bakım kategorileri</h2>
          <p className="text-[14px] text-ink-soft mt-1.5">
            Reçetesiz medikal ihtiyaçlarınız, dermokozmetik ve vitamin takviyeleri kapınızda.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((c) => (
            <button key={c.title} type="button" onClick={() => search(c.q)} className="text-left">
              <Card className="p-5 h-full flex flex-col items-center text-center hover:border-brand transition-colors group">
                <span className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${toneBg[c.tone]}`}>
                  <Icon name={c.icon} className="text-[28px]" />
                </span>
                <span className="text-[14px] font-medium">{c.title}</span>
                <span className="text-[12px] text-ink-soft mt-1">{c.sub}</span>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- SIK ARANAN İLAÇLAR ---------- */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-[22px] font-semibold tracking-tight">Sık aranan ilaçlar</h2>
            <p className="text-[13.5px] text-ink-soft mt-1">Anlık stok ve en yakın eczane bilgisi.</p>
          </div>
          <Link href="/ilac-arama" className="text-[13.5px] text-brand hover:underline inline-flex items-center gap-1">
            Tümü <Icon name="arrow_forward" className="text-[15px]" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {medicines.slice(0, 4).map((m) => {
            const av = stockFor(m.id).filter((s) => s.inStock);
            return (
              <Link key={m.id} href={`/ilac/${m.id}`}>
                <Card className="p-4 h-full hover:border-brand transition-colors">
                  <div className="flex items-center justify-between mb-2.5">
                    <Badge tone={m.prescriptionOnly ? "amber" : "brand"}>
                      {m.prescriptionOnly ? "Reçeteli" : "Reçetesiz"}
                    </Badge>
                    {m.reportRequired && <Badge tone="alert">Raporlu</Badge>}
                  </div>
                  <p className="font-medium text-[14.5px]">{m.name}</p>
                  <p className="text-[12.5px] text-ink-soft mt-0.5">{m.activeIngredient}</p>
                  <div className="flex items-center gap-1.5 mt-3.5 text-[12.5px]">
                    <span className={`w-1.5 h-1.5 rounded-full ${av.length ? "bg-brand" : "bg-amber"}`} />
                    <span className={av.length ? "text-brand" : "text-amber"}>
                      {av.length ? `${av.length} eczanede stokta` : "Yakında stok yok"}
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- NASIL ÇALIŞIR ---------- */}
      <section className="mb-16">
        <Card className="p-6 sm:p-8 bg-canvas">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative">
              <Image
                width={640} height={360} priority
                alt="Eczacı reçete kontrol ediyor"
                className="w-full h-72 object-cover rounded-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZJ9LRY8jR83b_sY9VhmVHpxwXafJqtsmaabHzB0R2z2H__GRBK6adM6BHGPo6j5FoI9fW9PubdF8Czuj3E5yG1tCgoJE11ihneUaBrZNOt6fEzAFD0aNiurJWitKZ8bme6Wg6S8kLPKn3VSpL0rpkXF0Ql4aYjhrRhrc4rsD9kQa-xYPEMOoMYmSFEoD_Gph113QMddjMT6xw3lNO3QBvKO0B9pyGyGWXyAIQwKyc4yWnAA3PE6q"
              />
              <div className="absolute -bottom-4 -right-3 bg-white border border-line rounded-lg shadow-pop px-3.5 py-3 flex items-center gap-2.5">
                <Icon name="verified" className="text-[24px] text-brand" />
                <div>
                  <p className="text-[12.5px] font-medium leading-tight">6197 Sayılı Kanun</p>
                  <p className="text-[11.5px] text-ink-soft">Eczacı Odası onaylı</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <span className="text-[11.5px] text-brand font-medium uppercase tracking-wider">Hızlı &amp; yasal süreç</span>
              <h2 className="font-display text-[24px] font-semibold tracking-tight mt-1.5 mb-6">
                EczaJet nasıl çalışır?
              </h2>
              <div className="space-y-5">
                {[
                  { n: 1, t: "Reçetenizi veya ilaç listenizi iletin", d: "E-reçete numaranızı girin ya da doktor kaşeli reçetenizin fotoğrafını yükleyin." },
                  { n: 2, t: "Nöbetçi / açık eczacı onaylasın", d: "Yetkili eczacı stok ve kullanım uygunluğunu denetler, raporlu ilaçlarda raporunuzu doğrular." },
                  { n: 3, t: "Özel korumalı kurye kapınızda", d: "Isı korumalı tıbbi lojistik çantasıyla ortalama 30 dakikada adresinize ulaşır." },
                ].map((s) => (
                  <div key={s.n} className="flex items-start gap-3.5">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-brand text-white font-mono text-[12px] flex items-center justify-center">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="text-[14.5px] font-medium">{s.t}</h3>
                      <p className="text-[13.5px] text-ink-soft mt-1 leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ---------- GÜVEN ROZETLERİ ---------- */}
      <section className="grid sm:grid-cols-3 gap-3 mb-16">
        {[
          { icon: "health_and_safety", t: "Bakanlık onaylı eczaneler", d: "Sadece T.C. Sağlık Bakanlığı ruhsatlı resmi eczaneler." },
          { icon: "lock", t: "Güvenli reçete doğrulama", d: "SGK ve Medula uyumlu çift aşamalı veri güvenliği." },
          { icon: "timer", t: "30 dakikada hızlı teslimat", d: "Acil ilaç ihtiyaçlarında kesintisiz kurye ağı." },
        ].map((b) => (
          <Card key={b.t} className="p-4 flex items-center gap-3.5">
            <span className="w-11 h-11 rounded-full bg-brand-light text-brand flex items-center justify-center shrink-0">
              <Icon name={b.icon} className="text-[22px]" />
            </span>
            <div>
              <h3 className="text-[14px] font-medium">{b.t}</h3>
              <p className="text-[12.5px] text-ink-soft mt-0.5 leading-relaxed">{b.d}</p>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}

function ActionCard({
  href, icon, title, desc, badge, cta, ctaStyle, accent, tone, locked,
}: {
  href: string; icon: string; title: string; desc: string;
  badge: React.ReactNode; cta: string; ctaStyle: string; accent: string;
  tone: keyof typeof toneBg; locked?: boolean;
}) {
  return (
    <Link href={href} className="group">
      <Card className="relative overflow-hidden h-full p-5 flex flex-col hover:shadow-pop transition-shadow">
        <span className={`absolute top-0 left-0 right-0 h-1 ${accent}`} />
        <div className="flex items-center justify-between mb-4 mt-1">
          <span className={`w-11 h-11 rounded-full flex items-center justify-center ${toneBg[tone]}`}>
            <Icon name={icon} className="text-[23px]" />
          </span>
          {badge}
        </div>
        <h3 className="text-[15.5px] font-medium">{title}</h3>
        <p className="text-[13px] text-ink-soft mt-1.5 leading-relaxed flex-1">{desc}</p>
        <span className={`mt-5 inline-flex items-center justify-center gap-1.5 w-full rounded-full py-2.5 text-[13.5px] font-medium transition-colors ${ctaStyle}`}>
          {locked && <Icon name="lock" className="text-[15px]" />}
          {cta}
          <Icon name="chevron_right" className="text-[16px]" />
        </span>
      </Card>
    </Link>
  );
}
