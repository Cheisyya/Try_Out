/**
 * Skema Tes IQ latihan.
 *
 * Modul ini sengaja berdiri sendiri dari bank soal try out: soalnya tidak
 * dinilai, tidak diperingkat, dan tidak menghasilkan angka IQ — hanya
 * benar/salah beserta pembahasannya. Karena itu ia tidak memakai skema
 * `src/lib/bank-soal`, yang setiap butirnya terikat paket, sesi, dan mata uji
 * seleksi.
 *
 * Berkas ini bebas dependensi Node agar aman diimpor dari Client Component.
 */

export const KATEGORI_IQ = [
  "Verbal",
  "Numerik",
  "Logika",
  "Spasial",
] as const;

export type KategoriIq = (typeof KATEGORI_IQ)[number];

/** Pilihan jawaban dibatasi A–D, mengikuti kebiasaan soal di aplikasi ini. */
export const HURUF_IQ = ["A", "B", "C", "D"] as const;
export type HurufIq = (typeof HURUF_IQ)[number];

export type SoalIq = {
  nomor: number;
  kategori: KategoriIq;
  pertanyaan: string;
  /**
   * Deret, pola, atau matriks yang perlu tampil rata dengan lebar huruf tetap.
   * Dipisahkan dari `pertanyaan` supaya spasinya tidak dirapikan browser.
   */
  pola?: string[];
  opsi: Record<HurufIq, string>;
  kunci: HurufIq;
  pembahasan: string;
  /**
   * Butir yang dinonaktifkan admin tetap tersimpan tetapi tidak ikut diujikan.
   * Kosong berarti aktif — bank bawaan yang terbundel tidak perlu menuliskannya.
   */
  aktif?: boolean;
};

export type PaketIq = {
  id: string;
  nomor: number;
  nama: string;
  tingkat: string;
  deskripsi: string;
  /**
   * Batas waktu pengerjaan satu paket, dalam menit.
   *
   * Sebelumnya latihan ini tidak berbatas waktu. Batas ditambahkan agar
   * peserta terbiasa membagi waktu seperti pada tes yang sesungguhnya; yang
   * mengikat tetap pewaktu di server, bukan hitungan di layar.
   */
  durasiMenit: number;
  /** Paket yang dimatikan admin tidak muncul pada portal peserta. */
  aktif?: boolean;
  soal: SoalIq[];
};

/** true bila butir belum pernah dinonaktifkan admin. */
export function butirIqAktif(butir: { aktif?: boolean }): boolean {
  return butir.aktif !== false;
}

/** Soal yang benar-benar diujikan pada satu paket. */
export function soalDiujikan(paket: PaketIq): SoalIq[] {
  return paket.soal.filter(butirIqAktif);
}

/** Paket yang tampil di portal peserta: aktif dan masih punya soal. */
export function paketDiujikan(paket: PaketIq): boolean {
  return paket.aktif !== false && soalDiujikan(paket).length > 0;
}

/**
 * Soal seperti yang dikirim ke peserta: tanpa kunci dan tanpa pembahasan.
 *
 * Sama seperti soal try out, kunci jawaban tidak pernah ikut ke browser sebelum
 * peserta menekan "Selesai" — meskipun ini hanya latihan, membiarkan kuncinya
 * terbaca di kode sumber halaman membuat latihannya kehilangan gunanya.
 */
export type SoalIqLatihan = Omit<SoalIq, "kunci" | "pembahasan" | "aktif">;

/** Koreksi satu butir, dikirim balik server setelah latihan dikumpulkan. */
export type KoreksiIq = {
  nomor: number;
  kunci: HurufIq;
  pembahasan: string;
  jawaban: HurufIq | null;
  benar: boolean;
};

/**
 * Hasil satu sesi latihan.
 *
 * Sengaja tidak memuat skor IQ, nilai, maupun peringkat — hanya cacah benar,
 * salah, dan kosong.
 */
export type HasilLatihanIq = {
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  butir: KoreksiIq[];
  /** Cacah benar per kategori, supaya terlihat bagian mana yang lemah. */
  perKategori: { kategori: KategoriIq; benar: number; jumlah: number }[];
};

export function isHurufIq(nilai: unknown): nilai is HurufIq {
  return HURUF_IQ.includes(nilai as HurufIq);
}

/** Membuang kunci dan pembahasan sebelum soal dikirim ke peserta. */
export function keSoalLatihan(soal: SoalIq): SoalIqLatihan {
  const { kunci, pembahasan, aktif, ...sisa } = soal;
  void kunci;
  void pembahasan;
  void aktif;
  return sisa;
}

/** Cacah soal per kategori, dipakai kartu ringkasan paket. */
export function sebaranKategori(paket: PaketIq): { kategori: KategoriIq; jumlah: number }[] {
  const soal = soalDiujikan(paket);
  return KATEGORI_IQ.map((kategori) => ({
    kategori,
    jumlah: soal.filter((butir) => butir.kategori === kategori).length,
  })).filter((baris) => baris.jumlah > 0);
}
