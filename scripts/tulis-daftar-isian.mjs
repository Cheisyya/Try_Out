/**
 * Menulis "Daftar Isian Data Diri.txt" pada folder project.
 *
 * Berkasnya sekadar salinan siap kirim; sumber kebenarannya tetap
 * `src/lib/pendaftaran/daftar-isian.ts`, yang juga dipakai tombol salin pada
 * menu Pengaturan. Skrip ini menyalurkan modul itu lewat TypeScript ke folder
 * sementara — bukan menyalin daftarnya ulang — supaya berkas .txt tidak pernah
 * berbeda isi dengan yang dilihat admin di layar.
 *
 * Jalankan: npm run daftar-isian
 */
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const akar = join(dirname(fileURLToPath(import.meta.url)), "..");
const tujuan = join(akar, "Daftar Isian Data Diri.txt");

const sementara = await mkdtemp(join(tmpdir(), "daftar-isian-"));

try {
  // Modulnya memakai alias `@/`, jadi hasil transpilasinya ditambal ke path
  // relatif sebelum dijalankan Node.
  try {
    execFileSync(
      process.execPath,
      [
        join(akar, "node_modules", "typescript", "bin", "tsc"),
        join(akar, "src/lib/pendaftaran/daftar-isian.ts"),
        join(akar, "src/lib/pendaftaran/dokumen.ts"),
        join(akar, "src/lib/pendaftaran/tipe.ts"),
        "--outDir", sementara,
        "--module", "es2022",
        "--target", "es2022",
        "--moduleResolution", "bundler",
        "--skipLibCheck",
      ],
      { stdio: "ignore" },
    );
  } catch {
    // tsc keluar dengan kode 2 karena alias `@/` tidak dikenalnya di luar
    // tsconfig, padahal JavaScript-nya tetap dihasilkan dengan benar. Kegagalan
    // yang sesungguhnya akan tertangkap saat berkas hasilnya dibaca di bawah.
  }

  const berkas = join(sementara, "daftar-isian.js");
  const isi = (await readFile(berkas, "utf8").catch(() => {
    throw new Error(
      "Transpilasi daftar-isian.ts gagal — jalankan `npx tsc --noEmit` untuk melihat sebabnya.",
    );
  }))
    .replace(/@\/lib\/pendaftaran\/dokumen/g, "./dokumen.js")
    .replace(/@\/lib\/pendaftaran\/tipe/g, "./tipe.js");
  await writeFile(berkas, isi);

  const { teksSemua } = await import(pathToFileURL(berkas).href);

  const teks = [
    teksSemua().trimEnd(),
    "",
    "---",
    "Dibuat otomatis dari src/lib/pendaftaran/daftar-isian.ts.",
    "Perbarui dengan: npm run daftar-isian",
    "",
  ].join("\n");

  await writeFile(tujuan, teks, "utf8");
  console.log(`Daftar Isian Data Diri.txt diperbarui (${teks.length} karakter).`);
} finally {
  await rm(sementara, { recursive: true, force: true });
}
