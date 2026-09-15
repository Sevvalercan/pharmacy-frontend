import Link from "next/link";
import { Icon } from "./ui";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white mt-16">
      <div className="bg-alert-light/60 border-b border-line">
        <div className="max-w-shell mx-auto px-5 py-2.5 flex items-center justify-center gap-2 text-center">
          <Icon name="emergency" className="text-[16px] text-alert" />
          <p className="text-[12.5px] text-alert-dark">
            Acil durumlarda 112&apos;yi arayın. EczaJet tıbbi teşhis veya acil müdahale hizmeti vermez.
          </p>
        </div>
      </div>
      <div className="max-w-shell mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-md bg-brand text-white flex items-center justify-center">
              <Icon name="medication_liquid" className="text-[14px]" />
            </span>
            <span className="font-display text-[15px] font-semibold">EczaJet</span>
          </div>
          <p className="text-ink-soft leading-relaxed">
            Lisanslı eczaneler ile hastaları buluşturan, mevzuata uyumlu dijital sağlık lojistiği.
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-3">Hızlı erişim</h4>
          <ul className="space-y-2 text-ink-soft">
            <li><Link className="hover:text-brand" href="/nobetci">Nöbetçi eczaneler</Link></li>
            <li><Link className="hover:text-brand" href="/ilac-arama">İlaç arama</Link></li>
            <li><Link className="hover:text-brand" href="/recete-yukle">Reçete yükle</Link></li>
            <li><Link className="hover:text-brand" href="/eczaneler">Eczane listesi</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-3">Mevzuat</h4>
          <p className="text-ink-soft leading-relaxed mb-2">
            6197 sayılı kanun, T.C. Sağlık Bakanlığı ilaç mevzuatı ve KVKK hükümlerine uyulur.
          </p>
          <span className="inline-flex items-center gap-1 text-[11.5px] bg-brand-light text-brand-dark px-2 py-1 rounded-full">
            <Icon name="verified" className="text-[13px]" /> Lisans uyumlu
          </span>
        </div>
        <div>
          <h4 className="font-medium mb-3">Destek</h4>
          <p className="text-ink-soft mb-1">Eczacı danışma hattı</p>
          <p className="font-display text-[16px] font-semibold text-brand">0850 300 ECZA</p>
          <p className="text-[12px] text-ink-faint mt-1">7/24 koordinasyon</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="max-w-shell mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-ink-faint">
          <p>© 2026 EczaJet Sağlık Teknolojileri A.Ş.</p>
          <div className="flex gap-4">
            <a className="hover:text-brand" href="#">KVKK</a>
            <a className="hover:text-brand" href="#">Gizlilik</a>
            <a className="hover:text-brand" href="#">Eczacı protokolü</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
