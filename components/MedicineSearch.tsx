"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { medicines } from "@/lib/data";
import { Badge, Card, Empty, Icon, PageTitle } from "@/components/ui";

const CATEGORIES = ["Tümü", "Ağrı kesici", "Antibiyotik", "Vitamin", "Tansiyon", "Solunum", "Diyabet", "Soğuk algınlığı"];

export default function MedicineSearch() {
  const params = useSearchParams();
  const pharmacyParam = params.get("pharmacy");
  const { stock, pharmacies } = useStore();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState("Tümü");
  const [nearOnly, setNearOnly] = useState(true);
  const [inStockOnly, setInStockOnly] = useState(false);

  const pharmacyFilter = pharmacyParam ? pharmacies.find((p) => p.id === pharmacyParam) : null;

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return medicines
      .filter((m) =>
        !term ||
        m.name.toLowerCase().includes(term) ||
        m.activeIngredient.toLowerCase().includes(term) ||
        m.category.toLowerCase().includes(term)
      )
      .filter((m) => cat === "Tümü" || m.category === cat)
      .map((m) => {
        let entries = stock
          .filter((s) => s.medicineId === m.id)
          .map((s) => ({ ...s, pharmacy: pharmacies.find((p) => p.id === s.pharmacyId)! }))
          .filter((s) => s.pharmacy?.approved);
        if (pharmacyParam) entries = entries.filter((s) => s.pharmacyId === pharmacyParam);
        if (nearOnly) entries = entries.filter((s) => s.pharmacy.distanceKm <= 2);
        if (inStockOnly) entries = entries.filter((s) => s.inStock);
        entries.sort((a, b) => a.pharmacy.distanceKm - b.pharmacy.distanceKm);
        return { medicine: m, entries };
      })
      .filter((r) => (pharmacyParam ? r.entries.length > 0 : true));
  }, [q, cat, nearOnly, inStockOnly, stock, pharmacies, pharmacyParam]);

  return (
    <div className="max-w-shell mx-auto px-5 py-10">
      <PageTitle
        title="İlaç arama"
        subtitle={pharmacyFilter ? `${pharmacyFilter.name} stoğunda arama yapıyorsunuz.` : "İlaç adı, etken madde veya kategoriden arayın."}
      />

      <div className="flex items-center gap-2 bg-white border border-line rounded-full p-1.5 mb-4 focus-within:border-brand transition-colors">
        <Icon name="search" className="text-[19px] text-ink-faint ml-3" />
        <input value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Örn: Parol, Parasetamol, antibiyotik"
          className="flex-1 bg-transparent outline-none text-[14px] py-2" />
        {q && (
          <button type="button" onClick={() => setQ("")} className="p-1.5 mr-1 text-ink-faint hover:text-ink">
            <Icon name="close" className="text-[17px]" />
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-[12.5px] whitespace-nowrap transition-colors ${
              cat === c ? "bg-brand text-white" : "bg-white border border-line text-ink-soft hover:border-brand"
            }`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-6 text-[13px] text-ink-soft">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={nearOnly} onChange={(e) => setNearOnly(e.target.checked)} className="w-4 h-4 accent-[#0d6e66]" />
          Yakınımdaki eczaneler (2 km)
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-[#0d6e66]" />
          Sadece stokta olanlar
        </label>
        {pharmacyFilter && (
          <Link href="/ilac-arama" className="text-brand hover:underline inline-flex items-center gap-1">
            <Icon name="close" className="text-[15px]" /> Eczane filtresini kaldır
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {results.length === 0 && <Empty text="Aramanızla eşleşen ilaç bulunamadı." />}
        {results.map(({ medicine: m, entries }) => {
          const available = entries.filter((e) => e.inStock);
          const nearest = available[0];
          return (
            <Link key={m.id} href={`/ilac/${m.id}`}>
              <Card className="p-4 hover:border-brand transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-[15px]">{m.name}</h3>
                    <Badge tone={m.prescriptionOnly ? "amber" : "brand"}>
                      {m.prescriptionOnly ? "Reçeteli" : "Reçetesiz"}
                    </Badge>
                    {m.reportRequired && <Badge tone="alert">Raporlu</Badge>}
                  </div>
                  <p className="text-[13px] text-ink-soft mt-1">
                    {m.activeIngredient} · {m.form} · {m.dose}
                  </p>
                </div>
                <div className="sm:text-right shrink-0">
                  {available.length ? (
                    <>
                      <p className="text-[13.5px] font-medium text-brand">{available.length} eczanede stokta</p>
                      <p className="text-[12.5px] text-ink-soft mt-0.5">
                        En yakın: {nearest.pharmacy.name} · {nearest.pharmacy.distanceKm} km
                      </p>
                    </>
                  ) : (
                    <p className="text-[13px] text-amber">Yakınınızda stok yok</p>
                  )}
                </div>
                <Icon name="chevron_right" className="text-[20px] text-ink-faint hidden sm:block" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
