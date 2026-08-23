import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LineChart,
} from "lucide-react";

import {
  Brand,
  LogoPenuh,
  NAMA_BIMBEL,
  TAGLINE_BIMBEL,
} from "@/components/layout/brand";
import { ButtonLink } from "@/components/ui/button";
import { getSession } from "@/lib/get-session";
import { berandaPeran } from "@/lib/session";

/**
 * Beranda publik.
 *
 * Halaman ini hanya bercerita tentang kegiatan belajar; tidak ada tautan yang
 * menyebut panel pengelola. Tombol "Masuk" mengarah ke satu halaman `/masuk`
 * yang sama untuk semua orang, dan server-lah yang mengantar tiap akun ke
 * dashboard miliknya.
 */

const layanan = [
  {
    icon: BookOpen,
    judul: "Materi Belajar",
    teks: "Pendampingan mata pelajaran SMP bersama pengajar Smart Home Center, disusun mengikuti kebutuhan tiap siswa.",
  },
  {
    icon: ClipboardCheck,
    judul: "Latihan & Try Out",
    teks: "Simulasi ujian berbasis komputer dengan timer, penilaian otomatis, dan pengawasan selama sesi berlangsung.",
  },
  {
    icon: LineChart,
    judul: "Pemantauan Hasil",
    teks: "Nilai setiap sesi tersimpan rapi sehingga perkembangan belajar terlihat dari waktu ke waktu.",
  },
  {
    icon: GraduationCap,
    judul: "Persiapan Seleksi",
    teks: "Pendalaman khusus untuk seleksi masuk sekolah unggulan, termasuk SMA Taruna Nusantara.",
  },
];

const langkah = [
  {
    judul: "Masuk dengan username",
    teks: "Gunakan username dan kata sandi yang diberikan pengajar Smart Home Center.",
  },
  {
    judul: "Buka kelas atau latihan",
    teks: "Dari dashboard, pilih kegiatan yang sedang dibuka pengajar untukmu.",
  },
  {
    judul: "Kerjakan sesuai jadwal",
    teks: "Setiap latihan punya jadwal buka dan tutup. Kerjakan selama jadwalnya masih berjalan.",
  },
  {
    judul: "Pantau perkembanganmu",
    teks: "Nilai dan riwayat pengerjaan langsung tampil pada menu Riwayat Hasil.",
  },
];

export default async function BerandaPage() {
  const session = await getSession();
  // Sudah masuk? Tombolnya langsung membuka dashboard peran yang bersangkutan.
  const tautanMasuk = session ? berandaPeran(session.role) : "/masuk";
  const sudahMasuk = Boolean(session);

  return (
    <div className="min-h-dvh bg-white">
      {/* ------------------------------- Navbar ------------------------------ */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Brand />
          <nav className="hidden items-center gap-7 text-sm font-medium text-navy-700 md:flex">
            <a className="transition hover:text-navy-900" href="#layanan">
              Layanan
            </a>
            <a className="transition hover:text-navy-900" href="#langkah">
              Cara Belajar
            </a>
          </nav>
          <ButtonLink href={tautanMasuk} size="sm">
            {sudahMasuk ? "Buka Dashboard" : "Masuk"}
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </header>

      {/* -------------------------------- Hero ------------------------------- */}
      <section className="border-b border-line bg-navy-50/50">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700">
              <GraduationCap className="size-3.5" />
              {TAGLINE_BIMBEL}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-navy-900 sm:text-4xl">
              Ruang belajar digital{" "}
              <span className="text-langit-600">{NAMA_BIMBEL}</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Satu tempat untuk seluruh kegiatan belajarmu bersama{" "}
              {NAMA_BIMBEL}: materi, latihan, simulasi ujian, dan catatan
              perkembangan — semuanya dapat diakses kapan saja.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={tautanMasuk} size="lg">
                {sudahMasuk ? "Lanjutkan belajar" : "Masuk ke akun saya"}
                <ArrowRight className="size-4.5" />
              </ButtonLink>
              <ButtonLink href="#layanan" variant="outline" size="lg">
                Lihat layanan kami
              </ButtonLink>
            </div>

            <p className="mt-5 text-sm text-muted">
              Belum punya akun? Hubungi pengajar {NAMA_BIMBEL} untuk mendapatkan
              username dan password.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="kartu w-full max-w-sm p-8 text-center shadow-[var(--shadow-soft)]">
              <LogoPenuh className="mx-auto w-56" />
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Bimbingan belajar untuk siswa SMP di Mojokerto dan sekitarnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- Layanan ----------------------------- */}
      <section id="layanan" className="container-page scroll-mt-20 py-16">
        <h2 className="text-2xl font-bold tracking-tight text-navy-900">
          Yang kamu dapatkan di sini
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Kegiatan belajar dan penilaian berjalan di satu tempat, jadi kamu tidak
          perlu berpindah-pindah aplikasi.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {layanan.map((item) => (
            <div key={item.judul} className="kartu p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-langit-50 text-langit-600">
                <item.icon className="size-5" strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-navy-900">
                {item.judul}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {item.teks}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------- Langkah ----------------------------- */}
      <section
        id="langkah"
        className="scroll-mt-20 border-y border-line bg-navy-50/50 py-16"
      >
        <div className="container-page">
          <h2 className="text-2xl font-bold tracking-tight text-navy-900">
            Cara belajar di Smart Home Center
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {langkah.map((item, index) => (
              <li key={item.judul} className="kartu p-5">
                <span className="grid size-8 place-items-center rounded-lg bg-navy-900 text-sm font-bold text-gold-300">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-navy-900">
                  {item.judul}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.teks}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------- Penutup ----------------------------- */}
      <section className="container-page py-16">
        <div className="kartu bg-navy-900 px-6 py-10 text-center sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Siap melanjutkan belajarmu?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-langit-100">
            Masuk dengan username, lalu buka kegiatan yang sedang dijadwalkan
            pengajarmu.
          </p>
          <div className="mt-7">
            <ButtonLink href={tautanMasuk} variant="gold" size="lg">
              {sudahMasuk ? "Buka Dashboard" : "Masuk ke akun saya"}
              <ArrowRight className="size-4.5" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ------------------------------- Footer ------------------------------ */}
      <footer className="border-t border-line bg-white">
        <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {NAMA_BIMBEL} · {TAGLINE_BIMBEL}
          </p>
        </div>
      </footer>
    </div>
  );
}
