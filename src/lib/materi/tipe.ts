import { MAKS_UNGGAHAN } from "@/lib/batas-unggah";

/**
 * Tipe materi belajar.
 *
 * Berkas ini bebas dependensi Node agar dapat diimpor Client Component maupun
 * kode server.
 *
 * Mata pelajarannya sama dengan empat mata uji seleksi, tetapi daftarnya
 * sengaja **berdiri sendiri** di sini dan tidak mengimpor `SUBJECTS` milik bank
 * soal. Keduanya kebetulan sama, bukan terikat: mengubah mata uji try out tidak
 * boleh diam-diam mengubah pengelompokan materi, dan sebaliknya.
 */

export const MATA_PELAJARAN = [
  "IPA",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Matematika",
] as const;

export type MataPelajaran = (typeof MATA_PELAJARAN)[number];

export function isMataPelajaran(nilai: string): nilai is MataPelajaran {
  return (MATA_PELAJARAN as readonly string[]).includes(nilai);
}

/**
 * Ukuran maksimal satu berkas materi.
 *
 * Mengikuti batas unggahan aplikasi, yang ditentukan batas badan permintaan
 * hosting serverless — lihat `src/lib/batas-unggah.ts`.
 */
export const MAKS_BYTE_MATERI = MAKS_UNGGAHAN;

export type Materi = {
  id: string;
  mataPelajaran: MataPelajaran;
  judul: string;
  /** Ringkasan isi materi, tampil pada daftar siswa. */
  deskripsi: string;
  /** Nama berkas asli saat diunggah, hanya untuk catatan admin. */
  namaAsli: string;
  ukuran: number;
  /** Materi nonaktif tetap tersimpan tetapi tidak terlihat siswa. */
  aktif: boolean;
  diunggahPada: number;
};

export function labelUkuranMateri(byte: number) {
  if (byte >= 1024 * 1024) return `${(byte / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(byte / 1024))} KB`;
}
