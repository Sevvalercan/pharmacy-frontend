"use client";

import { useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { Card, Empty, Icon, PageTitle } from "@/components/ui";

const ICONS: Record<string, string> = {
  order: "local_shipping", stock: "inventory_2", system: "campaign", prescription: "description",
};

export default function Page() {
  return <AuthGuard title="Bildirimleriniz için giriş yapın"><Notifications /></AuthGuard>;
}

function Notifications() {
  const { notifications, currentUser, markNotificationsRead } = useStore();
  const mine = notifications.filter((n) => n.userId === currentUser?.id);

  useEffect(() => { markNotificationsRead(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <PageTitle title="Bildirimler" subtitle="Sipariş, reçete ve stok hareketleriniz." />
      <div className="space-y-2">
        {mine.length === 0 && <Empty icon="notifications_off" text="Henüz bildiriminiz yok." />}
        {mine.map((n) => (
          <Card key={n.id} className="p-4 flex gap-3">
            <span className="w-9 h-9 rounded-full bg-brand-light text-brand flex items-center justify-center shrink-0">
              <Icon name={ICONS[n.type] ?? "notifications"} className="text-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-medium">{n.title}</p>
              <p className="text-[13px] text-ink-soft mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-[11.5px] text-ink-faint mt-1.5">{n.createdAt}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
