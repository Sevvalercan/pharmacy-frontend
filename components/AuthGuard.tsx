"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Button, Card, Icon } from "./ui";

export default function AuthGuard({
  children, roles = ["user"], title = "Bu alan giriş gerektiriyor",
  description = "Sağlık verilerinizi korumak için bu sayfayı yalnızca giriş yapan kullanıcılar görüntüleyebilir.",
}: {
  children: React.ReactNode;
  roles?: Role[];
  title?: string;
  description?: string;
}) {
  const { currentUser, ready } = useStore();

  if (!ready) {
    return <div className="max-w-shell mx-auto px-5 py-16 text-[14px] text-ink-faint">Yükleniyor…</div>;
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-5 py-20">
        <Card className="p-8 text-center">
          <span className="w-12 h-12 rounded-full bg-brand-light text-brand flex items-center justify-center mx-auto mb-4">
            <Icon name="lock" className="text-[24px]" />
          </span>
          <h1 className="font-display text-[20px] font-semibold mb-2">{title}</h1>
          <p className="text-[13.5px] text-ink-soft leading-relaxed mb-6">{description}</p>
          <div className="flex gap-2 justify-center">
            <Button href="/giris">Giriş yap</Button>
            <Button href="/kayit" variant="outline">Kayıt ol</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!roles.includes(currentUser.role)) {
    return (
      <div className="max-w-md mx-auto px-5 py-20">
        <Card className="p-8 text-center">
          <span className="w-12 h-12 rounded-full bg-alert-light text-alert flex items-center justify-center mx-auto mb-4">
            <Icon name="shield_lock" className="text-[24px]" />
          </span>
          <h1 className="font-display text-[20px] font-semibold mb-2">Yetkiniz yok</h1>
          <p className="text-[13.5px] text-ink-soft mb-6">
            Bu sayfa {roles.join(", ")} rolü içindir. Mevcut rolünüz: {currentUser.role}.
          </p>
          <Link href="/" className="text-[13.5px] text-brand hover:underline">Ana sayfaya dön</Link>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
