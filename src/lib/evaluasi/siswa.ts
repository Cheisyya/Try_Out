import { daftarSemuaPaket } from "@/lib/paket-tryout";
import { pembahasanPaket } from "@/lib/pengerjaan/pembahasan";
import { koreksiSkor, susunProfil } from "@/lib/psikotes/bank";
import {
  cariPaketPsikotes,
  cariSesiPsikotes,
  semuaPaketPsikotes,
} from "@/lib/psikotes/repositori";
import { bacaBerkasPsikotes } from "@/lib/psikotes/catatan";
import {
  isHurufPsikotes,
  type DimensiEpps,
  type HurufPsikotes,
} from "@/lib/psikotes/tipe";
import { semuaPaketIq } from "@/lib/tes-iq/repositori";
import { bacaBerkasIq, nilaiIq } from "@/lib/tes-iq/catatan";

/**
 * Rincian pengerjaan satu peserta untuk bahan evaluasi pengajar.
 *
 * Menyatukan tiga sumber yang penyimpanannya terpisah — try out akademik,
 * psikotes, dan Tes IQ — ke dalam satu bentuk yang sama, sehingga panel admin
 * dapat menampilkannya dengan satu tabel tanpa perlu tahu asal-usulnya.
 *
 * Bentuknya sengaja ringkas: nomor, kategori, jawaban peserta, kunci, dan
 * benar/salah. Untuk evaluasi, tabel padat yang dapat dipindai sekaligus jauh
 * lebih berguna daripada kartu soal besar satu per satu — pola kesalahan per
 * kategori langsung terlihat.
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

export type ButirEvaluasi = {
  nomor: number;
  kategori: string;
  /** Jawaban peserta; null berarti dibiarkan kosong. */
  jawaban: string | null;
  kunci: string;
  benar: boolean;
};

export type BagianEvaluasi = {
  judul: string;
  /** Waktu pengumpulan dalam epoch milidetik; 0 bila tidak tercatat. */
  waktu: number;
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  butir: ButirEvaluasi[];
  perKategori: { kategori: string; benar: number; jumlah: number }[];
};

/** Sesi EPPS tidak punya kunci, jadi ia dilaporkan sebagai profil. */
export type ProfilEvaluasi = {
  judul: string;
  waktu: number;
  dijawab: number;
  total: number;
  baris: { dimensi: DimensiEpps; skor: number; maks: number }[];
};

export type SumberEvaluasi = "tryout" | "psikotes" | "tesiq";

export type KelompokEvaluasi = {
  sumber: SumberEvaluasi;
  judul: string;
  bagian: BagianEvaluasi[];
  profil: ProfilEvaluasi[];
};

/** Menghitung rekap per kategori dari daftar butir. */
function rekapKategori(butir: ButirEvaluasi[]) {
  const urutan: string[] = [];
  const peta = new Map<string, { benar: number; jumlah: number }>();

  for (const item of butir) {
    if (!peta.has(item.kategori)) {
      peta.set(item.kategori, { benar: 0, jumlah: 0 });
      urutan.push(item.kategori);
    }
    const baris = peta.get(item.kategori)!;
    baris.jumlah += 1;
    if (item.benar) baris.benar += 1;
  }

  return urutan.map((kategori) => ({ kategori, ...peta.get(kategori)! }));
}

function ringkas(butir: ButirEvaluasi[]) {
  const benar = butir.filter((item) => item.benar).length;
  const kosong = butir.filter((item) => item.jawaban === null).length;
  return {
    benar,
    salah: butir.length - benar - kosong,
    kosong,
    total: butir.length,
  };
}

/* -------------------------------------------------------------------------- */
/*                            Try out akademik                                */
/* -------------------------------------------------------------------------- */

async function evaluasiTryOut(studentId: string): Promise<KelompokEvaluasi[]> {
  const paketList = await daftarSemuaPaket();

  const hasil = await Promise.all(
    paketList.map(async (paket): Promise<KelompokEvaluasi | null> => {
      const data = await pembahasanPaket(studentId, paket.id);
      if (!data || data.mataUji.length === 0) return null;

      const bagian: BagianEvaluasi[] = data.mataUji.map((mata) => {
        const butir: ButirEvaluasi[] = mata.butir.map((item) => ({
          nomor: item.nomor,
          kategori: item.kategori,
          jawaban: item.jawaban,
          kunci: item.kunci,
          benar: item.benar,
        }));

        return {
          judul: `${mata.subject} · ${mata.sesiNama}`,
          waktu: mata.dikumpulkanPada,
          benar: mata.benar,
          salah: mata.salah,
          kosong: mata.kosong,
          total: mata.jumlahSoal,
          butir,
          perKategori: rekapKategori(butir),
        };
      });

      return {
        sumber: "tryout" as const,
        judul: data.paketNama,
        bagian,
        profil: [],
      };
    }),
  );

  return hasil.filter((item): item is KelompokEvaluasi => item !== null);
}

/* -------------------------------------------------------------------------- */
/*                                  Psikotes                                  */
/* -------------------------------------------------------------------------- */

/** Menyaring kiriman tersimpan menjadi pilihan A/B milik EPPS. */
function pilihanEpps(jawaban: Record<string, string>) {
  const peta = new Map<number, "A" | "B">();
  for (const [nomor, huruf] of Object.entries(jawaban)) {
    const urutan = Number(nomor);
    if (!Number.isInteger(urutan)) continue;
    if (huruf !== "A" && huruf !== "B") continue;
    peta.set(urutan, huruf);
  }
  return peta;
}

