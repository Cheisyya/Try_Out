import type { Metadata } from "next";
import Link from "next/link";
import { Brain, FileText } from "lucide-react";

import {
  ImportLatihan,
  type TujuanImpor,
} from "@/components/admin/latihan/import-latihan";
import {
  KelolaPaketIq,
  type BarisPaketIq,
} from "@/components/admin/latihan/kelola-paket-iq";
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
import { rekapTesIq, type SelIq } from "@/lib/tes-iq/rekap-admin";
import { semuaPaketIq } from "@/lib/tes-iq/repositori";
import { KATEGORI_IQ, soalDiujikan } from "@/lib/tes-iq/tipe";
import { formatTanggalWaktu } from "@/lib/utils";

export const metadata: Metadata = { title: "Tes IQ" };

type Props = { searchParams: Promise<{ tab?: string }> };

/**
 * Satu halaman untuk seluruh pengelolaan Tes IQ.
 *
 * Susunannya mengikuti halaman Try Out Akademik dan Psikotes: paket, impor
 * soal, dan hasil peserta berada pada tab halaman ini. Bank soal punya
 * halamannya sendiri karena memiliki alur buat/sunting per butir.
 */
export default async function AdminTesIqPage({ searchParams }: Props) {
  await wajibSesi("admin");

  const params = await searchParams;
  const aktif = tabLatihanAktif(params.tab);

  return (
    <>
      <PageHeader
        judul="Tes IQ"
        deskripsi={
          aktif === "paket"
            ? "Paket, tingkat, batas waktu, dan sakelar tampil di portal siswa."
            : aktif === "import"
              ? "Impor massal soal dari berkas PDF atau Excel."
              : "Percobaan terakhir tiap peserta pada setiap paket latihan."
        }
        aksi={
          <Link
            href="/admin/tes-iq/soal"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <FileText className="size-4" />
            Bank Soal
          </Link>
        }
      />

      <TabLatihan
        dasar="/admin/tes-iq"
        aktif={aktif}
        labelPaket="Paket"
        labelHasil="Hasil Tes IQ"
      />

      {aktif === "paket" ? <SeksiPaket /> : null}
      {aktif === "import" ? <SeksiImport /> : null}
      {aktif === "hasil" ? <SeksiHasil /> : null}
    </>
  );
}

/* -------------------------------------------------------------------------- */

async function SeksiPaket() {
  const daftarPaket = await semuaPaketIq();

  const daftar: BarisPaketIq[] = daftarPaket.map((paket) => ({
    id: paket.id,
    nomor: paket.nomor,
    nama: paket.nama,
    tingkat: paket.tingkat,
    deskripsi: paket.deskripsi,
    durasiMenit: paket.durasiMenit,
    aktif: paket.aktif !== false,
    jumlahSoal: paket.soal.length,
    jumlahAktif: soalDiujikan(paket).length,
  }));

  return <KelolaPaketIq daftar={daftar} />;
}

async function SeksiImport() {
  const daftarPaket = await semuaPaketIq();

  const tujuan: TujuanImpor[] = daftarPaket.map((paket) => ({
    paketId: paket.id,
    paketNama: paket.nama,
  }));

  return <ImportLatihan jenis="tesiq" tujuan={tujuan} kategori={KATEGORI_IQ} />;
}

async function SeksiHasil() {
  const rekap = await rekapTesIq();

  return (
    <Card>
      <CardHeader
        judul="Rekap Peserta"
        deskripsi={`${rekap.pesertaAktif} dari ${rekap.baris.length} peserta sudah menyelesaikan sekurang-kurangnya satu paket.`}
      />
      <CardBody className="p-0 sm:p-0">
        {rekap.baris.length === 0 ? (
          <KeadaanKosong
            judul="Belum ada peserta"
            ikon={Brain}
            deskripsi="Rekap muncul begitu ada siswa terdaftar yang mengerjakan Tes IQ."
          />
        ) : (
          <TableWrapper>
            <Table className="min-w-[820px]">
              <thead>
                <tr>
                  <Th>Peserta</Th>
                  {rekap.paket.map((paket) => (
                    <Th key={paket.id}>{paket.nama}</Th>
                  ))}
                  <Th>Ringkasan</Th>
                </tr>
              </thead>
              <tbody>
                {rekap.baris.map((baris) => (
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
                        href={`/admin/evaluasi/${baris.studentId}?sumber=tesiq`}
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
                            {baris.benar} benar dari {baris.totalSoal} soal
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {baris.selesai}/{rekap.paket.length} paket ·{" "}
                            {baris.totalPercobaan}x dikerjakan
                          </span>
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
  );
}

/** Satu sel hasil: status paket beserta angka ringkasnya. */
function Sel({ sel }: { sel: SelIq }) {
  if (sel.keadaan === "belum") {
    return <span className="text-xs text-muted">Belum dikerjakan</span>;
  }

  if (sel.keadaan === "berlangsung") {
    return (
      <>
        <Badge tone="gold">Sedang dikerjakan</Badge>
        <span className="mt-1 block text-xs text-muted">
          {sel.terjawab} soal terjawab
        </span>
      </>
    );
  }

  return (
    <>
      <Badge tone={sel.ringkas.benar * 2 >= sel.ringkas.total ? "hijau" : "netral"}>
        {sel.ringkas.benar}/{sel.ringkas.total} benar
      </Badge>
      <span className="mt-1 block text-xs text-muted">
        {formatTanggalWaktu(new Date(sel.waktu).toISOString())}
        {sel.percobaan > 1 ? ` · percobaan ke-${sel.percobaan}` : ""}
      </span>
    </>
  );
}
