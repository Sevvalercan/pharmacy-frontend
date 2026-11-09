"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { Button, Card, Empty, Icon, PageTitle } from "@/components/ui";

const ICONS: Record<string, string> = {
  order: "local_shipping",
  stock: "inventory_2",
  system: "campaign",
  prescription: "description",
};

export default function Page() {
  return (
    <AuthGuard title="Bildirimleriniz için giriş yapın">
      <Notifications />
    </AuthGuard>
  );
}

function Notifications() {
  const { notifications, currentUser, markNotificationsRead } = useStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const mine = notifications
    .filter((n) => n.userId === currentUser?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unreadCount = mine.filter((n) => !n.read).length;
  const visible = filter === "unread" ? mine.filter((n) => !n.read) : mine;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <PageTitle
        title="Bildirimler"
        subtitle="Sipariş, reçete ve stok hareketleriniz."
        action={
          unreadCount > 0 ? (
            <Button size="sm" variant="outline" onClick={markNotificationsRead}>
              <Icon name="done_all" className="text-[16px]" /> Tümünü okundu
              işaretle
            </Button>
          ) : undefined
        }
      />
      <div className="flex gap-1 border-b border-line mb-4">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-2 text-[13px] border-b-2 transition-colors ${filter === "all" ? "border-brand text-brand font-medium" : "border-transparent text-ink-soft hover:text-ink"}`}
        >
          Tümü{" "}
          <span className="ml-1 text-[11px] text-ink-faint">{mine.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-3 py-2 text-[13px] border-b-2 transition-colors ${filter === "unread" ? "border-brand text-brand font-medium" : "border-transparent text-ink-soft hover:text-ink"}`}
        >
          Okunmamış{" "}
          <span className="ml-1 text-[11px] text-ink-faint">{unreadCount}</span>
        </button>
      </div>
      <div className="space-y-2">
        {mine.length === 0 && (
          <Empty icon="notifications_off" text="Henüz bildiriminiz yok." />
        )}
        {mine.length > 0 && visible.length === 0 && (
          <Empty icon="done_all" text="Okunmamış bildiriminiz yok." />
        )}
        {visible.map((n) => (
          <Card
            key={n.id}
            className={`p-4 flex gap-3 ${n.read ? "" : "border-brand/30 bg-brand-light/20"}`}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.read ? "bg-line-soft text-ink-soft" : "bg-brand-light text-brand"}`}
            >
              <Icon
                name={ICONS[n.type] ?? "notifications"}
                className="text-[18px]"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium">{n.title}</p>
              <p className="text-[13px] text-ink-soft mt-0.5 leading-relaxed">
                {n.body}
              </p>
              <p className="text-[11.5px] text-ink-faint mt-1.5">
                {n.createdAt}
              </p>
            </div>
            {!n.read && (
              <span
                className="mt-1.5 w-2 h-2 rounded-full bg-brand shrink-0"
                aria-label="Okunmadı"
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
