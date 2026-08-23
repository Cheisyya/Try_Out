import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, Link2, Search } from "lucide-react";

import { AksiBarisSiswa } from "@/components/admin/aksi-siswa";
import { TombolTambahSiswa } from "@/components/admin/kelola-siswa";
import { PilihStatusKelulusan } from "@/components/admin/status-kelulusan";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination, potongHalaman } from "@/components/ui/pagination";
import { Table, Td, Th, TableWrapper } from "@/components/ui/table";
import { wajibSesi } from "@/lib/get-session";
import { ringkasanPesertaAdmin } from "@/lib/pengerjaan/admin";
import { daftarSiswa } from "@/lib/siswa/repositori";
import { isAlumni } from "@/lib/siswa/status";

export const metadata: Metadata = { title: "Siswa" };

const PER_HALAMAN = 10;

type Props = {
  searchParams: Promise<{
    cari?: string;
    status?: string;
    halaman?: string;
  }>;
};

/**
 * Daftar siswa yang masih dalam proses seleksi.
 *
 * Begitu status kelulusannya ditetapkan (Lulus / Tidak Lulus), siswa berpindah
 * ke halaman Alumni — halaman ini sengaja hanya memuat peserta berjalan supaya
 * daftar kerjanya tetap pendek.
 */
