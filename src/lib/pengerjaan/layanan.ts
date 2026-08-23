import { ambilKunciBerid, jumlahSoalTersedia } from "@/lib/bank-soal/pengambilan";
import { isHurufOpsi, type HurufOpsi, type Subject } from "@/lib/bank-soal/skema";
import {
  daftarSemuaPaket,
  getPaket,
  getSesi,
  jendelaPaket,
  sesiTerurut,
  type PaketKonfig,
  type SesiId,
  type SesiKonfig,
} from "@/lib/paket-tryout";
import {
  buatIdPercobaan,
  daftarPercobaan,
  denganKunci,
  percobaanBerjalan,
  simpanPercobaan,
} from "@/lib/pengerjaan/repositori";
import {
  BATAS_PELANGGARAN,
  hasilMataUji,
  hitungJadwal,
  isJenisPelanggaran,
  type HasilMataUji,
  type Jadwal,
  type JenisPelanggaran,
  type Pelanggaran,
  type Percobaan,
} from "@/lib/pengerjaan/tipe";

/**
 * Mesin pengerjaan, penilaian, dan pembukuan hasil.
 *
 * Aturan yang dijaga di lapisan ini (tidak dapat dilewati dari sisi klien):
 * - identitas peserta selalu berasal dari sesi login, bukan dari kiriman klien;
 * - jawaban hanya diterima untuk mata uji yang sedang berjalan dan sebelum
 *   batas waktunya, serta hanya untuk soal yang benar-benar ada pada paket;
 * - nilai dihitung ulang di server dari jawaban tersimpan dan kunci bank soal —
 *   klien tidak pernah mengirimkan skor;
 * - satu mata uji hanya dapat dikumpulkan satu kali.
 */

export type Peserta = { id: string; nama: string };

export type HasilOperasi<T = undefined> =
  | ({ ok: true } & (T extends undefined ? { data?: undefined } : { data: T }))
  | { ok: false; alasan: string };

function gagal(alasan: string): { ok: false; alasan: string } {
  return { ok: false, alasan };
}

