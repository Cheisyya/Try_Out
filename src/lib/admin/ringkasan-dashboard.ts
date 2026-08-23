import { bacaSemua } from "@/lib/bank-soal/repositori";
import type { Subject } from "@/lib/bank-soal/skema";
import { persenKelengkapan } from "@/lib/pendaftaran/kelengkapan";
import { bacaSemuaPendaftaran } from "@/lib/pendaftaran/repositori";
import { daftarSemuaPaket, jendelaPaket, sesiTerurut } from "@/lib/paket-tryout";
import type { StatusJendela } from "@/lib/paket-tryout";
import { semuaPercobaan } from "@/lib/pengerjaan/admin";
import { rekapSeluruhPaket } from "@/lib/pengerjaan/rekap-admin";
import type { JenisPelanggaran } from "@/lib/pengerjaan/tipe";
import { daftarSiswa } from "@/lib/siswa/repositori";

/**
 * Angka-angka yang ditampilkan Dashboard Administrator.
 *
 * Dikumpulkan pada satu berkas supaya halamannya tinggal menyusun tampilan, dan
 * supaya seluruh pembacaan penyimpanan (siswa, pendaftaran, bank soal,
 * konfigurasi paket, pengerjaan) terjadi sekali lalu dipakai bersama.
 *
 * Isinya dibatasi pada angka yang mengubah keputusan panitia: kesiapan tiap
 * paket sebelum dibuka, kelengkapan berkas peserta, capaian nilai, materi yang
 * tertinggal, dan catatan pengawasan. Jumlah berkas materi, jumlah sesi, dan
 * hitungan sejenis tidak disertakan — angka itu sudah terbaca pada menunya
 * sendiri dan tidak menuntun ke tindakan apa pun.
 */

/** Batas nilai yang dianggap tuntas. */
export const KKM = 70;

/** Rentang sebaran nilai; batas bawah inklusif, batas atas eksklusif. */
export const RENTANG = [
  { label: "0–49", bawah: 0, atas: 50, warna: "bg-rose-500" },
  { label: "50–69", bawah: 50, atas: 70, warna: "bg-gold-500" },
  { label: "70–84", bawah: 70, atas: 85, warna: "bg-langit-500" },
  { label: "85–100", bawah: 85, atas: 101, warna: "bg-emerald-500" },
] as const;

export type KesiapanMapel = {
  subject: Subject;
  terisi: number;
  target: number;
};

export type KesiapanPaket = {
  paketId: string;
  nama: string;
  nomor: number;
  aktif: boolean;
  jadwal: string;
  status: StatusJendela;
  /** Soal aktif yang tersedia dibanding target seluruh mata uji paket. */
  terisi: number;
  target: number;
  perMapel: KesiapanMapel[];
  peserta: number;
  rataRata: number;
};

export type BarisSiswaMatriks = {
  studentId: string;
  nama: string;
  /** Sejajar dengan daftar paket; null berarti paket itu belum dikerjakan. */
  nilai: (number | null)[];
  /** Rata-rata seluruh paket yang sudah dikerjakan. */
  rata: number;
  /** Selisih paket terakhir terhadap paket sebelumnya; null bila belum ada dua. */
  selisih: number | null;
};

export type RingkasanDashboard = {
  siswa: {
    total: number;
    aktif: number;
    /** Peserta yang seluruh bagian data dirinya sudah lengkap. */
    lengkap: number;
    rataKelengkapan: number;
    /** Peserta dengan kelengkapan terendah, untuk ditindaklanjuti panitia. */
    tertinggal: { id: string; nama: string; persen: number }[];
  };
  paket: KesiapanPaket[];
  /** Paket yang bank soalnya belum memenuhi target. */
  paketBelumSiap: KesiapanPaket[];
  hasil: {
    pengerjaan: number;
    siswaDinilai: number;
    rataKeseluruhan: number;
    tuntas: number;
    persenTuntas: number;
    sebaran: { label: string; warna: string; jumlah: number; persen: number }[];
    rataMapel: { subject: Subject; rata: number; jumlah: number }[];
    terlemah: { subject: Subject; rata: number } | null;
  };
  /** Label sumbu untuk grafik dan matriks: paket yang sudah punya nilai. */
  labelPaket: string[];
  seriMapel: { nama: string; titik: (number | null)[] }[];
  matriks: BarisSiswaMatriks[];
  integritas: {
    total: number;
    sesiBerjalan: number;
    perJenis: { jenis: JenisPelanggaran; jumlah: number }[];
    siswaTeratas: { nama: string; jumlah: number }[];
  };
};

