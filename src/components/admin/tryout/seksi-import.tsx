import { ImportSoal, type PilihanPaket } from "@/components/admin/import-soal";
import { KATEGORI } from "@/lib/bank-soal/skema";
import { daftarSemuaPaket, sesiTerurut } from "@/lib/paket-tryout";

export async function SeksiImport() {
  const paketPilihan: PilihanPaket[] = (await daftarSemuaPaket()).map((paket) => ({
    id: paket.id,
    nama: paket.nama,
    mataUji: sesiTerurut(paket).flatMap((sesi) =>
      sesi.mataUji.map((mata) => ({
        subject: mata.subject,
        kategori: [...KATEGORI[mata.subject]],
      })),
    ),
  }));

  return <ImportSoal paketPilihan={paketPilihan} />;
}
