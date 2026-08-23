"use server";

import { cobaSimpan, tulisBiner } from "@/lib/penyimpanan";
import { wajibSesi } from "@/lib/get-session";

/**
 * Pengunggahan gambar pendukung soal (khusus admin).
 *
 * Lapisan pemeriksaan:
 * 1. peran admin diverifikasi ulang di server;
 * 2. ukuran berkas dibatasi;
 * 3. tipe MIME *dan* ekstensi nama berkas harus sama-sama dikenal;
 * 4. isi berkas diperiksa lewat magic bytes — tipe MIME dari klien tidak
 *    dipercaya begitu saja;
 * 5. SVG dengan skrip atau atribut kejadian ditolak, karena berkas di
 *    `public/soal` disajikan dari origin yang sama dengan aplikasi;
 * 6. nama berkas dibersihkan sehingga tidak dapat keluar dari folder tujuan.
 */

/** Kunci penyimpanan gambar soal; disajikan lewat route /gambar-soal. */
const AWALAN_GAMBAR = "gambar-soal/";
const MAKS_BYTE = 2 * 1024 * 1024;

type Ekstensi = "svg" | "png" | "jpg" | "webp";

const JENIS: Record<string, Ekstensi> = {
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

/** Ekstensi nama berkas yang diterima untuk tiap tipe. */
const EKSTENSI_SAH: Record<Ekstensi, string[]> = {
  svg: [".svg"],
  png: [".png"],
  jpg: [".jpg", ".jpeg"],
  webp: [".webp"],
};

export type HasilUnggah =
  | { ok: true; src: string }
  | { ok: false; masalah: string };

function bersihkanNama(nama: string) {
  return (
    nama
      .replace(/.[^.]*$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "gambar-soal"
  );
}

function cocokMagic(bytes: Uint8Array, ekstensi: Ekstensi) {
  const awalan = (nilai: number[]) =>
    nilai.every((byte, i) => bytes[i] === byte);

  switch (ekstensi) {
    case "png":
      return awalan([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "jpg":
      return awalan([0xff, 0xd8, 0xff]);
    case "webp":
      // "RIFF" .... "WEBP"
      return (
        awalan([0x52, 0x49, 0x46, 0x46]) &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );
    case "svg": {
      const awal = new TextDecoder()
        .decode(bytes.slice(0, 512))
        .replace(/^﻿/, "")
        .trimStart()
        .toLowerCase();
      return awal.startsWith("<?xml") || awal.startsWith("<svg") || awal.startsWith("<!doctype svg");
    }
  }
}

/** SVG yang dapat mengeksekusi skrip atau memuat sumber luar ditolak. */
function svgBerbahaya(isi: string) {
  const bersih = isi.toLowerCase();
  return (
    bersih.includes("<script") ||
    bersih.includes("<foreignobject") ||
    bersih.includes("<iframe") ||
    bersih.includes("<embed") ||
    bersih.includes("<object") ||
    bersih.includes("javascript:") ||
    /\son\w+\s*=/.test(bersih)
  );
}

export async function unggahGambarSoal(
  _prev: HasilUnggah | null,
  formData: FormData,
): Promise<HasilUnggah> {
  await wajibSesi("admin");

  const berkas = formData.get("gambar");
  if (!(berkas instanceof File) || berkas.size === 0) {
    return { ok: false, masalah: "Pilih berkas gambar terlebih dahulu." };
  }

  if (berkas.size > MAKS_BYTE) {
    return { ok: false, masalah: "Ukuran gambar maksimal 2 MB." };
  }

  const ekstensi = JENIS[berkas.type];
  if (!ekstensi) {
    return {
      ok: false,
      masalah: "Jenis berkas harus SVG, PNG, JPG, atau WebP.",
    };
  }

  const namaKecil = berkas.name.toLowerCase();
  if (!EKSTENSI_SAH[ekstensi].some((akhiran) => namaKecil.endsWith(akhiran))) {
    return {
      ok: false,
      masalah: `Ekstensi nama berkas tidak sesuai dengan tipe ${berkas.type}.`,
    };
  }

  const isi = new Uint8Array(await berkas.arrayBuffer());
  if (isi.byteLength > MAKS_BYTE) {
    return { ok: false, masalah: "Ukuran gambar maksimal 2 MB." };
  }
  if (!cocokMagic(isi, ekstensi)) {
    return {
      ok: false,
      masalah:
        "Isi berkas tidak cocok dengan jenis yang dinyatakan. Unggah berkas gambar yang sah.",
    };
  }

  if (ekstensi === "svg" && svgBerbahaya(new TextDecoder().decode(isi))) {
    return {
      ok: false,
      masalah:
        "Berkas SVG mengandung skrip atau elemen aktif sehingga ditolak. Gunakan SVG statis atau format PNG/JPG.",
    };
  }

  const namaBerkas = `${bersihkanNama(berkas.name)}-${Date.now()}.${ekstensi}`;

  const hasil = await cobaSimpan(
    () => tulisBiner(`${AWALAN_GAMBAR}${namaBerkas}`, isi),
    "Gagal menyimpan gambar.",
  );
  if (!hasil.ok) return { ok: false, masalah: hasil.pesan };

  // Gambar tidak lagi diletakkan di `public/` — pada hosting serverless folder
  // itu hanya-baca. Berkas disajikan route `/gambar-soal/<nama>` yang membaca
  // dari lapisan penyimpanan. Gambar lama di `public/soal/` tetap terlayani
  // secara statis, sehingga soal yang sudah ada tidak terpengaruh.
  return { ok: true, src: `/gambar-soal/${namaBerkas}` };
}
