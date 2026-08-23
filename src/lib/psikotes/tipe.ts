/**
 * Skema Try Out Psikotes.
 *
 * Modul ini berdiri sendiri dari bank soal try out akademik maupun dari
 * [Tes IQ](../tes-iq). Alasannya bukan sekadar kerapian: psikotes memuat dua
 * jenis alat ukur yang tidak dapat dipaksakan ke dalam satu skema.
 *
 * - **Sesi berkunci** (TIU, Penalaran Visual, Kepribadian & Emosi) punya satu
 *   jawaban terbaik, sehingga dapat dikoreksi benar/salah dan diberi pembahasan.
 * - **Sesi EPPS** tidak punya jawaban benar. Bentuknya pasangan pernyataan yang
 *   dipilih salah satu, dan hasilnya adalah profil kecenderungan — bukan skor.
 *   Menampilkan "benar/salah" pada tes semacam ini akan keliru secara metodologi
 *   dan menyesatkan peserta.
 *
 * Berkas ini bebas dependensi Node agar aman diimpor dari Client Component.
 */

export const HURUF_PSIKOTES = ["A", "B", "C", "D"] as const;
export type HurufPsikotes = (typeof HURUF_PSIKOTES)[number];

export function isHurufPsikotes(nilai: unknown): nilai is HurufPsikotes {
  return HURUF_PSIKOTES.includes(nilai as HurufPsikotes);
}

/* -------------------------------------------------------------------------- */
/*                            Gambar figural (SVG)                            */
/* -------------------------------------------------------------------------- */

/**
 * Kode gambar figural yang ringkas.
 *
 * Soal figural sungguhan membutuhkan gambar, bukan uraian kata — "segitiga yang
 * diputar" jauh lebih sulit dinalar ketika hanya dibaca. Karena itu setiap sel
 * ditulis sebagai satu kode pendek, lalu dirender menjadi SVG oleh
 * `components/psikotes/figur.tsx`. Bentuknya:
 *
 *     bentuk[@putar][#isi][*jumlah]
 *
 * Contoh: `segitiga@90#penuh`, `lingkaran*3`, `panah@180`, `?` untuk sel yang
 * ditanyakan, dan `kosong` untuk sel yang memang dibiarkan hampa.
 *
 * Menyimpannya sebagai kode — bukan berkas SVG — membuat soal figural ikut
 * terbundel di dalam kode, tidak menyentuh penyimpanan, dan tetap terbaca
 * ketika berkas datanya dibuka manusia.
 */
export type KodeFigur = string;

export const BENTUK_FIGUR = [
  "lingkaran",
  "segitiga",
  "persegi",
  "belahketupat",
  "segilima",
  "segienam",
  "bintang",
  "panah",
  "silang",
  "garis",
  "kosong",
] as const;

export type BentukFigur = (typeof BENTUK_FIGUR)[number];
export type IsiFigur = "kosong" | "penuh" | "separuh";

export type FigurTerurai = {
  bentuk: BentukFigur;
  putar: number;
  isi: IsiFigur;
  jumlah: number;
  /** true untuk sel yang ditanyakan; dirender sebagai tanda tanya. */
  tanya: boolean;
};

const BENTUK_SAH = new Set<string>(BENTUK_FIGUR);

/**
 * Menguraikan satu kode figur.
 *
 * Pengubah `@`, `#`, dan `*` boleh ditulis dalam urutan apa pun — `bintang*4#penuh`
 * dan `bintang#penuh*4` sama artinya. Kelonggaran ini disengaja: menuntut satu
 * urutan tetap berarti satu salah ketik pada bank soal berakhir sebagai kotak
 * kosong di layar peserta, kegagalan yang diam-diam dan sulit ditemukan.
 *
 * Kode yang benar-benar tidak dikenal tetap jatuh ke bentuk `kosong` daripada
 * melempar galat, sehingga satu butir cacat tidak menjatuhkan seluruh sesi.
 */
