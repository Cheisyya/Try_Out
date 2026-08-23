import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-medium text-navy-900", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-navy-100 bg-white px-3.5 text-sm text-navy-900 shadow-sm outline-none transition",
        "placeholder:text-slate-400 focus:border-navy-400 focus:ring-4 focus:ring-navy-100",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-navy-100 bg-white px-3 text-sm text-navy-900 shadow-sm outline-none transition",
        "focus:border-navy-400 focus:ring-4 focus:ring-navy-100",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-sm text-navy-900 shadow-sm outline-none transition",
        "placeholder:text-slate-400 focus:border-navy-400 focus:ring-4 focus:ring-navy-100",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
