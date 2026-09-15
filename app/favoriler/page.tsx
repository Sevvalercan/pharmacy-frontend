"use client";

import AuthGuard from "@/components/AuthGuard";
import PharmacyCard from "@/components/PharmacyCard";
import { useStore } from "@/lib/store";
import { Empty, PageTitle } from "@/components/ui";

export default function Page() {
  return <AuthGuard title="Favorileriniz için giriş yapın"><Favorites /></AuthGuard>;
}

function Favorites() {
  const { pharmacies, favorites } = useStore();
  const list = pharmacies.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-shell mx-auto px-5 py-10">
      <PageTitle title="Favori eczanelerim" subtitle="Sık sipariş verdiğiniz eczaneler." />
      <div className="grid md:grid-cols-2 gap-3">
        {list.length ? list.map((p) => <PharmacyCard key={p.id} pharmacy={p} />)
          : <Empty icon="favorite" text="Henüz favori eczaneniz yok. Eczane kartındaki kalp simgesine dokunun." />}
      </div>
    </div>
  );
}
