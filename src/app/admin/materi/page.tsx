import type { Metadata } from "next";
import Link from "next/link";
import { EyeOff, Library } from "lucide-react";

import { AksiMateri, TombolTambahMateri } from "@/components/materi/kelola-materi";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { Table, Td, Th, TableWrapper } from "@/components/ui/table";
import { wajibSesi } from "@/lib/get-session";
import { pengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";
import { semuaMateri } from "@/lib/materi/repositori";
import {
  isMataPelajaran,
  labelUkuranMateri,
  MATA_PELAJARAN,
} from "@/lib/materi/tipe";
import { formatTanggalWaktu } from "@/lib/utils";

export const metadata: Metadata = { title: "Materi" };

type Props = {
  searchParams: Promise<{ mapel?: string }>;
};

/**
 * Pengelolaan materi belajar per mata pelajaran.
 *
 * Terpisah dari Try Out dengan sengaja: try out menguji empat mata uji seleksi,
 * sedangkan materi mencakup seluruh mata pelajaran pendampingan harian.
 */
export default async function AdminMateriPage({ searchParams }: Props) {
  await wajibSesi("admin");

  const params = await searchParams;
  const mapel = isMataPelajaran(params.mapel ?? "") ? params.mapel! : "semua";

  const [daftar, pengaturan] = await Promise.all([
    semuaMateri(),
    pengaturanAplikasi(),
  ]);

  const tersaring =
    mapel === "semua"
      ? daftar
      : daftar.filter((item) => item.mataPelajaran === mapel);

  return (
    <>
      <PageHeader
        judul="Materi Belajar"
        deskripsi="Bahan ajar per mata pelajaran. Siswa dapat membacanya di portal, tetapi tidak disediakan tombol unduh."
        aksi={
          <>
            <Link
              href="/admin/pengaturan"
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              <Library className="size-4" />
              Pengaturan Menu Siswa
            </Link>
            <TombolTambahMateri />
          </>
        }
      />

      {!pengaturan.materiAktif ? (
        <p className="flex items-start gap-3 rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3.5 text-sm text-gold-800">
          <EyeOff className="mt-0.5 size-4.5 shrink-0" />
          Menu Materi sedang dimatikan pada Pengaturan, sehingga siswa belum
          melihat materi apa pun meskipun sudah diunggah di sini.
        </p>
      ) : null}

      <Card>
        <CardHeader
          judul="Daftar Materi"
          deskripsi={`${tersaring.length} materi sesuai filter.`}
          aksi={
            <form className="flex gap-2">
              <select
                name="mapel"
                defaultValue={mapel}
                className="h-10 min-w-0 flex-1 rounded-lg border border-navy-100 bg-white px-2.5 text-sm text-navy-900 sm:h-9 sm:flex-none"
              >
                <option value="semua">Semua mata pelajaran</option>
                {MATA_PELAJARAN.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-10 shrink-0 rounded-lg bg-navy-900 px-3.5 text-sm font-semibold text-white transition hover:bg-navy-800 sm:h-9"
              >
                Tampilkan
              </button>
            </form>
          }
        />
        <CardBody className="p-0 sm:p-0">
          {tersaring.length === 0 ? (
            <KeadaanKosong
              judul="Belum ada materi"
              deskripsi="Unggah berkas PDF pada formulir di atas; materi langsung terlihat siswa setelah tersimpan."
            />
          ) : (
            <>
              <TableWrapper className="hidden lg:block">
                <Table className="min-w-[820px]">
                  <thead>
                    <tr>
                      <Th>Materi</Th>
                      <Th className="w-40">Mata Pelajaran</Th>
                      <Th className="w-32">Ukuran</Th>
                      <Th className="w-44">Diunggah</Th>
                      <Th className="w-32">Status</Th>
                      <Th className="w-32 text-right">Aksi</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {tersaring.map((item) => (
                      <tr key={item.id} className="transition hover:bg-navy-50/40">
                        <Td>
                          <span className="font-medium text-navy-900">
                            {item.judul}
                          </span>
                          {item.deskripsi ? (
                            <span className="mt-0.5 block text-xs text-muted">
                              {item.deskripsi}
                            </span>
                          ) : null}
                        </Td>
                        <Td>
                          <Badge tone="netral">{item.mataPelajaran}</Badge>
                        </Td>
                        <Td className="whitespace-nowrap text-muted">
                          {labelUkuranMateri(item.ukuran)}
                        </Td>
                        <Td className="whitespace-nowrap text-muted">
                          {formatTanggalWaktu(
                            new Date(item.diunggahPada).toISOString(),
                          )}
                        </Td>
                        <Td>
                          <Badge tone={item.aktif ? "hijau" : "netral"}>
                            {item.aktif ? "Terlihat" : "Disembunyikan"}
                          </Badge>
                        </Td>
                        <Td>
                          <AksiMateri materi={item} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>

              <ul className="divide-y divide-line lg:hidden">
                {tersaring.map((item) => (
                  <li key={item.id} className="space-y-3 px-4 py-4 sm:px-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-navy-900">
                          {item.judul}
                        </p>
                        {item.deskripsi ? (
                          <p className="mt-0.5 text-xs text-muted">
                            {item.deskripsi}
                          </p>
                        ) : null}
                      </div>
                      <Badge tone={item.aktif ? "hijau" : "netral"}>
                        {item.aktif ? "Terlihat" : "Sembunyi"}
                      </Badge>
                    </div>

                    <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <Badge tone="netral">{item.mataPelajaran}</Badge>
                      {labelUkuranMateri(item.ukuran)} ·{" "}
                      {formatTanggalWaktu(
                        new Date(item.diunggahPada).toISOString(),
                      )}
                    </p>

                    <AksiMateri materi={item} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}
