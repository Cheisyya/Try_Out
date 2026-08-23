"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, LoaderCircle, LogOut, Menu, X } from "lucide-react";

import { Brand, NAMA_BIMBEL } from "@/components/layout/brand";
import { NAV_ADMIN, navSiswa, type NavItem } from "@/lib/navigasi";
import type { PengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";
import type { Role } from "@/lib/session";
import { cn } from "@/lib/utils";

/**
 * Kerangka dashboard bergaya LMS: sidebar terang, penanda halaman aktif yang
 * jelas, dan area isi yang lapang. Area peserta dan pengelola memakai kerangka
 * yang sama tetapi menu serta penandanya terpisah.
 */
export function DashboardShell({
  role,
  nama,
  identitas,
  pengaturan,
  children,
}: {
  role: Role;
  nama: string;
  identitas: string;
  /** Sakelar fitur; menentukan menu mana yang tampil bagi peserta. */
  pengaturan: PengaturanAplikasi;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  /**
   * Halaman yang sedang dituju setelah menu diklik.
   *
   * Perpindahan halaman App Router menunggu server selesai merender; tanpa
   * penanda ini, klik pada menu terasa seperti tidak terjadi apa-apa sampai
   * halaman baru muncul. Penanda dibersihkan begitu `pathname` berubah.
   */
  const [menuju, setMenuju] = useState<string | null>(null);

  const nav = useMemo(
    () => (role === "siswa" ? navSiswa(pengaturan) : NAV_ADMIN),
    [role, pengaturan],
  );
  const beranda = role === "siswa" ? "/siswa" : "/admin";

  // Tutup drawer dan hentikan penanda setiap kali halaman benar-benar berpindah.
  useEffect(() => {
    setMenuTerbuka(false);
    setMenuju(null);
  }, [pathname]);

  const inisial = nama
    .split(" ")
    .slice(0, 2)
    .map((kata) => kata[0])
    .join("")
    .toUpperCase();

  const daftarMenu = (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      {nav.map((item) =>
        item.anak?.length ? (
          <KelompokMenu
            key={item.href}
            item={item}
            pathname={pathname}
            menuju={menuju}
            onNavigasi={setMenuju}
          />
        ) : (
          <TautanMenu
            key={item.href}
            item={item}
            aktif={cocokJalur(pathname, item.href)}
            memuat={menuju === item.href}
            onNavigasi={setMenuju}
          />
        ),
      )}
    </nav>
  );

  const panelBawah = (
    <div className="border-t border-line p-3">
      <div className="flex items-center gap-3 px-2 py-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-gold-300">
          {inisial}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-semibold text-navy-900">
            {nama}
          </span>
          <span className="block truncate text-xs text-muted">{identitas}</span>
        </span>
      </div>
      <form action="/keluar" method="post" className="mt-1">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="size-4.5" strokeWidth={2} />
          Keluar
        </button>
      </form>
    </div>
  );

  const labelArea = role === "siswa" ? "Portal Siswa" : "Panel Pengelola";

  return (
    <div className="min-h-dvh lg:flex">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-line px-4">
          <Brand href={beranda} ringkas />
        </div>
        <p className="px-5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {labelArea}
        </p>
        {daftarMenu}
        {panelBawah}
      </aside>

      {/* Drawer mobile */}
      {menuTerbuka ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMenuTerbuka(false)}
            className="absolute inset-0 bg-navy-950/50"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Brand href={beranda} ringkas />
              <button
                type="button"
                onClick={() => setMenuTerbuka(false)}
                aria-label="Tutup menu"
                className="grid size-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="px-5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {labelArea}
            </p>
            {daftarMenu}
            {panelBawah}
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-dvh w-full min-w-0 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMenuTerbuka(true)}
            aria-label="Buka menu"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-navy-800 transition hover:bg-slate-50 lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-navy-900">
              {labelArea}
            </p>
            <p className="truncate text-xs text-muted">{NAMA_BIMBEL}</p>
          </div>

          <span className="hidden items-center gap-2.5 rounded-full border border-line py-1 pl-1 pr-3.5 sm:flex">
            <span className="grid size-7 place-items-center rounded-full bg-navy-900 text-[11px] font-bold text-gold-300">
              {inisial}
            </span>
            <span className="max-w-[12rem] truncate text-sm font-medium text-navy-800">
              {nama}
            </span>
          </span>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6">
            {children}
          </div>
        </main>

        <footer className="border-t border-line px-4 py-4 text-center text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} {NAMA_BIMBEL} · Bimbingan Belajar
          Terpercaya
        </footer>
      </div>
    </div>
  );
}

/* --------------------------------- Menu ---------------------------------- */

/** Halaman dianggap aktif termasuk seluruh halaman di bawahnya. */
function cocokJalur(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function TautanMenu({
  item,
  aktif,
  memuat = false,
  bertingkat = false,
  onNavigasi,
}: {
  item: NavItem;
  aktif: boolean;
  memuat?: boolean;
  /** Item submenu tampil menjorok dengan ikon lebih kecil. */
  bertingkat?: boolean;
  onNavigasi: (href: string) => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      // `prefetch` eksplisit: isi halaman berikutnya sudah diambil saat menu
      // terlihat, sehingga kliknya tidak lagi menunggu perjalanan ke server.
      prefetch
      aria-current={aktif ? "page" : undefined}
      title={item.keterangan}
      onClick={() => {
        if (!aktif) onNavigasi(item.href);
      }}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm transition",
        bertingkat ? "py-2.5 pl-3 pr-3" : "px-3 py-2.5",
        aktif
          ? "bg-langit-50 font-semibold text-navy-900"
          : "font-medium text-slate-600 hover:bg-slate-50 hover:text-navy-900",
      )}
    >
      {memuat ? (
        <LoaderCircle
          className={cn(
            "shrink-0 animate-spin text-langit-600",
            bertingkat ? "size-4" : "size-4.5",
          )}
        />
      ) : (
        <Icon
          className={cn(
            "shrink-0",
            bertingkat ? "size-4" : "size-4.5",
            aktif ? "text-langit-600" : "text-slate-400",
          )}
          strokeWidth={2}
        />
      )}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
    </Link>
  );
}

