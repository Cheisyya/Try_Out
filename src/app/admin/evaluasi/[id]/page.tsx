import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ClipboardList, MinusCircle, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { Table, TableWrapper, Td, Th } from "@/components/ui/table";
import {
  evaluasiSiswa,
  type BagianEvaluasi,
  type KelompokEvaluasi,
  type ProfilEvaluasi,
  type SumberEvaluasi,
} from "@/lib/evaluasi/siswa";
import { wajibSesi } from "@/lib/get-session";
import { cariSiswa } from "@/lib/siswa/repositori";
import { formatTanggalWaktu } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Evaluasi Pengerjaan" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sumber?: string }>;
};

const TAB: { kunci: SumberEvaluasi; label: string }[] = [
  { kunci: "tryout", label: "Try Out Akademik" },
  { kunci: "psikotes", label: "Psikotes" },
  { kunci: "tesiq", label: "Tes IQ" },
];

function isSumber(nilai: string | undefined): nilai is SumberEvaluasi {
  return nilai === "tryout" || nilai === "psikotes" || nilai === "tesiq";
}

/**
 * Rincian jawaban seorang peserta pada seluruh jenis pengerjaan.
 *
 * Hanya pengerjaan yang sudah dikumpulkan yang tampil — jawaban yang masih
 * berjalan belum final. Pemilih sumber memakai tautan `?sumber=`, bukan state
 * klien, sehingga tetap Server Component dan dapat ditandai-buku.
 */
export default async function EvaluasiSiswaPage({ params, searchParams }: Props) {
  await wajibSesi("admin");

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const siswa = await cariSiswa(id);
  if (!siswa) notFound();

  const data = await evaluasiSiswa(siswa.id);
  const jumlah: Record<SumberEvaluasi, number> = {
    tryout: data.tryout.length,
    psikotes: data.psikotes.length,
    tesiq: data.tesiq.length,
  };

  const sumber: SumberEvaluasi = isSumber(query.sumber)
    ? query.sumber
    : (TAB.find((tab) => jumlah[tab.kunci] > 0)?.kunci ?? "tryout");

  const kelompok = data[sumber];

  return (
    <>
      <PageHeader
        judul={`Evaluasi · ${siswa.nama}`}
        deskripsi={`${siswa.username} · rincian jawaban pada seluruh pengerjaan yang sudah dikumpulkan.`}
        aksi={
          <Link
            href={`/admin/siswa/${siswa.id}`}
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-4" />
            Detail siswa
          </Link>
        }
      />

      <div className="w-full min-w-0 overflow-x-auto">
        <nav aria-label="Pilih jenis pengerjaan" className="flex w-max min-w-full gap-2">
          {TAB.map((tab) => (
            <Link
              key={tab.kunci}
              href={`/admin/evaluasi/${siswa.id}?sumber=${tab.kunci}`}
              aria-current={tab.kunci === sumber ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                tab.kunci === sumber
                  ? "border-navy-800 bg-navy-900 text-white"
                  : "border-line bg-white text-navy-700 hover:bg-navy-50",
              )}
            >
              {tab.label}
              <Badge tone="netral">{jumlah[tab.kunci]}</Badge>
            </Link>
          ))}
        </nav>
      </div>

      {kelompok.length === 0 ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada pengerjaan yang dikumpulkan"
              ikon={ClipboardList}
              deskripsi="Rincian jawaban muncul setelah peserta menyelesaikan dan mengumpulkan pengerjaannya."
            />
          </CardBody>
        </Card>
      ) : (
        kelompok.map((item) => <Kelompok key={item.judul} kelompok={item} />)
      )}
    </>
  );
}

function Kelompok({ kelompok }: { kelompok: KelompokEvaluasi }) {
  return (
    <Card>
      <CardHeader
        judul={kelompok.judul}
        deskripsi={`${kelompok.bagian.length + kelompok.profil.length} bagian dikumpulkan.`}
      />
      <CardBody className="space-y-6">
        {kelompok.bagian.map((bagian) => (
          <Bagian key={bagian.judul} bagian={bagian} />
        ))}
        {kelompok.profil.map((profil) => (
          <Profil key={profil.judul} profil={profil} />
        ))}
      </CardBody>
    </Card>
  );
}

