import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "EczaJet — İlaç ve nöbetçi eczane platformu",
  description: "İlacınızı ve nöbetçi eczaneleri bulun, reçetenizle güvenle sipariş verin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
