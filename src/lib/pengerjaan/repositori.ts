import { randomUUID } from "node:crypto";

import {
  bacaBanyakJson,
  bacaJson,
  cobaSimpan,
  daftarKunci,
  hapusKunci,
  tulisJson,
} from "@/lib/penyimpanan";

import type { BerkasPeserta, Percobaan } from "@/lib/pengerjaan/tipe";

/**
 * Penyimpanan pengerjaan ujian.
 *
 * Implementasi saat ini memakai berkas JSON per peserta pada folder `.data/`
 * di luar direktori sumber. Seluruh operasi berjalan di server; berkas ini
 * adalah satu-satunya lapisan yang menyentuh media penyimpanan, sehingga
 * penggantian ke database sungguhan cukup mengubah isi file ini.
 *
 * Modul ini hanya boleh diimpor dari Server Component atau Server Action.
 */

/** Awalan kunci penyimpanan seluruh catatan pengerjaan. */
export const AWALAN_PENGERJAAN = "pengerjaan/";

function kunciPeserta(studentId: string) {
  const aman = studentId.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${AWALAN_PENGERJAAN}${aman}.json`;
}

/** Seluruh id peserta yang memiliki catatan pengerjaan. */
export async function daftarIdPeserta(): Promise<string[]> {
  const kunci = await daftarKunci(AWALAN_PENGERJAAN);
  return kunci
    .filter((item) => item.endsWith(".json"))
    .map((item) => item.slice(AWALAN_PENGERJAAN.length, -".json".length));
}

export function buatIdPercobaan() {
  return randomUUID();
}

/* --------------------------- Penguncian per peserta ------------------------ */

const antrean = new Map<string, Promise<unknown>>();

/**
 * Menjalankan operasi baca-ubah-tulis satu peserta secara berurutan.
 *
 * Tanpa ini, dua permintaan yang datang bersamaan (mis. penyimpanan jawaban dan
 * pencatatan pelanggaran) sama-sama membaca berkas versi lama lalu menimpanya,
 * sehingga perubahan salah satunya hilang.
 *
 * Kunci ini hidup di memori proses: ia menyerialkan permintaan pada satu
 * instance server. Penjagaan lintas instance baru diperoleh setelah lapisan
 * penyimpanan diganti database dengan transaksi.
 */
export function denganKunci<T>(
  studentId: string,
  tugas: () => Promise<T>,
): Promise<T> {
  const sebelumnya = antrean.get(studentId) ?? Promise.resolve();
  const berikutnya = sebelumnya.then(tugas, tugas);

  // Rantai penantian tidak boleh putus karena kegagalan salah satu tugas.
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

export async function bacaBerkas(studentId: string): Promise<BerkasPeserta> {
  const data = await bacaJson<BerkasPeserta>(kunciPeserta(studentId));
  if (!data || !Array.isArray(data.percobaan)) {
    return { student_id: studentId, percobaan: [] };
  }
  return data;
}

/**
 * Membaca catatan pengerjaan banyak peserta sekaligus.
 *
 * Panel admin selalu membutuhkan seluruhnya; satu perjalanan ke penyimpanan
 * jauh lebih cepat daripada satu perjalanan per peserta.
 */
export async function bacaBerkasBanyak(
  daftarId: string[],
): Promise<BerkasPeserta[]> {
  const peta = await bacaBanyakJson<BerkasPeserta>(
    daftarId.map(kunciPeserta),
  );

  return daftarId.map((id) => {
    const data = peta.get(kunciPeserta(id));
    return data && Array.isArray(data.percobaan)
      ? data
      : { student_id: id, percobaan: [] };
  });
}

export type HasilTulis = { ok: true } | { ok: false; pesan: string };

export async function tulisBerkas(data: BerkasPeserta): Promise<HasilTulis> {
  const hasil = await cobaSimpan(
    () => tulisJson(kunciPeserta(data.student_id), data),
    "Gagal menyimpan pengerjaan.",
  );
  return hasil.ok ? { ok: true } : { ok: false, pesan: hasil.pesan };
}

export async function daftarPercobaan(studentId: string): Promise<Percobaan[]> {
  const berkas = await bacaBerkas(studentId);
  return berkas.percobaan;
}

export async function percobaanBerjalan(studentId: string) {
  const semua = await daftarPercobaan(studentId);
  return semua.find((item) => item.status === "berlangsung") ?? null;
}

export async function simpanPercobaan(
  studentId: string,
  percobaan: Percobaan,
): Promise<HasilTulis> {
  const berkas = await bacaBerkas(studentId);
  const indeks = berkas.percobaan.findIndex((item) => item.id === percobaan.id);
  const daftar = [...berkas.percobaan];
  if (indeks >= 0) daftar[indeks] = percobaan;
  else daftar.push(percobaan);

  return tulisBerkas({ student_id: studentId, percobaan: daftar });
}

/** Mengosongkan riwayat pengerjaan peserta, berkasnya tetap ada. */
export async function hapusSemuaPercobaan(studentId: string) {
  return tulisBerkas({ student_id: studentId, percobaan: [] });
}

/**
 * Menghapus berkas pengerjaan peserta sepenuhnya. Dipakai saat peserta dihapus
 * dari sistem sehingga tidak menyisakan berkas yatim yang masih terbaca panel
 * admin. Berkas yang memang tidak ada bukan kegagalan.
 */
export async function hapusBerkasPeserta(
  studentId: string,
): Promise<HasilTulis> {
  const hasil = await cobaSimpan(
    () => hapusKunci(kunciPeserta(studentId)),
    "Gagal menghapus data pengerjaan.",
  );
  return hasil.ok ? { ok: true } : { ok: false, pesan: hasil.pesan };
}
