import type { Metadata } from "next";

import { FormBiodata } from "@/components/pendaftaran/form-biodata";
import { PageHeader } from "@/components/ui/page-header";
import { wajibFitur } from "@/lib/get-session";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";
import { validasiBiodata } from "@/lib/pendaftaran/validasi";

export const metadata: Metadata = { title: "Biodata Siswa" };

export default async function BiodataPage() {
  const sesi = await wajibFitur("dataDiriAktif");
  const data = await bacaPendaftaran(sesi.identitas);

  return (
    <>
      <PageHeader
        judul="Biodata Siswa"
        deskripsi="Bagian 1 dari 5 — data utama dan data pendukung siswa."
      />
      <FormBiodata
        biodata={data.biodata}
        tersimpan={validasiBiodata(data.biodata).length === 0}
      />
    </>
  );
}
