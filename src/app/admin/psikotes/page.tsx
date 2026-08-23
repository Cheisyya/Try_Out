import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, FileText } from "lucide-react";

import {
  ImportLatihan,
  type TujuanImpor,
} from "@/components/admin/latihan/import-latihan";
import {
  KelolaPaketPsikotes,
  type BarisPaketPsikotes,
} from "@/components/admin/latihan/kelola-paket-psikotes";
import {
  TabLatihan,
  tabLatihanAktif,
} from "@/components/admin/latihan/tab-latihan";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { Table, TableWrapper, Td, Th } from "@/components/ui/table";
import { wajibSesi } from "@/lib/get-session";
import { rekapPsikotes, type SelRekap } from "@/lib/psikotes/rekap-admin";
import { semuaPaketPsikotes } from "@/lib/psikotes/repositori";
import {
  jumlahButir,
  jumlahButirAktif,
  totalButirPaket,
  totalMenitPaket,
} from "@/lib/psikotes/tipe";
import { cn, formatTanggalWaktu } from "@/lib/utils";

export const metadata: Metadata = { title: "Psikotes" };

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ tab?: string; paket?: string }>;
};

/**
 * Satu halaman untuk seluruh pengelolaan psikotes.
 *
 * Susunannya mengikuti halaman Try Out Akademik: paket beserta sesinya, impor
 * soal, dan hasil peserta berada pada tab halaman ini, bukan menu sidebar
 * terpisah. Bank soal tetap punya halamannya sendiri karena memiliki alur
 * buat/sunting per butir, dan dapat dibuka lewat tombol pada kepala halaman.
 */
