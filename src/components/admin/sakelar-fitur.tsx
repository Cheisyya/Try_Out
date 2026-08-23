"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";

import { useToast } from "@/components/ui/toast";
import { ubahFiturAksi } from "@/lib/actions-pengaturan";
import { cn } from "@/lib/utils";

/**
 * Sakelar hidup/mati satu fitur portal siswa.
 *
 * Nilainya digeser optimis supaya sakelarnya terasa responsif, lalu dikembalikan
 * bila server menolak — admin tidak boleh melihat sakelar "menyala" padahal
 * penyimpanannya gagal.
 */
export function SakelarFitur({
  kunci,
  judul,
  keterangan,
  aktif,
}: {
  kunci: string;
  judul: string;
  keterangan: string;
  aktif: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [nyala, setNyala] = useState(aktif);

  const geser = () => {
    const tujuan = !nyala;
    setNyala(tujuan);

    mulaiTransisi(async () => {
      const hasil = await ubahFiturAksi(kunci, tujuan);
      if (!hasil.ok) {
        setNyala(!tujuan);
        toast.galat(hasil.masalah[0] ?? "Pengaturan gagal disimpan.");
        return;
      }
      toast.sukses(
        tujuan
          ? `${judul} kini tampil di portal siswa.`
          : `${judul} disembunyikan dari portal siswa.`,
      );
      router.refresh();
    });
  };

  const idJudul = `fitur-${kunci}`;

  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1">
        <p id={idJudul} className="text-sm font-semibold text-navy-900">
          {judul}
        </p>
        <p className="text-sm leading-relaxed text-muted">{keterangan}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={nyala}
        aria-labelledby={idJudul}
        disabled={proses}
        onClick={geser}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-60",
          nyala ? "bg-emerald-500" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "grid size-5 place-items-center rounded-full bg-white shadow transition-transform",
            nyala ? "translate-x-6" : "translate-x-1",
          )}
        >
          {proses ? (
            <LoaderCircle className="size-3 animate-spin text-navy-600" />
          ) : null}
        </span>
        <span className="sr-only">
          {nyala ? `Sembunyikan ${judul}` : `Tampilkan ${judul}`}
        </span>
      </button>
    </div>
  );
}
