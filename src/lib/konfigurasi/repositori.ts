import {
  bacaOverlay,
  setAktifPaketOverlay,
  terapkanOverlayPaket,
} from "@/lib/latihan/status-paket";
import { bacaJson, cobaSimpan, tulisJson } from "@/lib/penyimpanan";
import { SUBJECTS, type Subject } from "@/lib/bank-soal/skema";
import { buatSandi, periksaSandi } from "@/lib/konfigurasi/sandi";
import {
  isSesiId,
  type KonfigurasiTryOut,
  type PaketKonfig,
  type SesiId,
  type SesiKonfig,
} from "@/lib/konfigurasi/tipe";

/**
 * Penyimpanan konfigurasi paket, sesi, dan password sesi.
 *
 * Dibaca secara sinkron dengan cache berbasis waktu ubah berkas sehingga
 * seluruh pemakai (halaman siswa, engine ujian, panel admin) selalu melihat
 * konfigurasi terbaru segera setelah admin menyimpan perubahan.
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

const KUNCI = "konfigurasi/paket.json";
const KUNCI_STATUS = "konfigurasi/_status.json";

/* --------------------------------- Bawaan --------------------------------- */

const FOKUS: Record<Subject, string> = {
  "Bahasa Indonesia": "Pemahaman bacaan, kaidah kebahasaan, dan penalaran verbal.",
  IPA: "Fisika, biologi, dan kimia dasar tingkat SMP.",
  "Bahasa Inggris": "Reading comprehension, structure, dan vocabulary.",
  Matematika: "Bilangan, aljabar, geometri, statistika, dan penalaran.",
};

const DESKRIPSI_BAWAAN = [
  "Paket pengenalan dengan tingkat kesulitan dasar untuk mengukur posisi awal peserta.",
  "Penguatan konsep dasar dengan porsi soal penalaran yang mulai bertambah.",
  "Tingkat kesulitan menengah dengan komposisi soal setara pelaksanaan seleksi.",
  "Fokus pada kecepatan pengerjaan dan ketelitian pada soal-soal penalaran.",
  "Simulasi lanjutan dengan tingkat kesulitan di atas rata-rata paket sebelumnya.",
  "Simulasi akhir sebagai gambaran kesiapan menjelang seleksi sesungguhnya.",
];

const JADWAL_BAWAAN = [
  "2026-07-05T08:00:00",
  "2026-07-19T08:00:00",
  "2026-08-09T08:00:00",
  "2026-08-23T08:00:00",
  "2026-09-06T08:00:00",
  "2026-09-20T08:00:00",
];

export function sesiBawaan(nomorPaket: number): SesiKonfig[] {
  return [
    {
      id: "sesi-1",
      nama: "Sesi 1",
      urutan: 1,
      mataUji: [
        {
          subject: "Bahasa Indonesia",
          jumlahSoal: 20,
          durasiMenit: 25,
          fokus: FOKUS["Bahasa Indonesia"],
        },
        { subject: "IPA", jumlahSoal: 30, durasiMenit: 55, fokus: FOKUS.IPA },
      ],
      sandi: buatSandi(`TN26-P${nomorPaket}-S1`),
    },
    {
      id: "sesi-2",
      nama: "Sesi 2",
      urutan: 2,
      mataUji: [
        {
          subject: "Bahasa Inggris",
          jumlahSoal: 20,
          durasiMenit: 25,
          fokus: FOKUS["Bahasa Inggris"],
        },
        {
          subject: "Matematika",
          jumlahSoal: 30,
          durasiMenit: 55,
          fokus: FOKUS.Matematika,
        },
      ],
      sandi: buatSandi(`TN26-P${nomorPaket}-S2`),
    },
  ];
}

function konfigurasiBawaan(): KonfigurasiTryOut {
  return {
    paket: Array.from({ length: 6 }, (_, i) => ({
      id: `paket-${i + 1}`,
      nomor: i + 1,
      nama: `Try Out Paket ${i + 1}`,
      deskripsi: DESKRIPSI_BAWAAN[i],
      jadwal: JADWAL_BAWAAN[i],
      aktif: true,
      sesi: sesiBawaan(i + 1),
    })),
  };
}

