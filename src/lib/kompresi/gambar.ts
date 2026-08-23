/**
 * Kompresi gambar di peramban.
 *
 * Dipakai sebelum berkas dikirim ke server: peserta memilih foto apa adanya
 * dari kamera ponsel (kerap 4–8 MB), lalu berkas yang benar-benar terkirim dan
 * tersimpan sudah berada di bawah batas dokumen. Server tetap menolak berkas
 * yang melebihi batas — kompresi ini mempermudah peserta, bukan menggantikan
 * pemeriksaan.
 *
 * Hanya boleh diimpor dari Client Component: seluruhnya memakai API peramban.
 */

/** Sisi terpanjang maksimal, cukup untuk dokumen A4 yang dipindai/difoto. */
const SISI_MAKS = [2000, 1600, 1200] as const;

/** Kualitas JPEG yang dicoba berurutan pada tiap ukuran. */
const KUALITAS = [0.82, 0.7, 0.6, 0.5, 0.42] as const;

export type HasilKompresi = {
  berkas: File;
  ukuranAwal: number;
  /** false bila berkas dikembalikan apa adanya karena sudah cukup kecil. */
  dikompres: boolean;
};

function gantiEkstensi(nama: string, ekstensi: string) {
  const titik = nama.lastIndexOf(".");
  const dasar = titik === -1 ? nama : nama.slice(0, titik);
  return `${dasar || "berkas"}.${ekstensi}`;
}

function keBlob(
  kanvas: HTMLCanvasElement,
  kualitas: number,
): Promise<Blob | null> {
  return new Promise((selesai) =>
    kanvas.toBlob((blob) => selesai(blob), "image/jpeg", kualitas),
  );
}

/**
 * Menyusutkan gambar sampai di bawah `maksByte`.
 *
 * Hasilnya selalu JPEG — satu-satunya format bitmap yang dapat diatur
 * kualitasnya oleh `canvas`, dan seluruh dokumen bergambar pada daftar
 * persyaratan menerima JPG. Bila target tidak tercapai, percobaan terkecil
 * tetap dikembalikan supaya pemanggil yang memutuskan pesannya.
 */
export async function kompresGambar(
  berkas: File,
  maksByte: number,
): Promise<HasilKompresi> {
  if (berkas.size <= maksByte) {
    return { berkas, ukuranAwal: berkas.size, dikompres: false };
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(berkas);
  } catch {
    throw new Error(
      "Gambar tidak dapat dibaca peramban, sehingga ukurannya tidak bisa dikecilkan otomatis. Coba simpan ulang gambarnya lalu unggah kembali.",
    );
  }

  const kanvas = document.createElement("canvas");
  const konteks = kanvas.getContext("2d");
  if (!konteks) {
    bitmap.close();
    throw new Error("Peramban ini tidak mendukung pengecilan gambar otomatis.");
  }

  let terkecil: Blob | null = null;

  try {
    for (const sisi of SISI_MAKS) {
      const skala = Math.min(1, sisi / Math.max(bitmap.width, bitmap.height));
      kanvas.width = Math.max(1, Math.round(bitmap.width * skala));
      kanvas.height = Math.max(1, Math.round(bitmap.height * skala));

      // Latar putih: JPEG tidak mengenal transparansi, dan tanpa ini bagian
      // tembus pandang pada PNG berubah menjadi hitam.
      konteks.fillStyle = "#ffffff";
      konteks.fillRect(0, 0, kanvas.width, kanvas.height);
      konteks.drawImage(bitmap, 0, 0, kanvas.width, kanvas.height);

      for (const kualitas of KUALITAS) {
        const blob = await keBlob(kanvas, kualitas);
        if (!blob) continue;
        if (!terkecil || blob.size < terkecil.size) terkecil = blob;
        if (blob.size <= maksByte) {
          return {
            berkas: jadikanBerkas(blob, berkas.name),
            ukuranAwal: berkas.size,
            dikompres: true,
          };
        }
      }
    }
  } finally {
    bitmap.close();
  }

  if (!terkecil) {
    throw new Error("Gambar gagal dikecilkan. Coba unggah berkas yang lain.");
  }

  return {
    berkas: jadikanBerkas(terkecil, berkas.name),
    ukuranAwal: berkas.size,
    dikompres: true,
  };
}

function jadikanBerkas(blob: Blob, namaAsal: string) {
  return new File([blob], gantiEkstensi(namaAsal, "jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