export default async function AdminSiswaPage({ searchParams }: Props) {
  await wajibSesi("admin");
  const params = await searchParams;

  const cari = params.cari?.trim() ?? "";
  const status =
    params.status === "Aktif" || params.status === "Nonaktif"
      ? params.status
      : "semua";

  const [siswa, ringkasan] = await Promise.all([
    daftarSiswa(),
    ringkasanPesertaAdmin(),
  ]);

  const semua = siswa.map((item) => {
    const catatan = ringkasan.get(item.id);
    return {
      ...item,
      sesiSelesai: catatan?.sesiSelesai ?? 0,
      sesiBerjalan: catatan?.sesiBerjalan ?? 0,
      jumlahPercobaan: catatan?.jumlahPercobaan ?? 0,
    };
  });

  const berjalan = semua.filter((item) => !isAlumni(item.statusKelulusan));

  const tersaring = berjalan.filter((item) => {
    if (status !== "semua" && item.status !== status) return false;
    if (!cari) return true;

    const kunci = cari.toLowerCase();
    return (
      item.nama.toLowerCase().includes(kunci) ||
      item.username.toLowerCase().includes(kunci) ||
      item.noCasis.toLowerCase().includes(kunci) ||
      item.email.toLowerCase().includes(kunci) ||
      item.asalSekolah.toLowerCase().includes(kunci)
    );
  });

  const halaman = potongHalaman(
    tersaring,
    Number(params.halaman) || 1,
    PER_HALAMAN,
  );

  return (
    <>
      <PageHeader
        judul="Siswa"
        deskripsi="Peserta yang masih dalam proses seleksi. Tetapkan status kelulusan untuk memindahkannya ke Alumni."
        aksi={
          <>
            {/* Anchor biasa: unduhan berkas ditangani peramban, bukan router. */}
            <a
              href="/admin/siswa/unduh"
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              <Download className="size-4" />
              Unduh Berkas
            </a>
            <TombolTambahSiswa />
          </>
        }
      />

      <Card>
        <CardHeader
          judul="Daftar Siswa"
          deskripsi={`${tersaring.length} siswa sesuai filter.`}
          aksi={
            <form className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <div className="relative min-w-0 flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  name="cari"
                  defaultValue={cari}
                  placeholder="Cari nama, username, sekolah"
                  className="h-10 w-full rounded-lg border border-navy-100 bg-white pl-9 pr-3 text-sm text-navy-900 sm:h-9 sm:w-56"
                />
              </div>
              <div className="flex gap-2">
                <select
                  name="status"
                  defaultValue={status}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-navy-100 bg-white px-2.5 text-sm text-navy-900 sm:h-9 sm:flex-none"
                >
                  <option value="semua">Semua akun</option>
                  <option value="Aktif">Akun aktif</option>
                  <option value="Nonaktif">Akun nonaktif</option>
                </select>
                <button
                  type="submit"
                  className="h-10 shrink-0 rounded-lg bg-navy-900 px-3.5 text-sm font-semibold text-white transition hover:bg-navy-800 sm:h-9"
                >
                  Terapkan
                </button>
              </div>
            </form>
          }
        />
        <CardBody className="p-0 sm:p-0">
          {halaman.baris.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted sm:px-6">
              Tidak ada siswa yang cocok dengan filter.
            </p>
          ) : (
            <>
              {/* Tabel untuk layar lebar */}
              <TableWrapper className="hidden lg:block">
                <Table className="min-w-[860px]">
                  <thead>
                    <tr>
                      <Th>Siswa</Th>
                      <Th className="w-40">Pengerjaan</Th>
                      <Th className="w-36">Link Drive</Th>
                      <Th className="w-52">Status Kelulusan</Th>
                      <Th className="w-[172px] text-right">Aksi</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {halaman.baris.map((item) => (
                      <tr key={item.id} className="transition hover:bg-navy-50/40">
                        <Td>
                          <Link
                            href={`/admin/siswa/${item.id}`}
                            className="font-medium text-navy-900 hover:underline"
                          >
                            {item.nama}
                          </Link>
                          <span className="mt-0.5 block text-xs text-muted">
                            {item.noCasis ? `No. ${item.noCasis} · ` : ""}
                            {item.username}
                          </span>
                        </Td>
                        <Td>
                          <Badge
                            tone={item.status === "Aktif" ? "hijau" : "netral"}
                          >
                            {item.status}
                          </Badge>
                          <span className="mt-1 block text-xs text-muted">
                            {item.sesiSelesai} sesi selesai
                            {item.sesiBerjalan > 0
                              ? ` · ${item.sesiBerjalan} berjalan`
                              : ""}
                          </span>
                        </Td>
                        <Td>
                          <TautanDrive tautan={item.tautanDrive} />
                        </Td>
                        <Td>
                          <PilihStatusKelulusan
                            id={item.id}
                            nama={item.nama}
                            status={item.statusKelulusan}
                          />
                        </Td>
                        <Td>
                          <AksiBarisSiswa siswa={keForm(item)} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>

              {/* Kartu untuk ponsel dan tablet */}
              <ul className="divide-y divide-line lg:hidden">
                {halaman.baris.map((item) => (
                  <li key={item.id} className="space-y-3 px-4 py-4 sm:px-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/siswa/${item.id}`}
                          className="block truncate font-semibold text-navy-900"
                        >
                          {item.nama}
                        </Link>
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {item.noCasis ? `No. ${item.noCasis} · ` : ""}
                          {item.username}
                        </span>
                      </div>
                      <Badge tone={item.status === "Aktif" ? "hijau" : "netral"}>
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted">
                      {item.sesiSelesai} sesi selesai
                      {item.sesiBerjalan > 0
                        ? ` · ${item.sesiBerjalan} berjalan`
                        : ""}
                      {" · "}
                      <TautanDrive tautan={item.tautanDrive} ringkas />
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <PilihStatusKelulusan
                        id={item.id}
                        nama={item.nama}
                        status={item.statusKelulusan}
                      />
                      <AksiBarisSiswa siswa={keForm(item)} />
                    </div>
                  </li>
                ))}
              </ul>

              <Pagination
                basePath="/admin/siswa"
                params={{
                  cari,
                  status: status === "semua" ? undefined : status,
                }}
                halaman={halaman.halaman}
                totalHalaman={halaman.totalHalaman}
                dari={halaman.dari}
                sampai={halaman.sampai}
                total={halaman.total}
              />
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}

/* -------------------------------- Pembantu -------------------------------- */

function keForm(item: Awaited<ReturnType<typeof daftarSiswa>>[number] & {
  jumlahPercobaan: number;
}) {
  return {
    id: item.id,
    noCasis: item.noCasis,
    username: item.username,
    nama: item.nama,
    email: item.email,
    asalSekolah: item.asalSekolah,
    kelas: item.kelas,
    status: item.status,
    statusKelulusan: item.statusKelulusan,
    tautanDrive: item.tautanDrive,
    catatanDrive: item.catatanDrive,
    jumlahPercobaan: item.jumlahPercobaan,
  };
}

function TautanDrive({
  tautan,
  ringkas = false,
}: {
  tautan: string;
  ringkas?: boolean;
}) {
  if (!tautan) {
    return <span className="text-xs text-muted">drive belum diisi</span>;
  }
  return (
    <a
      href={tautan}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-langit-600 hover:text-navy-900"
    >
      <Link2 className="size-4 shrink-0" />
      {ringkas ? "Drive" : "Buka"}
      <ExternalLink className="size-3.5 shrink-0" />
    </a>
  );
}
