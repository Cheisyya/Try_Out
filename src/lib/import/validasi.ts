import {
  HURUF_OPSI,
  isDifficulty,
  isSubject,
  KATEGORI,
  type Difficulty,
  type HurufOpsi,
  type Subject,
} from "@/lib/bank-soal/skema";
import { isSesiId, type PaketKonfig } from "@/lib/paket-tryout";
import type { BarisMentah, BarisPratinjau } from "@/lib/import/tipe";

/**
 * Validasi baris impor terhadap konfigurasi paket dan skema bank soal.
 * Dipakai dua kali: saat menyusun pratinjau dan saat konfirmasi, sehingga
 * baris yang tidak sah tidak pernah masuk bank soal meskipun pratinjau diubah
 * dari sisi klien.
 */

/**
 * Daftar paket diterima sebagai parameter, bukan dibaca di dalam fungsi.
 * Validasi berjalan per baris di dalam perulangan yang sinkron, sementara
 * pembacaan konfigurasi kini asinkron — memindahkannya ke pemanggil membuat
 * konfigurasi cukup dibaca sekali untuk seluruh berkas impor.
 */
function cariPaketFleksibel(
  daftarPaket: PaketKonfig[],
  nilai: string,
): PaketKonfig | undefined {
  const kunci = nilai.trim().toLowerCase();
  if (!kunci) return undefined;
  return daftarPaket.find(
    (paket) =>
      paket.id.toLowerCase() === kunci ||
      paket.nama.toLowerCase() === kunci ||
      String(paket.nomor) === kunci,
  );
}

function normalkanKunci(nilai: string): HurufOpsi | null {
  const huruf = nilai.trim().toUpperCase().replace(/[^A-D]/g, "").charAt(0);
  return HURUF_OPSI.includes(huruf as HurufOpsi) ? (huruf as HurufOpsi) : null;
}

function normalkanTingkat(nilai: string): Difficulty | null {
  const bersih = nilai.trim().toLowerCase();
  const peta: Record<string, Difficulty> = {
    easy: "Easy",
    mudah: "Easy",
    medium: "Medium",
    sedang: "Medium",
    hard: "Hard",
    sulit: "Hard",
    "very hard": "Very Hard",
    veryhard: "Very Hard",
    "sangat sulit": "Very Hard",
  };
  const hasil = peta[bersih];
  if (hasil) return hasil;
  const kapital = bersih.charAt(0).toUpperCase() + bersih.slice(1);
  return isDifficulty(kapital) ? kapital : null;
}

function normalkanSubject(nilai: string): Subject | null {
  const bersih = nilai.trim().toLowerCase();
  const peta: Record<string, Subject> = {
    "bahasa indonesia": "Bahasa Indonesia",
    indonesia: "Bahasa Indonesia",
    bindo: "Bahasa Indonesia",
    ipa: "IPA",
    "ilmu pengetahuan alam": "IPA",
    "bahasa inggris": "Bahasa Inggris",
    inggris: "Bahasa Inggris",
    english: "Bahasa Inggris",
    matematika: "Matematika",
    mtk: "Matematika",
    math: "Matematika",
  };
  const hasil = peta[bersih];
  if (hasil) return hasil;
  return isSubject(nilai.trim()) ? (nilai.trim() as Subject) : null;
}

/** Sesi tempat mata uji dijadwalkan pada paket tersebut. */
function sesiUntukSubject(paket: PaketKonfig, subject: Subject) {
  return paket.sesi.find((sesi) =>
    sesi.mataUji.some((mata) => mata.subject === subject),
  );
}

/** Panjang maksimal tiap kolom teks setelah dibersihkan. */
const BATAS_TEKS = 4000;

/**
 * Sanitasi nilai sel: membuang karakter kontrol yang dapat merusak tampilan
 * atau berkas JSON, menyeragamkan akhir baris dan spasi tak terlihat, lalu
 * memotong pada batas panjang yang wajar.
 */