/** Menyaring kiriman tersimpan menjadi huruf A–D milik sesi berkunci. */
function jawabanBerkunci(jawaban: Record<string, string>) {
  const peta = new Map<number, HurufPsikotes>();
  for (const [nomor, huruf] of Object.entries(jawaban)) {
    const urutan = Number(nomor);
    if (!Number.isInteger(urutan)) continue;
    if (!isHurufPsikotes(huruf)) continue;
    peta.set(urutan, huruf);
  }
  return peta;
}

async function evaluasiPsikotes(studentId: string): Promise<KelompokEvaluasi[]> {
  const [berkas, daftarPaket] = await Promise.all([
    bacaBerkasPsikotes(studentId),
    semuaPaketPsikotes(),
  ]);

  // Dikelompokkan per paket, urut sesuai urutan sesi pada paketnya.
  const perPaket = new Map<string, KelompokEvaluasi>();

  for (const catatan of berkas.sesi) {
    if (!catatan.selesaiPada) continue;

    const paket = daftarPaket.find((item) => item.id === catatan.paketId) ?? null;
    const sesi = paket ? cariSesiPsikotes(paket, catatan.sesiId) : null;
    if (!paket || !sesi) continue;

    const kelompok =
      perPaket.get(paket.id) ??
      ({ sumber: "psikotes", judul: paket.nama, bagian: [], profil: [] } as KelompokEvaluasi);
    perPaket.set(paket.id, kelompok);

    // Percabangan berdasarkan `sesi.jenis`, bukan jenis hasilnya: hanya sesi
    // berkunci yang punya daftar `soal` untuk mengambil kategori tiap butir.
    if (sesi.jenis === "epps") {
      const profil = susunProfil(sesi, pilihanEpps(catatan.jawaban));
      kelompok.profil.push({
        judul: sesi.nama,
        waktu: catatan.selesaiPada,
        dijawab: profil.dijawab,
        total: profil.total,
        baris: profil.profil.map((baris) => ({
          dimensi: baris.dimensi,
          skor: baris.skor,
          maks: baris.maks,
        })),
      });
      continue;
    }

    const hasil = koreksiSkor(sesi, jawabanBerkunci(catatan.jawaban));

    // Kategori tidak ikut pada hasil koreksi, jadi diambil dari bank soalnya.
    const kategori = new Map<number, string>(
      sesi.soal.map((soal) => [soal.nomor, soal.kategori]),
    );
    const butir: ButirEvaluasi[] = hasil.butir.map((item) => ({
      nomor: item.nomor,
      kategori: kategori.get(item.nomor) ?? "—",
      jawaban: item.jawaban,
      kunci: item.kunci,
      benar: item.benar,
    }));

    kelompok.bagian.push({
      judul: sesi.nama,
      waktu: catatan.selesaiPada,
      benar: hasil.benar,
      salah: hasil.salah,
      kosong: hasil.kosong,
      total: hasil.total,
      butir,
      perKategori: rekapKategori(butir),
    });
  }

  // Urutan sesi mengikuti definisi paket, bukan urutan pengerjaan peserta.
  for (const [paketId, kelompok] of perPaket) {
    const paket = daftarPaket.find((item) => item.id === paketId);
    if (!paket) continue;
    const urutan = new Map(paket.sesi.map((sesi, i) => [sesi.nama, i]));
    kelompok.bagian.sort(
      (a, b) => (urutan.get(a.judul) ?? 0) - (urutan.get(b.judul) ?? 0),
    );
  }

  return [...perPaket.values()];
}

/* -------------------------------------------------------------------------- */
/*                                   Tes IQ                                   */
/* -------------------------------------------------------------------------- */

async function evaluasiTesIq(studentId: string): Promise<KelompokEvaluasi[]> {
  const [berkas, daftarPaket] = await Promise.all([
    bacaBerkasIq(studentId),
    semuaPaketIq(),
  ]);
  const kelompok: KelompokEvaluasi[] = [];

  for (const catatan of berkas.paket) {
    if (!catatan.selesaiPada) continue;

    const paket = daftarPaket.find((item) => item.id === catatan.paketId);
    if (!paket) continue;

    const hasil = nilaiIq(paket, catatan.jawaban);
    const kategori = new Map(paket.soal.map((soal) => [soal.nomor, soal.kategori]));

    const butir: ButirEvaluasi[] = hasil.butir.map((item) => ({
      nomor: item.nomor,
      kategori: kategori.get(item.nomor) ?? "—",
      jawaban: item.jawaban,
      kunci: item.kunci,
      benar: item.benar,
    }));

    kelompok.push({
      sumber: "tesiq",
      judul: paket.nama,
      bagian: [
        {
          judul:
            catatan.percobaan > 1
              ? `Percobaan ke-${catatan.percobaan}`
              : "Percobaan pertama",
          waktu: catatan.selesaiPada,
          ...ringkas(butir),
          butir,
          perKategori: rekapKategori(butir),
        },
      ],
      profil: [],
    });
  }

  return kelompok;
}

/* -------------------------------------------------------------------------- */

export type EvaluasiSiswa = {
  tryout: KelompokEvaluasi[];
  psikotes: KelompokEvaluasi[];
  tesiq: KelompokEvaluasi[];
};

/**
 * Seluruh pengerjaan seorang peserta yang sudah dikumpulkan.
 *
 * Pengerjaan yang masih berjalan sengaja tidak diikutkan: jawabannya belum
 * final, dan menampilkannya sebagai bahan evaluasi akan menyesatkan.
 */
export async function evaluasiSiswa(studentId: string): Promise<EvaluasiSiswa> {
  const [tryout, psikotes, tesiq] = await Promise.all([
    evaluasiTryOut(studentId),
    evaluasiPsikotes(studentId),
    evaluasiTesIq(studentId),
  ]);

  return { tryout, psikotes, tesiq };
}
