import { bacaJson, cobaSimpan, tulisJson } from "@/lib/penyimpanan";
import { buatSandi, periksaSandi } from "@/lib/konfigurasi/sandi";
import {
  isStatusKelulusan as periksaStatusKelulusan,
  KELULUSAN_AWAL,
  keStatusKelulusan,
  STATUS_KELULUSAN as DAFTAR_KELULUSAN,
  type StatusKelulusan,
  type StatusSiswa,
} from "@/lib/siswa/status";
import type { SandiSesi } from "@/lib/konfigurasi/tipe";

/**
 * Penyimpanan data siswa.
 *
 * Password siswa disimpan sebagai turunan scrypt, sama seperti password sesi.
 * Modul ini hanya boleh diimpor dari kode server.
 */

const KUNCI = "konfigurasi/siswa.json";

export type {
  StatusSiswa,
  StatusKelulusan,
} from "@/lib/siswa/status";
export { STATUS_KELULUSAN, isStatusKelulusan } from "@/lib/siswa/status";

export type Siswa = {
  /**
   * Identitas internal yang tidak pernah berubah. Dipakai sebagai kunci
   * penyimpanan pengerjaan (`.data/pengerjaan/<id>.json`) dan sebagai isi sesi
   * login, sehingga mengganti username tidak memutus riwayat pengerjaan.
   */
  id: string;
  /**
   * Nomor calon siswa dari panitia.
   *
   * Berbeda dari `id`: `id` dibuat sistem dan tidak pernah berubah karena
   * dipakai sebagai kunci penyimpanan, sedangkan nomor casis ditetapkan panitia
   * dan boleh diperbaiki. Nomor inilah yang ditampilkan pada antarmuka.
   * Kosong berarti belum diberi nomor.
   */
  noCasis: string;
  /** Nama pengguna untuk masuk. Unik, tidak peka huruf besar/kecil. */
  username: string;
  nama: string;
  email: string;
  asalSekolah: string;
  kelas: string;
  status: StatusSiswa;
  /** Hasil seleksi SMA Taruna Nusantara. Hanya dapat diubah admin. */
  statusKelulusan: StatusKelulusan;
  /**
   * Tautan Google Drive milik siswa ini — berbeda untuk setiap siswa.
   * Diisi admin, dibaca siswa pada portalnya. Kosong berarti belum dibagikan.
   */
  tautanDrive: string;
  /** Catatan pendamping tautan drive, mis. isi foldernya. */
  catatanDrive: string;
  sandi: SandiSesi;
  dibuatPada: number;
};

const SISWA_BAWAAN: Omit<
  Siswa,
  "sandi" | "dibuatPada" | "statusKelulusan" | "tautanDrive" | "catatanDrive"
>[] = [
  {
    id: "2026001",
    noCasis: "TN26-001",
    username: "aditya.pratama",
    nama: "Aditya Pratama",
    email: "aditya.pratama@email.com",
    asalSekolah: "SMP Negeri 1 Magelang",
    kelas: "IX-A",
    status: "Aktif",
  },
  {
    id: "2026002",
    noCasis: "TN26-002",
    username: "nabila.safitri",
    nama: "Nabila Ayu Safitri",
    email: "nabila.safitri@email.com",
    asalSekolah: "SMP Negeri 3 Yogyakarta",
    kelas: "IX-B",
    status: "Aktif",
  },
  {
    id: "2026003",
    noCasis: "TN26-003",
    username: "rangga.wijaya",
    nama: "Rangga Wijaya",
    email: "rangga.wijaya@email.com",
    asalSekolah: "SMP Islam Al Azhar Semarang",
    kelas: "IX-A",
    status: "Aktif",
  },
  {
    id: "2026004",
    noCasis: "TN26-004",
    username: "kirana.maheswari",
    nama: "Kirana Maheswari",
    email: "kirana.maheswari@email.com",
    asalSekolah: "SMP Negeri 5 Surabaya",
    kelas: "IX-C",
    status: "Aktif",
  },
  {
    id: "2026005",
    noCasis: "TN26-005",
    username: "bagas.setiawan",
    nama: "Bagas Setiawan",
    email: "bagas.setiawan@email.com",
    asalSekolah: "SMP Negeri 2 Malang",
    kelas: "IX-B",
    status: "Nonaktif",
  },
];

/** Password awal seluruh siswa demo. */
export const SANDI_DEMO_SISWA = "siswa123";

function bawaan(): Siswa[] {
  return SISWA_BAWAAN.map((siswa) => ({
    ...siswa,
    statusKelulusan: KELULUSAN_AWAL,
    tautanDrive: "",
    catatanDrive: "",
    sandi: buatSandi(SANDI_DEMO_SISWA),
    dibuatPada: Date.now(),
  }));
}

