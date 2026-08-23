import {
  daftarSemuaPaket,
  getPaket,
  getSesi,
  sesiTerurut,
  type PaketKonfig,
  type SesiId,
} from "@/lib/paket-tryout";
import { daftarSoal } from "@/lib/bank-soal/repositori";
import {
  keSoalUjian,
  KATEGORI,
  SUBJECTS,
  type Difficulty,
  type HurufOpsi,
  type Soal,
  type SoalUjian,
  type Subject,
} from "@/lib/bank-soal/skema";

/**
 * Pengambilan soal untuk pelaksanaan ujian.
 *
 * Aturan: hanya soal aktif, diurutkan berdasarkan question_order, lalu dipotong
 * sebanyak jumlah soal yang diatur admin untuk mata uji tersebut. Selama bank
 * soal belum terisi penuh, sesi tetap dapat dijalankan memakai soal yang
 * tersedia — jumlah sesungguhnya dilaporkan lewat `tersedia`.
 */

/**
 * Jumlah soal yang ditargetkan admin untuk satu mata uji, dihitung dari objek
 * paket yang sudah dipegang pemanggil. Versi sinkron ini dipakai di dalam
 * perulangan yang tidak dapat menunggu.
 */
export function targetDariPaket(paket: PaketKonfig, subject: Subject): number {
  for (const sesi of paket.sesi) {
    const mata = sesi.mataUji.find((item) => item.subject === subject);
    if (mata) return mata.jumlahSoal;
  }
  return 0;
}

/** Jumlah soal yang ditargetkan admin untuk satu mata uji pada satu paket. */
export async function targetSoal(
  paketId: string,
  subject: Subject,
): Promise<number> {
  const paket = await getPaket(paketId);
  return paket ? targetDariPaket(paket, subject) : 0;
}

/** Sesi tempat mata uji tersebut dijadwalkan pada sebuah paket. */
export function sesiMataUji(paket: PaketKonfig, subject: Subject): SesiId | null {
  return (
    paket.sesi.find((sesi) =>
      sesi.mataUji.some((mata) => mata.subject === subject),
    )?.id ?? null
  );
}

export type PaketSoalUjian = {
  paketId: string;
  subject: Subject;
  soal: SoalUjian[];
  tersedia: number;
  target: number;
  lengkap: boolean;
};

/**
 * Soal yang benar-benar dikerjakan peserta, pada urutan yang sama.
 *
 * Diekspor agar penyusun pembahasan dapat mencocokkan nomor soal yang dilihat
 * peserta di ruang ujian dengan nomor pada halaman pembahasan. Hasilnya memuat
 * kunci dan pembahasan, jadi pemanggil wajib memastikan mata ujinya sudah
 * dikumpulkan sebelum mengirimkannya ke peramban.
 */
export async function soalAktifTerurut(paketId: string, subject: Subject) {
  const soal = await daftarSoal({ paketId, subject, aktifSaja: true });
  const target = await targetSoal(paketId, subject);
  return soal
    .sort((a, b) => a.question_order - b.question_order)
    .slice(0, target || soal.length);
}

/** Soal siap kirim ke peserta (tanpa kunci jawaban dan pembahasan). */
export async function ambilSoalUjian(
  paketId: string,
  subject: Subject,
): Promise<PaketSoalUjian> {
  const terpilih = await soalAktifTerurut(paketId, subject);
  const target = await targetSoal(paketId, subject);
  return {
    paketId,
    subject,
    soal: terpilih.map((butir, i) => keSoalUjian(butir, i + 1)),
    tersedia: terpilih.length,
    target,
    lengkap: target > 0 && terpilih.length === target,
  };
}

/** Kunci jawaban dengan urutan yang sama seperti `ambilSoalUjian`. */
export async function ambilKunciJawaban(
  paketId: string,
  subject: Subject,
): Promise<HurufOpsi[]> {
  const terpilih = await soalAktifTerurut(paketId, subject);
  return terpilih.map((butir) => butir.correct_answer);
}

/**
 * Kunci jawaban beserta id soalnya. Dipakai mesin penilaian di server;
 * tidak pernah dipanggil dari komponen klien.
 */
