import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FormSoal } from "@/components/bank-soal/form-soal";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { wajibSesi } from "@/lib/get-session";
import { ambilSoalById } from "@/lib/bank-soal/repositori";
import { daftarSemuaPaket } from "@/lib/paket-tryout";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Sunting Soal ${id}` };
}

export default async function SuntingSoalPage({ params }: Props) {
  await wajibSesi("admin");
  const { id } = await params;

  const soal = await ambilSoalById(id);
  if (!soal) notFound();

  const paket = (await daftarSemuaPaket()).find((item) => item.id === soal.package_id);

  return (
    <>
      <Link
        href={`/admin/bank-soal/daftar?paket=${soal.package_id}&subject=${encodeURIComponent(soal.subject)}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 transition hover:text-navy-900"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar soal
      </Link>

      <PageHeader
        judul="Sunting Soal"
        deskripsi={`${paket?.nama ?? soal.package_id} · ${soal.subject} · nomor ${soal.question_order}`}
        aksi={
          <Badge tone={soal.active ? "hijau" : "merah"}>
            {soal.active ? "Aktif" : "Nonaktif"}
          </Badge>
        }
      />

      <FormSoal
        paketPilihan={(await daftarSemuaPaket()).map((item) => ({
          id: item.id,
          nama: item.nama,
        }))}
        soal={soal}
      />
    </>
  );
}
