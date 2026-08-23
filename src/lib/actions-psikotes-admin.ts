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
  hapusPaketPsikotes,
  hapusSoalPsikotes,
  perbaruiPaketPsikotes,
  perbaruiPasanganEpps,
  perbaruiSesiPsikotes,
  perbaruiSoalPsikotes,
  setAktifButirPsikotes,
  setAktifPaketPsikotes,
  tambahBanyakSoalPsikotes,
  tambahPaketPsikotes,
  tambahSoalPsikotes,
  type MasukanSoalSkor,
} from "@/lib/psikotes/repositori";
import { HURUF_PSIKOTES, type HurufPsikotes } from "@/lib/psikotes/tipe";

/**
 * Server Action pengelolaan bank soal psikotes (khusus admin).
 *
 * Setiap aksi memeriksa ulang sesi admin lewat `wajibSesi`; tidak ada jalur
 * tulis yang mengandalkan penjagaan di sisi klien. Seluruh validasi isi berada
 * di repositori, sehingga aksi di sini hanya bertugas membaca formulir,
 * memanggil repositori, lalu menyegarkan halaman yang terpengaruh.
 */

export type HasilAksiAdmin =
  | { ok: true; pesan: string }
  | { ok: false; masalah: string[] };

const MAKS_BYTE = 8 * 1024 * 1024;

