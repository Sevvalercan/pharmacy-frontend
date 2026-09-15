"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { Icon } from "./ui";

export interface PanelLink { href: string; icon: string; label: string; }

export default function PanelShell({
  links, title, accent = "brand", children,
}: { links: PanelLink[]; title: string; accent?: "brand" | "ink"; children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logout } = useStore();
  const headCls = accent === "ink" ? "bg-ink text-white" : "bg-brand text-white";

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className={`${headCls} sticky top-0 z-40`}>
        <div className="max-w-shell mx-auto px-5 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
              <Icon name="medication_liquid" className="text-[16px]" />
            </span>
            <span className="font-display text-[15.5px] font-semibold">EczaJet</span>
          </Link>
          <span className="text-[12px] bg-white/15 px-2 py-0.5 rounded-full">{title}</span>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block text-[13px] opacity-90">{currentUser?.name}</span>
            <Link href="/" className="text-[12.5px] opacity-80 hover:opacity-100 flex items-center gap-1">
              <Icon name="open_in_new" className="text-[15px]" /> Siteye dön
            </Link>
            <button type="button" onClick={logout}
              className="text-[12.5px] bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors">
              <Icon name="logout" className="text-[15px]" /> Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-shell mx-auto px-5 w-full flex-1 grid lg:grid-cols-[200px_1fr] gap-6 py-6">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-[13.5px] whitespace-nowrap transition-colors ${
                    active ? "bg-white border border-line font-medium text-ink shadow-card" : "text-ink-soft hover:bg-white/70"
                  }`}>
                  <Icon name={l.icon} className="text-[18px]" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
