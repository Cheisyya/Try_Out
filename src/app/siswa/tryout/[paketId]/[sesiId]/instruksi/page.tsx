import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  FileText,
  Lock,
  PlayCircle,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { FormMulaiSesi } from "@/components/tryout/form-mulai-sesi";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th, TableWrapper } from "@/components/ui/table";
import {
  getPaket,
  getSesi,
  isSesiId,
  jendelaPaket,
  NADA_STATUS,
  ringkasMataUji,
  sandiDemoSesi,
  totalDurasiSesi,
  totalSoalSesi,
} from "@/lib/paket-tryout";
import { ringkasanSesi } from "@/lib/bank-soal/pengambilan";
import { wajibSesi } from "@/lib/get-session";
import { bacaKonteksSiswa } from "@/lib/pengerjaan/layanan";
import { sesiBerjalan, sesiTerkunci, statusSesi } from "@/lib/pengerjaan/status";
import { formatTanggalWaktu } from "@/lib/utils";

type Props = { params: Promise<{ paketId: string; sesiId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paketId, sesiId } = await params;
  const paket = await getPaket(paketId);
  const sesi = await getSesi(paketId, sesiId);
  return {
    title: paket && sesi ? `Instruksi ${sesi.nama} — ${paket.nama}` : "Instruksi Sesi",
  };
}

const tataTertib = [
  "Pastikan perangkat terhubung ke sumber listrik dan koneksi internet stabil sebelum sesi dimulai.",
  "Kerjakan seluruh soal secara mandiri tanpa bantuan orang lain maupun sumber di luar layar ujian.",
  "Setiap mata uji memiliki alokasi waktu tersendiri dan dikerjakan berurutan dalam satu sesi.",
  "Seluruh soal berbentuk pilihan ganda dengan satu jawaban yang paling tepat.",
  "Jawaban yang telah dipilih dapat diubah selama waktu mata uji terkait belum berakhir.",
  "Sesi yang telah dimulai tidak dapat diulang pada paket yang sama.",
  "Ruang ujian dijalankan dalam mode layar penuh. Menyalin naskah soal, membuka menu klik kanan, dan pintasan penyalinan dinonaktifkan selama sesi berlangsung.",
  "Berpindah tab, keluar dari layar penuh, atau meninggalkan halaman ujian tercatat otomatis pada laporan pengawasan yang dibaca pengajar.",
];

