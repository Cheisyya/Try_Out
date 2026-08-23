"use server";

import { revalidatePath } from "next/cache";

import { wajibSesi } from "@/lib/get-session";
import { isKunciFitur, setFitur } from "@/lib/konfigurasi/aplikasi";

/**
 * Server Action sakelar fitur portal siswa (khusus admin).
 *
 * Nama fitur divalidasi terhadap daftar yang dikenal, sehingga kunci sembarang
 * dari sisi klien tidak dapat menyelinap ke dalam berkas pengaturan.
 */
export async function ubahFiturAksi(kunci: string, aktif: boolean) {
  await wajibSesi("admin");

  if (!isKunciFitur(kunci)) {
    return { ok: false as const, masalah: ["Pengaturan tidak dikenal."] };
  }

  const hasil = await setFitur(kunci, aktif);
  if (!hasil.ok) return { ok: false as const, masalah: hasil.masalah };

  revalidatePath("/admin", "layout");
  // Menu dan halaman siswa ikut berubah begitu sakelarnya digeser.
  revalidatePath("/siswa", "layout");
  return { ok: true as const };
}
