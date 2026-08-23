import { randomUUID } from "node:crypto";

import {
  bacaBiner,
  bacaJson,
  cobaSimpan,
  hapusKunci,
  tulisBiner,
  tulisJson,
} from "@/lib/penyimpanan";
import {
  isMataPelajaran,
  MAKS_BYTE_MATERI,
  type MataPelajaran,
  type Materi,
} from "@/lib/materi/tipe";

/**
 * Penyimpanan materi belajar.
 *
 * Daftar materi berada pada satu dokumen JSON, sementara berkas PDF-nya
 * disimpan terpisah per materi. Berkasnya sengaja **tidak** diletakkan di
 * `public/`: satu-satunya jalan membacanya adalah route yang memeriksa sesi
 * terlebih dahulu, sehingga materi tidak dapat dibagikan lewat tautan langsung.
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

const KUNCI_INDEKS = "materi/indeks.json";

function kunciBerkas(id: string) {
  return `materi/berkas/${id.replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;
}

/* -------------------------------- Pembacaan ------------------------------- */

const UMUR_CACHE_MS = 5_000;

let cache: { waktu: number; data: Materi[] } | null = null;

function rapikan(data: unknown): Materi[] {
  if (!Array.isArray(data)) return [];

  return data.flatMap((item: Partial<Materi>) => {
    if (!item?.id || !item.judul) return [];
    if (!isMataPelajaran(String(item.mataPelajaran))) {
      // Daftar mata pelajaran pernah lebih panjang. Materi lama yang mata
      // pelajarannya sudah dihapus tidak ikut ditampilkan — dicatat ke log agar
      // hilangnya tidak diam-diam, dan berkasnya tetap utuh di penyimpanan.
      console.warn(
        `Materi "${item.id}" memakai mata pelajaran "${item.mataPelajaran}" yang sudah tidak dikenal dan dilewati.`,
      );
      return [];
    }

    return [
      {
        id: String(item.id),
        mataPelajaran: item.mataPelajaran as MataPelajaran,
        judul: String(item.judul),
        deskripsi: String(item.deskripsi ?? ""),
        namaAsli: String(item.namaAsli ?? ""),
        ukuran: Number(item.ukuran) || 0,
        aktif: item.aktif !== false,
        diunggahPada: Number(item.diunggahPada) || 0,
      },
    ];
  });
}

/** Seluruh materi termasuk yang nonaktif — untuk panel admin. */
export async function semuaMateri(): Promise<Materi[]> {
  if (cache && Date.now() - cache.waktu < UMUR_CACHE_MS) return cache.data;

  const data = rapikan(await bacaJson<Materi[]>(KUNCI_INDEKS)).sort(
    (a, b) => b.diunggahPada - a.diunggahPada,
  );

  cache = { waktu: Date.now(), data };
  return data;
}

/** Materi yang boleh dilihat siswa. */
export async function materiAktif(): Promise<Materi[]> {
  return (await semuaMateri()).filter((item) => item.aktif);
}

export async function cariMateri(id: string): Promise<Materi | undefined> {
  return (await semuaMateri()).find((item) => item.id === id);
}

/* -------------------------------- Perubahan ------------------------------- */

export type HasilMateri =
  | { ok: true; materi?: Materi }
  | { ok: false; masalah: string[] };

async function simpanIndeks(data: Materi[]): Promise<HasilMateri> {
  const hasil = await cobaSimpan(
    () => tulisJson(KUNCI_INDEKS, data),
    "Gagal menyimpan daftar materi.",
  );
  if (!hasil.ok) return { ok: false, masalah: [hasil.pesan] };

  cache = null;
  return { ok: true };
}

/**
 * Isi berkas diperiksa lewat magic bytes "%PDF-"; tipe MIME dari peramban tidak
 * dipercaya begitu saja karena mudah dipalsukan.
 */
function bukanPdf(bytes: Uint8Array) {
  const tanda = [0x25, 0x50, 0x44, 0x46, 0x2d];
  return !tanda.every((byte, i) => bytes[i] === byte);
}

export type MasukanMateri = {
  mataPelajaran: string;
  judul: string;
  deskripsi: string;
  berkas: File | null;
};

