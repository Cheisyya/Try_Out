import { bacaBawaan, daftarKunciBawaan } from "@/lib/penyimpanan/bawaan";
import {
  bersihkanKunci,
  GagalMenyimpan,
  type Penyimpanan,
} from "@/lib/penyimpanan/tipe";

/**
 * Adapter penyimpanan Postgres.
 *
 * Dipakai ketika `DATABASE_URL` (atau `POSTGRES_URL`) terisi — antara lain pada
 * Vercel, yang sistem berkasnya hanya-baca dan hilang setiap permintaan selesai.
 *
 * Seluruh data disimpan pada satu tabel kunci-nilai. Bentuk ini dipilih dengan
 * sadar: aplikasi memang menyimpan dokumen utuh (satu berkas JSON per paket,
 * per peserta, dan seterusnya), sehingga tabel per entitas tidak memberi
 * keuntungan apa pun sementara migrasinya jauh lebih berisiko. Nilainya `bytea`
 * agar berkas biner — pas foto, rapor PDF — ikut tertampung tanpa layanan lain.
 *
 * Kompatibel dengan Vercel Postgres, Neon, dan Supabase: ketiganya Postgres
 * biasa yang memberi satu connection string.
 */

const NAMA_TABEL = "penyimpanan_aplikasi";

/**
 * Batas ukuran satu nilai.
 *
 * Sengaja dibiarkan lebih longgar daripada batas unggahan (lihat
 * `src/lib/batas-unggah.ts`): yang disimpan di sini bukan hanya berkas
 * unggahan, tetapi juga dokumen JSON gabungan seperti bank soal satu paket.
 */
const MAKS_BYTE = 12 * 1024 * 1024;

export function urlPostgres() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    ""
  );
}

/* ------------------------------ Kolam koneksi ------------------------------ */

type Kolam = import("pg").Pool;

/**
 * Kolam koneksi disimpan pada `globalThis`.
 *
 * Pada pengembangan, Next me-reload modul setiap kali kode berubah; tanpa ini
 * setiap reload akan membuka kolam baru sampai database menolak koneksi.
 */
const simpul = globalThis as typeof globalThis & {
  __kolamPenyimpanan?: Kolam;
  __siapPenyimpanan?: Promise<void>;
};

function hexKeBuffer(hex: string): Buffer | null {
  const bersih = hex.replace(/^\\+x/i, "").replace(/\s+/g, "");
  if (!bersih || bersih.length % 2 !== 0 || /[^0-9a-f]/i.test(bersih)) {
    return null;
  }
  try {
    return Buffer.from(bersih, "hex");
  } catch {
    return null;
  }
}

