"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, Empty, Icon, PageTitle } from "@/components/ui";

export default function AdminUsers() {
  const { users, orders, setUserStatus } = useStore();
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"all" | "user" | "vendor" | "admin">("all");

  const list = users
    .filter((u) => role === "all" || u.role === role)
    .filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageTitle title="Kullanıcı yönetimi" subtitle="Platformdaki tüm hesapları görüntüleyin ve durumlarını yönetin." />

      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-2 bg-white border border-line rounded-full p-1.5 flex-1 min-w-[200px] focus-within:border-brand">
          <Icon name="search" className="text-[18px] text-ink-faint ml-2.5" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="İsim veya e-posta ara"
            className="flex-1 bg-transparent outline-none text-[13.5px] py-1.5" />
        </div>
        {(["all", "user", "vendor", "admin"] as const).map((r) => (
          <button key={r} type="button" onClick={() => setRole(r)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] transition-colors ${
              role === r ? "bg-brand text-white" : "bg-white border border-line text-ink-soft hover:border-brand"
            }`}>
            {r === "all" ? "Tümü" : r === "user" ? "Hasta" : r === "vendor" ? "Eczane" : "Admin"}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2.5 bg-canvas border-b border-line text-[11.5px] text-ink-faint uppercase tracking-wide">
          <span>Kullanıcı</span><span>Rol</span><span>Sipariş</span><span>Durum</span><span />
        </div>
        {list.length === 0 && <div className="p-4"><Empty icon="person_off" text="Kullanıcı bulunamadı." /></div>}
        {list.map((u) => {
          const count = orders.filter((o) => o.userId === u.id).length;
          return (
            <div key={u.id} className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3 border-b border-line-soft last:border-0 items-center">
              <div className="min-w-0">
                <p className="text-[13.5px] font-medium">{u.name}</p>
                <p className="text-[12px] text-ink-soft truncate">{u.email}</p>
              </div>
              <Badge tone={u.role === "admin" ? "alert" : u.role === "vendor" ? "amber" : "neutral"}>
                {u.role === "user" ? "Hasta" : u.role === "vendor" ? "Eczane" : "Admin"}
              </Badge>
              <span className="text-[13px] text-ink-soft">{count} sipariş</span>
              <Badge tone={u.status === "active" ? "brand" : "alert"} dot={u.status === "active"}>
                {u.status === "active" ? "Aktif" : "Askıda"}
              </Badge>
              <Button size="sm" variant={u.status === "active" ? "outline" : "primary"}
                onClick={() => setUserStatus(u.id, u.status === "active" ? "suspended" : "active")}>
                {u.status === "active" ? "Askıya al" : "Aktifleştir"}
              </Button>
            </div>
          );
        })}
      </Card>
    </>
  );
}
