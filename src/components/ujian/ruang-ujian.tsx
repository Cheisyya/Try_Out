"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  AlarmClock,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LoaderCircle,
  Send,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AjakanLayarPenuh,
  BlokirKembali,
  LencanaPengawas,
  PeringatanPengawas,
  TiraiLayar,
} from "@/components/ujian/lapisan-pengawas";
import { usePengawasUjian } from "@/components/ujian/pengawas";
import { kumpulkanMataUji, simpanJawaban } from "@/lib/actions-sesi";
import { cn } from "@/lib/utils";

/** Didefinisikan lokal agar bank soal (beserta kuncinya) tidak ikut terbundel
 *  ke sisi klien. */
const HURUF_OPSI = ["A", "B", "C", "D"] as const;

export type SoalKlien = {
  id: string;
  nomor: number;
  pertanyaan: string;
  opsi: string[];
  gambar?: { src: string; alt: string; keterangan?: string };
  tabel?: { judul?: string; kolom: string[]; baris: string[][] };
};

type Props = {
  paketNama: string;
  sesiNama: string;
  mataUjiNama: string;
  mataUjiIndeks: number;
  totalMataUji: number;
  durasiMenit: number;
  soal: SoalKlien[];
  /** Jawaban yang sudah tersimpan di server, dipetakan dari id soal. */
  jawabanTersimpan: Record<string, string>;
  /** Sisa waktu mata uji ini menurut server, dalam detik. */
  sisaDetikAwal: number;
  /** Jumlah kejadian pengawasan yang sudah tercatat server pada sesi ini. */
  jumlahPelanggaran: number;
  pesanLanjut?: string;
  catatanBank?: string;
};

function formatWaktu(detik: number) {
  const aman = Math.max(0, detik);
  const jam = Math.floor(aman / 3600);
  const menit = Math.floor((aman % 3600) / 60);
  const sisa = aman % 60;
  const dua = (n: number) => String(n).padStart(2, "0");
  return jam > 0
    ? `${dua(jam)}:${dua(menit)}:${dua(sisa)}`
    : `${dua(menit)}:${dua(sisa)}`;
}

