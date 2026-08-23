/**
 * Pengiriman berkas unduhan.
 *
 * Balasan berukuran besar dikirim sebagai aliran (stream), bukan sebagai satu
 * badan balasan utuh. Alasannya ada dua:
 *
 * 1. **Batas balasan hosting serverless.** Balasan yang tidak dialirkan
 *    dibatasi ukurannya di sisi platform. Arsip ZIP berisi belasan dokumen satu
 *    peserta dengan mudah melewati batas itu.
 * 2. **Ketahanan.** Peramban mulai menerima potongan pertama tanpa menunggu
 *    seluruh berkas selesai dikirim, sehingga unduhan besar tidak tampak
 *    menggantung.
 *
 * Isinya tetap disusun lebih dahulu di memori — yang dialirkan adalah
 * pengirimannya, bukan penyusunannya. Untuk arsip seluruh peserta sekaligus,
 * batas sesungguhnya karena itu adalah memori dan durasi fungsi, bukan ukuran
 * balasannya.
 *
 * Modul ini hanya boleh diimpor dari Route Handler.
 */

/** Besar satu potongan yang dikirim. Cukup besar agar tidak boros, cukup kecil
 *  agar potongan pertama cepat sampai. */
const POTONGAN = 256 * 1024;

export type OpsiUnduhan = {
  /** Tipe MIME, mis. "application/zip". */
  tipe: string;
  /** Nama berkas yang disarankan kepada peramban. */
  namaBerkas?: string;
  /** true untuk memaksa unduhan, false untuk ditampilkan di peramban. */
  paksaUnduh?: boolean;
  /** Header tambahan, mis. Content-Security-Policy pada pembaca materi. */
  tambahan?: Record<string, string>;
};

/**
 * Menyusun balasan berisi berkas.
 *
 * `Content-Length` tetap diisi meski dialirkan, sehingga peramban dapat
 * menampilkan bilah kemajuan unduhan.
 */
export function balasanBerkas(isi: Uint8Array, opsi: OpsiUnduhan): Response {
  const aliran = new ReadableStream<Uint8Array>({
    start(pengendali) {
      for (let mulai = 0; mulai < isi.byteLength; mulai += POTONGAN) {
        pengendali.enqueue(isi.subarray(mulai, Math.min(mulai + POTONGAN, isi.byteLength)));
      }
      pengendali.close();
    },
  });

  const header = new Headers({
    "Content-Type": opsi.tipe,
    "Content-Length": String(isi.byteLength),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...opsi.tambahan,
  });

  if (opsi.namaBerkas) {
    const susunan = opsi.paksaUnduh ? "attachment" : "inline";
    // filename* dengan penyandian UTF-8 menjaga nama berbahasa Indonesia tetap
    // utuh pada Windows Explorer maupun peramban lain.
    header.set(
      "Content-Disposition",
      `${susunan}; filename*=UTF-8''${encodeURIComponent(opsi.namaBerkas)}`,
    );
  }

  return new Response(aliran, { headers: header });
}
