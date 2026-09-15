"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Card, Field, Icon, SecureNote, inputCls } from "@/components/ui";

const DEMO = [
  { label: "Kullanıcı", email: "kullanici@eczajet.com" },
  { label: "Eczane (vendor)", email: "eczane@eczajet.com" },
  { label: "Admin", email: "admin@eczajet.com" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = login(email, password);
    if (!res.ok) { setError(res.error ?? "Giriş yapılamadı."); return; }
    const role = res.user?.role;
    router.push(role === "vendor" ? "/vendor" : role === "admin" ? "/admin" : "/");
  }

  return (
    <div className="max-w-md mx-auto px-5 py-14">
      <div className="text-center mb-8">
        <h1 className="font-display text-[24px] font-semibold tracking-tight">Tekrar hoş geldiniz</h1>
        <p className="text-[13.5px] text-ink-soft mt-1.5">Siparişleriniz ve reçeteleriniz için giriş yapın.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <Field label="E-posta">
            <input className={inputCls} type="email" value={email} required
              onChange={(e) => setEmail(e.target.value)} placeholder="ornek@eposta.com" />
          </Field>
          <Field label="Şifre">
            <div className="relative">
              <input className={inputCls + " pr-10"} type={show ? "text" : "password"} value={password} required
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
              <button type="button" onClick={() => setShow((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-ink-faint hover:text-ink">
                <Icon name={show ? "visibility_off" : "visibility"} className="text-[18px]" />
              </button>
            </div>
          </Field>

          {error && (
            <div className="flex items-start gap-2 bg-alert-light border border-alert/20 rounded p-3">
              <Icon name="error" className="text-[17px] text-alert mt-[1px]" />
              <p className="text-[13px] text-alert-dark">{error}</p>
            </div>
          )}

          <Button type="submit" full>Giriş yap</Button>
        </form>

        <p className="text-[13px] text-ink-soft text-center mt-5">
          Hesabınız yok mu? <Link href="/kayit" className="text-brand hover:underline">Kayıt olun</Link>
        </p>
      </Card>

      <div className="mt-5">
        <p className="text-[12px] text-ink-faint mb-2">Demo hesapları (şifre: herhangi 4+ karakter)</p>
        <div className="grid gap-1.5">
          {DEMO.map((d) => (
            <button key={d.email} type="button"
              onClick={() => { setEmail(d.email); setPassword("123456"); }}
              className="flex items-center justify-between bg-white border border-line rounded px-3 py-2 text-[12.5px] hover:border-brand transition-colors">
              <span className="text-ink-soft">{d.label}</span>
              <span className="font-mono text-[11.5px]">{d.email}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <SecureNote>
          Giriş bilgileriniz ve sağlık verileriniz KVKK kapsamında şifreli olarak işlenir,
          üçüncü taraflarla paylaşılmaz.
        </SecureNote>
      </div>
    </div>
  );
}
