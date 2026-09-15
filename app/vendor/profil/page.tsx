"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, Field, Icon, PageTitle, inputCls } from "@/components/ui";

export default function VendorProfile() {
  const { currentUser, pharmacies, updatePharmacy } = useStore();
  const pid = currentUser?.pharmacyId ?? "";
  const pharmacy = pharmacies.find((p) => p.id === pid);
  const [saved, setSaved] = useState(false);

  if (!pharmacy) return null;

  return (
    <>
      <PageTitle title="Eczane profili" subtitle="Bu bilgiler kullanıcı tarafında eczane kartınızda görünür."
        action={<Badge tone={pharmacy.approved ? "brand" : "amber"}>
          {pharmacy.approved ? "Onaylı eczane" : "Onay bekliyor"}
        </Badge>} />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Eczane adı">
              <input className={inputCls} value={pharmacy.name}
                onChange={(e) => updatePharmacy(pid, { name: e.target.value })} />
            </Field>
            <Field label="Telefon">
              <input className={inputCls} value={pharmacy.phone}
                onChange={(e) => updatePharmacy(pid, { phone: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Adres">
                <input className={inputCls} value={pharmacy.address}
                  onChange={(e) => updatePharmacy(pid, { address: e.target.value })} />
              </Field>
            </div>
            <Field label="İlçe">
              <input className={inputCls} value={pharmacy.district}
                onChange={(e) => updatePharmacy(pid, { district: e.target.value })} />
            </Field>
            <Field label="Çalışma saatleri">
              <input className={inputCls} value={pharmacy.hours}
                onChange={(e) => updatePharmacy(pid, { hours: e.target.value })} />
            </Field>
            <Field label="Ortalama hazırlama süresi (dk)">
              <input type="number" className={inputCls} value={pharmacy.prepMinutes}
                onChange={(e) => updatePharmacy(pid, { prepMinutes: Number(e.target.value) })} />
            </Field>
          </div>

          <Button size="sm" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
            {saved ? <><Icon name="check" className="text-[16px]" /> Kaydedildi</> : "Değişiklikleri kaydet"}
          </Button>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-medium text-[15px] mb-4">Operasyon durumu</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13.5px] text-ink-soft">Eczane şu anda açık</span>
                <input type="checkbox" checked={pharmacy.open} className="w-4 h-4 accent-[#0d6e66]"
                  onChange={(e) => updatePharmacy(pid, { open: e.target.checked })} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13.5px] text-ink-soft">Bu gece nöbetçiyim</span>
                <input type="checkbox" checked={pharmacy.duty} className="w-4 h-4 accent-[#0d6e66]"
                  onChange={(e) => updatePharmacy(pid, { duty: e.target.checked })} />
              </label>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-medium text-[15px] mb-3">Hizmetler</h3>
            <div className="flex flex-wrap gap-1.5">
              {["Soğuk zincir", "Moto kurye", "Tansiyon ölçümü", "Raporlu ilaç teslimi", "Dermokozmetik danışmanlık", "Medikal cihaz kiralama"].map((s) => {
                const on = pharmacy.services.includes(s);
                return (
                  <button key={s} type="button"
                    onClick={() => updatePharmacy(pid, {
                      services: on ? pharmacy.services.filter((x) => x !== s) : [...pharmacy.services, s],
                    })}
                    className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${
                      on ? "bg-brand text-white border-brand" : "border-line text-ink-soft hover:border-brand"
                    }`}>
                    {s}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
