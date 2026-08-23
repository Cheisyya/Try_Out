import { timingSafeEqual } from "node:crypto";

/**
 * Akun administrator.
 *
 * Kredensial tidak pernah ikut terbundel ke sisi klien dan tidak pernah
 * ditampilkan pada antarmuka mana pun — termasuk halaman masuk dan dashboard.
 * Nilainya dapat ditimpa lewat ADMIN_EMAIL + ADMIN_PASSWORD.
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

/**
 * Kredensial bawaan administrator — **hanya untuk pengembangan lokal**.
 *
 * Nilainya tertulis di dalam kode sumber, jadi siapa pun yang membaca repositori
 * mengetahuinya. Karena itu pada `NODE_ENV=production` kredensial ini sengaja
 * tidak berlaku sama sekali: bila ADMIN_EMAIL dan ADMIN_PASSWORD belum diisi,
 * panel admin tidak dapat dimasuki siapa pun, bukan dimasuki dengan password
 * yang sudah menjadi rahasia umum.
 */
const BAWAAN = {
  identitas: "admin@shc.id",
  password: "adminkeren",
  nama: "admin shc",
};

/** Panjang minimal password admin di produksi. */
const PANJANG_MINIMAL_SANDI = 10;

export type AkunAdmin = {
  identitas: string;
  nama: string;
};

type KonfigAdmin = { identitas: string; password: string; nama: string };

function konfigurasi(): KonfigAdmin | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const nama = process.env.ADMIN_NAMA?.trim() || BAWAAN.nama;

  if (email && password) {
    // Password sependek beberapa karakter tidak layak menjaga panel yang dapat
    // membaca seluruh data peserta.
    if (
      process.env.NODE_ENV === "production" &&
      password.length < PANJANG_MINIMAL_SANDI
    ) {
      console.error(
        `ADMIN_PASSWORD terlalu pendek (minimal ${PANJANG_MINIMAL_SANDI} karakter). Akun admin dinonaktifkan.`,
      );
      return null;
    }
    return { identitas: email, password, nama };
  }

  if (process.env.NODE_ENV === "production") return null;
  return { ...BAWAAN, nama };
}

/** Dipakai halaman diagnosa agar kesalahan konfigurasi terlihat lebih awal. */
export function akunAdminSiap() {
  return konfigurasi() !== null;
}

/** Akun admin aktif tanpa membocorkan passwordnya. */
export function akunAdmin(): AkunAdmin | null {
  const konfig = konfigurasi();
  if (!konfig) return null;
  return { identitas: konfig.identitas, nama: konfig.nama };
}

function samaWaktuTetap(a: string, b: string) {
  const kiri = Buffer.from(a, "utf8");
  const kanan = Buffer.from(b, "utf8");
  if (kiri.length !== kanan.length) {
    // Tetap jalankan perbandingan agar lama proses tidak membocorkan panjang.
    timingSafeEqual(kiri, kiri);
    return false;
  }
  return timingSafeEqual(kiri, kanan);
}

export type HasilAdmin =
  | { ok: true; akun: AkunAdmin }
  | { ok: false; alasan: "kredensial" | "belum-dikonfigurasi" };

export function periksaKredensialAdmin(
  identitas: string,
  password: string,
): HasilAdmin {
  const konfig = konfigurasi();
  if (!konfig) {
    // Perbandingan tetap dijalankan agar lama proses tidak membocorkan bahwa
    // akun admin memang belum dikonfigurasi.
    samaWaktuTetap(password, password);
    return { ok: false, alasan: "belum-dikonfigurasi" };
  }

  const emailCocok = samaWaktuTetap(
    identitas.trim().toLowerCase(),
    konfig.identitas.toLowerCase(),
  );
  const sandiCocok = samaWaktuTetap(password, konfig.password);
  if (!emailCocok || !sandiCocok) return { ok: false, alasan: "kredensial" };

  return {
    ok: true,
    akun: { identitas: konfig.identitas, nama: konfig.nama },
  };
}

/** Dipakai `wajibSesi` untuk memastikan sesi admin masih menunjuk akun yang sah. */
export function identitasAdminSah(identitas: string) {
  const konfig = konfigurasi();
  if (!konfig) return false;
  return identitas.trim().toLowerCase() === konfig.identitas.toLowerCase();
}
