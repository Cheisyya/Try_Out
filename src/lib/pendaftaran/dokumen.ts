/**
 * Spesifikasi Kelengkapan Dokumen siswa.
 *
 * Satu-satunya sumber kebenaran untuk: nomor urut dokumen, format berkas yang
 * diterima, batas ukuran, teks ketentuan yang ditampilkan ke peserta, dan pola
 * penamaan berkas otomatis. Dipakai bersama oleh form unggah (klien), validasi
 * server, dan penyusun berkas ZIP untuk admin.
 *
 * Bebas dependensi Node agar aman diimpor dari Client Component.
 */

import { MAKS_UNGGAHAN } from "@/lib/batas-unggah";

export type FormatBerkas = "pdf" | "jpg" | "png";

export type SpesifikasiDokumen = {
  /** Kunci penyimpanan, unik. */
  kunci: string;
  /** Nomor urut sesuai daftar persyaratan panitia (1–14). */
  nomor: number;
  /** Judul yang tampil pada daftar. */
  judul: string;
  /** Potongan nama yang dipakai pada penamaan berkas otomatis. */
  namaBerkas: string;
  wajib: boolean;
  format: FormatBerkas[];
  maksByte: number;
  /** Butir ketentuan yang ditampilkan apa adanya kepada peserta. */
  ketentuan: string[];
  /** Meminta keterangan tambahan saat mengunggah (mis. "AKSELARASI"). */
  mintaKeterangan?: { label: string; hint: string };
};

const MB = 1024 * 1024;

const TAUTAN_FORMAT = "bit.ly/PersyaratanPensisruSMATN";

const CATATAN_JILBAB =
  "Seragam Sekolah tanpa topi (Boleh berjilbab untuk Siswa Perempuan)";

