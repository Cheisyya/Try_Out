import type { Metadata } from "next";
import { ExternalLink, Link2 } from "lucide-react";

import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { KeadaanKosong } from "@/components/ui/state";
import { wajibFitur } from "@/lib/get-session";
import { cariSiswa } from "@/lib/siswa/repositori";

export const metadata: Metadata = { title: "Link Google Drive" };

/**
 * Tautan Google Drive milik siswa yang sedang masuk.
 *
 * Tautannya berbeda untuk setiap siswa dan hanya dapat diisi admin; halaman ini
 * membacanya dari catatan siswa yang bersangkutan, bukan dari daftar bersama.
 */
export default async function LinkDriveSiswaPage() {
  const sesi = await wajibFitur("dataDiriAktif");
  const siswa = await cariSiswa(sesi.identitas);
  const tautan = siswa?.tautanDrive?.trim() ?? "";

  return (
    <>
      <PageHeader
        judul="Link Google Drive"
        deskripsi="Folder berkas yang dibagikan panitia khusus untuk Anda."
      />

      <Card>
        <CardHeader
          judul="Tautan Anda"
          deskripsi={
            tautan
              ? "Klik tautan di bawah untuk membuka folder drive Anda."
              : "Belum ada tautan yang dibagikan."
          }
        />
        <CardBody className={tautan ? undefined : "p-0 sm:p-0"}>
          {tautan ? (
            <a
              href={tautan}
              target="_blank"
              // Wajib pada tautan keluar yang dibuka di tab baru agar halaman
              // tujuan tidak dapat menyentuh tab ini.
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-xl border border-line px-4 py-3.5 transition hover:border-navy-200 hover:bg-navy-50/40"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                <Link2 className="size-4.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-navy-900">
                  Folder Google Drive
                </span>
                {siswa?.catatanDrive ? (
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                    {siswa.catatanDrive}
                  </span>
                ) : null}
                <span className="mt-1 block break-all text-xs text-langit-600">
                  {tautan}
                </span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-slate-400" />
            </a>
          ) : (
            <KeadaanKosong
              ikon={Link2}
              judul="Belum ada tautan"
              deskripsi="Panitia belum membagikan folder drive untuk Anda. Silakan periksa kembali secara berkala."
            />
          )}
        </CardBody>
      </Card>
    </>
  );
}
