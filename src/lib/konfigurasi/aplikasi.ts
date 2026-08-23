import { bacaJson, cobaSimpan, tulisJson } from "@/lib/penyimpanan";

/**
 * Sakelar fitur portal siswa yang dipegang admin.
 *
 * Nilainya dibaca ulang oleh sisi siswa pada setiap permintaan — menu yang
 * disembunyikan bukan sekadar hilang dari sidebar, halamannya juga ditutup di
 * server (lihat `wajibFitur`), sehingga menebak alamatnya tidak membuka apa pun.
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

const KUNCI = "konfigurasi/aplikasi.json";

export type PengaturanAplikasi = {
  /** Menu "Data Diri Siswa" beserta seluruh sub-halamannya. */
  dataDiriAktif: boolean;
  /** Menu "Materi Belajar" di portal siswa. */
  materiAktif: boolean;
  /** Menu "Tes IQ (Latihan)" di portal siswa. */
  tesIqAktif: boolean;
  /** Menu "Try Out Psikotes" di portal siswa. */
  psikotesAktif: boolean;
};

export const PENGATURAN_BAWAAN: PengaturanAplikasi = {
  dataDiriAktif: true,
  materiAktif: true,
  tesIqAktif: true,
  psikotesAktif: true,
};

export type KunciFitur = keyof PengaturanAplikasi;

/** Keterangan yang tampil pada panel pengaturan admin. */
export const DAFTAR_FITUR: {
  kunci: KunciFitur;
  judul: string;
  keterangan: string;
}[] = [
  {
    kunci: "dataDiriAktif",
    judul: "Data Diri Siswa",
    keterangan:
      "Formulir biodata, data orang tua, nilai akademik, dokumen persyaratan, dan prestasi. Bila dimatikan, menu ini hilang dari portal siswa dan halamannya tidak dapat dibuka — data yang sudah masuk tetap tersimpan dan tetap terbaca admin.",
  },
  {
    kunci: "materiAktif",
    judul: "Materi Belajar",
    keterangan:
      "Materi per mata pelajaran yang diunggah pengajar. Bila dimatikan, siswa tidak melihat menu Materi.",
  },
  {
    kunci: "tesIqAktif",
    judul: "Tes IQ (Latihan)",
    keterangan:
      "Paket soal penalaran — verbal, numerik, logika, dan spasial — untuk latihan mandiri, masing-masing berbatas waktu dan boleh diulang. Tidak menghasilkan angka IQ, dan hasilnya tidak masuk Riwayat Hasil: peserta hanya melihat benar/salah beserta pembahasannya. Paket, batas waktu, dan soalnya diatur pada menu Tes IQ. Bila dimatikan, menu ini hilang dari portal siswa dan halamannya tidak dapat dibuka.",
  },
  {
    kunci: "psikotesAktif",
    judul: "Try Out Psikotes",
    keterangan:
      "Paket berisi empat sesi: TIU, Penalaran Visual, EPPS, serta Kepribadian & Emosi. Sesi TIU, Visual, dan Kepribadian dikoreksi benar/salah beserta pembahasannya; EPPS tidak dinilai benar-salah melainkan menghasilkan profil lima kecenderungan. Paket, durasi tiap sesi, dan soalnya diatur pada menu Psikotes. Hasilnya tidak masuk Riwayat Hasil. Bila dimatikan, menu ini hilang dari portal siswa dan halamannya tidak dapat dibuka.",
  },
];

/* -------------------------------- Pembacaan ------------------------------- */

/** Lihat catatan cache pada repositori siswa — pertimbangannya sama. */
const UMUR_CACHE_MS = 5_000;

let cache: { waktu: number; data: PengaturanAplikasi } | null = null;

export async function pengaturanAplikasi(): Promise<PengaturanAplikasi> {
  if (cache && Date.now() - cache.waktu < UMUR_CACHE_MS) return cache.data;

  const tersimpan = await bacaJson<Partial<PengaturanAplikasi>>(KUNCI);
  const data: PengaturanAplikasi = {
    dataDiriAktif:
      typeof tersimpan?.dataDiriAktif === "boolean"
        ? tersimpan.dataDiriAktif
        : PENGATURAN_BAWAAN.dataDiriAktif,
    materiAktif:
      typeof tersimpan?.materiAktif === "boolean"
        ? tersimpan.materiAktif
        : PENGATURAN_BAWAAN.materiAktif,
    tesIqAktif:
      typeof tersimpan?.tesIqAktif === "boolean"
        ? tersimpan.tesIqAktif
        : PENGATURAN_BAWAAN.tesIqAktif,
    psikotesAktif:
      typeof tersimpan?.psikotesAktif === "boolean"
        ? tersimpan.psikotesAktif
        : PENGATURAN_BAWAAN.psikotesAktif,
  };

  cache = { waktu: Date.now(), data };
  return data;
}

/* -------------------------------- Perubahan ------------------------------- */

export type HasilPengaturan =
  | { ok: true; data: PengaturanAplikasi }
  | { ok: false; masalah: string[] };

export function isKunciFitur(nilai: string): nilai is KunciFitur {
  return DAFTAR_FITUR.some((fitur) => fitur.kunci === nilai);
}

export async function setFitur(
  kunci: KunciFitur,
  aktif: boolean,
): Promise<HasilPengaturan> {
  const sekarang = await pengaturanAplikasi();
  const baru: PengaturanAplikasi = { ...sekarang, [kunci]: aktif };

  const hasil = await cobaSimpan(
    () => tulisJson(KUNCI, baru),
    "Gagal menyimpan pengaturan.",
  );
  if (!hasil.ok) return { ok: false, masalah: [hasil.pesan] };

  cache = null;
  return { ok: true, data: baru };
}
