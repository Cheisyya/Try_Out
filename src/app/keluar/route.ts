import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/session";

/**
 * Keluar dari sesi.
 *
 * Ditulis sebagai route handler, bukan Server Action, karena `cookies()` di
 * dalam Server Action tanpa argumen yang dipanggil lewat `<form action={...}>`
 * kehilangan konteks permintaan pada dev server Next 15.1 dan menghasilkan
 * error 500. Route handler menghapus cookie langsung pada respons, sehingga
 * berperilaku sama di pengembangan maupun produksi — dan tetap bekerja
 * walaupun JavaScript gagal dimuat, karena form dikirim secara native.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function keluar(request: Request) {
  // Penjaga lintas situs: permintaan dari origin lain tidak boleh memaksa
  // peserta keluar di tengah ujian.
  const asal = request.headers.get("origin");
  if (asal) {
    const host = request.headers.get("host");
    try {
      if (new URL(asal).host !== host) {
        return new NextResponse("Permintaan lintas situs ditolak", { status: 403 });
      }
    } catch {
      return new NextResponse("Origin tidak sah", { status: 400 });
    }
  }

  // 303 agar peramban beralih ke GET setelah POST.
  const jawaban = NextResponse.redirect(new URL("/", request.url), 303);
  jawaban.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return jawaban;
}

export async function POST(request: Request) {
  return keluar(request);
}
