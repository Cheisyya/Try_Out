import ExcelJS from "exceljs";

import { KOLOM_TEMPLATE, type BarisMentah, type KolomTemplate } from "@/lib/import/tipe";

/**
 * Pembacaan berkas Excel (.xlsx) menjadi baris mentah.
 * Hanya membaca; seluruh validasi isi dilakukan di `src/lib/import/validasi.ts`.
 */

export type HasilBacaExcel =
  | { ok: true; baris: BarisMentah[]; catatan: string[] }
  | { ok: false; galat: string };

function bersihkan(nilai: unknown): string {
  if (nilai === null || nilai === undefined) return "";
  if (typeof nilai === "string") return nilai.trim();
  if (typeof nilai === "number" || typeof nilai === "boolean") {
    return String(nilai).trim();
  }
  // Sel dengan rich text atau formula dikembalikan ExcelJS sebagai objek.
  if (typeof nilai === "object") {
    const objek = nilai as { text?: string; result?: unknown; richText?: { text: string }[] };
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

export async function bacaExcel(isi: ArrayBuffer): Promise<HasilBacaExcel> {
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

  const barisJudul = sheet.getRow(1);
  const petaKolom = new Map<number, KolomTemplate>();
  const judulTidakDikenal: string[] = [];

  barisJudul.eachCell({ includeEmpty: false }, (sel, nomorKolom) => {
    const judul = normalkanJudul(bersihkan(sel.value));
    if (!judul) return;
    if ((KOLOM_TEMPLATE as readonly string[]).includes(judul)) {
      petaKolom.set(nomorKolom, judul as KolomTemplate);
    } else {
      judulTidakDikenal.push(bersihkan(sel.value));
    }
  });

  // `package` tidak ikut diwajibkan: paket tujuan dipilih pada form Import
  // Soal, sama seperti impor PDF. Kolomnya tetap dikenali bila ada, tetapi
  // isinya selalu ditimpa pilihan admin.
  const wajib: KolomTemplate[] = [
    "subject",
    "question",
    "option_a",
    "option_b",
    "option_c",
    "option_d",
    "correct_answer",
    "difficulty",
  ];
  const kolomAda = new Set(petaKolom.values());
  const kurang = wajib.filter((kolom) => !kolomAda.has(kolom));

  if (kurang.length > 0) {
    return {
      ok: false,
      galat: `Kolom wajib belum ada pada baris judul: ${kurang.join(", ")}. Unduh template untuk susunan kolom yang benar.`,
    };
  }

  const baris: BarisMentah[] = [];
  const catatan: string[] = [];
  if (judulTidakDikenal.length > 0) {
    catatan.push(
      `Kolom berikut diabaikan karena tidak dikenal: ${judulTidakDikenal.join(", ")}.`,
    );
  }

  sheet.eachRow({ includeEmpty: false }, (row, nomorBaris) => {
    if (nomorBaris === 1) return;

    const isiBaris: BarisMentah = { baris: nomorBaris };
    let adaIsi = false;

    for (const [nomorKolom, kolom] of petaKolom) {
      const nilai = bersihkan(row.getCell(nomorKolom).value);
      if (nilai) adaIsi = true;
      isiBaris[kolom] = nilai;
    }

    if (adaIsi) baris.push(isiBaris);
  });

  if (baris.length === 0) {
    return {
      ok: false,
      galat: "Tidak ada baris berisi data di bawah baris judul kolom.",
    };
  }

  return { ok: true, baris, catatan };
}

/**
 * Menyusun berkas template .xlsx yang dapat diunduh admin.
 *
 * Kolom wajib sengaja dijaga seminimal mungkin — package, subject, question,
 * option_a…d, correct_answer, dan **explanation** — sehingga admin cukup
 * mengetik soal, pilihan, kunci, dan pembahasannya. Kolom category serta
 * difficulty boleh dikosongkan dan akan diisi nilai bawaan oleh validator.
 *
 * Pembahasan naik menjadi wajib karena kini dibaca peserta pada halaman
 * Riwayat Hasil setelah mata ujinya dikumpulkan — bukan lagi catatan internal.
 */
export async function buatTemplateExcel(contoh: {
  subject: string;
  category: string;
  /** Kategori materi per mata uji, untuk lembar Petunjuk. */
  kategoriPerSubject?: Record<string, readonly string[]>;
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Smart Home Center";
  workbook.created = new Date();

  /*
   * Kolom yang tidak ikut dicetak:
   * - `package` — paket tujuan dipilih pada form Import Soal, jadi satu
   *   template dapat dipakai untuk paket mana pun.
   * - `session`  — selalu mengikuti penempatan mata uji pada paket tujuan.
   * - `image`    — gambar soal dipasang lewat menu Bank Soal, bukan Excel.
   * Ketiganya tetap dikenali bila muncul pada berkas lama.
   */
  const KOLOM_DISEMBUNYIKAN: KolomTemplate[] = ["package", "session", "image"];
  const kolomTemplate = KOLOM_TEMPLATE.filter(
    (kolom) => !KOLOM_DISEMBUNYIKAN.includes(kolom),
  );

  const sheet = workbook.addWorksheet("Soal");
  sheet.columns = kolomTemplate.map((kolom) => ({
    header: kolom,
    key: kolom,
    width:
      kolom === "question" || kolom === "explanation"
        ? 52
        : kolom.startsWith("option")
          ? 26
          : 18,
  }));

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).alignment = { vertical: "middle" };

  sheet.addRow({
    subject: contoh.subject,
    category: contoh.category,
    question:
      "CONTOH — hapus baris ini lalu isi soal Anda mulai dari sini.\nNilai x yang memenuhi persamaan 2x + 5 = 17 adalah ...",
    option_a: "4",
    option_b: "5",
    option_c: "6",
    option_d: "7",
    correct_answer: "C",
    difficulty: "Medium",
    explanation:
      "WAJIB — dibaca siswa setelah sesi dikumpulkan. Jelaskan langkah penyelesaian dan alasan opsi lain keliru.",
  });

  // Baris contoh ditandai agar mudah dikenali dan dihapus.
  sheet.getRow(2).font = { italic: true, color: { argb: "FF94A3B8" } };
  sheet.getColumn("question").alignment = { wrapText: true, vertical: "top" };
  sheet.getColumn("explanation").alignment = { wrapText: true, vertical: "top" };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  /* Dropdown agar isian tidak salah ketik. Diterapkan pada 500 baris pertama. */
  const sampaiBaris = 501;
  const kolomKe = (nama: KolomTemplate) =>
    sheet.getColumn(nama).letter as string;

  const pasangDropdown = (nama: KolomTemplate, pilihan: string[]) => {
    const huruf = kolomKe(nama);
    for (let baris = 2; baris <= sampaiBaris; baris += 1) {
      sheet.getCell(`${huruf}${baris}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${pilihan.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Nilai tidak sah",
        error: `Pilih salah satu: ${pilihan.join(", ")}`,
      };
    }
  };

  pasangDropdown("subject", [
    "Bahasa Indonesia",
    "IPA",
    "Bahasa Inggris",
    "Matematika",
  ]);
  pasangDropdown("correct_answer", ["A", "B", "C", "D"]);
  pasangDropdown("difficulty", ["Easy", "Medium", "Hard", "Very Hard"]);

  const petunjuk = workbook.addWorksheet("Petunjuk");
  petunjuk.columns = [
    { header: "Kolom", key: "kolom", width: 20 },
    { header: "Wajib", key: "wajib", width: 10 },
    { header: "Keterangan", key: "keterangan", width: 90 },
  ];
  petunjuk.getRow(1).font = { bold: true };

  const keterangan: [KolomTemplate, string, string][] = [
    ["subject", "Ya", "Bahasa Indonesia, IPA, Bahasa Inggris, atau Matematika."],
    ["category", "Tidak", "Boleh kosong; otomatis memakai kategori pertama mata uji tersebut. Daftar kategori ada di bawah."],
    ["question", "Ya", "Teks pertanyaan. Gunakan Alt+Enter untuk pindah baris."],
    ["option_a", "Ya", "Pilihan A."],
    ["option_b", "Ya", "Pilihan B."],
    ["option_c", "Ya", "Pilihan C."],
    ["option_d", "Ya", "Pilihan D. Seluruh soal wajib pilihan ganda A-D dan isinya tidak boleh kembar."],
    ["correct_answer", "Ya", "Satu huruf: A, B, C, atau D."],
    ["difficulty", "Tidak", "Boleh kosong; dianggap Medium. Isi Easy, Medium, Hard, atau Very Hard."],
    [
      "explanation",
      "Ya",
      "Pembahasan soal. DITAMPILKAN kepada siswa pada halaman Riwayat Hasil setelah mata ujinya dikumpulkan, jadi tulis lengkap: langkah penyelesaian dan alasan opsi lain keliru.",
    ],
  ];

  for (const [kolom, wajib, teks] of keterangan) {
    petunjuk.addRow({ kolom, wajib, keterangan: teks });
  }

  petunjuk.addRow({});
  const judulLangkah = petunjuk.addRow({ kolom: "Cara pakai" });
  judulLangkah.font = { bold: true };
  for (const langkah of [
    "1. Hapus baris contoh berwarna abu-abu pada lembar Soal.",
    "2. Isi minimal: subject, question, option_a sampai option_d, dan correct_answer.",
    "2b. Paket tujuan TIDAK ditulis di berkas ini — dipilih pada form Import Soal saat mengunggah, jadi satu berkas dapat dipakai untuk paket mana pun.",
    "3. Kolom category dan difficulty boleh dibiarkan kosong; explanation wajib diisi karena dibaca siswa.",
    "4. Simpan sebagai .xlsx, lalu unggah pada menu Import Soal.",
    "5. Periksa pratinjau, baru tekan konfirmasi. Sebelum dikonfirmasi, tidak ada data yang masuk bank soal.",
  ]) {
    petunjuk.addRow({ keterangan: langkah });
  }

  if (contoh.kategoriPerSubject) {
    petunjuk.addRow({});
    const judulKategori = petunjuk.addRow({ kolom: "Daftar kategori" });
    judulKategori.font = { bold: true };
    for (const [subject, daftar] of Object.entries(contoh.kategoriPerSubject)) {
      petunjuk.addRow({ kolom: subject, keterangan: daftar.join(" · ") });
    }
  }

  petunjuk.getColumn("keterangan").alignment = { wrapText: true, vertical: "top" };

  return workbook.xlsx.writeBuffer();
}
