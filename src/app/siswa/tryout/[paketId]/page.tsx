import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  FileText,
  Lock,
  Timer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { wajibFitur } from "@/lib/get-session";
import {
  getPaket,
  NADA_STATUS,
  ringkasMataUji,
  sesiTerurut,
  totalDurasiPaket,
  totalDurasiSesi,
  totalSoalPaket,
  totalSoalSesi,
  type PaketKonfig,
  type SesiKonfig,
  type StatusSesi,
} from "@/lib/paket-tryout";
import { bacaKonteksSiswa } from "@/lib/pengerjaan/layanan";
import {
  ringkasanPaket,
  sesiBerjalan,
  sesiTerkunci,
} from "@/lib/pengerjaan/status";
import { formatTanggalWaktu } from "@/lib/utils";

type Props = {
  params: Promise<{ paketId: string }>;
  searchParams: Promise<{ sesi?: string; galat?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paketId } = await params;
  const paket = await getPaket(paketId);
  return { title: paket ? paket.nama : "Paket tidak ditemukan" };
}

export default async function DetailPaketPage({ params, searchParams }: Props) {
  const { paketId } = await params;
  const { sesi: sesiDisorot, galat } = await searchParams;

  const paket = await getPaket(paketId);
  if (!paket || !paket.aktif) notFound();

  const session = await wajibFitur("tryoutAkademikAktif");
  const ctx = await bacaKonteksSiswa({
    id: session.identitas,
    nama: session.nama,
  });
  const ringkasan = ringkasanPaket(paket, ctx);
  const daftarSesi = sesiTerurut(paket);

  return (
    <>
      <Link
        href="/siswa/tryout"
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 transition hover:text-navy-900"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar paket
      </Link>

      <PageHeader
        judul={paket.nama}
        deskripsi={paket.deskripsi}
        aksi={
          ringkasan.tuntas ? (
            <Badge tone="hijau">
              <CheckCircle2 className="size-3.5" />
              Seluruh sesi selesai
            </Badge>
          ) : (
            <Badge tone={ringkasan.sedangBerlangsung ? "gold" : "netral"}>
              {ringkasan.sesiSelesai} dari {daftarSesi.length} sesi selesai
            </Badge>
          )
        }
      />

      {/* Hanya kegagalan yang ditampilkan; keberhasilan sudah terbaca dari
          status sesi pada kartu di bawah. */}
      {galat ? <Notifikasi>{galat}</Notifikasi> : null}

      <Card>
        <CardHeader
          judul="Informasi Paket"
          deskripsi="Rincian pelaksanaan dan komposisi soal."
        />
        <CardBody className="space-y-5">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Jumlah Sesi", nilai: `${daftarSesi.length} sesi` },
              { label: "Total Soal", nilai: `${totalSoalPaket(paket)} soal` },
              { label: "Total Waktu", nilai: `${totalDurasiPaket(paket)} menit` },
              { label: "Bentuk Soal", nilai: "Pilihan Ganda" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-navy-50/70 px-3.5 py-3">
                <dt className="text-xs text-muted">{item.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-navy-900">
                  {item.nilai}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center gap-2 text-sm text-muted">
            <CalendarClock className="size-4 text-navy-500" />
            Jadwal pelaksanaan: {formatTanggalWaktu(paket.jadwal)}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-navy-900">Progres paket</span>
              <span className="text-muted">
                {ringkasan.sesiSelesai} dari {daftarSesi.length} sesi
              </span>
            </div>
            <Progress
              nilai={ringkasan.persen}
              tone={ringkasan.tuntas ? "navy" : "gold"}
            />
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {daftarSesi.map((sesi) => (
          <KartuSesi
            key={sesi.id}
            paket={paket}
            sesi={sesi}
            status={ringkasan.status[sesi.id]}
            terkunci={sesiTerkunci(paket, sesi.id, ctx)}
            berjalan={sesiBerjalan(ctx, paket.id, sesi.id)}
            disorot={sesiDisorot === sesi.id}
          />
        ))}
      </div>
    </>
  );
}

/** Pesan kegagalan yang dibawa lewat `?galat=` sesudah pengalihan. */
function Notifikasi({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700"
    >
      {children}
    </p>
  );
}

function KartuSesi({
  paket,
  sesi,
  status,
  terkunci,
  berjalan,
  disorot,
}: {
  paket: PaketKonfig;
  sesi: SesiKonfig;
  status: StatusSesi;
  terkunci: boolean;
  berjalan: boolean;
  disorot: boolean;
}) {
  const hrefInstruksi = `/siswa/tryout/${paket.id}/${sesi.id}/instruksi`;

  return (
    <Card
      className={
        disorot ? "ring-2 ring-navy-300 ring-offset-2 ring-offset-surface" : ""
      }
    >
      <CardHeader
        judul={
          <span className="flex items-center gap-2">
            {sesi.nama}
            <span className="text-sm font-normal text-muted">
              · {ringkasMataUji(sesi)}
            </span>
          </span>
        }
        deskripsi={`${totalSoalSesi(sesi)} soal · ${totalDurasiSesi(sesi)} menit`}
        aksi={
          terkunci ? (
            <Badge tone="netral">
              <Lock className="size-3" />
              Terkunci
            </Badge>
          ) : (
            <Badge tone={NADA_STATUS[status]}>
              {status === "Sedang Berlangsung" ? (
                <CircleDot className="size-3" />
              ) : status === "Selesai" ? (
                <CheckCircle2 className="size-3.5" />
              ) : null}
              {status}
            </Badge>
          )
        }
      />
      <CardBody className="space-y-5">
        <ul className="space-y-3">
          {sesi.mataUji.map((mata) => (
            <li
              key={mata.subject}
              className="rounded-xl border border-line px-4 py-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy-900">
                    {mata.subject}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {mata.fokus}
                  </p>
                </div>
                <Badge tone="navy">Pilihan Ganda</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-navy-800">
                <span className="flex items-center gap-1.5">
                  <FileText className="size-3.5 text-navy-500" />
                  {mata.jumlahSoal} soal
                </span>
                <span className="flex items-center gap-1.5">
                  <Timer className="size-3.5 text-navy-500" />
                  {mata.durasiMenit} menit
                </span>
              </div>
            </li>
          ))}
        </ul>

        {terkunci ? (
          <div className="rounded-xl bg-navy-50 px-4 py-3 text-sm text-navy-800">
            Sesi ini terbuka setelah sesi sebelumnya dinyatakan selesai.
          </div>
        ) : status === "Selesai" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="/siswa/hasil"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Lihat hasil
              <ArrowRight className="size-4" />
            </ButtonLink>
            <p className="self-center text-sm text-muted">
              Sesi telah diselesaikan.
            </p>
          </div>
        ) : berjalan ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink
              href={`/ujian/${paket.id}/${sesi.id}`}
              variant="gold"
              className="w-full sm:w-auto"
            >
              Masuk Ruang Ujian
              <ArrowRight className="size-4" />
            </ButtonLink>
            <p className="text-sm text-muted">Waktu sesi sedang berjalan.</p>
          </div>
        ) : (
          <ButtonLink href={hrefInstruksi} className="w-full sm:w-auto">
            Baca Instruksi & Mulai
            <ArrowRight className="size-4" />
          </ButtonLink>
        )}
      </CardBody>
    </Card>
  );
}
