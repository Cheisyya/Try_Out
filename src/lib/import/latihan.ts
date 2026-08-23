import ExcelJS from "exceljs";

import { bacaPdf } from "@/lib/import/pdf";

/**
 * Impor massal soal latihan — psikotes dan Tes IQ.
 *
 * Berdiri sendiri dari `@/lib/import/tipe` yang melayani bank soal try out
 * akademik. Alasannya bukan kerapian: baris try out wajib memuat mata uji dan
 * tingkat kesulitan, dua hal yang tidak dikenal pada latihan. Memaksakan satu
 * skema berarti admin harus mengisi kolom yang tidak ada artinya, dan
 * validatornya menolak berkas yang sebenarnya sah.
 *
 * Alurnya sama: unggah → parsing → validasi → pratinjau → konfirmasi → simpan.
 * Tidak ada butir yang masuk bank sebelum admin menekan konfirmasi, dan seluruh
 * butir divalidasi ulang di server pada saat konfirmasi.
 */

export const KOLOM_LATIHAN = [
  "category",
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "explanation",
] as const;

export type KolomLatihan = (typeof KOLOM_LATIHAN)[number];

/** Satu butir mentah hasil parsing, sebelum divalidasi. */
export type ButirMentah = Partial<Record<KolomLatihan, string>> & {
  /** Nomor urut pada berkas asal, untuk pesan kesalahan. */
  baris: number;
};

export type BarisPratinjauLatihan = {
  baris: number;
  valid: boolean;
  masalah: string[];
  kategori: string;
  pertanyaan: string;
  opsi: Record<"A" | "B" | "C" | "D", string>;
  kunci: string;
  pembahasan: string;
};

export type HasilPratinjauLatihan = {
  ok: boolean;
  /** Pesan kegagalan menyeluruh (berkas tidak terbaca, format tidak dikenal). */
  galat?: string;
  sumber: "excel" | "pdf";
  namaBerkas: string;
  baris: BarisPratinjauLatihan[];
  /** Butir mentah yang dikirim kembali saat konfirmasi. */
  mentah: ButirMentah[];
  jumlahValid: number;
  jumlahBermasalah: number;
  catatan: string[];
  dibuatPada: number;
};

export const BATAS_BUTIR = 300;

const HURUF = ["A", "B", "C", "D"] as const;

/* -------------------------------------------------------------------------- */
/*                                   Excel                                    */
/* -------------------------------------------------------------------------- */

function bersihkan(nilai: unknown): string {
  if (nilai === null || nilai === undefined) return "";
  if (typeof nilai === "string") return nilai.trim();
  if (typeof nilai === "number" || typeof nilai === "boolean") {
    return String(nilai).trim();
  }
  if (typeof nilai === "object") {
    const objek = nilai as {
      text?: string;
      result?: unknown;
      richText?: { text: string }[];
    };
    if (Array.isArray(objek.richText)) {
      return objek.richText.map((bagian) => bagian.text).join("").trim();
    }
    if (typeof objek.text === "string") return objek.text.trim();
    if (objek.result !== undefined) return bersihkan(objek.result);
  }
  return String(nilai).trim();
}

function normalkanJudul(nilai: string) {
  return nilai
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z_]/g, "");
}

export type HasilBaca =
  | { ok: true; butir: ButirMentah[]; catatan: string[] }
  | { ok: false; galat: string };

export async function bacaExcelLatihan(isi: ArrayBuffer): Promise<HasilBaca> {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(isi);
  } catch {
    return {
      ok: false,
      galat:
        "Berkas tidak dapat dibaca sebagai Excel (.xlsx). Pastikan berkas tidak rusak dan bukan format .xls lama.",
    };
  }

  const sheet = workbook.worksheets[0];
  if (!sheet || sheet.rowCount < 2) {
    return {
      ok: false,
      galat:
        "Lembar pertama kosong. Isi minimal satu baris soal di bawah baris judul kolom.",
    };
  }

  const petaKolom = new Map<number, KolomLatihan>();
  sheet.getRow(1).eachCell({ includeEmpty: false }, (sel, nomorKolom) => {
    const judul = normalkanJudul(bersihkan(sel.value));
    if ((KOLOM_LATIHAN as readonly string[]).includes(judul)) {
      petaKolom.set(nomorKolom, judul as KolomLatihan);
    }
  });

  const wajib: KolomLatihan[] = [
    "question",
    "option_a",
    "option_b",
    "option_c",
    "option_d",
    "correct_answer",
  ];
  const ada = new Set(petaKolom.values());
  const kurang = wajib.filter((kolom) => !ada.has(kolom));
  if (kurang.length > 0) {
    return {
      ok: false,
      galat: `Kolom wajib belum ada pada baris judul: ${kurang.join(", ")}.`,
    };
  }

  const butir: ButirMentah[] = [];
  for (let nomor = 2; nomor <= sheet.rowCount; nomor += 1) {
    const baris = sheet.getRow(nomor);
    const isiBaris: ButirMentah = { baris: nomor };
    let adaIsi = false;

    for (const [nomorKolom, kolom] of petaKolom) {
      const teks = bersihkan(baris.getCell(nomorKolom).value);
      if (teks) adaIsi = true;
      isiBaris[kolom] = teks;
    }

    // Baris kosong di tengah berkas lazim terjadi ketika admin menghapus isinya
    // tanpa menghapus barisnya; ia dilewati, bukan dilaporkan sebagai galat.
    if (adaIsi) butir.push(isiBaris);
  }

  if (butir.length === 0) {
    return { ok: false, galat: "Tidak ada baris berisi di bawah judul kolom." };
  }

  return { ok: true, butir, catatan: [] };
}

