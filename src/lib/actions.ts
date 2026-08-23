"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { periksaKredensialAdmin } from "@/lib/admin/akun";
import { periksaPembatas, resetPembatas } from "@/lib/keamanan/pembatas";
import {
  berandaPeran,
  encodeSession,
  MASA_SESI_DETIK,
  SESSION_COOKIE,
  SesiTidakTerkonfigurasi,
  type Role,
} from "@/lib/session";
import { periksaKredensialSiswa } from "@/lib/siswa/repositori";

export type LoginState = { error?: string };

/**
 * Pesan tunggal untuk seluruh kegagalan kredensial.
 *
 * Karena satu halaman melayani dua peran, membedakan pesan ("email admin salah"
 * vs "username siswa salah") akan memberi tahu penebak bahwa sebuah identitas
 * memang ada. Pesannya sengaja dibuat sama.
 */
const PESAN_KREDENSIAL =
  "Username/email atau kata sandi tidak sesuai. Periksa kembali data Anda.";

/**
 * Masuk lewat satu formulir untuk admin maupun siswa.
 *
 * Peran tidak pernah dikirim dari peramban — ia disimpulkan di server dari
 * kredensial yang cocok, lalu ditulis ke dalam token sesi bertanda tangan.
 * Dengan begitu tidak ada cara menaikkan peran dari sisi klien, dan pengguna
 * cukup mengingat satu alamat masuk.
 */
export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const identitas = String(formData.get("identitas") ?? "").trim().slice(0, 120);
  const password = String(formData.get("password") ?? "").slice(0, 200);

  if (!identitas || !password) {
    return { error: "Mohon lengkapi seluruh isian terlebih dahulu." };
  }

  // Dua pembatas sekaligus: satu per identitas (menahan tebakan password pada
  // satu akun), satu per alamat asal (menahan penyisiran banyak akun dari satu
  // tempat). Keduanya harus lolos sebelum kredensial diperiksa.
  const kunciPembatas = `masuk:${identitas.toLowerCase()}`;
  const kunciAsal = `masuk-asal:${await alamatPemanggil()}`;

  for (const [kunci, opsi] of [
    [kunciPembatas, { maks: 8, jendelaDetik: 300 }],
    [kunciAsal, { maks: 30, jendelaDetik: 300 }],
  ] as const) {
    const batas = periksaPembatas(kunci, opsi);
    if (!batas.boleh) {
      return {
        error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${batas.sisaDetik} detik.`,
      };
    }
  }

  const akun = await kenaliAkun(identitas, password);
  if (!akun.ok) return { error: akun.error };

  resetPembatas(kunciPembatas);

  let token: string;
  try {
    token = await encodeSession(akun.sesi);
  } catch (error) {
    if (error instanceof SesiTidakTerkonfigurasi) {
      console.error(error.message);
      return {
        error:
          "Konfigurasi keamanan sesi belum lengkap pada server. Hubungi pengelola aplikasi.",
      };
    }
    throw error;
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MASA_SESI_DETIK,
  });

  // Dashboard ditentukan peran yang baru saja terbukti, bukan pilihan pengguna.
  redirect(berandaPeran(akun.sesi.role));
}

/**
 * Alamat asal permintaan untuk keperluan pembatas.
 *
 * Di belakang proxy Vercel, alamat sesungguhnya ada pada `x-forwarded-for`.
 * Nilainya berasal dari peramban dan dapat dipalsukan, jadi ia hanya dipakai
 * sebagai pembatas tambahan — bukan sebagai identitas.
 */
async function alamatPemanggil() {
  const daftar = await headers();
  const teruskan = daftar.get("x-forwarded-for");
  const alamat =
    teruskan?.split(",")[0]?.trim() || daftar.get("x-real-ip") || "tak-dikenal";
  return alamat.slice(0, 60);
}

type HasilKenali =
  | { ok: true; sesi: { role: Role; nama: string; identitas: string } }
  | { ok: false; error: string };

/**
 * Mencocokkan kredensial ke akun pengelola lebih dahulu, baru ke data siswa.
 *
 * Urutannya penting: bila sebuah email kebetulan terdaftar pada kedua sisi,
 * akun pengelola yang menang — bukan akun siswa yang dapat dibuat lewat panel.
 */
async function kenaliAkun(
  identitas: string,
  password: string,
): Promise<HasilKenali> {
  const admin = periksaKredensialAdmin(identitas, password);
  if (admin.ok) {
    return {
      ok: true,
      sesi: {
        role: "admin",
        nama: admin.akun.nama,
        identitas: admin.akun.identitas,
      },
    };
  }
  if (admin.alasan === "belum-dikonfigurasi") {
    console.error(
      "Akun administrator belum dikonfigurasi: ADMIN_EMAIL dan ADMIN_PASSWORD masih kosong.",
    );
  }

  const siswa = await periksaKredensialSiswa(identitas, password);
  if (siswa.ok) {
    return {
      ok: true,
      sesi: {
        role: "siswa",
        nama: siswa.siswa.nama,
        identitas: siswa.siswa.id,
      },
    };
  }

  // Akun nonaktif memang perlu dibedakan: peserta harus tahu bahwa kredensialnya
  // benar tetapi aksesnya sedang ditutup pengajar.
  if (siswa.alasan === "nonaktif") {
    return {
      ok: false,
      error:
        "Akun Anda berstatus nonaktif. Hubungi pengajar Smart Home Center.",
    };
  }

  return { ok: false, error: PESAN_KREDENSIAL };
}

/* Keluar dari sesi ditangani route handler `/keluar` (lihat berkas tersebut
   untuk alasannya), bukan Server Action. */
