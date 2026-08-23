import { daftarSemuaPaket, getPaket, getSesi } from "@/lib/paket-tryout";
import type { Subject } from "@/lib/bank-soal/skema";
import { bacaBerkasBanyak, daftarIdPeserta } from "@/lib/pengerjaan/repositori";
import type { Percobaan } from "@/lib/pengerjaan/tipe";

/**
 * Pembacaan hasil pengerjaan seluruh peserta untuk panel admin.
 * Hanya dipanggil dari halaman/aksi yang sudah dijaga peran admin.
 */

export async function semuaPercobaan(): Promise<Percobaan[]> {
  const id = await daftarIdPeserta();
  const berkas = await bacaBerkasBanyak(id);
  return berkas.flatMap((item) => item.percobaan);
}

export type BarisHasilAdmin = {
  id: string;
  percobaanId: string;
  studentId: string;
  studentNama: string;
  paketId: string;
  paketNama: string;
  sesiId: string;
  sesiNama: string;
  subject: Subject;
  nilai: number;
  benar: number;
  salah: number;
  kosong: number;
  jumlahSoal: number;
  waktu: number;
  otomatis: boolean;
};

/** Satu baris per mata uji yang sudah dikumpulkan peserta. */
export async function daftarHasilAdmin(): Promise<BarisHasilAdmin[]> {
  const [percobaan, paketList] = await Promise.all([
    semuaPercobaan(),
    daftarSemuaPaket(),
  ]);

  // Konfigurasi paket dipetakan sekali di depan: pencarian di dalam flatMap
  // harus sinkron, dan cara ini juga menghindari pembacaan berulang per baris.
  const petaPaket = new Map(paketList.map((paket) => [paket.id, paket]));

  return percobaan
    .flatMap((item) => {
      const paket = petaPaket.get(item.package_id);
      const sesi = paket?.sesi.find((s) => s.id === item.session_id);

      return item.hasil.map((hasil) => ({
        id: `${item.id}-${hasil.subject}`,
        percobaanId: item.id,
        studentId: item.student_id,
        studentNama: item.student_nama,
        paketId: item.package_id,
        paketNama: paket?.nama ?? item.package_id,
        sesiId: item.session_id,
        sesiNama: sesi?.nama ?? item.session_id,
        subject: hasil.subject,
        nilai: hasil.nilai,
        benar: hasil.benar,
        salah: hasil.salah,
        kosong: hasil.kosong,
        jumlahSoal: hasil.jumlah_soal,
        waktu: hasil.submitted_at,
        otomatis: hasil.otomatis,
      }));
    })
    .sort((a, b) => b.waktu - a.waktu);
}

export type DetailPercobaan = {
  percobaan: Percobaan;
  paketNama: string;
  sesiNama: string;
};

export async function detailPercobaan(
  percobaanId: string,
): Promise<DetailPercobaan | null> {
  const semua = await semuaPercobaan();
  const percobaan = semua.find((item) => item.id === percobaanId);
  if (!percobaan) return null;

  const [paket, sesi] = await Promise.all([
    getPaket(percobaan.package_id),
    getSesi(percobaan.package_id, percobaan.session_id),
  ]);

  return {
    percobaan,
    paketNama: paket?.nama ?? percobaan.package_id,
    sesiNama: sesi?.nama ?? percobaan.session_id,
  };
}

/** Ringkasan pengerjaan per peserta untuk halaman Siswa. */
export async function ringkasanPesertaAdmin() {
  const percobaan = await semuaPercobaan();

  const peta = new Map<
    string,
    {
      paketDikerjakan: Set<string>;
      /** Banyaknya percobaan, dipakai peringatan sebelum peserta dihapus. */
      jumlahPercobaan: number;
      sesiSelesai: number;
      sesiBerjalan: number;
      totalNilai: number;
      jumlahNilai: number;
      terakhir: number;
    }
  >();

  for (const item of percobaan) {
    const catatan = peta.get(item.student_id) ?? {
      paketDikerjakan: new Set<string>(),
      jumlahPercobaan: 0,
      sesiSelesai: 0,
      sesiBerjalan: 0,
      totalNilai: 0,
      jumlahNilai: 0,
      terakhir: 0,
    };

    catatan.paketDikerjakan.add(item.package_id);
    catatan.jumlahPercobaan += 1;
    if (item.status === "selesai") catatan.sesiSelesai += 1;
    else catatan.sesiBerjalan += 1;

    for (const hasil of item.hasil) {
      catatan.totalNilai += hasil.nilai;
      catatan.jumlahNilai += 1;
      catatan.terakhir = Math.max(catatan.terakhir, hasil.submitted_at);
    }

    peta.set(item.student_id, catatan);
  }

  return peta;
}
