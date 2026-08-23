import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { LatihanIq } from "@/components/tes-iq/latihan-iq";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { wajibFitur } from "@/lib/get-session";
import { soalLatihan } from "@/lib/tes-iq/bank";
import {
  nilaiIq,
  sinkronPaketKedaluwarsa,
  statusIq,
} from "@/lib/tes-iq/catatan";
import { cariPaketIq } from "@/lib/tes-iq/repositori";
import { paketDiujikan, soalDiujikan, type HurufIq } from "@/lib/tes-iq/tipe";

type Props = { params: Promise<{ paketId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paketId } = await params;
  const paket = await cariPaketIq(paketId);
  return { title: paket?.nama ?? "Tes IQ (Latihan)" };
}

/**
 * Ruang latihan satu paket Tes IQ.
 *
 * Halaman ini Server Component: ia memilih paket, menentukan sisa waktu menurut
 * jam server, membuang kunci jawaban dan pembahasan, lalu menyerahkan sisanya
 * ke komponen klien. Kunci baru dibuka oleh `tutupLatihanIqAksi` setelah paket
 * ditutup, sehingga naskah jawaban tidak dapat dibaca dari kode sumber halaman.
 */
export default async function TesIqPaketPage({ params }: Props) {
  const sesiLogin = await wajibFitur("tesIqAktif");

  const { paketId } = await params;
  const paket = await cariPaketIq(paketId);
  // Paket yang dimatikan admin, atau yang seluruh soalnya dinonaktifkan, tidak
  // dapat dibuka meskipun alamatnya diketik langsung.
  if (!paket || !paketDiujikan(paket)) notFound();

  const berkas = await sinkronPaketKedaluwarsa(sesiLogin.identitas, [paket]);
  const status = statusIq(berkas, paket);

  return (
    <>
      <PageHeader
        judul={paket.nama}
        deskripsi={`${soalDiujikan(paket).length} soal penalaran tingkat ${paket.tingkat.toLowerCase()} · ${paket.durasiMenit} menit · tanpa skor IQ.`}
        aksi={
          <ButtonLink href="/siswa/tes-iq" variant="outline" size="sm">
            <ArrowLeft className="size-4" />
            Daftar paket
          </ButtonLink>
        }
      />

      <LatihanIq
        paketId={paket.id}
        paketNama={paket.nama}
        tingkat={paket.tingkat}
        durasiMenit={paket.durasiMenit}
        sisaDetikAwal={status.sisaDetik}
        berjalan={status.keadaan === "berlangsung"}
        soal={soalLatihan(paket)}
        jawabanTersimpan={status.jawaban as Record<number, HurufIq>}
        // Hasil disusun ulang dari jawaban yang tersimpan supaya pembahasannya
        // ikut terkirim; ringkasan pada catatan hanya dipakai panel admin.
        hasilTersimpan={
          status.keadaan === "selesai" ? nilaiIq(paket, status.jawaban) : null
        }
      />
    </>
  );
}
