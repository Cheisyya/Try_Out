import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Plus } from "lucide-react";

import {
  PratinjauSoal,
  type ButirPratinjau,
} from "@/components/bank-soal/pratinjau-soal";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { wajibSesi } from "@/lib/get-session";
import { daftarSoal } from "@/lib/bank-soal/repositori";
import { HURUF_OPSI, isSubject, type Subject } from "@/lib/bank-soal/skema";
import { daftarSemuaPaket } from "@/lib/paket-tryout";

export const metadata: Metadata = { title: "Detail Soal" };

type Props = {
  searchParams: Promise<{
    paket?: string;
    subject?: string;
    dibuat?: string;
    diperbarui?: string;
  }>;
};

/**
 * Butir soal satu paket dan satu mata pelajaran, ditampilkan seperti ruang
 * ujian: satu soal per layar beserta pilihan A–D dan navigasi nomor.
 *
 * Halaman ini dibuka dari angka pada tabel Cakupan Pengisian di Bank Soal.
 * Bedanya dengan layar peserta: kunci jawaban dan pembahasan ikut tampil, dan
 * setiap soal membawa aksi sunting, aktif/nonaktif, serta hapus.
 */
export default async function DetailSoalPage({ searchParams }: Props) {
  await wajibSesi("admin");
  const params = await searchParams;

  const paketList = await daftarSemuaPaket();
  if (paketList.length === 0) notFound();

  const paketId = paketList.some((paket) => paket.id === params.paket)
    ? params.paket!
    : paketList[0].id;
  const subject: Subject = isSubject(params.subject)
    ? params.subject
    : "Bahasa Indonesia";

  const soalPaket = await daftarSoal({ paketId, subject });
  const paket = paketList.find((item) => item.id === paketId);

  const daftar: ButirPratinjau[] = [...soalPaket]
    .sort((a, b) => a.question_order - b.question_order)
    .map((butir) => ({
      id: butir.id,
      question_order: butir.question_order,
      question: butir.question,
      opsi: HURUF_OPSI.map((huruf) => ({
        huruf,
        teks: butir.options[huruf],
      })),
      correct_answer: butir.correct_answer,
      category: butir.category,
      difficulty: butir.difficulty,
      explanation: butir.explanation,
      active: butir.active,
      image: butir.image,
      table: butir.table,
    }));

  const tautanTambah = `/admin/bank-soal/baru?paket=${paketId}&subject=${encodeURIComponent(subject)}`;

  return (
    <>
      <Link
        href="/admin/bank-soal"
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 transition hover:text-navy-900"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Bank Soal
      </Link>

      <PageHeader
        judul={`${paket?.nama ?? paketId} · ${subject}`}
        deskripsi={`${daftar.length} butir soal, tampil seperti saat dikerjakan peserta.`}
        aksi={
          <ButtonLink href={tautanTambah}>
            <Plus className="size-4" />
            Tambah Soal
          </ButtonLink>
        }
      />

      {params.dibuat ? (
        <Notifikasi>Soal {params.dibuat} berhasil ditambahkan.</Notifikasi>
      ) : null}
      {params.diperbarui ? (
        <Notifikasi>Soal {params.diperbarui} berhasil diperbarui.</Notifikasi>
      ) : null}

      {daftar.length === 0 ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada soal"
              deskripsi={`${paket?.nama ?? paketId} belum memiliki butir ${subject}. Tambahkan satu per satu di sini, atau impor massal lewat menu Import Soal.`}
              aksi={
                <ButtonLink href={tautanTambah} size="sm">
                  <Plus className="size-4" />
                  Tambah Soal
                </ButtonLink>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <PratinjauSoal daftar={daftar} />
      )}
    </>
  );
}

function Notifikasi({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800"
    >
      <CheckCircle2 className="mt-0.5 size-4.5 shrink-0" />
      {children}
    </p>
  );
}
