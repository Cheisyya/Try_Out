"use server";

import { revalidatePath } from "next/cache";

import { wajibSesi } from "@/lib/get-session";
import { isSubject, type Subject } from "@/lib/bank-soal/skema";
import { validasiSandi } from "@/lib/konfigurasi/sandi";
import {
  buatPaket,
  hapusPaket,
  perbaruiPaket,
  perbaruiSesi,
  setAktifPaket,
  setSandiSesi,
} from "@/lib/konfigurasi/repositori";
import { isSesiId } from "@/lib/konfigurasi/tipe";

/**
 * Server Action konfigurasi try out (khusus admin).
 * Seluruh validasi dijalankan di lapisan repositori konfigurasi.
 */

export type KonfigState = { masalah?: string[]; sukses?: string };

function segarkan() {
  revalidatePath("/admin", "layout");
  revalidatePath("/siswa", "layout");
  revalidatePath("/ujian", "layout");
}

export async function simpanPaketAksi(
  paketId: string | null,
  _prev: KonfigState,
  formData: FormData,
): Promise<KonfigState> {
  await wajibSesi("admin");

  const masukan = {
    nama: String(formData.get("nama") ?? "").trim(),
    deskripsi: String(formData.get("deskripsi") ?? "").trim(),
    jadwal: String(formData.get("jadwal") ?? "").trim(),
    ditutupPada: String(formData.get("ditutupPada") ?? "").trim(),
    aktif: formData.get("aktif") !== null,
  };

  const hasil = paketId
    ? await perbaruiPaket(paketId, masukan)
    : await buatPaket(masukan);

  if (!hasil.ok) return { masalah: hasil.masalah };
  segarkan();
  return {
    sukses: paketId
      ? "Perubahan paket tersimpan."
      : `Paket baru "${masukan.nama}" berhasil dibuat.`,
  };
}

/**
 * Menghapus paket beserta konfigurasi sesinya.
 *
 * Riwayat pengerjaan peserta sengaja dibiarkan utuh — lihat catatan pada
 * `hapusPaket`.
 */
export async function hapusPaketAksi(paketId: string) {
  await wajibSesi("admin");
  const hasil = await hapusPaket(paketId);
  if (!hasil.ok) return { ok: false as const, masalah: hasil.masalah };

  segarkan();
  return { ok: true as const };
}

export async function ubahAktifPaketAksi(paketId: string, aktif: boolean) {
  try {
    await wajibSesi("admin");
    const hasil = await setAktifPaket(paketId, aktif);
    if (!hasil.ok) {
      return { ok: false as const, masalah: hasil.masalah };
    }

    // Portal siswa perlu disegarkan; panel admin memakai pembaruan optimis.
    revalidatePath("/siswa/tryout");
    revalidatePath("/siswa/hasil");
    revalidatePath("/ujian", "layout");
    return { ok: true as const };
  } catch (error) {
    console.error("ubahAktifPaketAksi:", error);
    return {
      ok: false as const,
      masalah: ["Perubahan status gagal disimpan. Coba lagi."],
    };
  }
}

export async function simpanSesiAksi(
  paketId: string,
  sesiId: string,
  _prev: KonfigState,
  formData: FormData,
): Promise<KonfigState> {
  await wajibSesi("admin");
  if (!isSesiId(sesiId)) return { masalah: ["Sesi tidak dikenal."] };

  const dipilih = formData.getAll("mataUji").map(String);
  const mataUji: { subject: Subject; jumlahSoal: number; durasiMenit: number }[] =
    [];

  for (const nama of dipilih) {
    if (!isSubject(nama)) continue;
    mataUji.push({
      subject: nama,
      jumlahSoal: Number(formData.get(`jumlahSoal_${nama}`)),
      durasiMenit: Number(formData.get(`durasi_${nama}`)),
    });
  }

  // Password sesi diatur pada formulir yang sama. Ia opsional: dibiarkan
  // kosong berarti password lama tetap berlaku.
  const password = String(formData.get("password") ?? "");
  const ulangi = String(formData.get("ulangi") ?? "");
  const gantiSandi = password.length > 0 || ulangi.length > 0;

  if (gantiSandi) {
    const masalah = validasiSandi(password);
    if (password !== ulangi) masalah.push("Konfirmasi password tidak sama.");
    if (masalah.length) return { masalah };
  }

  const hasil = await perbaruiSesi(paketId, sesiId, {
    nama: String(formData.get("nama") ?? "").trim(),
    urutan: Number(formData.get("urutan")),
    mataUji,
  });

  if (!hasil.ok) return { masalah: hasil.masalah };

  if (gantiSandi) {
    const sandi = await setSandiSesi(paketId, sesiId, password);
    if (!sandi.ok) return { masalah: sandi.masalah };
  }

  segarkan();
  return {
    sukses: gantiSandi
      ? "Konfigurasi sesi tersimpan dan password diperbarui. Sampaikan password baru kepada peserta saat sesi dibuka."
      : "Konfigurasi sesi tersimpan.",
  };
}

