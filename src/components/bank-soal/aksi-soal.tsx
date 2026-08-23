"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, EyeOff, LoaderCircle, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { hapusSoalAksi, ubahStatusAktifAksi } from "@/lib/actions-bank-soal";
import { cn } from "@/lib/utils";

/**
 * Aksi satu butir soal: sunting, aktif/nonaktif, dan hapus.
 *
 * Seragam dengan tabel admin lain — ikon berlebar tetap, maknanya lewat tooltip
 * dan teks `sr-only`. Konfirmasi hapus memakai modal alih-alih menukar tombol di
 * tempat: penukaran itu membuat tombol lain bergeser tepat saat hendak diklik.
 */
export function AksiSoal({ id, aktif }: { id: string; aktif: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [hapus, setHapus] = useState(false);

  const jalankan = (
    aksi: () => Promise<{ ok: boolean; masalah?: string[] }>,
    pesanSukses: string,
    setelah?: () => void,
  ) => {
    mulaiTransisi(async () => {
      const hasil = await aksi();
      if (!hasil.ok) {
        toast.galat(hasil.masalah?.[0] ?? "Perubahan gagal disimpan.");
        return;
      }
      toast.sukses(pesanSukses);
      setelah?.();
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/admin/bank-soal/${id}`}
          title="Sunting soal"
          className={gayaIkon}
        >
          <Pencil className="size-4.5" strokeWidth={2} />
          <span className="sr-only">Sunting soal {id}</span>
        </Link>

        <TombolIkon
          label={aktif ? "Nonaktifkan soal" : "Aktifkan soal"}
          disabled={proses}
          onClick={() =>
            jalankan(
              () => ubahStatusAktifAksi(id, !aktif),
              `Soal ${id} kini ${aktif ? "nonaktif" : "aktif"}.`,
            )
          }
        >
          {proses ? (
            <LoaderCircle className="size-4.5 animate-spin" />
          ) : aktif ? (
            <EyeOff className="size-4.5" />
          ) : (
            <Eye className="size-4.5" />
          )}
        </TombolIkon>

        <TombolIkon
          label="Hapus soal"
          disabled={proses}
          onClick={() => setHapus(true)}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <Trash2 className="size-4.5" />
        </TombolIkon>
      </div>

      <Modal
        terbuka={hapus}
        judul="Hapus soal ini?"
        deskripsi={`Soal ${id} akan dihapus permanen dari bank soal.`}
        onTutup={() => setHapus(false)}
      >
        <p className="text-sm leading-relaxed text-muted">
          Soal yang sudah pernah dikerjakan peserta tetap tercatat pada riwayat
          hasil mereka, tetapi pembahasannya tidak lagi dapat dibuka. Bila hanya
          ingin menariknya dari pelaksanaan berikutnya, gunakan{" "}
          <b className="text-navy-800">Nonaktifkan</b>.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            type="button"
            className="w-full bg-rose-600 hover:bg-rose-700 sm:w-auto"
            disabled={proses}
            onClick={() =>
              jalankan(() => hapusSoalAksi(id), `Soal ${id} telah dihapus.`, () =>
                setHapus(false),
              )
            }
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Ya, hapus soal
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setHapus(false)}
            disabled={proses}
          >
            Batal
          </Button>
        </div>
      </Modal>
    </>
  );
}

const gayaIkon =
  "grid size-9 shrink-0 place-items-center rounded-lg border border-transparent text-slate-500 transition hover:border-navy-100 hover:bg-navy-50 hover:text-navy-900 disabled:pointer-events-none disabled:opacity-50";

function TombolIkon({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button type="button" title={label} className={cn(gayaIkon, className)} {...props}>
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
