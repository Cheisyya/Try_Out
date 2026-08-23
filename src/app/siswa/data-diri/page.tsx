import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Link2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { wajibFitur } from "@/lib/get-session";
import {
  persenKelengkapan,
  statusPendaftaran,
} from "@/lib/pendaftaran/kelengkapan";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";
import { cariSiswa } from "@/lib/siswa/repositori";
import { formatTanggalWaktu } from "@/lib/utils";

export const metadata: Metadata = { title: "Data Diri Siswa" };

export default async function DataDiriPage() {
  const sesi = await wajibFitur("dataDiriAktif");
  const data = await bacaPendaftaran(sesi.identitas);
  const siswa = await cariSiswa(sesi.identitas);

  const status = statusPendaftaran(data);
  const persen = persenKelengkapan(data);

  return (
    <>
      <PageHeader
        judul="Data Diri Siswa"
        deskripsi="Lengkapi seluruh bagian sebelum batas waktu yang ditentukan panitia."
      />

      <Card>
        <CardHeader
          judul="Kelengkapan Pengisian"
          deskripsi={
            data.diperbaruiPada
              ? `Terakhir diperbarui ${formatTanggalWaktu(new Date(data.diperbaruiPada).toISOString())}.`
              : "Belum ada data yang tersimpan."
          }
          aksi={
            <Badge tone={persen === 100 ? "hijau" : "gold"}>{persen}% lengkap</Badge>
          }
        />
        <CardBody className="space-y-5">
          <Progress nilai={persen} />

          <ul className="grid gap-3 sm:grid-cols-2">
            {status.map((bagian) => (
              <li key={bagian.kunci}>
                <Link
                  href={bagian.href}
                  className="flex items-center gap-3 rounded-xl border border-line px-4 py-3.5 transition hover:border-navy-200 hover:bg-navy-50/40"
                >
                  {bagian.lengkap ? (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-slate-300" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy-900">
                      {bagian.label}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {bagian.catatan}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="Link Google Drive"
          deskripsi="Folder drive yang dibagikan panitia khusus untuk Anda."
          aksi={
            <Link
              href="/siswa/data-diri/link-drive"
              className="text-sm font-semibold text-langit-600 hover:text-navy-900"
            >
              Buka →
            </Link>
          }
        />
        <CardBody>
          <p className="flex items-center gap-2 text-sm text-muted">
            <Link2 className="size-4 shrink-0" />
            {siswa?.tautanDrive
              ? "Tautan sudah tersedia untuk Anda."
              : "Panitia belum membagikan tautan untuk Anda."}
          </p>
        </CardBody>
      </Card>
    </>
  );
}