export const DOKUMEN: SpesifikasiDokumen[] = [
  {
    kunci: "pas-foto",
    nomor: 1,
    judul: "Pas Foto",
    namaBerkas: "Pas Foto",
    wajib: true,
    format: ["jpg", "png"],
    maksByte: 2 * MB,
    ketentuan: [
      "Ukuran: 4cm x 6cm",
      `Pakaian: ${CATATAN_JILBAB}`,
      "Latar: Warna Biru",
      "Format File: JPG/PNG (Tidak boleh PDF)",
      "Ukuran File: Maksimal 2MB",
    ],
  },
  {
    kunci: "surat-keterangan-sehat",
    nomor: 2,
    judul: "Surat Keterangan Sehat dari Dokter (Pemerintah/Militer/Puskesmas/dsb.)",
    namaBerkas: "Surat Keterangan Sehat",
    wajib: true,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: [
      "Tujuan Pemeriksaan: Pendaftaran Siswa Baru SMA Taruna Nusantara",
      "Komponen Pemeriksaan: Pemeriksaan Umum Fisik",
      "Waktu Pemeriksaan: Dilakukan maksimal 14 hari sebelum melakukan pendaftaran",
      `Format Surat: Sesuai dengan instansi saat pemeriksaan atau gunakan contoh di ${TAUTAN_FORMAT}`,
      "Format File: PDF",
      "Ukuran File: Maksimal 2MB",
    ],
  },
  {
    kunci: "kartu-pelajar",
    nomor: 3,
    judul: "Kartu Pelajar SMP/MTS",
    namaBerkas: "Kartu Pelajar SMP",
    wajib: true,
    format: ["jpg", "png", "pdf"],
    maksByte: 2 * MB,
    ketentuan: [
      "Format File Kartu Pelajar: JPG/PNG",
      "Format File Surat Keterangan Sekolah: PDF",
      "Ukuran File: Maksimal 2MB",
      "Surat Keterangan Sekolah digunakan bila Siswa tidak memiliki Kartu Pelajar",
    ],
  },
  {
    kunci: "akta-kelahiran",
    nomor: 4,
    judul: "Akta Kelahiran",
    namaBerkas: "Akta Kelahiran",
    wajib: true,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: ["Format File Akta Kelahiran: PDF", "Ukuran File: Maksimal 2MB"],
  },
  {
    kunci: "nilai-rapor",
    nomor: 5,
    judul: "Nilai Rapor (Nilai Pengetahuan) Photocopy Legalisir",
    namaBerkas: "Nilai Rapor",
    wajib: true,
    format: ["pdf"],
    // Dokumen terbesar; dibatasi oleh badan permintaan hosting serverless.
    maksByte: MAKS_UNGGAHAN,
    ketentuan: [
      "Format File Rapor: PDF",
      "Ukuran File: Maksimal 4MB",
      "Halaman Rapor: NILAI PENGETAHUAN (Bukan Nilai Keterampilan)",
      "Keterangan: Upload Nilai Semester 1 s.d. Semester 4",
      'Khusus Siswa Akselerasi: Upload Nilai Semester 1 s.d. Semester 3 (Tambahkan keterangan "AKSELARASI" saat mengunggah)',
      "WAJIB TERLEGALISIR OLEH SEKOLAH di seluruh halaman yang akan diunggah",
    ],
    mintaKeterangan: {
      label: "Keterangan Rapor",
      hint: 'Isi "AKSELARASI" bila Anda siswa akselerasi (rapor semester 1 s.d. 3).',
    },
  },
  {
    kunci: "foto-seluruh-badan",
    nomor: 6,
    judul: "Foto Seluruh Badan (Terlihat dari kepala sampai ujung kaki)",
    namaBerkas: "Foto Seluruh Badan",
    wajib: true,
    format: ["jpg", "png"],
    maksByte: 2 * MB,
    ketentuan: [
      "Ukuran: 10,2cm x 15,2cm (4R)",
      "Pakaian: Seragam Sekolah Lengkap (menggunakan sepatu) tanpa topi (Boleh berjilbab untuk Siswa Perempuan)",
      "Latar: Warna Biru",
      "Format File: JPG/PNG (Tidak boleh PDF)",
      "Ukuran File: Maksimal 2MB",
    ],
  },
  {
    kunci: "kartu-keluarga",
    nomor: 7,
    judul: "Kartu Keluarga",
    namaBerkas: "Kartu Keluarga",
    wajib: true,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: ["Format File Kartu Keluarga: PDF", "Ukuran File: Maksimal 2MB"],
  },
  {
    kunci: "ktp-orang-tua",
    nomor: 8,
    judul: "KTP Orang Tua / Wali Siswa (Cukup salah satu, Ayah/Ibu/Wali)",
    namaBerkas: "KTP Orang Tua",
    wajib: true,
    format: ["jpg", "png"],
    maksByte: 2 * MB,
    ketentuan: ["Format File KTP Orang Tua: JPG/PNG", "Ukuran File: Maksimal 2MB"],
  },
  {
    kunci: "surat-kepala-smp",
    nomor: 9,
    judul: "Surat Keterangan dan Pernyataan dari Kepala SMP",
    namaBerkas: "Surat Keterangan Kepala SMP",
    wajib: true,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: [
      "Format File Surat: PDF",
      "Ukuran File: Maksimal 2MB",
      `Format Surat: Wajib menggunakan format dari panitia, unduh di ${TAUTAN_FORMAT}`,
    ],
  },
  {
    kunci: "pernyataan-orang-tua",
    nomor: 10,
    judul: "Surat Pernyataan dari Orang Tua",
    namaBerkas: "Surat Pernyataan Orang Tua",
    wajib: true,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: [
      "Format File Surat: PDF",
      "Ukuran File: Maksimal 2MB",
      `Format Surat: Wajib menggunakan format dari panitia, unduh di ${TAUTAN_FORMAT}`,
    ],
  },
  {
    kunci: "pernyataan-calon-siswa",
    nomor: 11,
    judul: "Surat Pernyataan dari Siswa",
    namaBerkas: "Surat Pernyataan Siswa",
    wajib: true,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: [
      "Format File Surat: PDF",
      "Ukuran File: Maksimal 2MB",
      `Format Surat: Wajib menggunakan format dari panitia, unduh di ${TAUTAN_FORMAT}`,
    ],
  },
  ...[1, 2, 3].map<SpesifikasiDokumen>((slot) => ({
    kunci: `sertifikat-prestasi-${slot}`,
    nomor: 12,
    judul: `Sertifikat Bukti Prestasi ${slot} (Maks. 3 Pencapaian Tertinggi)`,
    namaBerkas: `Sertifikat Prestasi ${slot}`,
    wajib: false,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: [
      "Pencapaian: Juara 1 s.d. 3 / Emas, Perak, dan Perunggu",
      "Tingkat: Internasional, Nasional, Provinsi, dan Kabupaten/Kota",
      "Hanya prestasi dari: OSN, OPSI, O2SN, FLS2N, GSI (PUSPRESNAS), KOMPETISI MSI SMA TN, LKIP SMA TN, Olimpiade/Perlombaan Internasional, dan Ketua OSIS",
      "Format File: PDF",
      "Ukuran File: Maksimal 2MB",
    ],
  })),
  {
    kunci: "sertifikat-vaksinasi",
    nomor: 13,
    judul: "Sertifikat Vaksinasi COVID-19 / Lainnya (Tidak Wajib)",
    namaBerkas: "Sertifikat Vaksinasi",
    wajib: false,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: ["Format File: PDF", "Ukuran File: Maksimal 2MB"],
  },
  {
    kunci: "hasil-test-iq",
    nomor: 14,
    judul: "Hasil Test IQ (Tidak Wajib)",
    namaBerkas: "Hasil Test IQ",
    wajib: false,
    format: ["pdf"],
    maksByte: 2 * MB,
    ketentuan: ["Format File: PDF", "Ukuran File: Maksimal 2MB"],
  },
];

