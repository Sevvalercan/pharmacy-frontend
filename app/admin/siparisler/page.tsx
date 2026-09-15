"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { money } from "@/lib/data";
import { ORDER_LABELS, OrderStatus } from "@/lib/types";
import { Badge, Card, Empty, PageTitle } from "@/components/ui";

const FILTERS: ("all" | OrderStatus)[] = ["all", "created", "approved", "preparing", "ready", "delivering", "delivered", "rejected"];

export default function AdminOrders() {
  const { orders } = useStore();
  const [f, setF] = useState<"all" | OrderStatus>("all");
  const list = f === "all" ? orders : orders.filter((o) => o.status === f);

  return (
    <>
      <PageTitle title="Tüm siparişler" subtitle="Platformdaki her siparişin durumunu izleyin." />

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {FILTERS.map((k) => (
          <button key={k} type="button" onClick={() => setF(k)}
            className={`px-3 py-1.5 rounded-full text-[12.5px] whitespace-nowrap transition-colors ${
              f === k ? "bg-brand text-white" : "bg-white border border-line text-ink-soft hover:border-brand"
            }`}>
            {k === "all" ? "Tümü" : ORDER_LABELS[k]}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[auto_1.5fr_1.5fr_1fr_1fr_auto] gap-3 px-4 py-2.5 bg-canvas border-b border-line text-[11.5px] text-ink-faint uppercase tracking-wide">
          <span>No</span><span>Hasta</span><span>Eczane</span><span>Tarih</span><span>Durum</span><span>Tutar</span>
        </div>
        {list.length === 0 && <div className="p-4"><Empty icon="receipt_long" text="Sipariş bulunamadı." /></div>}
        {list.map((o) => (
          <div key={o.id} className="grid md:grid-cols-[auto_1.5fr_1.5fr_1fr_1fr_auto] gap-3 px-4 py-3 border-b border-line-soft last:border-0 items-center text-[13px]">
            <span className="font-mono text-[12px] text-ink-faint">#{o.id}</span>
            <span className="font-medium">{o.userName}</span>
            <span className="text-ink-soft">{o.pharmacyName}</span>
            <span className="text-ink-soft text-[12px]">{o.createdAt}</span>
            <Badge tone={o.status === "rejected" ? "alert" : o.status === "delivered" ? "neutral" : "brand"}>
              {ORDER_LABELS[o.status]}
            </Badge>
            <span className="font-medium md:text-right">{money(o.total)}</span>
          </div>
        ))}
      </Card>
    </>
  );
}
