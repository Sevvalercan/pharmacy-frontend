"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { medicines, money, prescriptions } from "@/lib/data";
import { ORDER_LABELS, OrderStatus } from "@/lib/types";
import { Badge, Button, Card, Empty, Icon, PageTitle, SecureNote } from "@/components/ui";

const TABS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "created", label: "Bekleyen" },
  { key: "preparing", label: "Hazırlanan" },
  { key: "ready", label: "Hazır" },
  { key: "delivered", label: "Tamamlanan" },
];

const NEXT: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  created: { status: "approved", label: "Onayla" },
  approved: { status: "preparing", label: "Hazırlamaya al" },
  preparing: { status: "ready", label: "Hazır olarak işaretle" },
  ready: { status: "delivering", label: "Kuryeye ver" },
  delivering: { status: "delivered", label: "Teslim edildi" },
};

export default function VendorOrders() {
  const { currentUser, orders, setOrderStatus } = useStore();
  const pid = currentUser?.pharmacyId ?? "";
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const mine = orders.filter((o) => o.pharmacyId === pid);
  const list = tab === "all" ? mine
    : tab === "preparing" ? mine.filter((o) => ["approved", "preparing"].includes(o.status))
    : tab === "ready" ? mine.filter((o) => ["ready", "delivering"].includes(o.status))
    : mine.filter((o) => o.status === tab);

  return (
    <>
      <PageTitle title="Sipariş yönetimi" subtitle="Gelen talepleri onaylayın, hazırlayın ve teslim edin." />

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              tab === t.key ? "bg-brand text-white" : "bg-white border border-line text-ink-soft hover:border-brand"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {list.length === 0 && <Empty icon="inbox" text="Bu durumda sipariş yok." />}
        {list.map((o) => {
          const open = openId === o.id;
          const next = NEXT[o.status];
          const rx = prescriptions.find((p) => p.id === o.prescriptionId);
          return (
            <Card key={o.id} className="overflow-hidden">
              <button type="button" onClick={() => setOpenId(open ? null : o.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-canvas transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[12px] text-ink-faint">#{o.id}</span>
                    <Badge tone={o.status === "created" ? "alert" : o.status === "delivered" ? "neutral" : "brand"}
                      dot={o.status === "created"}>
                      {ORDER_LABELS[o.status]}
                    </Badge>
                    {o.reportRequest && <Badge tone="amber">Raporlu</Badge>}
                  </div>
                  <p className="text-[14px] font-medium mt-1.5">{o.userName}</p>
                  <p className="text-[12.5px] text-ink-soft mt-0.5">
                    {o.lines.length} kalem · {o.createdAt}
                  </p>
                </div>
                <span className="text-[14px] font-medium">{money(o.total)}</span>
                <Icon name={open ? "expand_less" : "expand_more"} className="text-[20px] text-ink-faint" />
              </button>

              {open && (
                <div className="border-t border-line p-4 space-y-4 bg-canvas">
                  <div className="grid sm:grid-cols-2 gap-4 text-[13px]">
                    <div>
                      <p className="text-[11.5px] text-ink-faint uppercase tracking-wide mb-1.5">Teslimat adresi</p>
                      <p className="font-medium">{o.addressLabel}</p>
                      <p className="text-ink-soft">{o.addressDetail}</p>
                      {o.note && <p className="text-ink-faint text-[12px] mt-1">Not: {o.note}</p>}
                    </div>
                    <div>
                      <p className="text-[11.5px] text-ink-faint uppercase tracking-wide mb-1.5">Reçete</p>
                      {rx ? (
                        <>
                          <p className="font-medium font-mono">{rx.id} · {rx.code}</p>
                          <p className="text-ink-soft">{rx.source} · {rx.status === "verified" ? "Doğrulandı" : "Onay bekliyor"}</p>
                          {rx.reportNo && <p className="text-ink-soft">Rapor no: {rx.reportNo}</p>}
                        </>
                      ) : <p className="text-ink-faint">Reçete eklenmemiş</p>}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11.5px] text-ink-faint uppercase tracking-wide mb-2">İstenen ilaçlar</p>
                    <div className="space-y-1.5">
                      {o.lines.map((l) => {
                        const m = medicines.find((x) => x.id === l.medicineId);
                        return (
                          <div key={l.medicineId} className="flex items-center justify-between bg-white border border-line rounded px-3 py-2 text-[13px]">
                            <span className="flex items-center gap-2">
                              {l.name} × {l.quantity}
                              {m?.reportRequired && <Badge tone="alert">Rapor</Badge>}
                            </span>
                            <span className="font-medium">{money(l.price * l.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <SecureNote>
                    Reçete belgesi yalnızca bu sipariş süresince görüntülenebilir. Ekran görüntüsü almak
                    ve üçüncü kişilerle paylaşmak KVKK kapsamında yasaktır.
                  </SecureNote>

                  <div className="flex flex-wrap gap-2">
                    {next && (
                      <Button size="sm" onClick={() => setOrderStatus(o.id, next.status)}>
                        <Icon name="check" className="text-[16px]" /> {next.label}
                      </Button>
                    )}
                    {o.status === "created" && (
                      <Button size="sm" variant="danger" onClick={() => setOrderStatus(o.id, "rejected")}>
                        <Icon name="close" className="text-[16px]" /> Reddet
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Icon name="call" className="text-[16px]" /> Hastayı ara
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
