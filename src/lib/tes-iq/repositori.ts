import {
  bacaOverlay,
  setAktifPaketOverlay,
  terapkanOverlayPaket,
} from "@/lib/latihan/status-paket";
import {
  bacaBanyakJson,
  bacaJson,
  bacaJsonTersimpan,
  cobaSimpan,
  hapusKunci,
  pastikanJson,
  tulisJson,
} from "@/lib/penyimpanan";
import { DURASI_IQ_BAWAAN, PAKET_IQ_BAWAAN } from "@/lib/tes-iq/bank";
import {
  HURUF_IQ,
  isHurufIq,
  KATEGORI_IQ,
  type HurufIq,
  type KategoriIq,
  type PaketIq,
  type SoalIq,
} from "@/lib/tes-iq/tipe";

/**
 * Repositori Tes IQ latihan.
 *
 * Kembarannya untuk psikotes ada di `@/lib/psikotes/repositori`, dan
 * pertimbangannya sama persis: bank bawaan yang terbundel di dalam kode
 * dipakai sebagai benih, dan perubahan pertama atas sebuah paket menyalinnya ke
 * penyimpanan sebelum disunting. Pemasangan baru karena itu langsung berisi
 * lima paket lengkap, sementara pemasangan yang sudah disunting admin tidak
 * pernah tertimpa bank bawaan.
 *
 * Modul ini hanya boleh diimpor dari Server Component atau Server Action.
 */

const AWALAN = "bank-tes-iq/";
const KUNCI_INDEKS = `${AWALAN}_indeks.json`;
const KUNCI_STATUS = `${AWALAN}_status.json`;

function kunciPaket(paketId: string) {
  return `${AWALAN}${paketId.replace(/[^a-zA-Z0-9._-]/g, "_")}.json`;
}

export type HasilBankIq<T> =
  | { ok: true; data: T }
  | { ok: false; masalah: string[] };

/* -------------------------------------------------------------------------- */
/*                                  Pembacaan                                 */
/* -------------------------------------------------------------------------- */

async function daftarId(): Promise<string[]> {
  const bawaan = PAKET_IQ_BAWAAN.map((paket) => paket.id);
  await pastikanJson(KUNCI_INDEKS, bawaan);

  const tersimpan = await bacaJsonTersimpan<string[]>(KUNCI_INDEKS);
  if (Array.isArray(tersimpan) && tersimpan.every((id) => typeof id === "string")) {
    return tersimpan;
  }
  return bawaan;
}

function bawaan(paketId: string): PaketIq | null {
  return PAKET_IQ_BAWAAN.find((paket) => paket.id === paketId) ?? null;
}

export async function semuaPaketIq(): Promise<PaketIq[]> {
  const daftar = await daftarId();
  const [peta, overlay] = await Promise.all([
    bacaBanyakJson<PaketIq>(daftar.map(kunciPaket)),
    bacaOverlay(KUNCI_STATUS),
  ]);

  const hasil: PaketIq[] = [];
  for (const id of daftar) {
    const paket = sahkanPaket(peta.get(kunciPaket(id))) ?? bawaan(id);
    if (paket) hasil.push(paket);
  }
  return terapkanOverlayPaket(hasil, overlay);
}

/** Paket yang tampil di portal peserta. */
export async function paketIqAktif(): Promise<PaketIq[]> {
  return (await semuaPaketIq()).filter((paket) => paket.aktif !== false);
}

export async function cariPaketIq(paketId: string): Promise<PaketIq | null> {
  const [paket, overlay] = await Promise.all([
    (async () => {
      const asli =
        sahkanPaket(await bacaJson<PaketIq>(kunciPaket(paketId))) ?? bawaan(paketId);
      if (!asli) return null;
      return (await daftarId()).includes(paketId) ? asli : null;
    })(),
    bacaOverlay(KUNCI_STATUS),
  ]);
  if (!paket) return null;
  return terapkanOverlayPaket([paket], overlay)[0];
}

/* -------------------------------------------------------------------------- */
/*                                  Validasi                                  */
/* -------------------------------------------------------------------------- */

function sahkanPaket(nilai: unknown): PaketIq | null {
  if (!nilai || typeof nilai !== "object") return null;
  const paket = nilai as Partial<PaketIq>;
  if (typeof paket.id !== "string" || !paket.id.trim()) return null;
  if (typeof paket.nama !== "string") return null;
  if (!Array.isArray(paket.soal)) return null;

  return {
    id: paket.id,
    nomor: Number(paket.nomor) || 0,
    nama: paket.nama,
    tingkat: typeof paket.tingkat === "string" ? paket.tingkat : "Latihan",
    deskripsi: paket.deskripsi ?? "",
    durasiMenit: Number(paket.durasiMenit) || DURASI_IQ_BAWAAN,
    aktif: paket.aktif,
    soal: paket.soal.filter(isSoalIq),
  };
}

