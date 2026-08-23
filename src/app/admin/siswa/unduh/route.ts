import { NextResponse } from "next/server";

import { getSession } from "@/lib/get-session";
import { zipBanyakPeserta } from "@/lib/pendaftaran/ekspor";
import { bacaSemuaPendaftaran } from "@/lib/pendaftaran/repositori";
import { daftarSiswa } from "@/lib/siswa/repositori";
import { balasanBerkas } from "@/lib/unduhan";

/**
 * Mengunduh berkas seluruh siswa dalam satu arsip ZIP, satu folder per siswa.
 * Khusus admin.
 *
 * Siswa yang belum menyimpan apa pun dilewati agar arsipnya tidak dipenuhi
 * folder kosong.
 *
 * Catatan kapasitas: seluruh arsip disusun di memori sebelum dikirim. Untuk
 * peserta yang sangat banyak, batasnya adalah memori dan durasi fungsi — bukan
 * ukuran balasan, yang sudah diatasi dengan pengiriman beraliran. Bila cohort
 * membesar, unduhan per peserta lebih aman daripada unduhan sekaligus.
 */

export const maxDuration = 60;
export async function GET() {
  const sesi = await getSession();
  if (sesi?.role !== "admin") {
    return new NextResponse("Tidak diizinkan", { status: 403 });
  }

  const semua = await daftarSiswa();
  const pendaftaran = await bacaSemuaPendaftaran(semua.map((item) => item.id));

  const adaIsi = semua.filter((siswa) => {
    const data = pendaftaran.get(siswa.id);
    return Boolean(
      data && (data.diperbaruiPada > 0 || Object.keys(data.dokumen).length > 0),
    );
  });

  if (adaIsi.length === 0) {
    return new NextResponse("Belum ada siswa yang mengisi data dirinya.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const arsip = await zipBanyakPeserta(adaIsi);

  return balasanBerkas(new Uint8Array(arsip.isi), {
    tipe: "application/zip",
    namaBerkas: arsip.nama,
    paksaUnduh: true,
  });
}
