import { SOAL_PAKET_1 } from "@/lib/tes-iq/paket-1";
import { SOAL_PAKET_2 } from "@/lib/tes-iq/paket-2";
import { SOAL_PAKET_3 } from "@/lib/tes-iq/paket-3";
import { SOAL_PAKET_4 } from "@/lib/tes-iq/paket-4";
import { SOAL_PAKET_5 } from "@/lib/tes-iq/paket-5";
import {
  butirIqAktif,
  keSoalLatihan,
  soalDiujikan,
  type HasilLatihanIq,
  type HurufIq,
  type KategoriIq,
  type KoreksiIq,
  type PaketIq,
  type SoalIqLatihan,
} from "@/lib/tes-iq/tipe";

/**
 * Bank soal Tes IQ latihan.
 *
 * Berbeda dengan bank soal try out yang dikelola admin lewat penyimpanan, paket
 * latihan ini terbundel di dalam kode. Alasannya: isinya tetap, tidak ada CRUD,
 * dan tidak ada satu pun tulisan ke penyimpanan — sehingga fitur ini berjalan
 * apa adanya pada hosting serverless tanpa menambah beban database.
 *
 * Modul ini memuat kunci jawaban, jadi hanya boleh diimpor dari kode server.
 * Sisi klien menerima bentuk `SoalIqLatihan` yang kuncinya sudah dibuang.
 */

/**
 * Batas waktu bawaan setiap paket latihan, dalam menit.
 *
 * Sebelumnya latihan ini tidak berbatas waktu. Batas 21 menit ditetapkan agar
 * peserta terbiasa membagi waktu seperti pada tes yang sesungguhnya — dengan
 * 25 soal, itu berarti sekitar 50 detik per butir.
 */
export const DURASI_IQ_BAWAAN = 21;

export const PAKET_IQ_BAWAAN: PaketIq[] = [
  {
    id: "iq-1",
    nomor: 1,
    nama: "Tes IQ Latihan 1",
    tingkat: "Dasar",
    deskripsi:
      "Pengenalan empat jenis soal penalaran: verbal, numerik, logika, dan spasial. Polanya masih satu langkah sehingga cocok dikerjakan pertama kali.",
    durasiMenit: DURASI_IQ_BAWAAN,
    soal: SOAL_PAKET_1,
  },
  {
    id: "iq-2",
    nomor: 2,
    nama: "Tes IQ Latihan 2",
    tingkat: "Lanjutan",
    deskripsi:
      "Deret berlapis, penalaran bersyarat dan ingkaran, penjadwalan, serta bangun ruang. Sebagian besar butir menuntut lebih dari satu langkah.",
    durasiMenit: DURASI_IQ_BAWAAN,
    soal: SOAL_PAKET_2,
  },
  {
    id: "iq-3",
    nomor: 3,
    nama: "Tes IQ Latihan 3",
    tingkat: "Menengah",
    deskripsi:
      "Analogi bertingkat, deret dengan dua aturan berselang, penalaran bersyarat, serta bangun ruang yang harus dibayangkan terpotong dan terlipat.",
    durasiMenit: DURASI_IQ_BAWAAN,
    soal: SOAL_PAKET_3,
  },
  {
    id: "iq-4",
    nomor: 4,
    nama: "Tes IQ Latihan 4",
    tingkat: "Lanjutan",
    deskripsi:
      "Hubungan kata yang tidak langsung, deret dengan dua aturan yang bekerja bersamaan, syarat berantai beserta ingkarannya, dan perputaran benda pada lebih dari satu sumbu.",
    durasiMenit: DURASI_IQ_BAWAAN,
    soal: SOAL_PAKET_4,
  },
  {
    id: "iq-5",
    nomor: 5,
    nama: "Tes IQ Latihan 5",
    tingkat: "Simulasi",
    deskripsi:
      "Paket penutup dengan soal mudah dan berat yang berselang-seling, untuk berlatih memutuskan butir mana yang dikerjakan lebih dahulu dan mana yang ditinggalkan sementara.",
    durasiMenit: DURASI_IQ_BAWAAN,
    soal: SOAL_PAKET_5,
  },
];

/**
 * Bank bawaan sebagai daftar siap pakai.
 *
 * Dipertahankan sebagai `PAKET_IQ` agar kode lama tetap berjalan; pemakai baru
 * sebaiknya lewat `@/lib/tes-iq/repositori` supaya perubahan admin ikut
 * terbaca.
 */
export const PAKET_IQ: PaketIq[] = PAKET_IQ_BAWAAN;

export function cariPaketIq(id: string): PaketIq | null {
  return PAKET_IQ.find((paket) => paket.id === id) ?? null;
}

/**
 * Soal satu paket tanpa kunci dan pembahasan, siap dikirim ke browser.
 *
 * Butir yang dinonaktifkan admin tidak ikut — bagi peserta, butir semacam itu
 * seolah tidak pernah ada.
 */
export function soalLatihan(paket: PaketIq): SoalIqLatihan[] {
  return soalDiujikan(paket).map(keSoalLatihan);
}

/**
 * Mengoreksi satu sesi latihan.
 *
 * Jawaban yang tidak dikenal — huruf di luar A–D, atau nomor soal yang tidak
 * ada pada paket — diperlakukan sebagai tidak dijawab, bukan sebagai galat:
 * latihan tidak boleh gagal hanya karena kiriman dari browser cacat.
 */
export function koreksiLatihan(
  paket: PaketIq,
  jawaban: Map<number, HurufIq>,
): HasilLatihanIq {
  const diujikan = paket.soal.filter(butirIqAktif);

  const butir: KoreksiIq[] = diujikan.map((soal) => {
    const dijawab = jawaban.get(soal.nomor) ?? null;
    return {
      nomor: soal.nomor,
      kunci: soal.kunci,
      pembahasan: soal.pembahasan,
      jawaban: dijawab,
      benar: dijawab === soal.kunci,
    };
  });

  const benar = butir.filter((item) => item.benar).length;
  const kosong = butir.filter((item) => item.jawaban === null).length;

  // Rekap per kategori memakai urutan kemunculan pertama, bukan urutan abjad,
  // supaya susunannya sama dengan urutan soal yang baru saja dikerjakan.
  const urutan: KategoriIq[] = [];
  const rekap = new Map<KategoriIq, { benar: number; jumlah: number }>();
  for (const soal of diujikan) {
    if (!rekap.has(soal.kategori)) {
      rekap.set(soal.kategori, { benar: 0, jumlah: 0 });
      urutan.push(soal.kategori);
    }
    const baris = rekap.get(soal.kategori)!;
    baris.jumlah += 1;
    if (jawaban.get(soal.nomor) === soal.kunci) baris.benar += 1;
  }

  return {
    benar,
    salah: butir.length - benar - kosong,
    kosong,
    total: butir.length,
    butir,
    perKategori: urutan.map((kategori) => ({
      kategori,
      ...rekap.get(kategori)!,
    })),
  };
}
