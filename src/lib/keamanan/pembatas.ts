/**
 * Pembatas percobaan sederhana (in-memory) untuk menahan tebakan password
 * beruntun pada login dan pembukaan sesi ujian.
 *
 * Catatan jujur mengenai batasnya: penyimpanan ada di memori proses, sehingga
 * pada lingkungan serverless dengan banyak instance pembatas ini hanya menahan
 * percobaan yang jatuh pada instance yang sama. Ia mempersulit penebakan
 * otomatis, bukan menggantikan pembatasan di tingkat infrastruktur.
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

type Catatan = { jumlah: number; sampai: number };

const catatan = new Map<string, Catatan>();

/** Menyapu catatan kedaluwarsa agar peta tidak tumbuh tanpa batas. */
function sapu(sekarang: number) {
  if (catatan.size < 500) return;
  for (const [kunci, isi] of catatan) {
    if (isi.sampai <= sekarang) catatan.delete(kunci);
  }
}

export type HasilPembatas =
  | { boleh: true }
  | { boleh: false; sisaDetik: number };

/**
 * Memeriksa sekaligus mencatat satu percobaan.
 * Percobaan yang berhasil sebaiknya menghapus catatan lewat `resetPembatas`.
 */
export function periksaPembatas(
  kunci: string,
  { maks, jendelaDetik }: { maks: number; jendelaDetik: number },
): HasilPembatas {
  const sekarang = Date.now();
  sapu(sekarang);

  const isi = catatan.get(kunci);

  if (!isi || isi.sampai <= sekarang) {
    catatan.set(kunci, { jumlah: 1, sampai: sekarang + jendelaDetik * 1000 });
    return { boleh: true };
  }

  if (isi.jumlah >= maks) {
    return {
      boleh: false,
      sisaDetik: Math.max(1, Math.ceil((isi.sampai - sekarang) / 1000)),
    };
  }

  isi.jumlah += 1;
  return { boleh: true };
}

export function resetPembatas(kunci: string) {
  catatan.delete(kunci);
}
