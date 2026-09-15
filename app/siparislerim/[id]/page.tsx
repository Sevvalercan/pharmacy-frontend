"use client";

import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { money } from "@/lib/data";
import { ORDER_FLOW, ORDER_LABELS } from "@/lib/types";
import { Badge, Button, Card, Empty, Icon, SecureNote } from "@/components/ui";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <AuthGuard title="Sipariş detayı için giriş yapın">
      <OrderDetail id={params.id} />
    </AuthGuard>
  );
}

function OrderDetail({ id }: { id: string }) {
  const { orders, currentUser } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order || (currentUser?.role === "user" && order.userId !== currentUser.id)) {
    return <div className="max-w-2xl mx-auto px-5 py-16"><Empty text="Sipariş bulunamadı." /></div>;
  }

  const stepIndex = ORDER_FLOW.indexOf(order.status);
  const rejected = order.status === "rejected";

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link href="/siparislerim" className="inline-flex items-center gap-1 text-[13px] text-ink-soft hover:text-ink mb-5">
        <Icon name="arrow_back" className="text-[17px]" /> Siparişlerime dön
      </Link>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <span className="font-mono text-[12px] text-ink-faint">#{order.id}</span>
            <h1 className="font-display text-[20px] font-semibold mt-0.5">{order.pharmacyName}</h1>
            <p className="text-[12.5px] text-ink-soft mt-1">{order.createdAt}</p>
          </div>
          <Badge tone={rejected ? "alert" : order.status === "delivered" ? "neutral" : "brand"} dot={!rejected && order.status !== "delivered"}>
            {ORDER_LABELS[order.status]}
          </Badge>
        </div>

        {rejected ? (
          <div className="flex items-start gap-2 bg-alert-light border border-alert/15 rounded p-3 mb-6">
            <Icon name="cancel" className="text-[18px] text-alert mt-[1px]" />
            <p className="text-[13px] text-alert-dark">
              Bu sipariş eczane tarafından reddedildi. Farklı bir eczaneden yeniden deneyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex gap-1 mb-3">
              {ORDER_FLOW.map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full ${i <= stepIndex ? "bg-brand" : "bg-line"}`} />
              ))}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ORDER_FLOW.map((s, i) => (
                <div key={s} className="text-center">
                  <span className={`block w-2 h-2 rounded-full mx-auto mb-1.5 ${i <= stepIndex ? "bg-brand" : "bg-line"}`} />
                  <p className={`text-[10.5px] leading-tight ${i <= stepIndex ? "text-ink font-medium" : "text-ink-faint"}`}>
                    {ORDER_LABELS[s]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.reportRequest && (
          <div className="flex items-start gap-2 bg-amber-light border border-amber/20 rounded p-3 mb-5">
            <Icon name="assignment" className="text-[17px] text-amber mt-[1px]" />
            <p className="text-[12.5px] text-amber leading-relaxed">
              Raporlu ilaç talebi — eczane, teslimattan önce raporunuzu doğrulamak için sizinle iletişime geçecek.
            </p>
          </div>
        )}

        <div className="space-y-2 text-[13.5px]">
          {order.lines.map((l) => (
            <div key={l.medicineId} className="flex justify-between gap-4">
              <span className="text-ink-soft">{l.name} × {l.quantity}</span>
              <span className="font-medium">{money(l.price * l.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-4">
            <span className="text-ink-soft">Kurye bedeli</span>
            <span className="font-medium">{money(29.9)}</span>
          </div>
        </div>

        <div className="h-px bg-line my-4" />
        <div className="flex justify-between items-center mb-5">
          <span className="text-[14px] font-medium">Toplam</span>
          <span className="font-display text-[18px] font-semibold text-brand">{money(order.total)}</span>
        </div>

        <div className="bg-canvas rounded p-3.5 text-[13px] mb-5">
          <p className="font-medium mb-0.5">{order.addressLabel}</p>
          <p className="text-ink-soft">{order.addressDetail}</p>
          {order.note && <p className="text-ink-faint text-[12px] mt-1.5">Kurye notu: {order.note}</p>}
        </div>

        {order.status === "delivered" ? (
          <Button href="/recete-yukle" variant="outline" full>
            <Icon name="replay" className="text-[16px]" /> Tekrar sipariş ver
          </Button>
        ) : !rejected ? (
          <Button full>
            <Icon name="near_me" className="text-[16px]" /> Canlı takip
          </Button>
        ) : null}
      </Card>

      <div className="mt-4">
        <SecureNote>Reçete belgeniz teslimat tamamlandıktan sonra erişime kapatılır ve yalnızca yasal saklama süresince arşivlenir.</SecureNote>
      </div>
    </div>
  );
}
