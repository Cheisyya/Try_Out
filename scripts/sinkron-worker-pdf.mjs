/**
 * Menyalin worker pdf.js ke folder public.
 *
 * Kompresi PDF di peramban memuat workernya lewat URL statis
 * (`/pdf.worker.min.mjs`). Berkasnya wajib berasal dari versi pdfjs-dist yang
 * sama dengan pustakanya — versi yang berbeda ditolak pdf.js saat dijalankan.
 * Skrip ini dipanggil `predev` dan `prebuild` supaya salinannya tidak pernah
 * tertinggal ketika pustakanya diperbarui.
 */
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const akar = join(dirname(fileURLToPath(import.meta.url)), "..");
const sumber = join(akar, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const tujuan = join(akar, "public", "pdf.worker.min.mjs");

async function sama() {
  try {
    const [a, b] = await Promise.all([readFile(sumber), readFile(tujuan)]);
    return a.equals(b);
  } catch {
    return false;
  }
}

if (await sama()) {
  console.log("worker pdf.js sudah mutakhir");
} else {
  await mkdir(dirname(tujuan), { recursive: true });
  await copyFile(sumber, tujuan);
  console.log("worker pdf.js disalin ke public/pdf.worker.min.mjs");
}