function isSoalIq(nilai: unknown): nilai is SoalIq {
  const soal = nilai as Partial<SoalIq>;
  if (!soal || typeof soal !== "object") return false;
  if (!Number.isInteger(soal.nomor)) return false;
  if (typeof soal.pertanyaan !== "string") return false;
  if (!KATEGORI_IQ.includes(soal.kategori as KategoriIq)) return false;
  if (!soal.opsi || HURUF_IQ.some((huruf) => typeof soal.opsi![huruf] !== "string")) {
    return false;
  }
  return isHurufIq(soal.kunci);
}

/* -------------------------------------------------------------------------- */
/*                                  Penulisan                                 */
/* -------------------------------------------------------------------------- */

async function tulisPaket(paket: PaketIq): Promise<HasilBankIq<PaketIq>> {
  const hasil = await cobaSimpan(
    () => tulisJson(kunciPaket(paket.id), paket),
    "Gagal menyimpan bank soal Tes IQ.",
  );
  return hasil.ok ? { ok: true, data: paket } : { ok: false, masalah: [hasil.pesan] };
}

async function tulisIndeks(daftar: string[]): Promise<HasilBankIq<null>> {
  const hasil = await cobaSimpan(
    () => tulisJson(KUNCI_INDEKS, daftar),
    "Gagal menyimpan urutan paket Tes IQ.",
  );
  return hasil.ok ? { ok: true, data: null } : { ok: false, masalah: [hasil.pesan] };
}

async function ubahPaket(
  paketId: string,
  sunting: (paket: PaketIq) => string[] | void,
): Promise<HasilBankIq<PaketIq>> {
  const paket = await cariPaketIq(paketId);
  if (!paket) return { ok: false, masalah: [`Paket "${paketId}" tidak dikenal.`] };

  const salinan: PaketIq = JSON.parse(JSON.stringify(paket));
  const masalah = sunting(salinan) ?? [];
  if (masalah.length > 0) return { ok: false, masalah };

  return tulisPaket(salinan);
}

/* ------------------------------- Paket -------------------------------- */

export type MasukanPaketIq = {
  nama: string;
  tingkat: string;
  deskripsi: string;
  durasiMenit: number;
  aktif: boolean;
};

export async function perbaruiPaketIq(
  paketId: string,
  masukan: MasukanPaketIq,
): Promise<HasilBankIq<PaketIq>> {
  const overlay = await setAktifPaketOverlay(KUNCI_STATUS, paketId, masukan.aktif);
  if (!overlay.ok) return overlay;

  return ubahPaket(paketId, (paket) => {
    const nama = masukan.nama.trim();
    if (!nama) return ["Nama paket wajib diisi."];
    if (!Number.isInteger(masukan.durasiMenit) || masukan.durasiMenit < 1) {
      return ["Durasi harus bilangan bulat minimal 1 menit."];
    }
    paket.nama = nama;
    paket.tingkat = masukan.tingkat.trim() || "Latihan";
    paket.deskripsi = masukan.deskripsi.trim();
    paket.durasiMenit = masukan.durasiMenit;
    paket.aktif = masukan.aktif;
  });
}

export async function setAktifPaketIq(
  paketId: string,
  aktif: boolean,
): Promise<HasilBankIq<null>> {
  // Validasi memakai cariPaketIq agar paket bawaan (yang terbundel di kode
  // dan belum pernah ditulis ke Postgres) tetap dapat diaktifkan/dinonaktifkan.
  const paket = await cariPaketIq(paketId);
  if (!paket) {
    return { ok: false, masalah: [`Paket "${paketId}" tidak dikenal.`] };
  }

  const overlay = await setAktifPaketOverlay(KUNCI_STATUS, paketId, aktif);
  if (!overlay.ok) return overlay;

  return { ok: true, data: null };
}

export async function tambahPaketIq(nama: string): Promise<HasilBankIq<PaketIq>> {
  const bersih = nama.trim();
  if (!bersih) return { ok: false, masalah: ["Nama paket wajib diisi."] };

  const daftar = await daftarId();
  let nomor = daftar.length + 1;
  let id = `iq-${nomor}`;
  while (daftar.includes(id)) {
    nomor += 1;
    id = `iq-${nomor}`;
  }

  const paket: PaketIq = {
    id,
    nomor,
    nama: bersih,
    tingkat: "Latihan",
    deskripsi: "",
    durasiMenit: DURASI_IQ_BAWAAN,
    aktif: true,
    soal: [],
  };

  const tulis = await tulisPaket(paket);
  if (!tulis.ok) return tulis;

  const indeks = await tulisIndeks([...daftar, id]);
  if (!indeks.ok) return { ok: false, masalah: indeks.masalah };

  await setAktifPaketOverlay(KUNCI_STATUS, id, true);
  return { ok: true, data: paket };
}

export async function hapusPaketIq(paketId: string): Promise<HasilBankIq<null>> {
  const daftar = await daftarId();
  if (!daftar.includes(paketId)) {
    return { ok: false, masalah: [`Paket "${paketId}" tidak dikenal.`] };
  }

  const indeks = await tulisIndeks(daftar.filter((id) => id !== paketId));
  if (!indeks.ok) return indeks;

  await cobaSimpan(
    () => hapusKunci(kunciPaket(paketId)),
    "Gagal menghapus dokumen bank soal Tes IQ.",
  );
  return { ok: true, data: null };
}

