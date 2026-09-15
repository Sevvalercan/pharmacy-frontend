"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import PharmacyCard from "@/components/PharmacyCard";
import { Empty, PageTitle } from "@/components/ui";

const FILTERS = [
  { key: "all", label: "Tümü" },
  { key: "open", label: "Açık" },
  { key: "duty", label: "Nöbetçi" },
  { key: "near", label: "1 km içinde" },
] as const;

export default function PharmaciesPage() {
  const { pharmacies } = useStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");

  const list = useMemo(() => {
    let items = pharmacies.filter((p) => p.approved).sort((a, b) => a.distanceKm - b.distanceKm);
    if (filter === "open") items = items.filter((p) => p.open);
    if (filter === "duty") items = items.filter((p) => p.duty);
    if (filter === "near") items = items.filter((p) => p.distanceKm <= 1);
    return items;
  }, [pharmacies, filter]);

  return (
    <div className="max-w-shell mx-auto px-5 py-10">
      <PageTitle title="Yakınımdaki eczaneler" subtitle="Kadıköy, Caferağa Mah. konumuna göre yakından uzağa sıralandı." />
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f.key} type="button" onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              filter === f.key ? "bg-brand text-white" : "bg-white border border-line text-ink-soft hover:border-brand"
            }`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {list.length ? list.map((p) => <PharmacyCard key={p.id} pharmacy={p} />)
          : <Empty text="Bu filtreye uyan eczane bulunamadı." />}
      </div>
    </div>
  );
}