/* -------------------------------- Pembacaan ------------------------------- */

/** Lihat catatan cache pada repositori siswa — pertimbangannya sama. */
const UMUR_CACHE_MS = 5_000;

let cache: { waktu: number; data: KonfigurasiTryOut } | null = null;

async function bacaKonfigurasi(): Promise<KonfigurasiTryOut> {
  if (cache && Date.now() - cache.waktu < UMUR_CACHE_MS) return cache.data;

  const tersimpan = await bacaJson<KonfigurasiTryOut>(KUNCI);
  const data =
    tersimpan && Array.isArray(tersimpan.paket)
      ? tersimpan
      : konfigurasiBawaan();

  cache = { waktu: Date.now(), data };
  return data;
}

export type HasilKonfig =
  | { ok: true; paket?: PaketKonfig }
  | { ok: false; masalah: string[] };

async function simpan(data: KonfigurasiTryOut): Promise<HasilKonfig> {
  const hasil = await cobaSimpan(
    () => tulisJson(KUNCI, data),
    "Gagal menyimpan konfigurasi.",
  );
  if (!hasil.ok) return { ok: false, masalah: [hasil.pesan] };

  cache = null;
  return { ok: true };
}

/** Seluruh paket, termasuk yang dinonaktifkan (untuk panel admin). */
export async function semuaPaket(): Promise<PaketKonfig[]> {
  const [konfig, overlay] = await Promise.all([
    bacaKonfigurasi(),
    bacaOverlay(KUNCI_STATUS),
  ]);
  return terapkanOverlayPaket(
    [...konfig.paket].sort((a, b) => a.nomor - b.nomor),
    overlay,
  );
}

/** Paket yang aktif saja (untuk peserta). */
export async function paketAktif(): Promise<PaketKonfig[]> {
  return (await semuaPaket()).filter((paket) => paket.aktif !== false);
}

export async function cariPaket(
  paketId: string,
): Promise<PaketKonfig | undefined> {
  return (await semuaPaket()).find((paket) => paket.id === paketId);
}

export async function cariSesi(
  paketId: string,
  sesiId: string,
): Promise<SesiKonfig | undefined> {
  if (!isSesiId(sesiId)) return undefined;
  const paket = await cariPaket(paketId);
  return paket?.sesi.find((sesi) => sesi.id === sesiId);
}

/**
 * Password bawaan sesi untuk keperluan pengembangan lokal.
 *
 * Selalu undefined pada produksi, dan tetap undefined bila admin sudah
 * mengganti password — sehingga tidak ada password sesi yang pernah ikut
 * terkirim ke HTML peserta di lingkungan sungguhan.
 */
export async function sandiDemoSesi(paketId: string, sesiId: SesiId) {
  if (process.env.NODE_ENV === "production") return undefined;

  const paket = await cariPaket(paketId);
  const sesi = paket?.sesi.find((item) => item.id === sesiId);
  if (!paket || !sesi) return undefined;

  const bawaan = `TN26-P${paket.nomor}-S${sesiId === "sesi-1" ? 1 : 2}`;
  return periksaSandi(bawaan, sesi.sandi) ? bawaan : undefined;
}

/* -------------------------------- Perubahan ------------------------------- */

function validasiPaket(masukan: Partial<PaketKonfig>, adaId?: string[]) {
  const masalah: string[] = [];
  if (!masukan.nama?.trim()) masalah.push("Nama paket wajib diisi.");
  if (!masukan.deskripsi?.trim()) masalah.push("Deskripsi paket wajib diisi.");
  if (!masukan.jadwal?.trim()) masalah.push("Jadwal buka wajib diisi.");
  else if (Number.isNaN(Date.parse(masukan.jadwal))) {
    masalah.push("Format jadwal buka tidak dikenali.");
  }

  if (masukan.ditutupPada?.trim()) {
    if (Number.isNaN(Date.parse(masukan.ditutupPada))) {
      masalah.push("Format jadwal tutup tidak dikenali.");
    } else if (
      masukan.jadwal?.trim() &&
      !Number.isNaN(Date.parse(masukan.jadwal)) &&
      Date.parse(masukan.ditutupPada) <= Date.parse(masukan.jadwal)
    ) {
      masalah.push("Jadwal tutup harus setelah jadwal buka.");
    }
  }
  if (masukan.id && adaId?.includes(masukan.id)) {
    masalah.push(`Paket dengan id "${masukan.id}" sudah ada.`);
  }
  return masalah;
}

