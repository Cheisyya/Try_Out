/**
 * Tipe data pendaftaran siswa SMA Taruna Nusantara.
 *
 * Berkas ini sengaja bebas dependensi Node agar aman diimpor baik dari Server
 * Component maupun Client Component (form pengisian di sisi peserta).
 */

/* --------------------------------- Biodata -------------------------------- */

export type Biodata = {
  /* Data Utama */
  jalurPendaftaran: string;
  sumbanganSukarela: string;
  nisn: string;
  peminatan: string;
  namaLengkap: string;
  jenisKelamin: string;
  agama: string;
  tempatLahir: string;
  tanggalLahir: string;

  /* Data Pendukung */
  namaSmp: string;
  provinsiSekolah: string;
  kabupatenSekolah: string;
  kecamatanSekolah: string;
  kelurahanSekolah: string;
  kodePosSekolah: string;
  hobi: string;
  citaCita: string;
  imunisasi: string;
  tinggiBadan: string;
  beratBadan: string;
  ukuranSepatu: string;
  ukuranBaju: string;
  ukuranCelana: string;
};

export const JALUR_PENDAFTARAN = [
  "Beasiswa ( BS )",
  "Biaya Sendiri ( BSD )",
  "Kerja Sama ( KS )",
] as const;

export const PEMINATAN = ["Kurikulum Merdeka", "Kurikulum 2013"] as const;

export const JENIS_KELAMIN = ["Laki-laki", "Perempuan"] as const;

export const AGAMA = [
  "Islam",
  "Kristen Protestan",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
] as const;

export const UKURAN_BAJU = ["S", "M", "L", "XL", "XXL", "XXXL"] as const;

export function biodataKosong(): Biodata {
  return {
    jalurPendaftaran: "",
    sumbanganSukarela: "",
    nisn: "",
    peminatan: "",
    namaLengkap: "",
    jenisKelamin: "",
    agama: "",
    tempatLahir: "",
    tanggalLahir: "",
    namaSmp: "",
    provinsiSekolah: "",
    kabupatenSekolah: "",
    kecamatanSekolah: "",
    kelurahanSekolah: "",
    kodePosSekolah: "",
    hobi: "",
    citaCita: "",
    imunisasi: "",
    tinggiBadan: "",
    beratBadan: "",
    ukuranSepatu: "",
    ukuranBaju: "",
    ukuranCelana: "",
  };
}

/* ---------------------------- Data Orang Tua/Wali -------------------------- */

export type DataOrtu = {
  namaAyah: string;
  namaIbu: string;
  sukuAyah: string;
  sukuIbu: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  penghasilanAyah: string;
  penghasilanIbu: string;
  teleponRumah: string;
  teleponSeluler: string;
  alamatRumah: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  kodePos: string;
};

export function ortuKosong(): DataOrtu {
  return {
    namaAyah: "",
    namaIbu: "",
    sukuAyah: "",
    sukuIbu: "",
    pekerjaanAyah: "",
    pekerjaanIbu: "",
    penghasilanAyah: "",
    penghasilanIbu: "",
    teleponRumah: "",
    teleponSeluler: "",
    alamatRumah: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
    kodePos: "",
  };
}

/* ------------------------------ Data Akademik ------------------------------ */

/** Mata pelajaran yang nilainya diminta panitia (Nilai Pengetahuan). */
export const MAPEL_AKADEMIK = [
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Matematika",
  "Ilmu Pengetahuan Alam",
] as const;

export type MapelAkademik = (typeof MAPEL_AKADEMIK)[number];

export const JUMLAH_SEMESTER = 4;

/** Nilai per mata pelajaran, indeks 0–3 mewakili semester 1–4. */
export type NilaiAkademik = Record<MapelAkademik, string[]>;

export function akademikKosong(): NilaiAkademik {
  return MAPEL_AKADEMIK.reduce((hasil, mapel) => {
    hasil[mapel] = Array.from({ length: JUMLAH_SEMESTER }, () => "");
    return hasil;
  }, {} as NilaiAkademik);
}

/* ------------------------------- Data Prestasi ----------------------------- */

/** Maksimal 3 pencapaian tertinggi, sesuai ketentuan panitia. */
export const MAKS_PRESTASI = 3;

export const TINGKAT_PRESTASI = [
  "Internasional",
  "Nasional",
  "Provinsi",
  "Kabupaten/Kota",
] as const;

export const PERINGKAT_PRESTASI = [
  "Juara 1 / Emas",
  "Juara 2 / Perak",
  "Juara 3 / Perunggu",
] as const;

/** Hanya prestasi dari daftar ini yang diakui panitia. */
export const SUMBER_PRESTASI = [
  "OSN (Olimpiade Sains Nasional) PUSPRESNAS",
  "OPSI (Olimpiade Penelitian Siswa Indonesia) PUSPRESNAS",
  "O2SN (Olimpiade Olahraga Siswa Nasional) PUSPRESNAS",
  "FLS2N (Festival dan Lomba Seni Siswa Nasional) PUSPRESNAS",
  "GSI (Gala Siswa Indonesia) PUSPRESNAS",
  "KOMPETISI MSI (Matematika-Sains-Inggris) SMA TN",
  "LKIP (Lomba Karya Inovasi Pelajar) SMA TN",
  "OLIMPIADE / PERLOMBAAN INTERNASIONAL",
  "KETUA OSIS",
] as const;

export type Prestasi = {
  namaKegiatan: string;
  sumber: string;
  tingkat: string;
  peringkat: string;
  tahun: string;
  penyelenggara: string;
};

export function prestasiKosong(): Prestasi {
  return {
    namaKegiatan: "",
    sumber: "",
    tingkat: "",
    peringkat: "",
    tahun: "",
    penyelenggara: "",
  };
}

/* --------------------------------- Dokumen --------------------------------- */

export type BerkasDokumen = {
  /** Kunci spesifikasi dokumen, mis. "pas-foto". */
  kunci: string;
  /** Nama berkas asli dari perangkat peserta (untuk jejak audit). */
  namaAsli: string;
  /** Nama berkas pada media penyimpanan, mis. "pas-foto.jpg". */
  namaSimpan: string;
  ekstensi: string;
  ukuran: number;
  /** Keterangan tambahan, mis. "AKSELARASI" pada berkas rapor. */
  keterangan: string;
  diunggahPada: number;
};

/* ------------------------------- Pendaftaran ------------------------------- */

export type Pendaftaran = {
  biodata: Biodata;
  ortu: DataOrtu;
  akademik: NilaiAkademik;
  prestasi: Prestasi[];
  /**
   * Waktu bagian prestasi terakhir disimpan siswa.
   *
   * Prestasi boleh kosong, sehingga daftar kosong saja tidak dapat dibedakan
   * antara "tidak punya prestasi" dan "belum dibuka sama sekali". Penanda ini
   * yang membedakannya: selama belum ada, bagian prestasi dihitung belum
   * selesai — bukan langsung tercentang hijau.
   */
  prestasiDisimpanPada?: number;
  /** Berkas terunggah, dikunci oleh `kunci` spesifikasi dokumen. */
  dokumen: Record<string, BerkasDokumen>;
  diperbaruiPada: number;
};

export function pendaftaranKosong(): Pendaftaran {
  return {
    biodata: biodataKosong(),
    ortu: ortuKosong(),
    akademik: akademikKosong(),
    prestasi: [],
    prestasiDisimpanPada: undefined,
    dokumen: {},
    diperbaruiPada: 0,
  };
}
