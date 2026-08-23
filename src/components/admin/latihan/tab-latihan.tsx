import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Layers, Trophy, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Tab halaman pengelolaan latihan — psikotes dan Tes IQ.
 *
 * Bentuknya sama persis dengan tab halaman Try Out Akademik, dan itu memang
 * disengaja: ketiga panel mengerjakan pekerjaan yang sama (menyiapkan paket,
 * memasukkan soal, membaca hasil), sehingga admin tidak perlu mempelajari tiga
 * tata letak yang berbeda.
 *
 * Tab dipilih lewat query `?tab=` alih-alih state klien, sehingga tiap seksi
 * tetap berupa Server Component yang hanya mengambil datanya sendiri.
 */

export const TAB_LATIHAN = [
  {
    kunci: "paket",
    label: "Paket & Sesi",
    icon: Layers,
  },
  {
    kunci: "import",
    label: "Import Soal",
    icon: Upload,
  },
  {
    kunci: "hasil",
    label: "Hasil",
    icon: Trophy,
  },
] as const satisfies readonly {
  kunci: string;
  label: string;
  icon: LucideIcon;
}[];

export type KunciTabLatihan = (typeof TAB_LATIHAN)[number]["kunci"];

export function tabLatihanAktif(nilai: string | undefined): KunciTabLatihan {
  return TAB_LATIHAN.some((tab) => tab.kunci === nilai)
    ? (nilai as KunciTabLatihan)
    : "paket";
}

export function TabLatihan({
  dasar,
  aktif,
  labelPaket = "Paket & Sesi",
  labelHasil,
}: {
  /** Alamat halaman tanpa query, misalnya `/admin/psikotes`. */
  dasar: string;
  aktif: KunciTabLatihan;
  /** Label tab paket. Tes IQ tidak mengenal sesi, jadi labelnya lebih pendek. */
  labelPaket?: string;
  /** Label tab hasil; berbeda antara psikotes dan Tes IQ. */
  labelHasil: string;
}) {
  return (
    <div
      // Tab dibungkus scroll horizontal supaya tetap terjangkau di layar kecil.
      className="w-full min-w-0 overflow-x-auto border-b border-line"
    >
      <nav
        aria-label="Bagian pengelolaan"
        className="flex w-max min-w-full gap-1 px-1"
      >
        {TAB_LATIHAN.map((tab) => {
          const dipilih = tab.kunci === aktif;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.kunci}
              href={`${dasar}?tab=${tab.kunci}`}
              aria-current={dipilih ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition",
                dipilih
                  ? "border-navy-900 font-semibold text-navy-900"
                  : "border-transparent font-medium text-slate-500 hover:border-navy-200 hover:text-navy-900",
              )}
            >
              <Icon
                className={cn(
                  "size-4.5 shrink-0",
                  dipilih ? "text-langit-600" : "text-slate-400",
                )}
                strokeWidth={2}
              />
              {tab.kunci === "hasil"
                ? labelHasil
                : tab.kunci === "paket"
                  ? labelPaket
                  : tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
