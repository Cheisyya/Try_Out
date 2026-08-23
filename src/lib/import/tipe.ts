import type { Difficulty, HurufOpsi, Subject } from "@/lib/bank-soal/skema";
import type { SesiId } from "@/lib/konfigurasi/tipe";

/**
 * Model data impor massal bank soal.
 *
 * Alur: unggah -> parsing -> validasi -> pratinjau -> konfirmasi -> simpan.
 * Tidak ada baris yang masuk bank soal sebelum admin menekan konfirmasi, dan
 * seluruh baris divalidasi ulang di server pada saat konfirmasi.
 */

export const KOLOM_TEMPLATE = [
  "package",
  "subject",
  "session",
  "category",
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "difficulty",
  "explanation",
  "image",
] as const;

export type KolomTemplate = (typeof KOLOM_TEMPLATE)[number];

/** Satu baris mentah hasil parsing, sebelum divalidasi. */
export type BarisMentah = Partial<Record<KolomTemplate, string>> & {
  /** Nomor baris pada berkas asal, untuk pesan kesalahan. */
  baris: number;
};

/** Baris yang sudah divalidasi dan siap ditampilkan pada pratinjau. */
export type BarisPratinjau = {
  baris: number;
  valid: boolean;
  masalah: string[];
  /** Terisi hanya bila valid. */
  data?: {
    package_id: string;
    paketNama: string;
    subject: Subject;
    session: SesiId;
    category: string;
    question: string;
    options: Record<HurufOpsi, string>;
    correct_answer: HurufOpsi;
    difficulty: Difficulty;
    explanation: string;
    image?: string;
  };
  /** Ringkasan untuk baris yang tidak valid sekalipun. */
  ringkas: {
    paket: string;
    subject: string;
    question: string;
    correct_answer: string;
    difficulty: string;
  };
};

export type HasilPratinjau = {
  ok: boolean;
  /** Pesan kegagalan menyeluruh (berkas tidak terbaca, format tidak dikenal). */
  galat?: string;
  sumber: "excel" | "pdf";
  namaBerkas: string;
  baris: BarisPratinjau[];
  /** Baris mentah yang dikirim kembali saat konfirmasi. */
  mentah: BarisMentah[];
  jumlahValid: number;
  jumlahBermasalah: number;
  /** Catatan tambahan, misalnya halaman PDF yang dilewati. */
  catatan: string[];
  /** Penanda unik tiap kali pratinjau dibuat. */
  dibuatPada: number;
};

export const BATAS_BARIS = 300;
