/**
 * Sesi login: token bertanda tangan (HMAC-SHA256) yang disimpan pada cookie
 * httpOnly.
 *
 * Berkas ini sengaja bebas dependensi Node/Next agar dapat dipakai baik di
 * Server Component maupun di middleware (Edge Runtime) — seluruh kriptografi
 * memakai Web Crypto yang tersedia pada kedua lingkungan.
 *
 * Isi token hanya berupa identitas dan peran; token TIDAK dapat dipalsukan
 * tanpa mengetahui SESSION_SECRET, sehingga peran "admin" tidak bisa disisipkan
 * dari sisi klien.
 */

/**
 * Nama cookie sesi.
 *
 * Di produksi memakai awalan `__Host-`: peramban hanya menerima cookie berawalan
 * itu bila dikirim lewat HTTPS, ber-`Path=/`, dan tanpa atribut `Domain` —
 * sehingga subdomain lain (termasuk pratinjau atau subdomain yang dibajak)
 * tidak dapat menuliskan cookie sesi untuk aplikasi ini. Pada pengembangan
 * lokal yang berjalan di HTTP, awalan itu justru membuat cookie ditolak, jadi
 * namanya tetap polos.
 */
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-tn_session" : "tn_session";

/** Masa berlaku sesi. */
export const MASA_SESI_DETIK = 60 * 60 * 8;

export type Role = "siswa" | "admin";

export type Session = {
  role: Role;
  nama: string;
  identitas: string;
  /** Waktu terbit (epoch detik). */
  iat: number;
  /** Waktu kedaluwarsa (epoch detik). */
  exp: number;
};

/* --------------------------------- Rahasia -------------------------------- */

const RAHASIA_PENGEMBANGAN =
  "pengembangan-lokal-tryout-tn-secret-jangan-dipakai-di-produksi";

const PANJANG_MINIMAL = 32;

export class SesiTidakTerkonfigurasi extends Error {}

function ambilRahasia(): string {
  const dari = process.env.SESSION_SECRET?.trim();
  if (dari && dari.length >= PANJANG_MINIMAL) return dari;

  if (process.env.NODE_ENV === "production") {
    throw new SesiTidakTerkonfigurasi(
      `SESSION_SECRET belum diatur atau kurang dari ${PANJANG_MINIMAL} karakter. ` +
        "Atur environment variable tersebut sebelum aplikasi dijalankan.",
    );
  }
  return RAHASIA_PENGEMBANGAN;
}

/** Dipakai halaman diagnosa agar kesalahan konfigurasi terlihat lebih awal. */
export function rahasiaSesiSiap() {
  try {
    ambilRahasia();
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------ Utilitas byte ----------------------------- */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function keBase64Url(bytes: Uint8Array) {
  let biner = "";
  for (const byte of bytes) biner += String.fromCharCode(byte);
  return btoa(biner).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function dariBase64Url(nilai: string) {
  const biner = atob(nilai.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(biner.length);
  for (let i = 0; i < biner.length; i += 1) bytes[i] = biner.charCodeAt(i);
  return bytes;
}

let kunciCache: { rahasia: string; kunci: CryptoKey } | null = null;

async function kunciTandaTangan() {
  const rahasia = ambilRahasia();
  if (kunciCache && kunciCache.rahasia === rahasia) return kunciCache.kunci;

  const kunci = await crypto.subtle.importKey(
    "raw",
    encoder.encode(rahasia),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  kunciCache = { rahasia, kunci };
  return kunci;
}

async function tandaTangani(muatan: string) {
  const kunci = await kunciTandaTangan();
  const tanda = await crypto.subtle.sign("HMAC", kunci, encoder.encode(muatan));
  return keBase64Url(new Uint8Array(tanda));
}

/** Perbandingan waktu tetap agar tanda tangan tidak dapat ditebak bertahap. */
function samaWaktuTetap(a: string, b: string) {
  if (a.length !== b.length) return false;
  let beda = 0;
  for (let i = 0; i < a.length; i += 1) beda |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return beda === 0;
}

/* -------------------------------- Token API ------------------------------- */

export type IsiSesi = Pick<Session, "role" | "nama" | "identitas">;

/** Menyusun token sesi bertanda tangan. */
export async function encodeSession(
  isi: IsiSesi,
  masaDetik = MASA_SESI_DETIK,
): Promise<string> {
  const sekarang = Math.floor(Date.now() / 1000);
  const sesi: Session = {
    role: isi.role,
    nama: isi.nama,
    identitas: isi.identitas,
    iat: sekarang,
    exp: sekarang + masaDetik,
  };

  const muatan = keBase64Url(encoder.encode(JSON.stringify(sesi)));
  return `${muatan}.${await tandaTangani(muatan)}`;
}

/**
 * Memverifikasi token sesi. Mengembalikan null bila tanda tangan tidak cocok,
 * token cacat, atau masa berlakunya sudah lewat.
 */
export async function decodeSession(
  value: string | undefined,
): Promise<Session | null> {
  if (!value) return null;

  const pemisah = value.lastIndexOf(".");
  if (pemisah <= 0) return null;

  const muatan = value.slice(0, pemisah);
  const tanda = value.slice(pemisah + 1);

  try {
    if (!samaWaktuTetap(tanda, await tandaTangani(muatan))) return null;

    const parsed = JSON.parse(decoder.decode(dariBase64Url(muatan))) as
      Partial<Session>;

    if (parsed.role !== "siswa" && parsed.role !== "admin") return null;
    if (!parsed.nama || !parsed.identitas) return null;
    if (typeof parsed.exp !== "number" || typeof parsed.iat !== "number") {
      return null;
    }
    if (parsed.exp * 1000 <= Date.now()) return null;

    return {
      role: parsed.role,
      nama: parsed.nama,
      identitas: parsed.identitas,
      iat: parsed.iat,
      exp: parsed.exp,
    };
  } catch (error) {
    if (error instanceof SesiTidakTerkonfigurasi) {
      console.error(error.message);
    }
    return null;
  }
}

/** Halaman dashboard sesuai peran. */
export function berandaPeran(role: Role) {
  return role === "siswa" ? "/siswa" : "/admin";
}
