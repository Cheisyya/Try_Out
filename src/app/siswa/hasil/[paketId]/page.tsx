import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { KartuMataUji } from "@/components/siswa/daftar-pembahasan";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { wajibFitur } from "@/lib/get-session";
import { pembahasanPaket } from "@/lib/pengerjaan/pembahasan";

export const metadata: Metadata = { title: "Pembahasan" };

type Props = { params: Promise<{ paketId: string }> };

/**
 * Pembahasan satu paket try out untuk peserta yang bersangkutan.
 *
 * Identitas peserta selalu diambil dari sesi login, bukan dari URL, sehingga
 * peserta tidak dapat membuka pembahasan milik orang lain. Yang ditampilkan
 * hanya mata uji yang sudah ia kumpulkan sendiri.
 */
export default async function PembahasanPaketPage({ params }: Props) {
  const sesi = await wajibFitur("tryoutAkademikAktif");
  const { paketId } = await params;

  const data = await pembahasanPaket(sesi.identitas, paketId);
  if (!data) notFound();

  const totalSoal = data.mataUji.reduce(
    (total, mata) => total + mata.butir.length,
    0,
  );

  return (
    <>
      <PageHeader
        judul={`Pembahasan ${data.paketNama}`}
        deskripsi={`${data.mataUji.length} mata uji · ${totalSoal} soal beserta kunci dan penjelasannya.`}
        aksi={
          <Link
            href="/siswa/hasil"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-4" />
            Riwayat Hasil
          </Link>
        }
      />

      {data.mataUji.length === 0 ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada mata uji yang dikumpulkan"
              deskripsi="Selesaikan minimal satu mata uji pada paket ini agar pembahasannya terbuka."
            />
          </CardBody>
        </Card>
      ) : (
        data.mataUji.map((mata) => (
          <KartuMataUji key={`${mata.sesiId}-${mata.subject}`} mata={mata} />
        ))
      )}
    </>
  );
}
