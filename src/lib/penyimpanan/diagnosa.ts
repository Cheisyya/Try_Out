import {
  bacaBiner,
  bacaJson,
  bacaJsonTersimpan,
  hapusKunci,
  namaPenyimpanan,
  tulisBiner,
  tulisJson,
} from "@/lib/penyimpanan";
import { urlPostgres } from "@/lib/penyimpanan/postgres";
import { akunAdminSiap } from "@/lib/admin/akun";

/**
 * Pemeriksaan mandiri lapisan penyimpanan.
 *
 * Dipakai halaman diagnosa admin untuk menjawab satu pertanyaan penting
 * sesudah deploy: "apakah data yang saya simpan benar-benar bertahan?".
 * Pemeriksaan menulis satu kunci uji, membacanya kembali, lalu menghapusnya —
 * sehingga yang diuji adalah jalur tulis sungguhan, bukan sekadar konfigurasi.
 *
 * Seluruh kegagalan ditangkap: halaman diagnosa justru harus tetap tampil
 * ketika penyimpanan sedang bermasalah.
 */

const KUNCI_UJI = "diagnosa/tulis-baca.bin";
const KUNCI_UJI_JSON = "diagnosa/paket-uji.json";

export type HasilDiagnosa = {
  adapter: "berkas" | "postgres";
  /** Ringkasan sumber penyimpanan tanpa membocorkan kredensial. */
  sumber: string;
  bisaBaca: boolean;
  bisaTulis: boolean;
  /** Terisi bila ada yang gagal. */
  pesan: string | null;
  /** Peringatan konfigurasi yang perlu diperhatikan sebelum dipakai sungguhan. */
  peringatan: string[];
};

/** Menyembunyikan kata sandi pada connection string. */
function ringkasSumber(): string {
  const url = urlPostgres();
  if (!url) {
    const folder = process.env.DATA_DIR?.trim() || ".data";
    return `Folder berkas: ${folder}`;
  }

  try {
    const terurai = new URL(url);
    return `Postgres: ${terurai.hostname}${terurai.pathname}`;
  } catch {
    return "Postgres: alamat tidak dapat dibaca";
  }
}

function peringatanKonfigurasi(adapter: "berkas" | "postgres"): string[] {
  const daftar: string[] = [];

  if (process.env.NODE_ENV === "production" && adapter === "berkas") {
    daftar.push(
      "Berjalan di mode produksi tanpa database. Pada hosting serverless seperti Vercel, data yang disimpan akan hilang. Isi DATABASE_URL untuk menyimpannya secara permanen.",
    );
  }

  const rahasia = process.env.SESSION_SECRET?.trim() ?? "";
  if (process.env.NODE_ENV === "production" && rahasia.length < 32) {
    daftar.push(
      "SESSION_SECRET belum diatur atau kurang dari 32 karakter. Tanpa itu, login akan ditolak di produksi.",
    );
  }

  if (!akunAdminSiap()) {
    daftar.push(
      process.env.NODE_ENV === "production"
        ? "Akun administrator belum dapat dipakai: isi ADMIN_EMAIL dan ADMIN_PASSWORD (minimal 10 karakter). Selama keduanya kosong, panel admin tidak dapat dimasuki siapa pun — kredensial bawaan sengaja tidak berlaku di produksi."
        : "ADMIN_EMAIL dan ADMIN_PASSWORD belum diatur, sehingga akun admin masih memakai kredensial bawaan pengembangan.",
    );
  } else if (!process.env.ADMIN_EMAIL?.trim()) {
    daftar.push(
      "Akun admin masih memakai kredensial bawaan pengembangan. Isi ADMIN_EMAIL dan ADMIN_PASSWORD sebelum dipakai sungguhan.",
    );
  }

  return daftar;
}

export async function periksaPenyimpanan(): Promise<HasilDiagnosa> {
  const adapter = namaPenyimpanan();
  const hasil: HasilDiagnosa = {
    adapter,
    sumber: ringkasSumber(),
    bisaBaca: false,
    bisaTulis: false,
    pesan: null,
    peringatan: peringatanKonfigurasi(adapter),
  };

  // Baca: konfigurasi paket selalu ada, minimal dari nilai bawaan bundel.
  try {
    const konfig = await bacaJson<{ paket?: unknown[] }>(
      "konfigurasi/paket.json",
    );
    hasil.bisaBaca = Array.isArray(konfig?.paket);
  } catch (error) {
    hasil.pesan = `Pembacaan gagal: ${error instanceof Error ? error.message : "kesalahan tidak dikenal"}`;
  }

  const contoh = {
    id: `uji-${Date.now()}`,
    nama: "uji-persistensi-paket",
    aktif: true,
  };
  const penanda = Buffer.from(`uji-${Date.now()}`, "utf8");
  try {
    // Jalur yang dipakai CRUD paket: JSON teks, bukan bind BYTEA biner.
    await tulisJson(KUNCI_UJI_JSON, contoh);
    const jsonKembali = await bacaJsonTersimpan<typeof contoh>(KUNCI_UJI_JSON);
    const jsonOk = jsonKembali?.id === contoh.id && jsonKembali?.nama === contoh.nama;

    await tulisBiner(KUNCI_UJI, penanda);
    const binerKembali = await bacaBiner(KUNCI_UJI);
    const binerOk = Boolean(
      binerKembali && Buffer.compare(binerKembali, penanda) === 0,
    );

    hasil.bisaTulis = jsonOk && binerOk;

    if (!jsonOk) {
      hasil.pesan =
        "JSON paket gagal ditulis/dibaca ulang dari database. CRUD try out, Tes IQ, dan psikotes tidak akan bertahan.";
    } else if (!binerOk && !hasil.pesan) {
      hasil.pesan =
        "Data biner berhasil ditulis tetapi tidak terbaca kembali dengan isi yang sama.";
    }
  } catch (error) {
    hasil.pesan =
      error instanceof Error
        ? error.message
        : "Penulisan gagal karena kesalahan tidak dikenal.";
  } finally {
    await hapusKunci(KUNCI_UJI).catch(() => {});
    await hapusKunci(KUNCI_UJI_JSON).catch(() => {});
  }

  return hasil;
}
