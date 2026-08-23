import {
  AGAMA,
  JALUR_PENDAFTARAN,
  JENIS_KELAMIN,
  JUMLAH_SEMESTER,
  MAKS_PRESTASI,
  MAPEL_AKADEMIK,
  PEMINATAN,
  PERINGKAT_PRESTASI,
  SUMBER_PRESTASI,
  TINGKAT_PRESTASI,
  UKURAN_BAJU,
  type Biodata,
  type DataOrtu,
  type NilaiAkademik,
  type Prestasi,
} from "@/lib/pendaftaran/tipe";

/**
 * Validasi isian pendaftaran.
 *
 * Seluruh aturan di sini dijalankan ulang di server (Server Action) sehingga
 * pemeriksaan pada peramban hanya berperan mempercepat umpan balik, bukan
 * sebagai penjaga.
 */

const POLA_NISN = /^\d{10}$/;
const POLA_KODE_POS = /^\d{5}$/;
const POLA_TELEPON = /^[0-9+()\s-]{6,20}$/;
const POLA_TANGGAL = /^\d{4}-\d{2}-\d{2}$/;

function wajib(masalah: string[], nilai: string, label: string) {
  if (!nilai.trim()) masalah.push(`${label} wajib diisi.`);
}

function pilihan(
  masalah: string[],
  nilai: string,
  daftar: readonly string[],
  label: string,
) {
  if (!nilai.trim()) {
    masalah.push(`${label} wajib dipilih.`);
  } else if (!daftar.includes(nilai)) {
    masalah.push(`${label} tidak dikenal.`);
  }
}

function angka(
  masalah: string[],
  nilai: string,
  label: string,
  batas: { min: number; maks: number },
  opsional = false,
) {
  const teks = nilai.trim();
  if (!teks) {
    if (!opsional) masalah.push(`${label} wajib diisi.`);
    return;
  }
  const n = Number(teks.replace(",", "."));
  if (!Number.isFinite(n)) {
    masalah.push(`${label} harus berupa angka.`);
    return;
  }
  if (n < batas.min || n > batas.maks) {
    masalah.push(`${label} harus antara ${batas.min} dan ${batas.maks}.`);
  }
}

/* --------------------------------- Biodata -------------------------------- */

export function validasiBiodata(data: Biodata): string[] {
  const masalah: string[] = [];

  pilihan(masalah, data.jalurPendaftaran, JALUR_PENDAFTARAN, "Jalur Pendaftaran");
  pilihan(masalah, data.peminatan, PEMINATAN, "Peminatan");
  pilihan(masalah, data.jenisKelamin, JENIS_KELAMIN, "Jenis Kelamin");
  pilihan(masalah, data.agama, AGAMA, "Agama");

  if (!POLA_NISN.test(data.nisn.trim())) {
    masalah.push("NISN harus berupa 10 digit angka.");
  }

  wajib(masalah, data.namaLengkap, "Nama Lengkap");
  if (data.namaLengkap.trim().length > 80) {
    masalah.push("Nama Lengkap maksimal 80 karakter.");
  }

  wajib(masalah, data.tempatLahir, "Tempat Lahir");

  if (!POLA_TANGGAL.test(data.tanggalLahir)) {
    masalah.push("Tanggal Lahir wajib diisi dengan format tanggal yang sah.");
  } else {
    const lahir = new Date(`${data.tanggalLahir}T00:00:00`);
    if (Number.isNaN(lahir.getTime()) || lahir.getTime() > Date.now()) {
      masalah.push("Tanggal Lahir tidak boleh melewati hari ini.");
    }
  }

  // Sumbangan sukarela boleh nol, tetapi harus berupa angka bila diisi.
  angka(masalah, data.sumbanganSukarela, "Sumbangan Sukarela", {
    min: 0,
    maks: 1_000_000_000,
  });

  /* Data pendukung */
  wajib(masalah, data.namaSmp, "Nama SMP / Setingkat");
  wajib(masalah, data.provinsiSekolah, "Provinsi Sekolah");
  wajib(masalah, data.kabupatenSekolah, "Kabupaten/Kota Sekolah");
  wajib(masalah, data.kecamatanSekolah, "Kecamatan Sekolah");
  wajib(masalah, data.kelurahanSekolah, "Kelurahan Sekolah");

  if (!POLA_KODE_POS.test(data.kodePosSekolah.trim())) {
    masalah.push("Kode Pos Sekolah harus berupa 5 digit angka.");
  }

  wajib(masalah, data.hobi, "Hobi");
  wajib(masalah, data.citaCita, "Cita Cita");
  wajib(masalah, data.imunisasi, "Imunisasi");

  angka(masalah, data.tinggiBadan, "Tinggi Badan", { min: 100, maks: 220 });
  angka(masalah, data.beratBadan, "Berat Badan", { min: 25, maks: 200 });
  angka(masalah, data.ukuranSepatu, "Ukuran Sepatu", { min: 30, maks: 50 });
  pilihan(masalah, data.ukuranBaju, UKURAN_BAJU, "Ukuran Baju");
  angka(masalah, data.ukuranCelana, "Ukuran Celana / Rok", { min: 20, maks: 50 });

  return masalah;
}

