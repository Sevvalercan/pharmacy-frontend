"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "./ui";

const LINKS = [
  { href: "/eczaneler", label: "Eczaneler" },
  { href: "/nobetci", label: "Nöbetçi" },
  { href: "/ilac-arama", label: "İlaç Ara" },
  { href: "/recete-yukle", label: "Reçete" },
];

const PRIVATE = [
  { href: "/siparislerim", label: "Siparişlerim" },
  { href: "/favoriler", label: "Favorilerim" },
];

export default function Header() {
  const pathname = usePathname();
  const { currentUser, notifications, logout, markNotificationsRead } = useStore();
  const [menu, setMenu] = useState(false);
  const [bell, setBell] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mine = notifications.filter((n) => n.userId === currentUser?.id);
  const unread = mine.filter((n) => !n.read).length;

  useEffect(() => { setMenu(false); setBell(false); }, [pathname]);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setMenu(false); setBell(false); }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const links = currentUser?.role === "user" ? [...LINKS, ...PRIVATE] : LINKS;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-line">
      <div className="max-w-shell mx-auto px-5 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center">
            <Icon name="medication_liquid" className="text-[16px]" />
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight">EczaJet</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-[13.5px]">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  active ? "bg-brand-light text-brand-dark font-medium" : "text-ink-soft hover:text-ink hover:bg-line-soft"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2" ref={ref}>
          {!currentUser ? (
            <>
              <Link href="/giris" className="text-[13.5px] text-ink-soft hover:text-ink px-3 py-1.5 rounded-full hover:bg-line-soft transition-colors">
                Giriş yap
              </Link>
              <Link href="/kayit" className="text-[13.5px] bg-brand text-white px-3.5 py-1.5 rounded-full hover:bg-brand-dark transition-colors">
                Kayıt ol
              </Link>
            </>
          ) : (
            <>
              <div className="relative">
                <button
                  type="button"
                  aria-label="Bildirimler"
                  onClick={() => { setBell((v) => !v); setMenu(false); }}
                  className="relative w-9 h-9 rounded-full hover:bg-line-soft flex items-center justify-center text-ink-soft transition-colors"
                >
                  <Icon name="notifications" className="text-[20px]" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 bg-alert text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      {unread}
                    </span>
                  )}
                </button>
                {bell && (
                  <div className="absolute right-0 mt-2 w-[320px] bg-white border border-line rounded-lg shadow-pop overflow-hidden rise">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
                      <span className="text-[13px] font-medium">Bildirimler</span>
                      {unread > 0 && (
                        <button type="button" onClick={markNotificationsRead} className="text-[12px] text-brand hover:underline">
                          Tümünü okundu say
                        </button>
                      )}
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {mine.length === 0 && <p className="px-4 py-6 text-[13px] text-ink-faint text-center">Henüz bildirim yok.</p>}
                      {mine.slice(0, 8).map((n) => (
                        <div key={n.id} className={`px-4 py-3 border-b border-line-soft last:border-0 ${n.read ? "" : "bg-brand-light/40"}`}>
                          <p className="text-[13px] font-medium">{n.title}</p>
                          <p className="text-[12.5px] text-ink-soft mt-0.5 leading-snug">{n.body}</p>
                          <p className="text-[11px] text-ink-faint mt-1">{n.createdAt}</p>
                        </div>
                      ))}
                    </div>
                    <Link href="/bildirimler" className="block text-center text-[13px] text-brand py-2.5 hover:bg-line-soft">
                      Tümünü gör
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setMenu((v) => !v); setBell(false); }}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full hover:bg-line-soft transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-light text-brand-dark text-[11px] font-semibold flex items-center justify-center">
                    {currentUser.name.slice(0, 1)}
                  </span>
                  <span className="hidden sm:block text-[13.5px] max-w-[130px] truncate">{currentUser.name}</span>
                  <Icon name="expand_more" className="text-[16px] text-ink-faint" />
                </button>
                {menu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-line rounded-lg shadow-pop overflow-hidden rise">
                    <div className="px-4 py-3 border-b border-line">
                      <p className="text-[13.5px] font-medium truncate">{currentUser.name}</p>
                      <p className="text-[12px] text-ink-faint truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1.5 text-[11px] bg-brand-light text-brand-dark px-2 py-0.5 rounded-full">
                        {currentUser.role === "user" ? "Hasta hesabı" : currentUser.role === "vendor" ? "Eczane paneli" : "Yönetici"}
                      </span>
                    </div>
                    <nav className="py-1 text-[13.5px]">
                      {currentUser.role === "user" && (
                        <>
                          <MenuLink href="/profil" icon="person">Profilim</MenuLink>
                          <MenuLink href="/siparislerim" icon="receipt_long">Siparişlerim</MenuLink>
                          <MenuLink href="/favoriler" icon="favorite">Favori eczanelerim</MenuLink>
                          <MenuLink href="/adresler" icon="location_on">Adreslerim</MenuLink>
                        </>
                      )}
                      {currentUser.role === "vendor" && (
                        <>
                          <MenuLink href="/vendor" icon="dashboard">Eczane paneli</MenuLink>
                          <MenuLink href="/vendor/siparisler" icon="orders">Siparişler</MenuLink>
                          <MenuLink href="/vendor/stok" icon="inventory_2">Stok yönetimi</MenuLink>
                        </>
                      )}
                      {currentUser.role === "admin" && (
                        <>
                          <MenuLink href="/admin" icon="dashboard">Yönetim paneli</MenuLink>
                          <MenuLink href="/admin/kullanicilar" icon="group">Kullanıcılar</MenuLink>
                          <MenuLink href="/admin/eczaneler" icon="storefront">Eczaneler</MenuLink>
                        </>
                      )}
                    </nav>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[13.5px] text-alert hover:bg-alert-light border-t border-line"
                    >
                      <Icon name="logout" className="text-[17px]" />
                      Çıkış yap
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden border-t border-line-soft overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-full text-[13px] whitespace-nowrap ${
                  active ? "bg-brand text-white" : "text-ink-soft bg-line-soft"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function MenuLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-4 py-2 hover:bg-line-soft text-ink-soft hover:text-ink">
      <Icon name={icon} className="text-[17px]" />
      {children}
    </Link>
  );
}
