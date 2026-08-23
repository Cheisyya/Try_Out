/**
 * Titik masuk konfigurasi try out.
 *
 * Struktur paket, sesi, mata uji, durasi, jumlah soal, dan password sesi kini
 * dikelola admin dan tersimpan pada lapisan konfigurasi — tidak lagi ditulis
 * di dalam kode.
 */

export {
  isSesiId,
  jendelaPaket,
  NADA_JENDELA,
  ringkasMataUji,
  sesiTerurut,
  totalDurasiPaket,
  totalDurasiSesi,
  totalSoalPaket,
  totalSoalSesi,
} from "@/lib/konfigurasi/tipe";

export type {
  JendelaPaket,
  MataUjiKonfig,
  PaketKonfig,
  SandiSesi,
  SesiId,
  SesiKonfig,
  StatusJendela,
  StatusSesi,
} from "@/lib/konfigurasi/tipe";

export {
  cariPaket as getPaket,
  cariSesi as getSesi,
  paketAktif as daftarPaketAktif,
  sandiDemoSesi,
  semuaPaket as daftarSemuaPaket,
} from "@/lib/konfigurasi/repositori";

import type { StatusSesi } from "@/lib/konfigurasi/tipe";

/** Nada badge untuk tiap status sesi. */
export const NADA_STATUS: Record<StatusSesi, "netral" | "gold" | "hijau"> = {
  "Belum Dimulai": "netral",
  "Sedang Berlangsung": "gold",
  Selesai: "hijau",
};
