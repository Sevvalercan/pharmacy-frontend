import { Suspense } from "react";
import AuthGuard from "@/components/AuthGuard";
import PrescriptionFlow from "@/components/PrescriptionFlow";

export default function Page() {
  return (
    <AuthGuard
      title="Reçete yüklemek için giriş yapın"
      description="Reçete ve sağlık verileriniz yalnızca doğrulanmış hesaplarla işlenir."
    >
      <Suspense fallback={<div className="max-w-2xl mx-auto px-5 py-10 text-[14px] text-ink-faint">Yükleniyor…</div>}>
        <PrescriptionFlow />
      </Suspense>
    </AuthGuard>
  );
}