export default async function InstruksiSesiPage({ params }: Props) {
  const { paketId, sesiId } = await params;

  const paket = await getPaket(paketId);
  const sesi = await getSesi(paketId, sesiId);
  if (!paket || !paket.aktif || !sesi || !isSesiId(sesiId)) notFound();

  const ketersediaan = await ringkasanSesi(paket.id, sesiId);
  const soalTersedia = ketersediaan.reduce(
    (total, item) => total + item.tersedia,
    0,
  );
  const bankLengkap = ketersediaan.every((item) => item.lengkap);

  const session = await wajibSesi("siswa");
  const ctx = await bacaKonteksSiswa({
    id: session.identitas,
    nama: session.nama,
  });
  const status = statusSesi(paket, sesiId, ctx);
  const terkunci = sesiTerkunci(paket, sesiId, ctx);
  const jendela = jendelaPaket(paket);
  const sedangBerjalan = sesiBerjalan(ctx, paket.id, sesiId);

  return (
    <>
      <Link
        href={`/siswa/tryout/${paket.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 transition hover:text-navy-900"
      >
        <ArrowLeft className="size-4" />
        Kembali ke {paket.nama}
      </Link>

      <PageHeader
        judul={`Instruksi ${sesi.nama}`}
        deskripsi={`${paket.nama} · ${ringkasMataUji(sesi)}`}
        aksi={
          terkunci ? (
            <Badge tone="netral">
              <Lock className="size-3" />
              Terkunci
            </Badge>
          ) : (
            <Badge tone={NADA_STATUS[status]}>{status}</Badge>
          )
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader
              judul="Susunan Mata Uji"
              deskripsi={
                bankLengkap
                  ? `Total ${totalSoalSesi(sesi)} soal · ${totalDurasiSesi(sesi)} menit, dikerjakan berurutan.`
                  : `Bank soal masih dalam pengisian: ${soalTersedia} dari ${totalSoalSesi(sesi)} soal siap dikerjakan. Alokasi waktu tetap ${totalDurasiSesi(sesi)} menit.`
              }
            />
            <CardBody className="p-0 sm:p-0">
              <TableWrapper>
                <Table className="min-w-[520px]">
                  <thead>
                    <tr>
                      <Th>Urutan</Th>
                      <Th>Mata Uji</Th>
                      <Th>Jumlah Soal</Th>
                      <Th>Waktu</Th>
                      <Th>Bentuk Soal</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {sesi.mataUji.map((mata, index) => (
                      <tr key={mata.subject}>
                        <Td className="w-14 font-semibold text-navy-500">
                          {index + 1}
                        </Td>
                        <Td>
                          <span className="font-medium">{mata.subject}</span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {mata.fokus}
                          </span>
                        </Td>
                        <Td className="whitespace-nowrap">
                          {ketersediaan[index]?.tersedia ?? 0} dari{" "}
                          {mata.jumlahSoal} soal
                        </Td>
                        <Td className="whitespace-nowrap">
                          {mata.durasiMenit} menit
                        </Td>
                        <Td className="whitespace-nowrap">Pilihan Ganda</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </CardBody>
          </Card>

        </div>

        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader judul="Ringkasan Sesi" />
            <CardBody className="space-y-3">
              {[
                {
                  icon: FileText,
                  label: "Jumlah soal",
                  nilai: `${soalTersedia} butir`,
                },
                {
                  icon: Timer,
                  label: "Total waktu",
                  nilai: `${totalDurasiSesi(sesi)} menit`,
                },
                {
                  icon: ShieldCheck,
                  label: "Bentuk soal",
                  nilai: "Pilihan ganda",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl bg-navy-50/70 px-3.5 py-3"
                >
                  <item.icon className="size-4.5 shrink-0 text-navy-600" />
                  <span className="min-w-0 flex-1 text-sm text-muted">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-navy-900">
                    {item.nilai}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>

          {!jendela.terbuka && !sedangBerjalan ? (
            <Card>
              <CardBody className="space-y-4 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-navy-50 text-navy-700">
                  <CalendarClock className="size-5" />
                </span>
                <p className="text-sm leading-relaxed text-navy-800">
                  {jendela.status === "Belum Dibuka"
                    ? `${paket.nama} baru dibuka pada ${formatTanggalWaktu(paket.jadwal)}. Silakan kembali pada waktu tersebut.`
                    : jendela.status === "Ditutup"
                      ? `${paket.nama} sudah ditutup pada ${formatTanggalWaktu(paket.ditutupPada ?? paket.jadwal)} dan tidak dapat dikerjakan lagi.`
                      : `${paket.nama} sedang tidak dibuka untuk peserta.`}
                </p>
                <ButtonLink
                  href={`/siswa/tryout/${paket.id}`}
                  variant="outline"
                  className="w-full"
                >
                  Kembali ke detail paket
                </ButtonLink>
              </CardBody>
            </Card>
          ) : terkunci ? (
            <Card>
              <CardBody className="space-y-4 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-navy-50 text-navy-700">
                  <Lock className="size-5" />
                </span>
                <p className="text-sm leading-relaxed text-navy-800">
                  {sesi.nama} baru dapat dimulai setelah <b>Sesi 1</b> pada{" "}
                  {paket.nama} dinyatakan selesai.
                </p>
                <ButtonLink
                  href={`/siswa/tryout/${paket.id}`}
                  variant="outline"
                  className="w-full"
                >
                  Kembali ke detail paket
                </ButtonLink>
              </CardBody>
            </Card>
          ) : status === "Selesai" ? (
            <Card>
              <CardBody className="space-y-4 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="size-5" />
                </span>
                <p className="text-sm leading-relaxed text-navy-800">
                  Sesi ini telah Anda selesaikan. Sesi yang sudah selesai tidak
                  dapat diulang pada paket yang sama.
                </p>
                <ButtonLink href="/siswa/hasil" className="w-full">
                  Lihat riwayat hasil
                </ButtonLink>
              </CardBody>
            </Card>
          ) : sedangBerjalan ? (
            <Card>
              <CardBody className="space-y-4 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-gold-50 text-gold-700">
                  <PlayCircle className="size-5" />
                </span>
                <p className="text-sm leading-relaxed text-navy-800">
                  Sesi ini sedang berjalan dan waktunya terus berkurang. Masuk
                  kembali untuk melanjutkan pengerjaan.
                </p>
                <ButtonLink
                  href={`/ujian/${paket.id}/${sesi.id}`}
                  variant="gold"
                  className="w-full"
                >
                  Masuk Ruang Ujian
                </ButtonLink>
              </CardBody>
            </Card>
          ) : (
            <FormMulaiSesi
              paketId={paket.id}
              sesiId={sesi.id}
              namaSesi={sesi.nama}
              passwordBawaan={await sandiDemoSesi(paket.id, sesi.id)}
            />
          )}
        </div>
      </div>
    </>
  );
}
