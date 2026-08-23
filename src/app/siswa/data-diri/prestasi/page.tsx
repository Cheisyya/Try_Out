import type { Metadata } from "next";

import { FormPrestasi } from "@/components/pendaftaran/form-prestasi";
import { PageHeader } from "@/components/ui/page-header";
import { wajibFitur } from "@/lib/get-session";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";

export const metadata: Metadata = { title: "Data Prestasi" };

export default async function PrestasiPage() {
  const sesi = await wajibFitur("dataDiriAktif");
  const data = await bacaPendaftaran(sesi.identitas);

  return (
    <>
      <PageHeader
        judul="Data Prestasi"
        deskripsi="Bagian 5 dari 5 — tambahkan maksimal 3 data prestasi tertinggi. Bila tidak punya, tekan Simpan tanpa mengisi apa pun."
      />
      {/*
        Prestasi tidak wajib, sehingga daftar kosong tidak dianggap "tersimpan":
        form tetap terbuka agar siswa dapat mulai menambah kapan saja.
      */}
      <FormPrestasi
        prestasi={data.prestasi}
        tersimpan={data.prestasi.length > 0}
      />
    </>
  );
}
