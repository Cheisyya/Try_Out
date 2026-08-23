import { PAKET_PSIKOTES_1 } from "@/lib/psikotes/paket-1";
import { PAKET_PSIKOTES_10 } from "@/lib/psikotes/paket-10";
import { PAKET_PSIKOTES_2 } from "@/lib/psikotes/paket-2";
import { PAKET_PSIKOTES_3 } from "@/lib/psikotes/paket-3";
import { PAKET_PSIKOTES_4 } from "@/lib/psikotes/paket-4";
import { PAKET_PSIKOTES_5 } from "@/lib/psikotes/paket-5";
import { PAKET_PSIKOTES_6 } from "@/lib/psikotes/paket-6";
import { PAKET_PSIKOTES_7 } from "@/lib/psikotes/paket-7";
import { PAKET_PSIKOTES_8 } from "@/lib/psikotes/paket-8";
import { PAKET_PSIKOTES_9 } from "@/lib/psikotes/paket-9";
import {
  ARTI_DIMENSI,
  butirAktif,
  DIMENSI_EPPS,
  keSoalLatihan,
  type BarisProfil,
  type DimensiEpps,
  type HasilEpps,
  type HasilSkor,
  type HurufPsikotes,
  type KoreksiButir,
  type PaketPsikotes,
  type PasanganEpps,
  type SesiEpps,
  type SesiPsikotes,
  type SesiSkor,
  type SoalSkorLatihan,
} from "@/lib/psikotes/tipe";

/**
 * Bank Try Out Psikotes.
 *
 * Seluruh paket terbundel di dalam kode: tidak ada CRUD admin, tidak ada
 * pembacaan berkas saat runtime, dan tidak satu pun tulisan ke penyimpanan.
 * Fitur ini karena itu berjalan apa adanya pada hosting serverless tanpa
 * menambah beban database sedikit pun.
 *
 * Modul ini memuat kunci jawaban, jadi hanya boleh diimpor dari kode server.
 */

export const PAKET_PSIKOTES_BAWAAN: PaketPsikotes[] = [
  PAKET_PSIKOTES_1,
  PAKET_PSIKOTES_2,
  PAKET_PSIKOTES_3,
  PAKET_PSIKOTES_4,
  PAKET_PSIKOTES_5,
  PAKET_PSIKOTES_6,
  PAKET_PSIKOTES_7,
  PAKET_PSIKOTES_8,
  PAKET_PSIKOTES_9,
  PAKET_PSIKOTES_10,
];

/**
 * Bank bawaan sebagai daftar siap pakai.
 *
 * Dipertahankan sebagai `PAKET_PSIKOTES` agar kode lama tetap berjalan;
 * pemakai baru sebaiknya lewat `@/lib/psikotes/repositori` supaya perubahan
 * admin ikut terbaca.
 */
export const PAKET_PSIKOTES: PaketPsikotes[] = PAKET_PSIKOTES_BAWAAN;

export function cariPaketPsikotes(id: string): PaketPsikotes | null {
  return PAKET_PSIKOTES.find((paket) => paket.id === id) ?? null;
}

export function cariSesiPsikotes(
  paket: PaketPsikotes,
  sesiId: string,
): SesiPsikotes | null {
  return paket.sesi.find((sesi) => sesi.id === sesiId) ?? null;
}

/** Soal satu sesi berkunci tanpa kunci dan pembahasan, siap dikirim ke browser. */
export function soalLatihan(sesi: SesiSkor): SoalSkorLatihan[] {
  return sesi.soal.filter(butirAktif).map(keSoalLatihan);
}

/** Pasangan EPPS yang benar-benar diujikan. */
export function pasanganLatihan(sesi: SesiEpps): PasanganEpps[] {
  return sesi.pasangan.filter(butirAktif);
}

/* -------------------------------------------------------------------------- */
/*                             Koreksi sesi berkunci                          */
/* -------------------------------------------------------------------------- */

/**
 * Mengoreksi satu sesi berkunci.
 *
 * Jawaban yang tidak dikenal diperlakukan sebagai tidak dijawab, bukan sebagai
 * galat: latihan tidak boleh gagal hanya karena kiriman dari browser cacat.
 */
