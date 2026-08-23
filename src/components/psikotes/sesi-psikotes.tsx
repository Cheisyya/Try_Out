"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  AlarmClock,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleSlash,
  LayoutGrid,
  Lightbulb,
  LoaderCircle,
  Play,
  Send,
  XCircle,
} from "lucide-react";

import { Figur, PapanFigur } from "@/components/psikotes/figur";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  mulaiSesiPsikotesAksi,
  simpanJawabanPsikotesAksi,
  tutupSesiPsikotesAksi,
} from "@/lib/actions-psikotes";
import type {
  BarisProfil,
  HasilEpps,
  HasilSesi,
  HasilSkor,
  HurufPsikotes,
  KoreksiButir,
  PasanganEpps,
  SoalSkorLatihan,
} from "@/lib/psikotes/tipe";
import { cn } from "@/lib/utils";

/**
 * Ruang pengerjaan satu sesi Try Out Psikotes.
 *
 * Satu komponen melayani dua jenis sesi yang cara penilaiannya berbeda:
 *
 * - **berkunci** — soal ditampilkan satu per satu dengan papan navigasi, lalu
 *   dikoreksi benar/salah beserta pembahasan tiap butir;
 * - **EPPS** — seluruh pasangan pernyataan ditampilkan sebagai satu daftar
 *   panjang, karena tes pilihan-paksa memang dikerjakan cepat mengikuti kesan
 *   pertama, dan hasilnya berupa profil, bukan nilai.
 *
 * Seluruh keadaan sesi dipegang server. Waktu mulai ditetapkan server sehingga
 * menyegarkan halaman tidak mengembalikan pewaktu, setiap pilihan langsung
 * dicatat sehingga tab yang tertutup tidak menghilangkan pekerjaan, dan
 * penilaian dilakukan dari jawaban yang tersimpan — bukan dari kiriman
 * browser. Pewaktu di layar ini hanya penunjuk; yang mengikat adalah batas
 * waktu di server, yang menolak jawaban setelah waktunya lewat.
 */

const HURUF: HurufPsikotes[] = ["A", "B", "C", "D"];

type Props = {
  paketId: string;
  paketNama: string;
  sesiId: string;
  sesiNama: string;
  petunjuk: string;
  durasiMenit: number;
  /** Keadaan sesi menurut server. */
  keadaan: "belum" | "berlangsung" | "selesai";
  /** Sisa waktu menurut server, dalam detik. */
  sisaDetikAwal: number;
  /** Jawaban yang sudah tercatat server, dipetakan dari nomor soal. */
  jawabanTersimpan: Record<number, string>;
  /** Hasil sesi yang sudah ditutup; null bila belum. */
  hasilTersimpan: HasilSesi | null;
  /** Alamat daftar sesi; dipakai tombol keluar dan tautan sesudah selesai. */
  tautanKembali: string;
} & (
  | { jenis: "skor"; soal: SoalSkorLatihan[]; pasangan?: never }
  | { jenis: "epps"; pasangan: PasanganEpps[]; soal?: never }
);

type Tahap = "petunjuk" | "kerja" | "hasil";

function formatWaktu(detik: number) {
  const aman = Math.max(0, detik);
  const menit = Math.floor(aman / 60);
  const sisa = aman % 60;
  return `${String(menit).padStart(2, "0")}:${String(sisa).padStart(2, "0")}`;
}

