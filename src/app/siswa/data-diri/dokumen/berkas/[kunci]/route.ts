import { NextResponse } from "next/server";

import { getSession } from "@/lib/get-session";
import { pengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";
import {
  cariDokumen,
  namaBerkasOtomatis,
  type FormatBerkas,
} from "@/lib/pendaftaran/dokumen";
import {
  bacaBerkasDokumen,
  bacaPendaftaran,
} from "@/lib/pendaftaran/repositori";

/**
 * Pratinjau berkas unggahan milik peserta yang sedang masuk.
 *
 * Berkas disimpan di luar `public/`, sehingga satu-satunya jalan membacanya
 * adalah lewat route ini — dan identitas pemiliknya selalu diambil dari sesi,
 * bukan dari parameter permintaan. Peserta karenanya tidak dapat membaca berkas
 * peserta lain meskipun mengetahui id mereka.
 */

const TIPE_ISI: Record<FormatBerkas, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  png: "image/png",
};

function tipeIsi(ekstensi: string) {
  if (ekstensi === "pdf") return TIPE_ISI.pdf;
  if (ekstensi === "png") return TIPE_ISI.png;
  if (ekstensi === "jpg" || ekstensi === "jpeg") return TIPE_ISI.jpg;
  return "application/octet-stream";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kunci: string }> },
) {
  const sesi = await getSession();
  if (sesi?.role !== "siswa") {
    return new NextResponse("Tidak diizinkan", { status: 403 });
  }

  // Seksi Data Diri dapat dimatikan admin; pratinjaunya ikut tertutup supaya
  // alamat berkas yang sempat tersimpan tidak menjadi celah.
  const pengaturan = await pengaturanAplikasi();
  if (!pengaturan.dataDiriAktif) {
    return new NextResponse("Seksi ini sedang ditutup", { status: 403 });
  }

  const { kunci } = await params;
  const spek = cariDokumen(kunci);
  if (!spek) return new NextResponse("Dokumen tidak dikenal", { status: 404 });

  const data = await bacaPendaftaran(sesi.identitas);
  const catatan = data.dokumen[spek.kunci];
  if (!catatan) return new NextResponse("Berkas belum diunggah", { status: 404 });

  const isi = await bacaBerkasDokumen(sesi.identitas, catatan);
  if (!isi) return new NextResponse("Berkas tidak ditemukan", { status: 404 });

  const nama = namaBerkasOtomatis(
    spek,
    data.biodata.namaLengkap || sesi.nama,
    catatan.ekstensi,
  );

  return new NextResponse(new Uint8Array(isi), {
    headers: {
      "Content-Type": tipeIsi(catatan.ekstensi),
      // `inline` agar PDF dan gambar langsung tampil pada tab baru.
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(nama)}`,
      "Cache-Control": "private, no-store",
      // Berkas milik peserta tidak pernah aman dirender sebagai HTML.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
