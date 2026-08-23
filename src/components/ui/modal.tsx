"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Dialog sederhana untuk form dan konfirmasi pada panel admin. */
export function Modal({
  terbuka,
  judul,
  deskripsi,
  onTutup,
  children,
  lebar = "md",
}: {
  terbuka: boolean;
  judul: string;
  deskripsi?: string;
  onTutup: () => void;
  children: ReactNode;
  lebar?: "md" | "lg";
}) {
  useEffect(() => {
    if (!terbuka) return;
    const tekan = (event: KeyboardEvent) => {
      if (event.key === "Escape") onTutup();
    };
    document.addEventListener("keydown", tekan);
    return () => document.removeEventListener("keydown", tekan);
  }, [onTutup, terbuka]);

  if (!terbuka) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={judul}
        className={cn(
          "w-full rounded-2xl bg-white shadow-[var(--shadow-lift)]",
          lebar === "lg" ? "max-w-2xl" : "max-w-md",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-navy-900">{judul}</h2>
            {deskripsi ? (
              <p className="mt-1 text-sm text-muted">{deskripsi}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onTutup}
            aria-label="Tutup"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"
          >
            <X className="size-4.5" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