/**
 * Cache proses.
 *
 * Membaca daftar siswa terjadi pada hampir setiap permintaan, sementara
 * perubahannya jarang. Cache dibuang setiap kali ada penulisan, sehingga
 * pembaca berikutnya selalu melihat data terbaru.
 *
 * Cache ini hidup per instance. Pada penyebaran serverless dengan beberapa
 * instance, instance lain baru melihat perubahan setelah cache-nya sendiri
 * kedaluwarsa — karena itu umurnya sengaja pendek.
 */
const UMUR_CACHE_MS = 5_000;

let cache: { waktu: number; data: Siswa[] } | null = null;

/** Melengkapi kolom yang belum ada pada data lama. */
function rapikan(data: Siswa[]): Siswa[] {
  return data.map((siswa) => ({
    ...siswa,
    // Data lama memakai NIS sebagai username.
    username: siswa.username?.trim() || siswa.id,
    // Data lama belum punya nomor casis. Sengaja dibiarkan kosong, bukan diisi
    // dengan `id`: id internal justru yang tidak boleh lagi tampil di layar.
    // Admin mengisinya lewat tombol sunting.
    noCasis: siswa.noCasis?.trim() ?? "",
    // Termasuk memetakan nama status versi lama ("Belum Diproses").
    statusKelulusan: keStatusKelulusan(siswa.statusKelulusan),
    tautanDrive: siswa.tautanDrive ?? "",
    catatanDrive: siswa.catatanDrive ?? "",
  }));
}

export async function daftarSiswa(): Promise<Siswa[]> {
  if (cache && Date.now() - cache.waktu < UMUR_CACHE_MS) return cache.data;

  const tersimpan = await bacaJson<Siswa[]>(KUNCI);
  const data = Array.isArray(tersimpan) ? rapikan(tersimpan) : bawaan();

  cache = { waktu: Date.now(), data };
  return data;
}

/** Pencarian berdasarkan id internal. */
export async function cariSiswa(id: string): Promise<Siswa | undefined> {
  const kunci = id.trim().toLowerCase();
  return (await daftarSiswa()).find((siswa) => siswa.id.toLowerCase() === kunci);
}

/** Pencarian berdasarkan identitas yang diketik peserta saat masuk. */
export async function cariSiswaUntukMasuk(
  identitas: string,
): Promise<Siswa | undefined> {
  const kunci = identitas.trim().toLowerCase();
  if (!kunci) return undefined;
  return (await daftarSiswa()).find(
    (siswa) =>
      siswa.username.toLowerCase() === kunci ||
      siswa.email.toLowerCase() === kunci ||
      // Nomor casis dari panitia juga diterima.
      (siswa.noCasis !== "" && siswa.noCasis.toLowerCase() === kunci) ||
      // Peserta lama yang terbiasa memakai NIS tetap dapat masuk.
      siswa.id.toLowerCase() === kunci,
  );
}

export type HasilSiswa = { ok: true } | { ok: false; masalah: string[] };

async function simpan(data: Siswa[]): Promise<HasilSiswa> {
  const hasil = await cobaSimpan(
    () => tulisJson(KUNCI, data),
    "Gagal menyimpan data siswa.",
  );
  if (!hasil.ok) return { ok: false, masalah: [hasil.pesan] };

  cache = null;
  return { ok: true };
}

export async function setStatusSiswa(id: string, status: StatusSiswa) {
  const data = await daftarSiswa();
  if (!data.some((siswa) => siswa.id === id)) {
    return { ok: false as const, masalah: [`Siswa "${id}" tidak ditemukan.`] };
  }
  return simpan(
    data.map((siswa) => (siswa.id === id ? { ...siswa, status } : siswa)),
  );
}

/**
 * Mengubah status kelulusan seleksi tanpa menyentuh kolom lain, sehingga admin
 * dapat menandai hasil seleksi langsung dari tabel daftar siswa.
 */
export async function setStatusKelulusan(
  id: string,
  statusKelulusan: StatusKelulusan,
): Promise<HasilSiswa> {
  if (!periksaStatusKelulusan(statusKelulusan)) {
    return { ok: false, masalah: ["Status kelulusan tidak dikenal."] };
  }

  const data = await daftarSiswa();
  if (!data.some((siswa) => siswa.id === id)) {
    return { ok: false, masalah: [`Siswa "${id}" tidak ditemukan.`] };
  }
  return simpan(
    data.map((siswa) => (siswa.id === id ? { ...siswa, statusKelulusan } : siswa)),
  );
}