export async function buatPaket(masukan: {
  nama: string;
  deskripsi: string;
  jadwal: string;
  ditutupPada?: string;
  aktif: boolean;
}): Promise<HasilKonfig> {
  const data = await bacaKonfigurasi();
  const masalah = validasiPaket(masukan);
  if (masalah.length) return { ok: false, masalah };

  const nomor =
    data.paket.reduce((maks, paket) => Math.max(maks, paket.nomor), 0) + 1;
  const paket: PaketKonfig = {
    id: `paket-${nomor}`,
    nomor,
    nama: masukan.nama.trim(),
    deskripsi: masukan.deskripsi.trim(),
    jadwal: masukan.jadwal,
    ditutupPada: masukan.ditutupPada?.trim() || undefined,
    aktif: masukan.aktif,
    sesi: sesiBawaan(nomor),
  };

  const overlay = await setAktifPaketOverlay(KUNCI_STATUS, paket.id, paket.aktif);
  if (!overlay.ok) return overlay;

  const hasil = await simpan({ paket: [...data.paket, paket] });
  return hasil.ok ? { ok: true, paket } : hasil;
}

export async function perbaruiPaket(
  paketId: string,
  perubahan: {
    nama: string;
    deskripsi: string;
    jadwal: string;
    ditutupPada?: string;
    aktif: boolean;
  },
): Promise<HasilKonfig> {
  const data = await bacaKonfigurasi();
  const lama = data.paket.find((paket) => paket.id === paketId);
  if (!lama) return { ok: false, masalah: [`Paket "${paketId}" tidak ditemukan.`] };

  const masalah = validasiPaket(perubahan);
  if (masalah.length) return { ok: false, masalah };

  const overlay = await setAktifPaketOverlay(
    KUNCI_STATUS,
    paketId,
    perubahan.aktif,
  );
  if (!overlay.ok) return overlay;

  const baru: PaketKonfig = {
    ...lama,
    nama: perubahan.nama.trim(),
    deskripsi: perubahan.deskripsi.trim(),
    jadwal: perubahan.jadwal,
    ditutupPada: perubahan.ditutupPada?.trim() || undefined,
    aktif: perubahan.aktif,
  };

  const hasil = await simpan({
    paket: data.paket.map((paket) => (paket.id === paketId ? baru : paket)),
  });
  return hasil.ok ? { ok: true, paket: baru } : hasil;
}

/**
 * Menghapus sebuah paket beserta seluruh sesi dan passwordnya.
 *
 * Riwayat pengerjaan peserta pada paket ini **tidak** ikut dihapus: catatan itu
 * milik peserta dan tetap terbaca pada Hasil Try Out. Yang hilang hanya
 * konfigurasinya, sehingga paket berhenti muncul untuk peserta baru.
 */
export async function hapusPaket(paketId: string): Promise<HasilKonfig> {
  const data = await bacaKonfigurasi();
  if (!data.paket.some((paket) => paket.id === paketId)) {
    return { ok: false, masalah: [`Paket "${paketId}" tidak ditemukan.`] };
  }

  return simpan({ paket: data.paket.filter((paket) => paket.id !== paketId) });
}

export async function setAktifPaket(paketId: string, aktif: boolean) {
  const data = await bacaKonfigurasi();
  const lama = data.paket.find((paket) => paket.id === paketId);
  if (!lama) return { ok: false as const, masalah: [`Paket "${paketId}" tidak ditemukan.`] };

  const overlay = await setAktifPaketOverlay(KUNCI_STATUS, paketId, aktif);
  if (!overlay.ok) return overlay;

  cache = null;

  const hasil = await simpan({
    paket: data.paket.map((paket) =>
      paket.id === paketId ? { ...paket, aktif } : paket,
    ),
  });
  // Overlay sudah tersimpan; sakelar tetap berlaku meski konfigurasi penuh belum
  // pernah ditulis ke database (mis. paket bawaan pada Vercel).
  return hasil.ok ? hasil : { ok: true as const };
}

