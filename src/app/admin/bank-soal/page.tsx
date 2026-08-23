import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th, TableWrapper } from "@/components/ui/table";
import { wajibSesi } from "@/lib/get-session";
import { laporanCakupan } from "@/lib/bank-soal/pengambilan";
import { SUBJECTS } from "@/lib/bank-soal/skema";

export const metadata: Metadata = { title: "Bank Soal" };

/**
 * Ringkasan pengisian bank soal.
 *
 * Halaman ini sengaja tidak lagi memuat daftar butir soal: angka pada tabel
 * Cakupan Pengisian adalah tautannya. Satu klik pada angka sebuah mata uji
 * membuka halaman daftar soal paket tersebut — tempat sunting, aktif/nonaktif,
 * dan hapus dikerjakan.
 */
export default async function BankSoalPage() {
  await wajibSesi("admin");

  const cakupan = await laporanCakupan();

  return (
    <>
      {/* Bank soal dibuka dari halaman Try Out, jadi jalan pulangnya perlu ada
          di halaman ini — bukan hanya mengandalkan tombol back peramban. */}
      <Link
        href="/admin/tryout"
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 transition hover:text-navy-900"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Try Out
      </Link>

      <PageHeader
        judul="Bank Soal"
        deskripsi="Klik angka pada tabel untuk membuka daftar soal paket dan mata pelajaran tersebut."
        aksi={
          <ButtonLink href="/admin/bank-soal/baru">
            <Plus className="size-4" />
            Tambah Soal
          </ButtonLink>
        }
      />

      <Card>
        <CardHeader
          judul="Cakupan Pengisian"
          deskripsi="Jumlah soal aktif dibanding target setiap mata pelajaran."
        />
        <CardBody className="p-0 sm:p-0">
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Paket</Th>
                  {SUBJECTS.map((nilai) => (
                    <Th key={nilai}>{nilai}</Th>
                  ))}
                  <Th>Total</Th>
                </tr>
              </thead>
              <tbody>
                {cakupan.map((item) => (
                  <tr key={item.paketId} className="transition hover:bg-navy-50/40">
                    <Td className="whitespace-nowrap font-medium">
                      {item.nama}
                      {!item.aktifPaket ? (
                        <Badge tone="netral" className="ml-2">
                          nonaktif
                        </Badge>
                      ) : null}
                    </Td>
                    {SUBJECTS.map((nilai) => {
                      const mata = item.mataUji.find((m) => m.subject === nilai);
                      return (
                        <Td key={nilai} className="whitespace-nowrap">
                          <Link
                            href={`/admin/bank-soal/daftar?paket=${item.paketId}&subject=${encodeURIComponent(nilai)}`}
                            title={`Buka daftar soal ${item.nama} · ${nilai}`}
                            className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                          >
                            <span
                              className={
                                mata && mata.target > 0 && mata.aktif >= mata.target
                                  ? "font-semibold text-emerald-600"
                                  : "font-semibold text-navy-900"
                              }
                            >
                              {mata?.aktif ?? 0}
                            </span>
                            <span className="text-muted">/ {mata?.target ?? 0}</span>
                          </Link>
                        </Td>
                      );
                    })}
                    <Td className="whitespace-nowrap font-semibold">
                      {item.totalAktif} / {item.totalTarget}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </CardBody>
      </Card>
    </>
  );
}
