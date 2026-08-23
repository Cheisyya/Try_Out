import {
  BookOpen,
  Brain,
  ClipboardCheck,
  ClipboardList,
  FolderOpen,
  GraduationCap,
  IdCard,
  Layers,
  LayoutDashboard,
  Library,
  Link2,
  Medal,
  Settings,
  Trophy,
  UserRound,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { PengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  keterangan: string;
  /**
   * Submenu. Item beranak tampil sebagai kelompok yang dapat dibuka-tutup, dan
   * `href` induknya tetap dapat diklik sebagai halaman ringkasan.
   */
  anak?: NavItem[];
};

/** Menu Data Diri Siswa — urutannya mengikuti berkas persyaratan panitia. */
const DATA_DIRI_SISWA: NavItem = {
  label: "Data Diri Siswa",
  href: "/siswa/data-diri",
  icon: IdCard,
  keterangan: "Biodata, nilai, dan berkas persyaratan",
  anak: [
    {
      label: "1. Biodata Siswa",
      href: "/siswa/data-diri/biodata",
      icon: UserRound,
      keterangan: "Data utama dan data pendukung",
    },
    {
      label: "2. Data Orang Tua/Wali",
      href: "/siswa/data-diri/orang-tua",
      icon: UsersRound,
      keterangan: "Identitas dan alamat keluarga",
    },
    {
      label: "3. Data Akademik",
      href: "/siswa/data-diri/akademik",
      icon: GraduationCap,
      keterangan: "Nilai pengetahuan semester 1–4",
    },
    {
      label: "4. Kelengkapan Dokumen",
      href: "/siswa/data-diri/dokumen",
      icon: FolderOpen,
      keterangan: "Unggah 14 berkas persyaratan",
    },
    {
      label: "5. Data Prestasi",
      href: "/siswa/data-diri/prestasi",
      icon: Medal,
      keterangan: "Maksimal 3 pencapaian tertinggi",
    },
    {
      label: "Link Google Drive",
      href: "/siswa/data-diri/link-drive",
      icon: Link2,
      keterangan: "Folder drive dari panitia untuk Anda",
    },
  ],
};

const MATERI_SISWA: NavItem = {
  label: "Materi Belajar",
  href: "/siswa/materi",
  icon: BookOpen,
  keterangan: "Bahan ajar per mata pelajaran",
};

const TES_IQ_SISWA: NavItem = {
  label: "Tes IQ (Latihan)",
  href: "/siswa/tes-iq",
  icon: Brain,
  keterangan: "Latihan penalaran, lengkap dengan pembahasan",
};

const PSIKOTES_SISWA: NavItem = {
  label: "Try Out Psikotes",
  href: "/siswa/psikotes",
  icon: ClipboardCheck,
  keterangan: "TIU, penalaran visual, EPPS, dan kepribadian",
};

/**
 * Menu peserta.
 *
 * Sebagian menu dapat dimatikan admin lewat halaman Pengaturan; menu yang
 * dimatikan tidak ikut dirender di sini, dan halamannya juga ditutup di server
 * (lihat `wajibFitur`).
 */
export function navSiswa(pengaturan: PengaturanAplikasi): NavItem[] {
  const menu: NavItem[] = [
    {
      label: "Dashboard",
      href: "/siswa",
      icon: LayoutDashboard,
      keterangan: "Ringkasan perkembangan belajar",
    },
  ];

  if (pengaturan.materiAktif) menu.push(MATERI_SISWA);

  if (pengaturan.tryoutAkademikAktif) {
    menu.push(
      {
        label: "Try Out Akademik",
        href: "/siswa/tryout",
        icon: ClipboardList,
        keterangan: "Paket simulasi yang tersedia",
      },
      {
        label: "Riwayat Hasil",
        href: "/siswa/hasil",
        icon: Trophy,
        keterangan: "Skor dan peringkat tiap try out",
      },
    );
  }

  if (pengaturan.tesIqAktif) menu.push(TES_IQ_SISWA);
  if (pengaturan.psikotesAktif) menu.push(PSIKOTES_SISWA);
  if (pengaturan.dataDiriAktif) menu.push(DATA_DIRI_SISWA);

  return menu;
}

/**
 * Menu admin.
 *
 * Pengelolaan peserta terbagi dua daftar (berjalan dan alumni) di bawah satu
 * kelompok, sementara seluruh pengelolaan try out (paket, sesi beserta
 * passwordnya, import soal, hasil) tetap berada pada satu halaman bertab.
 */
export const NAV_ADMIN: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    keterangan: "Ringkasan operasional try out",
  },
  {
    label: "Siswa",
    href: "/admin/siswa",
    icon: Users,
    keterangan: "Data, link drive, dan status kelulusan",
    anak: [
      {
        label: "Daftar Siswa",
        href: "/admin/siswa",
        icon: Users,
        keterangan: "Peserta yang masih dalam proses seleksi",
      },
      {
        label: "Alumni",
        href: "/admin/alumni",
        icon: GraduationCap,
        keterangan: "Peserta yang sudah lulus / tidak lulus",
      },
    ],
  },
  {
    label: "Materi",
    href: "/admin/materi",
    icon: Library,
    keterangan: "Bahan ajar per mata pelajaran",
  },
  {
    label: "Try Out Akademik",
    href: "/admin/tryout",
    icon: Layers,
    keterangan: "Paket, sesi, password, import soal, dan hasil",
  },
  {
    label: "Psikotes",
    href: "/admin/psikotes",
    icon: ClipboardCheck,
    keterangan: "Paket, sesi, import soal, dan hasil psikotes",
  },
  {
    label: "Tes IQ",
    href: "/admin/tes-iq",
    icon: Brain,
    keterangan: "Paket, import soal, dan hasil latihan penalaran",
  },
  {
    label: "Pengaturan",
    href: "/admin/pengaturan",
    icon: Settings,
    keterangan: "Sakelar fitur yang tampil di portal siswa",
  },
];
