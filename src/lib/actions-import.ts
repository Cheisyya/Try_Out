"use server";

import { revalidatePath } from "next/cache";

import { wajibSesi } from "@/lib/get-session";
import { buatBanyakSoal } from "@/lib/bank-soal/repositori";
import { bacaExcel } from "@/lib/import/excel";
import { bacaPdf } from "@/lib/import/pdf";
import { validasiBaris, validasiSemua } from "@/lib/import/validasi";
import { daftarSemuaPaket } from "@/lib/paket-tryout";
import {
  BATAS_BARIS,
  type BarisMentah,
  type BarisPratinjau,
  type HasilPratinjau,
} from "@/lib/import/tipe";

/**
 * Server Action impor massal bank soal (khusus admin).
 *
 * Pratinjau tidak menyimpan apa pun. Penyimpanan hanya terjadi pada
 * `konfirmasiImport`, dan seluruh baris divalidasi ulang di sana sehingga
 * pratinjau yang diubah dari sisi klien tidak dapat menyelipkan data cacat.
 */

const MAKS_BYTE = 8 * 1024 * 1024;

function kosong(sumber: "excel" | "pdf", namaBerkas: string, galat: string): HasilPratinjau {
  return {
    ok: false,
    galat,
    sumber,
    namaBerkas,
    baris: [],
    mentah: [],
    jumlahValid: 0,
    jumlahBermasalah: 0,
    catatan: [],
    dibuatPada: Date.now(),
  };
}

function rangkum(
  sumber: "excel" | "pdf",
  namaBerkas: string,
  baris: BarisPratinjau[],
  mentah: BarisMentah[],
  catatan: string[],
): HasilPratinjau {
  const jumlahValid = baris.filter((item) => item.valid).length;
  return {
    ok: true,
    sumber,
    namaBerkas,
    baris,
    mentah,
    jumlahValid,
    jumlahBermasalah: baris.length - jumlahValid,
    catatan,
    dibuatPada: Date.now(),
  };
}

async function ambilBerkas(formData: FormData, jenis: string[], namaField = "berkas") {
  const berkas = formData.get(namaField);
  if (!(berkas instanceof File) || berkas.size === 0) {
    return { ok: false as const, galat: "Pilih berkas terlebih dahulu." };
  }
  if (berkas.size > MAKS_BYTE) {
    return { ok: false as const, galat: "Ukuran berkas maksimal 8 MB." };
  }
  const namaCocok = jenis.some((ekstensi) =>
    berkas.name.toLowerCase().endsWith(ekstensi),
  );
  if (!namaCocok) {
    return {
      ok: false as const,
      galat: `Jenis berkas harus ${jenis.join(" atau ")}.`,
    };
  }
  return { ok: true as const, berkas };
}

/** Membaca berkas Excel dan menyusun pratinjau. */
export async function pratinjauExcel(
  _prev: HasilPratinjau | null,
  formData: FormData,
): Promise<HasilPratinjau> {
  await wajibSesi("admin");

  const berkas = await ambilBerkas(formData, [".xlsx"]);
  if (!berkas.ok) return kosong("excel", "", berkas.galat);

  const hasil = await bacaExcel(await berkas.berkas.arrayBuffer());
  if (!hasil.ok) return kosong("excel", berkas.berkas.name, hasil.galat);

  if (hasil.baris.length > BATAS_BARIS) {
    return kosong(
      "excel",
      berkas.berkas.name,
      `Berkas berisi ${hasil.baris.length} baris, melebihi batas ${BATAS_BARIS} baris per impor. Pecah menjadi beberapa berkas.`,
    );
  }

  const daftarPaket = await daftarSemuaPaket();

  /* Paket tujuan dipilih di layar, persis seperti impor PDF — berkas Excel
     tidak lagi memuat kolom package. Seluruh baris diarahkan ke paket yang
     dipilih, sehingga satu berkas dapat dipakai untuk paket mana pun. */
  const paketTujuan = String(formData.get("paket") ?? "").trim();
  const tujuan = daftarPaket.find((paket) => paket.id === paketTujuan);
  if (!tujuan) {
    return kosong(
      "excel",
      berkas.berkas.name,
      "Pilih paket tujuan terlebih dahulu.",
    );
  }

  for (const baris of hasil.baris) {
    baris.package = tujuan.id;
    // Sesi mengikuti penempatan mata uji pada paket tujuan, jadi kolom session
    // bawaan berkas tidak boleh ikut menentukan.
    baris.session = "";
  }

  return rangkum(
    "excel",
    berkas.berkas.name,
    validasiSemua(hasil.baris, daftarPaket),
    hasil.baris,
    [`Seluruh baris dimasukkan ke ${tujuan.nama}.`, ...hasil.catatan],
  );
}

