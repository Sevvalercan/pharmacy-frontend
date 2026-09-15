"use client";

import AuthGuard from "@/components/AuthGuard";
import PanelShell, { PanelLink } from "@/components/PanelShell";

const LINKS: PanelLink[] = [
  { href: "/vendor", icon: "dashboard", label: "Genel bakış" },
  { href: "/vendor/siparisler", icon: "receipt_long", label: "Siparişler" },
  { href: "/vendor/stok", icon: "inventory_2", label: "Stok yönetimi" },
  { href: "/vendor/profil", icon: "storefront", label: "Eczane profili" },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["vendor"]} title="Eczane paneli girişi"
      description="Bu alan yalnızca platforma kayıtlı eczaneler içindir.">
      <PanelShell links={LINKS} title="Eczane Paneli">{children}</PanelShell>
    </AuthGuard>
  );
}
