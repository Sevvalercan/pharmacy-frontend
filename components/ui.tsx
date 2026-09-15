import Link from "next/link";
import React from "react";

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`ms ${className}`} aria-hidden>{name}</span>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-canvas-card border border-line rounded-lg ${className}`}>{children}</div>;
}

type Tone = "brand" | "alert" | "amber" | "neutral" | "outline";
const toneMap: Record<Tone, string> = {
  brand: "bg-brand-light text-brand-dark",
  alert: "bg-alert-light text-alert-dark",
  amber: "bg-amber-light text-amber",
  neutral: "bg-line-soft text-ink-soft",
  outline: "border border-line text-ink-soft",
};

export function Badge({ tone = "neutral", children, dot = false }: { tone?: Tone; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${toneMap[tone]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

type BtnProps = {
  children: React.ReactNode;
  variant?: "primary" | "soft" | "ghost" | "danger" | "outline";
  size?: "sm" | "md";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  full?: boolean;
};

const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  soft: "bg-brand-light text-brand-dark hover:bg-brand-tint",
  ghost: "text-ink-soft hover:bg-line-soft",
  danger: "bg-alert text-white hover:bg-alert-dark",
  outline: "border border-line text-ink hover:bg-line-soft",
};

export function Button({
  children, variant = "primary", size = "md", href, onClick, type = "button",
  disabled, className = "", full,
}: BtnProps) {
  const cls = `inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none ${
    size === "sm" ? "text-[13px] px-3 py-1.5" : "text-sm px-4 py-2.5"
  } ${variants[variant]} ${full ? "w-full" : ""} ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-[26px] leading-tight font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-[14px] text-ink-soft mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ text, icon = "search_off" }: { text: string; icon?: string }) {
  return (
    <div className="col-span-full border border-dashed border-line rounded-lg py-10 text-center">
      <Icon name={icon} className="text-[26px] text-ink-faint" />
      <p className="text-[14px] text-ink-soft mt-2">{text}</p>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink-soft mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[12px] text-ink-faint mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full bg-white border border-line rounded px-3 py-2.5 text-[14px] outline-none focus:border-brand transition-colors placeholder:text-ink-faint";

export function Stat({ label, value, icon, tone = "brand" }: { label: string; value: React.ReactNode; icon: string; tone?: Tone }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <span className={`w-9 h-9 rounded flex items-center justify-center ${toneMap[tone]}`}>
          <Icon name={icon} className="text-[19px]" />
        </span>
      </div>
      <p className="font-display text-[24px] font-semibold mt-3 leading-none">{value}</p>
      <p className="text-[13px] text-ink-soft mt-1.5">{label}</p>
    </Card>
  );
}

export function SecureNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 bg-brand-light/60 border border-brand-tint rounded p-3">
      <Icon name="lock" className="text-[17px] text-brand mt-[1px]" />
      <p className="text-[12.5px] text-brand-dark leading-relaxed">{children}</p>
    </div>
  );
}