/* ------------------------------ Orang Tua/Wali ----------------------------- */

export function validasiOrtu(data: DataOrtu): string[] {
  const masalah: string[] = [];

  wajib(masalah, data.namaAyah, "Nama Ayah / Wali");
  wajib(masalah, data.namaIbu, "Nama Ibu / Wali");
  wajib(masalah, data.sukuAyah, "Suku Ayah");
  wajib(masalah, data.sukuIbu, "Suku Ibu");
  wajib(masalah, data.pekerjaanAyah, "Pekerjaan Ayah");
  wajib(masalah, data.pekerjaanIbu, "Pekerjaan Ibu");
  wajib(masalah, data.penghasilanAyah, "Penghasilan Ayah");
  wajib(masalah, data.penghasilanIbu, "Penghasilan Ibu");

  // Telepon rumah boleh kosong — banyak keluarga sudah tidak memakainya.
  if (data.teleponRumah.trim() && !POLA_TELEPON.test(data.teleponRumah.trim())) {
    masalah.push("Telepon Rumah hanya boleh berisi angka, spasi, +, -, dan tanda kurung.");
  }
  if (!data.teleponSeluler.trim()) {
    masalah.push("Telepon Seluler wajib diisi.");
  } else if (!POLA_TELEPON.test(data.teleponSeluler.trim())) {
    masalah.push("Telepon Seluler hanya boleh berisi angka, spasi, +, -, dan tanda kurung.");
  }

  wajib(masalah, data.alamatRumah, "Alamat Rumah");
  wajib(masalah, data.provinsi, "Provinsi");
  wajib(masalah, data.kabupaten, "Kabupaten / Kota");
  wajib(masalah, data.kecamatan, "Kecamatan");
  wajib(masalah, data.kelurahan, "Kelurahan");

  if (!POLA_KODE_POS.test(data.kodePos.trim())) {
    masalah.push("Kode Pos harus berupa 5 digit angka.");
  }

  return masalah;
}

/* -------------------------------- Akademik -------------------------------- */

/**
 * Nilai rapor semester 1–4. Semester 4 boleh kosong untuk siswa akselerasi,
 * sehingga yang dipaksakan hanya semester 1–3.
 */
export function validasiAkademik(data: NilaiAkademik): string[] {
  const masalah: string[] = [];

  for (const mapel of MAPEL_AKADEMIK) {
    const nilai = data[mapel] ?? [];
    for (let i = 0; i < JUMLAH_SEMESTER; i += 1) {
      const teks = (nilai[i] ?? "").trim();
      const label = `Nilai ${mapel} semester ${i + 1}`;

      if (!teks) {
        if (i < 3) masalah.push(`${label} wajib diisi.`);
        continue;
      }

      const n = Number(teks.replace(",", "."));
      if (!Number.isFinite(n)) {
        masalah.push(`${label} harus berupa angka.`);
      } else if (n < 0 || n > 100) {
        masalah.push(`${label} harus antara 0 dan 100.`);
      }
    }
  }

  return masalah;
}

/* -------------------------------- Prestasi -------------------------------- */

export function validasiPrestasi(daftar: Prestasi[]): string[] {
  const masalah: string[] = [];

  if (daftar.length > MAKS_PRESTASI) {
    masalah.push(`Maksimal ${MAKS_PRESTASI} data prestasi tertinggi.`);
  }

  const tahunIni = new Date().getFullYear();

  daftar.forEach((item, i) => {
    const urut = i + 1;
    wajib(masalah, item.namaKegiatan, `Nama kegiatan prestasi ${urut}`);
    pilihan(masalah, item.sumber, SUMBER_PRESTASI, `Sumber prestasi ${urut}`);
    pilihan(masalah, item.tingkat, TINGKAT_PRESTASI, `Tingkat prestasi ${urut}`);
    pilihan(
      masalah,
      item.peringkat,
      PERINGKAT_PRESTASI,
      `Peringkat prestasi ${urut}`,
    );
    wajib(masalah, item.penyelenggara, `Penyelenggara prestasi ${urut}`);

    angka(masalah, item.tahun, `Tahun prestasi ${urut}`, {
      min: tahunIni - 10,
      maks: tahunIni,
    });
  });

  return masalah;
}