export function RuangUjian({
  paketNama,
  sesiNama,
  mataUjiNama,
  mataUjiIndeks,
  totalMataUji,
  durasiMenit,
  soal,
  jawabanTersimpan,
  sisaDetikAwal,
  jumlahPelanggaran,
  pesanLanjut,
  catatanBank,
}: Props) {
  const [jawaban, setJawaban] = useState<Record<string, string>>(
    () => ({ ...jawabanTersimpan }),
  );
  const [aktif, setAktif] = useState(0);
  const [sisaDetik, setSisaDetik] = useState(sisaDetikAwal);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [navTerbuka, setNavTerbuka] = useState(false);
  const [waktuHabis, setWaktuHabis] = useState(sisaDetikAwal <= 0);
  const [galat, setGalat] = useState<string | null>(null);
  const [mengirim, mulaiTransisi] = useTransition();

  /** Antrean penyimpanan agar pengumpulan selalu menunggu jawaban terakhir. */
  const antrean = useRef<Promise<unknown>>(Promise.resolve());
  const sudahDikirim = useRef(false);

  const terjawab = soal.filter((butir) => jawaban[butir.id]).length;

  // Pengawasan berhenti begitu mata uji dikumpulkan atau waktunya habis, agar
  // peserta tidak diperingatkan saat meninggalkan halaman yang sudah selesai.
  //
  // Layar penuh terkunci selama mata uji berjalan — tidak ada keadaan yang
  // membukanya, termasuk ketika seluruh soal sudah terjawab. Satu-satunya jalan
  // keluar adalah mengumpulkan jawaban, yang memanggil `izinkanKeluar()`.
  const pengawas = usePengawasUjian({
    aktif: !waktuHabis,
    jumlahAwal: jumlahPelanggaran,
    bolehKeluarLayarPenuh: false,
  });
  const { izinkanKeluar } = pengawas;

  const kumpulkan = useCallback(
    (otomatis: boolean) => {
      if (sudahDikirim.current) return;
      sudahDikirim.current = true;
      izinkanKeluar();
      if (otomatis) setWaktuHabis(true);

      mulaiTransisi(async () => {
        await antrean.current;
        await kumpulkanMataUji(mataUjiNama, otomatis);
      });
    },
    [izinkanKeluar, mataUjiNama],
  );

  // Timer dihitung dari sisa waktu versi server, memakai selisih waktu lokal
  // agar tidak terpengaruh perbedaan jam browser.
  useEffect(() => {
    if (sisaDetikAwal <= 0) {
      kumpulkan(true);
      return;
    }

    const mulaiLokal = Date.now();
    const interval = setInterval(() => {
      const sisa = sisaDetikAwal - Math.floor((Date.now() - mulaiLokal) / 1000);
      setSisaDetik(sisa);
      if (sisa <= 0) {
        clearInterval(interval);
        kumpulkan(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [kumpulkan, sisaDetikAwal]);

  const pilihJawaban = (indeksOpsi: number) => {
    if (waktuHabis || sudahDikirim.current) return;

    const butir = soal[aktif];
    const huruf = HURUF_OPSI[indeksOpsi];
    const berikutnya = { ...jawaban };
    const dibatalkan = berikutnya[butir.id] === huruf;

    if (dibatalkan) delete berikutnya[butir.id];
    else berikutnya[butir.id] = huruf;
    setJawaban(berikutnya);
    setGalat(null);

    // Setiap perubahan langsung dikirim ke server; server yang memutuskan
    // apakah jawaban sah untuk disimpan.
    antrean.current = antrean.current
      .then(() => simpanJawaban(butir.id, dibatalkan ? null : huruf))
      .then((hasil) => {
        if (hasil && !hasil.tersimpan) {
          setGalat(hasil.alasan ?? "Jawaban terakhir gagal disimpan.");
        }
      })
      .catch(() => setGalat("Jawaban terakhir gagal disimpan."));
    mulaiTransisi(async () => {
      await antrean.current;
    });
  };

  const persen = Math.round((terjawab / soal.length) * 100);
  const butir = soal[aktif];
  const jawabanAktif = jawaban[butir.id];
  const mendesak = sisaDetik <= 300;

  // Selalu menunjuk versi terbaru agar pendengar papan tik tidak perlu dipasang
  // ulang setiap kali jawaban berubah.
  const pilihRef = useRef(pilihJawaban);
  pilihRef.current = pilihJawaban;

  /**
   * Navigasi papan tik: panah kiri/kanan berpindah soal, huruf A–D atau angka
   * 1–4 memilih jawaban. Kombinasi dengan Ctrl/Alt/Meta sengaja dilewati agar
   * tidak bentrok dengan pintasan peramban maupun pengawas ujian, dan Tab tetap
   * berfungsi normal untuk pengguna pembaca layar.
   */
  const jumlahOpsi = butir.opsi.length;
  useEffect(() => {
    const padaTombol = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (konfirmasi || waktuHabis) return;

      const sasaran = event.target as HTMLElement | null;
      if (
        sasaran &&
        (sasaran.tagName === "INPUT" ||
          sasaran.tagName === "TEXTAREA" ||
          sasaran.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        setAktif((n) => Math.min(soal.length - 1, n + 1));
        return;
      }
      if (event.key === "ArrowLeft") {
        setAktif((n) => Math.max(0, n - 1));
        return;
      }

      const huruf = HURUF_OPSI.indexOf(
        event.key.toUpperCase() as (typeof HURUF_OPSI)[number],
      );
      const angka = /^[1-4]$/.test(event.key) ? Number(event.key) - 1 : -1;
      const indeks = huruf >= 0 ? huruf : angka;

      if (indeks >= 0 && indeks < jumlahOpsi) {
        event.preventDefault();
        pilihRef.current(indeks);
      }
    };

    window.addEventListener("keydown", padaTombol);
    return () => window.removeEventListener("keydown", padaTombol);
  }, [jumlahOpsi, konfirmasi, soal.length, waktuHabis]);

  return (
    <div className="min-h-dvh bg-surface pb-24 lg:pb-10">
      <PeringatanPengawas pengawas={pengawas} />
      <AjakanLayarPenuh pengawas={pengawas} />
      <BlokirKembali pengawas={pengawas} />
      {/* Paling atas: tirai harus menutup lapisan lain juga. */}
      <TiraiLayar pengawas={pengawas} />

      {/* ----------------------------- Bilah atas ---------------------------- */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <span className="truncate">
                {paketNama} · {sesiNama}
              </span>
              <LencanaPengawas pengawas={pengawas} />
            </p>
            <p className="truncate text-xs text-muted">
              Mata uji {mataUjiIndeks + 1} dari {totalMataUji}:{" "}
              <span className="font-medium text-navy-700">{mataUjiNama}</span> ·{" "}
              {soal.length} soal · {durasiMenit} menit
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 tabular-nums",
                mendesak
                  ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                  : "bg-navy-900 text-white",
              )}
              role="timer"
              aria-live="off"
            >
              <AlarmClock className="size-4.5" />
              <span className="text-xl font-bold tracking-tight">
                {formatWaktu(sisaDetik)}
              </span>
            </div>

            <div className="hidden min-w-40 flex-1 lg:block">
              <div className="flex items-center justify-between text-xs text-muted">
                <span aria-live="polite">
                  {mengirim ? (
                    <span className="inline-flex items-center gap-1.5 text-navy-700">
                      <LoaderCircle className="size-3.5 animate-spin" />
                      Menyimpan...
                    </span>
                  ) : galat ? (
                    <span className="text-rose-600">Gagal tersimpan</span>
                  ) : (
                    "Tersimpan otomatis"
                  )}
                </span>
                <span className="font-semibold text-navy-800">
                  {terjawab}/{soal.length}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-navy-50">
                <div
                  className="h-full rounded-full bg-navy-700 transition-all"
                  style={{ width: `${persen}%` }}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setNavTerbuka((nilai) => !nilai)}
            >
              <LayoutGrid className="size-4" />
              Nomor
            </Button>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="h-1.5 w-full bg-navy-50">
            <div
              className="h-full bg-navy-700 transition-all"
              style={{ width: `${persen}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_18rem] lg:items-start">
        {/* ------------------------------- Soal ------------------------------ */}
        <section className="min-w-0 space-y-5">
          {pesanLanjut ? (
            <p className="rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-800">
              {pesanLanjut}
            </p>
          ) : null}

          {catatanBank ? (
            <p className="rounded-2xl border border-navy-100 bg-navy-50/70 px-4 py-3 text-sm text-navy-800">
              {catatanBank}
            </p>
          ) : null}

          {galat ? (
            <p
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {galat}
            </p>
          ) : null}

          {/* Naskah soal tidak dapat diseleksi: pencegahan penyalinan yang tidak
              mengganggu navigasi maupun pembaca layar. */}
          <div className="select-none rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
                Soal {butir.nomor} dari {soal.length}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  jawabanAktif ? "text-emerald-600" : "text-slate-400",
                )}
              >
                {jawabanAktif ? `Jawaban: ${jawabanAktif}` : "Belum dijawab"}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-navy-900">
              {butir.pertanyaan}
            </p>

            {butir.gambar ? (
              <figure className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={butir.gambar.src}
                  alt={butir.gambar.alt}
                  className="w-full max-w-xl rounded-xl border border-line bg-white"
                />
                {butir.gambar.keterangan ? (
                  <figcaption className="mt-2 text-xs text-muted">
                    {butir.gambar.keterangan}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {butir.tabel ? (
              <figure className="mt-4">
                {butir.tabel.judul ? (
                  <figcaption className="mb-2 text-xs font-semibold text-navy-800">
                    {butir.tabel.judul}
                  </figcaption>
                ) : null}
                <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-line">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        {butir.tabel.kolom.map((judul) => (
                          <th
                            key={judul}
                            className="border-b border-line bg-navy-50/60 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-navy-700"
                          >
                            {judul}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {butir.tabel.baris.map((baris, i) => (
                        <tr key={i}>
                          {baris.map((sel, j) => (
                            <td
                              key={j}
                              className="border-b border-line px-3 py-2 text-navy-800 last:border-b-0"
                            >
                              {sel}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </figure>
            ) : null}

            <ul className="mt-5 space-y-2.5">
              {butir.opsi.map((teks, i) => {
                const huruf = HURUF_OPSI[i];
                const terpilih = jawabanAktif === huruf;
                return (
                  <li key={huruf}>
                    <button
                      type="button"
                      disabled={waktuHabis}
                      onClick={() => pilihJawaban(i)}
                      aria-pressed={terpilih}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        terpilih
                          ? "border-navy-700 bg-navy-50 text-navy-900 ring-2 ring-navy-200"
                          : "border-line bg-white text-navy-800 hover:border-navy-300 hover:bg-navy-50/60",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
                          terpilih
                            ? "bg-navy-900 text-gold-300"
                            : "bg-navy-50 text-navy-700",
                        )}
                      >
                        {huruf}
                      </span>
                      <span className="leading-relaxed">{teks}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAktif((n) => Math.max(0, n - 1))}
                disabled={aktif === 0}
              >
                <ChevronLeft className="size-4" />
                Sebelumnya
              </Button>
              <Button
                type="button"
                onClick={() => setAktif((n) => Math.min(soal.length - 1, n + 1))}
                disabled={aktif === soal.length - 1}
              >
                Berikutnya
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* --------------------------- Navigasi soal -------------------------- */}
        <aside
          className={cn(
            "min-w-0 space-y-4 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-24 lg:block",
            navTerbuka ? "block" : "hidden",
          )}
        >
          <div>
            <h2 className="text-sm font-semibold text-navy-900">
              Navigasi Soal
            </h2>
            <p className="mt-1 text-xs text-muted">
              {terjawab} terjawab · {soal.length - terjawab} belum
            </p>
          </div>

          <ol className="grid grid-cols-6 gap-2 lg:grid-cols-5">
            {soal.map((item, i) => {
              const sudah = Boolean(jawaban[item.id]);
              const ini = i === aktif;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setAktif(i);
                      setNavTerbuka(false);
                    }}
                    aria-current={ini ? "true" : undefined}
                    className={cn(
                      "grid aspect-square w-full place-items-center rounded-lg border text-sm font-semibold transition",
                      sudah
                        ? "border-navy-700 bg-navy-800 text-white"
                        : "border-line bg-white text-navy-700 hover:bg-navy-50",
                      ini && "ring-2 ring-gold-400 ring-offset-1",
                    )}
                  >
                    {item.nomor}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="space-y-2 border-t border-line pt-4 text-xs text-muted">
            <p className="flex items-center gap-2">
              <span className="size-3.5 rounded border border-navy-700 bg-navy-800" />
              Sudah dijawab
            </p>
            <p className="flex items-center gap-2">
              <span className="size-3.5 rounded border border-line bg-white" />
              Belum dijawab
            </p>
            <p className="pt-1 leading-relaxed">
              Pintasan: <b className="text-navy-700">←</b> /{" "}
              <b className="text-navy-700">→</b> pindah soal,{" "}
              <b className="text-navy-700">A–D</b> atau{" "}
              <b className="text-navy-700">1–4</b> memilih jawaban.
            </p>
          </div>

          <Button
            type="button"
            variant="gold"
            className="w-full"
            onClick={() => setKonfirmasi(true)}
            disabled={waktuHabis || mengirim}
          >
            <Send className="size-4" />
            Kumpulkan {mataUjiIndeks + 1 === totalMataUji ? "Sesi" : "Mata Uji"}
          </Button>
        </aside>
      </main>

      {/* --------------------------- Konfirmasi kirim -------------------------- */}
      {konfirmasi ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[var(--shadow-lift)]">
            <h2 className="text-lg font-semibold text-navy-900">
              Kumpulkan {mataUjiNama}?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {terjawab} dari {soal.length} soal telah dijawab
              {soal.length - terjawab > 0
                ? `, ${soal.length - terjawab} soal masih kosong`
                : ""}
              . Jawaban tidak dapat diubah setelah dikumpulkan.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <Button
                type="button"
                variant="gold"
                className="w-full sm:w-auto"
                disabled={mengirim}
                onClick={() => {
                  setKonfirmasi(false);
                  kumpulkan(false);
                }}
              >
                <Check className="size-4" />
                Ya, kumpulkan
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setKonfirmasi(false)}
              >
                <X className="size-4" />
                Batal
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ------------------------------ Waktu habis ---------------------------- */}
      {waktuHabis ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-[var(--shadow-lift)]">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-rose-50 text-rose-600">
              <AlarmClock className="size-6" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-navy-900">
              Waktu habis
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Jawaban yang sudah tersimpan otomatis dikumpulkan dan dinilai.
              Anda tidak dapat mengerjakan soal ini lagi.
            </p>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-navy-700">
              <LoaderCircle className="size-4 animate-spin" />
              Memproses hasil...
            </p>
          </div>
        </div>
      ) : null}

      {/* ----------------------- Bilah aksi khusus mobile ---------------------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setAktif((n) => Math.max(0, n - 1))}
            disabled={aktif === 0}
          >
            <ChevronLeft className="size-4" />
            Sebelumnya
          </Button>
          <Button
            type="button"
            size="sm"
            className="flex-1"
            onClick={() => setAktif((n) => Math.min(soal.length - 1, n + 1))}
            disabled={aktif === soal.length - 1}
          >
            Berikutnya
            <ChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => setKonfirmasi(true)}
            disabled={waktuHabis || mengirim}
          >
            <Send className="size-4" />
            Kumpulkan
          </Button>
        </div>
      </div>
    </div>
  );
}
