import { NextResponse } from "next/server";

import { getSession } from "@/lib/get-session";
import { catatPelanggaranPeserta } from "@/lib/pengerjaan/layanan";
import { cariSiswa } from "@/lib/siswa/repositori";

/**
 * Titik masuk pencatatan pelanggaran pengawasan ujian.
 *
 * Dipakai lewat `fetch(..., { keepalive: true })` sehingga catatan tetap
 * terkirim saat peserta menutup atau meninggalkan halaman — hal yang tidak
 * dapat dijamin oleh Server Action.
 *
 * Identitas peserta selalu diambil dari cookie sesi; badan permintaan hanya
 * boleh berisi jenis pelanggaran dari daftar tertutup. Endpoint ini tidak
 * pernah mengubah jawaban maupun nilai.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATAS_BADAN = 2048;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "siswa") {
    return NextResponse.json({ dicatat: false }, { status: 401 });
  }

  const siswa = await cariSiswa(session.identitas);
  if (!siswa || siswa.status !== "Aktif") {
    return NextResponse.json({ dicatat: false }, { status: 403 });
  }

  const mentah = await request.text();
  if (mentah.length > BATAS_BADAN) {
    return NextResponse.json({ dicatat: false }, { status: 413 });
  }

  let badan: { jenis?: unknown; detail?: unknown };
  try {
    badan = JSON.parse(mentah) as { jenis?: unknown; detail?: unknown };
  } catch {
    return NextResponse.json({ dicatat: false }, { status: 400 });
  }

  const hasil = await catatPelanggaranPeserta(
    { id: siswa.id, nama: siswa.nama },
    badan.jenis,
    badan.detail,
  );

  return NextResponse.json(hasil, {
    headers: { "Cache-Control": "no-store" },
  });
}
