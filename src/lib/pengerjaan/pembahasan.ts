import { soalAktifTerurut } from "@/lib/bank-soal/pengambilan";
import type { HurufOpsi, Soal, Subject } from "@/lib/bank-soal/skema";
import { daftarSemuaPaket, sesiTerurut } from "@/lib/paket-tryout";
import { daftarPercobaan } from "@/lib/pengerjaan/repositori";
import type { Percobaan } from "@/lib/pengerjaan/tipe";

/**
 * Pembahasan soal untuk peserta.
 *
 * Aturan pentingnya satu: kunci jawaban dan pembahasan **hanya** dilepas untuk
 * mata uji yang sudah benar-benar dikumpulkan peserta itu sendiri. Mata uji yang
 * masih berjalan tidak pernah ikut, sehingga membuka halaman pembahasan di tengah
 * ujian tidak membocorkan apa pun — termasuk lewat mata uji berikutnya pada sesi
 * yang sama.
 *
 * Modul ini hanya boleh diimpor dari Server Component.
 */

export type ButirPembahasan = {
  nomor: number;
  pertanyaan: string;
  opsi: Record<HurufOpsi, string>;
  kunci: HurufOpsi;
  /** Jawaban peserta; null berarti dibiarkan kosong. */
  jawaban: HurufOpsi | null;
  benar: boolean;
  pembahasan: string;
  kategori: string;
  tingkat: Soal["difficulty"];
  gambar?: Soal["image"];
  tabel?: Soal["table"];
};

export type PembahasanMataUji = {
  subject: Subject;
  sesiId: string;
  sesiNama: string;
  nilai: number;
  benar: number;
  salah: number;
  kosong: number;
  jumlahSoal: number;
  dikumpulkanPada: number;
  butir: ButirPembahasan[];
};

export type PembahasanPaket = {
  paketId: string;
  paketNama: string;
  mataUji: PembahasanMataUji[];
};

/**
 * Mata uji mana saja yang sudah punya pembahasan untuk seorang peserta.
 * Dipakai halaman Riwayat Hasil untuk menentukan tombol mana yang layak tampil.
 */
export async function paketBerpembahasan(
  studentId: string,
): Promise<{ paketId: string; paketNama: string; jumlahMataUji: number }[]> {
  const [percobaan, paketList] = await Promise.all([
    daftarPercobaan(studentId),
    daftarSemuaPaket(),
  ]);

  const peta = new Map<string, { paketNama: string; jumlahMataUji: number }>();

  for (const item of percobaan) {
    const paket = paketList.find((p) => p.id === item.package_id);
    if (!paket) continue;

    const sebelumnya = peta.get(paket.id);
    peta.set(paket.id, {
      paketNama: paket.nama,
      jumlahMataUji: (sebelumnya?.jumlahMataUji ?? 0) + item.hasil.length,
    });
  }

  return [...peta.entries()]
    .filter(([, isi]) => isi.jumlahMataUji > 0)
    .map(([paketId, isi]) => ({ paketId, ...isi }));
}

/**
 * Menyusun pembahasan satu paket untuk seorang peserta.
 *
 * Mengembalikan null bila paket tidak dikenal atau peserta belum pernah
 * mengumpulkan satu pun mata uji pada paket itu.
 */
export async function pembahasanPaket(
  studentId: string,
  paketId: string,
): Promise<PembahasanPaket | null> {
  const [percobaan, paketList] = await Promise.all([
    daftarPercobaan(studentId),
    daftarSemuaPaket(),
  ]);

  const paket = paketList.find((item) => item.id === paketId);
  if (!paket) return null;

  const milikPaket = percobaan.filter((item) => item.package_id === paketId);
  if (milikPaket.length === 0) return null;

  const urutanSesi = sesiTerurut(paket);
  const mataUji: PembahasanMataUji[] = [];

  for (const item of milikPaket) {
    const sesi = urutanSesi.find((s) => s.id === item.session_id);

    // Hanya mata uji yang sudah dibukukan pada `hasil` yang dibuka. Jawaban
    // yang masih tersimpan tanpa hasil berarti mata ujinya belum dikumpulkan.
    for (const hasil of item.hasil) {
      const butir = await susunButir(paketId, hasil.subject, item);
      mataUji.push({
        subject: hasil.subject,
        sesiId: item.session_id,
        sesiNama: sesi?.nama ?? item.session_id,
        nilai: hasil.nilai,
        benar: hasil.benar,
        salah: hasil.salah,
        kosong: hasil.kosong,
        jumlahSoal: hasil.jumlah_soal,
        dikumpulkanPada: hasil.submitted_at,
        butir,
      });
    }
  }

  mataUji.sort((a, b) => a.dikumpulkanPada - b.dikumpulkanPada);
  return { paketId, paketNama: paket.nama, mataUji };
}

