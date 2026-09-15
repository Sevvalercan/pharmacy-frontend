"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { medicines } from "@/lib/data";
import { Badge, Card, Empty, Icon, PageTitle } from "@/components/ui";

export default function AdminMedicines() {
  const { stock } = useStore();
  const [q, setQ] = useState("");

  const list = medicines.filter((m) =>
    !q || [m.name, m.activeIngredient, m.manufacturer, m.category].some((f) => f.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <PageTitle title="Merkezi ilaç kataloğu" subtitle="Eczanelerin stok girişi yapabildiği referans ilaç listesi." />

      <div className="flex items-center gap-2 bg-white border border-line rounded-full p-1.5 mb-4 focus-within:border-brand">
        <Icon name="search" className="text-[18px] text-ink-faint ml-2.5" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="İlaç, etken madde veya üretici ara"
          className="flex-1 bg-transparent outline-none text-[13.5px] py-1.5" />
      </div>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-3 px-4 py-2.5 bg-canvas border-b border-line text-[11.5px] text-ink-faint uppercase tracking-wide">
          <span>İlaç</span><span>Etken madde</span><span>Üretici</span><span>Kategori</span><span>Eczane</span>
        </div>
        {list.length === 0 && <div className="p-4"><Empty text="İlaç bulunamadı." /></div>}
        {list.map((m) => {
          const count = stock.filter((s) => s.medicineId === m.id && s.inStock).length;
          return (
            <div key={m.id} className="grid md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-3 px-4 py-3 border-b border-line-soft last:border-0 items-center">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13.5px] font-medium">{m.name}</span>
                  <Badge tone={m.prescriptionOnly ? "amber" : "brand"}>{m.prescriptionOnly ? "Reçeteli" : "Reçetesiz"}</Badge>
                  {m.reportRequired && <Badge tone="alert">Raporlu</Badge>}
                </div>
                <p className="text-[12px] text-ink-soft mt-0.5">{m.form} · {m.dose}</p>
              </div>
              <span className="text-[13px] text-ink-soft">{m.activeIngredient}</span>
              <span className="text-[13px] text-ink-soft">{m.manufacturer}</span>
              <span className="text-[13px] text-ink-soft">{m.category}</span>
              <Badge tone={count ? "brand" : "neutral"}>{count} eczane</Badge>
            </div>
          );
        })}
      </Card>
    </>
  );
}
