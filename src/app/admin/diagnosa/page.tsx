import type { Metadata } from "next";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  HardDrive,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { wajibSesi } from "@/lib/get-session";
import { periksaPenyimpanan } from "@/lib/penyimpanan/diagnosa";

export const metadata: Metadata = { title: "Diagnosa Sistem" };

// Selalu diperiksa saat dibuka, jangan diambil dari cache.
export const dynamic = "force-dynamic";

/**
 * Halaman diagnosa penyimpanan.
 *
 * Dibuka admin setelah deploy untuk memastikan data benar-benar tersimpan
 * permanen. Pemeriksaannya nyata: menulis satu kunci uji, membacanya kembali,
 * lalu menghapusnya.
 */
export default async function DiagnosaPage() {
  await wajibSesi("admin");
  const hasil = await periksaPenyimpanan();

  const sehat = hasil.bisaBaca && hasil.bisaTulis;
  const Ikon = hasil.adapter === "postgres" ? Database : HardDrive;

  return (
    <>
      <PageHeader
        judul="Diagnosa Sistem"
        deskripsi="Memastikan data yang disimpan aplikasi benar-benar bertahan."
      />

      <Card>
        <CardHeader
          judul="Penyimpanan Data"
          deskripsi={hasil.sumber}
          aksi={
            <Badge tone={sehat ? "hijau" : "merah"}>
              {sehat ? "Berfungsi" : "Bermasalah"}
            </Badge>
          }
        />
        <CardBody className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-line px-4 py-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
              <Ikon className="size-4.5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy-900">
                {hasil.adapter === "postgres"
                  ? "Database Postgres"
                  : "Folder berkas lokal"}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                {hasil.adapter === "postgres"
                  ? "Data tersimpan di database, aman terhadap restart maupun deploy ulang."
                  : "Data tersimpan di folder pada server ini. Cocok untuk pengembangan lokal atau hosting dengan disk permanen."}
              </p>
            </div>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2">
            <Baris label="Membaca data" ok={hasil.bisaBaca} />
            <Baris label="Menyimpan data" ok={hasil.bisaTulis} />
          </ul>

          {hasil.pesan ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              <XCircle className="mt-0.5 size-4 shrink-0" />
              {hasil.pesan}
            </p>
          ) : null}
        </CardBody>
      </Card>

      {hasil.peringatan.length > 0 ? (
        <Card>
          <CardHeader
            judul="Perlu Diperhatikan"
            deskripsi="Konfigurasi yang sebaiknya dilengkapi sebelum dipakai sungguhan."
          />
          <CardBody>
            <ul className="space-y-3">
              {hasil.peringatan.map((pesan) => (
                <li key={pesan} className="flex items-start gap-2.5 text-sm">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold-600" />
                  <span className="leading-relaxed text-navy-800">{pesan}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}

function Baris({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-line px-3 py-2.5 text-sm">
      {ok ? (
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="size-4 shrink-0 text-rose-600" />
      )}
      <span className="text-navy-800">{label}</span>
      <span className="ml-auto text-xs text-muted">{ok ? "OK" : "Gagal"}</span>
    </li>
  );
}
