import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  KelolaPasanganEpps,
  type PasanganTinjauAdmin,
} from "@/components/admin/latihan/kelola-pasangan-epps";
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
import { semuaPaketPsikotes } from "@/lib/psikotes/repositori";
import { DIMENSI_EPPS, jumlahButir } from "@/lib/psikotes/tipe";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

export const metadata: Metadata = { title: "Bank Soal Psikotes" };

type Props = { searchParams: Promise<{ paket?: string; sesi?: string }> };

/**
 * Bank soal Psikotes yang dapat disunting.
 *
 * Sebelumnya halaman ini hanya-baca karena soalnya terbundel di dalam kode.
 * Sejak bank dipindahkan ke penyimpanan (lihat `@/lib/psikotes/repositori`),
 * admin dapat menambah, menyunting, memadamkan, dan menghapus butir dari sini —
 * sementara paket yang belum pernah disentuh tetap memakai bank bawaan.
 *
 * Pemilih paket dan sesi memakai tautan `?paket=&sesi=` sehingga halaman ini
 * tetap Server Component dan pilihannya dapat ditandai-buku.
 */
export default async function BankSoalPsikotesPage({ searchParams }: Props) {
  await wajibSesi("admin");

  const [params, daftarPaket] = await Promise.all([
    searchParams,
    semuaPaketPsikotes(),
  ]);

  const paket =
    daftarPaket.find((item) => item.id === params.paket) ?? daftarPaket[0];

  if (!paket) {
    return (
      <>
        <PageHeader
          judul="Bank Soal Psikotes"
          deskripsi="Naskah soal beserta kunci dan pembahasannya."
        />
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada paket psikotes"
              ikon={FileText}
              deskripsi="Buat paket lebih dahulu pada halaman Psikotes, tab Paket & Sesi."
            />
          </CardBody>
        </Card>
      </>
    );
  }

  const sesi = paket.sesi.find((item) => item.id === params.sesi) ?? paket.sesi[0];

  const butir: ButirLatihan[] =
    sesi?.jenis === "skor"
      ? sesi.soal.map((soal) => ({
          nomor: soal.nomor,
          kategori: soal.kategori,
          pertanyaan: soal.pertanyaan,
          stimulus: soal.stimulus,
          opsi: soal.opsi,
          opsiFigur: soal.opsiFigur,
          kunci: soal.kunci,
          pembahasan: soal.pembahasan,
          aktif: soal.aktif !== false,
        }))
      : [];

  const pasangan: PasanganTinjauAdmin[] =
    sesi?.jenis === "epps"
      ? sesi.pasangan.map((item) => ({
          nomor: item.nomor,
          teksA: item.a.teks,
          dimensiA: item.a.dimensi,
          teksB: item.b.teks,
          dimensiB: item.b.dimensi,
          aktif: item.aktif !== false,
        }))
      : [];

  return (
    <>
      <PageHeader
        judul="Bank Soal Psikotes"
        deskripsi="Naskah soal beserta kunci dan pembahasannya. Butir yang dipadamkan tetap tersimpan tetapi tidak diujikan."
        aksi={
          <Link
            href="/admin/psikotes"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-4" />
            Kelola Psikotes
          </Link>
        }
      />

      {/* Pemilih paket */}
      <div className="w-full min-w-0 overflow-x-auto">
        <nav aria-label="Pilih paket" className="flex w-max min-w-full gap-2">
          {daftarPaket.map((item) => (
            <Link
              key={item.id}
              href={`/admin/psikotes/soal?paket=${item.id}`}
              aria-current={item.id === paket.id ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                item.id === paket.id
                  ? "border-navy-800 bg-navy-900 text-white"
                  : "border-line bg-white text-navy-700 hover:bg-navy-50",
              )}
            >
              {item.nama}
            </Link>
          ))}
        </nav>
      </div>

      {/* Pemilih sesi */}
      <div className="w-full min-w-0 overflow-x-auto">
        <nav aria-label="Pilih sesi" className="flex w-max min-w-full gap-2">
          {paket.sesi.map((item) => (
            <Link
              key={item.id}
              href={`/admin/psikotes/soal?paket=${paket.id}&sesi=${item.id}`}
              aria-current={item.id === sesi?.id ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition",
                item.id === sesi?.id
                  ? "border-langit-500 bg-langit-50 text-navy-900"
                  : "border-line bg-white text-navy-700 hover:bg-navy-50",
              )}
            >
              {item.nama}
              <Badge tone="netral">{jumlahButir(item)}</Badge>
            </Link>
          ))}
        </nav>
      </div>

      {!sesi ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Paket ini belum punya sesi"
              ikon={FileText}
              deskripsi="Sesi dibuat bersama paketnya. Buat paket baru bila susunannya perlu diulang."
            />
          </CardBody>
        </Card>
      ) : sesi.jenis === "epps" ? (
        <KelolaPasanganEpps
          paketId={paket.id}
          sesiId={sesi.id}
          judul={`${sesi.nama} · ${paket.nama}`}
          dimensi={DIMENSI_EPPS}
          daftar={pasangan}
        />
      ) : (
        <KelolaSoalLatihan
          jenis="psikotes"
          paketId={paket.id}
          sesiId={sesi.id}
          judul={`${sesi.nama} · ${paket.nama}`}
          deskripsi={`${sesi.durasiMenit} menit`}
          kategori={[]}
          daftar={butir}
        />
      )}
    </>
  );
}