export const DOKUMEN_WAJIB = DOKUMEN.filter((item) => item.wajib);

export function cariDokumen(kunci: string): SpesifikasiDokumen | undefined {
  return DOKUMEN.find((item) => item.kunci === kunci);
}

/* ------------------------------ Format berkas ------------------------------ */

/** Ekstensi nama berkas yang sah untuk tiap format. */
export const EKSTENSI_FORMAT: Record<FormatBerkas, string[]> = {
  pdf: [".pdf"],
  jpg: [".jpg", ".jpeg"],
  png: [".png"],
};

/** Tipe MIME yang dianggap sah untuk tiap format. */
export const MIME_FORMAT: Record<FormatBerkas, string[]> = {
  pdf: ["application/pdf"],
  jpg: ["image/jpeg", "image/jpg"],
  png: ["image/png"],
};

/** Nilai atribut `accept` pada input berkas. */
export function atributAccept(spek: SpesifikasiDokumen) {
  return spek.format
    .flatMap((format) => [...MIME_FORMAT[format], ...EKSTENSI_FORMAT[format]])
    .join(",");
}

/** "JPG/PNG" — untuk teks bantuan. */
export function labelFormat(spek: SpesifikasiDokumen) {
  return spek.format.map((format) => format.toUpperCase()).join("/");
}

/** 2097152 -> "2 MB" */
export function labelUkuran(byte: number) {
  const mb = byte / (1024 * 1024);
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
}

/** 348122 -> "340 KB" */
export function formatUkuran(byte: number) {
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) return `${Math.round(byte / 1024)} KB`;
  return `${(byte / (1024 * 1024)).toFixed(1)} MB`;
}

/** Ekstensi (tanpa titik) dari nama berkas, huruf kecil. */
export function ekstensiDari(nama: string) {
  const titik = nama.lastIndexOf(".");
  return titik === -1 ? "" : nama.slice(titik + 1).toLowerCase();
}

/** Format yang cocok untuk sebuah ekstensi, bila diterima oleh spesifikasi. */
export function formatDariEkstensi(
  spek: SpesifikasiDokumen,
  ekstensi: string,
): FormatBerkas | null {
  const akhiran = `.${ekstensi.toLowerCase()}`;
  return (
    spek.format.find((format) => EKSTENSI_FORMAT[format].includes(akhiran)) ??
    null
  );
}

/* --------------------------- Penamaan berkas otomatis ---------------------- */

/**
 * Membersihkan potongan nama agar aman dipakai sebagai nama berkas pada
 * Windows maupun POSIX, tanpa mengubah huruf besar/kecil dan spasi yang membuat
 * nama tetap mudah dibaca panitia.
 */
export function bersihkanPotonganNama(nilai: string) {
  return (
    nilai
      // Karakter terlarang pada nama berkas Windows, plus karakter kendali.
      // eslint-disable-next-line no-control-regex
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      // Titik di akhir nama membuat berkas sulit dibuka pada Windows.
      .replace(/\.+$/, "")
      .trim()
      .slice(0, 60) || "Tanpa Nama"
  );
}

/**
 * Nama berkas otomatis sesuai ketentuan panitia:
 * `<nomor>_<Nama Dokumen>_<Nama Siswa>.<ekstensi>`
 *
 * Contoh: `2_Surat Keterangan Sehat_Aditya Pratama.pdf`
 */
export function namaBerkasOtomatis(
  spek: SpesifikasiDokumen,
  namaSiswa: string,
  ekstensi: string,
) {
  const nama = bersihkanPotonganNama(namaSiswa);
  const dokumen = bersihkanPotonganNama(spek.namaBerkas);
  return `${spek.nomor}_${dokumen}_${nama}.${ekstensi.toLowerCase()}`;
}
