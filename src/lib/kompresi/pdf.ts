/**
 * Kompresi PDF di peramban.
 *
 * Cara kerjanya: tiap halaman dirender menjadi gambar JPEG lewat pdf.js, lalu
 * seluruh gambar disusun ulang menjadi PDF baru dengan pdf-lib. Ini satu-satunya
 * cara menyusutkan PDF hasil pindaian tanpa alat di sisi server — dan
 * konsekuensinya nyata: teks pada PDF hasilnya **tidak dapat diseleksi maupun
 * dicari lagi** karena sudah menjadi gambar. Karena itu kompresi hanya
 * dijalankan ketika berkas memang melebihi batas, bukan pada setiap unggahan.
 *
 * Kedua pustaka diimpor secara dinamis supaya tidak ikut terbundel pada
 * pemuatan halaman — keduanya besar dan jarang dipakai.
 *
 * Hanya boleh diimpor dari Client Component.
 */

import type { HasilKompresi } from "@/lib/kompresi/gambar";

/**
 * Batas jumlah halaman.
 *
 * Setiap halaman dirender di thread utama peramban; dokumen tebal akan membuat
 * halaman membeku lama tanpa memberi tahu apa pun. Dokumen persyaratan yang
 * dimaksud paling banyak beberapa lembar, jadi batas ini aman.
 */
export const MAKS_HALAMAN_PDF = 25;

/** Lebar render (piksel) dan kualitas JPEG yang dicoba berurutan. */
const PERCOBAAN = [
  { lebar: 1500, kualitas: 0.72 },
  { lebar: 1200, kualitas: 0.62 },
  { lebar: 1000, kualitas: 0.52 },
] as const;

/**
 * Kanvas tempat halaman digambar.
 *
 * `OffscreenCanvas` didahulukan bukan sekadar demi kerapian: pada kanvas DOM,
 * pdf.js menjadwalkan penggambarannya lewat `requestAnimationFrame`, yang
 * berhenti total ketika tab tidak terlihat — pengecilan berkas akan menggantung
 * begitu peserta berpindah aplikasi atau tab. Kanvas luar layar tidak
 * bergantung pada siklus gambar halaman, jadi prosesnya jalan terus.
 */
type Kanvas =
  | { jenis: "offscreen"; kanvas: OffscreenCanvas; konteks: OffscreenCanvasRenderingContext2D }
  | { jenis: "dom"; kanvas: HTMLCanvasElement; konteks: CanvasRenderingContext2D };

function buatKanvas(lebar: number, tinggi: number): Kanvas | null {
  if (typeof OffscreenCanvas !== "undefined") {
    const kanvas = new OffscreenCanvas(lebar, tinggi);
    const konteks = kanvas.getContext("2d");
    if (konteks) return { jenis: "offscreen", kanvas, konteks };
  }

  const kanvas = document.createElement("canvas");
  kanvas.width = lebar;
  kanvas.height = tinggi;
  const konteks = kanvas.getContext("2d");
  return konteks ? { jenis: "dom", kanvas, konteks } : null;
}

function keBlob(kanvas: Kanvas, kualitas: number): Promise<Blob | null> {
  if (kanvas.jenis === "offscreen") {
    return kanvas.kanvas
      .convertToBlob({ type: "image/jpeg", quality: kualitas })
      .catch(() => null);
  }
  return new Promise((selesai) =>
    kanvas.kanvas.toBlob((blob) => selesai(blob), "image/jpeg", kualitas),
  );
}

/**
 * Menyusutkan PDF sampai di bawah `maksByte`.
 *
 * Percobaan terkecil dikembalikan bila targetnya tidak tercapai, sehingga
 * pemanggil dapat menyusun pesannya sendiri.
 */
