import { promises as fs } from "node:fs";
import path from "node:path";

import { bacaBawaan, daftarKunciBawaan } from "@/lib/penyimpanan/bawaan";
import {
  bersihkanKunci,
  GagalMenyimpan,
  type Penyimpanan,
} from "@/lib/penyimpanan/tipe";

/**
 * Adapter penyimpanan berbasis sistem berkas.
 *
 * Dipakai pada pengembangan lokal dan pada hosting yang memiliki disk permanen.
 * Seluruh tulisan masuk ke satu folder (`DATA_DIR`, bawaannya `.data/`), bukan
 * tersebar ke dalam folder sumber, sehingga folder itu saja yang perlu
 * dicadangkan atau dipasang sebagai volume.
 */

const AKAR =
  process.env.DATA_DIR?.trim() || path.join(process.cwd(), ".data");

function jalur(kunci: string) {
  return path.join(AKAR, ...bersihkanKunci(kunci).split("/"));
}

function pesanGagal(kunci: string, error: unknown) {
  const kode =
    error instanceof Error && "code" in error ? String(error.code) : "";

  if (kode === "EROFS" || kode === "EACCES" || kode === "EPERM") {
    return new GagalMenyimpan(
      "Sistem berkas pada lingkungan ini tidak dapat ditulis. Atur DATA_DIR ke folder yang dapat ditulis, atau pasang database dengan mengisi DATABASE_URL.",
      { cause: error },
    );
  }
  return new GagalMenyimpan(
    `Gagal menyimpan "${kunci}": ${error instanceof Error ? error.message : "kesalahan tidak dikenal"}`,
    { cause: error },
  );
}

export const penyimpananBerkas: Penyimpanan = {
  nama: "berkas",

  async baca(kunci) {
    try {
      return await fs.readFile(jalur(kunci));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error(`Penyimpanan: gagal membaca "${kunci}"`, error);
      }
      // Belum pernah ditulis — pakai nilai bawaan dari bundel bila ada.
      return bacaBawaan(bersihkanKunci(kunci));
    }
  },

  async tulis(kunci, isi) {
    const tujuan = jalur(kunci);
    try {
      await fs.mkdir(path.dirname(tujuan), { recursive: true });
      // Tulis ke berkas sementara lalu ganti nama: pembaca tidak pernah melihat
      // berkas setengah tertulis bila proses berhenti di tengah jalan.
      const sementara = `${tujuan}.${process.pid}.tmp`;
      await fs.writeFile(sementara, isi);
      await fs.rename(sementara, tujuan);
    } catch (error) {
      throw pesanGagal(kunci, error);
    }
  },

  async hapus(kunci) {
    try {
      await fs.rm(jalur(kunci), { force: true });
    } catch (error) {
      throw pesanGagal(kunci, error);
    }
  },

  async hapusAwalan(awalan) {
    try {
      await fs.rm(jalur(awalan), { recursive: true, force: true });
    } catch (error) {
      throw pesanGagal(awalan, error);
    }
  },

  async daftarKunci(awalan) {
    const bersih = bersihkanKunci(awalan);
    const kunci = new Set(await daftarKunciBawaan(bersih));

    async function telusuri(relatif: string) {
      let isi: import("node:fs").Dirent[];
      try {
        isi = await fs.readdir(path.join(AKAR, relatif), {
          withFileTypes: true,
        });
      } catch {
        return;
      }

      for (const entri of isi) {
        // Berkas sementara milik penulisan yang belum selesai tidak dihitung.
        if (entri.name.endsWith(".tmp")) continue;

        const anak = relatif ? `${relatif}/${entri.name}` : entri.name;
        if (entri.isDirectory()) await telusuri(anak);
        else if (anak.startsWith(bersih)) kunci.add(anak);
      }
    }

    await telusuri("");
    return [...kunci].sort();
  },
};
