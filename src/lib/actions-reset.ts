"use server";

import { revalidatePath } from "next/cache";

import { wajibSesi } from "@/lib/get-session";
import {
  daftarPercobaan,
  hapusSemuaPercobaan,
} from "@/lib/pengerjaan/repositori";
import { resetPsikotesPeserta } from "@/lib/psikotes/catatan";
import { resetIqPeserta } from "@/lib/tes-iq/catatan";
import { cariSiswa } from "@/lib/siswa/repositori";

/**
 * Pengosongan pengerjaan peserta (khusus admin).
 *
 * Dipakai ketika peserta perlu diberi kesempatan mengulang: sesi telanjur
 * dimulai lalu kehabisan waktu karena listrik padam, perangkatnya bermasalah,
 * dan sebagainya. Tanpa jalan ini, satu kecelakaan teknis mengunci peserta
 * selamanya — karena setiap sesi hanya boleh dikerjakan satu kali.
 *
 * Peran admin diverifikasi ulang pada setiap aksi, jadi tidak ada satu pun
 * jalur di sini yang dapat dipanggil peserta. Portal siswa tidak mengimpor
 * modul ini.
 */

export type HasilReset =
  | { ok: true; pesan: string }
  | { ok: false; masalah: string };

async function pastikanSiswa(id: string) {
  await wajibSesi("admin");
  const siswa = await cariSiswa(id);
  return siswa;
}

function segarkan(id: string) {
  revalidatePath(`/admin/siswa/${id}`);
  revalidatePath("/admin/tryout");
  revalidatePath("/admin/psikotes");
  revalidatePath("/admin/tes-iq");
  revalidatePath("/admin");
  // Portal peserta ikut disegarkan supaya sesinya benar-benar terbuka kembali
  // tanpa menunggu cache halaman kedaluwarsa.
  revalidatePath("/siswa", "layout");
}

/**
 * Menghapus seluruh riwayat pengerjaan try out akademik satu peserta.
 *
 * Yang dihapus hanya catatan pengerjaannya — akun, data diri, dan berkas
 * unggahan peserta tidak tersentuh.
 */
export async function resetTryOutAksi(id: string): Promise<HasilReset> {
  const siswa = await pastikanSiswa(id);
  if (!siswa) return { ok: false, masalah: "Peserta tidak ditemukan." };

  const sebelumnya = await daftarPercobaan(id);
  if (sebelumnya.length === 0) {
    return { ok: true, pesan: `${siswa.nama} memang belum punya riwayat try out.` };
  }

  const hasil = await hapusSemuaPercobaan(id);
  if (!hasil.ok) return { ok: false, masalah: hasil.pesan };

  segarkan(id);
  return {
    ok: true,
    pesan: `${sebelumnya.length} riwayat try out ${siswa.nama} telah dikosongkan.`,
  };
}

/** Mengosongkan seluruh pengerjaan psikotes satu peserta. */
export async function resetPsikotesAksi(id: string): Promise<HasilReset> {
  const siswa = await pastikanSiswa(id);
  if (!siswa) return { ok: false, masalah: "Peserta tidak ditemukan." };

  const hasil = await resetPsikotesPeserta(id);
  if (!hasil.ok) return { ok: false, masalah: hasil.pesan };

  if (hasil.jumlah === 0) {
    return { ok: true, pesan: `${siswa.nama} memang belum mengerjakan psikotes.` };
  }

  segarkan(id);
  return {
    ok: true,
    pesan: `${hasil.jumlah} sesi psikotes ${siswa.nama} telah dikosongkan.`,
  };
}

/**
 * Mengosongkan seluruh pengerjaan Tes IQ satu peserta.
 *
 * Berbeda dengan tombol "Ulangi latihan" milik peserta, yang hanya memulai
 * percobaan baru, aksi ini juga menghapus cacah percobaannya sehingga catatan
 * peserta benar-benar bersih.
 */
export async function resetTesIqAksi(id: string): Promise<HasilReset> {
  const siswa = await pastikanSiswa(id);
  if (!siswa) return { ok: false, masalah: "Peserta tidak ditemukan." };

  const hasil = await resetIqPeserta(id);
  if (!hasil.ok) return { ok: false, masalah: hasil.pesan };

  if (hasil.jumlah === 0) {
    return { ok: true, pesan: `${siswa.nama} memang belum mengerjakan Tes IQ.` };
  }

  segarkan(id);
  return {
    ok: true,
    pesan: `${hasil.jumlah} paket Tes IQ ${siswa.nama} telah dikosongkan.`,
  };
}
