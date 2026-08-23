"use client";

import { EyeOff, Maximize, ShieldAlert, ShieldCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StatusPengawas } from "@/components/ujian/pengawas";

/**
 * Tampilan pendamping pengawasan ujian: ajakan layar penuh, peringatan
 * sekilas, dan penanda jumlah kejadian yang tercatat.
 *
 * Lapisan layar penuh sengaja tidak menyediakan jalan keluar selama mata uji
 * berjalan — itulah kuncinya; layar penuh baru terlepas setelah jawaban
 * dikumpulkan. Yang tetap dijaga: peserta tidak boleh terjebak pada peramban
 * yang memang tidak mendukung layar penuh, jadi kasus itu ditangani di
 * `usePengawasUjian` dengan melepas kuncinya.
 */

export function AjakanLayarPenuh({ pengawas }: { pengawas: StatusPengawas }) {
  if (!pengawas.ajakanLayarPenuh) return null;

  // Sebelum peserta pernah masuk layar penuh, ini sekadar pintu masuk. Sesudahnya
  // ia menjadi penutup naskah: keluar dari layar penuh tidak memberi keuntungan
  // apa pun selama mata uji belum dikumpulkan.
  const menutup = pengawas.pernahKeluar;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="judul-layar-penuh"
      className="fixed inset-0 z-[60] grid place-items-center bg-navy-950/90 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-[var(--shadow-lift)]">
        <span
          className={cn(
            "mx-auto grid size-12 place-items-center rounded-xl",
            menutup ? "bg-rose-50 text-rose-600" : "bg-navy-50 text-navy-700",
          )}
        >
          {menutup ? (
            <ShieldAlert className="size-6" />
          ) : (
            <Maximize className="size-6" />
          )}
        </span>

        <h2
          id="judul-layar-penuh"
          className="mt-4 text-lg font-semibold text-navy-900"
        >
          {menutup ? "Kembali ke layar penuh" : "Ujian berjalan layar penuh"}
        </h2>

        {menutup && pengawas.terkunci ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Naskah soal tertutup sampai Anda kembali. Layar penuh baru terlepas
            setelah jawaban dikumpulkan.
          </p>
        ) : null}

        <Button
          type="button"
          variant="gold"
          className="mt-6 w-full"
          autoFocus
          onClick={pengawas.mintaLayarPenuh}
        >
          <Maximize className="size-4" />
          {menutup ? "Lanjutkan mengerjakan" : "Mulai"}
        </Button>
      </div>
    </div>
  );
}

/**
 * Tirai hitam anti tangkapan layar.
 *
 * Menutup seluruh layar begitu ada tanda pengambilan tangkapan layar — tombol
 * PrintScreen, pintasan alat pemotong, atau halaman kehilangan fokus. Warnanya
 * hitam pekat tanpa transparansi supaya gambar yang tertangkap benar-benar
 * kosong, dan keterangannya sengaja singkat agar tidak ada isi soal yang ikut
 * terbaca. Peramban tidak dapat mencegah tangkapan layar tingkat sistem; yang
 * dilakukan lapisan ini adalah membuat hasilnya tidak berguna.
 */
export function TiraiLayar({ pengawas }: { pengawas: StatusPengawas }) {
  if (!pengawas.tiraiLayar) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[80] grid select-none place-items-center bg-black"
    >
      <p className="px-6 text-center text-sm font-semibold text-slate-500">
        Naskah soal ditutup.
        <br />
        Kembali ke jendela ujian untuk melanjutkan.
      </p>
    </div>
  );
}

/**
 * Layar penutup ketika peserta kembali setelah meninggalkan halaman ujian.
 *
 * Peramban tidak menyediakan cara apa pun untuk mencegah perpindahan tab atau
 * jendela — tidak ada API yang dapat menahan Alt+Tab maupun Ctrl+T. Yang dapat
 * dilakukan halaman adalah membuat perpindahan itu tidak berguna: begitu
 * peserta kembali, naskah soal tertutup sampai ia mengakui kejadiannya, dan
 * waktu ujian tetap berjalan di server selama layar ini tampil.
 */
export function BlokirKembali({ pengawas }: { pengawas: StatusPengawas }) {
  if (!pengawas.blokirKembali) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="judul-blokir-kembali"
      className="fixed inset-0 z-[65] grid place-items-center bg-navy-950/95 px-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-[var(--shadow-lift)]">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-rose-50 text-rose-600">
          <EyeOff className="size-6" />
        </span>

        <h2
          id="judul-blokir-kembali"
          className="mt-4 text-lg font-semibold text-navy-900"
        >
          Anda meninggalkan halaman ujian
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted">
          Naskah soal ditutup selama Anda berada di luar halaman ujian. Kejadian
          ini tercatat pada laporan pengawasan yang dibaca panitia, dan{" "}
          <b className="text-navy-800">waktu ujian tetap berjalan</b>.
        </p>

        <p className="mt-4 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-semibold text-rose-800">
          Tercatat {pengawas.jumlahTinggalkan}× meninggalkan halaman
        </p>

        <button
          type="button"
          autoFocus
          onClick={pengawas.bukaBlokir}
          className="mt-6 w-full rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
        >
          Saya mengerti, lanjutkan mengerjakan
        </button>
      </div>
    </div>
  );
}

export function PeringatanPengawas({ pengawas }: { pengawas: StatusPengawas }) {
  if (!pengawas.peringatan) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-3 z-[55] flex justify-center px-4"
    >
      <div className="pointer-events-auto flex max-w-lg items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-[var(--shadow-lift)]">
        <ShieldAlert className="mt-0.5 size-4.5 shrink-0 text-amber-600" />
        <p className="leading-relaxed">{pengawas.peringatan}</p>
        <button
          type="button"
          onClick={pengawas.tutupPeringatan}
          aria-label="Tutup peringatan"
          className="-my-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-lg text-amber-700 transition hover:bg-amber-100"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

/** Penanda kecil pada bilah atas: transparan tentang apa yang diawasi. */
export function LencanaPengawas({ pengawas }: { pengawas: StatusPengawas }) {
  const bersih = pengawas.jumlahPelanggaran === 0;

  return (
    <span
      title={
        bersih
          ? "Pengawasan aktif: belum ada kejadian tercatat."
          : `Pengawasan aktif: ${pengawas.jumlahPelanggaran} kejadian tercatat.`
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold",
        bersih
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-800",
      )}
    >
      {bersih ? (
        <ShieldCheck className="size-3.5" />
      ) : (
        <ShieldAlert className="size-3.5" />
      )}
      <span className="hidden sm:inline">Diawasi</span>
      {bersih ? null : <span>· {pengawas.jumlahPelanggaran}</span>}
    </span>
  );
}
