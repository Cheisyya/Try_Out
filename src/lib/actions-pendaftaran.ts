"use server";

import { revalidatePath } from "next/cache";

import { wajibFitur } from "@/lib/get-session";
import { cariDokumen } from "@/lib/pendaftaran/dokumen";
import {
  hapusDokumen,
  simpanDokumen,
  ubahPendaftaran,
} from "@/lib/pendaftaran/repositori";
import {
  akademikKosong,
  biodataKosong,
  JUMLAH_SEMESTER,
  MAKS_PRESTASI,
  MAPEL_AKADEMIK,
  ortuKosong,
  type Biodata,
  type DataOrtu,
  type NilaiAkademik,
  type Prestasi,
} from "@/lib/pendaftaran/tipe";
import {
  validasiAkademik,
  validasiBiodata,
  validasiOrtu,
  validasiPrestasi,
} from "@/lib/pendaftaran/validasi";

/**
 * Server Action pendaftaran data diri siswa.
 *
 * Peserta hanya pernah menulis ke datanya sendiri: identitas selalu diambil
 * dari sesi yang sudah terverifikasi, tidak pernah dari isian formulir. Seluruh
 * validasi dijalankan ulang di sini sehingga pemeriksaan pada peramban tidak
 * dapat dilewati.
 */

export type HasilAksiPendaftaran =
  | { ok: true }
  | { ok: false; masalah: string[] };

const PANJANG_MAKS = 200;

function teks(formData: FormData, nama: string, maks = PANJANG_MAKS) {
  return String(formData.get(nama) ?? "").trim().slice(0, maks);
}

function segarkan() {
  revalidatePath("/siswa", "layout");
  revalidatePath("/admin", "layout");
}

/* --------------------------------- Biodata -------------------------------- */

export async function simpanBiodataAksi(
  formData: FormData,
): Promise<HasilAksiPendaftaran> {
  const sesi = await wajibFitur("dataDiriAktif");

  const kunci = Object.keys(biodataKosong()) as (keyof Biodata)[];
  const biodata = kunci.reduce((hasil, nama) => {
    hasil[nama] = teks(formData, nama, nama === "namaLengkap" ? 80 : PANJANG_MAKS);
    return hasil;
  }, {} as Biodata);

  const masalah = validasiBiodata(biodata);
  if (masalah.length) return { ok: false, masalah };

  const hasil = await ubahPendaftaran(sesi.identitas, (data) => ({
    ...data,
    biodata,
  }));
  if (hasil.ok) segarkan();
  return hasil;
}

/* ------------------------------ Orang Tua/Wali ----------------------------- */

export async function simpanOrtuAksi(
  formData: FormData,
): Promise<HasilAksiPendaftaran> {
  const sesi = await wajibFitur("dataDiriAktif");

  const kunci = Object.keys(ortuKosong()) as (keyof DataOrtu)[];
  const ortu = kunci.reduce((hasil, nama) => {
    hasil[nama] = teks(formData, nama, nama === "alamatRumah" ? 300 : PANJANG_MAKS);
    return hasil;
  }, {} as DataOrtu);

  const masalah = validasiOrtu(ortu);
  if (masalah.length) return { ok: false, masalah };

  const hasil = await ubahPendaftaran(sesi.identitas, (data) => ({
    ...data,
    ortu,
  }));
  if (hasil.ok) segarkan();
  return hasil;
}

/* -------------------------------- Akademik -------------------------------- */

export async function simpanAkademikAksi(
  formData: FormData,
): Promise<HasilAksiPendaftaran> {
  const sesi = await wajibFitur("dataDiriAktif");

  const akademik = akademikKosong();
  for (const mapel of MAPEL_AKADEMIK) {
    for (let i = 0; i < JUMLAH_SEMESTER; i += 1) {
      akademik[mapel][i] = teks(formData, `${mapel}::${i}`, 6);
    }
  }

  const masalah = validasiAkademik(akademik);
  if (masalah.length) return { ok: false, masalah };

  const hasil = await ubahPendaftaran(sesi.identitas, (data) => ({
    ...data,
    akademik: akademik as NilaiAkademik,
  }));
  if (hasil.ok) segarkan();
  return hasil;
}

/* -------------------------------- Prestasi -------------------------------- */

export async function simpanPrestasiAksi(
  formData: FormData,
): Promise<HasilAksiPendaftaran> {
  const sesi = await wajibFitur("dataDiriAktif");

  const jumlah = Math.min(Number(formData.get("jumlah")) || 0, MAKS_PRESTASI);
  const prestasi: Prestasi[] = [];

  for (let i = 0; i < jumlah; i += 1) {
    const item: Prestasi = {
      namaKegiatan: teks(formData, `prestasi::${i}::namaKegiatan`, 120),
      sumber: teks(formData, `prestasi::${i}::sumber`),
      tingkat: teks(formData, `prestasi::${i}::tingkat`, 40),
      peringkat: teks(formData, `prestasi::${i}::peringkat`, 40),
      tahun: teks(formData, `prestasi::${i}::tahun`, 4),
      penyelenggara: teks(formData, `prestasi::${i}::penyelenggara`, 120),
    };

    // Baris yang benar-benar kosong diabaikan, bukan dianggap salah isi.
    const adaIsi = Object.values(item).some((nilai) => nilai !== "");
    if (adaIsi) prestasi.push(item);
  }

  const masalah = validasiPrestasi(prestasi);
  if (masalah.length) return { ok: false, masalah };

  const hasil = await ubahPendaftaran(sesi.identitas, (data) => ({
    ...data,
    prestasi,
    prestasiDisimpanPada: Date.now(),
  }));
  if (hasil.ok) segarkan();
  return hasil;
}

/* --------------------------------- Dokumen -------------------------------- */

export async function unggahDokumenAksi(
  formData: FormData,
): Promise<HasilAksiPendaftaran> {
  const sesi = await wajibFitur("dataDiriAktif");

  const spek = cariDokumen(teks(formData, "kunci", 60));
  if (!spek) return { ok: false, masalah: ["Jenis dokumen tidak dikenal."] };

  const berkas = formData.get("berkas");
  if (!(berkas instanceof File)) {
    return { ok: false, masalah: ["Pilih berkas terlebih dahulu."] };
  }

  const hasil = await simpanDokumen(
    sesi.identitas,
    spek,
    berkas,
    teks(formData, "keterangan", 80),
  );
  if (hasil.ok) segarkan();
  return hasil;
}

export async function hapusDokumenAksi(
  kunci: string,
): Promise<HasilAksiPendaftaran> {
  const sesi = await wajibFitur("dataDiriAktif");
  const hasil = await hapusDokumen(sesi.identitas, kunci);
  if (hasil.ok) segarkan();
  return hasil;
}
