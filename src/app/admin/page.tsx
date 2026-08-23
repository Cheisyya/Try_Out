import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Medal,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { GrafikGaris } from "@/components/ui/grafik-garis";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { KeadaanKosong } from "@/components/ui/state";
import { Table, TableWrapper, Td, Th } from "@/components/ui/table";
import {
  KKM,
  ringkasanDashboard,
  type KesiapanPaket,
  type RingkasanDashboard,
} from "@/lib/admin/ringkasan-dashboard";
import { wajibSesi } from "@/lib/get-session";
import { NADA_JENDELA } from "@/lib/paket-tryout";
import { LABEL_PELANGGARAN } from "@/lib/pengerjaan/tipe";
import { WARNA_SERI } from "@/lib/warna-grafik";
import { cn, formatTanggalWaktu } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard Admin" };

/**
 * Dashboard administrator: keadaan seluruh sistem dalam satu layar.
 *
 * Urutannya mengikuti urutan kerja panitia — apa yang perlu dikerjakan hari
 * ini, apakah paket berikutnya siap dibuka, bagaimana capaian peserta, dan
 * apakah ada catatan pengawasan. Angka inventaris (jumlah sesi, jumlah berkas
 * materi, jumlah soal keseluruhan) sengaja tidak ditampilkan: angka itu sudah
 * terbaca pada menunya masing-masing dan tidak mengubah keputusan apa pun.
 */
