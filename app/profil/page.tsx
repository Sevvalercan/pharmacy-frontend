"use client";

import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, Field, Icon, PageTitle, SecureNote, inputCls } from "@/components/ui";

export default function Page() {
  return <AuthGuard><Profile /></AuthGuard>;
}

function Profile() {
  const { currentUser, orders, favorites, addresses, logout } = useStore();
  if (!currentUser) return null;
  const mine = orders.filter((o) => o.userId === currentUser.id);

  return (
    <div className="max-w-shell mx-auto px-5 py-10">
      <PageTitle title="Profilim" subtitle="Hesap bilgileriniz ve sağlık tercihleri." />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-5 text-center">
            <span className="w-16 h-16 rounded-full bg-brand-light text-brand-dark font-display text-[22px] font-semibold flex items-center justify-center mx-auto mb-3">
              {currentUser.name.slice(0, 1)}
            </span>
            <h2 className="font-display text-[17px] font-semibold">{currentUser.name}</h2>
            <p className="text-[12.5px] text-ink-soft mt-0.5">{currentUser.email}</p>
            <div className="mt-2.5"><Badge tone="brand">Doğrulanmış hasta hesabı</Badge></div>

            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-line">
              {[[mine.length, "Sipariş"], [favorites.length, "Favori"], [addresses.length, "Adres"]].map(([v, l]) => (
                <div key={String(l)}>
                  <p className="font-display text-[17px] font-semibold text-brand">{v}</p>
                  <p className="text-[11.5px] text-ink-soft">{l}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-2">
            {[
              { href: "/siparislerim", icon: "receipt_long", label: "Siparişlerim" },
              { href: "/favoriler", icon: "favorite", label: "Favori eczanelerim" },
              { href: "/adresler", icon: "location_on", label: "Adreslerim" },
              { href: "/bildirimler", icon: "notifications", label: "Bildirimlerim" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-line-soft text-[13.5px] text-ink-soft hover:text-ink transition-colors">
                <Icon name={l.icon} className="text-[18px]" />
                <span className="flex-1">{l.label}</span>
                <Icon name="chevron_right" className="text-[16px] text-ink-faint" />
              </Link>
            ))}
            <button type="button" onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded hover:bg-alert-light text-[13.5px] text-alert transition-colors">
              <Icon name="logout" className="text-[18px]" />
              Çıkış yap
            </button>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="font-medium text-[15px] mb-4">Hesap bilgileri</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Ad soyad"><input className={inputCls} defaultValue={currentUser.name} /></Field>
              <Field label="Telefon"><input className={inputCls} defaultValue={currentUser.phone} /></Field>
              <div className="sm:col-span-2">
                <Field label="E-posta"><input className={inputCls} defaultValue={currentUser.email} /></Field>
              </div>
            </div>
            <div className="mt-4"><Button size="sm">Değişiklikleri kaydet</Button></div>
          </Card>

          <Card className="p-5">
            <h3 className="font-medium text-[15px] mb-4">Bildirim tercihleri</h3>
            <div className="space-y-3">
              {[
                ["Sipariş durumu bildirimleri", true],
                ["Stok geldi bildirimleri", true],
                ["Nöbetçi eczane hatırlatmaları", true],
                ["Kampanya ve duyurular", false],
              ].map(([label, on]) => (
                <label key={String(label)} className="flex items-center justify-between cursor-pointer">
                  <span className="text-[13.5px] text-ink-soft">{label}</span>
                  <input type="checkbox" defaultChecked={on as boolean} className="w-4 h-4 accent-[#0d6e66]" />
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-medium text-[15px] mb-3">Gizlilik ve güvenlik</h3>
            <SecureNote>
              Sağlık verileriniz KVKK sağlık verileri yönetmeliği kapsamında işlenir. Reçeteleriniz
              yalnızca ilgili eczacı ile paylaşılır ve teslimattan sonra erişime kapatılır.
            </SecureNote>
            <div className="flex flex-wrap gap-3 mt-4 text-[13px]">
              <a href="#" className="text-brand hover:underline">KVKK aydınlatma metni</a>
              <a href="#" className="text-brand hover:underline">Veri indirme talebi</a>
              <a href="#" className="text-alert hover:underline">Hesabımı sil</a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
