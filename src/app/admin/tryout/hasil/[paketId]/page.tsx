import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowDownWideNarrow, ArrowUpNarrowWide, Medal, Search } from "lucide-react";

import {
  DetailHasil,
  type DetailHasilProps,
} from "@/components/admin/detail-hasil";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { Table, Td, Th, TableWrapper } from "@/components/ui/table";
import { wajibSesi } from "@/lib/get-session";
import { isSubject, type Subject } from "@/lib/bank-soal/skema";
import { daftarSemuaPaket } from "@/lib/paket-tryout";
import { semuaPercobaan } from "@/lib/pengerjaan/admin";
import { rekapSatuPaket, type PesertaPaket } from "@/lib/pengerjaan/rekap-admin";
import { cn, formatTanggalWaktu } from "@/lib/utils";

type Props = {
  params: Promise<{ paketId: string }>;
  searchParams: Promise<{ mapel?: string; urut?: string; cari?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paketId } = await params;
  const rekap = await rekapSatuPaket(paketId);
  return { title: rekap ? `Hasil ${rekap.paketNama}` : "Hasil Try Out" };
}

/** Nilai peserta pada satu mata pelajaran; null bila belum dikumpulkan. */
function nilaiMapel(peserta: PesertaPaket, subject: Subject) {
  return peserta.mataUji.find((mata) => mata.subject === subject) ?? null;
}

/**
 * Rincian hasil satu paket try out.
 *
 * Tab pertama menampilkan rata-rata seluruh mata pelajaran per peserta; tab
 * berikutnya memecahnya per mata pelajaran sehingga terlihat siapa yang
 * tertinggi pada masing-masing. Urutan dan pencarian nama dikerjakan lewat
 * query string agar tautannya dapat dibagikan apa adanya.
 */
