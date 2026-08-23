"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { JenisPelanggaran } from "@/lib/pengerjaan/tipe";

/**
 * Pengawasan ujian sisi peramban.
 *
 * Prinsip yang dipegang di sini:
 * - Pengawasan ini adalah *pencegah*, bukan pengaman. Seluruh keputusan yang
 *   menentukan nilai tetap berada di server; melumpuhkan JavaScript hanya
 *   membuat pelanggaran tidak tercatat, tidak memberi keuntungan nilai.
 * - Peserta tidak boleh terjebak. Pintasan yang diblokir dipilih seperlunya,
 *   navigasi papan tik (Tab, panah, Enter) tetap berfungsi, muat ulang halaman
 *   tetap diizinkan, dan setiap peringatan selalu punya jalan keluar.
 * - Setiap kejadian dicatat di server melalui `/api/ujian/pelanggaran`.
 */

/** Jeda minimal antar pengiriman jenis yang sama (server menerapkan hal serupa). */
const JEDA_KIRIM_MS = 3000;

/** Lama peringatan sekilas ditampilkan. */
const DURASI_PERINGATAN_MS = 6000;

/**
 * Lama tirai hitam bertahan setelah tombol tangkapan layar ditekan.
 *
 * Peramban tidak dapat mencegah tangkapan layar tingkat sistem — yang dapat
 * dilakukan halaman adalah menutup naskah soal secepat mungkin begitu ada
 * tanda-tandanya, sehingga gambar yang tertangkap berisi layar hitam.
 */
const DURASI_TIRAI_MS = 2500;

type DokumenFullscreen = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenEnabled?: boolean;
};

type ElemenFullscreen = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function elemenFullscreenAktif() {
  if (typeof document === "undefined") return null;
  const dok = document as DokumenFullscreen;
  return document.fullscreenElement ?? dok.webkitFullscreenElement ?? null;
}

function fullscreenDidukung() {
  if (typeof document === "undefined") return false;
  const dok = document as DokumenFullscreen;
  return Boolean(dok.fullscreenEnabled ?? dok.webkitFullscreenEnabled);
}

/** Pintasan yang lazim dipakai untuk menyalin soal atau membuka alat pengembang. */
function pintasanTerlarang(event: KeyboardEvent): string | null {
  const tombol = event.key.toLowerCase();

  if (event.key === "F12") return "F12";
  if (event.key === "PrintScreen") return "PrintScreen";

  if (event.ctrlKey || event.metaKey) {
    if (event.shiftKey && ["i", "j", "c", "k"].includes(tombol)) {
      return `Ctrl+Shift+${tombol.toUpperCase()}`;
    }
    // Salin, potong, tempel, pilih semua, simpan, cetak, lihat sumber, cari.
    if (["c", "x", "v", "a", "s", "p", "u", "f"].includes(tombol)) {
      return `Ctrl+${tombol.toUpperCase()}`;
    }
  }

  return null;
}

export type StatusPengawas = {
  jumlahPelanggaran: number;
  didukung: boolean;
  layarPenuh: boolean;
  /** true bila naskah soal harus ditutup sampai peserta kembali layar penuh. */
  ajakanLayarPenuh: boolean;
  /**
   * true selama peserta belum boleh keluar dari layar penuh, yaitu selama mata
   * uji belum dikumpulkan. Dipakai lapisan untuk memilih kalimatnya.
   */
  terkunci: boolean;
  /** true bila peserta sempat masuk layar penuh lalu keluar lagi. */
  pernahKeluar: boolean;
  /** true bila naskah soal harus ditutup karena peserta meninggalkan halaman. */
  blokirKembali: boolean;
  /** Berapa kali peserta meninggalkan halaman ujian pada sesi ini. */
  jumlahTinggalkan: number;
  bukaBlokir: () => void;
  /** true bila naskah soal sedang ditutup tirai hitam anti tangkapan layar. */
  tiraiLayar: boolean;
  /** Peringatan sekilas, mis. setelah kembali dari tab lain. */
  peringatan: string | null;
  mintaLayarPenuh: () => void;
  tutupPeringatan: () => void;
  /** Dipanggil sebelum navigasi yang disengaja (mis. mengumpulkan jawaban). */
  izinkanKeluar: () => void;
};

