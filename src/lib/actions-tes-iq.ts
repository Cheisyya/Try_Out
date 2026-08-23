"use server";

import { revalidatePath } from "next/cache";

import { wajibFitur } from "@/lib/get-session";
import { cariPaketIq } from "@/lib/tes-iq/repositori";
import { simpanJawabanIq, tutupIq, ulangiIq } from "@/lib/tes-iq/catatan";
import type { HasilLatihanIq } from "@/lib/tes-iq/tipe";

/**
 * Server Action Tes IQ latihan (khusus peserta).
 *
 * Identitas peserta selalu diambil dari sesi login, dan kunci jawaban tidak
 * pernah ikut terkirim bersama soalnya — ia baru dibuka setelah paket ditutup.
 * Penilaian dilakukan server dari jawaban yang tersimpan, bukan dari kiriman
 * browser.
 *
 * Sakelar fitur diperiksa ulang pada setiap aksi lewat `wajibFitur`, sehingga
 * latihan yang sudah dimatikan admin tidak dapat dikerjakan maupun dinilai
 * meskipun halamannya masih terbuka di tab peserta.
 */

async function konteks(paketId: string) {
  const sesiLogin = await wajibFitur("tesIqAktif");
  const paket = await cariPaketIq(paketId);
  if (!paket) return null;
  return { studentId: sesiLogin.identitas, paket };
}

/** Menyimpan satu jawaban; catatan dibuat sendiri pada jawaban pertama. */
export async function simpanJawabanIqAksi(
  paketId: string,
  nomor: number,
  huruf: string | null,
): Promise<{ tersimpan: boolean; alasan?: string }> {
  const ctx = await konteks(paketId);
  if (!ctx) return { tersimpan: false, alasan: "Paket latihan tidak dikenal." };

  const hasil = await simpanJawabanIq(ctx.studentId, ctx.paket, nomor, huruf);
  return hasil.ok
    ? { tersimpan: true }
    : { tersimpan: false, alasan: hasil.alasan };
}

export type HasilKoreksiIq =
  | { ok: true; hasil: HasilLatihanIq }
  | { ok: false; masalah: string };

/**
 * Menutup paket lalu menilainya dari jawaban yang tersimpan di server — baik
 * karena peserta menekan Selesai maupun karena waktunya habis.
 */
export async function tutupLatihanIqAksi(
  paketId: string,
  otomatis = false,
): Promise<HasilKoreksiIq> {
  const ctx = await konteks(paketId);
  if (!ctx) return { ok: false, masalah: "Paket latihan tidak dikenal." };

  const hasil = await tutupIq(ctx.studentId, ctx.paket, otomatis);
  if (!hasil.ok) return { ok: false, masalah: hasil.alasan };

  revalidatePath("/siswa/tes-iq");
  revalidatePath("/admin/tes-iq");
  return { ok: true, hasil: hasil.data };
}

/** Memulai percobaan baru atas permintaan peserta. */
export async function ulangiLatihanIqAksi(
  paketId: string,
): Promise<{ ok: true } | { ok: false; masalah: string }> {
  const ctx = await konteks(paketId);
  if (!ctx) return { ok: false, masalah: "Paket latihan tidak dikenal." };

  const hasil = await ulangiIq(ctx.studentId, ctx.paket);
  if (!hasil.ok) return { ok: false, masalah: hasil.alasan };

  revalidatePath("/siswa/tes-iq");
  return { ok: true };
}