/* -------------------------------------------------------------------------- */
/*                                    PDF                                     */
/* -------------------------------------------------------------------------- */

/**
 * Membaca PDF memakai pengenal soal yang sama dengan bank try out.
 *
 * Formatnya identik — nomor soal, empat pilihan A-D, baris kunci, lalu
 * pembahasan — sehingga admin tidak perlu menghafal dua tata letak berkas.
 * Kolom mata uji dan tingkat kesulitan yang dihasilkan pengenal itu dibuang di
 * sini karena tidak dikenal pada soal latihan.
 */
export async function bacaPdfLatihan(
  isi: ArrayBuffer,
  kategoriBawaan: string,
): Promise<HasilBaca> {
  const hasil = await bacaPdf(isi, {
    paket: "-",
    subject: "-",
    category: kategoriBawaan,
    difficulty: "Medium",
  });
  if (!hasil.ok) return hasil;

  return {
    ok: true,
    catatan: hasil.catatan,
    butir: hasil.baris.map((baris) => ({
      baris: baris.baris,
      category: baris.category ?? kategoriBawaan,
      question: baris.question ?? "",
      option_a: baris.option_a ?? "",
      option_b: baris.option_b ?? "",
      option_c: baris.option_c ?? "",
      option_d: baris.option_d ?? "",
      correct_answer: baris.correct_answer ?? "",
      explanation: baris.explanation ?? "",
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Validasi                                  */
/* -------------------------------------------------------------------------- */

export type AturanKategori =
  | { jenis: "bebas"; bawaan: string }
  | { jenis: "terbatas"; pilihan: readonly string[]; bawaan: string };

/**
 * Memvalidasi satu butir.
 *
 * Pembahasan diwajibkan karena peserta membacanya sesudah latihan ditutup —
 * butir tanpa pembahasan berarti koreksi tanpa penjelasan, dan itulah satu-
 * satunya keluaran yang bernilai pada latihan yang tidak diberi nilai.
 */
export function validasiButir(
  mentah: ButirMentah,
  aturan: AturanKategori,
): BarisPratinjauLatihan {
  const masalah: string[] = [];

  const kategori = (mentah.category ?? "").trim() || aturan.bawaan;
  if (aturan.jenis === "terbatas" && !aturan.pilihan.includes(kategori)) {
    masalah.push(
      `Kategori "${kategori}" tidak dikenal. Pilihan: ${aturan.pilihan.join(", ")}.`,
    );
  }
  if (!kategori) masalah.push("Kategori wajib diisi.");

  const pertanyaan = (mentah.question ?? "").trim();
  if (!pertanyaan) masalah.push("Pertanyaan wajib diisi.");

  const opsi = {
    A: (mentah.option_a ?? "").trim(),
    B: (mentah.option_b ?? "").trim(),
    C: (mentah.option_c ?? "").trim(),
    D: (mentah.option_d ?? "").trim(),
  };
  for (const huruf of HURUF) {
    if (!opsi[huruf]) masalah.push(`Pilihan ${huruf} wajib diisi.`);
  }

  const kunci = (mentah.correct_answer ?? "").trim().toUpperCase();
  if (!(HURUF as readonly string[]).includes(kunci)) {
    masalah.push("Kunci jawaban harus A, B, C, atau D.");
  }

  const pembahasan = (mentah.explanation ?? "").trim();
  if (!pembahasan) {
    masalah.push(
      "Pembahasan wajib diisi — peserta membacanya setelah latihan ditutup.",
    );
  }

  return {
    baris: mentah.baris,
    valid: masalah.length === 0,
    masalah,
    kategori,
    pertanyaan,
    opsi,
    kunci,
    pembahasan,
  };
}

export function rangkumPratinjau(
  sumber: "excel" | "pdf",
  namaBerkas: string,
  baris: BarisPratinjauLatihan[],
  mentah: ButirMentah[],
  catatan: string[],
): HasilPratinjauLatihan {
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

export function pratinjauGagal(
  sumber: "excel" | "pdf",
  namaBerkas: string,
  galat: string,
): HasilPratinjauLatihan {
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
