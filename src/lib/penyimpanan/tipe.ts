/**
 * Antarmuka penyimpanan aplikasi.
 *
 * Seluruh data aplikasi — konfigurasi, bank soal, data siswa, pengerjaan ujian,
 * dan berkas unggahan — disimpan lewat antarmuka ini, bukan langsung ke sistem
 * berkas. Dengan begitu aplikasi dapat berjalan di dua tempat:
 *
 * - pengembangan lokal, memakai folder `.data/` (adapter berkas);
 * - hosting serverless seperti Vercel yang sistem berkasnya hanya-baca dan
 *   sementara, memakai database Postgres (adapter postgres).
 *
 * Kunci berbentuk seperti jalur, mis. `konfigurasi/siswa.json` atau
 * `berkas-siswa/2026001/pas-foto.png`. Pemisahnya selalu garis miring, tidak
 * pernah backslash, supaya kunci yang sama berlaku di Windows maupun Linux.
 *
 * Berkas ini bebas dependensi Node agar aman diimpor dari mana saja.
 */

export type Penyimpanan = {
  /** Nama adapter, untuk pesan diagnosa. */
  readonly nama: "berkas" | "postgres";
  /** Mengembalikan null bila kunci tidak ada. */
  baca(kunci: string): Promise<Buffer | null>;
  /**
   * Membaca banyak kunci sekaligus. Kunci yang tidak ada tidak muncul pada
   * peta hasil.
   *
   * Adapter yang dapat melakukannya dalam satu perjalanan (mis. satu query SQL)
   * wajib mengisinya: panel admin membaca puluhan dokumen per halaman, dan
   * membacanya satu per satu adalah sumber utama halaman terasa lambat.
   */
  bacaBanyak?(kunci: string[]): Promise<Map<string, Buffer>>;
  tulis(kunci: string, isi: Buffer): Promise<void>;
  hapus(kunci: string): Promise<void>;
  /** Menghapus seluruh kunci yang diawali `awalan`. */
  hapusAwalan(awalan: string): Promise<void>;
  /** Seluruh kunci yang diawali `awalan`, terurut. */
  daftarKunci(awalan: string): Promise<string[]>;
};

/** Kesalahan penyimpanan yang layak ditampilkan kepada pengguna. */
export class GagalMenyimpan extends Error {
  constructor(pesan: string, opsi?: { cause?: unknown }) {
    super(pesan, opsi);
    this.name = "GagalMenyimpan";
  }
}

/**
 * Membersihkan kunci agar tidak dapat keluar dari ruang penyimpanan.
 *
 * Kunci selalu berasal dari kode aplikasi, tetapi sebagiannya menyisipkan id
 * peserta atau nama berkas; pembersihan ini menutup kemungkinan `../` maupun
 * pemisah jalur Windows menyelinap masuk.
 */
export function bersihkanKunci(kunci: string): string {
  return kunci
    .replace(/\\/g, "/")
    .split("/")
    .map((bagian) => bagian.replace(/[^a-zA-Z0-9._-]/g, "_"))
    .filter((bagian) => bagian !== "" && bagian !== "." && bagian !== "..")
    .join("/");
}
