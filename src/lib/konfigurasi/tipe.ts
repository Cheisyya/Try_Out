import type { Subject } from "@/lib/bank-soal/skema";

/**
 * Tipe konfigurasi paket dan sesi.
 * Berkas ini bebas dependensi Node agar aman diimpor dari mana saja.
 */

export type SesiId = "sesi-1" | "sesi-2";

export type StatusSesi = "Belum Dimulai" | "Sedang Berlangsung" | "Selesai";

export type MataUjiKonfig = {
  subject: Subject;
  jumlahSoal: number;
  durasiMenit: number;
  fokus: string;
};

export type SandiSesi = {
  hash: string;
  salt: string;
  diperbaruiPada: number;
};

export type SesiKonfig = {
  id: SesiId;
  nama: string;
  /** Urutan pelaksanaan sesi dalam satu paket. */
  urutan: number;
  mataUji: MataUjiKonfig[];
  sandi?: SandiSesi;
};

export type PaketKonfig = {
  id: string;
  nomor: number;
  nama: string;
  deskripsi: string;
  /** Waktu paket mulai dapat dikerjakan (ISO lokal, mis. 2026-08-09T08:00). */
  jadwal: string;
  /**
   * Waktu paket berhenti dapat dikerjakan. Kosong berarti tidak ada batas
   * penutupan — paket terbuka selama masih berstatus aktif.
   */
  ditutupPada?: string;
  aktif: boolean;
  sesi: SesiKonfig[];
};

/* ------------------------- Jendela waktu pengerjaan ------------------------ */

export type StatusJendela = "Belum Dibuka" | "Dibuka" | "Ditutup" | "Nonaktif";

export type JendelaPaket = {
  status: StatusJendela;
  /** Epoch milidetik, null bila tidak diatur/tidak terbaca. */
  buka: number | null;
  tutup: number | null;
  /** true bila paket boleh dikerjakan pada waktu yang diperiksa. */
  terbuka: boolean;
};

function keEpoch(nilai: string | undefined): number | null {
  if (!nilai?.trim()) return null;
  const waktu = Date.parse(nilai);
  return Number.isNaN(waktu) ? null : waktu;
}

/**
 * Menentukan apakah sebuah paket sedang berada dalam jendela pengerjaannya.
 *
 * Paket nonaktif selalu tertutup. Tanpa waktu tutup, paket dianggap terbuka
 * tanpa batas akhir. Waktu buka yang tidak terbaca diperlakukan sebagai "tidak
 * diatur" supaya kesalahan format tidak diam-diam mengunci peserta.
 */
export function jendelaPaket(
  paket: PaketKonfig,
  sekarang: number = Date.now(),
): JendelaPaket {
  const buka = keEpoch(paket.jadwal);
  const tutup = keEpoch(paket.ditutupPada);

  if (!paket.aktif) {
    return { status: "Nonaktif", buka, tutup, terbuka: false };
  }
  if (buka !== null && sekarang < buka) {
    return { status: "Belum Dibuka", buka, tutup, terbuka: false };
  }
  if (tutup !== null && sekarang >= tutup) {
    return { status: "Ditutup", buka, tutup, terbuka: false };
  }
  return { status: "Dibuka", buka, tutup, terbuka: true };
}

export const NADA_JENDELA: Record<StatusJendela, "netral" | "gold" | "hijau" | "merah"> = {
  "Belum Dibuka": "netral",
  Dibuka: "hijau",
  Ditutup: "merah",
  Nonaktif: "netral",
};

export type KonfigurasiTryOut = {
  paket: PaketKonfig[];
};

export function isSesiId(nilai: string): nilai is SesiId {
  return nilai === "sesi-1" || nilai === "sesi-2";
}

export function totalSoalSesi(sesi: SesiKonfig) {
  return sesi.mataUji.reduce((total, mata) => total + mata.jumlahSoal, 0);
}

export function totalDurasiSesi(sesi: SesiKonfig) {
  return sesi.mataUji.reduce((total, mata) => total + mata.durasiMenit, 0);
}

export function totalSoalPaket(paket: PaketKonfig) {
  return paket.sesi.reduce((total, sesi) => total + totalSoalSesi(sesi), 0);
}

export function totalDurasiPaket(paket: PaketKonfig) {
  return paket.sesi.reduce((total, sesi) => total + totalDurasiSesi(sesi), 0);
}

/** Sesi diurutkan sesuai kolom urutan yang diatur admin. */
export function sesiTerurut(paket: PaketKonfig) {
  return [...paket.sesi].sort((a, b) => a.urutan - b.urutan);
}

export function ringkasMataUji(sesi: SesiKonfig) {
  return sesi.mataUji.map((mata) => mata.subject).join(" & ");
}
