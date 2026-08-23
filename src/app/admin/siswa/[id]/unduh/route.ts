import { NextResponse } from "next/server";

import { getSession } from "@/lib/get-session";
import { zipPeserta } from "@/lib/pendaftaran/ekspor";
import { cariSiswa } from "@/lib/siswa/repositori";
import { balasanBerkas } from "@/lib/unduhan";

/**
 * Mengunduh seluruh berkas seorang siswa sebagai satu arsip ZIP: berkas teks
 * berisi seluruh isian, ditambah setiap dokumen unggahan dengan nama yang sudah
 * sesuai ketentuan panitia. Khusus admin.
 */

/** Menyusun arsip belasan dokumen dapat memakan waktu lebih dari batas bawaan. */
export const maxDuration = 60;
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const sesi = await getSession();
  if (sesi?.role !== "admin") {
    return new NextResponse("Tidak diizinkan", { status: 403 });
  }

  const { id } = await params;
  const siswa = await cariSiswa(id);
  if (!siswa) return new NextResponse("Siswa tidak ditemukan", { status: 404 });

  const arsip = await zipPeserta(siswa);

  return balasanBerkas(new Uint8Array(arsip.isi), {
    tipe: "application/zip",
    namaBerkas: arsip.nama,
    paksaUnduh: true,
  });
}