async function kolam(): Promise<Kolam> {
  if (simpul.__kolamPenyimpanan) return simpul.__kolamPenyimpanan;

  const { Pool } = await import("pg");
  const url = urlPostgres();

  simpul.__kolamPenyimpanan = new Pool({
    connectionString: url,
    // Penyedia terkelola (Neon, Supabase, Vercel) mewajibkan TLS, dan sebagian
    // memakai sertifikat yang tidak ada pada rantai kepercayaan Node.
    ssl: url.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
    // Kolam yang terlalu kecil membuat pembacaan paralel antre satu per satu.
    // Nilainya tetap konservatif agar aman pada paket database gratis.
    max: Number(process.env.DATABASE_POOL_MAX) || 8,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  // Koneksi yang putus tidak boleh menjatuhkan proses.
  simpul.__kolamPenyimpanan.on("error", (error) => {
    console.error("Penyimpanan Postgres: koneksi bermasalah", error);
  });

  return simpul.__kolamPenyimpanan;
}

/** Membuat tabel bila belum ada. Dijalankan sekali per proses. */
async function siap(): Promise<void> {
  if (!simpul.__siapPenyimpanan) {
    simpul.__siapPenyimpanan = (async () => {
      const db = await kolam();
      await db.query(`
        CREATE TABLE IF NOT EXISTS ${NAMA_TABEL} (
          kunci TEXT PRIMARY KEY,
          isi BYTEA NOT NULL,
          diperbarui TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
    })().catch((error) => {
      // Kegagalan tidak boleh disimpan permanen — percobaan berikutnya harus
      // mencoba lagi, misalnya setelah database selesai bangun dari tidur.
      simpul.__siapPenyimpanan = undefined;
      throw error;
    });
  }
  return simpul.__siapPenyimpanan;
}

function gagal(kunci: string, error: unknown): GagalMenyimpan {
  return new GagalMenyimpan(
    `Gagal menyimpan "${kunci}" ke database: ${error instanceof Error ? error.message : "kesalahan tidak dikenal"}`,
    { cause: error },
  );
}

/** Menyeragamkan nilai BYTEA dari `pg` / Neon / Vercel Postgres. */
export function keBuffer(isi: unknown): Buffer | null {
  if (isi == null) return null;
  if (Buffer.isBuffer(isi)) return isi;
  if (isi instanceof Uint8Array) return Buffer.from(isi);
  if (typeof isi === "string") {
    const dipangkas = isi.trim();
    if (
      dipangkas.startsWith("{") ||
      dipangkas.startsWith("[") ||
      dipangkas.startsWith("\"")
    ) {
      return Buffer.from(isi, "utf8");
    }
    const dariHex = hexKeBuffer(dipangkas);
    if (dariHex) return dariHex;
    return Buffer.from(isi, "utf8");
  }
  if (typeof isi === "object" && isi !== null && "data" in isi) {
    const data = (isi as { data: unknown }).data;
    if (Array.isArray(data)) return Buffer.from(data as number[]);
  }
  return null;
}

/**
 * Membaca kunci dari tabel saja, tanpa cadangan bundel `src/data`.
 * Dipakai untuk memastikan CRUD benar-benar menulis ke database.
 */
export async function bacaPostgresTeks(kunci: string): Promise<string | null> {
  const bersih = bersihkanKunci(kunci);
  try {
    await siap();
    const db = await kolam();
    const hasil = await db.query<{ isi: unknown }>(
      `SELECT isi FROM ${NAMA_TABEL} WHERE kunci = $1`,
      [bersih],
    );
    if (hasil.rows.length === 0) return null;
    const buf = keBuffer(hasil.rows[0].isi);
    if (!buf) return null;
    return buf.toString("utf8");
  } catch (error) {
    console.error(`Penyimpanan Postgres: gagal membaca teks "${bersih}"`, error);
    throw gagal(bersih, error);
  }
}

/** Menulis teks sebagai UTF-8 dengan mengkonversinya ke hex terlebih dahulu untuk kolom BYTEA. */
export async function tulisPostgresTeks(kunci: string, teks: string): Promise<void> {
  const bersih = bersihkanKunci(kunci);
  const ukuran = Buffer.byteLength(teks, "utf8");
  if (ukuran > MAKS_BYTE) {
    throw new GagalMenyimpan(
      `Ukuran data untuk "${bersih}" melebihi batas ${Math.round(MAKS_BYTE / 1024 / 1024)} MB.`,
    );
  }

  const hex = Buffer.from(teks, "utf8").toString("hex");

  try {
    await siap();
    const db = await kolam();
    await db.query(
      `INSERT INTO ${NAMA_TABEL} (kunci, isi, diperbarui)
       VALUES ($1, decode($2, 'hex'), now())
       ON CONFLICT (kunci)
       DO UPDATE SET isi = EXCLUDED.isi, diperbarui = now()`,
      [bersih, hex],
    );

    const ulang = await bacaPostgresTeks(bersih);
    if (ulang !== teks) {
      throw new Error(
        "Baris tertulis tetapi teksnya tidak sama saat dibaca ulang dari database.",
      );
    }
  } catch (error) {
    throw gagal(bersih, error);
  }
}

export async function bacaPostgresTersimpan(
  kunci: string,
): Promise<Buffer | null> {
  const bersih = bersihkanKunci(kunci);
  try {
    await siap();
    const db = await kolam();
    const hasil = await db.query<{ isi: unknown }>(
      `SELECT isi FROM ${NAMA_TABEL} WHERE kunci = $1`,
      [bersih],
    );
    if (hasil.rows.length === 0) return null;
    return keBuffer(hasil.rows[0].isi);
  } catch (error) {
    console.error(`Penyimpanan Postgres: gagal membaca "${bersih}"`, error);
    throw gagal(bersih, error);
  }
}

/* --------------------------------- Adapter -------------------------------- */

export const penyimpananPostgres: Penyimpanan = {
  nama: "postgres",

  async baca(kunci) {
    const bersih = bersihkanKunci(kunci);
    const tersimpan = await bacaPostgresTersimpan(bersih);
    if (tersimpan) return tersimpan;
    return bacaBawaan(bersih);
  },

  async bacaBanyak(kunci) {
    const peta = new Map<string, Buffer>();
    if (kunci.length === 0) return peta;

    // Pemetaan kunci bersih → kunci asli supaya pemanggil tetap dapat mencari
    // memakai kunci yang ia kirimkan.
    const asal = new Map<string, string[]>();
    for (const item of kunci) {
      const bersih = bersihkanKunci(item);
      asal.set(bersih, [...(asal.get(bersih) ?? []), item]);
    }

    const tersimpan = new Map<string, Buffer>();
    try {
      await siap();
      const db = await kolam();
      const hasil = await db.query<{ kunci: string; isi: unknown }>(
        `SELECT kunci, isi FROM ${NAMA_TABEL} WHERE kunci = ANY($1::text[])`,
        [[...asal.keys()]],
      );
      for (const baris of hasil.rows) {
        const buf = keBuffer(baris.isi);
        if (buf) {
          tersimpan.set(baris.kunci, buf);
        }
      }
    } catch (error) {
      console.error("Penyimpanan Postgres: gagal membaca banyak kunci", error);
      throw error;
    }

    for (const [bersih, daftarAsal] of asal) {
      const isi = tersimpan.get(bersih) ?? (await bacaBawaan(bersih));
      if (!isi) continue;
      for (const nama of daftarAsal) peta.set(nama, isi);
    }
    return peta;
  },

  async tulis(kunci, isi) {
    const bersih = bersihkanKunci(kunci);
    const buf = Buffer.isBuffer(isi) ? isi : Buffer.from(isi);
    if (buf.byteLength > MAKS_BYTE) {
      throw new GagalMenyimpan(
        `Ukuran data untuk "${bersih}" melebihi batas ${Math.round(MAKS_BYTE / 1024 / 1024)} MB.`,
      );
    }

    const hex = buf.toString("hex");

    try {
      await siap();
      const db = await kolam();
      await db.query(
        `INSERT INTO ${NAMA_TABEL} (kunci, isi, diperbarui)
         VALUES ($1, decode($2, 'hex'), now())
         ON CONFLICT (kunci)
         DO UPDATE SET isi = EXCLUDED.isi, diperbarui = now()`,
        [bersih, hex],
      );
    } catch (error) {
      throw gagal(bersih, error);
    }
  },

  async hapus(kunci) {
    const bersih = bersihkanKunci(kunci);
    try {
      await siap();
      const db = await kolam();
      await db.query(`DELETE FROM ${NAMA_TABEL} WHERE kunci = $1`, [bersih]);
    } catch (error) {
      throw gagal(bersih, error);
    }
  },

  async hapusAwalan(awalan) {
    const bersih = bersihkanKunci(awalan);
    try {
      await siap();
      const db = await kolam();
      // `like_escape` menjaga tanda _ dan % pada kunci tetap harfiah.
      await db.query(
        `DELETE FROM ${NAMA_TABEL} WHERE kunci LIKE $1 ESCAPE '\\'`,
        [`${bersih.replace(/([\\%_])/g, "\\$1")}%`],
      );
    } catch (error) {
      throw gagal(bersih, error);
    }
  },

  async daftarKunci(awalan) {
    const bersih = bersihkanKunci(awalan);
    const kunci = new Set(await daftarKunciBawaan(bersih));

    try {
      await siap();
      const db = await kolam();
      const hasil = await db.query<{ kunci: string }>(
        `SELECT kunci FROM ${NAMA_TABEL} WHERE kunci LIKE $1 ESCAPE '\\'`,
        [`${bersih.replace(/([\\%_])/g, "\\$1")}%`],
      );
      for (const baris of hasil.rows) kunci.add(baris.kunci);
    } catch (error) {
      console.error(
        `Penyimpanan Postgres: gagal mendaftar kunci "${bersih}"`,
        error,
      );
    }

    return [...kunci].sort();
  },
};