export function usePengawasUjian({
  aktif,
  jumlahAwal,
  bolehKeluarLayarPenuh,
}: {
  /** Pengawasan hanya berjalan selama sesi masih dapat dikerjakan. */
  aktif: boolean;
  jumlahAwal: number;
  /**
   * true bila peserta dibebaskan keluar dari layar penuh. Ruang ujian selalu
   * mengirim false: keluar dari layar penuh langsung menutup naskah soal sampai
   * peserta kembali, dan kuncinya baru dilepas lewat `izinkanKeluar()` saat
   * jawaban dikumpulkan.
   */
  bolehKeluarLayarPenuh: boolean;
}): StatusPengawas {
  const [jumlahPelanggaran, setJumlah] = useState(jumlahAwal);
  const [didukung, setDidukung] = useState(false);
  const [layarPenuh, setLayarPenuh] = useState(false);
  const [ajakanLayarPenuh, setAjakan] = useState(false);
  const [pernahKeluar, setPernahKeluar] = useState(false);
  const [peringatan, setPeringatan] = useState<string | null>(null);
  const [blokirKembali, setBlokir] = useState(false);
  const [jumlahTinggalkan, setJumlahTinggalkan] = useState(0);
  const [tirai, setTirai] = useState(false);

  // Listener layar penuh dipasang sekali; ref ini menjaga nilainya tetap segar
  // tanpa memasang ulang pendengar setiap satu soal dijawab.
  const bolehKeluarRef = useRef(bolehKeluarLayarPenuh);
  bolehKeluarRef.current = bolehKeluarLayarPenuh;

  const terakhirKirim = useRef<Partial<Record<JenisPelanggaran, number>>>({});
  const bolehKeluar = useRef(false);
  const pernahLayarPenuh = useRef(false);
  // Peramban menolak permintaan layar penuh tanpa interaksi pengguna; penanda
  // ini mencegah percobaan berulang yang pasti gagal.
  const fullscreenDitolak = useRef(false);
  const pewaktuPeringatan = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pewaktuTirai = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tampilkanPeringatan = useCallback((pesan: string) => {
    setPeringatan(pesan);
    if (pewaktuPeringatan.current) clearTimeout(pewaktuPeringatan.current);
    pewaktuPeringatan.current = setTimeout(
      () => setPeringatan(null),
      DURASI_PERINGATAN_MS,
    );
  }, []);

  /** Mengirim catatan pelanggaran ke server; kegagalan jaringan diabaikan. */
  const catat = useCallback(
    (jenis: JenisPelanggaran, detail?: string) => {
      const sekarang = Date.now();
      const terakhir = terakhirKirim.current[jenis] ?? 0;
      if (sekarang - terakhir < JEDA_KIRIM_MS) return;
      terakhirKirim.current[jenis] = sekarang;

      setJumlah((nilai) => nilai + 1);

      void fetch("/api/ujian/pelanggaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenis, detail }),
        keepalive: true,
      })
        .then((jawaban) => (jawaban.ok ? jawaban.json() : null))
        .then((hasil: { jumlah?: number } | null) => {
          // Angka dari server adalah yang sahih.
          if (typeof hasil?.jumlah === "number" && hasil.jumlah > 0) {
            setJumlah(hasil.jumlah);
          }
        })
        .catch(() => {
          /* pengawasan tidak boleh mengganggu pengerjaan */
        });
    },
    [],
  );

  /* ------------------------------ Layar penuh ----------------------------- */

  useEffect(() => {
    if (!aktif) return;
    const dukung = fullscreenDidukung();
    setDidukung(dukung);
    const sedang = Boolean(elemenFullscreenAktif());
    setLayarPenuh(sedang);
    if (dukung && !sedang) setAjakan(true);
  }, [aktif]);

  /**
   * Masuk layar penuh pada interaksi pertama.
   *
   * Peramban menolak `requestFullscreen()` tanpa gestur pengguna, dan gestur
   * dari halaman instruksi tidak terbawa melewati navigasi. Jadi begitu peserta
   * menyentuh apa pun di ruang ujian, layar penuh langsung diminta tanpa ia
   * perlu menekan tombol khusus.
   */
  useEffect(() => {
    if (!aktif) return;
    if (!fullscreenDidukung()) return;

    const coba = () => {
      if (elemenFullscreenAktif() || fullscreenDitolak.current) return;
      const target = document.documentElement as ElemenFullscreen;
      const minta = target.requestFullscreen ?? target.webkitRequestFullscreen;
      if (!minta) return;
      try {
        const hasil = minta.call(target);
        if (hasil && typeof hasil.catch === "function") hasil.catch(() => {});
      } catch {
        /* diabaikan: lapisan ajakan tetap tersedia */
      }
    };

    document.addEventListener("pointerdown", coba);
    document.addEventListener("keydown", coba);
    return () => {
      document.removeEventListener("pointerdown", coba);
      document.removeEventListener("keydown", coba);
    };
  }, [aktif]);

  const mintaLayarPenuh = useCallback(() => {
    const target = document.documentElement as ElemenFullscreen;
    const minta = target.requestFullscreen ?? target.webkitRequestFullscreen;
    setAjakan(false);

    if (!minta) {
      // Peramban tanpa API layar penuh sama sekali: ujian tetap harus dapat
      // dikerjakan, jadi lapisan tidak boleh mengunci selamanya.
      fullscreenDitolak.current = true;
      setAjakan(false);
      tampilkanPeringatan(
        "Peramban ini tidak mendukung mode layar penuh. Ujian tetap dapat dilanjutkan dan tercatat pengawas.",
      );
      return;
    }

    try {
      const hasil = minta.call(target);
      if (hasil && typeof hasil.catch === "function") {
        hasil.catch(() => {
          // Peramban menolak permintaannya. Peserta tidak boleh terkunci dari
          // naskah soal karena sebab di luar kendalinya, jadi lapisan dibuka
          // dan kejadiannya dicatat untuk pengawas.
          fullscreenDitolak.current = true;
          setAjakan(false);
          catat("keluar-fullscreen", "peramban menolak mode layar penuh");
          tampilkanPeringatan(
            "Mode layar penuh ditolak peramban. Ujian tetap dapat dilanjutkan dan kejadian ini tercatat pengawas.",
          );
        });
      }
    } catch {
      fullscreenDitolak.current = true;
    }
  }, [catat, tampilkanPeringatan]);

  useEffect(() => {
    if (!aktif) return;

    const berubah = () => {
      const sedang = Boolean(elemenFullscreenAktif());
      setLayarPenuh(sedang);

      if (sedang) {
        pernahLayarPenuh.current = true;
        fullscreenDitolak.current = false;
        setAjakan(false);
        return;
      }

      // Pengumpulan yang disengaja keluar lewat `izinkanKeluar`, jadi sampai di
      // sini berarti peserta benar-benar keluar sendiri.
      if (bolehKeluar.current) return;

      // Selama mata uji belum dikumpulkan, keluar dari layar penuh menutup
      // naskah soal sampai peserta kembali. Peramban tidak menyediakan cara
      // mencegah tombol Esc — yang dapat dilakukan halaman adalah membuat
      // keluar itu tidak berguna.
      if (!bolehKeluarRef.current && !fullscreenDitolak.current) {
        catat("keluar-fullscreen");
        setPernahKeluar(true);
        setAjakan(true);
        return;
      }

      // Kunci sudah dilepas: keluar tidak lagi ditahan, hanya dicatat.
      if (pernahLayarPenuh.current) {
        catat("keluar-fullscreen");
        setPernahKeluar(true);
      }
    };

    document.addEventListener("fullscreenchange", berubah);
    document.addEventListener("webkitfullscreenchange", berubah);
    return () => {
      document.removeEventListener("fullscreenchange", berubah);
      document.removeEventListener("webkitfullscreenchange", berubah);
    };
  }, [aktif, catat]);

  /* --------------------- Perpindahan tab & jendela lain -------------------- */

  useEffect(() => {
    if (!aktif) return;

    // Ditandai saat peserta pergi, dibaca saat ia kembali.
    let sempatPergi = false;

    const padaVisibilitas = () => {
      if (document.hidden) {
        sempatPergi = true;
        setJumlahTinggalkan((n) => n + 1);
        catat("halaman-tersembunyi");
      } else if (sempatPergi) {
        sempatPergi = false;
        // Naskah soal ditutup sampai peserta mengakui kejadiannya.
        setBlokir(true);
      }
    };

    let pewaktuBlur: ReturnType<typeof setTimeout> | null = null;
    const padaBlur = () => {
      // Ditunda sesaat: bila halaman menjadi tersembunyi, cukup satu catatan.
      pewaktuBlur = setTimeout(() => {
        if (!document.hidden) {
          sempatPergi = true;
          setJumlahTinggalkan((n) => n + 1);
          catat("pindah-tab");
        }
      }, 400);
    };
    const padaFokus = () => {
      if (pewaktuBlur) clearTimeout(pewaktuBlur);
      if (sempatPergi && !document.hidden) {
        sempatPergi = false;
        setBlokir(true);
      }
    };

    document.addEventListener("visibilitychange", padaVisibilitas);
    window.addEventListener("blur", padaBlur);
    window.addEventListener("focus", padaFokus);
    return () => {
      if (pewaktuBlur) clearTimeout(pewaktuBlur);
      document.removeEventListener("visibilitychange", padaVisibilitas);
      window.removeEventListener("blur", padaBlur);
      window.removeEventListener("focus", padaFokus);
    };
  }, [aktif, catat]);

  /* ---------------------- Tirai anti tangkapan layar ----------------------- */

  /**
   * Menutup naskah soal dengan layar hitam.
   *
   * Dipasang pada dua tanda: tombol tangkapan layar ditekan (PrintScreen, atau
   * Win/Ctrl+Shift+S milik alat pemotong Windows), dan halaman kehilangan fokus
   * — alat pemotong selalu mengambil fokus lebih dulu, jadi tirainya sudah
   * turun sebelum area soal sempat dipilih. Ini pencegah, bukan pengaman:
   * kamera ponsel tetap dapat memotret layar, dan pelanggarannya tercatat.
   */
  useEffect(() => {
    if (!aktif) {
      setTirai(false);
      return;
    }

    const tutup = (sementara: boolean) => {
      setTirai(true);
      if (pewaktuTirai.current) clearTimeout(pewaktuTirai.current);
      if (sementara) {
        pewaktuTirai.current = setTimeout(() => setTirai(false), DURASI_TIRAI_MS);
      }
    };

    const buka = () => {
      if (pewaktuTirai.current) clearTimeout(pewaktuTirai.current);
      setTirai(false);
    };

    const padaTombol = (event: KeyboardEvent) => {
      const tombol = event.key.toLowerCase();
      const potongLayar =
        event.key === "PrintScreen" ||
        (tombol === "s" && event.shiftKey && (event.metaKey || event.ctrlKey));
      if (potongLayar) tutup(true);
    };

    const padaBlur = () => tutup(false);
    const padaFokus = () => buka();
    const padaVisibilitas = () => (document.hidden ? tutup(false) : buka());

    // Fase tangkap dipakai supaya tirai turun sebelum pendengar lain sempat
    // membatalkan kejadiannya.
    document.addEventListener("keydown", padaTombol, true);
    document.addEventListener("keyup", padaTombol, true);
    window.addEventListener("blur", padaBlur);
    window.addEventListener("focus", padaFokus);
    document.addEventListener("visibilitychange", padaVisibilitas);

    return () => {
      if (pewaktuTirai.current) clearTimeout(pewaktuTirai.current);
      document.removeEventListener("keydown", padaTombol, true);
      document.removeEventListener("keyup", padaTombol, true);
      window.removeEventListener("blur", padaBlur);
      window.removeEventListener("focus", padaFokus);
      document.removeEventListener("visibilitychange", padaVisibilitas);
    };
  }, [aktif]);

  /* ------------------- Salin, tempel, klik kanan, pintasan ------------------ */

  useDeteksiSalin({ aktif, catat, tampilkanPeringatan });

  /* ------------------------ Meninggalkan halaman ujian --------------------- */

  useEffect(() => {
    if (!aktif) return;

    const sebelumTutup = (event: BeforeUnloadEvent) => {
      if (bolehKeluar.current) return;
      catat("meninggalkan-halaman");
      event.preventDefault();
      // Peramban lama masih membaca returnValue.
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", sebelumTutup);
    return () => window.removeEventListener("beforeunload", sebelumTutup);
  }, [aktif, catat]);

  useEffect(() => {
    return () => {
      if (pewaktuPeringatan.current) clearTimeout(pewaktuPeringatan.current);
    };
  }, []);

  const izinkanKeluar = useCallback(() => {
    bolehKeluar.current = true;
    const dok = document as DokumenFullscreen;
    if (elemenFullscreenAktif()) {
      try {
        void (document.exitFullscreen?.() ?? dok.webkitExitFullscreen?.());
      } catch {
        /* diabaikan */
      }
    }
  }, []);

  return {
    jumlahPelanggaran,
    didukung,
    layarPenuh,
    ajakanLayarPenuh: aktif && didukung && ajakanLayarPenuh,
    terkunci: !bolehKeluarLayarPenuh,
    pernahKeluar,
    blokirKembali: aktif && blokirKembali,
    jumlahTinggalkan,
    bukaBlokir: () => setBlokir(false),
    tiraiLayar: aktif && tirai,
    peringatan,
    mintaLayarPenuh,
    tutupPeringatan: () => setPeringatan(null),
    izinkanKeluar,
  };
}

