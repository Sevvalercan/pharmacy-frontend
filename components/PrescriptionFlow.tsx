"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { medicines, money } from "@/lib/data";
import { Badge, Button, Card, Field, Icon, SecureNote, inputCls } from "@/components/ui";

const STEPS = ["Reçete", "İlaçlar", "Eczane", "Adres", "Özet"];

export default function PrescriptionFlow() {
  const params = useSearchParams();
  const { pharmacies, stock, addresses, createOrder } = useStore();

  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [reportMode, setReportMode] = useState(params.get("report") === "1");
  const [reportNo, setReportNo] = useState("");
  const [picked, setPicked] = useState<string[]>(["parol"]);
  const [pharmacyId, setPharmacyId] = useState("");
  const [addressId, setAddressId] = useState(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const selected = medicines.filter((m) => picked.includes(m.id));
  const needsReport = selected.some((m) => m.reportRequired) || reportMode;

  // secilen tum ilaclari stokta bulunduran eczaneler
  const candidates = useMemo(() => {
    return pharmacies
      .filter((p) => p.approved && p.open)
      .map((p) => {
        const lines = selected.map((m) => stock.find((s) => s.pharmacyId === p.id && s.medicineId === m.id));
        const complete = lines.every((l) => l?.inStock);
        const total = lines.reduce((sum, l) => sum + (l?.price ?? 0), 0);
        return { pharmacy: p, complete, total, found: lines.filter(Boolean).length };
      })
      .sort((a, b) => Number(b.complete) - Number(a.complete) || a.pharmacy.distanceKm - b.pharmacy.distanceKm);
  }, [pharmacies, stock, selected]);

  const chosen = candidates.find((c) => c.pharmacy.id === pharmacyId);
  const address = addresses.find((a) => a.id === addressId);
  const subtotal = chosen?.total ?? 0;

  function submit() {
    if (!chosen) return;
    const lines = selected.map((m) => {
      const s = stock.find((x) => x.pharmacyId === chosen.pharmacy.id && x.medicineId === m.id);
      return { medicineId: m.id, name: `${m.name} ${m.dose}`, quantity: 1, price: s?.price ?? 0 };
    });
    const order = createOrder({
      pharmacyId: chosen.pharmacy.id,
      lines,
      addressId,
      prescriptionCode: code || undefined,
      reportRequest: needsReport,
      note: note || undefined,
    });
    setOrderId(order.id);
    setStep(6);
  }

  if (step === 6 && orderId) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <span className="w-14 h-14 rounded-full bg-brand-light text-brand flex items-center justify-center mx-auto mb-5">
          <Icon name="check_circle" className="text-[30px]" />
        </span>
        <h1 className="font-display text-[22px] font-semibold">Talebiniz oluşturuldu</h1>
        <p className="text-[14px] text-ink-soft mt-2 max-w-md mx-auto leading-relaxed">
          <span className="font-mono">#{orderId}</span> numaralı siparişiniz {chosen?.pharmacy.name}&apos;ne iletildi.
          Eczacı onayladığında bildirim alacaksınız.
        </p>
        <div className="flex gap-2 justify-center mt-6">
          <Button href={`/siparislerim/${orderId}`}>Siparişi takip et</Button>
          <Button href="/" variant="outline">Ana sayfa</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display text-[24px] font-semibold tracking-tight">Reçete ile sipariş</h1>
      <p className="text-[13.5px] text-ink-soft mt-1.5 mb-7">
        Reçetenizi iletin, stoğu olan eczaneyi seçin, adresinize gelsin.
      </p>

      {/* Stepper */}
      <div className="flex items-center gap-1.5 mb-7">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full ${i + 1 <= step ? "bg-brand" : "bg-line"}`} />
            <p className={`text-[11.5px] mt-1.5 ${i + 1 === step ? "text-brand font-medium" : "text-ink-faint"}`}>{s}</p>
          </div>
        ))}
      </div>

      {/* 1 — recete */}
      {step === 1 && (
        <Card className="p-6">
          <h2 className="font-medium text-[16px] mb-1">Reçetenizi iletin</h2>
          <p className="text-[13px] text-ink-soft mb-5">E-reçete kodunuzu girin ya da reçete görselinizi yükleyin.</p>

          <Field label="E-reçete numarası" hint="E-Nabız veya SMS ile gelen 6 haneli kod.">
            <input className={inputCls} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="A1B2C3" maxLength={8} />
          </Field>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-line flex-1" /><span className="text-[12px] text-ink-faint">veya</span><div className="h-px bg-line flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[["photo_camera", "Kamera"], ["image", "Galeri"], ["upload_file", "Dosya"]].map(([icon, label]) => (
              <button key={label} type="button" onClick={() => setFile("recete_15eylul.jpg")}
                className="flex flex-col items-center gap-1.5 border border-dashed border-line hover:border-brand hover:bg-brand-light/30 rounded py-5 transition-colors">
                <Icon name={icon} className="text-[22px] text-brand" />
                <span className="text-[12.5px]">{label}</span>
              </button>
            ))}
          </div>

          {file && (
            <div className="flex items-center gap-2.5 bg-brand-light/50 border border-brand-tint rounded p-3 mt-4">
              <Icon name="task_alt" className="text-[19px] text-brand" />
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium truncate">{file}</p>
                <p className="text-[12px] text-ink-soft">Yüklendi · eczacı kontrolüne hazır</p>
              </div>
              <button type="button" onClick={() => setFile(null)} className="p-1 text-ink-faint hover:text-alert">
                <Icon name="close" className="text-[17px]" />
              </button>
            </div>
          )}

          <label className="flex items-start gap-2.5 mt-5 cursor-pointer">
            <input type="checkbox" checked={reportMode} onChange={(e) => setReportMode(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#0d6e66]" />
            <span className="text-[13px] text-ink-soft leading-relaxed">
              Raporlu ilaç talebi oluşturuyorum (kronik hastalık raporu ile).
            </span>
          </label>

          {reportMode && (
            <div className="mt-3">
              <Field label="Sağlık raporu numarası" hint="Raporunuz eczacı tarafından Medula üzerinden doğrulanır.">
                <input className={inputCls} value={reportNo} onChange={(e) => setReportNo(e.target.value)} placeholder="Örn: 7829-KA" />
              </Field>
            </div>
          )}

          <div className="mt-5"><SecureNote>Reçete görseliniz uçtan uca şifrelenir ve yalnızca siparişi hazırlayan eczacı görüntüleyebilir.</SecureNote></div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(2)} disabled={!code && !file}>
              Devam et <Icon name="arrow_forward" className="text-[16px]" />
            </Button>
          </div>
        </Card>
      )}

      {/* 2 — ilaclar */}
      {step === 2 && (
        <Card className="p-6">
          <h2 className="font-medium text-[16px] mb-1">Reçetedeki ilaçlar</h2>
          <p className="text-[13px] text-ink-soft mb-5">Talebinize eklemek istediğiniz ilaçları işaretleyin.</p>

          <div className="space-y-2">
            {medicines.map((m) => {
              const on = picked.includes(m.id);
              return (
                <label key={m.id}
                  className={`flex items-center gap-3 border rounded p-3 cursor-pointer transition-colors ${on ? "border-brand bg-brand-light/30" : "border-line hover:border-brand/40"}`}>
                  <input type="checkbox" checked={on} className="w-4 h-4 accent-[#0d6e66]"
                    onChange={() => setPicked((p) => (on ? p.filter((x) => x !== m.id) : [...p, m.id]))} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-medium">{m.name}</span>
                      {m.prescriptionOnly && <Badge tone="amber">Reçeteli</Badge>}
                      {m.reportRequired && <Badge tone="alert">Raporlu</Badge>}
                    </div>
                    <p className="text-[12.5px] text-ink-soft mt-0.5">{m.activeIngredient} · {m.dose}</p>
                  </div>
                </label>
              );
            })}
          </div>

          {needsReport && (
            <div className="flex items-start gap-2 bg-alert-light border border-alert/15 rounded p-3 mt-4">
              <Icon name="info" className="text-[17px] text-alert mt-[1px]" />
              <p className="text-[12.5px] text-alert-dark leading-relaxed">
                Seçiminiz raporlu ilaç içeriyor. Eczane, teslimat öncesi raporunuzu doğrulamak için sizinle iletişime geçecek.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(1)}>Geri</Button>
            <Button onClick={() => setStep(3)} disabled={picked.length === 0}>
              Devam et <Icon name="arrow_forward" className="text-[16px]" />
            </Button>
          </div>
        </Card>
      )}

      {/* 3 — eczane */}
      {step === 3 && (
        <Card className="p-6">
          <h2 className="font-medium text-[16px] mb-1">Eczane seçin</h2>
          <p className="text-[13px] text-ink-soft mb-5">Seçtiğiniz ilaçların tamamını bulunduran eczaneler üstte listelenir.</p>

          <div className="space-y-2">
            {candidates.map(({ pharmacy: p, complete, total }) => (
              <label key={p.id}
                className={`flex items-center gap-3 border rounded p-3.5 cursor-pointer transition-colors ${
                  pharmacyId === p.id ? "border-brand bg-brand-light/30" : "border-line hover:border-brand/40"
                } ${complete ? "" : "opacity-60"}`}>
                <input type="radio" name="ph" disabled={!complete} checked={pharmacyId === p.id}
                  onChange={() => setPharmacyId(p.id)} className="w-4 h-4 accent-[#0d6e66]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-medium">{p.name}</span>
                    {p.duty && <Badge tone="alert" dot>Nöbetçi</Badge>}
                    {!complete && <Badge tone="neutral">Eksik stok</Badge>}
                  </div>
                  <p className="text-[12.5px] text-ink-soft mt-0.5">
                    {p.distanceKm} km · ~{p.prepMinutes} dk hazırlık · {p.rating} puan
                  </p>
                </div>
                {complete && <span className="text-[14px] font-medium">{money(total)}</span>}
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(2)}>Geri</Button>
            <Button onClick={() => setStep(4)} disabled={!pharmacyId}>
              Devam et <Icon name="arrow_forward" className="text-[16px]" />
            </Button>
          </div>
        </Card>
      )}

      {/* 4 — adres */}
      {step === 4 && (
        <Card className="p-6">
          <h2 className="font-medium text-[16px] mb-1">Teslimat adresi</h2>
          <p className="text-[13px] text-ink-soft mb-5">Reçeteli ilaçlar yalnızca reçete sahibine teslim edilir.</p>

          <div className="space-y-2">
            {addresses.map((a) => (
              <label key={a.id}
                className={`flex items-start gap-3 border rounded p-3.5 cursor-pointer transition-colors ${
                  addressId === a.id ? "border-brand bg-brand-light/30" : "border-line hover:border-brand/40"
                }`}>
                <input type="radio" name="ad" checked={addressId === a.id} onChange={() => setAddressId(a.id)}
                  className="mt-0.5 w-4 h-4 accent-[#0d6e66]" />
                <Icon name={a.icon} className="text-[19px] text-brand mt-[1px]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium">{a.label}</p>
                  <p className="text-[12.5px] text-ink-soft mt-0.5">{a.detail}</p>
                  {a.note && <p className="text-[12px] text-ink-faint mt-1">Not: {a.note}</p>}
                </div>
              </label>
            ))}
          </div>

          <Link href="/adresler" className="inline-flex items-center gap-1.5 text-[13px] text-brand hover:underline mt-4">
            <Icon name="add_circle" className="text-[16px]" /> Yeni adres ekle
          </Link>

          <div className="mt-5">
            <Field label="Kurye notu (isteğe bağlı)">
              <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Örn: Zil çalışmıyor, arayın" />
            </Field>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(3)}>Geri</Button>
            <Button onClick={() => setStep(5)} disabled={!addressId}>
              Özete geç <Icon name="arrow_forward" className="text-[16px]" />
            </Button>
          </div>
        </Card>
      )}

      {/* 5 — ozet */}
      {step === 5 && chosen && (
        <Card className="p-6">
          <h2 className="font-medium text-[16px] mb-5">Sipariş özeti</h2>

          <dl className="space-y-2.5 text-[13.5px]">
            <Row k="Eczane" v={chosen.pharmacy.name} />
            <Row k="Teslimat adresi" v={`${address?.label} · ${address?.detail}`} />
            <Row k="Tahmini teslimat" v={`${chosen.pharmacy.prepMinutes + 18} dk`} />
            {code && <Row k="E-reçete kodu" v={code} />}
            {needsReport && <Row k="Rapor" v={reportNo || "Eczacı doğrulayacak"} />}
          </dl>

          <div className="h-px bg-line my-4" />

          <dl className="space-y-2 text-[13.5px]">
            {selected.map((m) => {
              const s = stock.find((x) => x.pharmacyId === chosen.pharmacy.id && x.medicineId === m.id);
              return <Row key={m.id} k={`${m.name} ${m.dose}`} v={money(s?.price ?? 0)} />;
            })}
            <Row k="Kurye bedeli" v={money(29.9)} />
          </dl>

          <div className="h-px bg-line my-4" />
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-medium">Toplam</span>
            <span className="font-display text-[19px] font-semibold text-brand">{money(subtotal + 29.9)}</span>
          </div>

          <div className="mt-5"><SecureNote>Ödeme kapıda veya online tahsil edilir. Reçeteli ilaçlar kimlik ibrazıyla teslim edilir.</SecureNote></div>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(4)}>Geri</Button>
            <Button onClick={submit}>
              <Icon name="check_circle" className="text-[16px]" /> Siparişi oluştur
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-soft">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
