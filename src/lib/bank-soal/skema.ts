import { isSesiId, type SesiId } from "@/lib/konfigurasi/tipe";

/**
 * Skema bank soal.
 *
 * Cakupan materi mengikuti dokumen resmi "Seleksi Tahap I — Materi Ujian"
 * SMA Taruna Nusantara. Kategori di luar daftar ini ditolak validator agar
 * bank soal tidak melebar dari cakupan seleksi.
 */

export const SUBJECTS = [
  "Bahasa Indonesia",
  "IPA",
  "Bahasa Inggris",
  "Matematika",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const DIFFICULTIES = ["Easy", "Medium", "Hard", "Very Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Pilihan jawaban dibatasi A-D; tidak ada opsi E. */
export const HURUF_OPSI = ["A", "B", "C", "D"] as const;
export type HurufOpsi = (typeof HURUF_OPSI)[number];

/**
 * Penempatan mata uji pada sesi serta jumlah soal per mata uji kini diatur
 * admin melalui konfigurasi paket (lihat src/lib/konfigurasi).
 */

/** Cakupan materi per mata uji sesuai dokumen seleksi. */
export const KATEGORI: Record<Subject, readonly string[]> = {
  "Bahasa Indonesia": ["Membaca", "Menyunting", "Kosa Kata", "Struktur Bahasa Indonesia"],
  IPA: [
    "Kimia Dasar Unsur",
    "Kimia Dasar Terapan",
    "Fisika Energetika",
    "Fisika Kalor",
    "Fisika Elektromagnet",
    "Fisika Fluida",
    "Fisika Gaya",
    "Fisika Gelombang",
    "Fisika Optik",
    "Fisika Rangkaian Listrik",
    "Biologi Ciri Kehidupan",
    "Biologi Lingkungan (Ekologi)",
    "Biologi Genetika",
    "Biologi Hewan (Fisiologi)",
    "Biologi Tumbuhan (Botani)",
    "Bioteknologi Mutakhir",
  ],
  "Bahasa Inggris": ["Reading", "Grammar", "Vocabulary"],
  Matematika: ["Aljabar", "Geometri", "Kombinatorika", "Teori Bilangan"],
};

export type GambarSoal = {
  /** Path relatif terhadap folder public, contoh: /soal/p1-rangkaian.svg */
  src: string;
  alt: string;
  keterangan?: string;
};

export type TabelSoal = {
  judul?: string;
  kolom: string[];
  baris: string[][];
};

export type Soal = {
  id: string;
  package_id: string;
  subject: Subject;
  session: SesiId;
  category: string;
  question: string;
  options: Record<HurufOpsi, string>;
  correct_answer: HurufOpsi;
  difficulty: Difficulty;
  explanation: string;
  image?: GambarSoal;
  table?: TabelSoal;
  question_order: number;
  active: boolean;
};

/** Soal seperti yang dikirim ke peserta: tanpa kunci dan pembahasan. */
export type SoalUjian = Omit<
  Soal,
  "correct_answer" | "explanation" | "active" | "session"
> & { nomor: number };

export type MasukanSoal = Omit<Soal, "id" | "session" | "question_order"> & {
  id?: string;
  question_order?: number;
};

export type HasilValidasi =
  | { ok: true; soal: Soal }
  | { ok: false; masalah: string[] };

export function isSubject(nilai: unknown): nilai is Subject {
  return SUBJECTS.includes(nilai as Subject);
}

export function isDifficulty(nilai: unknown): nilai is Difficulty {
  return DIFFICULTIES.includes(nilai as Difficulty);
}

export function isHurufOpsi(nilai: unknown): nilai is HurufOpsi {
  return HURUF_OPSI.includes(nilai as HurufOpsi);
}

/**
 * Memvalidasi satu butir soal.
 * Dipakai baik saat memuat berkas bank soal maupun saat CRUD dari admin.
 */
export function validasiSoal(
  masukan: Partial<Soal>,
  opsi: { idBawaan?: string; urutanBawaan?: number } = {},
): HasilValidasi {
  const masalah: string[] = [];

  const id = (masukan.id ?? opsi.idBawaan ?? "").trim();
  if (!id) masalah.push("id wajib diisi");

  const packageId = (masukan.package_id ?? "").trim();
  if (!packageId) masalah.push("package_id wajib diisi");

  if (!isSubject(masukan.subject)) {
    masalah.push(`subject harus salah satu dari: ${SUBJECTS.join(", ")}`);
  }

  const subject = masukan.subject as Subject;

  if (isSubject(subject)) {
    if (masukan.session && !isSesiId(masukan.session)) {
      masalah.push(`session "${masukan.session}" tidak dikenal`);
    }
    const kategori = (masukan.category ?? "").trim();
    if (!kategori) masalah.push("category wajib diisi");
    else if (!KATEGORI[subject].includes(kategori)) {
      masalah.push(
        `category "${kategori}" di luar cakupan materi ${subject}. Pilihan: ${KATEGORI[subject].join(", ")}`,
      );
    }
  }

  if (!(masukan.question ?? "").trim()) masalah.push("question wajib diisi");
  // Pembahasan wajib: sejak halaman Riwayat Hasil menampilkannya, soal tanpa
  // pembahasan berarti siswa menerima koreksi tanpa penjelasan.
  if (!(masukan.explanation ?? "").trim()) {
    masalah.push(
      "explanation wajib diisi — pembahasan ditampilkan kepada siswa setelah sesi dikumpulkan",
    );
  }

  const options = masukan.options;
  if (!options || typeof options !== "object") {
    masalah.push("options A-D wajib diisi");
  } else {
    for (const huruf of HURUF_OPSI) {
      if (!(options[huruf] ?? "").trim()) {
        masalah.push(`opsi ${huruf} wajib diisi (seluruh soal pilihan ganda A-D)`);
      }
    }
  }

  if (!isHurufOpsi(masukan.correct_answer)) {
    masalah.push("correct_answer harus A, B, C, atau D");
  }

  if (!isDifficulty(masukan.difficulty)) {
    masalah.push("difficulty harus Easy, Medium, Hard, atau Very Hard");
  }

  const urutan = masukan.question_order ?? opsi.urutanBawaan;
  if (typeof urutan !== "number" || !Number.isInteger(urutan) || urutan < 1) {
    masalah.push("question_order harus bilangan bulat >= 1");
  }

  if (masukan.image) {
    if (!masukan.image.src?.trim()) masalah.push("image.src wajib diisi");
    if (!masukan.image.alt?.trim()) {
      masalah.push("image.alt wajib diisi untuk aksesibilitas");
    }
  }

  if (masukan.table) {
    const { kolom, baris } = masukan.table;
    if (!Array.isArray(kolom) || kolom.length === 0) {
      masalah.push("table.kolom wajib diisi");
    } else if (!Array.isArray(baris) || baris.length === 0) {
      masalah.push("table.baris wajib diisi");
    } else if (baris.some((row) => row.length !== kolom.length)) {
      masalah.push("jumlah sel setiap baris tabel harus sama dengan jumlah kolom");
    }
  }

  if (masalah.length > 0) return { ok: false, masalah };

  return {
    ok: true,
    soal: {
      id,
      package_id: packageId,
      subject,
      session: (masukan.session as SesiId) ?? "sesi-1",
      category: masukan.category!.trim(),
      question: masukan.question!.trim(),
      options: {
        A: options!.A.trim(),
        B: options!.B.trim(),
        C: options!.C.trim(),
        D: options!.D.trim(),
      },
      correct_answer: masukan.correct_answer as HurufOpsi,
      difficulty: masukan.difficulty as Difficulty,
      explanation: (masukan.explanation ?? "").trim(),
      image: masukan.image,
      table: masukan.table,
      question_order: urutan as number,
      active: masukan.active ?? true,
    },
  };
}

/** Membuang kunci jawaban dan pembahasan sebelum soal dikirim ke peserta. */
export function keSoalUjian(soal: Soal, nomor: number): SoalUjian {
  const { correct_answer, explanation, active, session, ...sisa } = soal;
  void correct_answer;
  void explanation;
  void active;
  void session;
  return { ...sisa, nomor };
}