/** Menyimpan tautan Google Drive milik seorang siswa. */
export async function setTautanDrive(
  id: string,
  tautanDrive: string,
  catatanDrive: string,
): Promise<HasilSiswa> {
  const masalah = periksaTautanDrive(tautanDrive);
  if (catatanDrive.length > 300) {
    masalah.push("Catatan drive maksimal 300 karakter.");
  }
  if (masalah.length) return { ok: false, masalah };

  const data = await daftarSiswa();
  if (!data.some((siswa) => siswa.id === id)) {
    return { ok: false, masalah: [`Siswa "${id}" tidak ditemukan.`] };
  }

  return simpan(
    data.map((siswa) =>
      siswa.id === id
        ? {
            ...siswa,
            tautanDrive: tautanDrive.trim(),
            catatanDrive: catatanDrive.trim(),
          }
        : siswa,
    ),
  );
}

/* ----------------------------------- CRUD ---------------------------------- */

export type MasukanSiswa = {
  noCasis: string;
  username: string;
  nama: string;
  email: string;
  asalSekolah: string;
  kelas: string;
  status: StatusSiswa;
  statusKelulusan: StatusKelulusan;
  tautanDrive: string;
  catatanDrive: string;
  /** Kosongkan saat menyunting bila password tidak ingin diubah. */
  password?: string;
};

const POLA_USERNAME = /^[a-z0-9._-]{4,32}$/;

/**
 * Tautan drive boleh dikosongkan, tetapi bila diisi hanya http/https yang
 * diterima — tautan ini dirender sebagai anchor pada portal siswa, sehingga
 * skema lain (`javascript:`, `data:`) tidak boleh lolos.
 */
function periksaTautanDrive(nilai: string): string[] {
  const url = nilai.trim();
  if (!url) return [];
  if (url.length > 500) return ["Tautan drive maksimal 500 karakter."];

  try {
    const terurai = new URL(url);
    if (terurai.protocol !== "http:" && terurai.protocol !== "https:") {
      return ["Tautan drive harus diawali http:// atau https://."];
    }
  } catch {
    return [
      "Tautan drive tidak sah. Contoh: https://drive.google.com/drive/folders/...",
    ];
  }
  return [];
}

/**
 * Validasi masukan siswa.
 * `idSaatIni` diisi ketika menyunting agar data itu sendiri tidak dianggap
 * bentrok dengan dirinya sendiri.
 */
async function validasiSiswa(
  masukan: MasukanSiswa,
  opsi: { idSaatIni?: string; wajibPassword: boolean },
): Promise<string[]> {
  const masalah: string[] = [];
  const data = await daftarSiswa();

  const username = masukan.username.trim().toLowerCase();
  if (!username) {
    masalah.push("Username wajib diisi.");
  } else if (!POLA_USERNAME.test(username)) {
    masalah.push(
      "Username hanya boleh huruf kecil, angka, titik, garis bawah, atau strip, dengan panjang 4–32 karakter.",
    );
  } else if (
    data.some(
      (siswa) =>
        siswa.id !== opsi.idSaatIni &&
        siswa.username.toLowerCase() === username,
    )
  ) {
    masalah.push(`Username "${username}" sudah dipakai peserta lain.`);
  }

  const noCasis = masukan.noCasis.trim();
  if (noCasis) {
    if (noCasis.length > 30) {
      masalah.push("Nomor casis maksimal 30 karakter.");
    } else if (!/^[A-Za-z0-9._\/-]+$/.test(noCasis)) {
      masalah.push(
        "Nomor casis hanya boleh huruf, angka, titik, garis bawah, strip, atau garis miring.",
      );
    } else if (
      data.some(
        (siswa) =>
          siswa.id !== opsi.idSaatIni &&
          siswa.noCasis.toLowerCase() === noCasis.toLowerCase(),
      )
    ) {
      masalah.push(`Nomor casis "${noCasis}" sudah dipakai peserta lain.`);
    }
  }

  if (!masukan.nama.trim()) masalah.push("Nama lengkap wajib diisi.");
  if (masukan.nama.trim().length > 80) {
    masalah.push("Nama lengkap maksimal 80 karakter.");
  }

  const email = masukan.email.trim().toLowerCase();
  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      masalah.push("Format email tidak sah.");
    } else if (
      data.some(
        (siswa) =>
          siswa.id !== opsi.idSaatIni && siswa.email.toLowerCase() === email,
      )
    ) {
      masalah.push(`Email "${email}" sudah dipakai peserta lain.`);
    }
  }

  if (masukan.status !== "Aktif" && masukan.status !== "Nonaktif") {
    masalah.push("Status harus Aktif atau Nonaktif.");
  }

  if (!periksaStatusKelulusan(masukan.statusKelulusan)) {
    masalah.push(
      `Status kelulusan harus salah satu dari: ${DAFTAR_KELULUSAN.join(", ")}.`,
    );
  }

  masalah.push(...periksaTautanDrive(masukan.tautanDrive));
  if (masukan.catatanDrive.length > 300) {
    masalah.push("Catatan drive maksimal 300 karakter.");
  }

  const password = masukan.password ?? "";
  if (opsi.wajibPassword && !password) {
    masalah.push("Password awal wajib diisi.");
  }
  if (password && password.length < 6) {
    masalah.push("Password minimal 6 karakter.");
  }
  if (password.length > 64) masalah.push("Password maksimal 64 karakter.");

  return masalah;
}

