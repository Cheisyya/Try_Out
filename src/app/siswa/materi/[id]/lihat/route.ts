import { NextResponse } from "next/server";

import { getSession } from "@/lib/get-session";
import { pengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";
import { bacaBerkasMateri, cariMateri } from "@/lib/materi/repositori";

/**
 * Isi PDF sebuah materi, khusus untuk disematkan pada pembaca di halaman.
 *
 * Berkas materi disimpan di luar `public/` sehingga route inilah satu-satunya
 * pintunya, dan pintu itu selalu memeriksa sesi siswa serta sakelar fitur lebih
 * dahulu. Tidak ada tautan berkas yang dapat disalin atau dibagikan.
 *
 * `Content-Disposition: inline` beserta `#toolbar=0` pada pembaca meniadakan
 * tombol unduh bawaan peramban. Ini menutup jalur simpan yang biasa — bukan
 * jaminan mutlak, karena isi yang dapat dibaca pada dasarnya dapat disalin.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const sesi = await getSession();
  if (sesi?.role !== "siswa") {
    return new NextResponse("Tidak diizinkan", { status: 403 });
  }

  const pengaturan = await pengaturanAplikasi();
  if (!pengaturan.materiAktif) {
    return new NextResponse("Materi sedang tidak tersedia", { status: 403 });
  }

  const { id } = await params;
  const materi = await cariMateri(id);
  if (!materi || !materi.aktif) {
    return new NextResponse("Materi tidak ditemukan", { status: 404 });
  }

  const isi = await bacaBerkasMateri(materi.id);
  if (!isi) return new NextResponse("Berkas materi hilang", { status: 404 });

  return new NextResponse(new Uint8Array(isi), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      // Materi tidak boleh mengendap pada cache bersama maupun disk peramban.
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
