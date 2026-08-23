import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { wajibFitur } from "@/lib/get-session";
import { materiAktif } from "@/lib/materi/repositori";
import {
  isMataPelajaran,
  labelUkuranMateri,
  MATA_PELAJARAN,
  type MataPelajaran,
} from "@/lib/materi/tipe";
import { formatTanggal } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Materi Belajar" };

type Props = { searchParams: Promise<{ mapel?: string }> };

/**
 * Materi untuk peserta, dipisah per mata pelajaran.
 *
 * Pemilih mata pelajaran memakai tautan `?mapel=`, bukan state klien, sehingga
 * pilihannya dapat ditandai-buku dan halamannya tetap Server Component. Berkas
 * PDF-nya sendiri tidak pernah muncul sebagai alamat yang dapat disalin.
 */
export default async function MateriSiswaPage({ searchParams }: Props) {
  await wajibFitur("materiAktif");

  const params = await searchParams;
  const pilihan = params.mapel ?? "";
  const mapel: MataPelajaran | "semua" = isMataPelajaran(pilihan)
    ? pilihan
    : "semua";

  const daftar = await materiAktif();

  // Hitungan per mata pelajaran dipakai pada label pemilih.
  const jumlahPer = new Map<MataPelajaran, number>();
  for (const item of daftar) {
    jumlahPer.set(item.mataPelajaran, (jumlahPer.get(item.mataPelajaran) ?? 0) + 1);
  }

  const tersaring =
    mapel === "semua"
      ? daftar
      : daftar.filter((item) => item.mataPelajaran === mapel);

  // Dikelompokkan per mata pelajaran supaya tetap terpisah rapi meski sedang
  // menampilkan semuanya.
  const perMapel = MATA_PELAJARAN.map((nama) => ({
    nama,
    isi: tersaring.filter((item) => item.mataPelajaran === nama),
  })).filter((kelompok) => kelompok.isi.length > 0);

  return (
    <>
      <PageHeader
        judul="Materi Belajar"
        deskripsi="Bahan ajar dari pengajar Smart Home Center, dipisah per mata pelajaran."
      />

      {/* Pemilih mata pelajaran */}
      <div className="w-full min-w-0 overflow-x-auto">
        <nav
          aria-label="Pilih mata pelajaran"
          className="flex w-max min-w-full gap-2"
        >
          <PilihMapel href="/siswa/materi" aktif={mapel === "semua"}>
            Semua
            <Badge tone="netral">{daftar.length}</Badge>
          </PilihMapel>
          {MATA_PELAJARAN.map((nama) => (
            <PilihMapel
              key={nama}
              href={`/siswa/materi?mapel=${encodeURIComponent(nama)}`}
              aktif={mapel === nama}
            >
              {nama}
              <Badge tone="netral">{jumlahPer.get(nama) ?? 0}</Badge>
            </PilihMapel>
          ))}
        </nav>
      </div>

      {perMapel.length === 0 ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul={
                mapel === "semua"
                  ? "Belum ada materi"
                  : `Belum ada materi ${mapel}`
              }
              ikon={BookOpen}
              deskripsi="Materi akan muncul di sini begitu pengajar mengunggahnya."
            />
          </CardBody>
        </Card>
      ) : (
        perMapel.map((kelompok) => (
          <Card key={kelompok.nama}>
            <CardHeader
              judul={kelompok.nama}
              deskripsi={`${kelompok.isi.length} materi tersedia.`}
            />
            <CardBody className="p-0 sm:p-0">
              <ul className="divide-y divide-line">
                {kelompok.isi.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/siswa/materi/${item.id}`}
                      className="flex items-center gap-4 px-4 py-4 transition hover:bg-navy-50/40 sm:px-6"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-langit-50 text-langit-600">
                        <BookOpen className="size-5" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-navy-900">
                          {item.judul}
                        </span>
                        {item.deskripsi ? (
                          <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                            {item.deskripsi}
                          </span>
                        ) : null}
                        <span className="mt-1.5 block text-xs text-muted">
                          {labelUkuranMateri(item.ukuran)} · diunggah{" "}
                          {formatTanggal(
                            new Date(item.diunggahPada).toISOString(),
                          )}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-sm font-semibold text-langit-600 sm:block">
                        Baca materi
                      </span>
                      <ArrowRight className="size-4.5 shrink-0 text-slate-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))
      )}
    </>
  );
}

function PilihMapel({
  href,
  aktif,
  children,
}: {
  href: string;
  aktif: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={aktif ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
        aktif
          ? "border-navy-800 bg-navy-900 text-white"
          : "border-line bg-white text-navy-700 hover:bg-navy-50",
      )}
    >
      {children}
    </Link>
  );
}
