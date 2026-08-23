import type { Metadata } from "next";

import { FormOrtu } from "@/components/pendaftaran/form-ortu";
import { PageHeader } from "@/components/ui/page-header";
import { wajibFitur } from "@/lib/get-session";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";
import { validasiOrtu } from "@/lib/pendaftaran/validasi";

export const metadata: Metadata = { title: "Data Orang Tua/Wali" };

export default async function OrangTuaPage() {
  const sesi = await wajibFitur("dataDiriAktif");
  const data = await bacaPendaftaran(sesi.identitas);

  return (
    <>
      <PageHeader
        judul="Data Orang Tua/Wali"
        deskripsi="Bagian 2 dari 5 — identitas, kontak, dan alamat keluarga siswa."
      />
      <FormOrtu ortu={data.ortu} tersimpan={validasiOrtu(data.ortu).length === 0} />
    </>
  );
}