function idBerikutnya(data: Siswa[]) {
  const tahun = new Date().getFullYear();
  const awalan = String(tahun);
  const nomor = data
    .map((siswa) => siswa.id)
    .filter((id) => id.startsWith(awalan))
    .map((id) => Number(id.slice(awalan.length)))
    .filter((n) => Number.isFinite(n));

  const berikut = (nomor.length ? Math.max(...nomor) : 0) + 1;
  return `${awalan}${String(berikut).padStart(3, "0")}`;
}

export async function buatSiswa(masukan: MasukanSiswa): Promise<HasilSiswa> {
  const masalah = await validasiSiswa(masukan, { wajibPassword: true });
  if (masalah.length) return { ok: false, masalah };

  const data = await daftarSiswa();
  const siswa: Siswa = {
    id: idBerikutnya(data),
    noCasis: masukan.noCasis.trim(),
    username: masukan.username.trim().toLowerCase(),
    nama: masukan.nama.trim(),
    email: masukan.email.trim().toLowerCase(),
    asalSekolah: masukan.asalSekolah.trim(),
    kelas: masukan.kelas.trim(),
    status: masukan.status,
    statusKelulusan: masukan.statusKelulusan,
    tautanDrive: masukan.tautanDrive.trim(),
    catatanDrive: masukan.catatanDrive.trim(),
    sandi: buatSandi(masukan.password!),
    dibuatPada: Date.now(),
  };

  return simpan([...data, siswa]);
}

export async function perbaruiSiswa(
  id: string,
  masukan: MasukanSiswa,
): Promise<HasilSiswa> {
  const data = await daftarSiswa();
  const lama = data.find((siswa) => siswa.id === id);
  if (!lama) return { ok: false, masalah: [`Siswa "${id}" tidak ditemukan.`] };

  const masalah = await validasiSiswa(masukan, {
    idSaatIni: id,
    wajibPassword: false,
  });
  if (masalah.length) return { ok: false, masalah };

  const baru: Siswa = {
    ...lama,
    noCasis: masukan.noCasis.trim(),
    username: masukan.username.trim().toLowerCase(),
    nama: masukan.nama.trim(),
    email: masukan.email.trim().toLowerCase(),
    asalSekolah: masukan.asalSekolah.trim(),
    kelas: masukan.kelas.trim(),
    status: masukan.status,
    statusKelulusan: masukan.statusKelulusan,
    tautanDrive: masukan.tautanDrive.trim(),
    catatanDrive: masukan.catatanDrive.trim(),
    // Password hanya diganti bila admin mengisinya.
    sandi: masukan.password ? buatSandi(masukan.password) : lama.sandi,
  };

  return simpan(data.map((siswa) => (siswa.id === id ? baru : siswa)));
}

export async function hapusSiswa(id: string): Promise<HasilSiswa> {
  const data = await daftarSiswa();
  if (!data.some((siswa) => siswa.id === id)) {
    return { ok: false, masalah: [`Siswa "${id}" tidak ditemukan.`] };
  }
  return simpan(data.filter((siswa) => siswa.id !== id));
}

/**
 * Kredensial demo yang boleh ditampilkan pada halaman masuk.
 * Selalu null di produksi, dan hanya terisi bila password peserta pertama
 * memang masih memakai password bawaan.
 */
export async function kredensialDemoSiswa() {
  if (process.env.NODE_ENV === "production") return null;

  const siswa = (await daftarSiswa()).find((item) => item.status === "Aktif");
  if (!siswa || !periksaSandi(SANDI_DEMO_SISWA, siswa.sandi)) return null;
  return { identitas: siswa.username, password: SANDI_DEMO_SISWA };
}

/** Memeriksa kredensial siswa saat masuk. */
export async function periksaKredensialSiswa(
  identitas: string,
  password: string,
) {
  const siswa = await cariSiswaUntukMasuk(identitas);
  if (!siswa) return { ok: false as const, alasan: "kredensial" as const };
  if (!periksaSandi(password, siswa.sandi)) {
    return { ok: false as const, alasan: "kredensial" as const };
  }
  if (siswa.status !== "Aktif") {
    return { ok: false as const, alasan: "nonaktif" as const };
  }
  return { ok: true as const, siswa };
}
