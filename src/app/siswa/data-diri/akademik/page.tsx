import type { Metadata } from "next";

import { FormAkademik } from "@/components/pendaftaran/form-akademik";
import { PageHeader } from "@/components/ui/page-header";
import { wajibFitur } from "@/lib/get-session";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";
import { validasiAkademik } from "@/lib/pendaftaran/validasi";

export const metadata: Metadata = { title: "Data Akademik" };

export default async function AkademikPage() {
  const sesi = await wajibFitur("dataDiriAktif");
  const data = await bacaPendaftaran(sesi.identitas);

  return (
    <>
      <PageHeader
        judul="Data Akademik Siswa"
        deskripsi="Bagian 3 dari 5 — nilai pengetahuan rapor semester 1 sampai 4."
      />
      <FormAkademik
        akademik={data.akademik}
        tersimpan={validasiAkademik(data.akademik).length === 0}
      />
    </>
  );
}