/** Mencocokkan soal yang dikerjakan dengan jawaban peserta. */
async function susunButir(
  paketId: string,
  subject: Subject,
  percobaan: Percobaan,
): Promise<ButirPembahasan[]> {
  // Urutan soal sama dengan yang dipakai saat ujian, sehingga nomor yang
  // dilihat peserta di ruang ujian dan di pembahasan tetap sejalan.
  const soal = await soalAktifTerurut(paketId, subject);

  const jawabanPer = new Map(
    percobaan.jawaban
      .filter((item) => item.subject === subject)
      .map((item) => [item.question_id, item.answer]),
  );

  return soal.map((butir, indeks) => {
    const jawaban = jawabanPer.get(butir.id) ?? null;
    return {
      nomor: indeks + 1,
      pertanyaan: butir.question,
      opsi: butir.options,
      kunci: butir.correct_answer,
      jawaban,
      benar: jawaban === butir.correct_answer,
      pembahasan: butir.explanation,
      kategori: butir.category,
      tingkat: butir.difficulty,
      gambar: butir.image,
      tabel: butir.table,
    };
  });
}

/* ------------------------- Rekap per paket try out ------------------------ */

export type RekapMataUji = {
  subject: Subject;
  sesiNama: string;
  benar: number;
  jumlahSoal: number;
  nilai: number;
  waktu: number;
};

export type RekapPaket = {
  paketId: string;
  paketNama: string;
  nomor: number;
  /** Satu entri per mata uji yang sudah dikumpulkan pada paket ini. */
  mataUji: RekapMataUji[];
  totalBenar: number;
  totalSoal: number;
  /** Rata-rata nilai seluruh mata uji paket ini, 0–100. */
  rataRata: number;
  /** Pengumpulan terakhir pada paket ini. */
  terakhir: number;
};

/**
 * Rekap hasil peserta dikelompokkan per paket try out.
 *
 * Satu baris per paket dengan seluruh mata ujinya sekaligus (mis. "Matematika
 * 24/30"), bukan satu baris per mata uji — jauh lebih mudah dibandingkan antar
 * paket, dan sejalan dengan cara pembahasan dibuka: per paket.
 */
export async function rekapPerPaket(studentId: string): Promise<RekapPaket[]> {
  const [percobaan, paketList] = await Promise.all([
    daftarPercobaan(studentId),
    daftarSemuaPaket(),
  ]);

  const peta = new Map<string, RekapPaket>();

  for (const item of percobaan) {
    const paket = paketList.find((p) => p.id === item.package_id);
    if (!paket) continue;

    const sesi = sesiTerurut(paket).find((s) => s.id === item.session_id);

    const rekap = peta.get(paket.id) ?? {
      paketId: paket.id,
      paketNama: paket.nama,
      nomor: paket.nomor,
      mataUji: [],
      totalBenar: 0,
      totalSoal: 0,
      rataRata: 0,
      terakhir: 0,
    };

    for (const hasil of item.hasil) {
      rekap.mataUji.push({
        subject: hasil.subject,
        sesiNama: sesi?.nama ?? item.session_id,
        benar: hasil.benar,
        jumlahSoal: hasil.jumlah_soal,
        nilai: hasil.nilai,
        waktu: hasil.submitted_at,
      });
      rekap.totalBenar += hasil.benar;
      rekap.totalSoal += hasil.jumlah_soal;
      rekap.terakhir = Math.max(rekap.terakhir, hasil.submitted_at);
    }

    peta.set(paket.id, rekap);
  }

  return [...peta.values()]
    .filter((item) => item.mataUji.length > 0)
    .map((item) => ({
      ...item,
      mataUji: [...item.mataUji].sort((a, b) => a.waktu - b.waktu),
      rataRata: Math.round(
        item.mataUji.reduce((total, mata) => total + mata.nilai, 0) /
          item.mataUji.length,
      ),
    }))
    .sort((a, b) => a.nomor - b.nomor);
}