function Bagian({ bagian }: { bagian: BagianEvaluasi }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy-900">{bagian.judul}</h3>
          {bagian.waktu > 0 ? (
            <p className="mt-0.5 text-xs text-muted">
              Dikumpulkan {formatTanggalWaktu(new Date(bagian.waktu).toISOString())}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="hijau">{bagian.benar} benar</Badge>
          <Badge tone="merah">{bagian.salah} salah</Badge>
          <Badge tone="netral">{bagian.kosong} kosong</Badge>
        </div>
      </div>

      {/* Rekap per kategori: inilah yang paling cepat menunjukkan letak lemahnya. */}
      {bagian.perKategori.length > 1 ? (
        <ul className="flex flex-wrap gap-2">
          {bagian.perKategori.map((baris) => (
            <li key={baris.kategori}>
              <Badge
                tone={baris.benar * 2 >= baris.jumlah ? "hijau" : "gold"}
              >
                {baris.kategori}: {baris.benar}/{baris.jumlah}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}

      <TableWrapper className="rounded-xl border border-line">
        <Table className="min-w-[420px]">
          <thead>
            <tr>
              <Th className="w-16">No</Th>
              <Th>Kategori</Th>
              <Th className="w-24">Jawaban</Th>
              <Th className="w-20">Kunci</Th>
              <Th className="w-28">Status</Th>
            </tr>
          </thead>
          <tbody>
            {bagian.butir.map((butir) => (
              <tr key={butir.nomor}>
                <Td className="font-semibold text-navy-900">{butir.nomor}</Td>
                <Td className="text-muted">{butir.kategori}</Td>
                <Td>
                  {butir.jawaban ? (
                    <span
                      className={cn(
                        "inline-grid size-7 place-items-center rounded-lg text-xs font-bold",
                        butir.benar
                          ? "bg-emerald-600 text-white"
                          : "bg-rose-600 text-white",
                      )}
                    >
                      {butir.jawaban}
                    </span>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </Td>
                <Td>
                  <span className="inline-grid size-7 place-items-center rounded-lg bg-navy-50 text-xs font-bold text-navy-700">
                    {butir.kunci}
                  </span>
                </Td>
                <Td>
                  {butir.jawaban === null ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <MinusCircle className="size-3.5" />
                      Kosong
                    </span>
                  ) : butir.benar ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="size-3.5" />
                      Benar
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700">
                      <XCircle className="size-3.5" />
                      Salah
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </section>
  );
}

/**
 * Sesi EPPS: profil kecenderungan, bukan benar/salah.
 *
 * Ditegaskan di layar agar pengajar tidak keliru membacanya sebagai nilai.
 */
function Profil({ profil }: { profil: ProfilEvaluasi }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy-900">{profil.judul}</h3>
          {profil.waktu > 0 ? (
            <p className="mt-0.5 text-xs text-muted">
              Dikumpulkan {formatTanggalWaktu(new Date(profil.waktu).toISOString())}
            </p>
          ) : null}
        </div>
        <Badge tone="navy">
          {profil.dijawab} dari {profil.total} pasangan dipilih
        </Badge>
      </div>

      <p className="rounded-xl border border-gold-200 bg-gold-50/70 px-4 py-3 text-sm leading-relaxed text-navy-800">
        Tes ini tidak mengenal jawaban benar atau salah. Angkanya menunjukkan
        seberapa kuat satu dorongan dibandingkan dorongan lain pada diri peserta,
        bukan nilai — dan bukan hasil pemeriksaan psikologi resmi.
      </p>

      <ul className="space-y-2.5">
        {profil.baris.map((baris) => {
          const persen = baris.maks === 0 ? 0 : Math.round((baris.skor / baris.maks) * 100);
          return (
            <li key={baris.dimensi}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium text-navy-800">
                  {baris.dimensi}
                </span>
                <span className="shrink-0 tabular-nums text-muted">
                  {baris.skor}/{baris.maks}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-navy-50">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    persen >= 70
                      ? "bg-emerald-500"
                      : persen >= 40
                        ? "bg-gold-400"
                        : "bg-slate-300",
                  )}
                  style={{ width: `${persen}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