export default async function DashboardAdminPage() {
  await wajibSesi("admin");

  const data = await ringkasanDashboard();
  const { siswa, hasil, integritas } = data;

  const paketSiap = data.paket.length - data.paketBelumSiap.length;
  const adaHasil = hasil.pengerjaan > 0;

  return (
    <>
      <PageHeader
        judul="Dashboard Administrator"
        deskripsi="Keadaan sistem hari ini: kesiapan paket, kelengkapan data peserta, capaian nilai, dan catatan pengawasan ujian."
      />

      {/* -------------------------------- Sorotan ------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Sorotan
          ikon={Users}
          label="Peserta Aktif"
          nilai={String(siswa.aktif)}
          keterangan={
            siswa.total === siswa.aktif
              ? `seluruh ${siswa.total} peserta berstatus aktif`
              : `dari ${siswa.total} peserta terdaftar`
          }
          nada="navy"
        />
        <Sorotan
          ikon={UserCheck}
          label="Kelengkapan Data Diri"
          nilai={`${siswa.rataKelengkapan}%`}
          keterangan={`${siswa.lengkap} dari ${siswa.total} peserta sudah lengkap`}
          nada={siswa.rataKelengkapan >= 80 ? "hijau" : "gold"}
        />
        <Sorotan
          ikon={ClipboardList}
          label="Paket Siap Diujikan"
          nilai={`${paketSiap}/${data.paket.length}`}
          keterangan={
            data.paketBelumSiap.length === 0
              ? "seluruh bank soal memenuhi target"
              : `${data.paketBelumSiap.length} paket bank soalnya belum penuh`
          }
          nada={data.paketBelumSiap.length === 0 ? "hijau" : "gold"}
        />
        <Sorotan
          ikon={Target}
          label="Rata-rata Try Out"
          nilai={adaHasil ? String(hasil.rataKeseluruhan) : "—"}
          keterangan={
            adaHasil
              ? `${hasil.persenTuntas}% mencapai KKM ${KKM} · ${hasil.pengerjaan} pengerjaan paket`
              : "belum ada mata uji yang dikumpulkan"
          }
          nada={
            !adaHasil
              ? "netral"
              : hasil.rataKeseluruhan >= KKM
                ? "hijau"
                : "merah"
          }
        />
      </div>

      <PerluTindakan data={data} />

      {/* --------------------------- Kesiapan paket ---------------------------- */}
      <Card>
        <CardHeader
          judul="Kesiapan & Jadwal Try Out"
          deskripsi="Bank soal tiap paket dibanding target mata ujinya, beserta status jendela pengerjaan."
          aksi={
            <ButtonLink href="/admin/tryout" variant="ghost" size="sm">
              Kelola paket
              <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
        <CardBody className="p-0 sm:p-0">
          <TableWrapper>
            <Table className="min-w-[880px]">
              <thead>
                <tr>
                  <Th>Paket</Th>
                  <Th className="w-32">Status</Th>
                  <Th className="w-44">Jadwal Buka</Th>
                  <Th className="w-56">Kesiapan Soal</Th>
                  <Th className="w-24">Peserta</Th>
                  <Th className="w-24">Rata-rata</Th>
                </tr>
              </thead>
              <tbody>
                {data.paket.map((paket) => (
                  <BarisPaket key={paket.paketId} paket={paket} />
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </CardBody>
      </Card>

      {!adaHasil ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada nilai untuk dianalisis"
              deskripsi="Grafik capaian, sebaran nilai, dan perkembangan peserta muncul setelah mata uji pertama dikumpulkan."
              ikon={Medal}
            />
          </CardBody>
        </Card>
      ) : (
        <>
          {/* ------------------------- Capaian per mapel ------------------------ */}
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader
                judul="Rata-rata Kelas per Mata Pelajaran"
                deskripsi="Garis yang tertinggal menunjukkan materi yang perlu diperkuat lebih dulu."
              />
              <CardBody>
                <GrafikGaris
                  labelX={data.labelPaket}
                  seri={data.seriMapel.map((seri, i) => ({
                    ...seri,
                    warna: WARNA_SERI[i % WARNA_SERI.length],
                  }))}
                  satuan="rata-rata kelas per mata pelajaran"
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                judul="Sebaran & Peringkat Mata Pelajaran"
                deskripsi={`Sebaran ${hasil.pengerjaan} pengerjaan paket, lalu urutan mata pelajaran dari yang terlemah.`}
              />
              <CardBody className="space-y-5">
                <div className="space-y-2.5">
                  {hasil.sebaran.map((rentang) => (
                    <div key={rentang.label} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-xs font-semibold tabular-nums text-navy-800">
                        {rentang.label}
                      </span>
                      <span className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-navy-50">
                        <span
                          className={cn("block h-full rounded-full", rentang.warna)}
                          style={{ width: `${rentang.persen}%` }}
                        />
                      </span>
                      <span className="w-24 shrink-0 text-right text-xs tabular-nums text-muted">
                        {rentang.jumlah} ({rentang.persen}%)
                      </span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-3 border-t border-line pt-4">
                  {hasil.rataMapel.map((mapel) => (
                    <li key={mapel.subject}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-sm font-medium text-navy-900">
                          {mapel.subject}
                        </span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-navy-900">
                          {mapel.rata}
                        </span>
                      </div>
                      <Progress
                        nilai={mapel.rata}
                        tone={mapel.rata >= KKM ? "navy" : "gold"}
                        className="mt-1.5"
                      />
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>

          {/* --------------------------- Matriks siswa -------------------------- */}
          <Card>
            <CardHeader
              judul="Perkembangan Nilai Peserta"
              deskripsi="Rata-rata empat mata pelajaran tiap peserta pada setiap paket, diurutkan dari capaian tertinggi."
            />
            <CardBody className="p-0 sm:p-0">
              <TableWrapper>
                <Table className="min-w-[720px]">
                  <thead>
                    <tr>
                      <Th className="w-12">#</Th>
                      <Th>Peserta</Th>
                      {data.labelPaket.map((label) => (
                        <Th key={label} className="w-20 text-center">
                          {label}
                        </Th>
                      ))}
                      <Th className="w-24">Rata-rata</Th>
                      <Th className="w-24">Tren</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.matriks.map((baris, i) => (
                      <tr
                        key={baris.studentId}
                        className="transition hover:bg-navy-50/40"
                      >
                        <Td className="tabular-nums text-muted">{i + 1}</Td>
                        <Td className="font-medium">{baris.nama}</Td>
                        {baris.nilai.map((nilai, kolom) => (
                          <Td key={data.labelPaket[kolom]} className="text-center">
                            {nilai === null ? (
                              <span className="text-xs text-muted">—</span>
                            ) : (
                              <span
                                className={cn(
                                  "font-semibold tabular-nums",
                                  nilai >= KKM ? "text-emerald-600" : "text-navy-900",
                                )}
                              >
                                {nilai}
                              </span>
                            )}
                          </Td>
                        ))}
                        <Td>
                          <Badge
                            tone={
                              baris.rata >= 85
                                ? "hijau"
                                : baris.rata >= KKM
                                  ? "navy"
                                  : baris.rata >= 50
                                    ? "gold"
                                    : "merah"
                            }
                          >
                            {baris.rata}
                          </Badge>
                        </Td>
                        <Td>
                          <Tren selisih={baris.selisih} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </CardBody>
          </Card>
        </>
      )}

      {/* ------------------------------ Pengawasan ------------------------------ */}
      <Card>
        <CardHeader
          judul="Integritas Pelaksanaan Ujian"
          deskripsi="Catatan pengawas sisi peramban. Angka ini tidak memengaruhi nilai, hanya bahan evaluasi panitia."
        />
        <CardBody>
          {integritas.total === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              Belum ada catatan pelanggaran
              {integritas.sesiBerjalan > 0
                ? ` · ${integritas.sesiBerjalan} sesi sedang berlangsung`
                : "."}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Jenis terbanyak
                </p>
                <ul className="mt-3 space-y-2">
                  {integritas.perJenis.map((item) => (
                    <li
                      key={item.jenis}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0 truncate text-navy-800">
                        {LABEL_PELANGGARAN[item.jenis]}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-navy-900">
                        {item.jumlah}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Peserta dengan catatan terbanyak
                </p>
                <ul className="mt-3 space-y-2">
                  {integritas.siswaTeratas.map((item) => (
                    <li
                      key={item.nama}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0 truncate text-navy-800">
                        {item.nama}
                      </span>
                      <Badge tone={item.jumlah >= 10 ? "merah" : "gold"}>
                        {item.jumlah}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}

/* ------------------------------ Perlu tindakan ----------------------------- */

/**
 * Daftar hal yang benar-benar menunggu dikerjakan.
 *
 * Kartunya hilang sepenuhnya ketika tidak ada apa pun yang perlu ditindak,
 * sehingga keberadaannya sendiri sudah menjadi tanda.
 */
function PerluTindakan({ data }: { data: RingkasanDashboard }) {
  const tindakan: { pesan: string; tautan: string; label: string }[] = [];

  if (data.paketBelumSiap.length > 0) {
    const daftar = data.paketBelumSiap
      .map((paket) => `${paket.nama} (${paket.terisi}/${paket.target})`)
      .join(", ");
    tindakan.push({
      pesan: `Bank soal belum memenuhi target pada ${daftar}.`,
      tautan: "/admin/bank-soal",
      label: "Bank Soal",
    });
  }

  if (data.siswa.tertinggal.length > 0) {
    const daftar = data.siswa.tertinggal
      .map((item) => `${item.nama} (${item.persen}%)`)
      .join(", ");
    tindakan.push({
      pesan: `Data diri belum lengkap: ${daftar}.`,
      tautan: "/admin/siswa",
      label: "Data Siswa",
    });
  }

  const dibuka = data.paket.filter((paket) => paket.status === "Dibuka");
  const dibukaBelumSiap = dibuka.filter((paket) => paket.terisi < paket.target);
  if (dibukaBelumSiap.length > 0) {
    tindakan.push({
      pesan: `${dibukaBelumSiap.map((paket) => paket.nama).join(", ")} sudah terbuka untuk peserta padahal soalnya belum penuh.`,
      tautan: "/admin/tryout",
      label: "Jadwal Paket",
    });
  }

  if (data.integritas.sesiBerjalan > 0) {
    tindakan.push({
      pesan: `${data.integritas.sesiBerjalan} sesi ujian sedang berlangsung saat ini.`,
      tautan: "/admin/tryout?tab=hasil",
      label: "Hasil Try Out",
    });
  }

  if (tindakan.length === 0) return null;

  return (
    <Card>
      <CardHeader
        judul="Perlu Tindakan"
        deskripsi="Hal yang menahan kesiapan pelaksanaan try out berikutnya."
      />
      <CardBody className="p-0 sm:p-0">
        <ul className="divide-y divide-line">
          {tindakan.map((item) => (
            <li
              key={item.pesan}
              className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6"
            >
              <span className="flex min-w-0 flex-1 items-start gap-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold-600" />
                <span className="min-w-0 text-sm text-navy-800">{item.pesan}</span>
              </span>
              <Link
                href={item.tautan}
                className="shrink-0 text-sm font-semibold text-navy-700 underline-offset-4 transition hover:text-navy-900 hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

/* --------------------------------- Bagian --------------------------------- */

function BarisPaket({ paket }: { paket: KesiapanPaket }) {
  const siap = paket.terisi >= paket.target;
  const persen =
    paket.target === 0 ? 0 : Math.round((paket.terisi / paket.target) * 100);

  return (
    <tr className="transition hover:bg-navy-50/40">
      <Td>
        <span className="font-medium text-navy-900">{paket.nama}</span>
        <span className="mt-0.5 block text-xs text-muted">
          {paket.perMapel
            .map((mapel) => `${mapel.subject} ${mapel.terisi}/${mapel.target}`)
            .join(" · ")}
        </span>
      </Td>
      <Td>
        <Badge tone={NADA_JENDELA[paket.status]}>{paket.status}</Badge>
      </Td>
      <Td className="whitespace-nowrap text-xs text-muted">
        {paket.jadwal ? formatTanggalWaktu(paket.jadwal) : "—"}
      </Td>
      <Td>
        <div className="flex items-center gap-2.5">
          <Progress
            nilai={persen}
            tone={siap ? "navy" : "gold"}
            className="min-w-16 flex-1"
          />
          <span
            className={cn(
              "shrink-0 text-xs font-semibold tabular-nums",
              siap ? "text-emerald-600" : "text-gold-700",
            )}
          >
            {paket.terisi}/{paket.target}
          </span>
        </div>
      </Td>
      <Td className="tabular-nums">
        {paket.peserta > 0 ? (
          paket.peserta
        ) : (
          <span className="text-xs text-muted">belum</span>
        )}
      </Td>
      <Td>
        {paket.peserta > 0 ? (
          <span className="font-semibold tabular-nums text-navy-900">
            {paket.rataRata}
          </span>
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </Td>
    </tr>
  );
}

function Tren({ selisih }: { selisih: number | null }) {
  if (selisih === null) {
    return <span className="text-xs text-muted">paket pertama</span>;
  }
  if (selisih === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
        <Minus className="size-3.5" />
        tetap
      </span>
    );
  }
  const naik = selisih > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold tabular-nums",
        naik ? "text-emerald-600" : "text-rose-600",
      )}
    >
      {naik ? (
        <TrendingUp className="size-3.5" />
      ) : (
        <TrendingDown className="size-3.5" />
      )}
      {naik ? "+" : ""}
      {selisih}
    </span>
  );
}

/* --------------------------------- Sorotan -------------------------------- */

const NADA = {
  navy: "bg-navy-50 text-navy-700",
  hijau: "bg-emerald-50 text-emerald-700",
  gold: "bg-gold-50 text-gold-700",
  merah: "bg-rose-50 text-rose-600",
  netral: "bg-slate-100 text-slate-500",
} as const;

function Sorotan({
  ikon: Ikon,
  label,
  nilai,
  keterangan,
  nada,
}: {
  ikon: typeof Target;
  label: string;
  nilai: string;
  keterangan: string;
  nada: keyof typeof NADA;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={cn("grid size-9 place-items-center rounded-xl", NADA[nada])}>
          <Ikon className="size-4.5" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-navy-900">
        {nilai}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{keterangan}</p>
    </div>
  );
}
