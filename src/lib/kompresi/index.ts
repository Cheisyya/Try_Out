/**
 * Pengecilan berkas unggahan di peramban.
 *
 * Titik masuk tunggal yang memilih cara sesuai jenis berkas: gambar dikompres
 * ulang sebagai JPEG, PDF dirender ulang menjadi PDF berisi gambar. Keduanya
 * hanya berjalan ketika berkas melebihi batas — berkas yang sudah cukup kecil
 * dikirim apa adanya sehingga kualitas aslinya tidak pernah dikorbankan
 * percuma.
 *
 * Hanya boleh diimpor dari Client Component.
 */

import { kompresGambar, type HasilKompresi } from "@/lib/kompresi/gambar";
import { kompresPdf } from "@/lib/kompresi/pdf";

export type { HasilKompresi };

/**
 * Ukuran unggahan terbesar yang masih mau dicoba dikecilkan.
 *
 * Di atas ini prosesnya lama sekali dan hasilnya hampir pasti tetap di atas
 * batas, jadi peserta lebih cepat ditolak dengan pesan yang jelas.
 */
export const MAKS_SEBELUM_KOMPRESI = 25 * 1024 * 1024;

export function bisaDikompres(ekstensi: string) {
  return ["jpg", "jpeg", "png", "webp", "pdf"].includes(ekstensi.toLowerCase());
}

/**
 * Mengecilkan berkas sampai di bawah `maksByte` bila perlu.
 *
 * Melempar `Error` berisi kalimat siap tampil ketika berkasnya tidak dapat
 * diproses. Hasil yang masih di atas batas tetap dikembalikan — pemanggil yang
 * memeriksa ukurannya, supaya pesannya dapat menyebut angka sebelum dan
 * sesudah.
 */
export async function kompresBerkas(
  berkas: File,
  maksByte: number,
): Promise<HasilKompresi> {
  if (berkas.size <= maksByte) {
    return { berkas, ukuranAwal: berkas.size, dikompres: false };
  }

  if (berkas.size > MAKS_SEBELUM_KOMPRESI) {
    throw new Error(
      `Berkas ${(berkas.size / (1024 * 1024)).toFixed(1)} MB terlalu besar untuk dikecilkan otomatis. Kecilkan berkasnya lebih dulu, lalu unggah kembali.`,
    );
  }

  const jenis = berkas.type.toLowerCase();
  const ekstensi = berkas.name.split(".").pop()?.toLowerCase() ?? "";

  if (jenis === "application/pdf" || ekstensi === "pdf") {
    return kompresPdf(berkas, maksByte);
  }
  if (jenis.startsWith("image/") || bisaDikompres(ekstensi)) {
    return kompresGambar(berkas, maksByte);
  }

  throw new Error(
    "Jenis berkas ini tidak dapat dikecilkan otomatis. Kecilkan berkasnya lebih dulu, lalu unggah kembali.",
  );
}
