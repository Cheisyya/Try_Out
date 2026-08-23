"use server";

import { revalidatePath } from "next/cache";

import { wajibFitur } from "@/lib/get-session";
import { cariPaketPsikotes, cariSesiPsikotes } from "@/lib/psikotes/repositori";
import {
  mulaiSesiPsikotes,
  simpanJawabanPsikotes,
  tutupSesiPsikotes,
} from "@/lib/psikotes/catatan";
import type { HasilSesi } from "@/lib/psikotes/tipe";

/**
 * Server Action Try Out Psikotes (khusus peserta).
 *
 * Identitas peserta selalu diambil dari sesi login pada setiap aksi, sehingga
 * tidak ada yang dapat mengerjakan atau menutup sesi atas nama orang lain.
 * Klien tidak pernah mengirim nilai maupun kunci jawaban: penilaian dilakukan
 * server dari jawaban yang tersimpan, dan sakelar fitur diperiksa ulang di
 * setiap aksi lewat `wajibFitur`.
 */

async function konteks(paketId: string, sesiId: string) {
  const sesiLogin = await wajibFitur("psikotesAktif");
  const paket = await cariPaketPsikotes(paketId);
  if (!paket) return null;
  const sesi = cariSesiPsikotes(paket, sesiId);
  if (!sesi) return null;
  return { studentId: sesiLogin.identitas, paket, sesi };
}

export type HasilMulai = { ok: true; sisaDetik: number } | { ok: false; masalah: string };

export async function mulaiSesiPsikotesAksi(
  paketId: string,
  sesiId: string,
): Promise<HasilMulai> {
  const ctx = await konteks(paketId, sesiId);
  if (!ctx) return { ok: false, masalah: "Sesi psikotes tidak dikenal." };

  const hasil = await mulaiSesiPsikotes(ctx.studentId, ctx.paket, ctx.sesi);
  if (!hasil.ok) return { ok: false, masalah: hasil.alasan };

  revalidatePath(`/siswa/psikotes/${paketId}`);
  return { ok: true, sisaDetik: hasil.data.sisaDetik };
}

/**
 * Menyimpan satu jawaban. Dikirim setiap kali peserta menekan pilihan, sehingga
 * halaman yang tertutup di tengah sesi tidak kehilangan apa pun.
 */
export async function simpanJawabanPsikotesAksi(
  paketId: string,
  sesiId: string,
  nomor: number,
  huruf: string | null,
): Promise<{ tersimpan: boolean; alasan?: string }> {
  const ctx = await konteks(paketId, sesiId);
  if (!ctx) return { tersimpan: false, alasan: "Sesi psikotes tidak dikenal." };

  const hasil = await simpanJawabanPsikotes(
    ctx.studentId,
    ctx.paket,
    ctx.sesi,
    nomor,
    huruf,
  );
  return hasil.ok
    ? { tersimpan: true }
    : { tersimpan: false, alasan: hasil.alasan };
}

export type HasilTutup =
  | { ok: true; hasil: HasilSesi }
  | { ok: false; masalah: string };

/**
 * Menutup sesi lalu menilainya dari jawaban yang tersimpan di server — baik
 * karena peserta menekan Selesai maupun karena waktunya habis.
 */
export async function tutupSesiPsikotesAksi(
  paketId: string,
  sesiId: string,
  otomatis: boolean,
): Promise<HasilTutup> {
  const ctx = await konteks(paketId, sesiId);
  if (!ctx) return { ok: false, masalah: "Sesi psikotes tidak dikenal." };

  const hasil = await tutupSesiPsikotes(
    ctx.studentId,
    ctx.paket,
    ctx.sesi,
    otomatis,
  );
  if (!hasil.ok) return { ok: false, masalah: hasil.alasan };

  revalidatePath(`/siswa/psikotes/${paketId}`);
  revalidatePath("/admin/psikotes");
  return { ok: true, hasil: hasil.data };
}
