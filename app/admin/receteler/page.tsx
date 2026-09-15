"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { medicines } from "@/lib/data";
import { Badge, Button, Card, Empty, Icon, PageTitle, SecureNote } from "@/components/ui";

export default function AdminPrescriptions() {
  const { prescriptions } = useStore();
  const [revealed, setRevealed] = useState<string | null>(null);

  return (
    <>
      <PageTitle title="Reçete yönetimi" subtitle="Hassas sağlık belgeleri — erişimler kayıt altına alınır." />

      <div className="mb-5">
        <SecureNote>
          Reçete görüntüleme işlemleri KVKK denetim kaydına yazılır. Belgeler yalnızca şikâyet
          incelemesi veya yasal talep halinde açılmalıdır.
        </SecureNote>
      </div>

      <div className="space-y-2.5">
        {prescriptions.length === 0 && <Empty icon="description" text="Reçete kaydı yok." />}
        {prescriptions.map((rx) => {
          const open = revealed === rx.id;
          return (
            <Card key={rx.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[12.5px]">{rx.id}</span>
                    <Badge tone={rx.status === "verified" ? "brand" : rx.status === "pending" ? "amber" : "alert"}>
                      {rx.status === "verified" ? "Doğrulandı" : rx.status === "pending" ? "Beklemede" : "Reddedildi"}
                    </Badge>
                    {rx.reportNo && <Badge tone="alert">Raporlu</Badge>}
                  </div>
                  <p className="text-[13.5px] font-medium mt-1.5">{rx.userName}</p>
                  <p className="text-[12px] text-ink-soft mt-0.5">
                    {rx.source} · {rx.uploadedAt} · {rx.medicineIds.length} ilaç
                  </p>
                </div>
                <Button size="sm" variant={open ? "outline" : "soft"} onClick={() => setRevealed(open ? null : rx.id)}>
                  <Icon name={open ? "visibility_off" : "visibility"} className="text-[15px]" />
                  {open ? "Gizle" : "İçeriği aç"}
                </Button>
              </div>

              {open && (
                <div className="mt-4 pt-4 border-t border-line">
                  <div className="flex items-center gap-2 mb-3 text-[12px] text-amber">
                    <Icon name="warning" className="text-[15px]" />
                    Bu erişim {new Date().toLocaleString("tr-TR")} itibarıyla loglandı.
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-[13px]">
                    <div>
                      <p className="text-[11.5px] text-ink-faint uppercase tracking-wide mb-1">Reçete kodu</p>
                      <p className="font-mono">{rx.code}</p>
                      {rx.reportNo && (
                        <>
                          <p className="text-[11.5px] text-ink-faint uppercase tracking-wide mb-1 mt-3">Rapor no</p>
                          <p className="font-mono">{rx.reportNo}</p>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="text-[11.5px] text-ink-faint uppercase tracking-wide mb-1.5">İlaçlar</p>
                      <ul className="space-y-1">
                        {rx.medicineIds.map((id) => {
                          const m = medicines.find((x) => x.id === id);
                          return <li key={id} className="text-ink-soft">• {m?.name ?? id} {m?.dose}</li>;
                        })}
                      </ul>
                    </div>
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