export function uraikanFigur(kode: KodeFigur): FigurTerurai {
  const bersih = kode.trim();

  if (bersih === "?") {
    return { bentuk: "kosong", putar: 0, isi: "kosong", jumlah: 1, tanya: true };
  }

  const cocok = /^([a-z]+)((?:@-?\d+|#(?:kosong|penuh|separuh)|\*\d+)*)$/.exec(
    bersih,
  );
  if (!cocok || !BENTUK_SAH.has(cocok[1])) {
    return { bentuk: "kosong", putar: 0, isi: "kosong", jumlah: 1, tanya: false };
  }

  let putar = 0;
  let isi: IsiFigur = "kosong";
  let jumlah = 1;

  for (const pengubah of cocok[2].match(/@-?\d+|#[a-z]+|\*\d+/g) ?? []) {
    const nilai = pengubah.slice(1);
    if (pengubah[0] === "@") putar = Number(nilai);
    else if (pengubah[0] === "#") isi = nilai as IsiFigur;
    // Dibatasi 1–4: lebih dari itu tidak lagi terbaca pada satu sel kecil.
    else jumlah = Math.min(4, Math.max(1, Number(nilai)));
  }

  return { bentuk: cocok[1] as BentukFigur, putar, isi, jumlah, tanya: false };
}

/** Susunan gambar stimulus: deret mendatar atau matriks berkolom. */
export type Stimulus = {
  /** Banyak kolom. Deret memakai panjang selnya sendiri, matriks memakai 3. */
  kolom: number;
  sel: KodeFigur[];
};

/* -------------------------------------------------------------------------- */
/*                              Sesi berkunci                                 */
/* -------------------------------------------------------------------------- */

export type SoalSkor = {
  nomor: number;
  kategori: string;
  pertanyaan: string;
  /** Gambar soal, bila butir ini figural. */
  stimulus?: Stimulus;
  /** Opsi berupa teks. Selalu terisi — juga dipakai sebagai label aksesibilitas. */
  opsi: Record<HurufPsikotes, string>;
  /** Opsi berupa gambar. Bila ada, gambar yang ditampilkan dan teks jadi label. */
  opsiFigur?: Record<HurufPsikotes, KodeFigur>;
  kunci: HurufPsikotes;
  pembahasan: string;
  /**
   * Butir yang dinonaktifkan admin tetap tersimpan tetapi tidak ikut diujikan.
   * Kosong berarti aktif — bank bawaan yang terbundel tidak perlu menuliskannya.
   */
  aktif?: boolean;
};

/** Soal seperti yang dikirim ke peserta: tanpa kunci dan tanpa pembahasan. */
export type SoalSkorLatihan = Omit<SoalSkor, "kunci" | "pembahasan" | "aktif">;

export function keSoalLatihan(soal: SoalSkor): SoalSkorLatihan {
  const { kunci, pembahasan, aktif, ...sisa } = soal;
  void kunci;
  void pembahasan;
  void aktif;
  return sisa;
}

/** true bila butir belum pernah dinonaktifkan admin. */
export function butirAktif(butir: { aktif?: boolean }): boolean {
  return butir.aktif !== false;
}

/* -------------------------------------------------------------------------- */
/*                                    EPPS                                    */
/* -------------------------------------------------------------------------- */

export const DIMENSI_EPPS = [
  "Kepemimpinan",
  "Disiplin",
  "Tanggung Jawab",
  "Ketekunan",
  "Kemandirian",
] as const;

export type DimensiEpps = (typeof DIMENSI_EPPS)[number];

/** Keterangan tiap dimensi pada lembar profil. */
export const ARTI_DIMENSI: Record<DimensiEpps, string> = {
  Kepemimpinan:
    "Dorongan untuk mengarahkan, mengambil keputusan bagi kelompok, dan berbicara di depan orang banyak.",
  Disiplin:
    "Dorongan untuk hidup teratur: menjaga jadwal, kerapian, persiapan, dan patuh pada aturan yang berlaku.",
  "Tanggung Jawab":
    "Dorongan untuk menuntaskan yang sudah dijanjikan dan menanggung akibat perbuatan sendiri tanpa mengalihkannya.",
  Ketekunan:
    "Dorongan untuk bertahan pada satu pekerjaan sampai selesai, termasuk ketika hasilnya lama terlihat.",
  Kemandirian:
    "Dorongan untuk bekerja dan memutuskan sendiri tanpa menunggu arahan atau bergantung pada orang lain.",
};

export type PernyataanEpps = { teks: string; dimensi: DimensiEpps };

export type PasanganEpps = {
  nomor: number;
  a: PernyataanEpps;
  b: PernyataanEpps;
  /** Lihat catatan pada `SoalSkor.aktif`. */
  aktif?: boolean;
};

/** Pasangan seperti yang dikirim ke peserta: tanpa label dimensi. */
export type PasanganEppsLatihan = {
  nomor: number;
  a: string;
  b: string;
};

export function kePasanganLatihan(pasangan: PasanganEpps): PasanganEppsLatihan {
  return { nomor: pasangan.nomor, a: pasangan.a.teks, b: pasangan.b.teks };
}

/* -------------------------------------------------------------------------- */
/*                              Sesi dan paket                                */
/* -------------------------------------------------------------------------- */

export type SesiSkor = {
  id: string;
  jenis: "skor";
  nama: string;
  ringkas: string;
  /** Petunjuk yang dibaca peserta sebelum sesi dimulai. */
  petunjuk: string;
  durasiMenit: number;
  /** Sesi yang dimatikan admin tidak muncul pada portal peserta. */
  aktif?: boolean;
  soal: SoalSkor[];
};

export type SesiEpps = {
  id: string;
  jenis: "epps";
  nama: string;
  ringkas: string;
  petunjuk: string;
  durasiMenit: number;
  aktif?: boolean;
  pasangan: PasanganEpps[];
};

export type SesiPsikotes = SesiSkor | SesiEpps;

export type PaketPsikotes = {
  id: string;
  nomor: number;
  nama: string;
  deskripsi: string;
  /** Paket yang dimatikan admin tidak muncul pada portal peserta. */
  aktif?: boolean;
  sesi: SesiPsikotes[];
};

export function jumlahButir(sesi: SesiPsikotes): number {
  return sesi.jenis === "skor" ? sesi.soal.length : sesi.pasangan.length;
}

/** Cacah butir yang benar-benar diujikan — butir nonaktif tidak dihitung. */
export function jumlahButirAktif(sesi: SesiPsikotes): number {
  return sesi.jenis === "skor"
    ? sesi.soal.filter(butirAktif).length
    : sesi.pasangan.filter(butirAktif).length;
}

/** Sesi yang benar-benar dikerjakan peserta: aktif dan masih punya butir. */
export function sesiDiujikan(sesi: SesiPsikotes): boolean {
  return sesi.aktif !== false && jumlahButirAktif(sesi) > 0;
}

/** Cacah soal per kategori pada satu sesi berkunci, dipakai kartu ringkasan. */
export function sebaranKategoriSesi(
  sesi: SesiPsikotes,
): { kategori: string; jumlah: number }[] {
  if (sesi.jenis !== "skor") return [];
  const urutan: string[] = [];
  const peta = new Map<string, number>();
  for (const soal of sesi.soal) {
    if (!butirAktif(soal)) continue;
    if (!peta.has(soal.kategori)) urutan.push(soal.kategori);
    peta.set(soal.kategori, (peta.get(soal.kategori) ?? 0) + 1);
  }
  return urutan.map((kategori) => ({ kategori, jumlah: peta.get(kategori)! }));
}

export function totalButirPaket(paket: PaketPsikotes): number {
  return paket.sesi
    .filter(sesiDiujikan)
    .reduce((total, sesi) => total + jumlahButirAktif(sesi), 0);
}

export function totalMenitPaket(paket: PaketPsikotes): number {
  return paket.sesi
    .filter(sesiDiujikan)
    .reduce((total, sesi) => total + sesi.durasiMenit, 0);
}

/** Sesi yang tampil di portal peserta. */
export function sesiTampil(paket: PaketPsikotes): SesiPsikotes[] {
  return paket.sesi.filter(sesiDiujikan);
}

/* -------------------------------------------------------------------------- */
/*                                   Hasil                                    */
/* -------------------------------------------------------------------------- */

export type KoreksiButir = {
  nomor: number;
  kunci: HurufPsikotes;
  pembahasan: string;
  jawaban: HurufPsikotes | null;
  benar: boolean;
};

export type HasilSkor = {
  jenis: "skor";
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  butir: KoreksiButir[];
  /** Rekap benar per kategori, supaya peserta tahu bagian mana yang lemah. */
  perKategori: { kategori: string; benar: number; jumlah: number }[];
};

export type BarisProfil = {
  dimensi: DimensiEpps;
  skor: number;
  /** Berapa kali dimensi ini muncul sebagai pilihan — skor tertinggi yang mungkin. */
  maks: number;
  arti: string;
  /** Kalimat tafsir yang menyesuaikan tinggi-rendahnya skor. */
  tafsir: string;
};

export type HasilEpps = {
  jenis: "epps";
  dijawab: number;
  total: number;
  profil: BarisProfil[];
};

export type HasilSesi = HasilSkor | HasilEpps;