export type MasukanSesi = {
  nama: string;
  urutan: number;
  mataUji: { subject: Subject; jumlahSoal: number; durasiMenit: number }[];
};

export async function perbaruiSesi(
  paketId: string,
  sesiId: SesiId,
  masukan: MasukanSesi,
): Promise<HasilKonfig> {
  const data = await bacaKonfigurasi();
  const paket = data.paket.find((item) => item.id === paketId);
  const sesi = paket?.sesi.find((item) => item.id === sesiId);
  if (!paket || !sesi) {
    return { ok: false, masalah: ["Paket atau sesi tidak ditemukan."] };
  }

  const masalah: string[] = [];
  if (!masukan.nama.trim()) masalah.push("Nama sesi wajib diisi.");
  if (!Number.isInteger(masukan.urutan) || masukan.urutan < 1) {
    masalah.push("Urutan sesi harus bilangan bulat minimal 1.");
  }
  if (masukan.mataUji.length === 0) {
    masalah.push("Sesi harus memiliki minimal satu mata uji.");
  }

  const subjectTerpakai = new Set<string>();
  for (const mata of masukan.mataUji) {
    if (!SUBJECTS.includes(mata.subject)) {
      masalah.push(`Mata uji "${mata.subject}" tidak dikenal.`);
      continue;
    }
    if (subjectTerpakai.has(mata.subject)) {
      masalah.push(`Mata uji ${mata.subject} tercantum lebih dari sekali.`);
    }
    subjectTerpakai.add(mata.subject);

    if (!Number.isInteger(mata.jumlahSoal) || mata.jumlahSoal < 1 || mata.jumlahSoal > 200) {
      masalah.push(`Jumlah soal ${mata.subject} harus antara 1 dan 200.`);
    }
    if (!Number.isInteger(mata.durasiMenit) || mata.durasiMenit < 1 || mata.durasiMenit > 300) {
      masalah.push(`Durasi ${mata.subject} harus antara 1 dan 300 menit.`);
    }
  }

  // Mata uji yang sama tidak boleh muncul di dua sesi pada paket yang sama.
  const sesiLain = paket.sesi.filter((item) => item.id !== sesiId);
  for (const lain of sesiLain) {
    for (const mata of lain.mataUji) {
      if (subjectTerpakai.has(mata.subject)) {
        masalah.push(
          `Mata uji ${mata.subject} sudah dipakai pada ${lain.nama} di paket ini.`,
        );
      }
    }
    if (lain.urutan === masukan.urutan) {
      masalah.push(`Urutan ${masukan.urutan} sudah dipakai oleh ${lain.nama}.`);
    }
  }

  if (masalah.length) return { ok: false, masalah };

  const sesiBaru: SesiKonfig = {
    ...sesi,
    nama: masukan.nama.trim(),
    urutan: masukan.urutan,
    mataUji: masukan.mataUji.map((mata) => ({
      subject: mata.subject,
      jumlahSoal: mata.jumlahSoal,
      durasiMenit: mata.durasiMenit,
      fokus:
        sesi.mataUji.find((item) => item.subject === mata.subject)?.fokus ??
        FOKUS[mata.subject],
    })),
  };

  return simpan({
    paket: data.paket.map((item) =>
      item.id !== paketId
        ? item
        : {
            ...item,
            sesi: item.sesi.map((s) => (s.id === sesiId ? sesiBaru : s)),
          },
    ),
  });
}

export async function setSandiSesi(
  paketId: string,
  sesiId: SesiId,
  password: string,
): Promise<HasilKonfig> {
  const data = await bacaKonfigurasi();
  const paket = data.paket.find((item) => item.id === paketId);
  const sesi = paket?.sesi.find((item) => item.id === sesiId);
  if (!paket || !sesi) {
    return { ok: false, masalah: ["Paket atau sesi tidak ditemukan."] };
  }

  return simpan({
    paket: data.paket.map((item) =>
      item.id !== paketId
        ? item
        : {
            ...item,
            sesi: item.sesi.map((s) =>
              s.id === sesiId ? { ...s, sandi: buatSandi(password) } : s,
            ),
          },
    ),
  });
}
