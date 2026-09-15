"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { medicines, money } from "@/lib/data";
import { Badge, Button, Card, Empty, Icon, PageTitle, SecureNote } from "@/components/ui";

type SortKey = "distance" | "price" | "prep";

export default function MedicineDetail({ id }: { id: string }) {
  const router = useRouter();
  const { stock, pharmacies, currentUser, addStockAlert, hasStockAlert } = useStore();
  const [sort, setSort] = useState<SortKey>("distance");
  const [alerted, setAlerted] = useState(false);

  const medicine = medicines.find((m) => m.id === id);

  const rows = useMemo(() => {
    if (!medicine) return [];
    const list = stock
      .filter((s) => s.medicineId === medicine.id)
      .map((s) => ({ ...s, pharmacy: pharmacies.find((p) => p.id === s.pharmacyId)! }))
      .filter((s) => s.pharmacy?.approved);
    const sorters: Record<SortKey, (a: typeof list[0], b: typeof list[0]) => number> = {
      distance: (a, b) => a.pharmacy.distanceKm - b.pharmacy.distanceKm,
      price: (a, b) => a.price - b.price,
      prep: (a, b) => a.pharmacy.prepMinutes - b.pharmacy.prepMinutes,
    };
    return [...list].sort(sorters[sort]);
  }, [medicine, stock, pharmacies, sort]);

  if (!medicine) {
    return (
      <div className="max-w-shell mx-auto px-5 py-16">
        <Empty text="İlaç bulunamadı." />
      </div>
    );
  }

  const anyStock = rows.some((r) => r.inStock);
  const watching = hasStockAlert(medicine.id) || alerted;

  return (
    <div className="max-w-shell mx-auto px-5 py-10">
      <Link href="/ilac-arama" className="inline-flex items-center gap-1 text-[13px] text-ink-soft hover:text-ink mb-5">
        <Icon name="arrow_back" className="text-[17px]" /> İlaç aramaya dön
      </Link>

      <PageTitle
        title={medicine.name}
        subtitle={`${medicine.activeIngredient} · ${medicine.form} · ${medicine.dose}`}
        action={
          <div className="flex gap-2">
            <Badge tone={medicine.prescriptionOnly ? "amber" : "brand"}>
              {medicine.prescriptionOnly ? "Reçeteli" : "Reçetesiz"}
            </Badge>
            {medicine.reportRequired && <Badge tone="alert">Rapor gerekli</Badge>}
          </div>
        }
      />

      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Etken madde", v: medicine.activeIngredient },
          { l: "Form", v: medicine.form },
          { l: "Doz", v: medicine.dose },
          { l: "Üretici", v: medicine.manufacturer },
        ].map((f) => (
          <Card key={f.l} className="p-3.5">
            <p className="text-[11.5px] text-ink-faint uppercase tracking-wide">{f.l}</p>
            <p className="text-[14px] font-medium mt-1">{f.v}</p>
          </Card>
        ))}
      </div>

      {medicine.reportRequired && (
        <Card className="p-4 mb-6 border-alert/20 bg-alert-light/40">
          <div className="flex items-start gap-3">
            <Icon name="description" className="text-[20px] text-alert mt-[1px]" />
            <div className="flex-1">
              <h3 className="font-medium text-[14.5px]">Bu ilaç raporlu ilaç kapsamındadır</h3>
              <p className="text-[13px] text-ink-soft mt-1 leading-relaxed">
                Teslimat öncesi geçerli sağlık raporunuzun ve reçetenizin eczacı tarafından doğrulanması gerekir.
                Talebinizi oluşturduğunuzda eczane sizinle iletişime geçer.
              </p>
              <div className="mt-3">
                <Button href="/recete-yukle?report=1" size="sm">
                  <Icon name="assignment" className="text-[16px]" /> Raporlu ilaç talebi oluştur
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="font-display text-[18px] font-semibold">
          Eczane karşılaştırması <span className="text-ink-faint font-normal text-[14px]">({rows.length})</span>
        </h2>
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <span className="text-ink-faint mr-1">Sırala:</span>
          {([["distance", "Mesafe"], ["price", "Fiyat"], ["prep", "Hazırlama"]] as [SortKey, string][]).map(([k, l]) => (
            <button key={k} type="button" onClick={() => setSort(k)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                sort === k ? "bg-brand text-white" : "bg-white border border-line text-ink-soft hover:border-brand"
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {rows.length === 0 && <Empty text="Bu ilaç için stok kaydı bulunmuyor." />}
        {rows.map((r) => (
          <Card key={r.pharmacyId} className={`p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${r.inStock ? "" : "opacity-70"}`}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-[14.5px]">{r.pharmacy.name}</h3>
                {r.pharmacy.duty && <Badge tone="alert" dot>Nöbetçi</Badge>}
                {r.inStock ? <Badge tone="brand">Stokta ({r.quantity})</Badge> : <Badge tone="neutral">Tükendi</Badge>}
              </div>
              <p className="text-[12.5px] text-ink-soft mt-1">
                {r.pharmacy.distanceKm} km · ~{r.pharmacy.prepMinutes} dk hazırlık · {r.pharmacy.hours}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="font-display text-[16px] font-semibold">{money(r.price)}</p>
              <p className="text-[11.5px] text-ink-faint">Kurye ücreti hariç</p>
            </div>
            {r.inStock ? (
              <Button href="/recete-yukle" size="sm">Sipariş ver</Button>
            ) : (
              <Button size="sm" variant="outline" disabled>Stok yok</Button>
            )}
          </Card>
        ))}
      </div>

      {!anyStock && (
        <Card className="p-4 mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <Icon name="notifications_active" className="text-[22px] text-brand" />
          <div className="flex-1">
            <h3 className="font-medium text-[14.5px]">Stok geldiğinde haber verelim</h3>
            <p className="text-[13px] text-ink-soft mt-0.5">
              Bu ilaç eczanelere geldiğinde bildirim göndeririz.
            </p>
          </div>
          {!currentUser ? (
            <Button size="sm" variant="outline" onClick={() => router.push("/giris")}>Giriş yapın</Button>
          ) : watching ? (
            <Badge tone="brand" dot>Takip ediliyor</Badge>
          ) : (
            <Button size="sm" onClick={() => { addStockAlert(medicine.id); setAlerted(true); }}>
              Bana bildir
            </Button>
          )}
        </Card>
      )}

      <div className="mt-6">
        <SecureNote>
          Bu sayfa bilgilendirme amaçlıdır, tıbbi tavsiye yerine geçmez. Doz, yan etki ve
          etkileşimler için doktorunuza veya eczacınıza danışın.
        </SecureNote>
      </div>
    </div>
  );
}
