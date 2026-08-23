import {
  bacaOverlay,
  setAktifPaketOverlay,
  setAktifSesiOverlay,
  terapkanOverlayPaket,
  terapkanOverlaySesi,
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
import { PAKET_PSIKOTES_BAWAAN } from "@/lib/psikotes/bank";
import {
  HURUF_PSIKOTES,
  isHurufPsikotes,
  type HurufPsikotes,
  type PaketPsikotes,
  type PasanganEpps,
  type SesiEpps,
  type SesiPsikotes,
  type SesiSkor,
  type SoalSkor,
} from "@/lib/psikotes/tipe";

/**
 * Repositori Try Out Psikotes.
 *
 * Bank soal psikotes semula terbundel penuh di dalam kode. Sejak admin dapat
 * menyunting soal, mengimpornya dari PDF, dan menonaktifkan butir, isinya harus
 * dapat berubah tanpa penerbitan ulang aplikasi — maka lapisan ini.
 *
 * Bentuknya sengaja **benih dan salinan**, bukan basis data kosong: selama
 * admin belum menyentuh sebuah paket, yang dibaca adalah bank bawaan yang
 * terbundel di dalam kode. Perubahan pertama menyalin paket itu ke penyimpanan
 * apa adanya, lalu perubahannya diterapkan di atas salinan tersebut. Dengan
 * begitu pemasangan baru langsung berisi sepuluh paket lengkap, sementara
 * pemasangan yang sudah disunting tidak pernah tertimpa oleh bank bawaan.
 *
 * Modul ini hanya boleh diimpor dari Server Component atau Server Action.
 */

const AWALAN = "bank-psikotes/";
const KUNCI_INDEKS = `${AWALAN}_indeks.json`;
const KUNCI_STATUS = `${AWALAN}_status.json`;

function kunciPaket(paketId: string) {
  return `${AWALAN}${paketId.replace(/[^a-zA-Z0-9._-]/g, "_")}.json`;
}

export type HasilBank<T> = { ok: true; data: T } | { ok: false; masalah: string[] };

/* -------------------------------------------------------------------------- */
/*                                  Pembacaan                                 */
/* -------------------------------------------------------------------------- */

/**
 * Urutan paket yang berlaku.
 *
 * Indeks hanya ditulis ketika admin menambah atau menghapus paket. Selama itu
 * belum terjadi, urutannya mengikuti bank bawaan.
 */
async function daftarId(): Promise<string[]> {
  const bawaan = PAKET_PSIKOTES_BAWAAN.map((paket) => paket.id);
  await pastikanJson(KUNCI_INDEKS, bawaan);

  const tersimpan = await bacaJsonTersimpan<string[]>(KUNCI_INDEKS);
  if (Array.isArray(tersimpan) && tersimpan.every((id) => typeof id === "string")) {
    return tersimpan;
  }
  return bawaan;
}

function bawaan(paketId: string): PaketPsikotes | null {
  return PAKET_PSIKOTES_BAWAAN.find((paket) => paket.id === paketId) ?? null;
}

/**
 * Membaca seluruh paket, menggabungkan yang tersimpan dengan bank bawaan.
 *
 * Dokumen tersimpan yang bentuknya tidak dikenal dilewati dan digantikan bank
 * bawaannya — satu dokumen rusak tidak boleh menjatuhkan seluruh halaman.
 */
export async function semuaPaketPsikotes(): Promise<PaketPsikotes[]> {
  const daftar = await daftarId();
  const [peta, overlay] = await Promise.all([
    bacaBanyakJson<PaketPsikotes>(daftar.map(kunciPaket)),
    bacaOverlay(KUNCI_STATUS),
  ]);

  const hasil: PaketPsikotes[] = [];
  for (const id of daftar) {
    const tersimpan = peta.get(kunciPaket(id));
    const paket = sahkanPaket(tersimpan) ?? bawaan(id);
    if (paket) hasil.push(terapkanOverlaySesi(paket, overlay));
  }
  return terapkanOverlayPaket(hasil, overlay);
}

/** Paket yang tampil di portal peserta: yang aktif dan masih punya sesi. */
export async function paketPsikotesAktif(): Promise<PaketPsikotes[]> {
  return (await semuaPaketPsikotes()).filter((paket) => paket.aktif !== false);
}

export async function cariPaketPsikotes(
  paketId: string,
): Promise<PaketPsikotes | null> {
  const [asli, overlay] = await Promise.all([
    (async () => {
      const tersimpan = await bacaJson<PaketPsikotes>(kunciPaket(paketId));
      const paket = sahkanPaket(tersimpan) ?? bawaan(paketId);
      if (!paket) return null;
      return (await daftarId()).includes(paketId) ? paket : null;
    })(),
    bacaOverlay(KUNCI_STATUS),
  ]);
  if (!asli) return null;
  return terapkanOverlayPaket(
    [terapkanOverlaySesi(asli, overlay)],
    overlay,
  )[0];
}

export function cariSesiPsikotes(
  paket: PaketPsikotes,
  sesiId: string,
): SesiPsikotes | null {
  return paket.sesi.find((sesi) => sesi.id === sesiId) ?? null;
}

/* -------------------------------------------------------------------------- */
/*                                  Validasi                                  */
/* -------------------------------------------------------------------------- */

/**
 * Memeriksa bentuk dokumen yang dibaca dari penyimpanan.
 *
 * Bukan sekadar kehati-hatian: berkas JSON dapat disunting tangan, dan sebuah
 * sesi tanpa `jenis` akan menjatuhkan seluruh halaman peserta bila diteruskan
 * apa adanya.
 */
function sahkanPaket(nilai: unknown): PaketPsikotes | null {
  if (!nilai || typeof nilai !== "object") return null;
  const paket = nilai as Partial<PaketPsikotes>;
  if (typeof paket.id !== "string" || !paket.id.trim()) return null;
  if (typeof paket.nama !== "string") return null;
  if (!Array.isArray(paket.sesi)) return null;

  const sesi: SesiPsikotes[] = [];
  for (const butir of paket.sesi) {
    // Bukan `Partial<SesiSkor & SesiEpps>`: irisan kedua tipe itu memaksa
    // `jenis` bernilai "skor" sekaligus "epps" sehingga seluruh objek menjadi
    // `never`. Bentuk longgar di bawah ini yang benar untuk data mentah.
    const item = butir as Partial<Omit<SesiSkor, "jenis">> &
      Partial<Omit<SesiEpps, "jenis">> & { jenis?: string };
    if (typeof item?.id !== "string" || typeof item?.nama !== "string") continue;
    if (item.jenis === "skor" && Array.isArray(item.soal)) {
      sesi.push({
        id: item.id,
        jenis: "skor",
        nama: item.nama,
        ringkas: item.ringkas ?? "",
        petunjuk: item.petunjuk ?? "",
        durasiMenit: Number(item.durasiMenit) || 10,
        aktif: item.aktif,
        soal: item.soal.filter(isSoalSkor),
      });
    } else if (item.jenis === "epps" && Array.isArray(item.pasangan)) {
      sesi.push({
        id: item.id,
        jenis: "epps",
        nama: item.nama,
        ringkas: item.ringkas ?? "",
        petunjuk: item.petunjuk ?? "",
        durasiMenit: Number(item.durasiMenit) || 10,
        aktif: item.aktif,
        pasangan: item.pasangan.filter(isPasanganEpps),
      });
    }
  }

  return {
    id: paket.id,
    nomor: Number(paket.nomor) || 0,
    nama: paket.nama,
    deskripsi: paket.deskripsi ?? "",
    aktif: paket.aktif,
    sesi,
  };
}

function isSoalSkor(nilai: unknown): nilai is SoalSkor {
  const soal = nilai as Partial<SoalSkor>;
  if (!soal || typeof soal !== "object") return false;
  if (!Number.isInteger(soal.nomor)) return false;
  if (typeof soal.pertanyaan !== "string") return false;
  if (!soal.opsi || HURUF_PSIKOTES.some((huruf) => typeof soal.opsi![huruf] !== "string")) {
    return false;
  }
  return isHurufPsikotes(soal.kunci);
}

function isPasanganEpps(nilai: unknown): nilai is PasanganEpps {
  const pasangan = nilai as Partial<PasanganEpps>;
  if (!pasangan || typeof pasangan !== "object") return false;
  if (!Number.isInteger(pasangan.nomor)) return false;
  return (
    typeof pasangan.a?.teks === "string" && typeof pasangan.b?.teks === "string"
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Penulisan                                 */
/* -------------------------------------------------------------------------- */

async function tulisPaket(paket: PaketPsikotes): Promise<HasilBank<PaketPsikotes>> {
  const hasil = await cobaSimpan(
    () => tulisJson(kunciPaket(paket.id), paket),
    "Gagal menyimpan bank soal psikotes.",
  );
  return hasil.ok ? { ok: true, data: paket } : { ok: false, masalah: [hasil.pesan] };
}

async function tulisIndeks(daftar: string[]): Promise<HasilBank<null>> {
  const hasil = await cobaSimpan(
    () => tulisJson(KUNCI_INDEKS, daftar),
    "Gagal menyimpan urutan paket psikotes.",
  );
  return hasil.ok ? { ok: true, data: null } : { ok: false, masalah: [hasil.pesan] };
}

/**
 * Mengubah satu paket lewat fungsi penyunting.
 *
 * Paket dibaca dengan bank bawaan sebagai cadangan, sehingga perubahan pertama
 * atas paket bawaan otomatis menyalinnya ke penyimpanan.
 */
async function ubahPaket(
  paketId: string,
  sunting: (paket: PaketPsikotes) => string[] | void,
): Promise<HasilBank<PaketPsikotes>> {
  const paket = await cariPaketPsikotes(paketId);
  if (!paket) return { ok: false, masalah: [`Paket "${paketId}" tidak dikenal.`] };

  // Disalin dalam agar kegagalan validasi tidak menyisakan perubahan separuh
  // jalan pada objek bank bawaan yang dipakai bersama seluruh permintaan.
  const salinan: PaketPsikotes = JSON.parse(JSON.stringify(paket));
  const masalah = sunting(salinan) ?? [];
  if (masalah.length > 0) return { ok: false, masalah };

  return tulisPaket(salinan);
}

/* ------------------------------- Paket & sesi ------------------------------ */

export type MasukanPaketPsikotes = {
  nama: string;
  deskripsi: string;
  aktif: boolean;
};

export async function perbaruiPaketPsikotes(
  paketId: string,
  masukan: MasukanPaketPsikotes,
): Promise<HasilBank<PaketPsikotes>> {
  const overlay = await setAktifPaketOverlay(KUNCI_STATUS, paketId, masukan.aktif);
  if (!overlay.ok) return overlay;

  return ubahPaket(paketId, (paket) => {
    const nama = masukan.nama.trim();
    if (!nama) return ["Nama paket wajib diisi."];
    paket.nama = nama;
    paket.deskripsi = masukan.deskripsi.trim();
    paket.aktif = masukan.aktif;
  });
}

export async function setAktifPaketPsikotes(
  paketId: string,
  aktif: boolean,
): Promise<HasilBank<null>> {
  // Validasi memakai cariPaketPsikotes agar paket bawaan (yang terbundel di
  // kode dan belum pernah ditulis ke Postgres) tetap dapat diaktifkan/dinonaktifkan.
  const paket = await cariPaketPsikotes(paketId);
  if (!paket) {
    return { ok: false, masalah: [`Paket "${paketId}" tidak dikenal.`] };
  }

  const overlay = await setAktifPaketOverlay(KUNCI_STATUS, paketId, aktif);
  if (!overlay.ok) return overlay;

  return { ok: true, data: null };
}

export type MasukanSesiPsikotes = {
  nama: string;
  ringkas: string;
  petunjuk: string;
  durasiMenit: number;
  aktif: boolean;
};

export async function perbaruiSesiPsikotes(
  paketId: string,
  sesiId: string,
  masukan: MasukanSesiPsikotes,
): Promise<HasilBank<PaketPsikotes>> {
  const overlay = await setAktifSesiOverlay(
    KUNCI_STATUS,
    paketId,
    sesiId,
    masukan.aktif,
  );
  if (!overlay.ok) return overlay;

  return ubahPaket(paketId, (paket) => {
    const sesi = paket.sesi.find((item) => item.id === sesiId);
    if (!sesi) return [`Sesi "${sesiId}" tidak ada pada paket ini.`];

    const nama = masukan.nama.trim();
    if (!nama) return ["Nama sesi wajib diisi."];
    if (!Number.isInteger(masukan.durasiMenit) || masukan.durasiMenit < 1) {
      return ["Durasi sesi harus bilangan bulat minimal 1 menit."];
    }

    sesi.nama = nama;
    sesi.ringkas = masukan.ringkas.trim();
    sesi.petunjuk = masukan.petunjuk.trim();
    sesi.durasiMenit = masukan.durasiMenit;
    sesi.aktif = masukan.aktif;
  });
}

export async function setAktifSesiPsikotes(
  paketId: string,
  sesiId: string,
  aktif: boolean,
): Promise<HasilBank<null>> {
  if (!(await daftarId()).includes(paketId)) {
    return { ok: false, masalah: [`Paket "${paketId}" tidak dikenal.`] };
  }

  const overlay = await setAktifSesiOverlay(KUNCI_STATUS, paketId, sesiId, aktif);
  if (!overlay.ok) return overlay;

  const tersimpan = sahkanPaket(await bacaJson<PaketPsikotes>(kunciPaket(paketId)));
  if (tersimpan) {
    await ubahPaket(paketId, (paket) => {
      const sesi = paket.sesi.find((item) => item.id === sesiId);
      if (!sesi) return [`Sesi "${sesiId}" tidak ada pada paket ini.`];
      sesi.aktif = aktif;
    });
  }
  return { ok: true, data: null };
}

/**
 * Menambah paket kosong.
 *
 * Sesinya mengikuti susunan baku psikotes — empat sesi dengan durasi yang sudah
 * ditetapkan — supaya admin tinggal mengisi soalnya. Menyusun sesi dari nol
 * hanya akan membuka pintu bagi paket yang jenis sesinya tidak lengkap.
 */
export async function tambahPaketPsikotes(
  nama: string,
): Promise<HasilBank<PaketPsikotes>> {
  const bersih = nama.trim();
  if (!bersih) return { ok: false, masalah: ["Nama paket wajib diisi."] };

  const daftar = await daftarId();
  let nomor = daftar.length + 1;
  let id = `psi-${nomor}`;
  while (daftar.includes(id)) {
    nomor += 1;
    id = `psi-${nomor}`;
  }

  const contoh = PAKET_PSIKOTES_BAWAAN[0];
  const paket: PaketPsikotes = {
    id,
    nomor,
    nama: bersih,
    deskripsi: "",
    aktif: true,
    sesi: contoh.sesi.map((sesi) =>
      sesi.jenis === "epps"
        ? {
            id: sesi.id,
            jenis: "epps",
            nama: sesi.nama,
            ringkas: sesi.ringkas,
            petunjuk: sesi.petunjuk,
            durasiMenit: sesi.durasiMenit,
            pasangan: [],
          }
        : {
            id: sesi.id,
            jenis: "skor",
            nama: sesi.nama,
            ringkas: sesi.ringkas,
            petunjuk: sesi.petunjuk,
            durasiMenit: sesi.durasiMenit,
            soal: [],
          },
    ),
  };

  const tulis = await tulisPaket(paket);
  if (!tulis.ok) return tulis;

  const indeks = await tulisIndeks([...daftar, id]);
  if (!indeks.ok) return { ok: false, masalah: indeks.masalah };

  await setAktifPaketOverlay(KUNCI_STATUS, id, true);
  return { ok: true, data: paket };
}

export async function hapusPaketPsikotes(
  paketId: string,
): Promise<HasilBank<null>> {
  const daftar = await daftarId();
  if (!daftar.includes(paketId)) {
    return { ok: false, masalah: [`Paket "${paketId}" tidak dikenal.`] };
  }

  const indeks = await tulisIndeks(daftar.filter((id) => id !== paketId));
  if (!indeks.ok) return indeks;

  // Dokumennya ikut dihapus supaya paket bernama sama yang dibuat kelak tidak
  // mewarisi isi paket lama.
  await cobaSimpan(
    () => hapusKunci(kunciPaket(paketId)),
    "Gagal menghapus dokumen bank soal psikotes.",
  );
  return { ok: true, data: null };
}

/* ---------------------------------- Butir --------------------------------- */

export type MasukanSoalSkor = {
  kategori: string;
  pertanyaan: string;
  opsi: Record<HurufPsikotes, string>;
  kunci: HurufPsikotes;
  pembahasan: string;
  aktif: boolean;
};

function periksaSoalSkor(masukan: MasukanSoalSkor): string[] {
  const masalah: string[] = [];
  if (!masukan.kategori.trim()) masalah.push("Kategori wajib diisi.");
  if (!masukan.pertanyaan.trim()) masalah.push("Pertanyaan wajib diisi.");
  for (const huruf of HURUF_PSIKOTES) {
    if (!masukan.opsi[huruf]?.trim()) masalah.push(`Pilihan ${huruf} wajib diisi.`);
  }
  if (!isHurufPsikotes(masukan.kunci)) masalah.push("Kunci harus A, B, C, atau D.");
  // Pembahasan wajib karena peserta membacanya setelah sesi ditutup; butir
  // tanpa pembahasan berarti koreksi tanpa penjelasan.
  if (!masukan.pembahasan.trim()) masalah.push("Pembahasan wajib diisi.");
  return masalah;
}

function sesiSkor(paket: PaketPsikotes, sesiId: string): SesiSkor | null {
  const sesi = paket.sesi.find((item) => item.id === sesiId);
  return sesi && sesi.jenis === "skor" ? sesi : null;
}

export async function tambahSoalPsikotes(
  paketId: string,
  sesiId: string,
  masukan: MasukanSoalSkor,
): Promise<HasilBank<PaketPsikotes>> {
  return ubahPaket(paketId, (paket) => {
    const sesi = sesiSkor(paket, sesiId);
    if (!sesi) return [`Sesi "${sesiId}" bukan sesi berkunci.`];

    const masalah = periksaSoalSkor(masukan);
    if (masalah.length > 0) return masalah;

    const nomor = sesi.soal.reduce((maks, item) => Math.max(maks, item.nomor), 0) + 1;
    sesi.soal.push({
      nomor,
      kategori: masukan.kategori.trim(),
      pertanyaan: masukan.pertanyaan.trim(),
      opsi: {
        A: masukan.opsi.A.trim(),
        B: masukan.opsi.B.trim(),
        C: masukan.opsi.C.trim(),
        D: masukan.opsi.D.trim(),
      },
      kunci: masukan.kunci,
      pembahasan: masukan.pembahasan.trim(),
      aktif: masukan.aktif,
    });
  });
}

/**
 * Menyimpan banyak soal sekaligus (impor massal dari PDF atau Excel).
 *
 * Soal ditambahkan melanjutkan penomoran yang sudah ada, dan berkas paket hanya
 * ditulis satu kali sehingga impor ratusan butir tetap satu perjalanan tulis.
 */
export async function tambahBanyakSoalPsikotes(
  paketId: string,
  sesiId: string,
  daftar: (MasukanSoalSkor & { baris: number })[],
): Promise<{ tersimpan: number; gagal: { baris: number; masalah: string[] }[] }> {
  const gagal: { baris: number; masalah: string[] }[] = [];
  let tersimpan = 0;

  const hasil = await ubahPaket(paketId, (paket) => {
    const sesi = sesiSkor(paket, sesiId);
    if (!sesi) return [`Sesi "${sesiId}" bukan sesi berkunci.`];

    let nomor = sesi.soal.reduce((maks, item) => Math.max(maks, item.nomor), 0);

    for (const butir of daftar) {
      const masalah = periksaSoalSkor(butir);
      if (masalah.length > 0) {
        gagal.push({ baris: butir.baris, masalah });
        continue;
      }
      nomor += 1;
      sesi.soal.push({
        nomor,
        kategori: butir.kategori.trim(),
        pertanyaan: butir.pertanyaan.trim(),
        opsi: {
          A: butir.opsi.A.trim(),
          B: butir.opsi.B.trim(),
          C: butir.opsi.C.trim(),
          D: butir.opsi.D.trim(),
        },
        kunci: butir.kunci,
        pembahasan: butir.pembahasan.trim(),
        aktif: butir.aktif,
      });
      tersimpan += 1;
    }

    if (tersimpan === 0) return ["Tidak ada butir yang layak disimpan."];
  });

  if (!hasil.ok) {
    // Kegagalan penyimpanan berlaku untuk seluruh kiriman, bukan sebagian.
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

export async function perbaruiSoalPsikotes(
  paketId: string,
  sesiId: string,
  nomor: number,
  masukan: MasukanSoalSkor,
): Promise<HasilBank<PaketPsikotes>> {
  return ubahPaket(paketId, (paket) => {
    const sesi = sesiSkor(paket, sesiId);
    if (!sesi) return [`Sesi "${sesiId}" bukan sesi berkunci.`];

    const soal = sesi.soal.find((item) => item.nomor === nomor);
    if (!soal) return [`Soal nomor ${nomor} tidak ditemukan.`];

    const masalah = periksaSoalSkor(masukan);
    if (masalah.length > 0) return masalah;

    soal.kategori = masukan.kategori.trim();
    soal.pertanyaan = masukan.pertanyaan.trim();
    soal.opsi = {
      A: masukan.opsi.A.trim(),
      B: masukan.opsi.B.trim(),
      C: masukan.opsi.C.trim(),
      D: masukan.opsi.D.trim(),
    };
    soal.kunci = masukan.kunci;
    soal.pembahasan = masukan.pembahasan.trim();
    soal.aktif = masukan.aktif;
  });
}

export async function hapusSoalPsikotes(
  paketId: string,
  sesiId: string,
  nomor: number,
): Promise<HasilBank<PaketPsikotes>> {
  return ubahPaket(paketId, (paket) => {
    const sesi = sesiSkor(paket, sesiId);
    if (!sesi) return [`Sesi "${sesiId}" bukan sesi berkunci.`];
    if (!sesi.soal.some((item) => item.nomor === nomor)) {
      return [`Soal nomor ${nomor} tidak ditemukan.`];
    }
    sesi.soal = sesi.soal.filter((item) => item.nomor !== nomor);
  });
}

/**
 * Menyalakan atau memadamkan satu butir.
 *
 * Butir yang dipadamkan tetap tersimpan lengkap dengan kunci dan pembahasannya;
 * ia hanya berhenti diujikan. Ini yang membedakannya dari penghapusan, dan
 * itulah yang biasanya dikehendaki ketika sebuah soal ternyata keliru: ia perlu
 * ditarik segera, tetapi naskahnya masih dibutuhkan untuk diperbaiki.
 */
export async function setAktifButirPsikotes(
  paketId: string,
  sesiId: string,
  nomor: number,
  aktif: boolean,
): Promise<HasilBank<PaketPsikotes>> {
  return ubahPaket(paketId, (paket) => {
    const sesi = paket.sesi.find((item) => item.id === sesiId);
    if (!sesi) return [`Sesi "${sesiId}" tidak ada pada paket ini.`];

    const butir =
      sesi.jenis === "skor"
        ? sesi.soal.find((item) => item.nomor === nomor)
        : sesi.pasangan.find((item) => item.nomor === nomor);
    if (!butir) return [`Butir nomor ${nomor} tidak ditemukan.`];

    butir.aktif = aktif;
  });
}

/* ----------------------------- Pasangan EPPS ------------------------------ */

export type MasukanPasanganEpps = {
  teksA: string;
  dimensiA: string;
  teksB: string;
  dimensiB: string;
  aktif: boolean;
};

export async function perbaruiPasanganEpps(
  paketId: string,
  sesiId: string,
  nomor: number,
  masukan: MasukanPasanganEpps,
): Promise<HasilBank<PaketPsikotes>> {
  return ubahPaket(paketId, (paket) => {
    const sesi = paket.sesi.find((item) => item.id === sesiId);
    if (!sesi || sesi.jenis !== "epps") return [`Sesi "${sesiId}" bukan sesi EPPS.`];

    const pasangan = sesi.pasangan.find((item) => item.nomor === nomor);
    if (!pasangan) return [`Pasangan nomor ${nomor} tidak ditemukan.`];

    if (!masukan.teksA.trim() || !masukan.teksB.trim()) {
      return ["Kedua pernyataan wajib diisi."];
    }

    pasangan.a = {
      teks: masukan.teksA.trim(),
      dimensi: (masukan.dimensiA as PasanganEpps["a"]["dimensi"]) ?? pasangan.a.dimensi,
    };
    pasangan.b = {
      teks: masukan.teksB.trim(),
      dimensi: (masukan.dimensiB as PasanganEpps["b"]["dimensi"]) ?? pasangan.b.dimensi,
    };
    pasangan.aktif = masukan.aktif;
  });
}
