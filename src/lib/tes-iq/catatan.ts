import {
  bacaBanyakJson,
  bacaJson,
  cobaSimpan,
  daftarKunci,
  hapusKunci,
  tulisJson,
} from "@/lib/penyimpanan";
import { denganKunci } from "@/lib/pengerjaan/repositori";
import { cariPaketIq, koreksiLatihan } from "@/lib/tes-iq/bank";
import {
  isHurufIq,
  type HasilLatihanIq,
  type HurufIq,
  type KategoriIq,
  type PaketIq,
} from "@/lib/tes-iq/tipe";

/**
 * Penyimpanan pengerjaan Tes IQ latihan.
 *
 * Berbeda dengan psikotes, latihan ini **boleh diulang** sebanyak yang peserta
 * mau — itu memang gunanya. Karena itu yang disimpan adalah percobaan terakhir
 * beserta cacah berapa kali paket itu sudah dituntaskan; riwayat penuh tiap
 * percobaan sengaja tidak disimpan agar dokumennya tetap kecil dan pengajar
 * tidak tenggelam dalam puluhan baris untuk satu peserta.
 *
 * Sejak setiap paket berbatas waktu, batas itu ditegakkan server: waktu mulai
 * ditetapkan di sini, bukan di browser, sehingga menyegarkan halaman tidak
 * mengembalikan pewaktu, dan jawaban yang tiba setelah waktunya lewat ditolak.
 * Pewaktu di layar peserta hanya penunjuk.
 *
 * Modul ini hanya boleh diimpor dari Server Component atau Server Action.
 */

export const AWALAN_TES_IQ = "tes-iq/";

