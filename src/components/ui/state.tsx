import type { ComponentType, ReactNode } from "react";
import { Inbox, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Komponen keadaan halaman: memuat, kosong, dan gagal.
 * Dipakai agar setiap tabel/daftar memberi jawaban yang jelas ketika datanya
 * belum ada, sedang dimuat, atau gagal dimuat.
 */

export function KeadaanMemuat({
  pesan = "Memuat data...",
  className,
}: {
  pesan?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2.5 px-5 py-12 text-sm text-muted",
        className,
      )}
    >
      <LoaderCircle className="size-4.5 animate-spin text-navy-600" />
      {pesan}
    </div>
  );
}

export function KeadaanKosong({
  judul,
  deskripsi,
  ikon: Ikon = Inbox,
  aksi,
  className,
}: {
  judul: string;
  deskripsi?: string;
  ikon?: ComponentType<{ className?: string }>;
  aksi?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-5 py-12 text-center sm:px-6", className)}>
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-navy-50 text-navy-600">
        <Ikon className="size-5.5" />
      </span>
      <p className="mt-3.5 text-sm font-semibold text-navy-900">{judul}</p>
      {deskripsi ? (
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
          {deskripsi}
        </p>
      ) : null}
      {aksi ? <div className="mt-5">{aksi}</div> : null}
    </div>
  );
}

/** Rangka abu-abu untuk tabel yang sedang dimuat. */
export function RangkaTabel({ baris = 5 }: { baris?: number }) {
  return (
    <div className="space-y-2.5 px-5 py-5 sm:px-6" aria-hidden>
      {Array.from({ length: baris }, (_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded-lg bg-navy-50"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}
