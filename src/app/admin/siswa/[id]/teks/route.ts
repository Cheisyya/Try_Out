import { NextResponse } from "next/server";

import { getSession } from "@/lib/get-session";
import {
  namaArsipPeserta,
  susunTeksPendaftaran,
} from "@/lib/pendaftaran/ekspor";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";
import { cariSiswa } from "@/lib/siswa/repositori";

/** Mengunduh isian data diri seorang siswa sebagai berkas teks. Khusus admin. */
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

  const data = await bacaPendaftaran(siswa.id);
  const nama = `${namaArsipPeserta(siswa, data)}.txt`;

  return new NextResponse(susunTeksPendaftaran(siswa, data), {
    headers: {
      // BOM tidak dipakai; UTF-8 dinyatakan lewat charset agar Notepad modern
      // dan editor lain sama-sama membacanya dengan benar.
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(nama)}`,
      "Cache-Control": "no-store",
    },
  });
}