function bersihkanTeks(nilai: unknown): string {
  return String(nilai ?? "")
    .replace(/\r\n?/g, "\n")
    // Karakter kontrol selain tab dan baris baru.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    // Spasi nol lebar dan penanda arah teks.
    .replace(/[\u200B-\u200F\u2028\u2029\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .trim()
    .slice(0, BATAS_TEKS);
}

/** Path gambar harus menunjuk berkas di dalam folder public, tanpa keluar dari sana. */
function pathGambarSah(nilai: string) {
  if (!nilai.startsWith("/")) return false;
  if (nilai.startsWith("//")) return false;
  if (nilai.includes("..") || nilai.includes("\\")) return false;
  if (/\s/.test(nilai)) return false;
  return /\.(svg|png|jpe?g|webp)$/i.test(nilai);
}

export function validasiBaris(
  mentah: BarisMentah,
  daftarPaket: PaketKonfig[],
): BarisPratinjau {
  const masalah: string[] = [];
  const ambil = (kunci: keyof BarisMentah) => bersihkanTeks(mentah[kunci]);

  const ringkas = {
    paket: ambil("package"),
    subject: ambil("subject"),
    question: ambil("question"),
    correct_answer: ambil("correct_answer"),
    difficulty: ambil("difficulty"),
  };

  const paket = cariPaketFleksibel(daftarPaket, ambil("package"));
  if (!paket) {
    masalah.push(
      ambil("package")
        ? `Paket "${ambil("package")}" tidak ditemukan.`
        : "Kolom package wajib diisi.",
    );
  }

  const subject = normalkanSubject(ambil("subject"));
  if (!subject) {
    masalah.push(
      ambil("subject")
        ? `Mata pelajaran "${ambil("subject")}" tidak dikenal.`
        : "Kolom subject wajib diisi.",
    );
  }

  let session: "sesi-1" | "sesi-2" | null = null;
  if (paket && subject) {
    const sesiPaket = sesiUntukSubject(paket, subject);
    if (!sesiPaket) {
      masalah.push(
        `${subject} tidak dijadwalkan pada ${paket.nama}. Atur mata uji sesi pada menu Sesi terlebih dahulu.`,
      );
    } else {
      const sesiKolom = ambil("session");
      if (sesiKolom && !isSesiId(sesiKolom)) {
        masalah.push(`Kolom session "${sesiKolom}" tidak dikenal.`);
      } else if (sesiKolom && sesiKolom !== sesiPaket.id) {
        masalah.push(
          `${subject} pada ${paket.nama} berada di ${sesiPaket.nama} (${sesiPaket.id}), bukan ${sesiKolom}.`,
        );
      } else {
        session = sesiPaket.id;
      }
    }
  }

  const kategori = ambil("category");
  if (subject) {
    if (!kategori) {
      // Dibiarkan kosong: diisi kategori pertama mata uji tersebut agar impor
      // "soal + pilihan + kunci" tetap berjalan. Admin dapat menyuntingnya
      // kemudian lewat menu Bank Soal.
    } else if (!KATEGORI[subject].includes(kategori)) {
      const cocok = KATEGORI[subject].find(
        (item) => item.toLowerCase() === kategori.toLowerCase(),
      );
      if (!cocok) {
        masalah.push(
          `Kategori "${kategori}" di luar cakupan materi ${subject}. Pilihan: ${KATEGORI[subject].join(", ")}.`,
        );
      }
    }
  }
  const kategoriBaku = !subject
    ? kategori
    : kategori
      ? (KATEGORI[subject].find(
          (item) => item.toLowerCase() === kategori.toLowerCase(),
        ) ?? kategori)
      : KATEGORI[subject][0];

  const question = ambil("question");
  if (!question) masalah.push("Kolom question wajib diisi.");

  const opsi: Record<HurufOpsi, string> = {
    A: ambil("option_a"),
    B: ambil("option_b"),
    C: ambil("option_c"),
    D: ambil("option_d"),
  };
  const kosong = HURUF_OPSI.filter((huruf) => !opsi[huruf]);
  if (kosong.length > 0) {
    masalah.push(
      `Pilihan ${kosong.join(", ")} kosong. Seluruh soal wajib pilihan ganda dengan empat opsi A-D.`,
    );
  }
  const unik = new Set(HURUF_OPSI.map((huruf) => opsi[huruf].toLowerCase()).filter(Boolean));
  if (kosong.length === 0 && unik.size !== HURUF_OPSI.length) {
    masalah.push("Terdapat pilihan jawaban yang isinya sama persis.");
  }

  const kunci = normalkanKunci(ambil("correct_answer"));
  if (!kunci) {
    masalah.push(
      ambil("correct_answer")
        ? `Kunci jawaban "${ambil("correct_answer")}" tidak sah. Isi salah satu: A, B, C, atau D.`
        : "Kolom correct_answer wajib diisi (A, B, C, atau D).",
    );
  } else if (!opsi[kunci]) {
    masalah.push(`Kunci jawaban ${kunci} menunjuk pilihan yang kosong.`);
  }

  // Tingkat kesulitan boleh dikosongkan: dianggap Medium.
  const tingkatMentah = ambil("difficulty");
  const tingkat = tingkatMentah ? normalkanTingkat(tingkatMentah) : "Medium";
  if (!tingkat) {
    masalah.push(
      `Tingkat kesulitan "${tingkatMentah}" tidak sah. Isi Easy, Medium, Hard, atau Very Hard.`,
    );
  }

  // Pembahasan kini dibaca siswa setelah mata ujinya dikumpulkan, jadi ia wajib
  // ada. Baris tanpa pembahasan ditolak di sini supaya tidak ada soal yang
  // sampai ke peserta tanpa penjelasan.
  const explanation = ambil("explanation");
  if (!explanation) {
    masalah.push(
      "explanation wajib diisi — pembahasan ditampilkan kepada siswa setelah sesi dikumpulkan",
    );
  }

  const image = ambil("image");
  if (image && !pathGambarSah(image)) {
    masalah.push(
      `Kolom image harus berupa path berkas gambar pada folder public, contoh /soal/nama.svg (ditemukan "${image}").`,
    );
  }

  const valid =
    masalah.length === 0 &&
    Boolean(paket && subject && session && kunci && tingkat);

  return {
    baris: mentah.baris,
    valid,
    masalah,
    ringkas,
    data:
      valid && paket && subject && session && kunci && tingkat
        ? {
            package_id: paket.id,
            paketNama: paket.nama,
            subject,
            session,
            category: kategoriBaku,
            question,
            options: opsi,
            correct_answer: kunci,
            difficulty: tingkat,
            explanation,
            image: image || undefined,
          }
        : undefined,
  };
}

/** Validasi seluruh baris sekaligus, termasuk deteksi soal kembar. */
export function validasiSemua(
  baris: BarisMentah[],
  daftarPaket: PaketKonfig[],
): BarisPratinjau[] {
  const hasil = baris.map((item) => validasiBaris(item, daftarPaket));
  const terlihat = new Map<string, number>();

  for (const item of hasil) {
    if (!item.data) continue;
    const kunci = `${item.data.package_id}|${item.data.subject}|${item.data.question
      .toLowerCase()
      .replace(/\s+/g, " ")}`;
    const sebelumnya = terlihat.get(kunci);
    if (sebelumnya) {
      item.valid = false;
      item.masalah.push(
        `Pertanyaan sama dengan baris ${sebelumnya} pada paket dan mata pelajaran yang sama.`,
      );
      item.data = undefined;
    } else {
      terlihat.set(kunci, item.baris);
    }
  }

  return hasil;
}
