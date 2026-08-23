import { DOKUMEN } from "@/lib/pendaftaran/dokumen";
import {
  JUMLAH_SEMESTER,
  MAKS_PRESTASI,
  MAPEL_AKADEMIK,
  type Biodata,
  type DataOrtu,
} from "@/lib/pendaftaran/tipe";

/**
 * Daftar isian Data Diri dalam bentuk teks polos.
 *
 * Dipakai panitia untuk memberi tahu peserta apa saja yang harus disiapkan —
 * disalin dari menu Pengaturan lalu dikirim lewat WhatsApp atau media apa pun.
 * Isinya sengaja hanya **nama isian dan nama berkas**: ketentuan format, batas
 * ukuran, dan pilihan yang sah sudah tertulis lengkap pada halaman pengisian,
 * dan mengulangnya di sini hanya membuat pesannya terlalu panjang untuk dibaca.
 *
 * Kunci tiap butir biodata dan orang tua diketik sebagai `keyof Biodata` /
 * `keyof DataOrtu`, jadi bila sebuah field pada formulir diganti nama atau
 * dihapus, berkas ini gagal dikompilasi — daftarnya tidak dapat diam-diam
 * menjadi usang. Daftar dokumen, mata pelajaran, dan batas prestasi diambil
 * langsung dari sumbernya masing-masing.
 *
 * Bebas dependensi Node agar aman diimpor Client Component.
 */

export type KunciBagianIsian =
  | "biodata"
  | "ortu"
  | "akademik"
  | "dokumen"
  | "prestasi";

export type BagianIsian = {
  kunci: KunciBagianIsian;
  /** Judul beserta nomornya, sama dengan urutan menu Data Diri. */
  judul: string;
  /** Apakah butirnya diketik peserta atau berupa berkas yang dikirim. */
  jenis: "isi" | "unggah";
  /** Baris daftar, sudah termasuk penomorannya sendiri bila perlu. */
  butir: string[];
  /**
   * Tiap baris ditutup tanda "= " sebagai tempat menulis jawaban.
   *
   * Bawaannya mengikuti `jenis`: bagian isian memakainya, daftar berkas tidak.
   * Dimatikan juga untuk bagian yang barisnya bukan satu tempat isian sekali
   * pakai — Data Prestasi polanya diulang untuk tiap prestasi, jadi satu tanda
   * "=" di sana tidak mewakili apa pun.
   */
  tandaIsian?: boolean;
  /** Satu kalimat catatan, hanya bila benar-benar mengubah cara mengisinya. */
  catatan?: string;
};

const BIODATA: { kunci: keyof Biodata; label: string }[] = [
  { kunci: "jalurPendaftaran", label: "Jalur Pendaftaran" },
  { kunci: "sumbanganSukarela", label: "Sumbangan Sukarela" },
  { kunci: "nisn", label: "NISN" },
  { kunci: "peminatan", label: "Peminatan" },
  { kunci: "namaLengkap", label: "Nama Lengkap" },
  { kunci: "jenisKelamin", label: "Jenis Kelamin" },
  { kunci: "agama", label: "Agama" },
  { kunci: "tempatLahir", label: "Tempat Lahir" },
  { kunci: "tanggalLahir", label: "Tanggal Lahir" },
  { kunci: "namaSmp", label: "Nama SMP / Setingkat" },
  { kunci: "provinsiSekolah", label: "Provinsi Sekolah" },
  { kunci: "kabupatenSekolah", label: "Kabupaten/Kota Sekolah" },
  { kunci: "kecamatanSekolah", label: "Kecamatan Sekolah" },
  { kunci: "kelurahanSekolah", label: "Kelurahan Sekolah" },
  { kunci: "kodePosSekolah", label: "Kode Pos Sekolah" },
  { kunci: "hobi", label: "Hobi" },
  { kunci: "citaCita", label: "Cita-cita" },
  { kunci: "imunisasi", label: "Imunisasi" },
  { kunci: "tinggiBadan", label: "Tinggi Badan" },
  { kunci: "beratBadan", label: "Berat Badan" },
  { kunci: "ukuranSepatu", label: "Ukuran Sepatu" },
  { kunci: "ukuranBaju", label: "Ukuran Baju" },
  { kunci: "ukuranCelana", label: "Ukuran Celana / Rok" },
];

