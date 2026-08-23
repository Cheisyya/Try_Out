"use server";

import { revalidatePath } from "next/cache";

import { wajibSesi } from "@/lib/get-session";
import {
  BATAS_BUTIR,
  bacaExcelLatihan,
  bacaPdfLatihan,
  pratinjauGagal,
  rangkumPratinjau,
  validasiButir,
  type ButirMentah,
  type HasilPratinjauLatihan,
} from "@/lib/import/latihan";
import {
  hapusPaketIq,
  hapusSoalIq,
  perbaruiPaketIq,
  perbaruiSoalIq,
  setAktifPaketIq,
  setAktifSoalIq,
  tambahBanyakSoalIq,
  tambahPaketIq,
  tambahSoalIq,
  type MasukanSoalIq,
} from "@/lib/tes-iq/repositori";
import {
  HURUF_IQ,
  KATEGORI_IQ,
  type HurufIq,
  type KategoriIq,
} from "@/lib/tes-iq/tipe";

/**
 * Server Action pengelolaan bank soal Tes IQ (khusus admin).
 *
 * Kembarannya untuk psikotes ada di `@/lib/actions-psikotes-admin`; susunannya
 * sengaja dibuat sama supaya kedua panel admin berperilaku identik. Bedanya
 * hanya pada kategori, yang di sini terbatas pada empat jenis penalaran dan
 * karena itu divalidasi terhadap daftar tetap.
 */

export type HasilAksiIqAdmin =
  | { ok: true; pesan: string }
  | { ok: false; masalah: string[] };

const MAKS_BYTE = 8 * 1024 * 1024;

function segarkan(paketId: string) {
  // Hanya segarkan panel admin. Halaman siswa memakai cookies() dan notFound()
  // bila paket dimatikan; merevalidasinya dari sesi admin membuat Next.js
  // menelan redirect/404 dan menjatuhkan halaman ini — membuat tambah/edit/hapus
  // gagal secara silent.
  revalidatePath("/admin/tes-iq");
  revalidatePath("/admin/tes-iq/soal");
  void paketId; // dipertahankan untuk kompatibilitas pemanggil
}

function teks(formData: FormData, nama: string) {
  return String(formData.get(nama) ?? "").trim();
}

function angka(formData: FormData, nama: string) {
  return Number.parseInt(String(formData.get(nama) ?? ""), 10);
}

function centang(formData: FormData, nama: string) {
  return formData.get(nama) === "on" || formData.get(nama) === "true";
}