export function SesiPsikotes(props: Props) {
  const {
    paketId,
    paketNama,
    sesiId,
    sesiNama,
    petunjuk,
    durasiMenit,
    keadaan,
    sisaDetikAwal,
    jawabanTersimpan,
    hasilTersimpan,
    tautanKembali,
  } = props;

  const jumlahButir =
    props.jenis === "skor" ? props.soal.length : props.pasangan.length;

  const [tahap, setTahap] = useState<Tahap>(
    keadaan === "selesai" ? "hasil" : keadaan === "berlangsung" ? "kerja" : "petunjuk",
  );
  const [jawaban, setJawaban] = useState<Record<number, string>>(jawabanTersimpan);
  const [aktif, setAktif] = useState(0);
  const [navTerbuka, setNavTerbuka] = useState(false);
  const [hasil, setHasil] = useState<HasilSesi | null>(hasilTersimpan);
  const [galat, setGalat] = useState<string | null>(null);
  const [sisaDetik, setSisaDetik] = useState(sisaDetikAwal);
  const [proses, mulaiTransisi] = useTransition();

  const puncak = useRef<HTMLDivElement>(null);
  // Batas waktu diturunkan dari sisa waktu menurut server, bukan dari durasi
  // penuh — sesi yang dilanjutkan setelah tab tertutup melanjutkan hitungannya.
  const batasWaktu = useRef<number>(Date.now() + sisaDetikAwal * 1000);
  // Menjaga agar penutupan otomatis saat waktu habis hanya terjadi sekali.
  const sudahDitutup = useRef(false);

  /**
   * Rantai penyimpanan jawaban.
   *
   * Setiap pilihan dikirim ke server berurutan, bukan serentak: dua tulisan
   * yang berangkat bersamaan dapat tiba terbalik dan menyimpan jawaban lama.
   */
  const antrean = useRef<Promise<unknown>>(Promise.resolve());

  const terjawab = Object.keys(jawaban).length;

  const tutup = useCallback(
    (otomatis: boolean) => {
      if (sudahDitutup.current) return;
      sudahDitutup.current = true;
      setGalat(null);

      mulaiTransisi(async () => {
        // Menunggu jawaban terakhir selesai tersimpan sebelum sesi dinilai.
        await antrean.current;
        const balasan = await tutupSesiPsikotesAksi(paketId, sesiId, otomatis);
        if (!balasan.ok) {
          // Gagal menutup bukan alasan mengunci peserta di layar kosong —
          // sesinya dibuka kembali agar ia dapat mencoba sekali lagi.
          sudahDitutup.current = false;
          setGalat(balasan.masalah);
          return;
        }
        setHasil(balasan.hasil);
        setTahap("hasil");
        puncak.current?.scrollIntoView({ block: "start" });
      });
    },
    [paketId, sesiId],
  );

  /* Pewaktu mundur; menutup sesi dengan sendirinya ketika habis. */
  useEffect(() => {
    if (tahap !== "kerja") return;

    const jam = setInterval(() => {
      const sisa = Math.round((batasWaktu.current - Date.now()) / 1000);
      setSisaDetik(Math.max(0, sisa));
      if (sisa <= 0) tutup(true);
    }, 1000);

    return () => clearInterval(jam);
  }, [tahap, tutup]);

  const mulai = () => {
    setGalat(null);
    mulaiTransisi(async () => {
      const balasan = await mulaiSesiPsikotesAksi(paketId, sesiId);
      if (!balasan.ok) {
        setGalat(balasan.masalah);
        return;
      }
      batasWaktu.current = Date.now() + balasan.sisaDetik * 1000;
      setSisaDetik(balasan.sisaDetik);
      sudahDitutup.current = false;
      setTahap("kerja");
    });
  };

  const pilih = useCallback(
    (nomor: number, huruf: string) => {
      // Nilai baru dihitung lebih dahulu supaya yang dikirim ke server persis
      // sama dengan yang tampil di layar.
      const dibatalkan = jawaban[nomor] === huruf;

      setJawaban((sebelumnya) =>
        sebelumnya[nomor] === huruf
          ? Object.fromEntries(
              Object.entries(sebelumnya).filter(([k]) => Number(k) !== nomor),
            )
          : { ...sebelumnya, [nomor]: huruf },
      );

      antrean.current = antrean.current
        .then(() =>
          simpanJawabanPsikotesAksi(
            paketId,
            sesiId,
            nomor,
            dibatalkan ? null : huruf,
          ),
        )
        .then((balasan) => {
          // Jawaban yang ditolak server tidak boleh terlihat tersimpan.
          if (!balasan.tersimpan) {
            setGalat(
              `${balasan.alasan ?? "Jawaban gagal disimpan."} Periksa sambungan Anda.`,
            );
          }
        })
        .catch(() => {
          setGalat(
            "Jawaban terakhir gagal dikirim ke server. Periksa sambungan Anda.",
          );
        });
    },
    [jawaban, paketId, sesiId],
  );

  const hampirHabis = sisaDetik <= 120;

  /**
   * Kepala layar penuh.
   *
   * Sesi psikotes dikerjakan tanpa sidebar dashboard, sama seperti ruang ujian
   * try out akademik: yang tampil hanyalah nama sesi, pewaktu, dan kemajuan
   * pengerjaan. Pewaktu ikut di sini — bukan sebagai bilah terpisah — supaya ia
   * tetap terbaca ke mana pun peserta menggulir.
   */
  const kepala = (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy-900">
            {sesiNama}
          </p>
          <p className="truncate text-xs text-muted">{paketNama}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {tahap === "kerja" ? (
            <>
              <span className="hidden text-xs font-medium text-muted sm:inline">
                {terjawab}/{jumlahButir} terjawab
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold tabular-nums",
                  hampirHabis
                    ? "bg-rose-50 text-rose-700"
                    : "bg-navy-50 text-navy-800",
                )}
                role="timer"
                aria-live="off"
              >
                <AlarmClock className="size-4" />
                {formatWaktu(sisaDetik)}
              </span>
            </>
          ) : (
            <ButtonLink href={tautanKembali} variant="outline" size="sm">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Daftar sesi</span>
              <span className="sm:hidden">Keluar</span>
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );

  const bingkai = (isi: React.ReactNode) => (
    <div className="min-h-dvh">
      {kepala}
      <main
        ref={puncak}
        className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-5 sm:px-6 sm:py-6"
      >
        {isi}
      </main>
    </div>
  );

  /* ------------------------------ Petunjuk -------------------------------- */

  if (tahap === "petunjuk") {
    return bingkai(
      <div className="min-w-0">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="navy">{jumlahButir} butir</Badge>
            <Badge tone="gold">
              <AlarmClock className="size-3.5" />
              {durasiMenit} menit
            </Badge>
            <Badge tone="netral">
              {props.jenis === "epps" ? "Tanpa benar/salah" : "Dikoreksi & dibahas"}
            </Badge>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-navy-900">
            Petunjuk pengerjaan
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy-800">
            {petunjuk}
          </p>


          {galat ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {galat}
            </p>
          ) : null}

          <Button
            type="button"
            onClick={mulai}
            disabled={proses}
            className="mt-5 w-full sm:w-auto"
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            Mulai sesi ({durasiMenit} menit)
          </Button>
        </div>
      </div>,
    );
  }

  /* -------------------------------- Hasil --------------------------------- */

  if (tahap === "hasil" && hasil) {
    return bingkai(
      <div className="min-w-0 space-y-5">
        {hasil.jenis === "skor" ? (
          <>
            <RingkasanSkor
              sesiNama={sesiNama}
              paketNama={paketNama}
              hasil={hasil}
            />
            <ol className="space-y-4">
              {props.jenis === "skor"
                ? props.soal.map((soal) => {
                    const koreksi = hasil.butir.find(
                      (k) => k.nomor === soal.nomor,
                    );
                    if (!koreksi) return null;
                    return (
                      <li key={soal.nomor}>
                        <KartuUlasan soal={soal} koreksi={koreksi} />
                      </li>
                    );
                  })
                : null}
            </ol>
          </>
        ) : (
          <LembarProfil sesiNama={sesiNama} paketNama={paketNama} hasil={hasil} />
        )}

        <ButtonLink href={tautanKembali} variant="outline">
          <ArrowLeft className="size-4" />
          Kembali ke daftar sesi
        </ButtonLink>
      </div>,
    );
  }

  /* ------------------------------ Pengerjaan ------------------------------ */

  const tombolTutup = (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <p className="text-sm text-muted">
        {terjawab === jumlahButir
          ? "Semua butir sudah terisi. Tekan tombol di bawah untuk menutup sesi."
          : `Masih ada ${jumlahButir - terjawab} butir yang belum terisi. Sesi akan menutup sendiri ketika waktunya habis.`}
      </p>
      <Button
        type="button"
        onClick={() => tutup(false)}
        disabled={proses}
        className="mt-4 w-full sm:w-auto"
      >
        {proses ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {props.jenis === "epps" ? "Selesai & lihat profil" : "Selesai & lihat pembahasan"}
      </Button>
    </div>
  );

  const pesanGalat = galat ? (
    <p
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      {galat}
    </p>
  ) : null;

  /* --- EPPS: seluruh pasangan sebagai satu daftar --- */
  if (props.jenis === "epps") {
    return bingkai(
      <div className="min-w-0">
        <div className="space-y-4">
          {pesanGalat}
          <ol className="space-y-3">
            {props.pasangan.map((butir) => (
              <li key={butir.nomor}>
                <KartuPasangan
                  butir={butir}
                  dipilih={jawaban[butir.nomor] ?? null}
                  onPilih={(huruf) => pilih(butir.nomor, huruf)}
                />
              </li>
            ))}
          </ol>
          {tombolTutup}
        </div>
      </div>,
    );
  }

  /* --- Sesi berkunci: satu soal per layar --- */
  const butir = props.soal[aktif];

  return bingkai(
    <div className="min-w-0">
      <div className="grid gap-5 lg:grid-cols-[1fr_16rem] lg:items-start">
        <section className="min-w-0 space-y-4">
          {pesanGalat}

          <button
            type="button"
            onClick={() => setNavTerbuka((s) => !s)}
            aria-expanded={navTerbuka}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-navy-800 shadow-[var(--shadow-soft)] lg:hidden"
          >
            <span className="flex items-center gap-2">
              <LayoutGrid className="size-4.5 text-langit-600" />
              Navigasi soal
            </span>
            <span className="text-xs font-medium text-muted">
              Soal {butir?.nomor ?? 1} dari {jumlahButir}
            </span>
          </button>

          {navTerbuka ? (
            <div className="lg:hidden">
              <PanelNavigasi
                soal={props.soal}
                jawaban={jawaban}
                aktif={aktif}
                onPilih={(i) => {
                  setAktif(i);
                  setNavTerbuka(false);
                }}
              />
            </div>
          ) : null}

          {butir ? (
            <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
                  Soal {butir.nomor} dari {jumlahButir}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="netral">{butir.kategori}</Badge>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      jawaban[butir.nomor]
                        ? "text-emerald-600"
                        : "text-slate-400",
                    )}
                  >
                    {jawaban[butir.nomor]
                      ? `Jawaban: ${jawaban[butir.nomor]}`
                      : "Belum dijawab"}
                  </span>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-navy-900">
                {butir.pertanyaan}
              </p>

              {butir.stimulus ? (
                <PapanFigur stimulus={butir.stimulus} className="mt-4" />
              ) : null}

              <ul
                className={cn(
                  "mt-5",
                  butir.opsiFigur
                    ? "grid grid-cols-2 gap-2.5 sm:grid-cols-4"
                    : "space-y-2.5",
                )}
              >
                {HURUF.map((huruf) => {
                  const terpilih = jawaban[butir.nomor] === huruf;
                  return (
                    <li key={huruf}>
                      <button
                        type="button"
                        onClick={() => pilih(butir.nomor, huruf)}
                        aria-pressed={terpilih}
                        aria-label={`Pilihan ${huruf}: ${butir.opsi[huruf]}`}
                        className={cn(
                          "w-full rounded-xl border text-left text-sm transition",
                          butir.opsiFigur
                            ? "flex flex-col items-center gap-2 p-3"
                            : "flex items-start gap-3 px-4 py-3",
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
                        {butir.opsiFigur ? (
                          <span className="grid size-16 place-items-center rounded-lg border border-line bg-white p-1.5">
                            <Figur
                              kode={butir.opsiFigur[huruf]}
                              label={butir.opsi[huruf]}
                            />
                          </span>
                        ) : (
                          <span className="min-w-0 leading-relaxed">
                            {butir.opsi[huruf]}
                          </span>
                        )}
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
                  <span className="hidden sm:inline">Sebelumnya</span>
                  <span className="sm:hidden">Sebelum</span>
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setAktif((n) => Math.min(jumlahButir - 1, n + 1))
                  }
                  disabled={aktif === jumlahButir - 1}
                >
                  Berikutnya
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          ) : null}

          {/* Tombol submit versi mobile — muncul di bawah soal */}
          <div className="lg:hidden rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <p className="text-sm text-muted">
              {terjawab === jumlahButir
                ? "Semua butir sudah terisi. Tekan tombol di bawah untuk menutup sesi."
                : `Masih ada ${jumlahButir - terjawab} butir yang belum terisi. Sesi akan menutup sendiri ketika waktunya habis.`}
            </p>
            <Button
              type="button"
              onClick={() => tutup(false)}
              disabled={proses}
              className="mt-4 w-full"
            >
              {proses ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {"Selesai & lihat pembahasan"}
            </Button>
          </div>
        </section>

        <aside className="hidden min-w-0 lg:sticky lg:top-24 lg:block">
          <PanelNavigasi
            soal={props.soal}
            jawaban={jawaban}
            aktif={aktif}
            onPilih={setAktif}
            terjawab={terjawab}
            jumlahButir={jumlahButir}
            jenis={props.jenis}
            proses={proses}
            onTutup={() => tutup(false)}
          />
        </aside>
      </div>
    </div>,
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Bagian                                    */
/* -------------------------------------------------------------------------- */

function PanelNavigasi({
  soal,
  jawaban,
  aktif,
  onPilih,
  terjawab,
  jumlahButir,
  jenis,
  proses,
  onTutup,
}: {
  soal: SoalSkorLatihan[];
  jawaban: Record<number, string>;
  aktif: number;
  onPilih: (indeks: number) => void;
  terjawab?: number;
  jumlahButir?: number;
  jenis?: "skor" | "epps";
  proses?: boolean;
  onTutup?: () => void;
}) {
  const _terjawab = terjawab ?? Object.keys(jawaban).length;
  const _total = jumlahButir ?? soal.length;

  return (
    <div className="min-w-0 space-y-4 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)]">
      <div>
        <h2 className="text-sm font-semibold text-navy-900">Navigasi Soal</h2>
        <p className="mt-1 text-xs text-muted">
          {_terjawab} terjawab · {soal.length - _terjawab} belum
        </p>
      </div>

      <ol className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
        {soal.map((item, i) => {
          const sudah = Boolean(jawaban[item.nomor]);
          const ini = i === aktif;
          return (
            <li key={item.nomor}>
              <button
                type="button"
                onClick={() => onPilih(i)}
                aria-current={ini ? "true" : undefined}
                aria-label={`Soal ${item.nomor}${sudah ? ", sudah dijawab" : ", belum dijawab"}`}
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
      </div>

      {/* Tombol submit — hanya tampil di layar lebar */}
      {onTutup !== undefined && (
        <div className="border-t border-line pt-4">
          <p className="text-xs text-muted">
            {_terjawab === _total
              ? "Semua butir sudah terisi."
              : `${_total - _terjawab} butir belum terisi. Boleh dikosongkan.`}
          </p>
          <Button
            type="button"
            onClick={onTutup}
            disabled={proses}
            className="mt-3 w-full"
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {jenis === "epps" ? "Selesai & lihat profil" : "Selesai & lihat pembahasan"}
          </Button>
        </div>
      )}
    </div>
  );
}

/** Satu pasangan pernyataan EPPS. */
function KartuPasangan({
  butir,
  dipilih,
  onPilih,
}: {
  butir: PasanganEpps;
  dipilih: string | null;
  onPilih: (huruf: "A" | "B") => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-lg bg-navy-50 px-2 py-0.5 text-xs font-bold text-navy-700">
          {butir.nomor}
        </span>
        {dipilih ? (
          <span className="text-xs font-semibold text-emerald-600">
            Terpilih: {dipilih}
          </span>
        ) : null}
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {(["A", "B"] as const).map((huruf) => {
          const terpilih = dipilih === huruf;
          const teks = huruf === "A" ? butir.a.teks : butir.b.teks;
          return (
            <button
              key={huruf}
              type="button"
              onClick={() => onPilih(huruf)}
              aria-pressed={terpilih}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                terpilih
                  ? "border-navy-700 bg-navy-50 text-navy-900 ring-2 ring-navy-200"
                  : "border-line bg-white text-navy-800 hover:border-navy-300 hover:bg-navy-50/60",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-lg text-xs font-bold",
                  terpilih
                    ? "bg-navy-900 text-gold-300"
                    : "bg-navy-50 text-navy-700",
                )}
              >
                {huruf}
              </span>
              <span className="min-w-0 leading-relaxed">{teks}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------- Hasil ---------------------------------- */

function RingkasanSkor({
  sesiNama,
  paketNama,
  hasil,
}: {
  sesiNama: string;
  paketNama: string;
  hasil: HasilSkor;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="min-w-0 space-y-1">
        <h2 className="text-lg font-semibold text-navy-900">
          Hasil · {sesiNama}
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          {paketNama}. Hasil ini tersimpan dan terbaca pengajar, tetapi bukan
          skor psikotes resmi dan tidak masuk Riwayat Hasil try out akademik.
          Gunakan pembahasan di bawah untuk menelusuri cara berpikir tiap soal,
          terutama yang jawabannya keliru.
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3">
        <Angka
          label="Benar"
          nilai={hasil.benar}
          total={hasil.total}
          kelas="border-emerald-200 bg-emerald-50 text-emerald-700"
        />
        <Angka
          label="Salah"
          nilai={hasil.salah}
          total={hasil.total}
          kelas="border-rose-200 bg-rose-50 text-rose-700"
        />
        <Angka
          label="Kosong"
          nilai={hasil.kosong}
          total={hasil.total}
          kelas="border-line bg-slate-50 text-slate-600"
        />
      </dl>

      {hasil.perKategori.length > 1 ? (
        <div className="mt-5 border-t border-line pt-4">
          <h3 className="text-sm font-semibold text-navy-900">
            Benar per bagian
          </h3>
          <ul className="mt-3 space-y-2.5">
            {hasil.perKategori.map((baris) => {
              const persen = Math.round((baris.benar / baris.jumlah) * 100);
              return (
                <li key={baris.kategori}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium text-navy-800">
                      {baris.kategori}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted">
                      {baris.benar}/{baris.jumlah}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-navy-50">
                    <div
                      className="h-full rounded-full bg-navy-700 transition-all"
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Angka({
  label,
  nilai,
  total,
  kelas,
}: {
  label: string;
  nilai: number;
  total: number;
  kelas: string;
}) {
  return (
    <div className={cn("rounded-xl border px-3 py-3 text-center", kelas)}>
      <dt className="text-xs font-semibold uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-2xl font-bold leading-none">
        {nilai}
        <span className="text-sm font-semibold opacity-70">/{total}</span>
      </dd>
    </div>
  );
}

/**
 * Lembar profil EPPS.
 *
 * Tidak ada benar, salah, maupun nilai — hanya urutan kecenderungan beserta
 * tafsirnya. Peringatan di bagian atas sengaja tidak dapat dilewati, karena
 * salah membaca hasil tes kepribadian jauh lebih merugikan daripada tidak
 * membacanya sama sekali.
 */
function LembarProfil({
  sesiNama,
  paketNama,
  hasil,
}: {
  sesiNama: string;
  paketNama: string;
  hasil: HasilEpps;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold text-navy-900">
            Profil · {sesiNama}
          </h2>
          <p className="text-sm text-muted">
            {paketNama} · {hasil.dijawab} dari {hasil.total} pasangan dipilih.
          </p>
        </div>

      </div>

      <ol className="space-y-3">
        {hasil.profil.map((baris, urutan) => (
          <li key={baris.dimensi}>
            <BarisDimensi baris={baris} urutan={urutan} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function BarisDimensi({
  baris,
  urutan,
}: {
  baris: BarisProfil;
  urutan: number;
}) {
  const persen = baris.maks === 0 ? 0 : Math.round((baris.skor / baris.maks) * 100);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-navy-900">
          {urutan + 1}. {baris.dimensi}
        </h3>
        <Badge tone={persen >= 70 ? "hijau" : persen >= 40 ? "gold" : "netral"}>
          {baris.skor} dari {baris.maks} pilihan
        </Badge>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-navy-50">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            persen >= 70
              ? "bg-emerald-500"
              : persen >= 40
                ? "bg-gold-400"
                : "bg-slate-300",
          )}
          style={{ width: `${persen}%` }}
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">{baris.arti}</p>
      <p className="mt-2 text-sm leading-relaxed text-navy-800">
        {baris.tafsir}
      </p>
    </div>
  );
}

/** Satu butir pada ulasan sesi berkunci. */
function KartuUlasan({
  soal,
  koreksi,
}: {
  soal: SoalSkorLatihan;
  koreksi: KoreksiButir;
}) {
  const kosong = koreksi.jawaban === null;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-navy-50 px-2 py-0.5 text-xs font-bold text-navy-700">
          Soal {soal.nomor}
        </span>
        {kosong ? (
          <Badge tone="netral">
            <CircleSlash className="size-3" />
            Tidak dijawab
          </Badge>
        ) : koreksi.benar ? (
          <Badge tone="hijau">
            <CheckCircle2 className="size-3.5" />
            Jawaban benar
          </Badge>
        ) : (
          <Badge tone="merah">
            <XCircle className="size-3.5" />
            Jawaban salah
          </Badge>
        )}
        <Badge tone="netral">{soal.kategori}</Badge>
      </div>

      <p className="mt-3.5 whitespace-pre-line text-sm leading-relaxed text-navy-900">
        {soal.pertanyaan}
      </p>

      {soal.stimulus ? (
        <PapanFigur stimulus={soal.stimulus} className="mt-3.5" />
      ) : null}

      <ul
        className={cn(
          "mt-4",
          soal.opsiFigur ? "grid grid-cols-2 gap-2 sm:grid-cols-4" : "space-y-1.5",
        )}
      >
        {HURUF.map((huruf) => {
          const iniKunci = huruf === koreksi.kunci;
          const iniJawaban = huruf === koreksi.jawaban;

          return (
            <li
              key={huruf}
              className={cn(
                "rounded-xl border text-sm",
                soal.opsiFigur
                  ? "flex flex-col items-center gap-2 p-3"
                  : "flex gap-3 px-3.5 py-2.5",
                iniKunci
                  ? "border-emerald-300 bg-emerald-50"
                  : iniJawaban
                    ? "border-rose-300 bg-rose-50"
                    : "border-line",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-lg text-xs font-bold",
                  iniKunci
                    ? "bg-emerald-600 text-white"
                    : iniJawaban
                      ? "bg-rose-600 text-white"
                      : "bg-navy-50 text-navy-700",
                )}
              >
                {huruf}
              </span>

              {soal.opsiFigur ? (
                <>
                  <span className="grid size-14 place-items-center rounded-lg border border-line bg-white p-1.5">
                    <Figur
                      kode={soal.opsiFigur[huruf]}
                      label={soal.opsi[huruf]}
                    />
                  </span>
                  {iniKunci ? (
                    <span className="text-[11px] font-semibold text-emerald-700">
                      kunci
                    </span>
                  ) : iniJawaban ? (
                    <span className="text-[11px] font-semibold text-rose-700">
                      jawabanmu
                    </span>
                  ) : null}
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1 leading-relaxed text-navy-800">
                    {soal.opsi[huruf]}
                  </span>
                  {iniKunci ? (
                    <span className="shrink-0 text-xs font-semibold text-emerald-700">
                      kunci
                    </span>
                  ) : iniJawaban ? (
                    <span className="shrink-0 text-xs font-semibold text-rose-700">
                      jawabanmu
                    </span>
                  ) : null}
                </>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex gap-3 rounded-xl border border-gold-200 bg-gold-50/70 px-4 py-3.5">
        <Lightbulb className="mt-0.5 size-4.5 shrink-0 text-gold-700" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-800">
            Pembahasan
          </p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-navy-800">
            {koreksi.pembahasan}
          </p>
        </div>
      </div>
    </div>
  );
}
