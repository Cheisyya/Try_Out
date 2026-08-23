import type { Metadata } from "next";

import { SalinDaftarIsian } from "@/components/admin/salin-daftar-isian";
import { SakelarFitur } from "@/components/admin/sakelar-fitur";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { wajibSesi } from "@/lib/get-session";
import { DAFTAR_FITUR, pengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";

export const metadata: Metadata = { title: "Pengaturan" };

/**
 * Sakelar fitur portal siswa.
 *
 * Mematikan sebuah seksi menyembunyikan menunya sekaligus menutup halamannya di
 * server, sehingga alamat yang diketik langsung pun tidak membukanya.
 */
export default async function AdminPengaturanPage() {
  await wajibSesi("admin");
  const pengaturan = await pengaturanAplikasi();

  return (
    <>
      <PageHeader
        judul="Pengaturan"
        deskripsi="Seksi yang tampil di portal siswa dan daftar isian untuk peserta."
      />

      <Card>
        <CardHeader
          judul="Seksi Portal Siswa"
          deskripsi="Sakelar hijau berarti seksi tersebut terlihat siswa."
        />
        <CardBody className="divide-y divide-line py-0">
          {DAFTAR_FITUR.map((fitur) => (
            <SakelarFitur
              key={fitur.kunci}
              kunci={fitur.kunci}
              judul={fitur.judul}
              keterangan={fitur.keterangan}
              aktif={pengaturan[fitur.kunci]}
            />
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="Daftar Isian Data Diri"
          deskripsi="Salin lalu kirim ke peserta yang tidak mengisi sendiri — berisi apa saja yang perlu diisi dan berkas apa saja yang perlu dikirim."
        />
        <CardBody>
          <SalinDaftarIsian />
        </CardBody>
      </Card>
    </>
  );
}
