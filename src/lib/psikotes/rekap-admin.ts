import { semuaPaketPsikotes } from "@/lib/psikotes/repositori";
import {
  bacaBerkasPsikotesBanyak,
  type BerkasPsikotes,
  type RingkasSesi,
} from "@/lib/psikotes/catatan";
import type { DimensiEpps, PaketPsikotes } from "@/lib/psikotes/tipe";
import { daftarSiswa } from "@/lib/siswa/repositori";

/**
 * Rekap psikotes sisi admin: satu baris per peserta, satu kolom per sesi.
 *
 * Pertanyaan yang benar-benar ditanyakan pengajar hanya dua: siapa yang sudah
 * mengerjakan, dan bagaimana hasilnya. Karena itu rekap ini tidak menghitung
 * ulang koreksi — ia membaca ringkasan yang sudah dibekukan saat sesi ditutup
 * (lihat `RingkasSesi`), sehingga membuka halaman ini tetap ringan meski
 * pesertanya banyak.
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

export type SelRekap =
  | { keadaan: "belum" }
  | { keadaan: "berlangsung"; mulai: number }
  | {
      keadaan: "selesai";
      waktu: number;
      otomatis: boolean;
      ringkas: RingkasSesi;
    };

export type BarisRekapPsikotes = {
  studentId: string;
  studentNama: string;
  username: string;
  /** Satu sel per sesi, urutannya mengikuti `paket.sesi`. */
  sel: SelRekap[];
  /** Banyak sesi yang sudah selesai pada paket ini. */
  selesai: number;
  /** Benar dan total soal dari seluruh sesi berkunci yang sudah selesai. */
  benar: number;
  totalSoal: number;
  /** Dimensi EPPS terkuat, bila sesi EPPS-nya sudah dikerjakan. */
  dimensiTerkuat: DimensiEpps | null;
  /** Penutupan paling akhir pada paket ini; 0 bila belum ada. */
  terakhir: number;
};

export type RekapPaketPsikotes = {
  paket: PaketPsikotes;
  baris: BarisRekapPsikotes[];
  /** Peserta yang sudah menyelesaikan sekurang-kurangnya satu sesi. */
  pesertaAktif: number;
};

function selDari(berkas: BerkasPsikotes, paketId: string, sesiId: string): SelRekap {
  const catatan = berkas.sesi.find(
    (item) => item.paketId === paketId && item.sesiId === sesiId,
  );
  if (!catatan) return { keadaan: "belum" };

  if (catatan.selesaiPada && catatan.ringkas) {
    return {
      keadaan: "selesai",
      waktu: catatan.selesaiPada,
      otomatis: catatan.otomatis ?? false,
      ringkas: catatan.ringkas,
    };
  }
  return { keadaan: "berlangsung", mulai: catatan.mulai };
}

function susunBaris(
  paket: PaketPsikotes,
  berkas: BerkasPsikotes,
  nama: string,
  username: string,
): BarisRekapPsikotes {
  const sel = paket.sesi.map((sesi) => selDari(berkas, paket.id, sesi.id));

  let benar = 0;
  let totalSoal = 0;
  let terakhir = 0;
  let dimensiTerkuat: DimensiEpps | null = null;

  for (const item of sel) {
    if (item.keadaan !== "selesai") continue;
    terakhir = Math.max(terakhir, item.waktu);

    if (item.ringkas.jenis === "skor") {
      benar += item.ringkas.benar;
      totalSoal += item.ringkas.total;
    } else {
      // Profil sudah terurut menurun saat disimpan, tetapi urutan itu tidak
      // dijamin bertahan; dicari ulang di sini supaya tidak bergantung padanya.
      const puncak = item.ringkas.profil.reduce(
        (tertinggi, baris) => (baris.skor > tertinggi.skor ? baris : tertinggi),
        item.ringkas.profil[0],
      );
      dimensiTerkuat = puncak?.dimensi ?? null;
    }
  }

  return {
    studentId: berkas.student_id,
    studentNama: nama,
    username,
    sel,
    selesai: sel.filter((item) => item.keadaan === "selesai").length,
    benar,
    totalSoal,
    dimensiTerkuat,
    terakhir,
  };
}

/**
 * Rekap seluruh paket.
 *
 * Peserta yang belum menyentuh psikotes sama sekali tetap ditampilkan — justru
 * itulah yang biasanya ingin diketahui pengajar. Urutannya menempatkan yang
 * paling banyak menyelesaikan sesi di atas, lalu yang paling baru mengerjakan.
 */
export async function rekapPsikotes(): Promise<RekapPaketPsikotes[]> {
  const [siswa, daftarPaket] = await Promise.all([
    daftarSiswa(),
    semuaPaketPsikotes(),
  ]);
  const berkas = await bacaBerkasPsikotesBanyak(siswa.map((item) => item.id));

  return daftarPaket.map((paket) => {
    const baris = siswa.map((item, i) =>
      susunBaris(paket, berkas[i], item.nama, item.username),
    );

    baris.sort(
      (a, b) =>
        b.selesai - a.selesai ||
        b.terakhir - a.terakhir ||
        a.studentNama.localeCompare(b.studentNama, "id"),
    );

    return {
      paket,
      baris,
      pesertaAktif: baris.filter((item) => item.selesai > 0).length,
    };
  });
}
