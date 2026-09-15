"use client";

import { useStore } from "@/lib/store";
import { Badge, Button, Card, Icon, PageTitle } from "@/components/ui";

export default function AdminPharmacies() {
  const { pharmacies, orders, stock, setPharmacyApproved, updatePharmacy } = useStore();

  return (
    <>
      <PageTitle title="Eczane yönetimi" subtitle="Başvuruları onaylayın, eczane durumlarını yönetin." />

      <div className="space-y-2.5">
        {pharmacies.map((p) => {
          const orderCount = orders.filter((o) => o.pharmacyId === p.id).length;
          const stockCount = stock.filter((s) => s.pharmacyId === p.id && s.inStock).length;
          return (
            <Card key={p.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-[14.5px]">{p.name}</h3>
                    <Badge tone={p.approved ? "brand" : "amber"}>{p.approved ? "Onaylı" : "Onay bekliyor"}</Badge>
                    {p.duty && <Badge tone="alert" dot>Nöbetçi</Badge>}
                  </div>
                  <p className="text-[12.5px] text-ink-soft mt-1">{p.address}, {p.district} · {p.phone}</p>
                  <p className="text-[12px] text-ink-faint mt-1">
                    {orderCount} sipariş · {stockCount} kalem stokta · {p.rating} puan
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <label className="flex items-center gap-1.5 text-[12.5px] text-ink-soft cursor-pointer">
                    <input type="checkbox" checked={p.open} className="w-4 h-4 accent-[#0d6e66]"
                      onChange={(e) => updatePharmacy(p.id, { open: e.target.checked })} />
                    Açık
                  </label>
                  <Button size="sm" variant={p.approved ? "outline" : "primary"}
                    onClick={() => setPharmacyApproved(p.id, !p.approved)}>
                    <Icon name={p.approved ? "block" : "verified"} className="text-[15px]" />
                    {p.approved ? "Onayı kaldır" : "Onayla"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
