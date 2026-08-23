import { PDFParse } from "pdf-parse";

import type { BarisMentah } from "@/lib/import/tipe";

/**
 * Ekstraksi teks PDF dan pengenalan soal pilihan ganda.
 *
 * Format yang dikenali (satu blok per soal):
 *
 *   1. Teks pertanyaan boleh beberapa baris
 *   A. pilihan A
 *   B. pilihan B
 *   C. pilihan C
 *   D. pilihan D
 *   Kunci: C
 *   Tingkat: Medium            (opsional)
 *   Kategori: Aljabar          (opsional)
 *   Pembahasan: ...            (WAJIB — dibaca siswa setelah sesi selesai)
 *
 * Bila pola tersebut tidak ditemukan, parser mengembalikan kegagalan dengan
 * penjelasan — tidak ada data setengah jadi yang diteruskan ke pratinjau.
 */

export type HasilBacaPdf =
  | { ok: true; baris: BarisMentah[]; catatan: string[] }
  | { ok: false; galat: string };

const POLA_NOMOR = /^(\d{1,3})[.)]\s*(.*)$/;
const POLA_OPSI = /^([A-Da-d])[.)]\s*(.*)$/;
const POLA_KUNCI = /^(kunci|jawaban|answer)\s*(jawaban)?\s*[:.]?\s*([A-Da-d])\b/i;
const POLA_TINGKAT = /^(tingkat|difficulty|kesulitan)\s*[:.]?\s*(very hard|sangat sulit|easy|medium|hard|mudah|sedang|sulit)\b/i;
const POLA_KATEGORI = /^(kategori|category)\s*[:.]?\s*(.+)$/i;
const POLA_PEMBAHASAN = /^(pembahasan|penjelasan|explanation)\s*[:.]?\s*(.*)$/i;

const PETA_TINGKAT: Record<string, string> = {
  easy: "Easy",
  mudah: "Easy",
  medium: "Medium",
  sedang: "Medium",
  hard: "Hard",
  sulit: "Hard",
  "very hard": "Very Hard",
  "sangat sulit": "Very Hard",
};

type Blok = {
  nomor: number;
  pertanyaan: string[];
  opsi: Partial<Record<"A" | "B" | "C" | "D", string>>;
  kunci?: string;
  tingkat?: string;
  kategori?: string;
  pembahasan?: string[];
};

function selesaikanBlok(blok: Blok, bawaan: Bawaan): BarisMentah {
  return {
    baris: blok.nomor,
    package: bawaan.paket,
    subject: bawaan.subject,
    session: "",
    category: blok.kategori?.trim() || bawaan.category,
    question: blok.pertanyaan.join(" ").replace(/\s+/g, " ").trim(),
    option_a: blok.opsi.A?.trim() ?? "",
    option_b: blok.opsi.B?.trim() ?? "",
    option_c: blok.opsi.C?.trim() ?? "",
    option_d: blok.opsi.D?.trim() ?? "",
    correct_answer: blok.kunci?.toUpperCase() ?? "",
    difficulty: blok.tingkat ?? bawaan.difficulty,
    // Dibiarkan kosong bila PDF tidak memuatnya: validator akan menolak baris
    // itu, sehingga admin melihat soal mana yang pembahasannya belum ditulis.
    // Menyisipkan teks pengganti justru membuat soal tanpa pembahasan lolos
    // sampai ke layar siswa.
    explanation: blok.pembahasan?.join(" ").replace(/\s+/g, " ").trim() ?? "",
    image: "",
  };
}

export type Bawaan = {
  paket: string;
  subject: string;
  category: string;
  difficulty: string;
};