function bacaSoal(formData: FormData): MasukanSoalIq {
  const kunci = teks(formData, "kunci").toUpperCase();
  const kategori = teks(formData, "kategori");
  return {
    kategori: (KATEGORI_IQ as readonly string[]).includes(kategori)
      ? (kategori as KategoriIq)
      : ("Verbal" as KategoriIq),
    pertanyaan: teks(formData, "pertanyaan"),
    // Pola ditulis satu baris per baris agar deret dan matriks tetap rata; ia
    // dirender dengan huruf berlebar tetap di layar peserta.
    pola: teks(formData, "pola").split(/\r?\n/),
    opsi: {
      A: teks(formData, "opsiA"),
      B: teks(formData, "opsiB"),
      C: teks(formData, "opsiC"),
      D: teks(formData, "opsiD"),
    },
    kunci: (HURUF_IQ as readonly string[]).includes(kunci)
      ? (kunci as HurufIq)
      : ("A" as HurufIq),
    pembahasan: teks(formData, "pembahasan"),
    aktif: centang(formData, "aktif"),
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Paket                                    */
/* -------------------------------------------------------------------------- */

export async function simpanPaketIqAksi(
  _prev: HasilAksiIqAdmin | null,
  formData: FormData,
): Promise<HasilAksiIqAdmin> {
  await wajibSesi("admin");

  const paketId = teks(formData, "paketId");
  const hasil = await perbaruiPaketIq(paketId, {
    nama: teks(formData, "nama"),
    tingkat: teks(formData, "tingkat"),
    deskripsi: teks(formData, "deskripsi"),
    durasiMenit: angka(formData, "durasiMenit"),
    aktif: centang(formData, "aktif"),
  });
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Paket Tes IQ tersimpan." };
}

export async function tambahPaketIqAksi(
  _prev: HasilAksiIqAdmin | null,
  formData: FormData,
): Promise<HasilAksiIqAdmin> {
  await wajibSesi("admin");

  const hasil = await tambahPaketIq(teks(formData, "nama"));
  if (!hasil.ok) return hasil;

  segarkan(hasil.data.id);
  return { ok: true, pesan: `Paket "${hasil.data.nama}" dibuat.` };
}

export async function hapusPaketIqAksi(
  paketId: string,
): Promise<HasilAksiIqAdmin> {
  await wajibSesi("admin");

  const hasil = await hapusPaketIq(paketId);
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Paket dihapus." };
}

export async function ubahAktifPaketIqAksi(
  paketId: string,
  aktif: boolean,
): Promise<HasilAksiIqAdmin> {
  await wajibSesi("admin");

  const tujuan = aktif === true;
  const hasil = await setAktifPaketIq(paketId, tujuan);
  if (!hasil.ok) return hasil;

  // Hanya segarkan panel admin. Halaman siswa memakai cookies() dan notFound()
  // bila paket dimatikan; merevalidasinya dari sesi admin membuat Next.js
  // menelan redirect/404 dan menjatuhkan halaman ini.
  revalidatePath("/admin/tes-iq");
  return {
    ok: true,
    pesan: tujuan ? "Paket diaktifkan." : "Paket dinonaktifkan.",
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Butir                                    */
/* -------------------------------------------------------------------------- */

export async function tambahSoalIqAksi(
  _prev: HasilAksiIqAdmin | null,
  formData: FormData,
): Promise<HasilAksiIqAdmin> {
  await wajibSesi("admin");

  const paketId = teks(formData, "paketId");
  const hasil = await tambahSoalIq(paketId, bacaSoal(formData));
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Soal ditambahkan." };
}

export async function simpanSoalIqAksi(
  _prev: HasilAksiIqAdmin | null,
  formData: FormData,
): Promise<HasilAksiIqAdmin> {
  await wajibSesi("admin");

  const paketId = teks(formData, "paketId");
  const hasil = await perbaruiSoalIq(
    paketId,
    angka(formData, "nomor"),
    bacaSoal(formData),
  );
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Soal tersimpan." };
}

export async function hapusSoalIqAksi(
  paketId: string,
  nomor: number,
): Promise<HasilAksiIqAdmin> {
  await wajibSesi("admin");

  const hasil = await hapusSoalIq(paketId, nomor);
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Soal dihapus." };
}

export async function setAktifSoalIqAksi(
  paketId: string,
  nomor: number,
  aktif: boolean,
): Promise<HasilAksiIqAdmin> {
  await wajibSesi("admin");

  const hasil = await setAktifSoalIq(paketId, nomor, aktif);
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return {
    ok: true,
    pesan: aktif ? "Soal diaktifkan." : "Soal dinonaktifkan.",
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Impor                                    */
/* -------------------------------------------------------------------------- */

async function ambilBerkas(formData: FormData, jenis: string[]) {
  const berkas = formData.get("berkas");
  if (!(berkas instanceof File) || berkas.size === 0) {
    return { ok: false as const, galat: "Pilih berkas terlebih dahulu." };
  }
  if (berkas.size > MAKS_BYTE) {
    return { ok: false as const, galat: "Ukuran berkas maksimal 8 MB." };
  }
  if (!jenis.some((ekstensi) => berkas.name.toLowerCase().endsWith(ekstensi))) {
    return {
      ok: false as const,
      galat: `Jenis berkas harus ${jenis.join(" atau ")}.`,
    };
  }
  return { ok: true as const, berkas };
}

export async function pratinjauImporIqAksi(
  _prev: HasilPratinjauLatihan | null,
  formData: FormData,
): Promise<HasilPratinjauLatihan> {
  await wajibSesi("admin");

  const sumber = teks(formData, "sumber") === "excel" ? "excel" : "pdf";
  const berkas = await ambilBerkas(
    formData,
    sumber === "excel" ? [".xlsx"] : [".pdf"],
  );
  if (!berkas.ok) return pratinjauGagal(sumber, "", berkas.galat);

  const kategori = teks(formData, "kategori");
  const kategoriBawaan = (KATEGORI_IQ as readonly string[]).includes(kategori)
    ? kategori
    : KATEGORI_IQ[0];

  const isi = await berkas.berkas.arrayBuffer();
  const hasil =
    sumber === "excel"
      ? await bacaExcelLatihan(isi)
      : await bacaPdfLatihan(isi, kategoriBawaan);
  if (!hasil.ok) return pratinjauGagal(sumber, berkas.berkas.name, hasil.galat);

  if (hasil.butir.length > BATAS_BUTIR) {
    return pratinjauGagal(
      sumber,
      berkas.berkas.name,
      `Berkas berisi ${hasil.butir.length} butir, melebihi batas ${BATAS_BUTIR} butir per impor. Pecah menjadi beberapa berkas.`,
    );
  }

  const baris = hasil.butir.map((butir) =>
    validasiButir(butir, {
      jenis: "terbatas",
      pilihan: KATEGORI_IQ,
      bawaan: kategoriBawaan,
    }),
  );

  return rangkumPratinjau(
    sumber,
    berkas.berkas.name,
    baris,
    hasil.butir,
    hasil.catatan,
  );
}

export type HasilImporIq = {
  ok: boolean;
  tersimpan: number;
  dilewati: number;
  masalah: string[];
};

export async function konfirmasiImporIqAksi(
  paketId: string,
  mentah: ButirMentah[],
  kategoriBawaan: string,
): Promise<HasilImporIq> {
  await wajibSesi("admin");

  const bawaan = (KATEGORI_IQ as readonly string[]).includes(kategoriBawaan)
    ? kategoriBawaan
    : KATEGORI_IQ[0];

  const lolos: (MasukanSoalIq & { baris: number })[] = [];
  let dilewati = 0;

  for (const butir of mentah) {
    const periksa = validasiButir(butir, {
      jenis: "terbatas",
      pilihan: KATEGORI_IQ,
      bawaan,
    });
    if (!periksa.valid) {
      dilewati += 1;
      continue;
    }
    lolos.push({
      baris: periksa.baris,
      kategori: periksa.kategori as KategoriIq,
      pertanyaan: periksa.pertanyaan,
      pola: [],
      opsi: periksa.opsi,
      kunci: periksa.kunci as HurufIq,
      pembahasan: periksa.pembahasan,
      aktif: true,
    });
  }

  if (lolos.length === 0) {
    return {
      ok: false,
      tersimpan: 0,
      dilewati,
      masalah: ["Tidak ada butir yang lolos validasi."],
    };
  }

  const hasil = await tambahBanyakSoalIq(paketId, lolos);
  segarkan(paketId);

  return {
    ok: hasil.tersimpan > 0,
    tersimpan: hasil.tersimpan,
    dilewati: dilewati + hasil.gagal.length,
    masalah: hasil.gagal.flatMap((item) =>
      item.masalah.map((pesan) => `Butir ${item.baris}: ${pesan}`),
    ),
  };
}