export function koreksiSkor(
  sesi: SesiSkor,
  jawaban: Map<number, HurufPsikotes>,
): HasilSkor {
  const diujikan = sesi.soal.filter(butirAktif);

  const butir: KoreksiButir[] = diujikan.map((soal) => {
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
  const urutan: string[] = [];
  const rekap = new Map<string, { benar: number; jumlah: number }>();
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
    jenis: "skor",
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

/* -------------------------------------------------------------------------- */
/*                                Profil EPPS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Kalimat tafsir per dimensi menurut tinggi-rendahnya kecenderungan.
 *
 * Kalimatnya sengaja dijaga deskriptif, bukan menghakimi. Skor rendah pada satu
 * dimensi tidak berarti buruk — pada tes pilihan-paksa, memilih satu pernyataan
 * selalu berarti tidak memilih yang lain, sehingga yang terbaca hanyalah mana
 * yang lebih kuat pada diri seseorang, bukan mana yang ia tidak punya.
 */
const TAFSIR: Record<DimensiEpps, { tinggi: string; sedang: string; rendah: string }> = {
  Kepemimpinan: {
    tinggi:
      "Anda cenderung tampil di depan dan nyaman mengambil keputusan bagi kelompok. Perhatikan agar ruang bagi pendapat orang lain tetap terbuka.",
    sedang:
      "Anda bersedia memimpin ketika diperlukan, tetapi tidak selalu mencarinya. Kecenderungan ini mudah dikembangkan lewat latihan berbicara dan memimpin kegiatan kecil.",
    rendah:
      "Anda lebih nyaman berperan sebagai pelaksana daripada pengarah. Ini bukan kekurangan, namun bila mengincar jalur kepemimpinan, biasakan mengambil satu peran memimpin di setiap kegiatan.",
  },
  Disiplin: {
    tinggi:
      "Keteraturan adalah kekuatan Anda: jadwal, kerapian, dan aturan mudah Anda jalani. Jaga agar ketertiban tidak berubah menjadi kaku ketika keadaan menuntut penyesuaian.",
    sedang:
      "Anda cukup teratur, tetapi belum selalu konsisten. Menetapkan satu atau dua kebiasaan tetap — misalnya jam tidur — biasanya cukup untuk mengangkat sisanya.",
    rendah:
      "Anda cenderung mengalir mengikuti keadaan daripada mengikuti rencana. Pada lingkungan berasrama yang jadwalnya ketat, ini bagian yang paling perlu dilatih lebih dahulu.",
  },
  "Tanggung Jawab": {
    tinggi:
      "Anda merasa terikat pada apa yang sudah Anda sanggupi dan bersedia menanggung akibatnya. Perhatikan agar Anda tidak menyanggupi lebih banyak daripada yang dapat dikerjakan.",
    sedang:
      "Anda menuntaskan kewajiban, meski kadang perlu diingatkan. Membiasakan mencatat apa yang sudah dijanjikan biasanya menutup selisih ini.",
    rendah:
      "Anda cenderung lebih ringan dalam memandang janji dan tenggat. Mulailah dari hal kecil yang tuntas tanpa ditagih — di situlah kepercayaan orang lain dibangun.",
  },
  Ketekunan: {
    tinggi:
      "Anda kuat bertahan pada pekerjaan panjang meski hasilnya lama terlihat. Pastikan ketekunan itu sesekali diselingi peninjauan ulang, agar bukan cara yang keliru yang Anda tekuni.",
    sedang:
      "Anda dapat bertahan pada tugas yang cukup panjang, tetapi mudah kendur bila hasilnya tidak segera tampak. Memecah sasaran menjadi tahap-tahap pendek sangat membantu.",
    rendah:
      "Anda lebih cepat berpindah ketika sesuatu terasa lambat membuahkan hasil. Latih dengan menyelesaikan satu hal panjang sampai tuntas, sekecil apa pun.",
  },
  Kemandirian: {
    tinggi:
      "Anda terbiasa memutuskan dan mengurus keperluan sendiri. Perhatikan agar kemandirian tidak berubah menjadi enggan meminta bantuan ketika keadaan memang menuntutnya.",
    sedang:
      "Anda dapat berdiri sendiri, tetapi masih senang berjalan bersama orang lain. Perpaduan ini biasanya cocok untuk kehidupan berasrama.",
    rendah:
      "Anda cenderung menunggu arahan atau kepastian dari orang lain sebelum bertindak. Membiasakan mengambil keputusan kecil sendiri adalah latihan yang paling cepat menutup selisih ini.",
  },
};

function tafsirkan(dimensi: DimensiEpps, skor: number, maks: number): string {
  if (maks === 0) return TAFSIR[dimensi].sedang;
  const bagian = skor / maks;
  if (bagian >= 0.7) return TAFSIR[dimensi].tinggi;
  if (bagian >= 0.4) return TAFSIR[dimensi].sedang;
  return TAFSIR[dimensi].rendah;
}

/**
 * Menyusun profil EPPS.
 *
 * `maks` dihitung dari bank soalnya sendiri, bukan ditulis tetap: bila kelak
 * jumlah pasangan berubah, batas atas tiap dimensi ikut menyesuaikan dan
 * batangan pada lembar profil tetap sebanding.
 *
 * Perhatikan bahwa keluarannya tidak memuat benar, salah, maupun nilai — tes
 * ini memang tidak mengenal jawaban yang benar.
 */
export function susunProfil(
  sesi: SesiEpps,
  pilihan: Map<number, "A" | "B">,
): HasilEpps {
  const skor = new Map<DimensiEpps, number>(
    DIMENSI_EPPS.map((dimensi) => [dimensi, 0]),
  );
  const maks = new Map<DimensiEpps, number>(
    DIMENSI_EPPS.map((dimensi) => [dimensi, 0]),
  );

  let dijawab = 0;

  for (const pasangan of sesi.pasangan.filter(butirAktif)) {
    // Kesempatan dihitung dari bank soalnya, terlepas dari apa yang dipilih.
    maks.set(pasangan.a.dimensi, (maks.get(pasangan.a.dimensi) ?? 0) + 1);
    maks.set(pasangan.b.dimensi, (maks.get(pasangan.b.dimensi) ?? 0) + 1);

    const dipilih = pilihan.get(pasangan.nomor);
    if (!dipilih) continue;

    dijawab += 1;
    const dimensi =
      dipilih === "A" ? pasangan.a.dimensi : pasangan.b.dimensi;
    skor.set(dimensi, (skor.get(dimensi) ?? 0) + 1);
  }

  const profil: BarisProfil[] = DIMENSI_EPPS.map((dimensi) => {
    const nilai = skor.get(dimensi) ?? 0;
    const batas = maks.get(dimensi) ?? 0;
    return {
      dimensi,
      skor: nilai,
      maks: batas,
      arti: ARTI_DIMENSI[dimensi],
      tafsir: tafsirkan(dimensi, nilai, batas),
    };
  });

  // Diurutkan dari kecenderungan terkuat: yang paling menonjol paling berguna
  // dibaca lebih dahulu.
  profil.sort((a, b) => b.skor - a.skor);

  return {
    jenis: "epps",
    dijawab,
    total: sesi.pasangan.filter(butirAktif).length,
    profil,
  };
}
