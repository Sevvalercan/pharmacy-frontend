"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { medicines, money } from "@/lib/data";
import { Badge, Button, Card, Empty, Field, Icon, PageTitle, inputCls } from "@/components/ui";

export default function VendorStock() {
  const { currentUser, stock, updateStock, addStock, removeStock } = useStore();
  const pid = currentUser?.pharmacyId ?? "";
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ medicineId: "", quantity: 10, price: 0 });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return stock
      .filter((s) => s.pharmacyId === pid)
      .map((s) => ({ ...s, medicine: medicines.find((m) => m.id === s.medicineId)! }))
      .filter((s) => s.medicine)
      .filter((s) => !term || s.medicine.name.toLowerCase().includes(term) || s.medicine.activeIngredient.toLowerCase().includes(term));
  }, [stock, pid, q]);

  const missing = medicines.filter((m) => !stock.some((s) => s.pharmacyId === pid && s.medicineId === m.id));

  return (
    <>
      <PageTitle title="Stok yönetimi" subtitle="Buradaki değişiklikler kullanıcı tarafındaki arama sonuçlarına anında yansır."
        action={<Button size="sm" onClick={() => setAdding((v) => !v)}>
          <Icon name="add" className="text-[16px]" /> İlaç ekle
        </Button>} />

      {adding && (
        <Card className="p-5 mb-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newItem.medicineId) return;
            addStock({ pharmacyId: pid, medicineId: newItem.medicineId, quantity: newItem.quantity, price: newItem.price, inStock: newItem.quantity > 0 });
            setNewItem({ medicineId: "", quantity: 10, price: 0 });
            setAdding(false);
          }} className="grid sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <Field label="İlaç">
                <select className={inputCls} value={newItem.medicineId} required
                  onChange={(e) => setNewItem({ ...newItem, medicineId: e.target.value })}>
                  <option value="">Katalogdan seçin…</option>
                  {missing.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.dose}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Adet">
              <input type="number" min={0} className={inputCls} value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })} />
            </Field>
            <Field label="Fiyat (₺)">
              <input type="number" min={0} step="0.01" className={inputCls} value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} />
            </Field>
            <div className="sm:col-span-4 flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Vazgeç</Button>
              <Button size="sm" type="submit">Stoğa ekle</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex items-center gap-2 bg-white border border-line rounded-full p-1.5 mb-4 focus-within:border-brand transition-colors">
        <Icon name="search" className="text-[18px] text-ink-faint ml-2.5" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Stokta ilaç ara"
          className="flex-1 bg-transparent outline-none text-[13.5px] py-1.5" />
      </div>

      <Card className="overflow-hidden">
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2.5 bg-canvas border-b border-line text-[11.5px] text-ink-faint uppercase tracking-wide">
          <span>İlaç</span><span>Adet</span><span>Fiyat</span><span>Durum</span><span />
        </div>
        {rows.length === 0 && <div className="p-4"><Empty icon="inventory_2" text="Stok kaydı bulunamadı." /></div>}
        {rows.map((s) => (
          <div key={s.medicineId}
            className="grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3 border-b border-line-soft last:border-0 items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13.5px] font-medium">{s.medicine.name}</span>
                {s.medicine.reportRequired && <Badge tone="alert">Raporlu</Badge>}
              </div>
              <p className="text-[12px] text-ink-soft">{s.medicine.activeIngredient} · {s.medicine.dose}</p>
            </div>
            <input type="number" min={0} value={s.quantity}
              onChange={(e) => {
                const q2 = Number(e.target.value);
                updateStock(pid, s.medicineId, { quantity: q2, inStock: q2 > 0 });
              }}
              className="w-20 border border-line rounded px-2 py-1 text-[13px] outline-none focus:border-brand" />
            <span className="text-[13px]">{money(s.price)}</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={s.inStock} className="w-4 h-4 accent-[#0d6e66]"
                onChange={(e) => updateStock(pid, s.medicineId, { inStock: e.target.checked })} />
              <span className="text-[12.5px]">{s.inStock ? <Badge tone="brand">Stokta</Badge> : <Badge tone="neutral">Yok</Badge>}</span>
            </label>
            <button type="button" onClick={() => removeStock(pid, s.medicineId)}
              className="p-1.5 rounded-full text-ink-faint hover:text-alert hover:bg-alert-light justify-self-end">
              <Icon name="delete" className="text-[17px]" />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}