export async function tambahMateri(
  masukan: MasukanMateri,
): Promise<HasilMateri> {
  const masalah: string[] = [];

  const judul = masukan.judul.trim().slice(0, 120);
  const deskripsi = masukan.deskripsi.trim().slice(0, 400);

  if (!judul) masalah.push("Judul materi wajib diisi.");
  if (!isMataPelajaran(masukan.mataPelajaran)) {
    masalah.push("Mata pelajaran tidak dikenal.");
  }

  const berkas = masukan.berkas;
  if (!berkas || berkas.size === 0) {
    masalah.push("Berkas materi wajib diunggah.");
  } else if (berkas.size > MAKS_BYTE_MATERI) {
    masalah.push(
      `Ukuran berkas maksimal ${Math.round(MAKS_BYTE_MATERI / 1024 / 1024)} MB.`,
    );
  }

  if (masalah.length || !berkas) return { ok: false, masalah };

  const isi = new Uint8Array(await berkas.arrayBuffer());
  if (bukanPdf(isi)) {
    return {
      ok: false,
      masalah: [
        "Materi harus berupa berkas PDF asli. Format lain tidak dapat ditampilkan tanpa mengunduh.",
      ],
    };
  }

  const materi: Materi = {
    id: randomUUID(),
    mataPelajaran: masukan.mataPelajaran as MataPelajaran,
    judul,
    deskripsi,
    namaAsli: berkas.name.slice(0, 160),
    ukuran: isi.byteLength,
    aktif: true,
    diunggahPada: Date.now(),
  };

  const tulis = await cobaSimpan(
    () => tulisBiner(kunciBerkas(materi.id), isi),
    "Gagal menyimpan berkas materi.",
  );
  if (!tulis.ok) return { ok: false, masalah: [tulis.pesan] };

  const daftar = await semuaMateri();
  const hasil = await simpanIndeks([materi, ...daftar]);
  if (!hasil.ok) {
    // Indeks gagal ditulis — berkasnya tidak boleh tertinggal sebagai sampah.
    await hapusKunci(kunciBerkas(materi.id)).catch(() => {});
    return hasil;
  }

  return { ok: true, materi };
}

export async function perbaruiMateri(
  id: string,
  perubahan: { mataPelajaran: string; judul: string; deskripsi: string },
): Promise<HasilMateri> {
  const daftar = await semuaMateri();
  const lama = daftar.find((item) => item.id === id);
  if (!lama) return { ok: false, masalah: ["Materi tidak ditemukan."] };

  const judul = perubahan.judul.trim().slice(0, 120);
  if (!judul) return { ok: false, masalah: ["Judul materi wajib diisi."] };
  if (!isMataPelajaran(perubahan.mataPelajaran)) {
    return { ok: false, masalah: ["Mata pelajaran tidak dikenal."] };
  }

  return simpanIndeks(
    daftar.map((item) =>
      item.id === id
        ? {
            ...item,
            judul,
            deskripsi: perubahan.deskripsi.trim().slice(0, 400),
            mataPelajaran: perubahan.mataPelajaran as MataPelajaran,
          }
        : item,
    ),
  );
}

export async function setAktifMateri(
  id: string,
  aktif: boolean,
): Promise<HasilMateri> {
  const daftar = await semuaMateri();
  if (!daftar.some((item) => item.id === id)) {
    return { ok: false, masalah: ["Materi tidak ditemukan."] };
  }
  return simpanIndeks(
    daftar.map((item) => (item.id === id ? { ...item, aktif } : item)),
  );
}

export async function hapusMateri(id: string): Promise<HasilMateri> {
  const daftar = await semuaMateri();
  if (!daftar.some((item) => item.id === id)) {
    return { ok: false, masalah: ["Materi tidak ditemukan."] };
  }

  const hasil = await simpanIndeks(daftar.filter((item) => item.id !== id));
  if (!hasil.ok) return hasil;

  await hapusKunci(kunciBerkas(id)).catch(() => {});
  return { ok: true };
}

/** Isi PDF sebuah materi. Selalu lewat route yang memeriksa sesi. */
export async function bacaBerkasMateri(id: string): Promise<Buffer | null> {
  return bacaBiner(kunciBerkas(id));
}
