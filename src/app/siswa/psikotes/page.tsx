import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Timer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { KeadaanKosong } from "@/components/ui/state";
import { wajibFitur } from "@/lib/get-session";
import { sinkronSesiKedaluwarsa, statusSesi } from "@/lib/psikotes/catatan";
import { paketPsikotesAktif } from "@/lib/psikotes/repositori";
import {
  jumlahButirAktif,
  sesiTampil,
  totalButirPaket,
  totalMenitPaket,
} from "@/lib/psikotes/tipe";

export const metadata: Metadata = { title: "Try Out Psikotes" };

/**
 * Daftar paket Try Out Psikotes.
 *
 * Susunannya sengaja dibuat sama dengan halaman Try Out Akademik — kartu per
 * paket, batang kemajuan, dan daftar sesi beserta statusnya — supaya peserta
 * tidak perlu mempelajari dua tata letak untuk dua hal yang alurnya sama.
 */
export default async function PsikotesPage() {
  const sesiLogin = await wajibFitur("psikotesAktif");

  const [daftarPaket, berkas] = await Promise.all([
    paketPsikotesAktif(),
    sinkronSesiKedaluwarsa(sesiLogin.identitas),
  ]);

  const daftar = daftarPaket
    .map((paket) => {
      const sesi = sesiTampil(paket);
      const status = sesi.map((item) => ({
        sesi: item,
        keadaan: statusSesi(berkas, paket.id, item).keadaan,
      }));
      const selesai = status.filter((item) => item.keadaan === "selesai").length;

      return {
        paket,
        status,
        selesai,
        persen: sesi.length === 0 ? 0 : Math.round((selesai / sesi.length) * 100),
        tuntas: sesi.length > 0 && selesai === sesi.length,
        berjalan: status.some((item) => item.keadaan === "berlangsung"),
      };
    })
    // Paket yang seluruh sesinya dimatikan admin tidak berguna bagi peserta.
    .filter((item) => item.status.length > 0);

  return (
    <>
      <PageHeader
        judul="Try Out Psikotes"
        deskripsi="Paket psikotes yang dibuka pengajar. Setiap sesi dikerjakan sekali dan waktunya dihitung server."
      />

      {daftar.length === 0 ? (
        <Card>
          <CardBody className="p-0 sm:p-0">
            <KeadaanKosong
              judul="Belum ada paket psikotes"
              ikon={ClipboardCheck}
              deskripsi="Kartu paket muncul setelah pengajar membuka paket psikotes."
            />
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {daftar.map(({ paket, status, selesai, persen, tuntas, berjalan }) => (
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
                    {status.length} sesi · dikerjakan satu per satu
                  </p>
                </div>
                {tuntas ? (
                  <Badge tone="hijau">
                    <CheckCircle2 className="size-3.5" />
                    Tuntas
                  </Badge>
                ) : berjalan ? (
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
                    {selesai} dari {status.length} selesai
                  </span>
                </div>
                <Progress nilai={persen} tone={tuntas ? "navy" : "gold"} />
              </div>

              <ul className="space-y-2">
                {status.map(({ sesi, keadaan }) => (
                  <li
                    key={sesi.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-navy-50/70 px-3.5 py-2.5"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-navy-900">
                        {sesi.nama}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {jumlahButirAktif(sesi)} butir · {sesi.durasiMenit} menit
                      </span>
                    </span>
                    <Badge
                      tone={
                        keadaan === "selesai"
                          ? "hijau"
                          : keadaan === "berlangsung"
                            ? "gold"
                            : "netral"
                      }
                    >
                      {keadaan === "selesai"
                        ? "Selesai"
                        : keadaan === "berlangsung"
                          ? "Sedang Berlangsung"
                          : "Belum Dimulai"}
                    </Badge>
                  </li>
                ))}
              </ul>

              <dl className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-navy-500" />
                  <span className="text-navy-800">
                    {totalButirPaket(paket)} butir
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="size-4 text-navy-500" />
                  <span className="text-navy-800">
                    {totalMenitPaket(paket)} menit
                  </span>
                </div>
              </dl>

              <ButtonLink
                href={`/siswa/psikotes/${paket.id}`}
                variant={tuntas ? "outline" : "primary"}
                className="w-full"
              >
                {tuntas
                  ? "Lihat Detail Paket"
                  : berjalan
                    ? "Lanjutkan Paket"
                    : "Pilih Paket Ini"}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </CardBody>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted">
        Ingin berlatih penalaran lebih dahulu?{" "}
        <Link
          href="/siswa/tes-iq"
          className="font-semibold text-navy-800 underline underline-offset-4"
        >
          Buka Tes IQ (Latihan)
        </Link>
      </p>
    </>
  );
}