function kunciPeserta(studentId: string) {
  const aman = studentId.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${AWALAN_TES_IQ}${aman}.json`;
}

/* -------------------------------------------------------------------------- */
/*                                   Model                                    */
/* -------------------------------------------------------------------------- */

export type RingkasIq = {
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  perKategori: { kategori: KategoriIq; benar: number; jumlah: number }[];
};

export type CatatanIq = {
  paketId: string;
  /** Waktu percobaan yang sedang berjalan dimulai. */
  mulai: number;
  /** Nomor soal → huruf pilihan, untuk percobaan yang sedang berjalan. */
  jawaban: Record<string, string>;
  selesaiPada?: number;
  /** true bila percobaan ditutup sistem karena waktunya habis. */
  otomatis?: boolean;
  ringkas?: RingkasIq;
  /** Berapa kali paket ini sudah dituntaskan sampai selesai. */
  percobaan: number;
};

export type BerkasIq = {
  student_id: string;
  paket: CatatanIq[];
};

function kosong(studentId: string): BerkasIq {
  return { student_id: studentId, paket: [] };
}

/* -------------------------------------------------------------------------- */
/*                                 Pembacaan                                  */
/* -------------------------------------------------------------------------- */

export async function bacaBerkasIq(studentId: string): Promise<BerkasIq> {
  const data = await bacaJson<BerkasIq>(kunciPeserta(studentId));
  if (!data || !Array.isArray(data.paket)) return kosong(studentId);
  return data;
}

/** Membaca catatan banyak peserta dalam satu perjalanan ke penyimpanan. */
export async function bacaBerkasIqBanyak(
  daftarId: string[],
): Promise<BerkasIq[]> {
  const peta = await bacaBanyakJson<BerkasIq>(daftarId.map(kunciPeserta));
  return daftarId.map((id) => {
    const data = peta.get(kunciPeserta(id));
    return data && Array.isArray(data.paket) ? data : kosong(id);
  });
}

export async function daftarIdIq(): Promise<string[]> {
  const kunci = await daftarKunci(AWALAN_TES_IQ);
  return kunci
    .filter((item) => item.endsWith(".json"))
    .map((item) => item.slice(AWALAN_TES_IQ.length, -".json".length));
}

/** Dipakai saat peserta dihapus agar tidak menyisakan berkas yatim. */
export async function hapusBerkasIq(studentId: string) {
  return cobaSimpan(
    () => hapusKunci(kunciPeserta(studentId)),
    "Gagal menghapus data Tes IQ.",
  );
}

function cari(berkas: BerkasIq, paketId: string): CatatanIq | null {
  return berkas.paket.find((item) => item.paketId === paketId) ?? null;
}

function keNomor(jawaban: Record<string, string>): Record<number, string> {
  const hasil: Record<number, string> = {};
  for (const [nomor, huruf] of Object.entries(jawaban)) {
    const urutan = Number(nomor);
    if (Number.isInteger(urutan)) hasil[urutan] = huruf;
  }
  return hasil;
}

/* -------------------------------------------------------------------------- */
/*                                   Status                                   */
/* -------------------------------------------------------------------------- */

export type StatusIq = {
  keadaan: "belum" | "berlangsung" | "selesai";
  jawaban: Record<number, string>;
  selesaiPada: number | null;
  ringkas: RingkasIq | null;
  percobaan: number;
  /** Sisa waktu menurut server, dalam detik. */
  sisaDetik: number;
  /** true bila percobaan ini ditutup sistem karena waktunya habis. */
  otomatis: boolean;
};

/** Sisa waktu satu percobaan menurut jam server. */
function sisaDetikPaket(catatan: CatatanIq, paket: PaketIq, sekarang: number) {
  const habis = catatan.mulai + paket.durasiMenit * 60_000;
  return Math.max(0, Math.ceil((habis - sekarang) / 1000));
}

/**
 * Status satu paket bagi peserta.
 *
 * Percobaan yang waktunya sudah lewat tetapi belum sempat ditutup — misalnya
 * karena peserta menutup tab — dilaporkan sebagai `selesai`, dan pembukuannya
 * dilakukan `sinkronPaketKedaluwarsa` pada jalur tulis.
 */
export function statusIq(
  berkas: BerkasIq,
  paket: PaketIq,
  sekarang: number = Date.now(),
): StatusIq {
  const catatan = cari(berkas, paket.id);
  if (!catatan) {
    return {
      keadaan: "belum",
      jawaban: {},
      selesaiPada: null,
      ringkas: null,
      percobaan: 0,
      sisaDetik: paket.durasiMenit * 60,
      otomatis: false,
    };
  }

  const sisa = sisaDetikPaket(catatan, paket, sekarang);
  const sudah = Boolean(catatan.selesaiPada) || sisa <= 0;

  return {
    keadaan: sudah
      ? "selesai"
      : Object.keys(catatan.jawaban).length > 0
        ? "berlangsung"
        : "belum",
    jawaban: keNomor(catatan.jawaban),
    selesaiPada: catatan.selesaiPada ?? null,
    ringkas: catatan.ringkas ?? null,
    percobaan: catatan.percobaan ?? 0,
    sisaDetik: sisa,
    otomatis: catatan.otomatis ?? false,
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Penulisan                                 */
/* -------------------------------------------------------------------------- */

export type HasilAksiIq<T> =
  | { ok: true; data: T }
  | { ok: false; alasan: string };

async function tulis(berkas: BerkasIq): Promise<boolean> {
  const hasil = await cobaSimpan(
    () => tulisJson(kunciPeserta(berkas.student_id), berkas),
    "Gagal menyimpan pengerjaan Tes IQ.",
  );
  return hasil.ok;
}

/** Menilai satu paket dari jawaban yang tersimpan di server. */
export function nilaiIq(
  paket: PaketIq,
  jawaban: Record<string, string>,
): HasilLatihanIq {
  const bersih = new Map<number, HurufIq>();
  for (const [nomor, huruf] of Object.entries(jawaban)) {
    const urutan = Number(nomor);
    if (!Number.isInteger(urutan)) continue;
    if (!isHurufIq(huruf)) continue;
    bersih.set(urutan, huruf);
  }
  return koreksiLatihan(paket, bersih);
}

function ringkasDari(hasil: HasilLatihanIq): RingkasIq {
  return {
    benar: hasil.benar,
    salah: hasil.salah,
    kosong: hasil.kosong,
    total: hasil.total,
    perKategori: hasil.perKategori,
  };
}

/**
 * Membukukan percobaan yang waktunya sudah habis tetapi belum tertutup.
 *
 * Dijalankan pada setiap pemuatan halaman Tes IQ, sehingga peserta yang menutup
 * tab di tengah latihan tetap memperoleh hasil dan pengajar tidak melihat
 * percobaan yang menggantung selamanya.
 */
export async function sinkronPaketKedaluwarsa(
  studentId: string,
  daftarPaket: PaketIq[],
  sekarang: number = Date.now(),
): Promise<BerkasIq> {
  return denganKunci(studentId, async () => {
    const berkas = await bacaBerkasIq(studentId);
    let berubah = false;

    for (const catatan of berkas.paket) {
      if (catatan.selesaiPada) continue;

      const paket = daftarPaket.find((item) => item.id === catatan.paketId);
      if (!paket) continue;

      const habis = catatan.mulai + paket.durasiMenit * 60_000;
      if (sekarang < habis) continue;

      catatan.selesaiPada = habis;
      catatan.otomatis = true;
      catatan.percobaan = (catatan.percobaan ?? 0) + 1;
      catatan.ringkas = ringkasDari(nilaiIq(paket, catatan.jawaban));
      berubah = true;
    }

    if (berubah) await tulis(berkas);
    return berkas;
  });
}

/**
 * Menyimpan satu jawaban.
 *
 * Catatan dibuat sendiri pada jawaban pertama — Tes IQ tidak punya layar
 * "mulai" terpisah, dan pewaktunya mulai berjalan sejak jawaban pertama itu
 * tercatat di server.
 *
 * Jawaban yang tiba setelah batas waktu ditolak, bukan diam-diam disimpan:
 * inilah yang membuat batas 21 menit benar-benar mengikat, bukan sekadar
 * hitungan mundur di layar. Peserta yang ingin mengulang menempuh
 * `ulangiIq`, yang membuka percobaan baru beserta pewaktunya sendiri.
 */
export async function simpanJawabanIq(
  studentId: string,
  paket: PaketIq,
  nomor: number,
  huruf: string | null,
): Promise<HasilAksiIq<null>> {
  if (!paket.soal.some((item) => item.nomor === nomor)) {
    return { ok: false, alasan: "Nomor soal tidak dikenal." };
  }
  if (huruf !== null && !isHurufIq(huruf)) {
    return { ok: false, alasan: "Pilihan jawaban tidak sah." };
  }

  return denganKunci(studentId, async () => {
    const berkas = await bacaBerkasIq(studentId);
    let catatan = cari(berkas, paket.id);

    if (!catatan) {
      catatan = {
        paketId: paket.id,
        mulai: Date.now(),
        jawaban: {},
        percobaan: 0,
      };
      berkas.paket.push(catatan);
    } else if (catatan.selesaiPada) {
      return { ok: false as const, alasan: "Latihan ini sudah ditutup." };
    } else if (sisaDetikPaket(catatan, paket, Date.now()) <= 0) {
      return { ok: false as const, alasan: "Waktu latihan sudah habis." };
    }

    if (huruf === null) delete catatan.jawaban[String(nomor)];
    else catatan.jawaban[String(nomor)] = huruf;

    if (!(await tulis(berkas))) {
      return { ok: false as const, alasan: "Jawaban gagal disimpan." };
    }
    return { ok: true as const, data: null };
  });
}

/** Menutup paket lalu menilainya dari jawaban yang tersimpan. */
export async function tutupIq(
  studentId: string,
  paket: PaketIq,
  otomatis = false,
): Promise<HasilAksiIq<HasilLatihanIq>> {
  return denganKunci(studentId, async () => {
    const berkas = await bacaBerkasIq(studentId);
    let catatan = cari(berkas, paket.id);

    // Menutup tanpa pernah menjawab tetap sah — hasilnya kosong semua.
    if (!catatan) {
      catatan = {
        paketId: paket.id,
        mulai: Date.now(),
        jawaban: {},
        percobaan: 0,
      };
      berkas.paket.push(catatan);
    }

    const hasil = nilaiIq(paket, catatan.jawaban);

    if (!catatan.selesaiPada) {
      const sekarang = Date.now();
      const habis = catatan.mulai + paket.durasiMenit * 60_000;
      // Waktu penutupan dibatasi batas waktunya sendiri: peserta tidak boleh
      // tercatat mengerjakan lebih lama daripada durasi paketnya.
      catatan.selesaiPada = Math.min(sekarang, habis);
      catatan.otomatis = otomatis || sekarang >= habis;
      catatan.percobaan = (catatan.percobaan ?? 0) + 1;
      catatan.ringkas = ringkasDari(hasil);

      if (!(await tulis(berkas))) {
        return {
          ok: false as const,
          alasan: "Gagal menyimpan hasil. Periksa sambungan lalu coba lagi.",
        };
      }
    }

    return { ok: true as const, data: hasil };
  });
}

/**
 * Memulai percobaan baru atas permintaan peserta (tombol "Ulangi latihan").
 *
 * Cacah percobaan tidak direset — pengajar tetap dapat melihat berapa kali
 * paket itu sudah dikerjakan.
 */
export async function ulangiIq(
  studentId: string,
  paket: PaketIq,
): Promise<HasilAksiIq<null>> {
  return denganKunci(studentId, async () => {
    const berkas = await bacaBerkasIq(studentId);
    const catatan = cari(berkas, paket.id);
    if (!catatan) return { ok: true as const, data: null };

    catatan.mulai = Date.now();
    catatan.jawaban = {};
    delete catatan.selesaiPada;
    delete catatan.otomatis;
    delete catatan.ringkas;

    if (!(await tulis(berkas))) {
      return { ok: false as const, alasan: "Gagal memulai latihan ulang." };
    }
    return { ok: true as const, data: null };
  });
}

/**
 * Mengosongkan seluruh pengerjaan Tes IQ satu peserta (khusus admin).
 *
 * Berbeda dengan `ulangiIq`, ini juga menghapus cacah percobaan — dipakai
 * ketika pengajar ingin catatan peserta benar-benar bersih.
 */
export async function resetIqPeserta(
  studentId: string,
): Promise<{ ok: true; jumlah: number } | { ok: false; pesan: string }> {
  return denganKunci(studentId, async () => {
    const sebelumnya = await bacaBerkasIq(studentId);
    const jumlah = sebelumnya.paket.length;
    if (jumlah === 0) return { ok: true as const, jumlah: 0 };

    const hasil = await cobaSimpan(
      () => tulisJson(kunciPeserta(studentId), kosong(studentId)),
      "Gagal mengosongkan data Tes IQ.",
    );
    return hasil.ok
      ? { ok: true as const, jumlah }
      : { ok: false as const, pesan: hasil.pesan };
  });
}