export default async function HasilPaketPage({ params, searchParams }: Props) {
  await wajibSesi("admin");

  const { paketId } = await params;
  const filter = await searchParams;

  const rekap = await rekapSatuPaket(paketId);
  if (!rekap) notFound();

  /* Rincian pengawasan tetap dapat dibuka dari sini: satu tombol per sesi yang
     dikerjakan peserta, berisi catatan kejadian selama ujian berlangsung. */
  const [percobaan, paketList] = await Promise.all([
    semuaPercobaan(),
    daftarSemuaPaket(),
  ]);
  const paket = paketList.find((item) => item.id === paketId);

  const detailPerSiswa = new Map<string, DetailHasilProps[]>();
  for (const item of percobaan) {
    if (item.package_id !== paketId) continue;
    const sesi = paket?.sesi.find((s) => s.id === item.session_id);
    const daftar = detailPerSiswa.get(item.student_id) ?? [];
    daftar.push({
      studentNama: item.student_nama,
      studentId: item.student_id,
      paketNama: rekap.paketNama,
      sesiNama: sesi?.nama ?? item.session_id,
      status: item.status,
      mulai: item.mulai,
      selesaiPada: item.selesai_pada ?? null,
      jumlahJawaban: item.jawaban.length,
      mataUji: item.hasil.map((hasil) => ({
        subject: hasil.subject,
        nilai: hasil.nilai,
        benar: hasil.benar,
        salah: hasil.salah,
        kosong: hasil.kosong,
        jumlahSoal: hasil.jumlah_soal,
        waktu: hasil.submitted_at,
        otomatis: hasil.otomatis,
      })),
      pelanggaran: (item.pelanggaran ?? []).map((catatan) => ({
        jenis: catatan.jenis,
        subject: catatan.subject,
        waktu: catatan.waktu,
        detail: catatan.detail,
      })),
    });
    detailPerSiswa.set(item.student_id, daftar);
  }

  const mapel: Subject | "rata" =
    isSubject(filter.mapel) && rekap.daftarMataUji.includes(filter.mapel)
      ? filter.mapel
      : "rata";
  const urut = filter.urut === "terendah" ? "terendah" : "tertinggi";
  const cari = filter.cari?.trim() ?? "";

  const tautan = (ubah: { mapel?: string; urut?: string; cari?: string }) => {
    const query = new URLSearchParams();
    const gabung = { mapel, urut, cari, ...ubah };
    if (gabung.mapel && gabung.mapel !== "rata") query.set("mapel", gabung.mapel);
    if (gabung.urut && gabung.urut !== "tertinggi") query.set("urut", gabung.urut);
    if (gabung.cari) query.set("cari", gabung.cari);
    const teks = query.toString();
    return `/admin/tryout/hasil/${paketId}${teks ? `?${teks}` : ""}`;
  };

  /* Penyaringan nama lebih dulu, lalu pengurutan. Pada tab mata pelajaran,
     peserta yang belum mengumpulkan mata uji itu tidak ikut diurutkan sebagai
     nilai nol — ia diletakkan paling akhir apa pun arah urutannya. */
  const tersaring = rekap.peserta.filter((peserta) =>
    cari ? peserta.studentNama.toLowerCase().includes(cari.toLowerCase()) : true,
  );

  const skor = (peserta: PesertaPaket) =>
    mapel === "rata" ? peserta.rataRata : (nilaiMapel(peserta, mapel)?.nilai ?? null);

  const terurut = [...tersaring].sort((a, b) => {
    const nilaiA = skor(a);
    const nilaiB = skor(b);
    if (nilaiA === null && nilaiB === null) {
      return a.studentNama.localeCompare(b.studentNama);
    }
    if (nilaiA === null) return 1;
    if (nilaiB === null) return -1;
    if (nilaiA === nilaiB) return a.studentNama.localeCompare(b.studentNama);
    return urut === "tertinggi" ? nilaiB - nilaiA : nilaiA - nilaiB;
  });

  const berperingkat = terurut.filter((peserta) => skor(peserta) !== null);
  const rataTampil =
    berperingkat.length === 0
      ? 0
      : Math.round(
          berperingkat.reduce((total, peserta) => total + (skor(peserta) ?? 0), 0) /
            berperingkat.length,
        );

  return (
    <>
      <Link
        href="/admin/tryout?tab=hasil"
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 transition hover:text-navy-900"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Hasil Try Out
      </Link>

      <PageHeader
        judul={rekap.paketNama}
        deskripsi={`${rekap.peserta.length} peserta sudah mengumpulkan. Rata-rata paket ${rekap.rataRata}.`}
      />

      {/* ------------------------------- Tab mapel ------------------------------ */}
      <div className="w-full min-w-0 overflow-x-auto border-b border-line">
        <nav aria-label="Mata pelajaran" className="flex w-max min-w-full gap-1 px-1">
          {(["rata", ...rekap.daftarMataUji] as const).map((kunci) => {
            const dipilih = kunci === mapel;
            return (
              <Link
                key={kunci}
                href={tautan({ mapel: kunci })}
                aria-current={dipilih ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap border-b-2 px-4 py-3 text-sm transition",
                  dipilih
                    ? "border-navy-900 font-semibold text-navy-900"
                    : "border-transparent font-medium text-slate-500 hover:border-navy-200 hover:text-navy-900",
                )}
              >
                {kunci === "rata" ? "Rata-rata Semua Mapel" : kunci}
              </Link>
            );
          })}
        </nav>
      </div>

      <Card>
        <CardHeader
          judul={mapel === "rata" ? "Rata-rata Seluruh Mata Pelajaran" : mapel}
          deskripsi={
            berperingkat.length === 0
              ? "Belum ada nilai pada tampilan ini."
              : `${berperingkat.length} peserta dinilai · rata-rata ${rataTampil}`
          }
          aksi={
            <div className="flex flex-wrap items-center gap-2">
              {/* Form GET: nilai tab dan arah urut ikut terbawa lewat hidden. */}
              <form className="flex gap-2">
                <input type="hidden" name="mapel" value={mapel === "rata" ? "" : mapel} />
                <input type="hidden" name="urut" value={urut} />
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    name="cari"
                    defaultValue={cari}
                    placeholder="Cari nama siswa"
                    className="h-9 w-full rounded-lg border border-navy-100 bg-white pl-9 pr-3 text-sm text-navy-900 sm:w-48"
                  />
                </div>
                <button
                  type="submit"
                  className="h-9 rounded-lg bg-navy-900 px-3.5 text-sm font-semibold text-white transition hover:bg-navy-800"
                >
                  Cari
                </button>
              </form>

              <div className="flex overflow-hidden rounded-lg border border-navy-100">
                {(
                  [
                    { nilai: "tertinggi", label: "Tertinggi", Ikon: ArrowDownWideNarrow },
                    { nilai: "terendah", label: "Terendah", Ikon: ArrowUpNarrowWide },
                  ] as const
                ).map(({ nilai, label, Ikon }) => (
                  <Link
                    key={nilai}
                    href={tautan({ urut: nilai })}
                    aria-current={urut === nilai ? "true" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition",
                      urut === nilai
                        ? "bg-navy-900 text-white"
                        : "bg-white text-navy-700 hover:bg-navy-50",
                    )}
                  >
                    <Ikon className="size-3.5" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          }
        />
        <CardBody className="p-0 sm:p-0">
          {terurut.length === 0 ? (
            <KeadaanKosong
              judul="Tidak ada peserta yang cocok"
              deskripsi={
                cari
                  ? `Tidak ditemukan peserta dengan nama mengandung "${cari}".`
                  : "Belum ada peserta yang mengumpulkan paket ini."
              }
            />
          ) : mapel === "rata" ? (
            <TabelRataRata
              peserta={terurut}
              daftarMataUji={rekap.daftarMataUji}
              urut={urut}
              detailPerSiswa={detailPerSiswa}
            />
          ) : (
            <TabelMapel peserta={terurut} subject={mapel} urut={urut} />
          )}
        </CardBody>
      </Card>
    </>
  );
}

/* --------------------------------- Tabel ---------------------------------- */

function LencanaNilai({ nilai }: { nilai: number }) {
  return (
    <Badge tone={nilai >= 70 ? "hijau" : nilai >= 50 ? "gold" : "merah"}>
      {nilai}
    </Badge>
  );
}

/** Nomor peringkat; hanya bermakna ketika urutannya dari nilai tertinggi. */
function Peringkat({ nomor, urut }: { nomor: number; urut: string }) {
  if (urut !== "tertinggi") {
    return <span className="text-muted tabular-nums">{nomor}</span>;
  }
  if (nomor > 3) return <span className="tabular-nums text-muted">{nomor}</span>;
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-navy-900">
      <Medal
        className={cn(
          "size-4",
          nomor === 1 ? "text-gold-600" : nomor === 2 ? "text-slate-400" : "text-amber-700",
        )}
      />
      {nomor}
    </span>
  );
}

