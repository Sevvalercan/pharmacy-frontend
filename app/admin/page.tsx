"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { medicines, money } from "@/lib/data";
import { ORDER_LABELS } from "@/lib/types";
import { Badge, Card, Icon, PageTitle, Stat } from "@/components/ui";

export default function AdminDashboard() {
  const { users, pharmacies, orders, stock, prescriptions } = useStore();

  const patients = users.filter((u) => u.role === "user");
  const activeOrders = orders.filter((o) => !["delivered", "rejected"].includes(o.status));
  const today = orders.filter((o) => o.createdAt.startsWith("2026-09-15"));
  const outOfStock = stock.filter((s) => !s.inStock).length;
  const pendingApproval = pharmacies.filter((p) => !p.approved);
  const pendingRx = prescriptions.filter((p) => p.status === "pending");

  return (
    <>
      <PageTitle title="Platform genel bakış" subtitle="Tüm sistem aktivitelerinin merkezi görünümü." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Toplam kullanıcı" value={patients.length} icon="group" />
        <Stat label="Kayıtlı eczane" value={pharmacies.length} icon="storefront" tone="neutral" />
        <Stat label="Aktif sipariş" value={activeOrders.length} icon="local_shipping" tone="amber" />
        <Stat label="Katalogdaki ilaç" value={medicines.length} icon="pill" tone="brand" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="p-5">
          <h3 className="font-medium text-[15px] mb-3">Bugünkü hareket</h3>
          <p className="font-display text-[30px] font-semibold">{today.length}</p>
          <p className="text-[13px] text-ink-soft">sipariş oluşturuldu</p>
          <div className="h-px bg-line my-3" />
          <p className="text-[13px] text-ink-soft">
            Toplam ciro: <span className="font-medium text-ink">{money(orders.reduce((t, o) => t + o.total, 0))}</span>
          </p>
        </Card>

        <Card className="p-5">
          <h3 className="font-medium text-[15px] mb-3">Stok durumu</h3>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-[30px] font-semibold text-alert">{outOfStock}</p>
            <span className="text-[13px] text-ink-soft">tükenen kalem</span>
          </div>
          <div className="h-px bg-line my-3" />
          <p className="text-[13px] text-ink-soft">{stock.length} toplam stok kaydı izleniyor</p>
        </Card>

        <Card className="p-5">
          <h3 className="font-medium text-[15px] mb-3">Onay bekleyenler</h3>
          <div className="space-y-2">
            <Link href="/admin/eczaneler" className="flex items-center justify-between text-[13px] hover:text-brand">
              <span>Eczane başvurusu</span>
              <Badge tone={pendingApproval.length ? "amber" : "neutral"}>{pendingApproval.length}</Badge>
            </Link>
            <Link href="/admin/receteler" className="flex items-center justify-between text-[13px] hover:text-brand">
              <span>Reçete doğrulaması</span>
              <Badge tone={pendingRx.length ? "amber" : "neutral"}>{pendingRx.length}</Badge>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-[15px]">Son sistem aktiviteleri</h3>
          <Link href="/admin/siparisler" className="text-[13px] text-brand hover:underline">Tüm siparişler</Link>
        </div>
        <div className="space-y-1">
          {orders.slice(0, 6).map((o) => (
            <div key={o.id} className="flex items-center gap-3 py-2.5 border-b border-line-soft last:border-0 text-[13px]">
              <span className="w-7 h-7 rounded-full bg-canvas flex items-center justify-center shrink-0">
                <Icon name="receipt_long" className="text-[15px] text-ink-soft" />
              </span>
              <span className="font-mono text-[12px] text-ink-faint">#{o.id}</span>
              <span className="flex-1 truncate text-ink-soft">{o.userName} → {o.pharmacyName}</span>
              <Badge tone="outline">{ORDER_LABELS[o.status]}</Badge>
              <span className="text-[12px] text-ink-faint hidden sm:block">{o.createdAt}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