/**
 * Kelompok menu yang dapat dibuka-tutup.
 *
 * Kelompok terbuka otomatis ketika salah satu submenunya sedang dibuka, dan
 * tetap dapat dibuka manual oleh pengguna. Tombolnya memakai `aria-expanded`
 * dan `aria-controls` sehingga pembaca layar mengetahui isinya tersembunyi.
 */
function KelompokMenu({
  item,
  pathname,
  menuju,
  onNavigasi,
}: {
  item: NavItem;
  pathname: string;
  menuju: string | null;
  onNavigasi: (href: string) => void;
}) {
  const anak = item.anak ?? [];
  const adaAnakAktif = anak.some((sub) => cocokJalur(pathname, sub.href));
  const indukAktif = cocokJalur(pathname, item.href);

  const [terbuka, setTerbuka] = useState(indukAktif || adaAnakAktif);

  // Berpindah ke halaman di dalam kelompok ini otomatis membukanya kembali.
  useEffect(() => {
    if (indukAktif || adaAnakAktif) setTerbuka(true);
  }, [adaAnakAktif, indukAktif]);

  const Icon = item.icon;
  const idPanel = `menu-${item.href.replace(/\W+/g, "-")}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setTerbuka((sebelumnya) => !sebelumnya)}
        aria-expanded={terbuka}
        aria-controls={idPanel}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
          indukAktif || adaAnakAktif
            ? "font-semibold text-navy-900"
            : "font-medium text-slate-600 hover:bg-slate-50 hover:text-navy-900",
        )}
      >
        <Icon
          className={cn(
            "size-4.5 shrink-0",
            indukAktif || adaAnakAktif ? "text-langit-600" : "text-slate-400",
          )}
          strokeWidth={2}
        />
        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-slate-400 transition-transform duration-200",
            terbuka && "rotate-180",
          )}
        />
      </button>

      {terbuka ? (
        <div
          id={idPanel}
          className="ml-5 mt-0.5 space-y-0.5 border-l border-line pl-2"
        >
          {anak.map((sub) => (
            <TautanMenu
              key={sub.href}
              item={sub}
              bertingkat
              memuat={menuju === sub.href}
              onNavigasi={onNavigasi}
              aktif={
                // Induk dan anak pertama dapat berbagi href (mis. panel admin);
                // pencocokan persis menjaga hanya satu yang tersorot.
                sub.href === item.href
                  ? pathname === sub.href
                  : cocokJalur(pathname, sub.href)
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
