"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";

/**
 * Batas kesalahan ruang ujian.
 *
 * Pesannya menegaskan hal yang benar secara teknis: jawaban dikirim ke server
 * setiap kali peserta memilih opsi, dan sisa waktu dihitung server dari waktu
 * mulai — sehingga kegagalan render halaman tidak menghilangkan keduanya.
 */
export default function UjianError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Ruang ujian gagal dimuat:", error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="size-6" />
        </span>

        <h1 className="mt-5 text-xl font-bold tracking-tight text-navy-900">
          Ruang ujian gagal dimuat
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          Jawaban yang sudah Anda pilih tersimpan di server dan tidak hilang.
          Sisa waktu juga dihitung server. Coba muat ulang ruang ujian, lalu
          laporkan kepada pengawas bila kendala berlanjut.
        </p>

        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-slate-400">
            Kode kejadian: {error.digest}
          </p>
        ) : null}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" variant="gold" onClick={reset}>
            <RotateCcw className="size-4" />
            Muat ulang ruang ujian
          </Button>
          <ButtonLink href="/siswa/tryout" variant="outline">
            Kembali ke daftar try out
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
