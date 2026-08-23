import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import type { SandiSesi } from "@/lib/konfigurasi/tipe";

/**
 * Penyimpanan password sesi.
 *
 * Password tidak pernah disimpan dalam bentuk teks biasa: yang tersimpan hanya
 * turunan scrypt beserta salt acak per sesi. Verifikasi memakai perbandingan
 * waktu tetap agar tidak bocor lewat selisih waktu proses.
 */

const PANJANG_KUNCI = 64;

export function buatSandi(password: string): SandiSesi {
  const salt = randomBytes(16).toString("hex");
  return {
    salt,
    hash: scryptSync(password, salt, PANJANG_KUNCI).toString("hex"),
    diperbaruiPada: Date.now(),
  };
}

export function periksaSandi(password: string, sandi?: SandiSesi) {
  if (!sandi?.hash || !sandi.salt) return false;

  const tersimpan = Buffer.from(sandi.hash, "hex");
  const diuji = scryptSync(password, sandi.salt, tersimpan.length);
  return tersimpan.length === diuji.length && timingSafeEqual(tersimpan, diuji);
}

/** Aturan minimal agar password sesi tidak terlalu mudah ditebak. */
export function validasiSandi(password: string): string[] {
  const masalah: string[] = [];
  if (password.length < 6) masalah.push("Password sesi minimal 6 karakter.");
  if (password.length > 64) masalah.push("Password sesi maksimal 64 karakter.");
  if (/\s/.test(password)) masalah.push("Password sesi tidak boleh mengandung spasi.");
  return masalah;
}
