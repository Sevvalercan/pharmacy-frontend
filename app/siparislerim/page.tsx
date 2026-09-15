"use client";

import Link from "next/link";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { money } from "@/lib/data";
import { ORDER_LABELS } from "@/lib/types";
import { Badge, Card, Empty, Icon, PageTitle } from "@/components/ui";

export default function Page() {
  return (
    <AuthGuard title="Siparişlerinizi görmek için giriş yapın">
      <OrdersList />
    </AuthGuard>
  );
}

function OrdersList() {
  const { orders, currentUser } = useStore();
  const [tab, setTab] = useState<"active" | "past">("active");

  const mine = orders.filter((o) => o.userId === currentUser?.id);
  const list = mine.filter((o) =>
    tab === "active" ? !["delivered", "rejected"].includes(o.status) : ["delivered", "rejected"].includes(o.status)
  );

  return (
    <div className="max-w-shell mx-auto px-5 py-10">
      <PageTitle title="Siparişlerim" subtitle="Aktif ve geçmiş ilaç siparişleriniz." />
      <div className="flex gap-1.5 mb-6">
        {([["active", "Aktif"], ["past", "Geçmiş"]] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setTab(k)}
            className={`px-4 py-1.5 rounded-full text-[13px] transition-colors ${
              tab === k ? "bg-brand text-white" : "bg-white border border-line text-ink-soft hover:border-brand"
            }`}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {list.length === 0 && <Empty icon="receipt_long" text={tab === "active" ? "Aktif siparişiniz yok." : "Geçmiş siparişiniz yok."} />}
        {list.map((o) => (
          <Link key={o.id} href={`/siparislerim/${o.id}`}>
            <Card className="p-4 hover:border-brand transition-colors flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[12px] text-ink-faint">#{o.id}</span>
                  <Badge tone={o.status === "delivered" ? "neutral" : o.status === "rejected" ? "alert" : "brand"}
                    dot={!["delivered", "rejected"].includes(o.status)}>
                    {ORDER_LABELS[o.status]}
                  </Badge>
                  {o.reportRequest && <Badge tone="amber">Raporlu</Badge>}
                </div>
                <p className="text-[14px] font-medium mt-1.5">{o.pharmacyName}</p>
                <p className="text-[12.5px] text-ink-soft mt-0.5 truncate">
                  {o.lines.map((l) => l.name).join(", ")} · {o.createdAt}
                </p>
              </div>
              <span className="text-[14px] font-medium shrink-0">{money(o.total)}</span>
              <Icon name="chevron_right" className="text-[19px] text-ink-faint" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
