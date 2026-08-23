import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { identitasAdminSah } from "@/lib/admin/akun";
import {
  pengaturanAplikasi,
  type KunciFitur,
} from "@/lib/konfigurasi/aplikasi";
import { cariSiswa } from "@/lib/siswa/repositori";
import {
  decodeSession,
  SESSION_COOKIE,
  type Role,
  type Session,
} from "@/lib/session";

/** Membaca sesi aktif pada Server Component / Server Action. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

/**
 * Memastikan halaman/aksi hanya dapat diakses oleh peran tertentu.
 *
 * Middleware sudah menjaga route, ini lapisan kedua yang berjalan pada setiap
 * Server Component dan Server Action. Selain tanda tangan token, identitas di
 * dalam sesi diperiksa ulang terhadap data terkini: peserta yang dihapus atau
 * dinonaktifkan langsung kehilangan akses tanpa menunggu sesinya kedaluwarsa.
 */
export async function wajibSesi(role: Role): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/masuk?alasan=perlu-masuk");
  if (session.role !== role) {
    redirect(session.role === "siswa" ? "/siswa" : "/admin");
  }

  if (session.role === "siswa") {
    const siswa = await cariSiswa(session.identitas);
    if (!siswa) redirect("/masuk?alasan=tidak-dikenal");
    if (siswa.status !== "Aktif") redirect("/masuk?alasan=nonaktif");
    // Nama diambil dari data terkini, bukan dari isi token.
    return { ...session, identitas: siswa.id, nama: siswa.nama };
  }

  if (!identitasAdminSah(session.identitas)) {
    redirect("/masuk?alasan=tidak-dikenal");
  }

  return session;
}

/**
 * Menjaga halaman siswa yang dapat dimatikan admin.
 *
 * Menyembunyikan menu saja tidak cukup: alamat halamannya tetap dapat diketik
 * langsung. Pemeriksaan ini dijalankan di server sehingga fitur yang dimatikan
 * benar-benar tertutup, bukan sekadar tak terlihat.
 */
export async function wajibFitur(
  fitur: KunciFitur,
): Promise<Session> {
  const session = await wajibSesi("siswa");
  const pengaturan = await pengaturanAplikasi();
  if (!pengaturan[fitur]) redirect("/siswa");
  return session;
}
