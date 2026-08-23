/**
 * Status akun dan status kelulusan siswa.
 *
 * Dipisahkan dari `repositori.ts` karena berkas itu menyentuh lapisan
 * penyimpanan dan karenanya tidak dapat diimpor Client Component. Berkas ini
 * sengaja bebas dependensi Node agar dapat dipakai bersama oleh form di
 * peramban maupun validasi di server.
 */

export type StatusSiswa = "Aktif" | "Nonaktif";

/** Hasil seleksi SMA Taruna Nusantara yang dilacak panitia. */
export const STATUS_KELULUSAN = [
  "Sedang Proses",
  "Lulus",
  "Tidak Lulus",
] as const;

export type StatusKelulusan = (typeof STATUS_KELULUSAN)[number];

/** Status awal setiap siswa sebelum hasil seleksi diumumkan. */
export const KELULUSAN_AWAL: StatusKelulusan = "Sedang Proses";

/**
 * Nama status yang pernah dipakai versi sebelumnya.
 *
 * Data siswa yang sudah tersimpan masih memuat "Belum Diproses"; pemetaan ini
 * membuatnya terbaca sebagai "Sedang Proses" tanpa perlu migrasi berkas.
 */
const ALIAS: Record<string, StatusKelulusan> = {
  "Belum Diproses": "Sedang Proses",
  Diproses: "Sedang Proses",
};

export function isStatusKelulusan(nilai: string): nilai is StatusKelulusan {
  return (STATUS_KELULUSAN as readonly string[]).includes(nilai);
}

/** Menormalkan nilai apa pun — termasuk nama status lama — ke status yang sah. */
export function keStatusKelulusan(nilai: unknown): StatusKelulusan {
  const teks = typeof nilai === "string" ? nilai.trim() : "";
  if (isStatusKelulusan(teks)) return teks;
  return ALIAS[teks] ?? KELULUSAN_AWAL;
}

/**
 * Siswa dengan status ini sudah selesai diproses panitia, sehingga pindah dari
 * daftar Siswa ke halaman Alumni.
 */
export function isAlumni(status: StatusKelulusan) {
  return status === "Lulus" || status === "Tidak Lulus";
}

/** Warna lencana per status agar terbaca sekilas pada tabel. */
export const NADA_KELULUSAN: Record<
  StatusKelulusan,
  "hijau" | "merah" | "gold"
> = {
  Lulus: "hijau",
  "Tidak Lulus": "merah",
  "Sedang Proses": "gold",
};
