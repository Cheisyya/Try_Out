"use client";

import { useState } from "react";
import { Check, ClipboardList, Copy, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  BAGIAN_ISIAN,
  teksBagian,
  teksSemua,
  type KunciBagianIsian,
} from "@/lib/pendaftaran/daftar-isian";
import { cn } from "@/lib/utils";

/**
 * Tombol salin daftar isian Data Diri.
 *
 * Panitia memakainya untuk memberi tahu peserta yang tidak mengisi sendiri:
 * salin satu bagian (atau seluruhnya), tempel di WhatsApp, kirim. Teksnya
 * disusun dari sumber yang sama dengan formulir, jadi daftarnya tidak akan
 * berbeda dengan yang benar-benar diminta portal.
 */
export function SalinDaftarIsian() {
  const toast = useToast();
  const [tersalin, setTersalin] = useState<KunciBagianIsian | "semua" | null>(
    null,
  );

  const salin = async (
    penanda: KunciBagianIsian | "semua",
    teks: string,
    label: string,
  ) => {
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(penanda);
      toast.sukses(`${label} disalin. Tinggal tempel di chat peserta.`);
      setTimeout(() => setTersalin(null), 3000);
    } catch {
      toast.galat(
        "Teks gagal disalin. Peramban menolak akses papan klip — salin manual dari berkas Daftar Isian Data Diri.txt.",
      );
    }
  };

  return (
    <div className="space-y-4">
      <ul className="grid gap-3 sm:grid-cols-2">
        {BAGIAN_ISIAN.map((bagian) => {
          const Ikon = bagian.jenis === "unggah" ? Upload : FileText;
          const ini = tersalin === bagian.kunci;
          return (
            <li
              key={bagian.kunci}
              className="flex items-center gap-3 rounded-xl border border-line px-4 py-3"
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg",
                  bagian.jenis === "unggah"
                    ? "bg-gold-50 text-gold-700"
                    : "bg-navy-50 text-navy-700",
                )}
              >
                <Ikon className="size-4.5" strokeWidth={2} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-navy-900">
                  {bagian.judul}
                </span>
                <span className="text-xs text-muted">
                  {bagian.butir.length}{" "}
                  {bagian.jenis === "unggah" ? "berkas" : "isian"}
                </span>
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  void salin(bagian.kunci, teksBagian(bagian), bagian.judul)
                }
              >
                {ini ? <Check className="size-4" /> : <Copy className="size-4" />}
                {ini ? "Tersalin" : "Salin"}
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <Button
          type="button"
          onClick={() => void salin("semua", teksSemua(), "Seluruh daftar")}
        >
          {tersalin === "semua" ? (
            <Check className="size-4" />
          ) : (
            <ClipboardList className="size-4" />
          )}
          {tersalin === "semua" ? "Tersalin" : "Salin Seluruh Daftar"}
        </Button>
        <p className="text-xs text-muted">
          Isi yang sama juga tersimpan sebagai berkas{" "}
          <b className="text-navy-800">Daftar Isian Data Diri.txt</b> pada folder
          project.
        </p>
      </div>
    </div>
  );
}
