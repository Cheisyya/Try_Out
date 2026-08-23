import { NextResponse } from "next/server";

import { getSession } from "@/lib/get-session";
import { cariDokumen, namaBerkasOtomatis } from "@/lib/pendaftaran/dokumen";
import {
  bacaBerkasDokumen,
  bacaPendaftaran,
} from "@/lib/pendaftaran/repositori";
import { cariSiswa } from "@/lib/siswa/repositori";

/** Pratinjau satu berkas unggahan siswa pada panel admin. */

function tipeIsi(ekstensi: string) {
  if (ekstensi === "pdf") return "application/pdf";
  if (ekstensi === "png") return "image/png";
  if (ekstensi === "jpg" || ekstensi === "jpeg") return "image/jpeg";
  return "application/octet-stream";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; kunci: string }> },
) {
  const sesi = await getSession();
  if (sesi?.role !== "admin") {
    return new NextResponse("Tidak diizinkan", { status: 403 });
  }

  const { id, kunci } = await params;

  const siswa = await cariSiswa(id);
  if (!siswa) return new NextResponse("Siswa tidak ditemukan", { status: 404 });

  const spek = cariDokumen(kunci);
  if (!spek) return new NextResponse("Dokumen tidak dikenal", { status: 404 });

  const data = await bacaPendaftaran(siswa.id);
  const catatan = data.dokumen[spek.kunci];
  if (!catatan) return new NextResponse("Berkas belum diunggah", { status: 404 });

  const isi = await bacaBerkasDokumen(siswa.id, catatan);
  if (!isi) return new NextResponse("Berkas tidak ditemukan", { status: 404 });

  const nama = namaBerkasOtomatis(
    spek,
    data.biodata.namaLengkap || siswa.nama,
    catatan.ekstensi,
  );

  return new NextResponse(new Uint8Array(isi), {
    headers: {
      "Content-Type": tipeIsi(catatan.ekstensi),
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(nama)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
