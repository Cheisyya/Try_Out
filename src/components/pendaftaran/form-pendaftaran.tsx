"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Lock,
  Pencil,
  Save,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { HasilAksiPendaftaran } from "@/lib/actions-pendaftaran";

/**
 * Kerangka bersama seluruh formulir Data Diri Siswa.
 *
 * Alurnya sama pada setiap submenu: isi → Simpan → seluruh kolom terkunci →
 * Edit → Simpan lagi. Penguncian memakai `<fieldset disabled>` sehingga setiap
 * kolom di dalamnya — termasuk yang ditambahkan kemudian — ikut nonaktif tanpa
 * perlu disebut satu per satu, dan tidak dapat diubah tanpa menekan Edit.
 *
 * Mode awal ditentukan `tersimpan`, yang diisi halaman dari hasil validasi
 * bagian tersebut: data hanya lolos validasi bila memang pernah tersimpan.
 */
export function FormPendaftaran({
  aksi,
  pesanSukses,
  labelSimpan = "Simpan",
  tersimpan,
  children,
  catatanBawah,
}: {
  aksi: (formData: FormData) => Promise<HasilAksiPendaftaran>;
  pesanSukses: string;
  labelSimpan?: string;
  /** true bila data bagian ini sudah pernah disimpan siswa. */
  tersimpan: boolean;
  children: ReactNode;
  catatanBawah?: ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [masalah, setMasalah] = useState<string[]>([]);
  const [menyunting, setMenyunting] = useState(!tersimpan);

  const terkunci = !menyunting;

  /**
   * Pengiriman ditangani lewat `onSubmit`, bukan lewat prop `action`.
   *
   * React mengosongkan seluruh isian sebuah form begitu fungsi `action`-nya
   * selesai. Pada formulir sepanjang ini, satu pesan validasi dari server akan
   * membuat siswa kehilangan semua yang sudah diketiknya — karena itu
   * pengiriman dilakukan manual dan isian dibiarkan apa adanya.
   */
  const kirim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setMasalah([]);
    mulaiTransisi(async () => {
      const hasil = await aksi(formData);

      if (!hasil.ok) {
        setMasalah(hasil.masalah);
        toast.galat("Isian belum lengkap. Periksa kembali bagian yang ditandai.");
        return;
      }

      toast.sukses(pesanSukses);
      setMenyunting(false);
      router.refresh();
    });
  };

  const batal = () => {
    setMasalah([]);
    setMenyunting(false);
    // Isian dikembalikan ke nilai tersimpan dengan memuat ulang data server.
    router.refresh();
  };

  return (
    // `noValidate`: sebagian formulir menyembunyikan kolom pada tab yang tidak
    // aktif, dan peramban menolak memvalidasi kolom wajib yang tidak terlihat
    // tanpa memberi pesan apa pun. Validasi server-lah yang menjadi penjaga,
    // dan pesannya ditampilkan pada daftar di bawah formulir.
    <form onSubmit={kirim} noValidate className="space-y-6">
      {tersimpan ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3">
          <p className="flex items-center gap-2 text-sm text-navy-800">
            {terkunci ? (
              <>
                <Lock className="size-4 shrink-0 text-slate-400" />
                Data sudah tersimpan dan dikunci. Tekan{" "}
                <b className="font-semibold">Edit</b> untuk mengubahnya.
              </>
            ) : (
              <>
                <Pencil className="size-4 shrink-0 text-langit-600" />
                Mode edit aktif. Jangan lupa menyimpan perubahan Anda.
              </>
            )}
          </p>
          {terkunci ? (
            <Badge tone="hijau">
              <CheckCircle2 className="size-3.5" />
              Tersimpan
            </Badge>
          ) : (
            <Badge tone="gold">Sedang diedit</Badge>
          )}
        </div>
      ) : null}

      {/* Satu fieldset mengunci seluruh kolom di dalamnya sekaligus. */}
      <fieldset disabled={terkunci} className="space-y-6 disabled:opacity-95">
        {children}
      </fieldset>

      {masalah.length > 0 ? (
        <ul
          role="alert"
          className="space-y-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {masalah.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">{catatanBawah}</p>

        {terkunci ? (
          <Button
            type="button"
            onClick={() => setMenyunting(true)}
            className="w-full sm:w-auto"
          >
            <Pencil className="size-4" />
            Edit
          </Button>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <Button type="submit" disabled={proses} className="w-full sm:w-auto">
              {proses ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {labelSimpan}
            </Button>
            {tersimpan ? (
              <Button
                type="button"
                variant="outline"
                onClick={batal}
                disabled={proses}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </form>
  );
}

/** Pemberitahuan yang tampil di seluruh halaman Data Diri Siswa. */
