import {
  bacaBanyakJson,
  bacaJson,
  cobaSimpan,
  daftarKunci,
  hapusKunci,
  tulisJson,
} from "@/lib/penyimpanan";
import { denganKunci } from "@/lib/pengerjaan/repositori";
import { koreksiSkor, susunProfil } from "@/lib/psikotes/bank";
import {
  cariPaketPsikotes,
  cariSesiPsikotes,
} from "@/lib/psikotes/repositori";
import {
  isHurufPsikotes,
  type DimensiEpps,
  type HasilSesi,
  type HurufPsikotes,
  type PaketPsikotes,
  type SesiPsikotes,
} from "@/lib/psikotes/tipe";

/**
 * Penyimpanan pengerjaan Try Out Psikotes.
 *
 * Berbeda dengan modul Tes IQ yang memang sekadar latihan, psikotes disimpan
 * penuh di server: jawaban dicatat setiap kali peserta menekan pilihan, waktu
 * mulai ditentukan server sehingga menyegarkan halaman tidak mengembalikan
 * waktu, dan hasilnya tetap terbaca admin setelah sesi ditutup.
 *
 * Satu dokumen JSON per peserta, memuat seluruh paket dan sesinya. Bentuk ini
 * mengikuti modul pengerjaan ujian: dokumennya kecil (paling banyak 12 sesi
 * berisi puluhan huruf), sehingga memecahnya per sesi hanya akan memperbanyak
 * perjalanan ke penyimpanan tanpa keuntungan.
 *
 * Modul ini hanya boleh diimpor dari Server Component atau Server Action.
 */

export const AWALAN_PSIKOTES = "psikotes/";