export async function bacaPdf(
  isi: ArrayBuffer,
  bawaan: Bawaan,
): Promise<HasilBacaPdf> {
  let teks = "";

  try {
    const parser = new PDFParse({ data: new Uint8Array(isi) });
    const hasil = await parser.getText();
    teks = hasil.text ?? "";
    await parser.destroy();
  } catch (error) {
    return {
      ok: false,
      galat: `Berkas PDF tidak dapat dibaca: ${
        error instanceof Error ? error.message : "kesalahan tidak dikenal"
      }.`,
    };
  }

  if (teks.replace(/\s/g, "").length < 40) {
    return {
      ok: false,
      galat:
        "PDF tidak memuat teks yang dapat dibaca. Kemungkinan berupa hasil pindaian (gambar). Gunakan PDF berbasis teks atau impor lewat Excel.",
    };
  }

  const barisTeks = teks
    .split(/\r?\n/)
    .map((baris) => baris.replace(/\s+/g, " ").trim())
    .filter((baris) => baris.length > 0);

  const blok: Blok[] = [];
  let sekarang: Blok | null = null;
  let bagian: "pertanyaan" | "opsi" | "pembahasan" = "pertanyaan";

  for (const baris of barisTeks) {
    const cocokNomor = baris.match(POLA_NOMOR);
    const cocokOpsi = baris.match(POLA_OPSI);

    // Baris bernomor memulai soal baru, kecuali sedang membaca daftar opsi
    // (agar "1) 12 cm" di dalam opsi tidak dianggap soal baru).
    if (cocokNomor && bagian !== "opsi") {
      if (sekarang) blok.push(sekarang);
      sekarang = {
        nomor: Number(cocokNomor[1]),
        pertanyaan: cocokNomor[2] ? [cocokNomor[2]] : [],
        opsi: {},
      };
      bagian = "pertanyaan";
      continue;
    }

    if (!sekarang) continue;

    if (cocokOpsi) {
      const huruf = cocokOpsi[1].toUpperCase() as "A" | "B" | "C" | "D";
      sekarang.opsi[huruf] = cocokOpsi[2];
      bagian = "opsi";
      continue;
    }

    const cocokKunci = baris.match(POLA_KUNCI);
    if (cocokKunci) {
      sekarang.kunci = cocokKunci[3].toUpperCase();
      bagian = "pertanyaan";
      continue;
    }

    const cocokTingkat = baris.match(POLA_TINGKAT);
    if (cocokTingkat) {
      sekarang.tingkat = PETA_TINGKAT[cocokTingkat[2].toLowerCase()];
      continue;
    }

    const cocokKategori = baris.match(POLA_KATEGORI);
    if (cocokKategori) {
      sekarang.kategori = cocokKategori[2];
      continue;
    }

    const cocokPembahasan = baris.match(POLA_PEMBAHASAN);
    if (cocokPembahasan) {
      sekarang.pembahasan = cocokPembahasan[2] ? [cocokPembahasan[2]] : [];
      bagian = "pembahasan";
      continue;
    }

    // Baris lanjutan.
    if (bagian === "pembahasan" && sekarang.pembahasan) {
      sekarang.pembahasan.push(baris);
    } else if (bagian === "opsi") {
      const hurufTerakhir = (["D", "C", "B", "A"] as const).find(
        (huruf) => sekarang?.opsi[huruf] !== undefined,
      );
      if (hurufTerakhir) sekarang.opsi[hurufTerakhir] += ` ${baris}`;
    } else {
      sekarang.pertanyaan.push(baris);
    }
  }

  if (sekarang) blok.push(sekarang);

  const lengkap = blok.filter(
    (item) =>
      item.pertanyaan.length > 0 &&
      (["A", "B", "C", "D"] as const).every((huruf) =>
        Boolean(item.opsi[huruf]?.trim()),
      ),
  );

  if (lengkap.length === 0) {
    return {
      ok: false,
      galat:
        "Tidak ada soal yang dapat dikenali. Format yang didukung: nomor soal (1., 2., ...), diikuti empat pilihan berlabel A. sampai D., lalu baris “Kunci: B”. Rapikan PDF atau gunakan impor Excel.",
    };
  }

  const catatan: string[] = [];
  const tidakLengkap = blok.length - lengkap.length;
  if (tidakLengkap > 0) {
    catatan.push(
      `${tidakLengkap} blok dilewati karena tidak memiliki empat pilihan A-D yang lengkap.`,
    );
  }
  const tanpaKunci = lengkap.filter((item) => !item.kunci).length;
  if (tanpaKunci > 0) {
    catatan.push(
      `${tanpaKunci} soal tidak menyertakan baris kunci jawaban; lengkapi pada pratinjau sebelum konfirmasi.`,
    );
  }

  return {
    ok: true,
    baris: lengkap.map((item) => selesaikanBlok(item, bawaan)),
    catatan,
  };
}
