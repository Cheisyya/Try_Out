import { DOKUMEN_WAJIB } from "@/lib/pendaftaran/dokumen";
import type { Pendaftaran } from "@/lib/pendaftaran/tipe";
import {
  validasiAkademik,
  validasiBiodata,
  validasiOrtu,
  validasiPrestasi,
} from "@/lib/pendaftaran/validasi";

/**
 * Ringkasan kelengkapan pengisian.
 *
 * Dipakai siswa (penanda pada tiap menu) maupun admin (kolom progres pada
 * daftar siswa). Sebuah bagian dianggap lengkap ketika validasi bagian itu
 * tidak menemukan masalah — aturan yang sama dengan saat data disimpan.
 */

export type KunciBagian =
  | "biodata"
  | "ortu"
  | "akademik"
  | "dokumen"
  | "prestasi";

export type StatusBagian = {
  kunci: KunciBagian;
  label: string;
  href: string;
  lengkap: boolean;
  /** Keterangan singkat, mis. "10 dari 11 dokumen wajib". */
  catatan: string;
};

export const AWALAN_SISWA = "/siswa/data-diri";

/**
 * Sebuah bagian hanya lolos validasi ketika sudah pernah disimpan, sehingga
 * flag `lengkap` sekaligus menjadi penanda "data sudah tersimpan" yang dipakai
 * formulir siswa untuk masuk ke mode baca.
 */
export function statusPendaftaran(data: Pendaftaran): StatusBagian[] {
  const dokumenTerisi = DOKUMEN_WAJIB.filter(
    (spek) => data.dokumen[spek.kunci],
  ).length;

  return [
    {
      kunci: "biodata",
      label: "1. Biodata Siswa",
      href: `${AWALAN_SISWA}/biodata`,
      lengkap: validasiBiodata(data.biodata).length === 0,
      catatan: "Data utama dan data pendukung",
    },
    {
      kunci: "ortu",
      label: "2. Data Orang Tua/Wali",
      href: `${AWALAN_SISWA}/orang-tua`,
      lengkap: validasiOrtu(data.ortu).length === 0,
      catatan: "Identitas dan alamat keluarga",
    },
    {
      kunci: "akademik",
      label: "3. Data Akademik",
      href: `${AWALAN_SISWA}/akademik`,
      lengkap: validasiAkademik(data.akademik).length === 0,
      catatan: "Nilai pengetahuan semester 1–4",
    },
    {
      kunci: "dokumen",
      label: "4. Kelengkapan Dokumen",
      href: `${AWALAN_SISWA}/dokumen`,
      lengkap: dokumenTerisi === DOKUMEN_WAJIB.length,
      catatan: `${dokumenTerisi} dari ${DOKUMEN_WAJIB.length} dokumen wajib`,
    },
    {
      kunci: "prestasi",
      label: "5. Data Prestasi",
      href: `${AWALAN_SISWA}/prestasi`,
      // Isi prestasi boleh kosong, tetapi bagiannya tetap harus dibuka dan
      // disimpan siswa. Tanpa syarat itu, bagian yang belum pernah disentuh
      // ikut tercentang hijau hanya karena daftar kosong lolos validasi.
      lengkap:
        data.prestasiDisimpanPada !== undefined &&
        validasiPrestasi(data.prestasi).length === 0,
      catatan:
        data.prestasi.length > 0
          ? `${data.prestasi.length} prestasi tercatat`
          : data.prestasiDisimpanPada !== undefined
            ? "Dinyatakan tidak ada prestasi"
            : "Belum disimpan — isi atau simpan kosong bila tidak ada",
    },
  ];
}

/** Persentase bagian yang sudah lengkap, 0–100. */
export function persenKelengkapan(data: Pendaftaran) {
  const status = statusPendaftaran(data);
  const lengkap = status.filter((item) => item.lengkap).length;
  return Math.round((lengkap / status.length) * 100);
}

/** Ringkasan status berkas untuk kolom tabel admin. */
export type StatusBerkas = "Lengkap" | "Sebagian" | "Belum Ada";

export function statusBerkas(data: Pendaftaran): StatusBerkas {
  const terisi = DOKUMEN_WAJIB.filter((spek) => data.dokumen[spek.kunci]).length;
  if (terisi === 0) return "Belum Ada";
  return terisi === DOKUMEN_WAJIB.length ? "Lengkap" : "Sebagian";
}
