"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Card, Field, Icon, SecureNote, inputCls } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!consent) { setError("Devam etmek için KVKK aydınlatma metnini onaylamalısınız."); return; }
    const res = register(form);
    if (!res.ok) { setError(res.error ?? "Kayıt tamamlanamadı."); return; }
    router.push("/");
  }

  return (
    <div className="max-w-md mx-auto px-5 py-14">
      <div className="text-center mb-8">
        <h1 className="font-display text-[24px] font-semibold tracking-tight">Hasta hesabı oluşturun</h1>
        <p className="text-[13.5px] text-ink-soft mt-1.5">Reçete yükleyip sipariş verebilmek için ücretsiz kayıt.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Ad soyad">
            <input className={inputCls} value={form.name} onChange={set("name")} required placeholder="Ad Soyad" />
          </Field>
          <Field label="E-posta">
            <input className={inputCls} type="email" value={form.email} onChange={set("email")} required placeholder="ornek@eposta.com" />
          </Field>
          <Field label="Telefon" hint="Kurye teslimatı için gereklidir.">
            <input className={inputCls} value={form.phone} onChange={set("phone")} required placeholder="05XX XXX XX XX" />
          </Field>
          <Field label="Şifre" hint="En az 6 karakter.">
            <input className={inputCls} type="password" value={form.password} onChange={set("password")} required placeholder="••••••" />
          </Field>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#0d6e66]" />
            <span className="text-[12.5px] text-ink-soft leading-relaxed">
              Sağlık verilerimin sipariş sürecinin yürütülmesi amacıyla işlenmesini kabul ediyorum.{" "}
              <a href="#" className="text-brand hover:underline">KVKK aydınlatma metni</a>
            </span>
          </label>

          {error && (
            <div className="flex items-start gap-2 bg-alert-light border border-alert/20 rounded p-3">
              <Icon name="error" className="text-[17px] text-alert mt-[1px]" />
              <p className="text-[13px] text-alert-dark">{error}</p>
            </div>
          )}

          <Button type="submit" full>Hesap oluştur</Button>
        </form>

        <p className="text-[13px] text-ink-soft text-center mt-5">
          Zaten hesabınız var mı? <Link href="/giris" className="text-brand hover:underline">Giriş yapın</Link>
        </p>
      </Card>

      <div className="mt-5">
        <SecureNote>
          Reçete görselleriniz yalnızca siparişi hazırlayan eczacı tarafından görüntülenir ve
          teslimat sonrası erişime kapatılır.
        </SecureNote>
      </div>
    </div>
  );
}
