import type { Subject } from "@/lib/bank-soal/skema";
import { daftarSemuaPaket, sesiTerurut } from "@/lib/paket-tryout";
import { daftarHasilAdmin, type BarisHasilAdmin } from "@/lib/pengerjaan/admin";

/**
 * Rekap hasil try out sisi admin, dikelompokkan per paket lalu per peserta.
 *
 * Sumbernya tetap `daftarHasilAdmin` yang satu barisnya satu mata uji. Di sini
 * baris-baris itu dilipat menjadi satu baris per peserta, sehingga pertanyaan
 * yang benar-benar ditanyakan panitia dapat dijawab langsung: siapa yang
 * tertinggi pada sebuah paket, dan mata pelajaran mana yang menyeretnya.
 *
 * Rumus yang dipakai — sama dengan yang dipakai portal peserta:
 *
 *   nilai satu mata uji = benar / jumlah soal yang diujikan x 100  (dibulatkan)
 *   rata-rata satu paket = jumlah nilai mata uji / banyak mata uji  (dibulatkan)
 *
 * Nilai mata uji dihitung server saat pengumpulan (lihat
 * `src/lib/pengerjaan/layanan.ts`) dan tidak dihitung ulang di sini.
 */

export type NilaiMataUji = {
  subject: Subject;
  nilai: number;
  benar: number;
  salah: number;
  kosong: number;
  jumlahSoal: number;
  waktu: number;
  otomatis: boolean;
};

export type PesertaPaket = {
  studentId: string;
  studentNama: string;
  /** Mata uji yang sudah dikumpulkan peserta ini pada paket tersebut. */
  mataUji: NilaiMataUji[];
  /** Rata-rata seluruh mata uji yang sudah dikumpulkan, 0–100. */
  rataRata: number;
  totalBenar: number;
  totalSoal: number;
  /** Pengumpulan paling akhir pada paket ini. */
  terakhir: number;
};

export type RekapPaketAdmin = {
  paketId: string;
  paketNama: string;
  nomor: number;
  aktif: boolean;
  /** Mata uji yang dijadwalkan pada paket, urut sesi lalu urutan mata uji. */
  daftarMataUji: Subject[];
  peserta: PesertaPaket[];
  /** Rata-rata seluruh peserta pada paket ini. */
  rataRata: number;
  terakhir: number;
};

function bungkus(baris: BarisHasilAdmin): NilaiMataUji {
  return {
    subject: baris.subject,
    nilai: baris.nilai,
    benar: baris.benar,
    salah: baris.salah,
    kosong: baris.kosong,
    jumlahSoal: baris.jumlahSoal,
    waktu: baris.waktu,
    otomatis: baris.otomatis,
  };
}

function susunPeserta(baris: BarisHasilAdmin[]): PesertaPaket[] {
  const peta = new Map<string, PesertaPaket>();

  for (const item of baris) {
    const peserta = peta.get(item.studentId) ?? {
      studentId: item.studentId,
      studentNama: item.studentNama,
      mataUji: [],
      rataRata: 0,
      totalBenar: 0,
      totalSoal: 0,
      terakhir: 0,
    };

    // Satu mata uji hanya boleh dihitung sekali; pengumpulan ulang tidak
    // dimungkinkan mesin ujian, tetapi penjagaan ini membuat rata-rata tetap
    // benar seandainya data lama memuat duplikat.
    if (!peserta.mataUji.some((mata) => mata.subject === item.subject)) {
      peserta.mataUji.push(bungkus(item));
      peserta.totalBenar += item.benar;
      peserta.totalSoal += item.jumlahSoal;
    }
    peserta.terakhir = Math.max(peserta.terakhir, item.waktu);
    peta.set(item.studentId, peserta);
  }

  for (const peserta of peta.values()) {
    peserta.rataRata = Math.round(
      peserta.mataUji.reduce((total, mata) => total + mata.nilai, 0) /
        peserta.mataUji.length,
    );
  }

  return [...peta.values()];
}

/** Seluruh paket beserta hasil pesertanya. Paket tanpa hasil tetap disertakan. */
export async function rekapSeluruhPaket(): Promise<RekapPaketAdmin[]> {
  const [baris, paketList] = await Promise.all([
    daftarHasilAdmin(),
    daftarSemuaPaket(),
  ]);

  return paketList.map((paket) => {
    const milikPaket = baris.filter((item) => item.paketId === paket.id);
    const peserta = susunPeserta(milikPaket).sort(
      (a, b) => b.rataRata - a.rataRata || a.studentNama.localeCompare(b.studentNama),
    );

    return {
      paketId: paket.id,
      paketNama: paket.nama,
      nomor: paket.nomor,
      aktif: paket.aktif,
      daftarMataUji: sesiTerurut(paket).flatMap((sesi) =>
        sesi.mataUji.map((mata) => mata.subject),
      ),
      peserta,
      rataRata:
        peserta.length === 0
          ? 0
          : Math.round(
              peserta.reduce((total, item) => total + item.rataRata, 0) /
                peserta.length,
            ),
      terakhir: milikPaket.reduce((akhir, item) => Math.max(akhir, item.waktu), 0),
    };
  });
}

/** Satu paket saja; `null` bila paketnya tidak dikenal. */
export async function rekapSatuPaket(
  paketId: string,
): Promise<RekapPaketAdmin | null> {
  const semua = await rekapSeluruhPaket();
  return semua.find((item) => item.paketId === paketId) ?? null;
}
