"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import type { Pharmacy } from "@/lib/types";
import { Badge, Card, Icon } from "./ui";

export default function PharmacyCard({ pharmacy: p }: { pharmacy: Pharmacy }) {
  const { currentUser, isFavorite, toggleFavorite } = useStore();
  const fav = isFavorite(p.id);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-[15px]">{p.name}</h3>
            {p.duty ? <Badge tone="alert" dot>Nöbetçi</Badge>
              : p.open ? <Badge tone="brand">Açık</Badge>
              : <Badge tone="neutral">Kapalı</Badge>}
          </div>
          <p className="text-[13px] text-ink-soft mt-1">{p.address}, {p.district}</p>
        </div>
        {currentUser?.role === "user" && (
          <button type="button" onClick={() => toggleFavorite(p.id)} aria-label="Favori"
            className={`p-1.5 rounded-full hover:bg-line-soft shrink-0 ${fav ? "text-alert" : "text-ink-faint"}`}>
            <Icon name="favorite" className={`text-[19px] ${fav ? "ms-fill" : ""}`} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[12.5px] text-ink-soft">
        <span className="inline-flex items-center gap-1"><Icon name="near_me" className="text-[15px]" />{p.distanceKm} km</span>
        <span className="inline-flex items-center gap-1"><Icon name="schedule" className="text-[15px]" />{p.hours}</span>
        <span className="inline-flex items-center gap-1"><Icon name="bolt" className="text-[15px]" />~{p.prepMinutes} dk hazırlık</span>
        <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 hover:text-brand">
          <Icon name="call" className="text-[15px]" />{p.phone}
        </a>
      </div>

      {p.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.services.map((s) => <Badge key={s} tone="outline">{s}</Badge>)}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Link href={`/ilac-arama?pharmacy=${p.id}`}
          className="flex-1 text-center text-[13px] border border-line rounded-full py-2 hover:bg-line-soft transition-colors">
          Stoğunu gör
        </Link>
        <Link href="/recete-yukle"
          className="flex-1 text-center text-[13px] bg-brand text-white rounded-full py-2 hover:bg-brand-dark transition-colors">
          Sipariş ver
        </Link>
      </div>
    </Card>
  );
}
