"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { money } from "@/lib/data";
import { ORDER_LABELS } from "@/lib/types";
import { Badge, Card, Empty, Icon, PageTitle, Stat } from "@/components/ui";

export default function VendorDashboard() {
  const { currentUser, orders, stock, pharmacies } = useStore();
  const pid = currentUser?.pharmacyId ?? "";
  const pharmacy = pharmacies.find((p) => p.id === pid);
  const mine = orders.filter((o) => o.pharmacyId === pid);

  const pending = mine.filter((o) => o.status === "created");
  const preparing = mine.filter((o) => ["approved", "preparing"].includes(o.status));
  const ready = mine.filter((o) => ["ready", "delivering"].includes(o.status));
  const done = mine.filter((o) => o.status === "delivered");
  const myStock = stock.filter((s) => s.pharmacyId === pid);
  const lowStock = myStock.filter((s) => s.inStock && s.quantity <= 6);
  const outStock = myStock.filter((s) => !s.inStock);
  const revenue = done.reduce((t, o) => t + o.total, 0);

  return (
    <>
      <PageTitle title={pharmacy?.name ?? "Eczane paneli"}
        subtitle={`${pharmacy?.district} · ${pharmacy?.duty ? "Bu gece nöbetçi" : "Normal mesai"}`}
        action={<Badge tone={pharmacy?.open ? "brand" : "neutral"} dot={pharmacy?.open}>
          {pharmacy?.open ? "Açık" : "Kapalı"}
        </Badge>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Bekleyen sipariş" value={pending.length} icon="pending_actions" tone="alert" />
        <Stat label="Hazırlanıyor" value={preparing.length} icon="science" tone="amber" />
        <Stat label="Yolda / hazır" value={ready.length} icon="local_shipping" tone="brand" />
        <Stat label="Bugünkü ciro" value={money(revenue)} icon="payments" tone="neutral" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-[15px]">Onay bekleyen siparişler</h2>
            <Link href="/vendor/siparisler" className="text-[13px] text-brand hover:underline">Tümü</Link>
          </div>
          <div className="space-y-2">
            {pending.length === 0 && <Empty icon="inbox" text="Bekleyen sipariş yok." />}
            {pending.slice(0, 4).map((o) => (
              <Link key={o.id} href="/vendor/siparisler"
                className="flex items-center gap-3 border border-line rounded p-3 hover:border-brand transition-colors">
                <span className="w-8 h-8 rounded-full bg-alert-light text-alert flex items-center justify-center shrink-0">
                  <Icon name="priority_high" className="text-[17px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium">{o.userName}</p>
                  <p className="text-[12px] text-ink-soft truncate">
                    #{o.id} · {o.lines.length} ilaç · {o.createdAt.slice(-5)}
                  </p>
                </div>
                {o.reportRequest && <Badge tone="amber">Raporlu</Badge>}
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-[15px]">Stok uyarıları</h2>
            <Link href="/vendor/stok" className="text-[13px] text-brand hover:underline">Stok yönetimi</Link>
          </div>
          <div className="space-y-2">
            {lowStock.length === 0 && outStock.length === 0 && <Empty icon="check_circle" text="Stok seviyeleri normal." />}
            {outStock.map((s) => (
              <div key={s.medicineId} className="flex items-center justify-between border border-line rounded p-3">
                <span className="text-[13.5px]">{s.medicineId}</span>
                <Badge tone="alert">Tükendi</Badge>
              </div>
            ))}
            {lowStock.map((s) => (
              <div key={s.medicineId} className="flex items-center justify-between border border-line rounded p-3">
                <span className="text-[13.5px]">{s.medicineId}</span>
                <Badge tone="amber">Kritik: {s.quantity} adet</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="font-medium text-[15px] mb-4">Haftalık sipariş özeti</h2>
          <div className="grid grid-cols-5 gap-3 text-center">
            {[
              ["Toplam", mine.length, "neutral"],
              ["Bekleyen", pending.length, "alert"],
              ["Hazırlanan", preparing.length, "amber"],
              ["Tamamlanan", done.length, "brand"],
              ["Reddedilen", mine.filter((o) => o.status === "rejected").length, "neutral"],
            ].map(([l, v]) => (
              <div key={String(l)} className="border border-line rounded p-3">
                <p className="font-display text-[20px] font-semibold">{v as number}</p>
                <p className="text-[12px] text-ink-soft mt-0.5">{l as string}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5">
            {mine.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-[13px] border-b border-line-soft last:border-0 py-2">
                <span className="font-mono text-[12px] text-ink-faint">#{o.id}</span>
                <span className="flex-1 px-3 truncate text-ink-soft">{o.userName}</span>
                <Badge tone="outline">{ORDER_LABELS[o.status]}</Badge>
                <span className="ml-3 font-medium">{money(o.total)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
