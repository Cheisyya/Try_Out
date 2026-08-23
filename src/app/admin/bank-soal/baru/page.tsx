import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FormSoal } from "@/components/bank-soal/form-soal";
import { PageHeader } from "@/components/ui/page-header";
import { wajibSesi } from "@/lib/get-session";
import { isSubject } from "@/lib/bank-soal/skema";
import { daftarSemuaPaket } from "@/lib/paket-tryout";

export const metadata: Metadata = { title: "Tambah Soal" };

type Props = {
  searchParams: Promise<{ paket?: string; subject?: string }>;
};

export default async function TambahSoalPage({ searchParams }: Props) {
  await wajibSesi("admin");
  const { paket, subject } = await searchParams;

  const tautanKembali =
    paket && isSubject(subject)
      ? `/admin/bank-soal/daftar?paket=${paket}&subject=${encodeURIComponent(subject)}`
      : "/admin/bank-soal";

  return (
    <>
      <Link
        href={tautanKembali}
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 transition hover:text-navy-900"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </Link>

      <PageHeader
        judul="Tambah Soal"
        deskripsi="Seluruh butir wajib berbentuk pilihan ganda A-D dan berada dalam cakupan materi seleksi."
      />

      <FormSoal
        paketPilihan={(await daftarSemuaPaket()).map((item) => ({
          id: item.id,
          nama: item.nama,
        }))}
        paketAwal={paket}
        subjectAwal={isSubject(subject) ? subject : undefined}
      />
    </>
  );
}
