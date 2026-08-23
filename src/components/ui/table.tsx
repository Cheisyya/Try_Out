import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Pembungkus tabel agar tetap terbaca di layar kecil (scroll horizontal). */
export function TableWrapper({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("w-full min-w-0 overflow-x-auto", className)}
      {...props}
    />
  );
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <table
      className={cn("w-full min-w-[640px] border-collapse text-sm", className)}
      {...props}
    />
  );
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border-b border-line bg-navy-50/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-700 first:rounded-tl-xl last:rounded-tr-xl",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("border-b border-line px-4 py-3.5 text-navy-800", className)}
      {...props}
    />
  );
}
