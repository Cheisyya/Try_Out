import type { NextConfig } from "next";

const produksi = process.env.NODE_ENV === "production";

/**
 * Content Security Policy.
 *
 * `script-src` masih memuat `'unsafe-inline'` karena Next menyisipkan skrip
 * bootstrap dan muatan RSC secara inline; menghapusnya menuntut nonce per
 * permintaan yang membuat seluruh halaman menjadi dinamis. Sisanya dikunci
 * rapat, sehingga arah yang paling berbahaya tetap tertutup:
 *
 * - `default-src 'self'`   — tidak ada sumber daya dari domain lain;
 * - `connect-src 'self'`   — data tidak dapat dikirim ke server pihak ketiga;
 * - `form-action 'self'`   — formulir tidak dapat dibajak ke alamat lain;
 * - `frame-ancestors 'none'` — halaman tidak dapat disematkan situs lain
 *   (penting bagi pengawasan ujian);
 * - `object-src 'none'`, `base-uri 'self'` — menutup penyisipan plugin dan
 *   pembelokan URL relatif.
 *
 * `frame-src 'self'` diperlukan pembaca materi, yang menyematkan PDF dari
 * origin yang sama.
 */
function bangunCsp(frameAncestors: string) {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
    ...(produksi ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

const csp = bangunCsp("'none'");

/** Materi disematkan pada halaman pembacanya sendiri, jadi ia perlu 'self'. */
const cspTersemat = bangunCsp("'self'");

/**
 * Header keamanan dasar untuk seluruh route.
 *
 * `X-Frame-Options: DENY` juga menutup celah pengawasan ujian: halaman ujian
 * tidak dapat disematkan pada situs lain untuk menghindari pemantauan
 * fullscreen/visibility. `fullscreen=(self)` tetap mengizinkan mode layar
 * penuh yang dipakai ruang ujian.
 */
const headerKeamanan = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), fullscreen=(self)",
  },
  // Hanya bermakna di atas HTTPS; Vercel selalu HTTPS.
  ...(produksi
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

/** Halaman berisi data pribadi tidak boleh masuk indeks mesin pencari. */
const headerPrivat = [
  ...headerKeamanan,
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

const nextConfig: NextConfig = {
  // Folder keluaran build dapat dipindah lewat NEXT_DIST_DIR supaya build
  // produksi tidak menimpa cache dev server yang sedang berjalan.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  // Versi framework tidak perlu diumumkan kepada pemindai otomatis.
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Unggahan berkas pendaftaran casis dikirim lewat Server Action.
      //
      // Angkanya sengaja disamakan dengan batas keras Vercel untuk badan
      // permintaan Serverless Function, yaitu 4,5 MB. Menyetelnya lebih tinggi
      // tidak menambah apa pun — Vercel menolak lebih dahulu — tetapi membuat
      // masalahnya baru ketahuan setelah deploy. Dengan angka ini, berkas yang
      // terlalu besar sudah tertolak sejak pengembangan lokal.
      //
      // Karena itu pula batas dokumen terbesar (rapor) ditetapkan 4 MB pada
      // src/lib/pendaftaran/dokumen.ts, menyisakan ruang untuk overhead
      // multipart. Batas per jenis dokumen tetap ditegakkan di server.
      bodySizeLimit: "4.5mb",
    },
  },
  // Pustaka parsing berkas dipakai apa adanya oleh Node, tidak ikut dibundel
  // webpack (pdfjs-dist gagal bila dibundel). Driver `pg` juga: ia memuat
  // modul native secara opsional saat dijalankan.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "exceljs", "pg"],
  // Berkas bank soal dibaca saat runtime, jadi harus ikut disertakan ke bundel server.
  outputFileTracingIncludes: {
    "/**": ["./src/data/**"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: headerKeamanan },
      { source: "/admin/:path*", headers: headerPrivat },
      { source: "/siswa/:path*", headers: headerPrivat },
      { source: "/masuk/:path*", headers: headerPrivat },
      {
        // Berkas materi disematkan pada halaman pembacanya yang berasal dari
        // origin yang sama. `DENY` menolak penyematan itu juga — jadi khusus
        // alamat ini penyematan dibatasi ke origin sendiri, bukan dilarang
        // seluruhnya. Situs lain tetap tidak dapat membingkainya.
        source: "/siswa/materi/:id/lihat",
        headers: [
          ...headerPrivat.filter(
            (item) =>
              item.key !== "X-Frame-Options" &&
              item.key !== "Content-Security-Policy",
          ),
          { key: "Content-Security-Policy", value: cspTersemat },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // Naskah soal dan jawaban tidak boleh mengendap di cache peramban.
        source: "/ujian/:path*",
        headers: [
          ...headerPrivat,
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
