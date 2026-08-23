"use server";

import { revalidatePath } from "next/cache";

import { wajibSesi } from "@/lib/get-session";
import { hapusPendaftaran } from "@/lib/pendaftaran/repositori";
import { hapusBerkasPeserta } from "@/lib/pengerjaan/repositori";
import { hapusBerkasPsikotes } from "@/lib/psikotes/catatan";
import { hapusBerkasIq } from "@/lib/tes-iq/catatan";
import {
  buatSiswa,
  hapusSiswa,
  perbaruiSiswa,
  setStatusKelulusan,
  setStatusSiswa,
  setTautanDrive,
  type MasukanSiswa,
  type StatusSiswa,
} from "@/lib/siswa/repositori";
import { isStatusKelulusan, keStatusKelulusan } from "@/lib/siswa/status";

/**
 * Server Action pengelolaan siswa (khusus admin).
 *
 * Seluruh aksi memverifikasi peran admin terlebih dahulu, dan seluruh validasi
 * isian dilakukan di repositori sehingga tidak dapat dilewati dari sisi klien.
 */

export type HasilAksiSiswa =
  | { ok: true }
  | { ok: false; masalah: string[] };

function bacaMasukan(formData: FormData): MasukanSiswa {
  const teks = (nama: string, maks = 120) =>
    String(formData.get(nama) ?? "").trim().slice(0, maks);


  return {
    noCasis: teks("noCasis", 30),
    username: teks("username"),
    nama: teks("nama"),
    email: teks("email"),
    asalSekolah: teks("asalSekolah"),
    kelas: teks("kelas"),
    status: teks("status") === "Nonaktif" ? "Nonaktif" : "Aktif",
    statusKelulusan: keStatusKelulusan(teks("statusKelulusan")),
    tautanDrive: teks("tautanDrive", 500),
    catatanDrive: teks("catatanDrive", 300),
    password: String(formData.get("password") ?? "").slice(0, 64),
  };
}

export async function buatSiswaAksi(
  formData: FormData,
): Promise<HasilAksiSiswa> {
  await wajibSesi("admin");
  const hasil = await buatSiswa(bacaMasukan(formData));
  if (hasil.ok) revalidatePath("/admin", "layout");
  return hasil.ok ? { ok: true } : { ok: false, masalah: hasil.masalah };
}

export async function perbaruiSiswaAksi(
  id: string,
  formData: FormData,
): Promise<HasilAksiSiswa> {
  await wajibSesi("admin");
  const hasil = await perbaruiSiswa(id, bacaMasukan(formData));
  if (hasil.ok) {
    revalidatePath("/admin", "layout");
    revalidatePath("/siswa", "layout");
  }
  return hasil.ok ? { ok: true } : { ok: false, masalah: hasil.masalah };
}

/**
 * Menghapus peserta beserta seluruh riwayat pengerjaannya.
 * Tindakan ini tidak dapat dibatalkan.
 */
export async function hapusSiswaAksi(id: string): Promise<HasilAksiSiswa> {
  await wajibSesi("admin");

  const hasil = await hapusSiswa(id);
  if (!hasil.ok) return { ok: false, masalah: hasil.masalah };

  // Berkas pengerjaan ikut dihapus agar tidak menyisakan data yatim yang masih
  // terbaca panel Hasil Try Out — begitu pula catatan psikotes dan Tes IQ, yang
  // punya panelnya sendiri. Berkas pendaftaran siswa, termasuk dokumen pribadi
  // yang diunggah peserta, juga tidak boleh tertinggal di disk.
  await hapusBerkasPeserta(id);
  await hapusBerkasPsikotes(id);
  await hapusBerkasIq(id);
  await hapusPendaftaran(id);

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function ubahStatusSiswaAksi(id: string, status: StatusSiswa) {
  await wajibSesi("admin");
  const hasil = await setStatusSiswa(id, status);
  revalidatePath("/admin", "layout");
  return hasil.ok
    ? { ok: true as const }
    : { ok: false as const, masalah: hasil.masalah };
}

/** Menandai hasil seleksi SMA Taruna Nusantara seorang siswa. */
export async function ubahStatusKelulusanAksi(
  id: string,
  status: string,
): Promise<HasilAksiSiswa> {
  await wajibSesi("admin");

  if (!isStatusKelulusan(status)) {
    return { ok: false, masalah: ["Status kelulusan tidak dikenal."] };
  }

  const hasil = await setStatusKelulusan(id, status);
  if (hasil.ok) revalidatePath("/admin", "layout");
  return hasil.ok ? { ok: true } : { ok: false, masalah: hasil.masalah };
}

/** Menyimpan tautan Google Drive milik seorang siswa. */
export async function simpanTautanDriveAksi(
  id: string,
  formData: FormData,
): Promise<HasilAksiSiswa> {
  await wajibSesi("admin");

  const hasil = await setTautanDrive(
    id,
    String(formData.get("tautanDrive") ?? "").trim().slice(0, 500),
    String(formData.get("catatanDrive") ?? "").trim().slice(0, 300),
  );

  if (hasil.ok) {
    revalidatePath("/admin", "layout");
    // Portal siswa menampilkan tautan ini pada menu Data Diri Siswa.
    revalidatePath("/siswa", "layout");
  }
  return hasil.ok ? { ok: true } : { ok: false, masalah: hasil.masalah };
}
