import type { SesiId, SesiKonfig } from "@/lib/paket-tryout";
import type { HurufOpsi, Subject } from "@/lib/bank-soal/skema";

/**
 * Model penyimpanan pengerjaan ujian.
 *
 * Seluruh data pada berkas ini disimpan di sisi server. Peserta tidak pernah
 * memegang jawaban, kunci, maupun nilai dalam bentuk yang dapat disunting:
 * identitas peserta diambil dari sesi login, dan percobaan yang sedang berjalan
 * dicari berdasarkan identitas tersebut.
 */

export type StatusPercobaan = "berlangsung" | "selesai";

/** Satu jawaban peserta, terikat pada siswa, paket, sesi, mata uji, dan soal. */
export type JawabanTersimpan = {
  question_id: string;
  subject: Subject;
  question_order: number;
  answer: HurufOpsi;
  updated_at: number;
};

/** Hasil satu mata uji setelah dikumpulkan. Disusun di server. */
export type HasilMataUji = {
  subject: Subject;
  jumlah_soal: number;
  benar: number;
  salah: number;
  kosong: number;
  nilai: number;
  submitted_at: number;
  /** true bila pengumpulan dilakukan sistem karena waktu habis. */
  otomatis: boolean;
};

/* ------------------------------- Pengawasan ------------------------------- */

/**
 * Jenis pelanggaran yang dicatat pengawas sisi peramban. Daftar ini tertutup:
 * server menolak jenis di luar daftar sehingga catatan tidak dapat diisi
 * sembarang teks dari klien.
 */
export const JENIS_PELANGGARAN = [
  "keluar-fullscreen",
  "pindah-tab",
  "halaman-tersembunyi",
  "salin",
  "tempel",
  "potong",
  "klik-kanan",
  "pintasan-terlarang",
  "meninggalkan-halaman",
] as const;

export type JenisPelanggaran = (typeof JENIS_PELANGGARAN)[number];

export const LABEL_PELANGGARAN: Record<JenisPelanggaran, string> = {
  "keluar-fullscreen": "Keluar dari mode layar penuh",
  "pindah-tab": "Berpindah ke jendela/tab lain",
  "halaman-tersembunyi": "Halaman ujian disembunyikan",
  salin: "Percobaan menyalin teks",
  tempel: "Percobaan menempel teks",
  potong: "Percobaan memotong teks",
  "klik-kanan": "Membuka menu klik kanan",
  "pintasan-terlarang": "Menekan pintasan papan tik terlarang",
  "meninggalkan-halaman": "Mencoba menutup atau meninggalkan halaman ujian",
};

/** Batas jumlah catatan per percobaan agar berkas tidak membengkak. */
export const BATAS_PELANGGARAN = 300;

export type Pelanggaran = {
  jenis: JenisPelanggaran;
  /** Mata uji yang sedang berjalan saat pelanggaran terjadi. */
  subject: Subject | null;
  waktu: number;
  /** Keterangan singkat, mis. nama pintasan. Dibatasi panjangnya di server. */
  detail?: string;
};

export function isJenisPelanggaran(nilai: unknown): nilai is JenisPelanggaran {
  return JENIS_PELANGGARAN.includes(nilai as JenisPelanggaran);
}

export type Percobaan = {
  id: string;
  student_id: string;
  student_nama: string;
  package_id: string;
  session_id: SesiId;
  mulai: number;
  status: StatusPercobaan;
  selesai_pada?: number;
  jawaban: JawabanTersimpan[];
  hasil: HasilMataUji[];
  /** Catatan pengawasan; tidak memengaruhi nilai, hanya bahan evaluasi panitia. */
  pelanggaran?: Pelanggaran[];
};

export type BerkasPeserta = {
  student_id: string;
  percobaan: Percobaan[];
};

/* ------------------------------- Penjadwalan ------------------------------ */

export type Jadwal = {
  mulaiMataUji: number[];
  batas: number[];
  /** Indeks mata uji yang sedang berjalan; null bila seluruh sesi berakhir. */
  aktif: number | null;
  selesai: boolean;
  sisaDetik: number;
  akhirSesi: number;
  /** Mata uji yang waktunya habis tetapi belum dibukukan. */
  perluSinkron: number[];
};

export function hasilMataUji(percobaan: Percobaan, subject: Subject) {
  return percobaan.hasil.find((item) => item.subject === subject);
}

/**
 * Batas waktu tiap mata uji dihitung berantai dari waktu mulai sesi. Mata uji
 * berikutnya dimulai tepat saat mata uji sebelumnya berakhir, baik karena
 * dikumpulkan lebih awal maupun karena waktunya habis.
 */
export function hitungJadwal(
  percobaan: Percobaan,
  sesi: SesiKonfig,
  sekarang: number,
  /**
   * Waktu penutupan paket. Bila diisi, tidak ada mata uji yang batasnya boleh
   * melewati waktu ini — sehingga pengerjaan yang masih berjalan otomatis
   * dibukukan begitu jadwal paket berakhir, memakai jalur yang sama dengan
   * habisnya waktu mata uji.
   */
  batasAkhirPaket?: number | null,
): Jadwal {
  const mulaiMataUji: number[] = [];
  const batas: number[] = [];
  const perluSinkron: number[] = [];
  let penanda = percobaan.mulai;

  sesi.mataUji.forEach((mata, i) => {
    mulaiMataUji[i] = penanda;
    let alami = penanda + mata.durasiMenit * 60_000;
    if (typeof batasAkhirPaket === "number") {
      alami = Math.min(alami, batasAkhirPaket);
    }
    const hasil = hasilMataUji(percobaan, mata.subject);
    batas[i] = hasil ? Math.min(hasil.submitted_at, alami) : alami;
    penanda = batas[i];
  });

  let aktif: number | null = null;
  sesi.mataUji.forEach((mata, i) => {
    const sudahDikumpulkan = Boolean(hasilMataUji(percobaan, mata.subject));
    if (sudahDikumpulkan) return;
    if (sekarang < batas[i]) {
      if (aktif === null) aktif = i;
    } else {
      perluSinkron.push(i);
    }
  });

  const indeksAktif: number | null = aktif;

  return {
    mulaiMataUji,
    batas,
    aktif: indeksAktif,
    selesai: indeksAktif === null && perluSinkron.length === 0,
    sisaDetik:
      indeksAktif === null
        ? 0
        : Math.max(0, Math.ceil((batas[indeksAktif] - sekarang) / 1000)),
    akhirSesi: penanda,
    perluSinkron,
  };
}
