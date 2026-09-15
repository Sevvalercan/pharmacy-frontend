import { Suspense } from "react";
import MedicineSearch from "@/components/MedicineSearch";

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-shell mx-auto px-5 py-10 text-[14px] text-ink-faint">Yükleniyor…</div>}>
      <MedicineSearch />
    </Suspense>
  );
}
