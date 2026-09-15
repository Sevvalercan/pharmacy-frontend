"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, Empty, Field, Icon, PageTitle, inputCls } from "@/components/ui";

export default function Page() {
  return <AuthGuard title="Adresleriniz için giriş yapın"><Addresses /></AuthGuard>;
}

function Addresses() {
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "", detail: "", note: "", isDefault: false });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addAddress({ ...form, icon: "location_on" });
    setForm({ label: "", detail: "", note: "", isDefault: false });
    setOpen(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <PageTitle title="Adreslerim" subtitle="Siparişlerinizin ulaştırılacağı lokasyonlar."
        action={<Button size="sm" onClick={() => setOpen((v) => !v)}>
          <Icon name="add_location_alt" className="text-[16px]" /> Yeni adres
        </Button>} />

      {open && (
        <Card className="p-5 mb-4">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Adres başlığı"><input required className={inputCls} value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Örn: Yazlık" /></Field>
            <Field label="Açık adres"><textarea required rows={2} className={inputCls} value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="Mahalle, cadde, kapı no" /></Field>
            <Field label="Kurye notu"><input className={inputCls} value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Örn: 3. kat" /></Field>
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-ink-soft">
              <input type="checkbox" checked={form.isDefault} className="w-4 h-4 accent-[#0d6e66]"
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              Varsayılan teslimat adresi yap
            </label>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Vazgeç</Button>
              <Button type="submit" size="sm">Kaydet</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-2.5">
        {addresses.length === 0 && <Empty icon="location_off" text="Kayıtlı adresiniz yok." />}
        {addresses.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex items-start gap-3">
              <Icon name={a.icon} className="text-[20px] text-brand mt-[1px]" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[14.5px]">{a.label}</h3>
                  {a.isDefault && <Badge tone="brand">Varsayılan</Badge>}
                </div>
                <p className="text-[13px] text-ink-soft mt-1">{a.detail}</p>
                {a.note && <p className="text-[12px] text-ink-faint mt-1">Not: {a.note}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!a.isDefault && (
                  <button type="button" onClick={() => setDefaultAddress(a.id)}
                    className="text-[12.5px] text-brand hover:bg-brand-light px-2.5 py-1.5 rounded-full">
                    Varsayılan yap
                  </button>
                )}
                <button type="button" onClick={() => removeAddress(a.id)}
                  className="p-1.5 rounded-full text-ink-faint hover:text-alert hover:bg-alert-light">
                  <Icon name="delete" className="text-[17px]" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
