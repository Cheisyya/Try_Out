import type { Metadata } from "next";

import { KartuDokumen } from "@/components/pendaftaran/unggah-dokumen";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { wajibFitur } from "@/lib/get-session";
import { DOKUMEN, DOKUMEN_WAJIB } from "@/lib/pendaftaran/dokumen";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";

export const metadata: Metadata = { title: "Kelengkapan Dokumen" };

export default async function DokumenPage() {
  const sesi = await wajibFitur("dataDiriAktif");
  const data = await bacaPendaftaran(sesi.identitas);

  // Penamaan berkas memakai nama pada biodata; sebelum biodata terisi, nama
  // peserta pada akun portal dipakai sebagai gantinya.
  const namaSiswa = data.biodata.namaLengkap || sesi.nama;

  const terunggahWajib = DOKUMEN_WAJIB.filter(
    (spek) => data.dokumen[spek.kunci],
  ).length;
  const persen = Math.round((terunggahWajib / DOKUMEN_WAJIB.length) * 100);

  return (
    <>
      <PageHeader
        judul="Kelengkapan Dokumen"
        deskripsi="Bagian 4 dari 5 — unggah seluruh berkas persyaratan sesuai ketentuan panitia."
      />

      <Card>
        <CardHeader
          judul="Progres Unggahan"
          deskripsi={`${terunggahWajib} dari ${DOKUMEN_WAJIB.length} dokumen wajib sudah diunggah. Dokumen nomor 12–14 tidak wajib.`}
          aksi={
            <Badge tone={persen === 100 ? "hijau" : "gold"}>
              {persen}% dokumen wajib
            </Badge>
          }
        />
        <CardBody className="space-y-4">
          <Progress nilai={persen} />
          <p className="text-sm leading-relaxed text-muted">
            Berkas yang tidak sesuai format akan ditolak sistem. Berkas yang
            melebihi batas ukuran{" "}
            <b className="font-semibold text-navy-800">dikecilkan otomatis</b>{" "}
            di peramban sebelum dikirim — gambar disimpan ulang sebagai JPG, dan
            halaman PDF diubah menjadi gambar sehingga teksnya tidak lagi dapat
            diseleksi. Periksa hasilnya tetap terbaca jelas sebelum menekan
            Unggah. Nama berkas dibuat otomatis dengan pola{" "}
            <b className="font-semibold text-navy-800">
              Nomor_Nama Dokumen_Nama Siswa
            </b>{" "}
            sehingga Anda tidak perlu mengganti nama berkas sebelum mengunggah.
          </p>
        </CardBody>
      </Card>

      <div className="space-y-5">
        {DOKUMEN.map((spek) => (
          <KartuDokumen
            key={spek.kunci}
            spek={spek}
            berkas={data.dokumen[spek.kunci] ?? null}
            namaSiswa={namaSiswa}
          />
        ))}
      </div>
    </>
  );
}
