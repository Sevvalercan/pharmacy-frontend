import Link from "next/link";
import { Card, Icon } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <Card className="p-8 text-center">
        <span className="w-12 h-12 rounded-full bg-line-soft text-ink-faint flex items-center justify-center mx-auto mb-4">
          <Icon name="search_off" className="text-[24px]" />
        </span>
        <h1 className="font-display text-[20px] font-semibold mb-2">Sayfa bulunamadı</h1>
        <p className="text-[13.5px] text-ink-soft mb-6">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
        <Link href="/" className="text-[13.5px] text-brand hover:underline">Ana sayfaya dön</Link>
      </Card>
    </div>
  );
}
