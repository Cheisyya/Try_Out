import { penyimpananBerkas } from "@/lib/penyimpanan/berkas";
import { penyimpananPostgres, urlPostgres } from "@/lib/penyimpanan/postgres";
import { GagalMenyimpan, type Penyimpanan } from "@/lib/penyimpanan/tipe";

/**
 * Titik masuk penyimpanan aplikasi.
 *
 * Adapter dipilih dari environment: begitu `DATABASE_URL` (atau `POSTGRES_URL`)
 * terisi, seluruh data masuk ke Postgres; tanpa itu, ke folder `DATA_DIR`.
 * Tidak ada tempat lain di aplikasi yang perlu tahu perbedaannya.
 *
 * Modul ini hanya boleh diimpor dari Server Component atau Server Action.
 */

export { GagalMenyimpan } from "@/lib/penyimpanan/tipe";
export type { Penyimpanan } from "@/lib/penyimpanan/tipe";

let terpilih: Penyimpanan | null = null;

export function penyimpanan(): Penyimpanan {
  if (!terpilih) {
    terpilih = urlPostgres() ? penyimpananPostgres : penyimpananBerkas;
  }
  return terpilih;
}

/** Nama adapter aktif, dipakai halaman diagnosa. */
export function namaPenyimpanan() {
  return penyimpanan().nama;
}

/* ------------------------------ Pembantu teks ------------------------------ */

export async function bacaTeks(kunci: string): Promise<string | null> {
  const isi = await penyimpanan().baca(kunci);
  return isi === null ? null : isi.toString("utf8");
}

export async function tulisTeks(kunci: string, isi: string): Promise<void> {
  await penyimpanan().tulis(kunci, Buffer.from(isi, "utf8"));
}

/**
 * Membaca JSON. Mengembalikan `null` bila kunci belum ada, dan juga bila isinya
 * rusak — data cacat tidak boleh menjatuhkan halaman, cukup dicatat ke log lalu
 * pemanggil memakai nilai bawaannya.
 */
export async function bacaJson<T>(kunci: string): Promise<T | null> {
  const teks = await bacaTeks(kunci);
  if (teks === null) return null;

  try {
    return JSON.parse(teks) as T;
  } catch (error) {
    console.error(`Penyimpanan: isi "${kunci}" bukan JSON yang sah`, error);
    return null;
  }
}

export async function tulisJson(kunci: string, data: unknown): Promise<void> {
  await tulisTeks(kunci, `${JSON.stringify(data, null, 2)}\n`);
}

/**
 * Membaca banyak dokumen JSON dalam satu perjalanan ke media penyimpanan.
 *
 * Dipakai panel admin yang selalu membutuhkan puluhan dokumen sekaligus
 * (catatan pengerjaan atau data pendaftaran seluruh peserta). Membacanya satu
 * per satu berarti puluhan query berurutan pada kolam koneksi yang kecil —
 * inilah yang membuat perpindahan halaman terasa menggantung. Dokumen yang
 * belum pernah ditulis, atau yang isinya rusak, tidak muncul pada hasil.
 */
export async function bacaBanyakJson<T>(
  kunci: string[],
): Promise<Map<string, T>> {
  const hasil = new Map<string, T>();
  if (kunci.length === 0) return hasil;

  const adapter = penyimpanan();
  const mentah = adapter.bacaBanyak
    ? await adapter.bacaBanyak(kunci)
    : new Map(
        (
          await Promise.all(
            kunci.map(async (item) => [item, await adapter.baca(item)] as const),
          )
        ).filter((pasangan): pasangan is [string, Buffer] => pasangan[1] !== null),
      );

  for (const [nama, isi] of mentah) {
    try {
      hasil.set(nama, JSON.parse(isi.toString("utf8")) as T);
    } catch (error) {
      console.error(`Penyimpanan: isi "${nama}" bukan JSON yang sah`, error);
    }
  }
  return hasil;
}

/* ------------------------------ Pembantu biner ----------------------------- */

export async function bacaBiner(kunci: string): Promise<Buffer | null> {
  return penyimpanan().baca(kunci);
}

export async function tulisBiner(
  kunci: string,
  isi: Uint8Array,
): Promise<void> {
  await penyimpanan().tulis(kunci, Buffer.from(isi));
}

export async function hapusKunci(kunci: string): Promise<void> {
  await penyimpanan().hapus(kunci);
}

export async function hapusAwalan(awalan: string): Promise<void> {
  await penyimpanan().hapusAwalan(awalan);
}

export async function daftarKunci(awalan: string): Promise<string[]> {
  return penyimpanan().daftarKunci(awalan);
}

/* --------------------------- Pembungkus kegagalan -------------------------- */

export type HasilPenyimpanan =
  | { ok: true }
  | { ok: false; pesan: string };

/**
 * Menjalankan operasi tulis dan mengubah kegagalannya menjadi pesan yang layak
 * dibaca pengguna.
 *
 * Dipakai seluruh repositori supaya tidak ada satu pun jalur tulis yang dapat
 * menjatuhkan halaman: kegagalan penyimpanan selalu berakhir sebagai pesan di
 * layar, bukan sebagai galat yang tidak tertangani.
 */
export async function cobaSimpan(
  tugas: () => Promise<void>,
  pesanBawaan = "Gagal menyimpan data.",
): Promise<HasilPenyimpanan> {
  try {
    await tugas();
    return { ok: true };
  } catch (error) {
    if (error instanceof GagalMenyimpan) {
      console.error(error);
      return { ok: false, pesan: error.message };
    }
    console.error("Penyimpanan: kegagalan tak terduga", error);
    return {
      ok: false,
      pesan: `${pesanBawaan} ${error instanceof Error ? error.message : ""}`.trim(),
    };
  }
}
