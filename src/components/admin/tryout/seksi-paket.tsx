import { KelolaPaket, type BarisPaket } from "@/components/admin/kelola-paket";
import { jumlahSoalTersedia } from "@/lib/bank-soal/pengambilan";
import {
  daftarSemuaPaket,
  jendelaPaket,
  sesiTerurut,
  totalDurasiPaket,
  totalDurasiSesi,
  totalSoalPaket,
  totalSoalSesi,
} from "@/lib/paket-tryout";

/**
 * Paket try out beserta sesi dan password tiap sesi — satu halaman.
 *
 * Sesi selalu milik sebuah paket, jadi memisahkannya ke tab lain membuat satu
 * pekerjaan (menyiapkan sebuah paket) tersebar di dua tempat. Baris tabel tetap
 * satu per paket; sesi-sesinya muncul di dalam jendela pengaturannya.
 */
export async function SeksiPaket() {
  const paketList = await daftarSemuaPaket();

  const daftar: BarisPaket[] = await Promise.all(
    paketList.map(async (paket) => {
      const sesi = await Promise.all(
        sesiTerurut(paket).map(async (item) => {
          const mataUji = await Promise.all(
            item.mataUji.map(async (mata) => ({
              subject: mata.subject,
              jumlahSoal: mata.jumlahSoal,
              durasiMenit: mata.durasiMenit,
              tersedia: await jumlahSoalTersedia(paket.id, mata.subject),
            })),
          );

          return {
            paketId: paket.id,
            paketNama: paket.nama,
            sesiId: item.id,
            nama: item.nama,
            urutan: item.urutan,
            totalSoal: totalSoalSesi(item),
            totalDurasi: totalDurasiSesi(item),
            sandiTerpasang: Boolean(item.sandi?.hash),
            mataUji,
          };
        }),
      );

      return {
        id: paket.id,
        nomor: paket.nomor,
        nama: paket.nama,
        deskripsi: paket.deskripsi,
        jadwal: paket.jadwal,
        ditutupPada: paket.ditutupPada,
        statusJendela: jendelaPaket(paket).status,
        aktif: paket.aktif !== false,
        jumlahSesi: paket.sesi.length,
        totalSoal: totalSoalPaket(paket),
        totalDurasi: totalDurasiPaket(paket),
        soalTersedia: sesi.reduce(
          (total, item) =>
            total + item.mataUji.reduce((sub, mata) => sub + mata.tersedia, 0),
          0,
        ),
        sesi,
      };
    }),
  );

  return <KelolaPaket daftar={daftar} />;
}
