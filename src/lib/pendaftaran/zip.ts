import { deflateRawSync } from "node:zlib";

/**
 * Penyusun arsip ZIP sederhana.
 *
 * Ditulis sendiri agar proyek tidak menambah dependensi hanya untuk satu fitur
 * unduhan. Cakupannya sengaja sempit dan cukup untuk kebutuhan panitia:
 * berkas biasa (tanpa folder kosong), metode deflate, tanpa enkripsi, dan tanpa
 * ZIP64 — ukuran berkas persyaratan siswa jauh di bawah batas 4 GB.
 *
 * Nama entri ditulis sebagai UTF-8 dan ditandai lewat bit 11 pada general
 * purpose flag, sehingga nama berkas berbahasa Indonesia tetap utuh saat
 * dibuka pada Windows Explorer maupun peralatan lain.
 */

export type EntriZip = {
  /** Jalur di dalam arsip, pemisah folder memakai garis miring. */
  nama: string;
  isi: Buffer;
};

/* ---------------------------------- CRC-32 --------------------------------- */

const TABEL_CRC = (() => {
  const tabel = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let nilai = i;
    for (let bit = 0; bit < 8; bit += 1) {
      nilai = nilai & 1 ? 0xedb88320 ^ (nilai >>> 1) : nilai >>> 1;
    }
    tabel[i] = nilai >>> 0;
  }
  return tabel;
})();

function crc32(data: Buffer) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = TABEL_CRC[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/* --------------------------------- Waktu DOS ------------------------------- */

/** Waktu MS-DOS: detik dibulatkan ke kelipatan dua, tahun dihitung dari 1980. */
function waktuDos(tanggal: Date) {
  const tahun = Math.max(1980, tanggal.getFullYear());
  return {
    waktu:
      (tanggal.getHours() << 11) |
      (tanggal.getMinutes() << 5) |
      (Math.floor(tanggal.getSeconds() / 2) & 0x1f),
    tanggal:
      ((tahun - 1980) << 9) | ((tanggal.getMonth() + 1) << 5) | tanggal.getDate(),
  };
}

/* ---------------------------------- Arsip ---------------------------------- */

const SIG_LOKAL = 0x04034b50;
const SIG_PUSAT = 0x02014b50;
const SIG_AKHIR = 0x06054b50;

/** Bit 11 menandakan nama entri memakai UTF-8. */
const BENDERA_UTF8 = 0x0800;
const METODE_DEFLATE = 8;
const VERSI = 20;

export function buatZip(entri: EntriZip[], waktu = new Date()): Buffer {
  const { waktu: jamDos, tanggal: tanggalDos } = waktuDos(waktu);

  const potongan: Buffer[] = [];
  const pusat: Buffer[] = [];
  let posisi = 0;

  for (const item of entri) {
    const nama = Buffer.from(item.nama, "utf8");
    const mentah = item.isi;
    const padat = deflateRawSync(mentah);
    const crc = crc32(mentah);

    const kepalaLokal = Buffer.alloc(30);
    kepalaLokal.writeUInt32LE(SIG_LOKAL, 0);
    kepalaLokal.writeUInt16LE(VERSI, 4);
    kepalaLokal.writeUInt16LE(BENDERA_UTF8, 6);
    kepalaLokal.writeUInt16LE(METODE_DEFLATE, 8);
    kepalaLokal.writeUInt16LE(jamDos, 10);
    kepalaLokal.writeUInt16LE(tanggalDos, 12);
    kepalaLokal.writeUInt32LE(crc, 14);
    kepalaLokal.writeUInt32LE(padat.length, 18);
    kepalaLokal.writeUInt32LE(mentah.length, 22);
    kepalaLokal.writeUInt16LE(nama.length, 26);
    kepalaLokal.writeUInt16LE(0, 28); // panjang extra field

    potongan.push(kepalaLokal, nama, padat);

    const kepalaPusat = Buffer.alloc(46);
    kepalaPusat.writeUInt32LE(SIG_PUSAT, 0);
    kepalaPusat.writeUInt16LE(VERSI, 4); // versi pembuat
    kepalaPusat.writeUInt16LE(VERSI, 6); // versi minimum pembaca
    kepalaPusat.writeUInt16LE(BENDERA_UTF8, 8);
    kepalaPusat.writeUInt16LE(METODE_DEFLATE, 10);
    kepalaPusat.writeUInt16LE(jamDos, 12);
    kepalaPusat.writeUInt16LE(tanggalDos, 14);
    kepalaPusat.writeUInt32LE(crc, 16);
    kepalaPusat.writeUInt32LE(padat.length, 20);
    kepalaPusat.writeUInt32LE(mentah.length, 24);
    kepalaPusat.writeUInt16LE(nama.length, 28);
    kepalaPusat.writeUInt16LE(0, 30); // extra field
    kepalaPusat.writeUInt16LE(0, 32); // komentar
    kepalaPusat.writeUInt16LE(0, 34); // nomor disk
    kepalaPusat.writeUInt16LE(0, 36); // atribut internal
    kepalaPusat.writeUInt32LE(0, 38); // atribut eksternal
    kepalaPusat.writeUInt32LE(posisi, 42); // offset kepala lokal

    pusat.push(kepalaPusat, nama);

    posisi += kepalaLokal.length + nama.length + padat.length;
  }

  const isiPusat = Buffer.concat(pusat);

  const akhir = Buffer.alloc(22);
  akhir.writeUInt32LE(SIG_AKHIR, 0);
  akhir.writeUInt16LE(0, 4); // nomor disk
  akhir.writeUInt16LE(0, 6); // disk berisi direktori pusat
  akhir.writeUInt16LE(entri.length, 8);
  akhir.writeUInt16LE(entri.length, 10);
  akhir.writeUInt32LE(isiPusat.length, 12);
  akhir.writeUInt32LE(posisi, 16);
  akhir.writeUInt16LE(0, 20); // panjang komentar

  return Buffer.concat([...potongan, isiPusat, akhir]);
}
