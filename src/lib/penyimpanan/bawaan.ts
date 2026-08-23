import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Data bawaan yang ikut terbundel bersama aplikasi.
 *
 * Berkas di `src/data/**` adalah nilai awal: konfigurasi paket, bank soal, dan
 * daftar siswa contoh. Berkas-berkas itu selalu ada — juga pada hosting yang
 * sistem berkasnya hanya-baca — sehingga dipakai sebagai cadangan ketika sebuah
 * kunci belum pernah ditulis ke penyimpanan.
 *
 * Akibatnya aplikasi langsung berjalan pada database yang masih kosong: bacaan
 * pertama mengambil nilai bawaan, dan begitu admin menyimpan perubahan, nilai
 * di penyimpanan menutupi bawaannya.
 */

const DIREKTORI_BAWAAN = path.join(process.cwd(), "src", "data");

/** Kunci yang punya nilai bawaan pada bundel aplikasi. */
const AWALAN_BERBAWAAN = ["konfigurasi/", "bank-soal/"];

export function punyaBawaan(kunci: string) {
  return AWALAN_BERBAWAAN.some((awalan) => kunci.startsWith(awalan));
}

/**
 * Membaca nilai bawaan sebuah kunci. Mengembalikan null bila kunci itu memang
 * tidak punya bawaan, atau berkasnya tidak ada pada bundel.
 */
export async function bacaBawaan(kunci: string): Promise<Buffer | null> {
  if (!punyaBawaan(kunci)) return null;

  try {
    return await fs.readFile(path.join(DIREKTORI_BAWAAN, kunci));
  } catch {
    return null;
  }
}

/** Kunci bawaan yang diawali `awalan`, dipakai saat mendaftar isi penyimpanan. */
export async function daftarKunciBawaan(awalan: string): Promise<string[]> {
  if (!AWALAN_BERBAWAAN.some((a) => a.startsWith(awalan) || awalan.startsWith(a))) {
    return [];
  }

  const kunci: string[] = [];

  async function telusuri(relatif: string) {
    let isi: import("node:fs").Dirent[];
    try {
      isi = await fs.readdir(path.join(DIREKTORI_BAWAAN, relatif), {
        withFileTypes: true,
      });
    } catch {
      return;
    }

    for (const entri of isi) {
      const anak = relatif ? `${relatif}/${entri.name}` : entri.name;
      if (entri.isDirectory()) await telusuri(anak);
      else if (anak.startsWith(awalan)) kunci.push(anak);
    }
  }

  await telusuri("");
  return kunci.sort();
}