/* -------------------------------- Butir ---------------------------------- */

export type MasukanSoalIq = {
  kategori: KategoriIq;
  pertanyaan: string;
  pola: string[];
  opsi: Record<HurufIq, string>;
  kunci: HurufIq;
  pembahasan: string;
  aktif: boolean;
};

function periksaSoal(masukan: MasukanSoalIq): string[] {
  const masalah: string[] = [];
  if (!KATEGORI_IQ.includes(masukan.kategori)) {
    masalah.push(`Kategori harus salah satu dari: ${KATEGORI_IQ.join(", ")}.`);
  }
  if (!masukan.pertanyaan.trim()) masalah.push("Pertanyaan wajib diisi.");
  for (const huruf of HURUF_IQ) {
    if (!masukan.opsi[huruf]?.trim()) masalah.push(`Pilihan ${huruf} wajib diisi.`);
  }
  if (!isHurufIq(masukan.kunci)) masalah.push("Kunci harus A, B, C, atau D.");
  if (!masukan.pembahasan.trim()) masalah.push("Pembahasan wajib diisi.");
  return masalah;
}

function keSoal(masukan: MasukanSoalIq, nomor: number): SoalIq {
  const pola = masukan.pola.map((baris) => baris.trimEnd()).filter(Boolean);
  return {
    nomor,
    kategori: masukan.kategori,
    pertanyaan: masukan.pertanyaan.trim(),
    ...(pola.length > 0 ? { pola } : {}),
    opsi: {
      A: masukan.opsi.A.trim(),
      B: masukan.opsi.B.trim(),
      C: masukan.opsi.C.trim(),
      D: masukan.opsi.D.trim(),
    },
    kunci: masukan.kunci,
    pembahasan: masukan.pembahasan.trim(),
    aktif: masukan.aktif,
  };
}

export async function tambahSoalIq(
  paketId: string,
  masukan: MasukanSoalIq,
): Promise<HasilBankIq<PaketIq>> {
  return ubahPaket(paketId, (paket) => {
    const masalah = periksaSoal(masukan);
    if (masalah.length > 0) return masalah;

    const nomor = paket.soal.reduce((maks, item) => Math.max(maks, item.nomor), 0) + 1;
    paket.soal.push(keSoal(masukan, nomor));
  });
}

/** Impor massal; berkas paket hanya ditulis satu kali. */
export async function tambahBanyakSoalIq(
  paketId: string,
  daftar: (MasukanSoalIq & { baris: number })[],
): Promise<{ tersimpan: number; gagal: { baris: number; masalah: string[] }[] }> {
  const gagal: { baris: number; masalah: string[] }[] = [];
  let tersimpan = 0;

  const hasil = await ubahPaket(paketId, (paket) => {
    let nomor = paket.soal.reduce((maks, item) => Math.max(maks, item.nomor), 0);

    for (const butir of daftar) {
      const masalah = periksaSoal(butir);
      if (masalah.length > 0) {
        gagal.push({ baris: butir.baris, masalah });
        continue;
      }
      nomor += 1;
      paket.soal.push(keSoal(butir, nomor));
      tersimpan += 1;
    }

    if (tersimpan === 0) return ["Tidak ada butir yang layak disimpan."];
  });

  if (!hasil.ok) {
    return {
      tersimpan: 0,
      gagal: [
        ...gagal,
        ...daftar
          .filter((butir) => !gagal.some((item) => item.baris === butir.baris))
          .map((butir) => ({ baris: butir.baris, masalah: hasil.masalah })),
      ],
    };
  }

  return { tersimpan, gagal };
}

export async function perbaruiSoalIq(
  paketId: string,
  nomor: number,
  masukan: MasukanSoalIq,
): Promise<HasilBankIq<PaketIq>> {
  return ubahPaket(paketId, (paket) => {
    const indeks = paket.soal.findIndex((item) => item.nomor === nomor);
    if (indeks < 0) return [`Soal nomor ${nomor} tidak ditemukan.`];

    const masalah = periksaSoal(masukan);
    if (masalah.length > 0) return masalah;

    paket.soal[indeks] = keSoal(masukan, nomor);
  });
}

export async function hapusSoalIq(
  paketId: string,
  nomor: number,
): Promise<HasilBankIq<PaketIq>> {
  return ubahPaket(paketId, (paket) => {
    if (!paket.soal.some((item) => item.nomor === nomor)) {
      return [`Soal nomor ${nomor} tidak ditemukan.`];
    }
    paket.soal = paket.soal.filter((item) => item.nomor !== nomor);
  });
}

/** Lihat catatan pada `setAktifButirPsikotes` — pertimbangannya sama. */
export async function setAktifSoalIq(
  paketId: string,
  nomor: number,
  aktif: boolean,
): Promise<HasilBankIq<PaketIq>> {
  return ubahPaket(paketId, (paket) => {
    const soal = paket.soal.find((item) => item.nomor === nomor);
    if (!soal) return [`Soal nomor ${nomor} tidak ditemukan.`];
    soal.aktif = aktif;
  });
}
