import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "navy" | "gold" | "hijau" | "netral" | "merah";

const tones: Record<Tone, string> = {
  navy: "bg-navy-50 text-navy-700 ring-navy-100",
  gold: "bg-gold-50 text-gold-700 ring-gold-200",
  hijau: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  netral: "bg-slate-100 text-slate-600 ring-slate-200",
  merah: "bg-rose-50 text-rose-700 ring-rose-100",
};

export function Badge({
  children,
  tone = "navy",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
