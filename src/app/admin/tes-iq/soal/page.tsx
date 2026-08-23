import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import {
  KelolaSoalLatihan,
  type ButirLatihan,
} from "@/components/admin/latihan/kelola-soal-latihan";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { wajibSesi } from "@/lib/get-session";
import { semuaPaketIq } from "@/lib/tes-iq/repositori";
import { KATEGORI_IQ } from "@/lib/tes-iq/tipe";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Bank Soal Tes IQ" };

type Props = { searchParams: Promise<{ paket?: string }> };

/**
 * Bank soal Tes IQ yang dapat disunting.
 *
 * Sama seperti bank Psikotes: paket yang belum pernah disentuh admin memakai
 * bank bawaan yang terbundel di dalam kode, dan perubahan pertama menyalinnya
 * ke penyimpanan sebelum disunting.
 */
export default async function BankSoalTesIqPage({ searchParams }: Props) {
  await wajibSesi("admin");

  const [params, daftarPaket] = await Promise.all([searchParams, semuaPaketIq()]);
  const paket = daftarPaket.find((item) => item.id === params.paket) ?? daftarPaket[0];

  if (!paket) {
    return (
      <>
        <PageHeader
          judul="Bank Soal Tes IQ"
          deskripsi="Naskah soal beserta kunci dan pembahasannya."
        />
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada paket Tes IQ"
              ikon={FileText}
              deskripsi="Buat paket lebih dahulu pada halaman Tes IQ, tab Paket."
            />
          </CardBody>
        </Card>
      </>
    );
  }

  const butir: ButirLatihan[] = paket.soal.map((soal) => ({
    nomor: soal.nomor,
    kategori: soal.kategori,
    pertanyaan: soal.pertanyaan,
    pola: soal.pola,
    opsi: soal.opsi,
    kunci: soal.kunci,
    pembahasan: soal.pembahasan,
    aktif: soal.aktif !== false,
  }));

  return (
    <>
      <PageHeader
        judul="Bank Soal Tes IQ"
        deskripsi="Naskah soal beserta kunci dan pembahasannya. Butir yang dipadamkan tetap tersimpan tetapi tidak diujikan."
        aksi={
          <Link
            href="/admin/tes-iq"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-4" />
            Kelola Tes IQ
          </Link>
        }
      />

      <div className="w-full min-w-0 overflow-x-auto">
        <nav aria-label="Pilih paket" className="flex w-max min-w-full gap-2">
          {daftarPaket.map((item) => (
            <Link
              key={item.id}
              href={`/admin/tes-iq/soal?paket=${item.id}`}
              aria-current={item.id === paket.id ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                item.id === paket.id
                  ? "border-navy-800 bg-navy-900 text-white"
                  : "border-line bg-white text-navy-700 hover:bg-navy-50",
              )}
            >
              {item.nama}
              <Badge tone="netral">{item.soal.length}</Badge>
            </Link>
          ))}
        </nav>
      </div>

      <KelolaSoalLatihan
        jenis="tesiq"
        paketId={paket.id}
        judul={paket.nama}
        deskripsi={`${paket.durasiMenit} menit · tingkat ${paket.tingkat.toLowerCase()}`}
        kategori={KATEGORI_IQ}
        daftar={butir}
      />
    </>
  );
}