function segarkan(paketId: string) {
  revalidatePath("/admin/psikotes");
  revalidatePath("/admin/psikotes/soal");
  revalidatePath("/siswa/psikotes");
  revalidatePath(`/siswa/psikotes/${paketId}`);
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

function bacaSoal(formData: FormData): MasukanSoalSkor {
  const kunci = teks(formData, "kunci").toUpperCase();
  return {
    kategori: teks(formData, "kategori"),
    pertanyaan: teks(formData, "pertanyaan"),
    opsi: {
      A: teks(formData, "opsiA"),
      B: teks(formData, "opsiB"),
      C: teks(formData, "opsiC"),
      D: teks(formData, "opsiD"),
    },
    kunci: (HURUF_PSIKOTES as readonly string[]).includes(kunci)
      ? (kunci as HurufPsikotes)
      : ("A" as HurufPsikotes),
    pembahasan: teks(formData, "pembahasan"),
    aktif: centang(formData, "aktif"),
  };
}

/* -------------------------------------------------------------------------- */
/*                                Paket & sesi                                */
/* -------------------------------------------------------------------------- */

export async function simpanPaketPsikotesAksi(
  _prev: HasilAksiAdmin | null,
  formData: FormData,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const paketId = teks(formData, "paketId");
  const hasil = await perbaruiPaketPsikotes(paketId, {
    nama: teks(formData, "nama"),
    deskripsi: teks(formData, "deskripsi"),
    aktif: centang(formData, "aktif"),
  });
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Paket psikotes tersimpan." };
}

export async function simpanSesiPsikotesAksi(
  _prev: HasilAksiAdmin | null,
  formData: FormData,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const paketId = teks(formData, "paketId");
  const hasil = await perbaruiSesiPsikotes(paketId, teks(formData, "sesiId"), {
    nama: teks(formData, "nama"),
    ringkas: teks(formData, "ringkas"),
    petunjuk: teks(formData, "petunjuk"),
    durasiMenit: angka(formData, "durasiMenit"),
    aktif: centang(formData, "aktif"),
  });
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Sesi tersimpan." };
}

export async function tambahPaketPsikotesAksi(
  _prev: HasilAksiAdmin | null,
  formData: FormData,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const hasil = await tambahPaketPsikotes(teks(formData, "nama"));
  if (!hasil.ok) return hasil;

  segarkan(hasil.data.id);
  return { ok: true, pesan: `Paket "${hasil.data.nama}" dibuat.` };
}

export async function hapusPaketPsikotesAksi(
  paketId: string,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const hasil = await hapusPaketPsikotes(paketId);
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Paket dihapus." };
}

export async function ubahAktifPaketPsikotesAksi(
  paketId: string,
  aktif: boolean,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const tujuan = aktif === true;
  const hasil = await setAktifPaketPsikotes(paketId, tujuan);
  if (!hasil.ok) return hasil;

  // Hanya segarkan panel admin. Halaman siswa memakai cookies() dan notFound()
  // bila paket dimatikan; merevalidasinya dari sesi admin membuat Next.js
  // menelan redirect/404 dan menjatuhkan halaman ini.
  revalidatePath("/admin/psikotes");
  return {
    ok: true,
    pesan: tujuan ? "Paket diaktifkan." : "Paket dinonaktifkan.",
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Butir                                    */
/* -------------------------------------------------------------------------- */

export async function tambahSoalPsikotesAksi(
  _prev: HasilAksiAdmin | null,
  formData: FormData,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const paketId = teks(formData, "paketId");
  const hasil = await tambahSoalPsikotes(
    paketId,
    teks(formData, "sesiId"),
    bacaSoal(formData),
  );
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Soal ditambahkan." };
}

export async function simpanSoalPsikotesAksi(
  _prev: HasilAksiAdmin | null,
  formData: FormData,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const paketId = teks(formData, "paketId");
  const hasil = await perbaruiSoalPsikotes(
    paketId,
    teks(formData, "sesiId"),
    angka(formData, "nomor"),
    bacaSoal(formData),
  );
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Soal tersimpan." };
}

export async function simpanPasanganEppsAksi(
  _prev: HasilAksiAdmin | null,
  formData: FormData,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const paketId = teks(formData, "paketId");
  const hasil = await perbaruiPasanganEpps(
    paketId,
    teks(formData, "sesiId"),
    angka(formData, "nomor"),
    {
      teksA: teks(formData, "teksA"),
      dimensiA: teks(formData, "dimensiA"),
      teksB: teks(formData, "teksB"),
      dimensiB: teks(formData, "dimensiB"),
      aktif: centang(formData, "aktif"),
    },
  );
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Pasangan pernyataan tersimpan." };
}

export async function hapusSoalPsikotesAksi(
  paketId: string,
  sesiId: string,
  nomor: number,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const hasil = await hapusSoalPsikotes(paketId, sesiId, nomor);
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return { ok: true, pesan: "Soal dihapus." };
}

export async function setAktifButirPsikotesAksi(
  paketId: string,
  sesiId: string,
  nomor: number,
  aktif: boolean,
): Promise<HasilAksiAdmin> {
  await wajibSesi("admin");

  const hasil = await setAktifButirPsikotes(paketId, sesiId, nomor, aktif);
  if (!hasil.ok) return hasil;

  segarkan(paketId);
  return {
    ok: true,
    pesan: aktif ? "Butir diaktifkan." : "Butir dinonaktifkan.",
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

/**
 * Menyusun pratinjau impor.
 *
 * Tidak menyimpan apa pun: admin melihat lebih dahulu butir mana yang lolos dan
 * butir mana yang bermasalah beserta alasannya, lalu memutuskan sendiri apakah
 * impor dilanjutkan.
 */
export async function pratinjauImporPsikotesAksi(
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

  const kategoriBawaan = teks(formData, "kategori") || "Umum";
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
    validasiButir(butir, { jenis: "bebas", bawaan: kategoriBawaan }),
  );

  return rangkumPratinjau(
    sumber,
    berkas.berkas.name,
    baris,
    hasil.butir,
    hasil.catatan,
  );
}

export type HasilImporLatihan = {
  ok: boolean;
  tersimpan: number;
  dilewati: number;
  masalah: string[];
};

/**
 * Menyimpan butir yang lolos validasi.
 *
 * Seluruh butir divalidasi ulang di sini, bukan dipercaya dari pratinjau:
 * kiriman dari browser dapat disusun ulang, dan pratinjau hanyalah tampilan.
 */
export async function konfirmasiImporPsikotesAksi(
  paketId: string,
  sesiId: string,
  mentah: ButirMentah[],
  kategoriBawaan: string,
): Promise<HasilImporLatihan> {
  await wajibSesi("admin");

  const lolos: (MasukanSoalSkor & { baris: number })[] = [];
  let dilewati = 0;

  for (const butir of mentah) {
    const periksa = validasiButir(butir, {
      jenis: "bebas",
      bawaan: kategoriBawaan,
    });
    if (!periksa.valid) {
      dilewati += 1;
      continue;
    }
    lolos.push({
      baris: periksa.baris,
      kategori: periksa.kategori,
      pertanyaan: periksa.pertanyaan,
      opsi: periksa.opsi,
      kunci: periksa.kunci as HurufPsikotes,
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

  const hasil = await tambahBanyakSoalPsikotes(paketId, sesiId, lolos);
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