export async function kompresPdf(
  berkas: File,
  maksByte: number,
): Promise<HasilKompresi> {
  if (berkas.size <= maksByte) {
    return { berkas, ukuranAwal: berkas.size, dikompres: false };
  }

  const [pdfjs, { PDFDocument }] = await Promise.all([
    import("pdfjs-dist"),
    import("pdf-lib"),
  ]);

  /*
   * Worker dibuat sendiri, bukan lewat `workerSrc`.
   *
   * Berkas worker pdfjs-dist v6 adalah modul ES (memakai `import.meta`), tetapi
   * dari `workerSrc` pdf.js menyusunnya sebagai worker klasik — worker itu mati
   * seketika dengan "Cannot use 'import.meta' outside a module", dan pemuatan
   * dokumen menggantung tanpa pesan. Menyerahkan port yang sudah bertipe
   * `module` menutup masalah itu. Berkasnya sendiri disalin ke folder public
   * oleh `scripts/sinkron-worker-pdf.mjs` supaya versinya selalu sama dengan
   * pustakanya.
   */
  let pekerja: Worker | null = null;
  try {
    pekerja = new Worker("/pdf.worker.min.mjs", { type: "module" });
    pdfjs.GlobalWorkerOptions.workerPort = pekerja;
  } catch {
    // Peramban tanpa dukungan module worker: pdf.js akan memakai jalur
    // cadangannya sendiri.
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const bersihkanPekerja = () => {
    if (!pekerja) return;
    pekerja.terminate();
    pekerja = null;
    pdfjs.GlobalWorkerOptions.workerPort = null;
  };

  const sumber = await berkas.arrayBuffer();

  // Tugas pemuatan dipegang terpisah: `destroy()` ada padanya, bukan pada
  // dokumennya, dan itulah yang menghentikan pemuatan setelah selesai.
  const tugas = pdfjs.getDocument({ data: new Uint8Array(sumber) });
  let dokumen;
  try {
    dokumen = await tugas.promise;
  } catch {
    bersihkanPekerja();
    throw new Error(
      "PDF tidak dapat dibaca peramban, sehingga ukurannya tidak bisa dikecilkan otomatis. Pastikan berkasnya tidak rusak dan tidak terkunci password.",
    );
  }

  if (dokumen.numPages > MAKS_HALAMAN_PDF) {
    await tugas.destroy();
    bersihkanPekerja();
    throw new Error(
      `PDF berisi ${dokumen.numPages} halaman, melebihi batas ${MAKS_HALAMAN_PDF} halaman untuk pengecilan otomatis. Kecilkan berkasnya lebih dulu, atau pindai ulang dengan resolusi lebih rendah.`,
    );
  }

  let terkecil: Uint8Array | null = null;

  try {
    for (const percobaan of PERCOBAAN) {
      const keluaran = await PDFDocument.create();

      for (let nomor = 1; nomor <= dokumen.numPages; nomor += 1) {
        const halaman = await dokumen.getPage(nomor);
        const ukuranAsli = halaman.getViewport({ scale: 1 });

        // Halaman kecil tidak diperbesar melebihi dua kali agar berkasnya tidak
        // justru membengkak.
        const skala = Math.min(2, percobaan.lebar / ukuranAsli.width);
        const viewport = halaman.getViewport({ scale: skala });

        const kanvas = buatKanvas(
          Math.max(1, Math.round(viewport.width)),
          Math.max(1, Math.round(viewport.height)),
        );
        if (!kanvas) {
          throw new Error(
            "Peramban ini tidak mendukung pengecilan PDF otomatis.",
          );
        }

        // Latar putih: halaman PDF transparan akan menjadi hitam pada JPEG.
        kanvas.konteks.fillStyle = "#ffffff";
        kanvas.konteks.fillRect(0, 0, kanvas.kanvas.width, kanvas.kanvas.height);

        await halaman.render({
          // Tipe pdf.js menyebut HTMLCanvasElement, tetapi jalur OffscreenCanvas
          // memang didukung mesinnya.
          canvas: kanvas.kanvas as unknown as HTMLCanvasElement,
          canvasContext: kanvas.konteks as unknown as CanvasRenderingContext2D,
          viewport,
          // `print`, bukan `display`: pada intent display pdf.js menjadwalkan
          // tiap potongan gambar lewat `requestAnimationFrame`, yang berhenti
          // ketika tab tidak terlihat — pengecilan akan menggantung begitu
          // peserta berpindah aplikasi. Intent print menggambar berturut-turut
          // tanpa menunggu siklus gambar halaman, dan memang itu yang kita mau:
          // salinan halaman apa adanya.
          intent: "print",
        }).promise;
        halaman.cleanup();

        const blob = await keBlob(kanvas, percobaan.kualitas);
        if (!blob) continue;

        const gambar = await keluaran.embedJpg(await blob.arrayBuffer());
        // Ukuran halaman tetap memakai satuan titik aslinya supaya hasil
        // cetaknya sama dengan berkas asal.
        const lembar = keluaran.addPage([ukuranAsli.width, ukuranAsli.height]);
        lembar.drawImage(gambar, {
          x: 0,
          y: 0,
          width: ukuranAsli.width,
          height: ukuranAsli.height,
        });
      }

      const hasil = await keluaran.save();
      if (!terkecil || hasil.byteLength < terkecil.byteLength) terkecil = hasil;
      if (hasil.byteLength <= maksByte) {
        return {
          berkas: jadikanBerkas(hasil, berkas.name),
          ukuranAwal: berkas.size,
          dikompres: true,
        };
      }
    }
  } finally {
    await tugas.destroy();
    bersihkanPekerja();
  }

  if (!terkecil) {
    throw new Error("PDF gagal dikecilkan. Coba unggah berkas yang lain.");
  }

  return {
    berkas: jadikanBerkas(terkecil, berkas.name),
    ukuranAwal: berkas.size,
    dikompres: true,
  };
}

function jadikanBerkas(isi: Uint8Array, nama: string) {
  // BlobPart menerima ArrayBuffer; salinan dibuat agar tipenya pasti
  // ArrayBuffer, bukan SharedArrayBuffer.
  const penyangga = new ArrayBuffer(isi.byteLength);
  new Uint8Array(penyangga).set(isi);
  return new File([penyangga], nama, {
    type: "application/pdf",
    lastModified: Date.now(),
  });
}
