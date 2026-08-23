import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlarmClock, ArrowLeft, ArrowRight, CheckCircle2, CircleDot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { wajibFitur } from "@/lib/get-session";
import { sinkronSesiKedaluwarsa, statusSesi } from "@/lib/psikotes/catatan";
import { cariPaketPsikotes } from "@/lib/psikotes/repositori";
import {
  jumlahButirAktif,
  sesiTampil,
  totalMenitPaket,
} from "@/lib/psikotes/tipe";
import { formatTanggalWaktu } from "@/lib/utils";

type Props = { params: Promise<{ paketId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paketId } = await params;
  const paket = await cariPaketPsikotes(paketId);
  return { title: paket?.nama ?? "Try Out Psikotes" };
}

/**
 * Daftar sesi dalam satu paket psikotes, beserta status pengerjaannya.
 *
 * Sesi dapat dikerjakan dalam urutan mana pun, tetapi masing-masing hanya satu
 * kali: begitu ditutup, yang tampil adalah hasilnya.
 */
export default async function PsikotesPaketPage({ params }: Props) {
  const sesiLogin = await wajibFitur("psikotesAktif");

  const { paketId } = await params;
  const paket = await cariPaketPsikotes(paketId);
  if (!paket || paket.aktif === false) notFound();

  const berkas = await sinkronSesiKedaluwarsa(sesiLogin.identitas);
  const daftar = sesiTampil(paket).map((sesi) => ({
    sesi,
    status: statusSesi(berkas, paket.id, sesi),
  }));
  const selesai = daftar.filter((item) => item.status.keadaan === "selesai").length;

  return (
    <>
      <PageHeader
        judul={paket.nama}
        deskripsi={`${daftar.length} sesi · total ${totalMenitPaket(paket)} menit. Setiap sesi dikerjakan sekali; jawaban tersimpan otomatis dan waktunya dihitung server.`}
        aksi={
          <ButtonLink href="/siswa/psikotes" variant="outline" size="sm">
            <ArrowLeft className="size-4" />
            Daftar paket
          </ButtonLink>
        }
      />

      <Card>
        <CardBody className="p-0 sm:p-0">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-6">
            <p className="text-sm font-semibold text-navy-900">Kemajuan paket</p>
            <Badge tone={selesai === daftar.length ? "hijau" : "navy"}>
              {selesai} dari {daftar.length} sesi selesai
            </Badge>
          </div>

          <ol className="divide-y divide-line">
            {daftar.map(({ sesi, status }, urutan) => (
              <li key={sesi.id}>
                <Link
                  href={`/ujian/psikotes/${paket.id}/${sesi.id}`}
                  className="flex items-center gap-4 px-4 py-4 transition hover:bg-navy-50/40 sm:px-6"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-900 text-sm font-bold text-gold-300">
                    {urutan + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy-900">
                      {sesi.nama}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {sesi.ringkas}
                    </span>

                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      {status.keadaan === "selesai" ? (
                        <Badge tone="hijau">
                          <CheckCircle2 className="size-3.5" />
                          Selesai
                        </Badge>
                      ) : status.keadaan === "berlangsung" ? (
                        <Badge tone="gold">
                          <CircleDot className="size-3" />
                          Sedang berjalan
                        </Badge>
                      ) : (
                        <Badge tone="netral">Belum dikerjakan</Badge>
                      )}

                      <Badge tone="netral">{jumlahButirAktif(sesi)} butir</Badge>
                      <Badge tone="netral">
                        <AlarmClock className="size-3.5" />
                        {sesi.durasiMenit} menit
                      </Badge>
                    </span>

                    {status.ringkas ? (
                      <span className="mt-1.5 block text-xs text-muted">
                        {status.ringkas.jenis === "skor"
                          ? `${status.ringkas.benar} benar dari ${status.ringkas.total} soal`
                          : `Profil tersusun dari ${status.ringkas.dijawab} dari ${status.ringkas.total} pasangan`}
                        {status.selesaiPada
                          ? ` · ${formatTanggalWaktu(new Date(status.selesaiPada).toISOString())}`
                          : ""}

                      </span>
                    ) : null}
                  </span>

                  <ArrowRight className="size-4.5 shrink-0 text-slate-400" />
                </Link>
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </>
  );
}
