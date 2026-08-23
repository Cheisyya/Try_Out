import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck } from "lucide-react";

import { SeksiHasil } from "@/components/admin/tryout/seksi-hasil";
import { SeksiImport } from "@/components/admin/tryout/seksi-import";
import { SeksiPaket } from "@/components/admin/tryout/seksi-paket";
import {
  TAB_TRYOUT,
  TabTryOut,
  tabAktif,
} from "@/components/admin/tryout/tab-tryout";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { wajibSesi } from "@/lib/get-session";

export const metadata: Metadata = { title: "Try Out Akademik" };

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

/**
 * Satu halaman untuk seluruh pengelolaan try out.
 *
 * Paket, sesi beserta passwordnya, import soal, dan hasil try out berada pada tab
 * halaman ini, bukan menu sidebar terpisah. Bank soal tetap punya halamannya
 * sendiri karena memiliki alur buat/sunting per soal, dan dapat dibuka lewat
 * tombol pada kepala halaman.
 */
export default async function AdminTryOutPage({ searchParams }: Props) {
  await wajibSesi("admin");

  const params = await searchParams;
  const aktif = tabAktif(params.tab);
  const tab = TAB_TRYOUT.find((item) => item.kunci === aktif)!;

  return (
    <>
      <PageHeader
        judul="Try Out Akademik"
        deskripsi={tab.deskripsi}
        aksi={
          <Link
            href="/admin/bank-soal"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <BookOpenCheck className="size-4" />
            Bank Soal
          </Link>
        }
      />

      <TabTryOut aktif={aktif} />

      {/* Satu tab memuat paket sekaligus sesi dan password tiap paket. */}
      {aktif === "paket" ? <SeksiPaket /> : null}
      {aktif === "import" ? <SeksiImport /> : null}
      {aktif === "hasil" ? <SeksiHasil /> : null}
    </>
  );
}