/** Pemblokiran salin/tempel/potong/klik kanan dan pintasan papan tik. */
function useDeteksiSalin({
  aktif,
  catat,
  tampilkanPeringatan,
}: {
  aktif: boolean;
  catat: (jenis: JenisPelanggaran, detail?: string) => void;
  tampilkanPeringatan: (pesan: string) => void;
}) {
  useEffect(() => {
    if (!aktif) return;

    const tolak =
      (jenis: JenisPelanggaran, pesan: string) => (event: Event) => {
        event.preventDefault();
        catat(jenis);
        tampilkanPeringatan(pesan);
      };

    const padaSalin = tolak(
      "salin",
      "Menyalin naskah soal tidak diizinkan selama ujian berlangsung.",
    );
    const padaPotong = tolak(
      "potong",
      "Memotong naskah soal tidak diizinkan selama ujian berlangsung.",
    );
    const padaTempel = tolak(
      "tempel",
      "Menempel teks tidak diizinkan selama ujian berlangsung.",
    );
    const padaKlikKanan = tolak(
      "klik-kanan",
      "Menu klik kanan dinonaktifkan selama ujian berlangsung.",
    );

    const padaTombol = (event: KeyboardEvent) => {
      const pintasan = pintasanTerlarang(event);
      if (!pintasan) return;

      // PrintScreen tidak dapat dicegah peramban; cukup dicatat.
      if (event.key !== "PrintScreen") event.preventDefault();

      catat("pintasan-terlarang", pintasan);
      tampilkanPeringatan(
        `Pintasan ${pintasan} dinonaktifkan selama ujian berlangsung.`,
      );
    };

    document.addEventListener("copy", padaSalin);
    document.addEventListener("cut", padaPotong);
    document.addEventListener("paste", padaTempel);
    document.addEventListener("contextmenu", padaKlikKanan);
    document.addEventListener("keydown", padaTombol);

    return () => {
      document.removeEventListener("copy", padaSalin);
      document.removeEventListener("cut", padaPotong);
      document.removeEventListener("paste", padaTempel);
      document.removeEventListener("contextmenu", padaKlikKanan);
      document.removeEventListener("keydown", padaTombol);
    };
  }, [aktif, catat, tampilkanPeringatan]);
}
