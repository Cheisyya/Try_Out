import { NextResponse } from "next/server";

import { bacaBiner } from "@/lib/penyimpanan";

/**
 * Menyajikan gambar pendukung soal dari lapisan penyimpanan.
 *
 * Gambar tidak dapat diletakkan di `public/` karena pada hosting serverless
 * folder itu hanya-baca. Route ini terbuka tanpa sesi — sama seperti berkas
 * statis sebelumnya — sebab gambar soal memang tampil pada halaman ujian, dan
 * namanya mengandung stempel waktu sehingga tidak dapat ditebak berurutan.
 */

const TIPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nama: string }> },
) {
  const { nama } = await params;

  const ekstensi = nama.split(".").pop()?.toLowerCase() ?? "";
  const tipe = TIPE[ekstensi];
  if (!tipe) return new NextResponse("Berkas tidak dikenal", { status: 404 });

  const isi = await bacaBiner(`gambar-soal/${nama}`);
  if (!isi) return new NextResponse("Gambar tidak ditemukan", { status: 404 });

  return new NextResponse(new Uint8Array(isi), {
    headers: {
      "Content-Type": tipe,
      // Nama berkas unik per unggahan, jadi isinya tidak pernah berubah.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      // SVG disajikan dari origin yang sama; CSP ketat menutup skrip di
      // dalamnya andai ada berkas lama yang lolos pemeriksaan.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}