function TabelRataRata({
  peserta,
  daftarMataUji,
  urut,
  detailPerSiswa,
}: {
  peserta: PesertaPaket[];
  daftarMataUji: Subject[];
  urut: string;
  detailPerSiswa: Map<string, DetailHasilProps[]>;
}) {
  return (
    <TableWrapper>
      <Table className="min-w-[840px]">
        <thead>
          <tr>
            <Th className="w-20">Peringkat</Th>
            <Th>Siswa</Th>
            {daftarMataUji.map((subject) => (
              <Th key={subject} className="w-32">
                {subject}
              </Th>
            ))}
            <Th className="w-28">Rata-rata</Th>
            <Th className="w-32 text-right">Pengawasan</Th>
          </tr>
        </thead>
        <tbody>
          {peserta.map((item, i) => (
            <tr key={item.studentId} className="transition hover:bg-navy-50/40">
              <Td>
                <Peringkat nomor={i + 1} urut={urut} />
              </Td>
              <Td className="font-medium">
                {item.studentNama}
                {/* Rincian per nomor: dipakai pengajar untuk melihat butir mana
                    yang belum dikuasai peserta. */}
                <Link
                  href={`/admin/evaluasi/${item.studentId}?sumber=tryout`}
                  className="mt-0.5 block text-xs font-semibold text-langit-600 hover:text-langit-700"
                >
                  Lihat rincian jawaban
                </Link>
              </Td>
              {daftarMataUji.map((subject) => {
                const nilai = nilaiMapel(item, subject);
                return (
                  <Td key={subject} className="whitespace-nowrap">
                    {nilai ? (
                      <>
                        <span className="font-semibold text-navy-900 tabular-nums">
                          {nilai.nilai}
                        </span>
                        <span className="text-xs text-muted">
                          {" "}
                          ({nilai.benar}/{nilai.jumlahSoal})
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted">belum</span>
                    )}
                  </Td>
                );
              })}
              <Td>
                <LencanaNilai nilai={item.rataRata} />
              </Td>
              <Td>
                <div className="flex justify-end gap-1">
                  {(detailPerSiswa.get(item.studentId) ?? []).map((detail) => (
                    <DetailHasil key={detail.sesiNama} detail={detail} />
                  ))}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

function TabelMapel({
  peserta,
  subject,
  urut,
}: {
  peserta: PesertaPaket[];
  subject: Subject;
  urut: string;
}) {
  return (
    <TableWrapper>
      <Table className="min-w-[760px]">
        <thead>
          <tr>
            <Th className="w-20">Peringkat</Th>
            <Th>Siswa</Th>
            <Th className="w-24">Nilai</Th>
            <Th className="w-24">Benar</Th>
            <Th className="w-24">Salah</Th>
            <Th className="w-24">Kosong</Th>
            <Th className="w-48">Dikumpulkan</Th>
          </tr>
        </thead>
        <tbody>
          {peserta.map((item, i) => {
            const nilai = nilaiMapel(item, subject);
            return (
              <tr key={item.studentId} className="transition hover:bg-navy-50/40">
                <Td>
                  {nilai ? (
                    <Peringkat nomor={i + 1} urut={urut} />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </Td>
                <Td className="font-medium">
                {item.studentNama}
                {/* Rincian per nomor: dipakai pengajar untuk melihat butir mana
                    yang belum dikuasai peserta. */}
                <Link
                  href={`/admin/evaluasi/${item.studentId}?sumber=tryout`}
                  className="mt-0.5 block text-xs font-semibold text-langit-600 hover:text-langit-700"
                >
                  Lihat rincian jawaban
                </Link>
              </Td>
                {nilai ? (
                  <>
                    <Td>
                      <LencanaNilai nilai={nilai.nilai} />
                    </Td>
                    <Td className="tabular-nums text-emerald-600">{nilai.benar}</Td>
                    <Td className="tabular-nums text-rose-600">{nilai.salah}</Td>
                    <Td className="tabular-nums text-muted">{nilai.kosong}</Td>
                    <Td className="whitespace-nowrap text-xs text-muted">
                      {formatTanggalWaktu(new Date(nilai.waktu).toISOString())}
                      {nilai.otomatis ? " · otomatis" : ""}
                    </Td>
                  </>
                ) : (
                  <Td colSpan={5} className="text-sm text-muted">
                    Belum mengumpulkan {subject}
                  </Td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