const ORTU: { kunci: keyof DataOrtu; label: string }[] = [
  { kunci: "namaAyah", label: "Nama Ayah / Wali" },
  { kunci: "namaIbu", label: "Nama Ibu / Wali" },
  { kunci: "sukuAyah", label: "Suku Ayah" },
  { kunci: "sukuIbu", label: "Suku Ibu" },
  { kunci: "pekerjaanAyah", label: "Pekerjaan Ayah" },
  { kunci: "pekerjaanIbu", label: "Pekerjaan Ibu" },
  { kunci: "penghasilanAyah", label: "Penghasilan Ayah" },
  { kunci: "penghasilanIbu", label: "Penghasilan Ibu" },
  { kunci: "teleponRumah", label: "Telepon Rumah" },
  { kunci: "teleponSeluler", label: "Telepon Seluler" },
  { kunci: "alamatRumah", label: "Alamat Rumah" },
  { kunci: "provinsi", label: "Provinsi" },
  { kunci: "kabupaten", label: "Kabupaten / Kota" },
  { kunci: "kecamatan", label: "Kecamatan" },
  { kunci: "kelurahan", label: "Kelurahan" },
  { kunci: "kodePos", label: "Kode Pos" },
];

export const BAGIAN_ISIAN: BagianIsian[] = [
  {
    kunci: "biodata",
    judul: "1. Biodata Siswa",
    jenis: "isi",
    butir: BIODATA.map((item) => item.label),
  },
  {
    kunci: "ortu",
    judul: "2. Data Orang Tua/Wali",
    jenis: "isi",
    butir: ORTU.map((item) => item.label),
  },
  {
    kunci: "akademik",
    judul: "3. Data Akademik",
    jenis: "isi",
    butir: MAPEL_AKADEMIK.map(
      (mapel) => `${mapel} — nilai semester 1 sampai ${JUMLAH_SEMESTER}`,
    ),
    catatan: "Nilai diambil dari rapor, kolom nilai pengetahuan.",
  },
  {
    kunci: "dokumen",
    judul: "4. Kelengkapan Dokumen",
    jenis: "unggah",
    // Nomornya ikut penomoran resmi panitia, bukan urutan baris: nomor 12
    // dipakai tiga sertifikat prestasi sekaligus.
    butir: DOKUMEN.map((spek) => {
      // Beberapa judul resmi sudah memuat "(Tidak Wajib)"; jangan diulang.
      const sudahDitandai = /tidak wajib/i.test(spek.judul);
      const tanda = spek.wajib || sudahDitandai ? "" : " (tidak wajib)";
      return `${spek.nomor}. ${spek.judul}${tanda}`;
    }),
  },
  {
    kunci: "prestasi",
    judul: "5. Data Prestasi",
    jenis: "isi",
    tandaIsian: false,
    butir: [
      "Nama Kegiatan / Lomba",
      "Sumber",
      "Tingkat",
      "Peringkat",
      "Penyelenggara",
      "Tahun",
    ],
    catatan: `Diulang untuk tiap prestasi, maksimal ${MAKS_PRESTASI} prestasi tertinggi. Bila tidak ada, bagian ini cukup dilewati.`,
  },
];

export function bagianIsian(kunci: KunciBagianIsian): BagianIsian {
  const bagian = BAGIAN_ISIAN.find((item) => item.kunci === kunci);
  if (!bagian) throw new Error(`Bagian "${kunci}" tidak dikenal.`);
  return bagian;
}

/* --------------------------------- Teks ---------------------------------- */

const JUDUL_BERKAS = "DAFTAR ISIAN DATA DIRI SISWA";

/** Satu bagian sebagai teks siap salin. */
export function teksBagian(bagian: BagianIsian): string {
  const kepala =
    bagian.jenis === "unggah"
      ? `${bagian.judul} (berkas yang dikirim)`
      : `${bagian.judul} (yang perlu diisi)`;

  const baris = [kepala, ""];

  // Tanda "= " menandai tempat peserta menulis jawabannya ketika daftar ini
  // ditempel di chat; hanya dipasang pada bagian yang tiap barisnya memang
  // satu isian sekali pakai.
  const pakaiTanda = bagian.tandaIsian ?? bagian.jenis === "isi";

  bagian.butir.forEach((butir, i) => {
    // Daftar dokumen sudah membawa nomor resminya sendiri.
    const teks = bagian.jenis === "unggah" ? butir : `${i + 1}. ${butir}`;
    baris.push(pakaiTanda ? `${teks} = ` : teks);
  });

  if (bagian.catatan) baris.push("", bagian.catatan);

  return baris.join("\n");
}

/** Seluruh bagian sebagai satu teks. */
export function teksSemua(): string {
  return [
    JUDUL_BERKAS,
    "",
    BAGIAN_ISIAN.map(teksBagian).join("\n\n"),
    "",
  ].join("\n");
}
