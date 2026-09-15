"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

/** Vendor ve admin panellerinde genel site basligi/footeri gizlenir. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPanel = pathname.startsWith("/vendor") || pathname.startsWith("/admin");

  if (isPanel) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