function rata(angka: number[]) {
  if (angka.length === 0) return 0;
  return Math.round(angka.reduce((total, n) => total + n, 0) / angka.length);
}

export async function ringkasanDashboard(): Promise<RingkasanDashboard> {
  const [siswa, paketList, soal, rekap, percobaan] = await Promise.all([
    daftarSiswa(),
    daftarSemuaPaket(),
    bacaSemua(),
    rekapSeluruhPaket(),
    semuaPercobaan(),
  ]);

  /* ------------------------------- Peserta -------------------------------- */

  // bacaSemuaPendaftaran selalu mengembalikan entri untuk setiap id yang
  // diminta — peserta yang belum pernah mengisi menerima berkas kosong.
  const pendaftaran = await bacaSemuaPendaftaran(siswa.map((item) => item.id));
  const kelengkapan = siswa.flatMap((item) => {
    const data = pendaftaran.get(item.id);
    return data
      ? [{ id: item.id, nama: item.nama, persen: persenKelengkapan(data) }]
      : [];
  });

  /* ---------------------------- Kesiapan paket ---------------------------- */

  // Hanya soal aktif yang benar-benar diambil mesin ujian, jadi soal nonaktif
  // tidak boleh ikut dihitung sebagai kesiapan.
  const terisiPerPaket = new Map<string, Map<Subject, number>>();
  for (const butir of soal) {
    if (!butir.active) continue;
    const perMapel = terisiPerPaket.get(butir.package_id) ?? new Map();
    perMapel.set(butir.subject, (perMapel.get(butir.subject) ?? 0) + 1);
    terisiPerPaket.set(butir.package_id, perMapel);
  }

  const sekarang = Date.now();
  const paket: KesiapanPaket[] = paketList.map((konfig) => {
    const perMapelTerisi = terisiPerPaket.get(konfig.id) ?? new Map();
    const perMapel = sesiTerurut(konfig).flatMap((sesi) =>
      sesi.mataUji.map((mata) => ({
        subject: mata.subject,
        // Soal berlebih tidak membuat paket "lebih siap": yang diujikan hanya
        // sebanyak target, jadi angkanya dipotong pada target.
        terisi: Math.min(perMapelTerisi.get(mata.subject) ?? 0, mata.jumlahSoal),
        target: mata.jumlahSoal,
      })),
    );
    const hasilPaket = rekap.find((item) => item.paketId === konfig.id);

    return {
      paketId: konfig.id,
      nama: konfig.nama,
      nomor: konfig.nomor,
      aktif: konfig.aktif,
      jadwal: konfig.jadwal,
      status: jendelaPaket(konfig, sekarang).status,
      terisi: perMapel.reduce((total, mata) => total + mata.terisi, 0),
      target: perMapel.reduce((total, mata) => total + mata.target, 0),
      perMapel,
      peserta: hasilPaket?.peserta.length ?? 0,
      rataRata: hasilPaket?.rataRata ?? 0,
    };
  });

  /* --------------------------------- Hasil -------------------------------- */

  const paketDinilai = rekap.filter((item) => item.peserta.length > 0);
  const nilaiPaket = paketDinilai.flatMap((item) =>
    item.peserta.map((peserta) => peserta.rataRata),
  );
  const tuntas = nilaiPaket.filter((nilai) => nilai >= KKM).length;

  const perMapel = new Map<Subject, number[]>();
  for (const item of paketDinilai) {
    for (const peserta of item.peserta) {
      for (const mata of peserta.mataUji) {
        perMapel.set(mata.subject, [
          ...(perMapel.get(mata.subject) ?? []),
          mata.nilai,
        ]);
      }
    }
  }
  const rataMapel = [...perMapel.entries()]
    .map(([subject, nilai]) => ({
      subject,
      rata: rata(nilai),
      jumlah: nilai.length,
    }))
    .sort((a, b) => a.rata - b.rata);

  /* ------------------------- Grafik dan matriks --------------------------- */

  const labelPaket = paketDinilai.map((item) => `Paket ${item.nomor}`);

  const daftarMapel = [
    ...new Set(paketDinilai.flatMap((item) => item.daftarMataUji)),
  ];
  const seriMapel = daftarMapel
    .map((subject) => ({
      nama: subject as string,
      titik: paketDinilai.map((item) => {
        const nilai = item.peserta.flatMap((peserta) =>
          peserta.mataUji
            .filter((mata) => mata.subject === subject)
            .map((mata) => mata.nilai),
        );
        return nilai.length === 0 ? null : rata(nilai);
      }),
    }))
    .filter((seri) => seri.titik.some((nilai) => nilai !== null));

  const namaSiswa = new Map<string, string>();
  for (const item of paketDinilai) {
    for (const peserta of item.peserta) {
      namaSiswa.set(peserta.studentId, peserta.studentNama);
    }
  }

  const matriks: BarisSiswaMatriks[] = [...namaSiswa.entries()]
    .map(([studentId, nama]) => {
      const nilai = paketDinilai.map(
        (item) =>
          item.peserta.find((peserta) => peserta.studentId === studentId)
            ?.rataRata ?? null,
      );
      const terisi = nilai.filter((n): n is number => n !== null);
      const dua = terisi.slice(-2);

      return {
        studentId,
        nama,
        nilai,
        rata: rata(terisi),
        selisih: dua.length === 2 ? dua[1] - dua[0] : null,
      };
    })
    .sort((a, b) => b.rata - a.rata || a.nama.localeCompare(b.nama));

  /* ------------------------------ Pengawasan ------------------------------ */

  const jumlahJenis = new Map<JenisPelanggaran, number>();
  const jumlahSiswa = new Map<string, number>();
  let totalPelanggaran = 0;
  let sesiBerjalan = 0;

  for (const item of percobaan) {
    if (item.status === "berlangsung") sesiBerjalan += 1;
    for (const catatan of item.pelanggaran ?? []) {
      totalPelanggaran += 1;
      jumlahJenis.set(catatan.jenis, (jumlahJenis.get(catatan.jenis) ?? 0) + 1);
      jumlahSiswa.set(
        item.student_nama,
        (jumlahSiswa.get(item.student_nama) ?? 0) + 1,
      );
    }
  }

  return {
    siswa: {
      total: siswa.length,
      aktif: siswa.filter((item) => item.status === "Aktif").length,
      lengkap: kelengkapan.filter((item) => item.persen === 100).length,
      rataKelengkapan: rata(kelengkapan.map((item) => item.persen)),
      tertinggal: kelengkapan
        .filter((item) => item.persen < 100)
        .sort((a, b) => a.persen - b.persen || a.nama.localeCompare(b.nama))
        .slice(0, 5),
    },
    paket,
    paketBelumSiap: paket.filter((item) => item.terisi < item.target),
    hasil: {
      pengerjaan: nilaiPaket.length,
      siswaDinilai: namaSiswa.size,
      rataKeseluruhan: rata(nilaiPaket),
      tuntas,
      persenTuntas:
        nilaiPaket.length === 0
          ? 0
          : Math.round((tuntas / nilaiPaket.length) * 100),
      sebaran: RENTANG.map((rentang) => {
        const jumlah = nilaiPaket.filter(
          (nilai) => nilai >= rentang.bawah && nilai < rentang.atas,
        ).length;
        return {
          label: rentang.label,
          warna: rentang.warna,
          jumlah,
          persen:
            nilaiPaket.length === 0
              ? 0
              : Math.round((jumlah / nilaiPaket.length) * 100),
        };
      }),
      rataMapel,
      terlemah: rataMapel[0]
        ? { subject: rataMapel[0].subject, rata: rataMapel[0].rata }
        : null,
    },
    labelPaket,
    seriMapel,
    matriks,
    integritas: {
      total: totalPelanggaran,
      sesiBerjalan,
      perJenis: [...jumlahJenis.entries()]
        .map(([jenis, jumlah]) => ({ jenis, jumlah }))
        .sort((a, b) => b.jumlah - a.jumlah)
        .slice(0, 4),
      siswaTeratas: [...jumlahSiswa.entries()]
        .map(([nama, jumlah]) => ({ nama, jumlah }))
        .sort((a, b) => b.jumlah - a.jumlah)
        .slice(0, 4),
    },
  };
}