/** Waktu jadwal dalam format yang mudah dibaca peserta. */
function formatJadwal(waktu: number | null) {
  if (waktu === null) return "waktu yang ditentukan";
  return new Date(waktu).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------ Sinkronisasi ------------------------------ */

async function nilaiDariJawaban(
  percobaan: Percobaan,
  subject: Subject,
): Promise<Omit<HasilMataUji, "submitted_at" | "otomatis">> {
  const kunci = await ambilKunciBerid(percobaan.package_id, subject);
  const jawaban = new Map(
    percobaan.jawaban
      .filter((item) => item.subject === subject)
      .map((item) => [item.question_id, item.answer]),
  );

  let benar = 0;
  let salah = 0;
  let kosong = 0;

  for (const butir of kunci) {
    const jawab = jawaban.get(butir.id);
    if (!jawab) kosong += 1;
    else if (jawab === butir.kunci) benar += 1;
    else salah += 1;
  }

  return {
    subject,
    jumlah_soal: kunci.length,
    benar,
    salah,
    kosong,
    nilai: kunci.length === 0 ? 0 : Math.round((benar / kunci.length) * 100),
  };
}

/**
 * Membukukan mata uji yang batas waktunya sudah lewat namun belum dikumpulkan.
 * Dipanggil sebelum setiap operasi sehingga pengerjaan yang ditinggalkan tetap
 * dinilai walaupun peserta tidak pernah menekan tombol kumpulkan.
 */
async function sinkronkan(
  percobaan: Percobaan,
  sesi: SesiKonfig,
  sekarang: number,
  batasAkhirPaket?: number | null,
): Promise<{ percobaan: Percobaan; berubah: boolean }> {
  let terkini = percobaan;
  let berubah = false;

  for (let putaran = 0; putaran < sesi.mataUji.length; putaran += 1) {
    const jadwal = hitungJadwal(terkini, sesi, sekarang, batasAkhirPaket);
    if (jadwal.perluSinkron.length === 0) break;

    const indeks = jadwal.perluSinkron[0];
    const subject = sesi.mataUji[indeks].subject;
    const skor = await nilaiDariJawaban(terkini, subject);

    terkini = {
      ...terkini,
      hasil: [
        ...terkini.hasil,
        { ...skor, submitted_at: jadwal.batas[indeks], otomatis: true },
      ],
    };
    berubah = true;
  }

  if (terkini.hasil.length === sesi.mataUji.length && terkini.status !== "selesai") {
    terkini = {
      ...terkini,
      status: "selesai",
      selesai_pada: Math.max(...terkini.hasil.map((item) => item.submitted_at)),
    };
    berubah = true;
  }

  if (berubah) await simpanPercobaan(terkini.student_id, terkini);
  return { percobaan: terkini, berubah };
}

/**
 * Percobaan berjalan milik peserta, sudah disinkronkan dengan waktu terkini.
 *
 * Versi tanpa kunci: hanya dipanggil dari dalam blok `denganKunci`, sehingga
 * pemanggilan bersarang tidak saling menunggu.
 */
async function percobaanAktifTanpaKunci(peserta: Peserta) {
  const percobaan = await percobaanBerjalan(peserta.id);
  if (!percobaan) return null;

  const sesi = await getSesi(percobaan.package_id, percobaan.session_id);
  const paket = await getPaket(percobaan.package_id);
  if (!sesi || !paket) return null;

  // Jadwal penutupan paket menjadi batas akhir tambahan: pengerjaan yang masih
  // berjalan ikut dibukukan begitu paket ditutup, dan jawaban yang telanjur
  // tersimpan tetap dinilai.
  const tutup = jendelaPaket(paket, Date.now()).tutup;

  const { percobaan: terkini } = await sinkronkan(
    percobaan,
    sesi,
    Date.now(),
    tutup,
  );
  const jadwal = hitungJadwal(terkini, sesi, Date.now(), tutup);
  return { percobaan: terkini, sesi, paket, jadwal };
}

/**
 * Percobaan berjalan milik peserta. Dijalankan di bawah kunci per peserta
 * karena pembacaan ini juga membukukan mata uji yang waktunya sudah habis.
 */
export async function percobaanAktif(peserta: Peserta) {
  return denganKunci(peserta.id, () => percobaanAktifTanpaKunci(peserta));
}

/* -------------------------------- Mulai sesi ------------------------------- */

export async function mulaiPercobaan(
  peserta: Peserta,
  paket: PaketKonfig,
  sesiId: SesiId,
): Promise<HasilOperasi<Percobaan>> {
  return denganKunci(peserta.id, () => mulaiPercobaanTerkunci(peserta, paket, sesiId));
}

async function mulaiPercobaanTerkunci(
  peserta: Peserta,
  paket: PaketKonfig,
  sesiId: SesiId,
): Promise<HasilOperasi<Percobaan>> {
  const sesi = await getSesi(paket.id, sesiId);
  if (!sesi) return gagal("Sesi tidak dikenal.");

  // Jendela pelaksanaan diperiksa di server, bukan sekadar disembunyikan dari
  // tampilan, sehingga tautan langsung ke ruang ujian pun tetap tertolak.
  const jendela = jendelaPaket(paket, Date.now());
  if (!jendela.terbuka) {
    if (jendela.status === "Belum Dibuka") {
      return gagal(
        `${paket.nama} baru dibuka pada ${formatJadwal(jendela.buka)}. Silakan kembali pada waktu tersebut.`,
      );
    }
    if (jendela.status === "Ditutup") {
      return gagal(
        `${paket.nama} sudah ditutup pada ${formatJadwal(jendela.tutup)} dan tidak dapat dikerjakan lagi.`,
      );
    }
    return gagal(`${paket.nama} sedang tidak dibuka untuk peserta.`);
  }

  const riwayat = await daftarPercobaan(peserta.id);
  const sudahSelesai = riwayat.some(
    (item) =>
      item.package_id === paket.id &&
      item.session_id === sesiId &&
      item.status === "selesai",
  );
  if (sudahSelesai) {
    return gagal("Sesi ini sudah pernah dikerjakan dan tidak dapat diulang.");
  }

  const berjalan = await percobaanAktifTanpaKunci(peserta);
  if (berjalan && !berjalan.jadwal.selesai) {
    if (
      berjalan.percobaan.package_id === paket.id &&
      berjalan.percobaan.session_id === sesiId
    ) {
      return { ok: true, data: berjalan.percobaan };
    }
    return gagal(
      `Masih ada sesi berjalan: ${berjalan.paket.nama} ${berjalan.sesi.nama}. Selesaikan sesi tersebut terlebih dahulu.`,
    );
  }

  const jumlah = await Promise.all(
    sesi.mataUji.map((mata) => jumlahSoalTersedia(paket.id, mata.subject)),
  );
  if (jumlah.every((n) => n === 0)) {
    return gagal(
      "Bank soal untuk sesi ini belum terisi. Hubungi panitia sebelum memulai sesi.",
    );
  }

  const percobaan: Percobaan = {
    id: buatIdPercobaan(),
    student_id: peserta.id,
    student_nama: peserta.nama,
    package_id: paket.id,
    session_id: sesiId,
    mulai: Date.now(),
    status: "berlangsung",
    jawaban: [],
    hasil: [],
  };

  const tulis = await simpanPercobaan(peserta.id, percobaan);
  if (!tulis.ok) return gagal(tulis.pesan);
  return { ok: true, data: percobaan };
}

/* ------------------------------ Simpan jawaban ----------------------------- */

/**
 * Menyimpan satu jawaban peserta. Nilai `answer` null berarti jawaban dibatalkan.
 * Server menentukan sendiri paket, sesi, dan mata uji dari percobaan yang aktif.
 */
export async function simpanJawabanPeserta(
  peserta: Peserta,
  questionId: string,
  answer: string | null,
): Promise<HasilOperasi> {
  return denganKunci(peserta.id, () =>
    simpanJawabanTerkunci(peserta, questionId, answer),
  );
}

async function simpanJawabanTerkunci(
  peserta: Peserta,
  questionId: string,
  answer: string | null,
): Promise<HasilOperasi> {
  const aktif = await percobaanAktifTanpaKunci(peserta);
  if (!aktif) return gagal("Tidak ada sesi yang sedang berjalan.");

  const { percobaan, sesi, jadwal } = aktif;
  if (jadwal.aktif === null) return gagal("Waktu sesi sudah berakhir.");

  const mata = sesi.mataUji[jadwal.aktif];
  const subject = mata.subject;

  // Soal harus benar-benar milik mata uji yang sedang berjalan pada paket ini.
  const kunci = await ambilKunciBerid(percobaan.package_id, subject);
  const soal = kunci.find((butir) => butir.id === questionId);
  if (!soal) return gagal("Soal tidak terdapat pada mata uji yang sedang berjalan.");

  if (answer !== null && !isHurufOpsi(answer)) {
    return gagal("Pilihan jawaban tidak sah.");
  }

  const lain = percobaan.jawaban.filter((item) => item.question_id !== questionId);
  const berikutnya: Percobaan = {
    ...percobaan,
    jawaban:
      answer === null
        ? lain
        : [
            ...lain,
            {
              question_id: questionId,
              subject,
              question_order: soal.question_order,
              answer: answer as HurufOpsi,
              updated_at: Date.now(),
            },
          ],
  };

  const tulis = await simpanPercobaan(peserta.id, berikutnya);
  if (!tulis.ok) return gagal(tulis.pesan);
  return { ok: true };
}

/* ------------------------------- Pengawasan ------------------------------- */

/** Jeda minimal antar catatan sejenis, menahan banjir catatan dari klien. */
const JEDA_PELANGGARAN_MS = 3000;

export type HasilPelanggaran = { dicatat: boolean; jumlah: number };

/**
 * Mencatat satu pelanggaran pengawasan pada percobaan yang sedang berjalan.
 *
 * Catatan ini murni informatif untuk panitia: tidak mengubah jawaban maupun
 * nilai, dan tidak pernah menghentikan pengerjaan peserta secara sepihak.
 * Klien hanya boleh mengirim jenis dari daftar tertutup; waktu, mata uji, dan
 * identitas ditentukan server.
 */
export async function catatPelanggaranPeserta(
  peserta: Peserta,
  jenis: unknown,
  detail?: unknown,
): Promise<HasilPelanggaran> {
  if (!isJenisPelanggaran(jenis)) return { dicatat: false, jumlah: 0 };
  return denganKunci(peserta.id, () =>
    catatPelanggaranTerkunci(peserta, jenis, detail),
  );
}

async function catatPelanggaranTerkunci(
  peserta: Peserta,
  jenis: JenisPelanggaran,
  detail?: unknown,
): Promise<HasilPelanggaran> {
  const aktif = await percobaanAktifTanpaKunci(peserta);
  if (!aktif) return { dicatat: false, jumlah: 0 };

  const { percobaan, sesi, jadwal } = aktif;
  const sebelumnya = percobaan.pelanggaran ?? [];
  const sekarang = Date.now();

  if (sebelumnya.length >= BATAS_PELANGGARAN) {
    return { dicatat: false, jumlah: sebelumnya.length };
  }

  const terakhirSejenis = sebelumnya
    .filter((item) => item.jenis === jenis)
    .reduce((maks, item) => Math.max(maks, item.waktu), 0);
  if (sekarang - terakhirSejenis < JEDA_PELANGGARAN_MS) {
    return { dicatat: false, jumlah: sebelumnya.length };
  }

  const catatan: Pelanggaran = {
    jenis,
    subject: jadwal.aktif === null ? null : sesi.mataUji[jadwal.aktif].subject,
    waktu: sekarang,
    detail:
      typeof detail === "string" && detail.trim()
        ? detail.trim().slice(0, 80)
        : undefined,
  };

  const berikutnya: Percobaan = {
    ...percobaan,
    pelanggaran: [...sebelumnya, catatan],
  };

  const tulis = await simpanPercobaan(peserta.id, berikutnya);
  return {
    dicatat: tulis.ok,
    jumlah: tulis.ok ? berikutnya.pelanggaran!.length : sebelumnya.length,
  };
}

/* --------------------------------- Submit --------------------------------- */

export type HasilSubmit = {
  subject: Subject;
  sesiSelesai: boolean;
  paketId: string;
  sesiId: SesiId;
};

/**
 * Mengumpulkan mata uji yang sedang berjalan. Klien tidak mengirim jawaban
 * maupun nilai: seluruhnya diambil dari data tersimpan di server.
 */
export async function submitMataUji(
  peserta: Peserta,
  opsi: { otomatis?: boolean; subjectHarapan?: string } = {},
): Promise<HasilOperasi<HasilSubmit>> {
  return denganKunci(peserta.id, () => submitTerkunci(peserta, opsi));
}

async function submitTerkunci(
  peserta: Peserta,
  opsi: { otomatis?: boolean; subjectHarapan?: string },
): Promise<HasilOperasi<HasilSubmit>> {
  const aktif = await percobaanAktifTanpaKunci(peserta);
  if (!aktif) return gagal("Tidak ada sesi yang sedang berjalan.");

  const { percobaan, sesi, jadwal } = aktif;

  // Waktu sudah habis dan sinkronisasi sudah membukukan seluruh mata uji.
  if (jadwal.aktif === null) {
    return {
      ok: true,
      data: {
        subject: (opsi.subjectHarapan ?? sesi.mataUji[0].subject) as Subject,
        sesiSelesai: percobaan.status === "selesai",
        paketId: percobaan.package_id,
        sesiId: percobaan.session_id,
      },
    };
  }

  const mata = sesi.mataUji[jadwal.aktif];
  const subject = mata.subject;

  if (opsi.subjectHarapan && opsi.subjectHarapan !== subject) {
    return gagal(
      "Mata uji yang dikumpulkan tidak sesuai dengan yang sedang berjalan.",
    );
  }

  // Penjaga pengumpulan ganda.
  if (hasilMataUji(percobaan, subject)) {
    return gagal("Mata uji ini sudah dikumpulkan dan tidak dapat dikumpulkan lagi.");
  }

  const skor = await nilaiDariJawaban(percobaan, subject);
  const sekarang = Date.now();

  let berikutnya: Percobaan = {
    ...percobaan,
    hasil: [
      ...percobaan.hasil,
      {
        ...skor,
        submitted_at: Math.min(sekarang, jadwal.batas[jadwal.aktif]),
        otomatis: Boolean(opsi.otomatis),
      },
    ],
  };

  if (berikutnya.hasil.length === sesi.mataUji.length) {
    berikutnya = {
      ...berikutnya,
      status: "selesai",
      selesai_pada: sekarang,
    };
  }

  const tulis = await simpanPercobaan(peserta.id, berikutnya);
  if (!tulis.ok) return gagal(tulis.pesan);

  return {
    ok: true,
    data: {
      subject,
      sesiSelesai: berikutnya.status === "selesai",
      paketId: berikutnya.package_id,
      sesiId: berikutnya.session_id,
    },
  };
}

/* --------------------------------- Riwayat -------------------------------- */

/** Ringkasan hasil yang boleh dilihat peserta: nilai, benar, salah, jumlah soal. */
export type BarisHasil = {
  id: string;
  paketId: string;
  paketNama: string;
  sesiNama: string;
  subject: Subject;
  nilai: number;
  benar: number;
  salah: number;
  jumlahSoal: number;
  waktu: number;
  otomatis: boolean;
};

export async function riwayatHasil(peserta: Peserta): Promise<BarisHasil[]> {
  const [semua, paketList] = await Promise.all([
    daftarPercobaan(peserta.id),
    daftarSemuaPaket(),
  ]);

  // Pencarian di dalam flatMap harus sinkron, jadi konfigurasinya dipetakan
  // sekali di depan.
  const petaPaket = new Map(paketList.map((paket) => [paket.id, paket]));

  return semua
    .flatMap((percobaan) => {
      const paket = petaPaket.get(percobaan.package_id);
      const sesi = paket?.sesi.find((s) => s.id === percobaan.session_id);
      if (!paket || !sesi) return [];

      return percobaan.hasil.map((hasil) => ({
        id: `${percobaan.id}-${hasil.subject}`,
        paketId: percobaan.package_id,
        paketNama: paket.nama,
        sesiNama: sesi.nama,
        subject: hasil.subject,
        nilai: hasil.nilai,
        benar: hasil.benar,
        salah: hasil.salah,
        jumlahSoal: hasil.jumlah_soal,
        waktu: hasil.submitted_at,
        otomatis: hasil.otomatis,
      }));
    })
    .sort((a, b) => b.waktu - a.waktu);
}

/** Data status seluruh paket untuk tampilan siswa. */
export type KonteksSiswa = {
  peserta: Peserta;
  percobaan: Percobaan[];
  sekarang: number;
};

export async function bacaKonteksSiswa(peserta: Peserta): Promise<KonteksSiswa> {
  // Pastikan sesi yang waktunya habis sudah dibukukan sebelum status dibaca.
  await percobaanAktif(peserta);
  return {
    peserta,
    percobaan: await daftarPercobaan(peserta.id),
    sekarang: Date.now(),
  };
}

export { hitungJadwal };
export type { Jadwal, Percobaan };