/** Membaca berkas PDF, mengekstraksi soal, lalu menyusun pratinjau. */
export async function pratinjauPdf(
  _prev: HasilPratinjau | null,
  formData: FormData,
): Promise<HasilPratinjau> {
  await wajibSesi("admin");

  const berkas = await ambilBerkas(formData, [".pdf"]);
  if (!berkas.ok) return kosong("pdf", "", berkas.galat);

  const bawaan = {
    paket: String(formData.get("paket") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    difficulty: String(formData.get("difficulty") ?? "Medium").trim(),
  };

  if (!bawaan.paket || !bawaan.subject || !bawaan.category) {
    return kosong(
      "pdf",
      berkas.berkas.name,
      "Pilih paket, mata pelajaran, dan kategori materi sebelum mengunggah PDF.",
    );
  }

  const hasil = await bacaPdf(await berkas.berkas.arrayBuffer(), bawaan);
  if (!hasil.ok) return kosong("pdf", berkas.berkas.name, hasil.galat);

  if (hasil.baris.length > BATAS_BARIS) {
    return kosong(
      "pdf",
      berkas.berkas.name,
      `PDF menghasilkan ${hasil.baris.length} soal, melebihi batas ${BATAS_BARIS} per impor.`,
    );
  }

  return rangkum(
    "pdf",
    berkas.berkas.name,
    validasiSemua(hasil.baris, await daftarSemuaPaket()),
    hasil.baris,
    hasil.catatan,
  );
}

export type HasilKonfirmasi = {
  ok: boolean;
  tersimpan: number;
  gagal: { baris: number; masalah: string[] }[];
  pesan: string;
};

/**
 * Menyimpan baris hasil pratinjau ke bank soal. Baris divalidasi ulang di sini;
 * hanya baris yang lolos yang disimpan.
 */
export async function konfirmasiImport(
  baris: BarisMentah[],
): Promise<HasilKonfirmasi> {
  await wajibSesi("admin");

  if (!Array.isArray(baris) || baris.length === 0) {
    return { ok: false, tersimpan: 0, gagal: [], pesan: "Tidak ada baris untuk diimpor." };
  }
  if (baris.length > BATAS_BARIS) {
    return {
      ok: false,
      tersimpan: 0,
      gagal: [],
      pesan: `Jumlah baris melebihi batas ${BATAS_BARIS} per impor.`,
    };
  }

  // Konfigurasi paket dibaca sekali untuk seluruh berkas.
  const daftarPaket = await daftarSemuaPaket();
  const diperiksa = baris.map((item) => validasiBaris(item, daftarPaket));
  const gagal = diperiksa
    .filter((item) => !item.data)
    .map((item) => ({ baris: item.baris, masalah: item.masalah }));

  const siap = diperiksa
    .filter((item) => item.data)
    .map((item) => ({
      baris: item.baris,
      package_id: item.data!.package_id,
      subject: item.data!.subject,
      session: item.data!.session,
      category: item.data!.category,
      question: item.data!.question,
      options: item.data!.options,
      correct_answer: item.data!.correct_answer,
      difficulty: item.data!.difficulty,
      explanation: item.data!.explanation,
      image: item.data!.image
        ? { src: item.data!.image, alt: `Gambar pendukung soal ${item.baris}` }
        : undefined,
      active: true,
    }));

  if (siap.length === 0) {
    return {
      ok: false,
      tersimpan: 0,
      gagal,
      pesan: "Tidak ada baris yang lolos validasi, sehingga tidak ada data yang disimpan.",
    };
  }

  const hasil = await buatBanyakSoal(siap);
  revalidatePath("/admin", "layout");
  revalidatePath("/ujian", "layout");

  const semuaGagal = [...gagal, ...hasil.gagal];

  return {
    ok: hasil.tersimpan > 0,
    tersimpan: hasil.tersimpan,
    gagal: semuaGagal,
    pesan:
      semuaGagal.length === 0
        ? `${hasil.tersimpan} soal berhasil masuk bank soal.`
        : `${hasil.tersimpan} soal tersimpan, ${semuaGagal.length} baris dilewati.`,
  };
}
