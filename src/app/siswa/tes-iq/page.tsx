import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, CheckCircle2, FileText, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { KeadaanKosong } from "@/components/ui/state";
import { wajibFitur } from "@/lib/get-session";
import { sinkronPaketKedaluwarsa, statusIq } from "@/lib/tes-iq/catatan";
import { paketIqAktif } from "@/lib/tes-iq/repositori";
import { paketDiujikan, sebaranKategori, soalDiujikan } from "@/lib/tes-iq/tipe";

export const metadata: Metadata = { title: "Tes IQ (Latihan)" };

/**
 * Daftar paket Tes IQ latihan.
 *
 * Tata letaknya mengikuti halaman Try Out Akademik: kartu per paket, batang
 * kemajuan, dan ringkasan jumlah soal beserta waktunya. Bedanya hanya pada apa
 * yang diukur — di sini kemajuan berarti berapa butir yang sudah benar pada
 * percobaan terakhir, bukan berapa sesi yang tuntas.
 */
export default async function TesIqPage() {
  const sesiLogin = await wajibFitur("tesIqAktif");

  const daftarPaket = (await paketIqAktif()).filter(paketDiujikan);
  const berkas = await sinkronPaketKedaluwarsa(sesiLogin.identitas, daftarPaket);

  return (
    <>
      <PageHeader
        judul="Tes IQ (Latihan)"
        deskripsi="Latihan soal penalaran dengan batas waktu, lengkap dengan pembahasan. Boleh diulang sebanyak yang Anda mau."
      />

      {daftarPaket.length === 0 ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada paket latihan"
              ikon={Brain}
              deskripsi="Kartu paket muncul setelah pengajar membuka paket Tes IQ."
            />
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {daftarPaket.map((paket) => {
          const soal = soalDiujikan(paket);
          const status = statusIq(berkas, paket);
          const sebaran = sebaranKategori(paket);
          const persen = status.ringkas
            ? Math.round((status.ringkas.benar / status.ringkas.total) * 100)
            : 0;

          return (
            <Card key={paket.id} className="flex flex-col">
              <CardBody className="flex flex-1 flex-col gap-4">
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-lg font-bold text-gold-300">
                    {paket.nomor}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-navy-900">
                      {paket.nama}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Tingkat {paket.tingkat.toLowerCase()}
                      {status.percobaan > 0
                        ? ` · sudah dikerjakan ${status.percobaan}x`
                        : ""}
                    </p>
                  </div>
                  {status.keadaan === "selesai" ? (
                    <Badge tone="hijau">
                      <CheckCircle2 className="size-3.5" />
                      Selesai
                    </Badge>
                  ) : status.keadaan === "berlangsung" ? (
                    <Badge tone="gold">Berlangsung</Badge>
                  ) : null}
                </div>

                <p className="text-sm leading-relaxed text-muted">
                  {paket.deskripsi}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-navy-800">
                      Percobaan terakhir
                    </span>
                    <span className="text-muted">
                      {status.ringkas
                        ? `${status.ringkas.benar} dari ${status.ringkas.total} benar`
                        : "Belum ada"}
                    </span>
                  </div>
                  <Progress
                    nilai={persen}
                    tone={persen >= 70 ? "navy" : "gold"}
                  />
                </div>

                <ul className="flex flex-wrap gap-2">
                  {sebaran.map((baris) => (
                    <li key={baris.kategori}>
                      <Badge tone="netral">
                        {baris.kategori} · {baris.jumlah}
                      </Badge>
                    </li>
                  ))}
                </ul>

                <dl className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-navy-500" />
                    <span className="text-navy-800">{soal.length} soal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="size-4 text-navy-500" />
                    <span className="text-navy-800">
                      {paket.durasiMenit} menit
                    </span>
                  </div>
                </dl>

                <ButtonLink
                  href={`/siswa/tes-iq/${paket.id}`}
                  variant={status.keadaan === "selesai" ? "outline" : "primary"}
                  className="w-full"
                >
                  {status.keadaan === "selesai"
                    ? "Lihat Pembahasan"
                    : status.keadaan === "berlangsung"
                      ? "Lanjutkan Latihan"
                      : "Mulai Latihan"}
                  <ArrowRight className="size-4" />
                </ButtonLink>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted">
        Sudah siap dengan bentuk soal seleksi?{" "}
        <Link
          href="/siswa/psikotes"
          className="font-semibold text-navy-800 underline underline-offset-4"
        >
          Buka Try Out Psikotes
        </Link>
      </p>
    </>
  );
}
