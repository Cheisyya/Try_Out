import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Layers, Trophy, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Tab halaman Try Out.
 *
 * Tab dipilih lewat query `?tab=` alih-alih state klien, sehingga tiap seksi
 * tetap berupa Server Component yang hanya mengambil datanya sendiri, dan
 * filter maupun paginasi di dalamnya dapat ditautkan langsung.
 */

export const TAB_TRYOUT = [
  {
    // Paket dan sesinya kini satu halaman: sesi selalu milik sebuah paket, dan
    // memisahkannya memaksa admin bolak-balik antar tab untuk satu pekerjaan.
    kunci: "paket",
    label: "Paket & Sesi",
    deskripsi:
      "Jadwal paket, mata uji tiap sesi, jumlah soal, durasi, dan password pembukanya.",
    icon: Layers,
  },
  {
    kunci: "import",
    label: "Import Soal",
    deskripsi: "Impor massal soal dari berkas Excel atau PDF.",
    icon: Upload,
  },
  {
    kunci: "hasil",
    label: "Hasil Try Out",
    deskripsi: "Nilai, jumlah benar/salah, dan status pengerjaan siswa.",
    icon: Trophy,
  },
] as const satisfies readonly {
  kunci: string;
  label: string;
  deskripsi: string;
  icon: LucideIcon;
}[];

export type KunciTab = (typeof TAB_TRYOUT)[number]["kunci"];

export function isKunciTab(nilai: string | undefined): nilai is KunciTab {
  return TAB_TRYOUT.some((tab) => tab.kunci === nilai);
}

export function tabAktif(nilai: string | undefined): KunciTab {
  // `?tab=sesi` adalah alamat lama sebelum paket dan sesi disatukan; ia tetap
  // dilayani agar tautan yang sudah tersebar tidak mendadak jatuh ke tab lain.
  if (nilai === "sesi" || nilai === "password") return "paket";
  return isKunciTab(nilai) ? nilai : "paket";
}

export function TabTryOut({ aktif }: { aktif: KunciTab }) {
  return (
    <div
      // Tab dibungkus scroll horizontal supaya tetap terjangkau di layar kecil.
      className="w-full min-w-0 overflow-x-auto border-b border-line"
    >
      <nav
        aria-label="Bagian pengelolaan try out"
        className="flex w-max min-w-full gap-1 px-1"
      >
        {TAB_TRYOUT.map((tab) => {
          const dipilih = tab.kunci === aktif;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.kunci}
              href={`/admin/tryout?tab=${tab.kunci}`}
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
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
