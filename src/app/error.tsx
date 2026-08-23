"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";

/**
 * Batas kesalahan untuk seluruh halaman.
 *
 * Pesan teknis sengaja tidak ditampilkan kepada pengguna; hanya `digest` yang
 * ditunjukkan agar panitia dapat mencocokkannya dengan log server.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Halaman gagal dimuat:", error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="size-6" />
        </span>

        <h1 className="mt-5 text-xl font-bold tracking-tight text-navy-900">
          Halaman gagal dimuat
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          Terjadi kendala saat menyiapkan halaman ini. Coba muat ulang; bila
          masih berlanjut, hubungi pengajar Smart Home Center.
        </p>

        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-slate-400">
            Kode kejadian: {error.digest}
          </p>
        ) : null}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RotateCcw className="size-4" />
            Coba lagi
          </Button>
          <ButtonLink href="/" variant="outline">
            Kembali ke beranda
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
