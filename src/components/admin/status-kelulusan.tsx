"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { ubahStatusKelulusanAksi } from "@/lib/actions-siswa";
import {
  isAlumni,
  NADA_KELULUSAN,
  STATUS_KELULUSAN,
  type StatusKelulusan,
} from "@/lib/siswa/status";
import { cn } from "@/lib/utils";

export function LencanaKelulusan({ status }: { status: StatusKelulusan }) {
  return <Badge tone={NADA_KELULUSAN[status]}>{status}</Badge>;
}

/**
 * Pengubah status kelulusan langsung dari baris tabel maupun halaman detail.
 *
 * Perubahan dikirim begitu pilihan berganti sehingga admin dapat menandai
 * banyak siswa berturut-turut tanpa membuka formulir. Karena daftar Siswa dan
 * daftar Alumni dipisahkan berdasarkan status ini, siswa yang baru ditetapkan
 * hasilnya langsung diantar ke halaman tempat ia kini berada — kalau tidak, ia
 * hanya lenyap dari layar tanpa penjelasan.
 */
export function PilihStatusKelulusan({
  id,
  nama,
  status,
  className,
}: {
  id: string;
  nama: string;
  status: StatusKelulusan;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();

  const ubah = (nilai: string) => {
    mulaiTransisi(async () => {
      const hasil = await ubahStatusKelulusanAksi(id, nilai);
      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Status kelulusan gagal disimpan.");
        router.refresh();
        return;
      }

      const tujuan = isAlumni(nilai as StatusKelulusan)
        ? "/admin/alumni"
        : "/admin/siswa";

      // Halaman detail siswa memuat kedua status sekaligus, jadi ia cukup
      // disegarkan di tempat.
      const diDaftar =
        pathname === "/admin/siswa" || pathname === "/admin/alumni";

      toast.sukses(
        diDaftar && pathname !== tujuan
          ? `${nama} dipindahkan ke ${tujuan === "/admin/alumni" ? "Alumni" : "daftar Siswa"}.`
          : `Status ${nama} diubah menjadi "${nilai}".`,
      );

      if (diDaftar && pathname !== tujuan) router.push(tujuan);
      else router.refresh();
    });
  };

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <label className="sr-only" htmlFor={`kelulusan-${id}`}>
        Status kelulusan {nama}
      </label>
      <select
        id={`kelulusan-${id}`}
        value={status}
        disabled={proses}
        onChange={(event) => ubah(event.currentTarget.value)}
        className="h-10 rounded-lg border border-navy-100 bg-white px-2.5 text-sm text-navy-900 outline-none transition focus:border-navy-400 focus:ring-4 focus:ring-navy-100 disabled:opacity-60 sm:h-9"
      >
        {STATUS_KELULUSAN.map((pilihan) => (
          <option key={pilihan} value={pilihan}>
            {pilihan}
          </option>
        ))}
      </select>
      {proses ? (
        <LoaderCircle className="size-4 animate-spin text-navy-600" />
      ) : null}
    </span>
  );
}
