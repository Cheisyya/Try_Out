"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { wajibFitur } from "@/lib/get-session";
import { getPaket, isSesiId, type SesiId } from "@/lib/paket-tryout";

import {
  mulaiPercobaan,
  percobaanAktif,
  simpanJawabanPeserta,
  submitMataUji,
  type Peserta,
} from "@/lib/pengerjaan/layanan";

/**
 * Server Action pengerjaan ujian.
 *
 * Identitas peserta selalu diambil dari sesi login pada setiap aksi, sehingga
 * peserta tidak dapat mengerjakan atau mengumpulkan atas nama orang lain.
 * Klien tidak pernah mengirimkan nilai maupun kunci jawaban.
 */

async function pesertaSaatIni(): Promise<Peserta> {
  const sesi = await wajibFitur("tryoutAkademikAktif");
  return { id: sesi.identitas, nama: sesi.nama };
}

export type MulaiSesiState = { error?: string };

/** Memulai sesi tanpa password — langsung masuk ruang ujian. */
export async function mulaiSesi(
  paketIdMentah: string,
  sesiIdMentah: string,
  _prevState: MulaiSesiState,
  _formData: FormData,
): Promise<MulaiSesiState> {
  const peserta = await pesertaSaatIni();

  const paket = await getPaket(paketIdMentah);
  if (!paket || !isSesiId(sesiIdMentah)) redirect("/siswa/tryout");
  const sesiId = sesiIdMentah as SesiId;

  const hasil = await mulaiPercobaan(peserta, paket, sesiId);
  if (!hasil.ok) return { error: hasil.alasan };

  revalidatePath("/siswa", "layout");
  redirect(`/ujian/${paket.id}/${sesiId}`);
}


/**
 * Menyimpan satu jawaban. Server menentukan sendiri paket, sesi, dan mata uji
 * dari percobaan aktif milik peserta, lalu memastikan soal memang bagian dari
 * mata uji yang sedang berjalan dan batas waktunya belum lewat.
 */
export async function simpanJawaban(
  questionId: string,
  answer: string | null,
): Promise<{ tersimpan: boolean; alasan?: string }> {
  const peserta = await pesertaSaatIni();
  const hasil = await simpanJawabanPeserta(peserta, questionId, answer);
  return hasil.ok ? { tersimpan: true } : { tersimpan: false, alasan: hasil.alasan };
}

/**
 * Mengumpulkan mata uji yang sedang berjalan, baik oleh peserta maupun secara
 * otomatis saat waktu habis. Penilaian dilakukan seluruhnya di server.
 */
export async function kumpulkanMataUji(
  subjectHarapan: string,
  otomatis: boolean,
) {
  const peserta = await pesertaSaatIni();
  const hasil = await submitMataUji(peserta, { otomatis, subjectHarapan });

  if (!hasil.ok) {
    const aktif = await percobaanAktif(peserta);
    revalidatePath("/siswa", "layout");
    redirect(
      aktif
        ? `/siswa/tryout/${aktif.percobaan.package_id}?galat=${encodeURIComponent(hasil.alasan)}`
        : "/siswa/tryout",
    );
  }

  const { paketId, sesiId, sesiSelesai } = hasil.data;
  revalidatePath("/siswa", "layout");
  revalidatePath("/ujian", "layout");

  redirect(
    sesiSelesai
      ? `/siswa/tryout/${paketId}?sesi=${sesiId}&selesai=1`
      : `/ujian/${paketId}/${sesiId}?lanjut=1`,
  );
}
