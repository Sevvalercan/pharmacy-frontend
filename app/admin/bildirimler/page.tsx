"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, Empty, Field, Icon, PageTitle, inputCls } from "@/components/ui";

export default function AdminNotifications() {
  const { users, notifications, pushNotification } = useStore();
  const [target, setTarget] = useState("all-users");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const recipients =
      target === "all-users" ? users.filter((u) => u.role === "user")
      : target === "all-vendors" ? users.filter((u) => u.role === "vendor")
      : users.filter((u) => u.id === target);
    recipients.forEach((u) => pushNotification({ userId: u.id, type: "system", title, body }));
    setTitle(""); setBody(""); setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <>
      <PageTitle title="Bildirim ve duyurular" subtitle="Kullanıcı ve eczanelere sistem duyurusu gönderin." />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-medium text-[15px] mb-4">Yeni duyuru</h3>
          <form onSubmit={send} className="space-y-4">
            <Field label="Alıcı">
              <select className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="all-users">Tüm hastalar</option>
                <option value="all-vendors">Tüm eczaneler</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </Field>
            <Field label="Başlık">
              <input required className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Planlı bakım duyurusu" />
            </Field>
            <Field label="Mesaj">
              <textarea required rows={3} className={inputCls} value={body} onChange={(e) => setBody(e.target.value)}
                placeholder="Duyuru metni" />
            </Field>
            <Button type="submit" size="sm">
              {sent ? <><Icon name="check" className="text-[16px]" /> Gönderildi</> : <><Icon name="send" className="text-[16px]" /> Gönder</>}
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <h3 className="font-medium text-[15px] mb-4">Son gönderilen bildirimler</h3>
          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {notifications.length === 0 && <Empty icon="notifications_off" text="Bildirim yok." />}
            {notifications.slice(0, 12).map((n) => {
              const u = users.find((x) => x.id === n.userId);
              return (
                <div key={n.id} className="border border-line rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={n.type === "system" ? "amber" : "neutral"}>{n.type}</Badge>
                    <span className="text-[12px] text-ink-faint">{u?.name ?? n.userId}</span>
                  </div>
                  <p className="text-[13.5px] font-medium">{n.title}</p>
                  <p className="text-[12.5px] text-ink-soft mt-0.5">{n.body}</p>
                  <p className="text-[11.5px] text-ink-faint mt-1">{n.createdAt}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
