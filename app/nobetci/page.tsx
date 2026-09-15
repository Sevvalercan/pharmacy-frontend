"use client";

import { useStore } from "@/lib/store";
import PharmacyCard from "@/components/PharmacyCard";
import { Empty, Icon, PageTitle } from "@/components/ui";

export default function DutyPage() {
  const { pharmacies } = useStore();
  const list = pharmacies.filter((p) => p.duty && p.approved).sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="max-w-shell mx-auto px-5 py-10">
      <PageTitle title="Nöbetçi eczaneler" subtitle="Bu gece Kadıköy ve çevresinde nöbet tutan lisanslı eczaneler." />
      <div className="flex items-start gap-2 bg-alert-light border border-alert/15 rounded p-3 mb-6">
        <Icon name="emergency" className="text-[18px] text-alert mt-[1px]" />
        <p className="text-[13px] text-alert-dark leading-relaxed">
          Acil tıbbi durumlarda önce 112&apos;yi arayın. Nöbet listesi Eczacı Odası verisine göre her gün 18:30&apos;da güncellenir.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {list.length ? list.map((p) => <PharmacyCard key={p.id} pharmacy={p} />)
          : <Empty text="Şu anda nöbetçi eczane bulunamadı." />}
      </div>
    </div>
  );
}
