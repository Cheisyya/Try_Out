import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PembacaMateri } from "@/components/materi/pembaca-materi";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { wajibFitur } from "@/lib/get-session";
import { cariMateri } from "@/lib/materi/repositori";
import { labelUkuranMateri } from "@/lib/materi/tipe";
import { formatTanggal } from "@/lib/utils";

export const metadata: Metadata = { title: "Baca Materi" };

type Props = { params: Promise<{ id: string }> };

export default async function BacaMateriPage({ params }: Props) {
  await wajibFitur("materiAktif");

  const { id } = await params;
  const materi = await cariMateri(id);
  // Materi yang disembunyikan admin diperlakukan seolah tidak ada.
  if (!materi || !materi.aktif) notFound();

  return (
    <>
      <PageHeader
        judul={materi.judul}
        deskripsi={materi.deskripsi || undefined}
        aksi={
          <Link
            href="/siswa/materi"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-4" />
            Semua Materi
          </Link>
        }
      />

      <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <Badge tone="netral">{materi.mataPelajaran}</Badge>
        {labelUkuranMateri(materi.ukuran)} · diunggah{" "}
        {formatTanggal(new Date(materi.diunggahPada).toISOString())}
      </p>

      <PembacaMateri
        judul={materi.judul}
        sumber={`/siswa/materi/${materi.id}/lihat`}
      />
    </>
  );
}
