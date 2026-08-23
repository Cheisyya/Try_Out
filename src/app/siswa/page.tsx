import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Circle,
  CircleDot,
  IdCard,
  Lock,
} from "lucide-react";

import { GrafikGaris } from "@/components/ui/grafik-garis";
import { WARNA_SERI } from "@/lib/warna-grafik";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { wajibSesi } from "@/lib/get-session";
import { pengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";
import {
  persenKelengkapan,
  statusPendaftaran,
} from "@/lib/pendaftaran/kelengkapan";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";
import {
  daftarPaketAktif,
  NADA_STATUS,
  ringkasMataUji,
  sesiTerurut,
  totalDurasiPaket,
  totalDurasiSesi,
  totalSoalPaket,
  totalSoalSesi,
} from "@/lib/paket-tryout";
import { bacaKonteksSiswa, riwayatHasil } from "@/lib/pengerjaan/layanan";
import { rekapPerPaket } from "@/lib/pengerjaan/pembahasan";
import {
  paketBerikutnya,
  ringkasanPaket,
  sesiTerkunci,
} from "@/lib/pengerjaan/status";
import { formatTanggal, formatTanggalWaktu } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard Siswa" };

export default async function DashboardSiswaPage() {
  const session = await wajibSesi("siswa");
  const peserta = { id: session.identitas, nama: session.nama };

  // Dashboard merangkum seluruh isi portal, bukan hanya try out; bagian yang
  // sedang dimatikan admin tidak ikut diambil maupun ditampilkan.
  const pengaturan = await pengaturanAplikasi();

  const [ctx, hasil, rekap, pendaftaran] = await Promise.all([
    bacaKonteksSiswa(peserta),
    riwayatHasil(peserta),
    rekapPerPaket(peserta.id),
    pengaturan.dataDiriAktif
      ? bacaPendaftaran(peserta.id)
      : Promise.resolve(null),
  ]);

  const bagianDataDiri = pendaftaran ? statusPendaftaran(pendaftaran) : [];
  const persenDataDiri = pendaftaran ? persenKelengkapan(pendaftaran) : 0;

  const paketList = await daftarPaketAktif();

  // Deret untuk grafik perkembangan: sumbu X mengikuti paket yang sudah
  // dikerjakan, urut nomor paket.
  const labelPaket = rekap.map((item) => `Paket ${item.nomor}`);
  const seriRataRata = [
    {
      nama: "Rata-rata",
      warna: WARNA_SERI[0],
      titik: rekap.map((item) => item.rataRata),
    },
  ];
  const paketAktif = paketBerikutnya(paketList, ctx);
  const ringkasanAktif = ringkasanPaket(paketAktif, ctx);
  const hasilTerakhir = hasil[0];

  return (
    <>
      <PageHeader
        judul={`Selamat datang, ${session.nama.split(" ")[0]}`}
        deskripsi="Paket yang sedang berjalan, perkembangan nilai, dan kelengkapan data diri Anda."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {pengaturan.tryoutAkademikAktif ? (
            <>
              <Card>
                <CardHeader
                  judul="Paket yang Sedang Dikerjakan"
                  deskripsi="Lanjutkan dari sesi yang belum diselesaikan."
                  aksi={
                    <Badge tone={ringkasanAktif.sedangBerlangsung ? "gold" : "navy"}>
                      {ringkasanAktif.sesiSelesai} dari {paketAktif.sesi.length} sesi selesai
                    </Badge>
                  }
                />
                <CardBody className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-lg font-bold text-gold-300">
                      {paketAktif.nomor}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-navy-900">
                        {paketAktif.nama}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {paketAktif.deskripsi}
                      </p>
                    </div>
                  </div>

                  <Progress
                    nilai={ringkasanAktif.persen}
                    tone={ringkasanAktif.tuntas ? "navy" : "gold"}
                  />

                  <ul className="grid gap-3 sm:grid-cols-2">
                    {sesiTerurut(paketAktif).map((sesi) => {
                      const status = ringkasanAktif.status[sesi.id];
                      const terkunci = sesiTerkunci(paketAktif, sesi.id, ctx);
                      return (
                        <li
                          key={sesi.id}
                          className="rounded-xl border border-line px-4 py-3.5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-navy-900">
                              {sesi.nama}
                            </p>
                            {terkunci ? (
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
                            )}
                          </div>
                          <p className="mt-1.5 text-xs text-muted">{ringkasMataUji(sesi)}</p>
                          <p className="mt-1 text-xs text-muted">
                            {totalSoalSesi(sesi)} soal · {totalDurasiSesi(sesi)} menit
                          </p>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
                    <ButtonLink href={`/siswa/tryout/${paketAktif.id}`}>
                      Buka Paket Ini
                      <ArrowRight className="size-4" />
                    </ButtonLink>
                    <p className="text-xs text-muted">
                      {totalSoalPaket(paketAktif)} soal pilihan ganda · {totalDurasiPaket(paketAktif)}{" "}
                      menit per paket
                    </p>
                  </div>
                </CardBody>
              </Card>

              {rekap.length > 0 ? (
                <Card>
                  <CardHeader
                    judul="Perkembangan Nilai"
                    deskripsi="Rata-rata nilai Anda pada setiap paket try out."
                  />
                  <CardBody>
                    <GrafikGaris
                      labelX={labelPaket}
                      seri={seriRataRata}
                      satuan="rata-rata nilai"
                    />
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardHeader
                    judul="Perkembangan Nilai"
                    deskripsi="Grafik muncul setelah Anda menyelesaikan paket try out pertama."
                  />
                  <CardBody>
                    <p className="py-6 text-center text-sm text-muted">
                      Belum ada nilai untuk digambarkan.
                    </p>
                  </CardBody>
                </Card>
              )}
            </>
          ) : null}
        </div>

        <div className="space-y-6">
          {pengaturan.tryoutAkademikAktif ? (
            <Card>
              <CardHeader judul="Hasil Terakhir" />
              <CardBody className="space-y-4">
                {hasilTerakhir ? (
                  <>
                    <div>
                      <p className="text-sm font-medium text-navy-900">
                        {hasilTerakhir.paketNama} · {hasilTerakhir.sesiNama}
                      </p>
                      <p className="text-xs text-muted">
                        {hasilTerakhir.subject} ·{" "}
                        {formatTanggalWaktu(
                          new Date(hasilTerakhir.waktu).toISOString(),
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-navy-900 px-4 py-5 text-center text-white">
                      <p className="text-xs text-navy-200">Nilai diperoleh</p>
                      <p className="mt-1 text-4xl font-bold text-gold-300">
                        {hasilTerakhir.nilai}
                      </p>
                      <p className="mt-1 text-xs text-navy-200">
                        dari {hasilTerakhir.jumlahSoal} soal
                      </p>
                    </div>
                    <dl className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: "Benar", nilai: hasilTerakhir.benar },
                        { label: "Salah", nilai: hasilTerakhir.salah },
                        { label: "Jumlah Soal", nilai: hasilTerakhir.jumlahSoal },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-line px-2 py-3"
                        >
                          <dt className="text-xs text-muted">{item.label}</dt>
                          <dd className="mt-0.5 text-lg font-bold text-navy-900">
                            {item.nilai}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : (
                  <p className="py-4 text-center text-sm text-muted">
                    Belum ada mata uji yang dikumpulkan.
                  </p>
                )}
                <ButtonLink
                  href="/siswa/hasil"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Lihat semua hasil
                </ButtonLink>
              </CardBody>
            </Card>
          ) : null}

          {pengaturan.dataDiriAktif ? (
            <Card>
              <CardHeader
                judul="Kelengkapan Data Diri"
                deskripsi="Lengkapi sebelum batas waktu panitia."
                aksi={
                  <Badge tone={persenDataDiri === 100 ? "hijau" : "gold"}>
                    {persenDataDiri}%
                  </Badge>
                }
              />
              <CardBody className="space-y-4">
                <Progress
                  nilai={persenDataDiri}
                  tone={persenDataDiri === 100 ? "navy" : "gold"}
                />

                <ul className="space-y-1">
                  {bagianDataDiri.map((bagian) => (
                    <li key={bagian.kunci}>
                      <Link
                        href={bagian.href}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition hover:bg-navy-50/60"
                      >
                        {bagian.lengkap ? (
                          <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600" />
                        ) : (
                          <Circle className="size-4.5 shrink-0 text-slate-300" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-navy-800">
                          {bagian.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="/siswa/data-diri"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  <IdCard className="size-4" />
                  Buka Data Diri
                </ButtonLink>
              </CardBody>
            </Card>
          ) : null}

          {pengaturan.tesIqAktif ? (
            <Card>
              <CardHeader
                judul="Tes IQ (Latihan)"
                deskripsi="Latihan penalaran di luar mata uji seleksi."
              />
              <CardBody className="space-y-4">
                <p className="text-sm leading-relaxed text-muted">
                  Dua paket soal verbal, numerik, logika, dan spasial. Tanpa
                  batas waktu dan tanpa skor IQ — selesai mengerjakan, Anda
                  langsung melihat benar/salah beserta pembahasannya.
                </p>
                <ButtonLink
                  href="/siswa/tes-iq"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  <Brain className="size-4" />
                  Buka Tes IQ
                </ButtonLink>
              </CardBody>
            </Card>
          ) : null}

          {pengaturan.psikotesAktif ? (
            <Card>
              <CardHeader
                judul="Try Out Psikotes"
                deskripsi="Simulasi rangkaian psikotes seleksi."
              />
              <CardBody className="space-y-4">
                <p className="text-sm leading-relaxed text-muted">
                  Tiga paket, masing-masing empat sesi berdurasi 29 menit: TIU,
                  Penalaran Visual, EPPS, serta Kepribadian dan Emosi. Lengkap
                  dengan pembahasan pada sesi yang berkunci.
                </p>
                <ButtonLink
                  href="/siswa/psikotes"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  <ClipboardCheck className="size-4" />
                  Buka Psikotes
                </ButtonLink>
              </CardBody>
            </Card>
          ) : null}

        </div>
      </div>
    </>
  );
}
