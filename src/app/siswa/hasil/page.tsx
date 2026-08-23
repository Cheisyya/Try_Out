import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th, TableWrapper } from "@/components/ui/table";
import { SUBJECTS, isSubject, type Subject } from "@/lib/bank-soal/skema";
import { wajibFitur } from "@/lib/get-session";
import { rekapPerPaket, type RekapPaket } from "@/lib/pengerjaan/pembahasan";
import { formatTanggalWaktu } from "@/lib/utils";

export const metadata: Metadata = { title: "Riwayat Hasil" };

type Props = { searchParams: Promise<{ mapel?: string }> };

/**
 * Riwayat hasil peserta, satu baris per paket try out.
 *
 * Sebelumnya satu baris per mata uji, sehingga satu paket tersebar di beberapa
 * baris dan sulit dibandingkan. Sekarang seluruh mata uji sebuah paket tampil
 * berdampingan (mis. "Matematika 24/30"), dan pembahasannya dibuka lewat ikon
 * pada baris yang sama — bukan tabel terpisah di atasnya.
 */
export default async function RiwayatHasilPage({ searchParams }: Props) {
  const session = await wajibFitur("tryoutAkademikAktif");

  const params = await searchParams;
  const pilihan = params.mapel ?? "";
  const mapel: Subject | "semua" = isSubject(pilihan) ? pilihan : "semua";

  const rekap = await rekapPerPaket(session.identitas);

  // Filter mata pelajaran menyaring kolomnya, bukan barisnya: paket tetap utuh
  // supaya perbandingan antar paket tidak terputus.
  const tersaring =
    mapel === "semua"
      ? rekap
      : rekap
          .map((paket) => ({
            ...paket,
            mataUji: paket.mataUji.filter((mata) => mata.subject === mapel),
          }))
          .filter((paket) => paket.mataUji.length > 0);

  return (
    <>
      <PageHeader
        judul="Riwayat Hasil"
        deskripsi="Rekap nilai tiap paket try out yang telah Anda kerjakan."
      />

      <Card>
        <CardHeader
          judul="Rincian per Paket Try Out"
          deskripsi={`${tersaring.length} paket sudah dinilai.`}
          aksi={
            <form className="flex gap-2">
              <select
                name="mapel"
                defaultValue={mapel}
                className="h-10 min-w-0 flex-1 rounded-lg border border-navy-100 bg-white px-2.5 text-sm text-navy-900 sm:h-9 sm:flex-none"
              >
                <option value="semua">Semua mata pelajaran</option>
                {SUBJECTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-10 shrink-0 rounded-lg bg-navy-900 px-3.5 text-sm font-semibold text-white transition hover:bg-navy-800 sm:h-9"
              >
                Tampilkan
              </button>
            </form>
          }
        />
        <CardBody className="p-0 sm:p-0">
          {tersaring.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6">
              <p className="text-sm text-muted">
                Belum ada mata uji yang dikumpulkan.
              </p>
              <ButtonLink href="/siswa/tryout" className="mt-4">
                Mulai dari daftar try out
              </ButtonLink>
            </div>
          ) : (
            <>
              <TableWrapper className="hidden lg:block">
                <Table className="min-w-[820px]">
                  <thead>
                    <tr>
                      <Th>Paket</Th>
                      <Th>Hasil per Mata Pelajaran</Th>
                      <Th className="w-32">Total Benar</Th>
                      <Th className="w-28">Rata-rata</Th>
                      <Th className="w-44">Terakhir</Th>
                      <Th className="w-24 text-right">Pembahasan</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {tersaring.map((paket) => (
                      <tr
                        key={paket.paketId}
                        className="transition hover:bg-navy-50/40"
                      >
                        <Td className="font-medium">{paket.paketNama}</Td>
                        <Td>
                          <NilaiPerMapel paket={paket} />
                        </Td>
                        <Td className="whitespace-nowrap">
                          <span className="font-semibold text-navy-900">
                            {paket.totalBenar}
                          </span>
                          <span className="text-muted"> / {paket.totalSoal}</span>
                        </Td>
                        <Td>
                          <Badge tone={paket.rataRata >= 70 ? "hijau" : "gold"}>
                            {paket.rataRata}
                          </Badge>
                        </Td>
                        <Td className="whitespace-nowrap text-muted">
                          {formatTanggalWaktu(
                            new Date(paket.terakhir).toISOString(),
                          )}
                        </Td>
                        <Td>
                          <div className="flex justify-end">
                            <IkonPembahasan paket={paket} />
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>

              {/* Kartu untuk ponsel */}
              <ul className="divide-y divide-line lg:hidden">
                {tersaring.map((paket) => (
                  <li key={paket.paketId} className="space-y-3 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-navy-900">
                          {paket.paketNama}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {paket.totalBenar}/{paket.totalSoal} benar ·{" "}
                          {formatTanggalWaktu(
                            new Date(paket.terakhir).toISOString(),
                          )}
                        </p>
                      </div>
                      <Badge tone={paket.rataRata >= 70 ? "hijau" : "gold"}>
                        {paket.rataRata}
                      </Badge>
                    </div>

                    <NilaiPerMapel paket={paket} />

                    <div className="flex justify-end">
                      <IkonPembahasan paket={paket} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}

/* -------------------------------- Pembantu -------------------------------- */

/** "Matematika 24/30" untuk setiap mata pelajaran pada paket tersebut. */
function NilaiPerMapel({ paket }: { paket: RekapPaket }) {
  return (
    // Satu mata pelajaran per baris: berjajar membuat "Matematika 24/30" dan
    // "IPA 21/30" menyatu dan sulit dibaca sekilas.
    <ul className="space-y-1">
      {paket.mataUji.map((mata) => (
        <li
          key={`${mata.sesiNama}-${mata.subject}`}
          className="flex items-center gap-1.5 text-sm"
        >
          <span className="font-medium text-navy-800">{mata.subject}</span>
          <span
            className={
              mata.nilai >= 70
                ? "font-semibold text-emerald-600"
                : "font-semibold text-navy-900"
            }
          >
            {mata.benar}
          </span>
          <span className="text-muted">/{mata.jumlahSoal}</span>
        </li>
      ))}
    </ul>
  );
}

/** Ikon menuju pembahasan seluruh mata pelajaran pada paket ini. */
function IkonPembahasan({ paket }: { paket: RekapPaket }) {
  const label = `Lihat pembahasan ${paket.paketNama}`;
  return (
    <Link
      href={`/siswa/hasil/${paket.paketId}`}
      title={label}
      className="grid size-9 shrink-0 place-items-center rounded-lg border border-transparent text-gold-700 transition hover:border-gold-200 hover:bg-gold-50"
    >
      <Lightbulb className="size-4.5" strokeWidth={2} />
      <span className="sr-only">{label}</span>
    </Link>
  );
}
