import { semuaPaketIq } from "@/lib/tes-iq/repositori";
import { bacaBerkasIqBanyak, type BerkasIq, type RingkasIq } from "@/lib/tes-iq/catatan";
import type { PaketIq } from "@/lib/tes-iq/tipe";
import { daftarSiswa } from "@/lib/siswa/repositori";

/**
 * Rekap Tes IQ sisi admin: satu baris per peserta, satu kolom per paket.
 *
 * Yang ditampilkan adalah percobaan terakhir beserta berapa kali paket itu
 * sudah dikerjakan — latihan ini memang boleh diulang, dan justru banyaknya
 * pengulangan sering lebih menarik bagi pengajar daripada angka benarnya.
 *
 * Seperti rekap psikotes, angkanya dibaca dari ringkasan yang dibekukan saat
 * paket ditutup, bukan dihitung ulang setiap kali halaman dibuka.
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

export type SelIq =
  | { keadaan: "belum" }
  | { keadaan: "berlangsung"; terjawab: number }
  | {
      keadaan: "selesai";
      waktu: number;
      percobaan: number;
      ringkas: RingkasIq;
    };

export type BarisRekapIq = {
  studentId: string;
  studentNama: string;
  username: string;
  /** Satu sel per paket, urutannya mengikuti `paket` pada rekap ini. */
  sel: SelIq[];
  selesai: number;
  benar: number;
  totalSoal: number;
  /** Jumlah percobaan seluruh paket. */
  totalPercobaan: number;
  terakhir: number;
};

export type RekapIq = {
  paket: PaketIq[];
  baris: BarisRekapIq[];
  pesertaAktif: number;
};

function selDari(berkas: BerkasIq, paketId: string): SelIq {
  const catatan = berkas.paket.find((item) => item.paketId === paketId);
  if (!catatan) return { keadaan: "belum" };

  if (catatan.selesaiPada && catatan.ringkas) {
    return {
      keadaan: "selesai",
      waktu: catatan.selesaiPada,
      percobaan: catatan.percobaan ?? 1,
      ringkas: catatan.ringkas,
    };
  }

  const terjawab = Object.keys(catatan.jawaban ?? {}).length;
  return terjawab > 0
    ? { keadaan: "berlangsung", terjawab }
    : { keadaan: "belum" };
}

/**
 * Rekap seluruh peserta.
 *
 * Peserta yang belum menyentuh Tes IQ tetap ditampilkan; urutannya menempatkan
 * yang paling banyak menyelesaikan paket di atas, lalu yang paling baru.
 */
export async function rekapTesIq(): Promise<RekapIq> {
  const [siswa, daftarPaket] = await Promise.all([daftarSiswa(), semuaPaketIq()]);
  const berkas = await bacaBerkasIqBanyak(siswa.map((item) => item.id));

  const baris: BarisRekapIq[] = siswa.map((item, i) => {
    const sel = daftarPaket.map((paket) => selDari(berkas[i], paket.id));

    let benar = 0;
    let totalSoal = 0;
    let totalPercobaan = 0;
    let terakhir = 0;

    for (const kolom of sel) {
      if (kolom.keadaan !== "selesai") continue;
      benar += kolom.ringkas.benar;
      totalSoal += kolom.ringkas.total;
      totalPercobaan += kolom.percobaan;
      terakhir = Math.max(terakhir, kolom.waktu);
    }

    return {
      studentId: item.id,
      studentNama: item.nama,
      username: item.username,
      sel,
      selesai: sel.filter((kolom) => kolom.keadaan === "selesai").length,
      benar,
      totalSoal,
      totalPercobaan,
      terakhir,
    };
  });

  baris.sort(
    (a, b) =>
      b.selesai - a.selesai ||
      b.terakhir - a.terakhir ||
      a.studentNama.localeCompare(b.studentNama, "id"),
  );

  return {
    paket: daftarPaket,
    baris,
    pesertaAktif: baris.filter((item) => item.selesai > 0).length,
  };
}
