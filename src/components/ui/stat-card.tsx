import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  nilai,
  keterangan,
  icon: Icon,
  className,
}: {
  label: string;
  nilai: string;
  keterangan?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon ? (
          <span className="grid size-9 place-items-center rounded-xl bg-navy-50 text-navy-700">
            <Icon className="size-4.5" strokeWidth={2} />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-navy-900">
        {nilai}
      </p>
      {keterangan ? (
        <p className="mt-1 text-xs text-muted">{keterangan}</p>
      ) : null}
    </div>
  );
}