export default async function AdminPsikotesPage({ searchParams }: Props) {
  await wajibSesi("admin");

  const params = await searchParams;
  const aktif = tabLatihanAktif(params.tab);

  return (
    <>
      <PageHeader
        judul="Psikotes"
        deskripsi={
          aktif === "paket"
            ? "Paket, sesi beserta durasinya, dan sakelar tampil di portal siswa."
            : aktif === "import"
              ? "Impor massal soal dari berkas PDF atau Excel."
              : "Siapa yang sudah mengerjakan tiap sesi dan bagaimana hasilnya."
        }
        aksi={
          <Link
            href="/admin/psikotes/soal"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <FileText className="size-4" />
            Bank Soal
          </Link>
        }
      />

      <TabLatihan dasar="/admin/psikotes" aktif={aktif} labelHasil="Hasil Psikotes" />

      {aktif === "paket" ? <SeksiPaket /> : null}
      {aktif === "import" ? <SeksiImport /> : null}
      {aktif === "hasil" ? <SeksiHasil paketDipilih={params.paket} /> : null}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Tab Paket & Sesi                              */
/* -------------------------------------------------------------------------- */

async function SeksiPaket() {
  const daftarPaket = await semuaPaketPsikotes();

  const daftar: BarisPaketPsikotes[] = daftarPaket.map((paket) => ({
    id: paket.id,
    nomor: paket.nomor,
    nama: paket.nama,
    deskripsi: paket.deskripsi,
    aktif: paket.aktif !== false,
    totalButir: paket.sesi.reduce((total, sesi) => total + jumlahButir(sesi), 0),
    totalAktif: totalButirPaket(paket),
    totalMenit: totalMenitPaket(paket),
    sesi: paket.sesi.map((sesi) => ({
      id: sesi.id,
      jenis: sesi.jenis,
      nama: sesi.nama,
      ringkas: sesi.ringkas,
      petunjuk: sesi.petunjuk,
      durasiMenit: sesi.durasiMenit,
      aktif: sesi.aktif !== false,
      jumlahButir: jumlahButir(sesi),
      jumlahAktif: jumlahButirAktif(sesi),
    })),
  }));

  return <KelolaPaketPsikotes daftar={daftar} />;
}

/* -------------------------------------------------------------------------- */
/*                               Tab Import                                   */
/* -------------------------------------------------------------------------- */

async function SeksiImport() {
  const daftarPaket = await semuaPaketPsikotes();

  // Hanya sesi berkunci yang dapat diisi lewat impor: sesi EPPS tidak punya
  // kunci jawaban, sehingga berkas soal pilihan ganda tidak berlaku baginya.
  const tujuan: TujuanImpor[] = daftarPaket.flatMap((paket) =>
    paket.sesi
      .filter((sesi) => sesi.jenis === "skor")
      .map((sesi) => ({
        paketId: paket.id,
        paketNama: paket.nama,
        sesiId: sesi.id,
        sesiNama: sesi.nama,
      })),
  );

  return <ImportLatihan jenis="psikotes" tujuan={tujuan} kategori={[]} />;
}

/* -------------------------------------------------------------------------- */
/*                                Tab Hasil                                   */
/* -------------------------------------------------------------------------- */

async function SeksiHasil({ paketDipilih }: { paketDipilih?: string }) {
  const rekap = await rekapPsikotes();
  const terpilih = rekap.find((item) => item.paket.id === paketDipilih) ?? rekap[0];

  if (!terpilih) {
    return (
      <Card>
        <CardBody className="p-0 sm:p-0">
          <KeadaanKosong
            judul="Belum ada paket psikotes"
            ikon={ClipboardCheck}
            deskripsi="Buat paket lebih dahulu pada tab Paket & Sesi."
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      {/* Pemilih paket memakai tautan `?paket=`, bukan state klien, sehingga
          pilihannya dapat ditandai-buku dan seksi ini tetap Server Component. */}
      <div className="w-full min-w-0 overflow-x-auto">
        <nav aria-label="Pilih paket psikotes" className="flex w-max min-w-full gap-2">
          {rekap.map((item) => (
            <Link
              key={item.paket.id}
              href={`/admin/psikotes?tab=hasil&paket=${item.paket.id}`}
              aria-current={item.paket.id === terpilih.paket.id ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                item.paket.id === terpilih.paket.id
                  ? "border-navy-800 bg-navy-900 text-white"
                  : "border-line bg-white text-navy-700 hover:bg-navy-50",
              )}
            >
              {item.paket.nama}
              <Badge tone="netral">{item.pesertaAktif}</Badge>
            </Link>
          ))}
        </nav>
      </div>

      <Card>
        <CardHeader
          judul={terpilih.paket.nama}
          deskripsi={`${terpilih.pesertaAktif} dari ${terpilih.baris.length} peserta sudah menyelesaikan sekurang-kurangnya satu sesi.`}
        />
        <CardBody className="p-0 sm:p-0">
          {terpilih.baris.length === 0 ? (
            <KeadaanKosong
              judul="Belum ada peserta"
              ikon={ClipboardCheck}
              deskripsi="Rekap muncul begitu ada siswa terdaftar yang mengerjakan psikotes."
            />
          ) : (
            <TableWrapper>
              <Table className="min-w-[900px]">
                <thead>
                  <tr>
                    <Th>Peserta</Th>
                    {terpilih.paket.sesi.map((sesi) => (
                      <Th key={sesi.id}>{sesi.nama}</Th>
                    ))}
                    <Th>Ringkasan</Th>
                  </tr>
                </thead>
                <tbody>
                  {terpilih.baris.map((baris) => (
                    <tr key={baris.studentId}>
                      <Td>
                        <span className="block font-semibold text-navy-900">
                          {baris.studentNama}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {baris.username}
                        </span>
                        {/* Rincian per nomor: inilah yang dipakai pengajar untuk
                            melihat butir mana yang belum dikuasai peserta. */}
                        <Link
                          href={`/admin/evaluasi/${baris.studentId}?sumber=psikotes`}
                          className="mt-1 inline-block text-xs font-semibold text-langit-600 hover:text-langit-700"
                        >
                          Lihat rincian jawaban
                        </Link>
                      </Td>

                      {baris.sel.map((sel, i) => (
                        <Td key={i}>
                          <Sel sel={sel} />
                        </Td>
                      ))}

                      <Td>
                        {baris.selesai === 0 ? (
                          <span className="text-xs text-muted">—</span>
                        ) : (
                          <>
                            <span className="block text-sm font-semibold text-navy-900">
                              {baris.selesai}/{terpilih.paket.sesi.length} sesi
                            </span>
                            {baris.totalSoal > 0 ? (
                              <span className="mt-0.5 block text-xs text-muted">
                                {baris.benar} benar dari {baris.totalSoal} soal
                              </span>
                            ) : null}
                            {baris.dimensiTerkuat ? (
                              <span className="mt-0.5 block text-xs text-muted">
                                EPPS terkuat: {baris.dimensiTerkuat}
                              </span>
                            ) : null}
                          </>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </CardBody>
      </Card>
    </>
  );
}

/** Satu sel hasil: status sesi beserta angka ringkasnya. */
function Sel({ sel }: { sel: SelRekap }) {
  if (sel.keadaan === "belum") {
    return <span className="text-xs text-muted">Belum dikerjakan</span>;
  }

  if (sel.keadaan === "berlangsung") {
    return (
      <>
        <Badge tone="gold">Sedang berjalan</Badge>
        <span className="mt-1 block text-xs text-muted">
          Mulai {formatTanggalWaktu(new Date(sel.mulai).toISOString())}
        </span>
      </>
    );
  }

  return (
    <>
      {sel.ringkas.jenis === "skor" ? (
        <Badge tone={sel.ringkas.benar * 2 >= sel.ringkas.total ? "hijau" : "netral"}>
          {sel.ringkas.benar}/{sel.ringkas.total} benar
        </Badge>
      ) : (
        <Badge tone="navy">
          {sel.ringkas.profil
            .reduce(
              (tertinggi, baris) => (baris.skor > tertinggi.skor ? baris : tertinggi),
              sel.ringkas.profil[0],
            )
            ?.dimensi ?? "Profil"}
        </Badge>
      )}
      <span className="mt-1 block text-xs text-muted">
        {formatTanggalWaktu(new Date(sel.waktu).toISOString())}
        {sel.otomatis ? " · otomatis" : ""}
      </span>
    </>
  );
}
