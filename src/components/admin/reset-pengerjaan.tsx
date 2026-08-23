"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Brain, ClipboardCheck, Layers, LoaderCircle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  resetPsikotesAksi,
  resetTesIqAksi,
  resetTryOutAksi,
} from "@/lib/actions-reset";

/**
 * Pengosongan pengerjaan satu peserta, khusus panel admin.
 *
 * Hanya dirender pada halaman detail siswa di area `/admin`, dan setiap
 * aksinya memverifikasi ulang peran admin di server — tombol ini tidak pernah
 * sampai ke portal peserta.
 *
 * Setiap tindakan meminta konfirmasi lebih dahulu karena tidak dapat
 * dibatalkan: yang dihapus adalah jawaban dan nilai yang sudah tersimpan.
 */

type Jenis = "tryout" | "psikotes" | "tesiq";

export function ResetPengerjaan({
  siswaId,
  siswaNama,
  jumlahPercobaan,
  jumlahSesiPsikotes,
  jumlahPaketIq,
}: {
  siswaId: string;
  siswaNama: string;
  /** Banyak percobaan try out akademik yang tersimpan. */
  jumlahPercobaan: number;
  /** Banyak sesi psikotes yang tersimpan, baik berjalan maupun selesai. */
  jumlahSesiPsikotes: number;
  /** Banyak paket Tes IQ yang punya catatan pengerjaan. */
  jumlahPaketIq: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [konfirmasi, setKonfirmasi] = useState<Jenis | null>(null);

  const jalankan = (jenis: Jenis) => {
    mulaiTransisi(async () => {
      const hasil =
        jenis === "tryout"
          ? await resetTryOutAksi(siswaId)
          : jenis === "psikotes"
            ? await resetPsikotesAksi(siswaId)
            : await resetTesIqAksi(siswaId);

      if (!hasil.ok) {
        toast.galat(hasil.masalah);
        return;
      }
      toast.sukses(hasil.pesan);
      setKonfirmasi(null);
      router.refresh();
    });
  };

  const rincian: Record<Jenis, { judul: string; jumlah: number; catatan: string }> = {
    tryout: {
      judul: "riwayat Try Out akademik",
      jumlah: jumlahPercobaan,
      catatan:
        "Seluruh jawaban, nilai, dan catatan pengawasan pada paket try out akan hilang, dan peserta dapat mengerjakan sesi-sesinya kembali dari awal.",
    },
    psikotes: {
      judul: "pengerjaan Try Out Psikotes",
      jumlah: jumlahSesiPsikotes,
      catatan:
        "Seluruh jawaban, hasil koreksi, dan profil EPPS akan hilang, dan peserta dapat mengerjakan keempat sesinya kembali dari awal.",
    },
    tesiq: {
      judul: "pengerjaan Tes IQ",
      jumlah: jumlahPaketIq,
      catatan:
        "Jawaban, hasil koreksi, dan cacah berapa kali paket dikerjakan akan hilang. Peserta memang bebas mengulang latihan ini sendiri; reset di sini dipakai bila catatannya perlu benar-benar bersih.",
    },
  };

  const aktif = konfirmasi ? rincian[konfirmasi] : null;

  return (
    <>
      <div className="space-y-4">
        <Baris
          ikon={Layers}
          judul="Try Out Akademik"
          keterangan={
            jumlahPercobaan === 0
              ? "Belum ada riwayat pengerjaan."
              : `${jumlahPercobaan} percobaan tersimpan.`
          }
          aksi={
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={proses || jumlahPercobaan === 0}
              onClick={() => setKonfirmasi("tryout")}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          }
        />

        <Baris
          ikon={ClipboardCheck}
          judul="Try Out Psikotes"
          keterangan={
            jumlahSesiPsikotes === 0
              ? "Belum ada sesi yang dikerjakan."
              : `${jumlahSesiPsikotes} sesi tersimpan.`
          }
          aksi={
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={proses || jumlahSesiPsikotes === 0}
              onClick={() => setKonfirmasi("psikotes")}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          }
        />

        <Baris
          ikon={Brain}
          judul="Tes IQ (Latihan)"
          keterangan={
            jumlahPaketIq === 0
              ? "Belum ada paket yang dikerjakan."
              : `${jumlahPaketIq} paket tersimpan. Peserta juga dapat mengulangnya sendiri.`
          }
          aksi={
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={proses || jumlahPaketIq === 0}
              onClick={() => setKonfirmasi("tesiq")}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          }
        />
      </div>

      <Modal
        terbuka={konfirmasi !== null}
        judul="Kosongkan pengerjaan?"
        deskripsi={aktif ? `${aktif.judul} milik ${siswaNama}.` : undefined}
        onTutup={() => setKonfirmasi(null)}
      >
        <p className="text-sm leading-relaxed text-muted">
          <b className="text-navy-800">{aktif?.jumlah ?? 0} catatan</b> akan
          dihapus dan tidak dapat dikembalikan. {aktif?.catatan}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Akun, data diri, dan berkas unggahan peserta tidak tersentuh.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            type="button"
            className="w-full bg-rose-600 hover:bg-rose-700 sm:w-auto"
            disabled={proses}
            onClick={() => konfirmasi && jalankan(konfirmasi)}
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Ya, kosongkan
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setKonfirmasi(null)}
            disabled={proses}
          >
            Batal
          </Button>
        </div>
      </Modal>
    </>
  );
}

function Baris({
  ikon: Ikon,
  judul,
  keterangan,
  aksi,
}: {
  ikon: typeof Layers;
  judul: string;
  keterangan: string;
  aksi: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
          <Ikon className="size-4.5" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy-900">{judul}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-muted">
            {keterangan}
          </p>
        </div>
      </div>
      <div className="shrink-0 sm:self-center">{aksi}</div>
    </div>
  );
}
