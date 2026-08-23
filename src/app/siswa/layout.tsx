import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { wajibSesi } from "@/lib/get-session";
import { pengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";
import { cariSiswa } from "@/lib/siswa/repositori";
import { percobaanAktif } from "@/lib/pengerjaan/layanan";

export default async function SiswaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await wajibSesi("siswa");

  // Membaca percobaan aktif sekaligus membukukan mata uji yang waktunya sudah
  // habis, sehingga status yang ditampilkan pada seluruh halaman siswa selalu
  // mencerminkan hasil yang sudah tersimpan di server.
  await percobaanAktif({ id: session.identitas, nama: session.nama });

  const [siswa, pengaturan] = await Promise.all([
    cariSiswa(session.identitas),
    pengaturanAplikasi(),
  ]);

  return (
    <DashboardShell
      role="siswa"
      nama={session.nama}
      identitas={siswa?.username ?? session.identitas}
      pengaturan={pengaturan}
    >
      {children}
    </DashboardShell>
  );
}
