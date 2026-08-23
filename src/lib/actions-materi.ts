"use server";

import { revalidatePath } from "next/cache";

import { wajibSesi } from "@/lib/get-session";
import {
  hapusMateri,
  perbaruiMateri,
  setAktifMateri,
  tambahMateri,
} from "@/lib/materi/repositori";

/**
 * Server Action pengelolaan materi (khusus admin).
 *
 * Setiap aksi memverifikasi peran admin lebih dahulu; validasi isian dan
 * pemeriksaan isi berkas dilakukan di repositori sehingga tidak dapat dilewati
 * dari sisi klien.
 */

export type MateriState = { masalah?: string[]; sukses?: string };

function segarkan() {
  revalidatePath("/admin/materi");
  revalidatePath("/siswa", "layout");
}

export async function unggahMateriAksi(
  _prev: MateriState,
  formData: FormData,
): Promise<MateriState> {
  await wajibSesi("admin");

  const berkas = formData.get("berkas");
  const hasil = await tambahMateri({
    mataPelajaran: String(formData.get("mataPelajaran") ?? ""),
    judul: String(formData.get("judul") ?? ""),
    deskripsi: String(formData.get("deskripsi") ?? ""),
    berkas: berkas instanceof File ? berkas : null,
  });

  if (!hasil.ok) return { masalah: hasil.masalah };
  segarkan();
  return { sukses: `Materi "${hasil.materi?.judul}" berhasil diunggah.` };
}

export async function simpanMateriAksi(
  id: string,
  _prev: MateriState,
  formData: FormData,
): Promise<MateriState> {
  await wajibSesi("admin");

  const hasil = await perbaruiMateri(id, {
    mataPelajaran: String(formData.get("mataPelajaran") ?? ""),
    judul: String(formData.get("judul") ?? ""),
    deskripsi: String(formData.get("deskripsi") ?? ""),
  });

  if (!hasil.ok) return { masalah: hasil.masalah };
  segarkan();
  return { sukses: "Perubahan materi tersimpan." };
}

export async function ubahAktifMateriAksi(id: string, aktif: boolean) {
  await wajibSesi("admin");
  const hasil = await setAktifMateri(id, aktif);
  if (hasil.ok) segarkan();
  return hasil.ok
    ? { ok: true as const }
    : { ok: false as const, masalah: hasil.masalah };
}

export async function hapusMateriAksi(id: string) {
  await wajibSesi("admin");
  const hasil = await hapusMateri(id);
  if (hasil.ok) segarkan();
  return hasil.ok
    ? { ok: true as const }
    : { ok: false as const, masalah: hasil.masalah };
}
