import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  judul,
  deskripsi,
  aksi,
  className,
}: {
  judul: ReactNode;
  deskripsi?: ReactNode;
  aksi?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-navy-900">{judul}</h2>
        {deskripsi ? (
          <p className="text-sm text-muted">{deskripsi}</p>
        ) : null}
      </div>
      {aksi ? <div className="shrink-0">{aksi}</div> : null}
    </div>
  );
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-5 py-5 sm:px-6", className)} {...props} />;
}