function kunciPeserta(studentId: string) {
  const aman = studentId.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${AWALAN_PSIKOTES}${aman}.json`;
}

/* -------------------------------------------------------------------------- */
/*                                   Model                                    */
/* -------------------------------------------------------------------------- */

/**
 * Ringkasan hasil yang ikut disimpan.
 *
 * Sengaja disimpan meskipun dapat dihitung ulang dari jawabannya: panel admin
 * membaca puluhan peserta sekaligus, dan menghitung ulang seluruh koreksi pada
 * setiap pemuatan halaman adalah pekerjaan sia-sia. Ia juga membekukan hasil
 * apa adanya bila kelak bank soalnya diperbaiki.
 */
export type RingkasSkor = {
  jenis: "skor";
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  perKategori: { kategori: string; benar: number; jumlah: number }[];
};

export type RingkasEpps = {
  jenis: "epps";
  dijawab: number;
  total: number;
  profil: { dimensi: DimensiEpps; skor: number; maks: number }[];
};

export type RingkasSesi = RingkasSkor | RingkasEpps;

export type CatatanSesi = {
  paketId: string;
  sesiId: string;
  /** Epoch milidetik, ditetapkan server saat sesi dimulai. */
  mulai: number;
  /** Nomor soal → huruf pilihan. */
  jawaban: Record<string, string>;
  selesaiPada?: number;
  /** true bila sesi ditutup sistem karena waktunya habis. */
  otomatis?: boolean;
  ringkas?: RingkasSesi;
};

export type BerkasPsikotes = {
  student_id: string;
  sesi: CatatanSesi[];
};

function kosong(studentId: string): BerkasPsikotes {
  return { student_id: studentId, sesi: [] };
}

/* -------------------------------------------------------------------------- */
/*                                 Pembacaan                                  */
/* -------------------------------------------------------------------------- */

export async function bacaBerkasPsikotes(
  studentId: string,
): Promise<BerkasPsikotes> {
  const data = await bacaJson<BerkasPsikotes>(kunciPeserta(studentId));
  if (!data || !Array.isArray(data.sesi)) return kosong(studentId);
  return data;
}

/** Membaca catatan banyak peserta dalam satu perjalanan ke penyimpanan. */
export async function bacaBerkasPsikotesBanyak(
  daftarId: string[],
): Promise<BerkasPsikotes[]> {
  const peta = await bacaBanyakJson<BerkasPsikotes>(daftarId.map(kunciPeserta));
  return daftarId.map((id) => {
    const data = peta.get(kunciPeserta(id));
    return data && Array.isArray(data.sesi) ? data : kosong(id);
  });
}

/** Seluruh id peserta yang punya catatan psikotes. */
export async function daftarIdPsikotes(): Promise<string[]> {
  const kunci = await daftarKunci(AWALAN_PSIKOTES);
  return kunci
    .filter((item) => item.endsWith(".json"))
    .map((item) => item.slice(AWALAN_PSIKOTES.length, -".json".length));
}

/** Dipakai saat peserta dihapus agar tidak menyisakan berkas yatim. */
export async function hapusBerkasPsikotes(studentId: string) {
  return cobaSimpan(
    () => hapusKunci(kunciPeserta(studentId)),
    "Gagal menghapus data psikotes.",
  );
}

/**
 * Mengosongkan seluruh pengerjaan psikotes satu peserta.
 *
 * Dipakai admin ketika peserta perlu diberi kesempatan mengulang — misalnya
 * sesi telanjur dimulai lalu kehabisan waktu karena gangguan teknis. Berkasnya
 * ditulis kosong, bukan dihapus, sehingga penulisan berikutnya tidak bergantung
 * pada perilaku adapter terhadap kunci yang tidak ada.
 *
 * Dijalankan di bawah kunci per peserta yang sama dengan jalur tulis lainnya,
 * supaya reset tidak berlomba dengan jawaban yang sedang dikirim peserta.
 */
export async function resetPsikotesPeserta(
  studentId: string,
): Promise<{ ok: true; jumlah: number } | { ok: false; pesan: string }> {
  return denganKunci(studentId, async () => {
    const sebelumnya = await bacaBerkasPsikotes(studentId);
    const jumlah = sebelumnya.sesi.length;

    if (jumlah === 0) return { ok: true as const, jumlah: 0 };

    const hasil = await cobaSimpan(
      () => tulisJson(kunciPeserta(studentId), kosong(studentId)),
      "Gagal mengosongkan data psikotes.",
    );
    return hasil.ok
      ? { ok: true as const, jumlah }
      : { ok: false as const, pesan: hasil.pesan };
  });
}

function cariCatatan(
  berkas: BerkasPsikotes,
  paketId: string,
  sesiId: string,
): CatatanSesi | null {
  return (
    berkas.sesi.find(
      (item) => item.paketId === paketId && item.sesiId === sesiId,
    ) ?? null
  );
}

/* -------------------------------------------------------------------------- */
/*                              Waktu dan status                              */
/* -------------------------------------------------------------------------- */

export type KeadaanSesi = "belum" | "berlangsung" | "selesai";

export type StatusSesiPsikotes = {
  keadaan: KeadaanSesi;
  sisaDetik: number;
  jawaban: Record<number, string>;
  selesaiPada: number | null;
  otomatis: boolean;
  ringkas: RingkasSesi | null;
};

function sisaDetikSesi(catatan: CatatanSesi, sesi: SesiPsikotes, sekarang: number) {
  const habis = catatan.mulai + sesi.durasiMenit * 60_000;
  return Math.max(0, Math.ceil((habis - sekarang) / 1000));
}

function keNomor(jawaban: Record<string, string>): Record<number, string> {
  const hasil: Record<number, string> = {};
  for (const [nomor, huruf] of Object.entries(jawaban)) {
    const urutan = Number(nomor);
    if (Number.isInteger(urutan)) hasil[urutan] = huruf;
  }
  return hasil;
}

/**
 * Status satu sesi bagi peserta.
 *
 * Sesi yang waktunya sudah lewat tetapi belum sempat ditutup — misalnya karena
 * peserta menutup tab — dilaporkan sebagai `selesai`, dan pembukuannya
 * dilakukan `sinkronSesiKedaluwarsa` pada jalur tulis.
 */
export function statusSesi(
  berkas: BerkasPsikotes,
  paketId: string,
  sesi: SesiPsikotes,
  sekarang: number = Date.now(),
): StatusSesiPsikotes {
  const catatan = cariCatatan(berkas, paketId, sesi.id);

  if (!catatan) {
    return {
      keadaan: "belum",
      sisaDetik: sesi.durasiMenit * 60,
      jawaban: {},
      selesaiPada: null,
      otomatis: false,
      ringkas: null,
    };
  }

  const sisa = sisaDetikSesi(catatan, sesi, sekarang);
  const sudah = Boolean(catatan.selesaiPada) || sisa <= 0;

  return {
    keadaan: sudah ? "selesai" : "berlangsung",
    sisaDetik: sisa,
    jawaban: keNomor(catatan.jawaban),
    selesaiPada: catatan.selesaiPada ?? null,
    otomatis: catatan.otomatis ?? false,
    ringkas: catatan.ringkas ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Penulisan                                 */
/* -------------------------------------------------------------------------- */

export type HasilAksi<T> = { ok: true; data: T } | { ok: false; alasan: string };

async function tulis(berkas: BerkasPsikotes): Promise<boolean> {
  const hasil = await cobaSimpan(
    () => tulisJson(kunciPeserta(berkas.student_id), berkas),
    "Gagal menyimpan pengerjaan psikotes.",
  );
  return hasil.ok;
}

/** Menyusun ringkasan yang disimpan bersama catatan. */
function ringkas(hasil: HasilSesi): RingkasSesi {
  if (hasil.jenis === "skor") {
    return {
      jenis: "skor",
      benar: hasil.benar,
      salah: hasil.salah,
      kosong: hasil.kosong,
      total: hasil.total,
      perKategori: hasil.perKategori,
    };
  }
  return {
    jenis: "epps",
    dijawab: hasil.dijawab,
    total: hasil.total,
    profil: hasil.profil.map((baris) => ({
      dimensi: baris.dimensi,
      skor: baris.skor,
      maks: baris.maks,
    })),
  };
}

/**
 * Menilai satu sesi dari jawaban yang tersimpan di server.
 *
 * Jawaban tidak pernah diambil dari kiriman klien pada tahap ini — itulah inti
 * perbedaannya dengan modul latihan. Peserta hanya dapat memengaruhi nilainya
 * lewat jalur `simpanJawaban`, yang menolak tulisan setelah waktunya habis.
 */
export function nilaiSesi(
  sesi: SesiPsikotes,
  jawaban: Record<string, string>,
): HasilSesi {
  if (sesi.jenis === "epps") {
    const pilihan = new Map<number, "A" | "B">();
    for (const [nomor, huruf] of Object.entries(jawaban)) {
      const urutan = Number(nomor);
      if (!Number.isInteger(urutan)) continue;
      if (huruf !== "A" && huruf !== "B") continue;
      pilihan.set(urutan, huruf);
    }
    return susunProfil(sesi, pilihan);
  }

  const bersih = new Map<number, HurufPsikotes>();
  for (const [nomor, huruf] of Object.entries(jawaban)) {
    const urutan = Number(nomor);
    if (!Number.isInteger(urutan)) continue;
    if (!isHurufPsikotes(huruf)) continue;
    bersih.set(urutan, huruf);
  }
  return koreksiSkor(sesi, bersih);
}

/** Mengunci sebuah catatan sebagai selesai beserta ringkasannya. */
function bukukan(catatan: CatatanSesi, sesi: SesiPsikotes, waktu: number, otomatis: boolean) {
  catatan.selesaiPada = waktu;
  catatan.otomatis = otomatis;
  catatan.ringkas = ringkas(nilaiSesi(sesi, catatan.jawaban));
}

/**
 * Membukukan seluruh sesi yang waktunya sudah habis tetapi belum tertutup.
 *
 * Dijalankan pada setiap pemuatan halaman psikotes, sehingga peserta yang
 * menutup tab di tengah sesi tetap memperoleh hasil, dan admin tidak melihat
 * sesi yang menggantung selamanya.
 */
export async function sinkronSesiKedaluwarsa(
  studentId: string,
  sekarang: number = Date.now(),
): Promise<BerkasPsikotes> {
  return denganKunci(studentId, async () => {
    const berkas = await bacaBerkasPsikotes(studentId);
    let berubah = false;

    for (const catatan of berkas.sesi) {
      if (catatan.selesaiPada) continue;

      const paket = await cariPaketPsikotes(catatan.paketId);
      const sesi = paket ? cariSesiPsikotes(paket, catatan.sesiId) : null;
      if (!sesi) continue;

      const habis = catatan.mulai + sesi.durasiMenit * 60_000;
      if (sekarang < habis) continue;

      // Waktu penutupan memakai batas waktunya, bukan saat pembukuan terjadi —
      // peserta tidak boleh tercatat mengerjakan lebih lama daripada durasinya.
      bukukan(catatan, sesi, habis, true);
      berubah = true;
    }

    if (berubah) await tulis(berkas);
    return berkas;
  });
}

/** Memulai sesi. Sesi yang sudah berjalan atau sudah selesai tidak diulang. */
export async function mulaiSesiPsikotes(
  studentId: string,
  paket: PaketPsikotes,
  sesi: SesiPsikotes,
): Promise<HasilAksi<{ sisaDetik: number }>> {
  return denganKunci(studentId, async () => {
    const berkas = await bacaBerkasPsikotes(studentId);
    const ada = cariCatatan(berkas, paket.id, sesi.id);
    const sekarang = Date.now();

    if (ada) {
      const sisa = sisaDetikSesi(ada, sesi, sekarang);
      if (ada.selesaiPada || sisa <= 0) {
        return { ok: false as const, alasan: "Sesi ini sudah pernah dikerjakan." };
      }
      // Membuka ulang tab yang sama bukan kesalahan — lanjutkan apa adanya.
      return { ok: true as const, data: { sisaDetik: sisa } };
    }

    berkas.sesi.push({
      paketId: paket.id,
      sesiId: sesi.id,
      mulai: sekarang,
      jawaban: {},
    });

    if (!(await tulis(berkas))) {
      return {
        ok: false as const,
        alasan: "Gagal memulai sesi. Periksa sambungan lalu coba lagi.",
      };
    }
    return { ok: true as const, data: { sisaDetik: sesi.durasiMenit * 60 } };
  });
}

/**
 * Menyimpan satu jawaban.
 *
 * Menolak nomor soal di luar sesi, huruf di luar pilihan yang sah, sesi yang
 * belum dimulai, dan sesi yang waktunya sudah lewat — sehingga jawaban tidak
 * dapat disusupkan setelah waktu habis.
 */
export async function simpanJawabanPsikotes(
  studentId: string,
  paket: PaketPsikotes,
  sesi: SesiPsikotes,
  nomor: number,
  huruf: string | null,
): Promise<HasilAksi<null>> {
  const sah =
    sesi.jenis === "epps"
      ? sesi.pasangan.some((item) => item.nomor === nomor)
      : sesi.soal.some((item) => item.nomor === nomor);
  if (!sah) return { ok: false, alasan: "Nomor soal tidak dikenal." };

  if (huruf !== null) {
    const diterima =
      sesi.jenis === "epps"
        ? huruf === "A" || huruf === "B"
        : isHurufPsikotes(huruf);
    if (!diterima) return { ok: false, alasan: "Pilihan jawaban tidak sah." };
  }

  return denganKunci(studentId, async () => {
    const berkas = await bacaBerkasPsikotes(studentId);
    const catatan = cariCatatan(berkas, paket.id, sesi.id);
    if (!catatan) return { ok: false as const, alasan: "Sesi belum dimulai." };
    if (catatan.selesaiPada) {
      return { ok: false as const, alasan: "Sesi sudah ditutup." };
    }
    if (sisaDetikSesi(catatan, sesi, Date.now()) <= 0) {
      return { ok: false as const, alasan: "Waktu sesi sudah habis." };
    }

    if (huruf === null) delete catatan.jawaban[String(nomor)];
    else catatan.jawaban[String(nomor)] = huruf;

    if (!(await tulis(berkas))) {
      return { ok: false as const, alasan: "Jawaban gagal disimpan." };
    }
    return { ok: true as const, data: null };
  });
}

/**
 * Menutup sesi dan menilainya.
 *
 * Sesi yang sudah tertutup tidak dinilai ulang — hasilnya dikembalikan apa
 * adanya, sehingga menekan tombol dua kali atau membuka halaman lama tidak
 * mengubah apa pun.
 */
export async function tutupSesiPsikotes(
  studentId: string,
  paket: PaketPsikotes,
  sesi: SesiPsikotes,
  otomatis: boolean,
): Promise<HasilAksi<HasilSesi>> {
  return denganKunci(studentId, async () => {
    const berkas = await bacaBerkasPsikotes(studentId);
    const catatan = cariCatatan(berkas, paket.id, sesi.id);
    if (!catatan) return { ok: false as const, alasan: "Sesi belum dimulai." };

    if (catatan.selesaiPada) {
      return { ok: true as const, data: nilaiSesi(sesi, catatan.jawaban) };
    }

    const sekarang = Date.now();
    const habis = catatan.mulai + sesi.durasiMenit * 60_000;
    bukukan(catatan, sesi, Math.min(sekarang, habis), otomatis || sekarang >= habis);

    if (!(await tulis(berkas))) {
      return {
        ok: false as const,
        alasan: "Gagal menyimpan hasil. Periksa sambungan lalu coba lagi.",
      };
    }
    return { ok: true as const, data: nilaiSesi(sesi, catatan.jawaban) };
  });
}