export async function ambilKunciBerid(
  paketId: string,
  subject: Subject,
): Promise<{ id: string; question_order: number; kunci: HurufOpsi }[]> {
  const terpilih = await soalAktifTerurut(paketId, subject);
  return terpilih.map((butir) => ({
    id: butir.id,
    question_order: butir.question_order,
    kunci: butir.correct_answer,
  }));
}

/** Jumlah soal yang benar-benar akan dikerjakan peserta. */
export async function jumlahSoalTersedia(paketId: string, subject: Subject) {
  const terpilih = await soalAktifTerurut(paketId, subject);
  return terpilih.length;
}

/** Mata uji sebuah sesi beserta jumlah soal yang tersedia di bank. */
export async function ringkasanSesi(paketId: string, sesiId: SesiId) {
  const sesi = await getSesi(paketId, sesiId);
  if (!sesi) return [];

  return Promise.all(
    sesi.mataUji.map(async (mata) => {
      const tersedia = await jumlahSoalTersedia(paketId, mata.subject);
      return {
        subject: mata.subject,
        durasiMenit: mata.durasiMenit,
        target: mata.jumlahSoal,
        tersedia,
        lengkap: tersedia === mata.jumlahSoal,
      };
    }),
  );
}

/* ------------------------------- Pemantauan ------------------------------- */

export type CakupanMataUji = {
  subject: Subject;
  target: number;
  aktif: number;
  nonaktif: number;
  kurang: number;
  perTingkat: Record<Difficulty, number>;
  kategoriTerpakai: string[];
  kategoriBelumTerpakai: string[];
};

export type CakupanPaket = {
  paketId: string;
  nama: string;
  aktifPaket: boolean;
  mataUji: CakupanMataUji[];
  totalAktif: number;
  totalTarget: number;
};

function hitungCakupan(
  subject: Subject,
  target: number,
  soal: Soal[],
): CakupanMataUji {
  const aktif = soal.filter((butir) => butir.active);
  const kategoriTerpakai = [...new Set(aktif.map((butir) => butir.category))].sort();

  return {
    subject,
    target,
    aktif: aktif.length,
    nonaktif: soal.length - aktif.length,
    kurang: Math.max(0, target - aktif.length),
    perTingkat: {
      Easy: aktif.filter((butir) => butir.difficulty === "Easy").length,
      Medium: aktif.filter((butir) => butir.difficulty === "Medium").length,
      Hard: aktif.filter((butir) => butir.difficulty === "Hard").length,
      "Very Hard": aktif.filter((butir) => butir.difficulty === "Very Hard").length,
    },
    kategoriTerpakai,
    kategoriBelumTerpakai: KATEGORI[subject].filter(
      (kategori) => !kategoriTerpakai.includes(kategori),
    ),
  };
}

/** Laporan pengisian bank soal seluruh paket (dipakai panel admin). */
export async function laporanCakupan(): Promise<CakupanPaket[]> {
  const semua = await daftarSoal();

  return (await daftarSemuaPaket()).map((paket) => {
    // Urutan kolom mengikuti urutan sesi dan mata uji yang diatur admin,
    // ditutup dengan mata uji yang belum dijadwalkan pada paket ini.
    const terjadwal = sesiTerurut(paket).flatMap((sesi) =>
      sesi.mataUji.map((mata) => mata.subject),
    );
    const daftarSubject = [
      ...terjadwal,
      ...SUBJECTS.filter((subject) => !terjadwal.includes(subject)),
    ];

    const mataUji = daftarSubject.map((subject) =>
      hitungCakupan(
        subject,
        targetDariPaket(paket, subject),
        semua.filter(
          (soal) => soal.package_id === paket.id && soal.subject === subject,
        ),
      ),
    );

    return {
      paketId: paket.id,
      nama: paket.nama,
      aktifPaket: paket.aktif,
      mataUji,
      totalAktif: mataUji.reduce((total, item) => total + item.aktif, 0),
      totalTarget: mataUji.reduce((total, item) => total + item.target, 0),
    };
  });
}
