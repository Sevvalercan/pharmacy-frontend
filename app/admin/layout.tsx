"use client";

import AuthGuard from "@/components/AuthGuard";
import PanelShell, { PanelLink } from "@/components/PanelShell";

const LINKS: PanelLink[] = [
  { href: "/admin", icon: "dashboard", label: "Genel bakış" },
  { href: "/admin/kullanicilar", icon: "group", label: "Kullanıcılar" },
  { href: "/admin/eczaneler", icon: "storefront", label: "Eczaneler" },
  { href: "/admin/ilaclar", icon: "pill", label: "İlaç kataloğu" },
  { href: "/admin/siparisler", icon: "receipt_long", label: "Siparişler" },
  { href: "/admin/receteler", icon: "description", label: "Reçeteler" },
  { href: "/admin/bildirimler", icon: "campaign", label: "Bildirimler" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["admin"]} title="Yönetim paneli girişi"
      description="Bu alan yalnızca platform yöneticileri içindir.">
      <PanelShell links={LINKS} title="Yönetim Paneli" accent="ink">{children}</PanelShell>
    </AuthGuard>
  );
}
