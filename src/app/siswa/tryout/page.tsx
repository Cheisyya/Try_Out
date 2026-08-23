import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  Lock,
  Timer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { KeadaanKosong } from "@/components/ui/state";
import { wajibFitur } from "@/lib/get-session";
import {
  daftarPaketAktif,
  jendelaPaket,
  NADA_STATUS,
  ringkasMataUji,
  sesiTerurut,
  totalDurasiPaket,
  totalDurasiSesi,
  totalSoalPaket,
  totalSoalSesi,
} from "@/lib/paket-tryout";
import { bacaKonteksSiswa } from "@/lib/pengerjaan/layanan";
import { ringkasanPaket, sesiTerkunci } from "@/lib/pengerjaan/status";
import { formatTanggal } from "@/lib/utils";

export const metadata: Metadata = { title: "Try Out Akademik" };

export default async function DaftarPaketPage() {
  const session = await wajibFitur("tryoutAkademikAktif");
  const ctx = await bacaKonteksSiswa({
    id: session.identitas,
    nama: session.nama,
  });

  const daftar = (await daftarPaketAktif()).map((paket) => ({
    paket,
    sesi: sesiTerurut(paket),
    ringkasan: ringkasanPaket(paket, ctx),
    jendela: jendelaPaket(paket),
  }));

  return (
    <>
      <PageHeader
        judul="Try Out Akademik"
        deskripsi="Paket try out yang dibuka pengajar. Kerjakan sesi secara berurutan."
      />

      {daftar.length === 0 ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada paket try out"
              ikon={ClipboardList}
              deskripsi="Kartu paket muncul setelah pengajar membuka paket try out akademik."
            />
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {daftar.map(({ paket, sesi, ringkasan, jendela }) => (
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
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <CalendarClock className="size-3.5" />
                    {paket.ditutupPada
                      ? `${formatTanggal(paket.jadwal)} – ${formatTanggal(paket.ditutupPada)}`
                      : `Dibuka ${formatTanggal(paket.jadwal)}`}
                  </p>
                </div>
                {!jendela.terbuka ? (
                  <Badge tone={jendela.status === "Ditutup" ? "merah" : "netral"}>
                    {jendela.status}
                  </Badge>
                ) : ringkasan.tuntas ? (
                  <Badge tone="hijau">
                    <CheckCircle2 className="size-3.5" />
                    Tuntas
                  </Badge>
                ) : ringkasan.sedangBerlangsung ? (
                  <Badge tone="gold">Berlangsung</Badge>
                ) : null}
              </div>

              <p className="text-sm leading-relaxed text-muted">
                {paket.deskripsi}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-navy-800">Progres sesi</span>
                  <span className="text-muted">
                    {ringkasan.sesiSelesai} dari {sesi.length} selesai
                  </span>
                </div>
                <Progress
                  nilai={ringkasan.persen}
                  tone={ringkasan.tuntas ? "navy" : "gold"}
                />
              </div>

              <ul className="space-y-2">
                {sesi.map((item) => {
                  const terkunci = sesiTerkunci(paket, item.id, ctx);
                  return (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-navy-50/70 px-3.5 py-2.5"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-navy-900">
                          {item.nama}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {ringkasMataUji(item)} · {totalSoalSesi(item)} soal ·{" "}
                          {totalDurasiSesi(item)} menit
                        </span>
                      </span>
                      {terkunci ? (
                        <Badge tone="netral">
                          <Lock className="size-3" />
                          Terkunci
                        </Badge>
                      ) : (
                        <Badge tone={NADA_STATUS[ringkasan.status[item.id]]}>
                          {ringkasan.status[item.id]}
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ul>

              <dl className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-navy-500" />
                  <span className="text-navy-800">
                    {totalSoalPaket(paket)} soal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="size-4 text-navy-500" />
                  <span className="text-navy-800">
                    {totalDurasiPaket(paket)} menit
                  </span>
                </div>
              </dl>

              <ButtonLink
                href={`/siswa/tryout/${paket.id}`}
                variant={ringkasan.tuntas ? "outline" : "primary"}
                className="w-full"
              >
                {ringkasan.tuntas
                  ? "Lihat Detail Paket"
                  : ringkasan.sedangBerlangsung
                    ? "Lanjutkan Paket"
                    : "Pilih Paket Ini"}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </CardBody>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted">
        Butuh melihat capaian sebelumnya?{" "}
        <Link
          href="/siswa/hasil"
          className="font-semibold text-navy-800 underline underline-offset-4"
        >
          Buka riwayat hasil
        </Link>
      </p>
    </>
  );
}
