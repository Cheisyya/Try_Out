import {
  bacaBanyakJson,
  bacaBiner,
  cobaSimpan,
  hapusAwalan,
  hapusKunci,
  tulisBiner,
  bacaJson,
  tulisJson,
} from "@/lib/penyimpanan";
import {
  cariDokumen,
  ekstensiDari,
  EKSTENSI_FORMAT,
  formatDariEkstensi,
  labelFormat,
  labelUkuran,
  MIME_FORMAT,
  type FormatBerkas,
  type SpesifikasiDokumen,
} from "@/lib/pendaftaran/dokumen";
import {
  akademikKosong,
  biodataKosong,
  ortuKosong,
  pendaftaranKosong,
  type BerkasDokumen,
  type Pendaftaran,
} from "@/lib/pendaftaran/tipe";

/**
 * Penyimpanan data pendaftaran siswa.
 *
 * Mengikuti pola penyimpanan pengerjaan ujian: satu berkas JSON per peserta
 * pada folder `.data/` (dapat dipindah lewat `DATA_DIR`), sementara berkas
 * unggahan disimpan pada folder per peserta di luar `public/` sehingga tidak
 * dapat diakses tanpa melewati pemeriksaan sesi.
 *
 * Modul ini hanya boleh diimpor dari Server Component atau Server Action.
 */

export const AWALAN_PENDAFTARAN = "pendaftaran/";
export const AWALAN_BERKAS = "berkas-siswa/";

