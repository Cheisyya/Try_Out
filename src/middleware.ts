import { NextResponse, type NextRequest } from "next/server";

import { berandaPeran, decodeSession, SESSION_COOKIE } from "@/lib/session";

/**
 * Menjaga area dashboard: pengunjung tanpa sesi diarahkan ke halaman masuk,
 * dan peran yang keliru diarahkan ke dashboard miliknya sendiri.
 *
 * Token sesi diverifikasi tanda tangannya di sini, sehingga cookie yang disusun
 * sendiri oleh pengunjung tidak dapat membuka area admin. Lapisan ini diulang
 * pada tiap halaman/aksi lewat `wajibSesi` (defense in depth).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const areaSiswa =
    pathname === "/siswa" ||
    pathname.startsWith("/siswa/") ||
    pathname === "/ujian" ||
    pathname.startsWith("/ujian/");
  const areaAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!areaSiswa && !areaAdmin) return NextResponse.next();

  const session = await decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    // Satu halaman masuk melayani kedua peran; tujuannya ditentukan setelah
    // kredensial terbukti, bukan dari alamat yang tadi dibuka.
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    url.search = "?alasan=perlu-masuk";
    const jawaban = NextResponse.redirect(url);
    // Cookie kedaluwarsa atau tidak sah dibersihkan agar tidak terus terkirim.
    jawaban.cookies.delete(SESSION_COOKIE);
    return jawaban;
  }

  const peranDibutuhkan = areaSiswa ? "siswa" : "admin";
  if (session.role !== peranDibutuhkan) {
    const url = request.nextUrl.clone();
    url.pathname = berandaPeran(session.role);
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Halaman ujian tidak boleh tersimpan di cache browser/proxy.
  const jawaban = NextResponse.next();
  if (pathname.startsWith("/ujian")) {
    jawaban.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }
  return jawaban;
}

export const config = {
  matcher: ["/siswa/:path*", "/admin/:path*", "/ujian/:path*"],
};
