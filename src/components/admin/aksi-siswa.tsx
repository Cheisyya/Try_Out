"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, LoaderCircle, Power, Trash2, type LucideIcon } from "lucide-react";

import type { SiswaForm } from "@/components/admin/kelola-siswa";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { hapusSiswaAksi, ubahStatusSiswaAksi } from "@/lib/actions-siswa";
import { cn } from "@/lib/utils";

/**
 * Seluruh aksi satu baris tabel siswa dalam satu kelompok tombol.
 *
 * Tombolnya ikon saja dengan lebar tetap supaya kolom Aksi tidak pernah melebar
 * mengikuti panjang teks — inilah yang sebelumnya membuat kolom ini terpotong
 * pada layar sempit. Maknanya tetap terbaca pembaca layar lewat `sr-only`, dan
 * terbaca pengguna lewat tooltip.
 *
 * Penyuntingan data tidak ada di sini: ia dilakukan dari halaman detail siswa,
 * tempat seluruh datanya terlihat sekaligus. Baris tabel hanya menyediakan
 * tindakan cepat — buka detail, aktif/nonaktif, dan hapus.
 */
export function AksiBarisSiswa({ siswa }: { siswa: SiswaForm }) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [hapus, setHapus] = useState(false);

  const aktif = siswa.status === "Aktif";

  const ubahStatus = () => {
    mulaiTransisi(async () => {
      const hasil = await ubahStatusSiswaAksi(
        siswa.id,
        aktif ? "Nonaktif" : "Aktif",
      );
      if (!hasil.ok) {
        toast.galat(hasil.masalah?.[0] ?? "Perubahan gagal disimpan.");
        return;
      }
      toast.sukses(
        `${siswa.nama} kini berstatus ${aktif ? "Nonaktif" : "Aktif"}.`,
      );
      router.refresh();
    });
  };

  const jalankanHapus = () => {
    mulaiTransisi(async () => {
      const hasil = await hapusSiswaAksi(siswa.id);
      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Peserta gagal dihapus.");
        return;
      }
      toast.sukses(`${siswa.nama} telah dihapus.`);
      setHapus(false);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <TautanIkon
          href={`/admin/siswa/${siswa.id}`}
          icon={Eye}
          label="Lihat detail"
        />
        <TombolIkon
          icon={proses ? LoaderCircle : Power}
          label={aktif ? "Nonaktifkan akun" : "Aktifkan akun"}
          onClick={ubahStatus}
          disabled={proses}
          berputar={proses}
          className={
            aktif
              ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          }
        />
        <TombolIkon
          icon={Trash2}
          label="Hapus peserta"
          onClick={() => setHapus(true)}
          disabled={proses}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        />
      </div>

      <Modal
        terbuka={hapus}
        judul="Hapus peserta?"
        deskripsi={`${siswa.nama} akan dihapus permanen.`}
        onTutup={() => setHapus(false)}
      >
        <p className="text-sm leading-relaxed text-muted">
          Seluruh data peserta beserta{" "}
          <b className="text-navy-800">
            {siswa.jumlahPercobaan} riwayat pengerjaan
          </b>{" "}
          akan ikut terhapus dan tidak dapat dikembalikan. Bila hanya ingin
          menutup aksesnya, gunakan tombol{" "}
          <b className="text-navy-800">Nonaktifkan</b>.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            type="button"
            className="w-full bg-rose-600 hover:bg-rose-700 sm:w-auto"
            disabled={proses}
            onClick={jalankanHapus}
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Ya, hapus permanen
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

/* ------------------------------ Tombol ikon ------------------------------- */

const gayaIkon =
  "grid size-9 shrink-0 place-items-center rounded-lg border border-transparent text-slate-500 transition hover:border-navy-100 hover:bg-navy-50 hover:text-navy-900 disabled:pointer-events-none disabled:opacity-50";

function TombolIkon({
  icon: Icon,
  label,
  className,
  berputar = false,
  ...props
}: {
  icon: LucideIcon;
  label: string;
  berputar?: boolean;
} & React.ComponentProps<"button">) {
  return (
    <button type="button" title={label} className={cn(gayaIkon, className)} {...props}>
      <Icon className={cn("size-4.5", berputar && "animate-spin")} strokeWidth={2} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function TautanIkon({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link href={href} title={label} className={gayaIkon}>
      <Icon className="size-4.5" strokeWidth={2} />
      <span className="sr-only">{label}</span>
    </Link>
  );
}