/** Id peserta berasal dari sesi, tetap dibersihkan sebelum menjadi kunci. */
function idAman(studentId: string) {
  return studentId.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function kunciData(studentId: string) {
  return `${AWALAN_PENDAFTARAN}${idAman(studentId)}.json`;
}

function kunciBerkas(studentId: string, namaSimpan: string) {
  return `${AWALAN_BERKAS}${idAman(studentId)}/${namaSimpan}`;
}

/* --------------------------- Penguncian per peserta ------------------------ */

const antrean = new Map<string, Promise<unknown>>();

/**
 * Menyerialkan operasi baca-ubah-tulis milik satu peserta. Tanpa ini, dua
 * unggahan yang datang bersamaan sama-sama membaca berkas versi lama lalu
 * menimpanya sehingga salah satu catatan hilang.
 */
function denganKunci<T>(studentId: string, tugas: () => Promise<T>): Promise<T> {
  const sebelumnya = antrean.get(studentId) ?? Promise.resolve();
  const berikutnya = sebelumnya.then(tugas, tugas);

  const penanda = berikutnya.then(
    () => undefined,
    () => undefined,
  );
  antrean.set(studentId, penanda);
  void penanda.then(() => {
    if (antrean.get(studentId) === penanda) antrean.delete(studentId);
  });

  return berikutnya;
}

/* ---------------------------------- Baca ---------------------------------- */

/** Melengkapi data lama yang belum memiliki seluruh bagian. */
function rapikan(data: Partial<Pendaftaran>): Pendaftaran {
  const kosong = pendaftaranKosong();
  return {
    biodata: { ...biodataKosong(), ...(data.biodata ?? {}) },
    ortu: { ...ortuKosong(), ...(data.ortu ?? {}) },
    akademik: { ...akademikKosong(), ...(data.akademik ?? {}) },
    prestasi: Array.isArray(data.prestasi) ? data.prestasi : [],
    prestasiDisimpanPada: data.prestasiDisimpanPada,
    dokumen: data.dokumen ?? {},
    diperbaruiPada: data.diperbaruiPada ?? kosong.diperbaruiPada,
  };
}

export async function bacaPendaftaran(studentId: string): Promise<Pendaftaran> {
  const data = await bacaJson<Partial<Pendaftaran>>(kunciData(studentId));
  return data ? rapikan(data) : pendaftaranKosong();
}

/**
 * Membaca data seluruh peserta sekaligus untuk panel admin — satu perjalanan ke
 * penyimpanan, bukan satu perjalanan per peserta.
 */
export async function bacaSemuaPendaftaran(
  daftarId: string[],
): Promise<Map<string, Pendaftaran>> {
  const peta = await bacaBanyakJson<Partial<Pendaftaran>>(
    daftarId.map(kunciData),
  );

  return new Map(
    daftarId.map((id) => {
      const data = peta.get(kunciData(id));
      return [id, data ? rapikan(data) : pendaftaranKosong()] as const;
    }),
  );
}

/* ---------------------------------- Tulis --------------------------------- */

export type HasilSimpan = { ok: true } | { ok: false; masalah: string[] };

/**
 * Mengubah sebagian data pendaftaran secara aman: membaca versi terbaru,
 * menerapkan perubahan, lalu menulis kembali di dalam kunci per peserta.
 *
 * Fungsi `ubah` boleh ikut menulis berkas unggahan; bila penulisan itu gagal,
 * kegagalannya ikut tertangkap di sini sehingga tidak ada galat yang lolos ke
 * halaman.
 */
export async function ubahPendaftaran(
  studentId: string,
  ubah: (data: Pendaftaran) => Pendaftaran | Promise<Pendaftaran>,
): Promise<HasilSimpan> {
  return denganKunci(studentId, async () => {
    const hasil = await cobaSimpan(async () => {
      const lama = await bacaPendaftaran(studentId);
      const baru = await ubah(lama);
      baru.diperbaruiPada = Date.now();
      await tulisJson(kunciData(studentId), baru);
    }, "Gagal menyimpan data pendaftaran.");

    return hasil.ok
      ? { ok: true as const }
      : { ok: false as const, masalah: [hasil.pesan] };
  });
}

/* --------------------------- Pemeriksaan berkas --------------------------- */

/**
 * Isi berkas diperiksa lewat magic bytes; tipe MIME yang dikirim peramban tidak
 * dipercaya begitu saja karena mudah dipalsukan.
 */
function cocokMagic(bytes: Uint8Array, format: FormatBerkas) {
  const awalan = (nilai: number[]) => nilai.every((byte, i) => bytes[i] === byte);

  switch (format) {
    case "pdf":
      // "%PDF-"
      return awalan([0x25, 0x50, 0x44, 0x46, 0x2d]);
    case "jpg":
      return awalan([0xff, 0xd8, 0xff]);
    case "png":
      return awalan([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }
}

export type HasilPeriksaBerkas =
  | { ok: true; format: FormatBerkas; ekstensi: string; isi: Uint8Array }
  | { ok: false; masalah: string };

/**
 * Pemeriksaan berlapis sebelum berkas diterima:
 * 1. berkas tidak kosong dan tidak melebihi batas ukuran;
 * 2. ekstensi nama berkas termasuk format yang diizinkan dokumen tersebut;
 * 3. tipe MIME dari peramban juga cocok dengan format yang sama;
 * 4. isi berkas diperiksa lewat magic bytes.
 */
export async function periksaBerkas(
  spek: SpesifikasiDokumen,
  berkas: File,
): Promise<HasilPeriksaBerkas> {
  if (berkas.size === 0) {
    return { ok: false, masalah: "Berkas kosong. Pilih berkas yang lain." };
  }
  if (berkas.size > spek.maksByte) {
    return {
      ok: false,
      masalah: `Ukuran berkas maksimal ${labelUkuran(spek.maksByte)} untuk ${spek.judul}.`,
    };
  }

  const ekstensi = ekstensiDari(berkas.name);
  const format = formatDariEkstensi(spek, ekstensi);
  if (!format) {
    return {
      ok: false,
      masalah: `Format berkas harus ${labelFormat(spek)}. Berkas ".${ekstensi || "tanpa ekstensi"}" tidak diterima.`,
    };
  }

  const mime = berkas.type.toLowerCase();
  if (mime && !MIME_FORMAT[format].includes(mime)) {
    return {
      ok: false,
      masalah: `Jenis berkas (${mime}) tidak sesuai dengan ekstensi ${EKSTENSI_FORMAT[format][0]}.`,
    };
  }

  const isi = new Uint8Array(await berkas.arrayBuffer());
  if (isi.byteLength > spek.maksByte) {
    return {
      ok: false,
      masalah: `Ukuran berkas maksimal ${labelUkuran(spek.maksByte)} untuk ${spek.judul}.`,
    };
  }
  if (!cocokMagic(isi, format)) {
    return {
      ok: false,
      masalah: `Isi berkas bukan ${format.toUpperCase()} yang sah meskipun namanya berakhiran .${ekstensi}. Unggah berkas aslinya, jangan hasil penggantian nama.`,
    };
  }

  return { ok: true, format, ekstensi, isi };
}

/* ----------------------------- Simpan unggahan ---------------------------- */

/**
 * Menyimpan berkas dokumen. Nama berkas pada media penyimpanan memakai kunci
 * dokumen — bukan nama tampilan — supaya perubahan nama peserta tidak
 * memutuskan tautan ke berkas yang sudah ada. Nama tampilan sesuai ketentuan
 * panitia dibentuk saat berkas diunduh.
 */
export async function simpanDokumen(
  studentId: string,
  spek: SpesifikasiDokumen,
  berkas: File,
  keterangan: string,
): Promise<HasilSimpan> {
  const periksa = await periksaBerkas(spek, berkas);
  if (!periksa.ok) return { ok: false, masalah: [periksa.masalah] };

  const namaSimpan = `${spek.kunci}.${periksa.ekstensi}`;

  return ubahPendaftaran(studentId, async (data) => {
    await tulisBiner(kunciBerkas(studentId, namaSimpan), periksa.isi);

    // Unggahan ulang dengan ekstensi berbeda menyisakan berkas lama.
    const sebelumnya = data.dokumen[spek.kunci];
    if (sebelumnya && sebelumnya.namaSimpan !== namaSimpan) {
      await hapusKunci(
        kunciBerkas(studentId, sebelumnya.namaSimpan),
      ).catch(() => {});
    }

    const catatan: BerkasDokumen = {
      kunci: spek.kunci,
      namaAsli: berkas.name.slice(0, 160),
      namaSimpan,
      ekstensi: periksa.ekstensi,
      ukuran: periksa.isi.byteLength,
      keterangan: keterangan.trim().slice(0, 80),
      diunggahPada: Date.now(),
    };

    return { ...data, dokumen: { ...data.dokumen, [spek.kunci]: catatan } };
  });
}

export async function hapusDokumen(
  studentId: string,
  kunci: string,
): Promise<HasilSimpan> {
  const spek = cariDokumen(kunci);
  if (!spek) return { ok: false, masalah: ["Dokumen tidak dikenal."] };

  return ubahPendaftaran(studentId, async (data) => {
    const catatan = data.dokumen[kunci];
    if (catatan) {
      await hapusKunci(kunciBerkas(studentId, catatan.namaSimpan)).catch(
        () => {},
      );
    }

    const dokumen = { ...data.dokumen };
    delete dokumen[kunci];
    return { ...data, dokumen };
  });
}

/** Membaca isi berkas unggahan untuk pratinjau maupun penyusunan ZIP. */
export async function bacaBerkasDokumen(
  studentId: string,
  catatan: BerkasDokumen,
): Promise<Buffer | null> {
  return bacaBiner(kunciBerkas(studentId, catatan.namaSimpan));
}

/**
 * Menghapus seluruh jejak pendaftaran seorang peserta.
 * Kegagalan penghapusan tidak boleh menggagalkan penghapusan akunnya.
 */
export async function hapusPendaftaran(studentId: string) {
  await hapusKunci(kunciData(studentId)).catch(() => {});
  await hapusAwalan(`${AWALAN_BERKAS}${idAman(studentId)}/`).catch(() => {});
}
