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
  Send,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  simpanJawabanIqAksi,
  tutupLatihanIqAksi,
} from "@/lib/actions-tes-iq";
import type {
  HasilLatihanIq,
  HurufIq,
  KoreksiIq,
  SoalIqLatihan,
} from "@/lib/tes-iq/tipe";
import { cn } from "@/lib/utils";

/**
 * Ruang latihan Tes IQ.
 *
 * Berbeda dengan ruang ujian: tanpa pengawasan layar penuh, dan boleh diulang
 * sebanyak yang peserta mau. Yang kini disamakan adalah batas waktunya — tiap
 * paket berdurasi tetap, dihitung server sejak jawaban pertama tercatat,
 * sehingga menyegarkan halaman tidak mengembalikan pewaktu dan jawaban yang
 * tiba setelah waktunya lewat ditolak. Pewaktu di layar ini hanya penunjuk.
 *
 * Kunci jawaban tidak ada di dalam `soal`; ia baru datang bersama koreksi dari
 * server setelah tombol "Selesai" ditekan atau setelah waktunya habis.
 *
 * Jawaban tetap dicatat server setiap kali dipilih, sehingga halaman yang
 * tertutup di tengah jalan tidak menghilangkan pekerjaan dan hasilnya terbaca
 * pengajar. Yang tidak disimpan hanyalah riwayat tiap percobaan — hanya
 * percobaan terakhir yang disimpan, beserta cacah berapa kali paket dikerjakan.
 *
 * Keluarannya sengaja hanya benar/salah/kosong beserta pembahasan. Tidak ada
 * skor IQ, nilai, maupun peringkat, karena dua paket soal tidak cukup untuk
 * menakar apa pun tentang seseorang — dan menampilkan angka semacam itu justru
 * menyesatkan peserta.
 */

const HURUF: HurufIq[] = ["A", "B", "C", "D"];

type Props = {
  paketId: string;
  paketNama: string;
  tingkat: string;
  soal: SoalIqLatihan[];
  /** Jawaban yang sudah tercatat server, dipetakan dari nomor soal. */
  jawabanTersimpan: Record<number, HurufIq>;
  /** Hasil percobaan terakhir bila paket ini sudah ditutup; null bila belum. */
  hasilTersimpan: HasilLatihanIq | null;
  /** Batas waktu paket, dalam menit — dipakai pada label dan saat mengulang. */
  durasiMenit: number;
  /** Sisa waktu menurut server, dalam detik. */
  sisaDetikAwal: number;
  /**
   * true bila pewaktu di server sudah berjalan untuk percobaan ini.
   *
   * Server menetapkan waktu mulai pada jawaban pertama, bukan saat halaman
   * dibuka. Tanpa penanda ini, hitungan di layar akan berjalan lebih dahulu
   * daripada hitungan server, dan latihan tampak menutup sendiri padahal
   * waktunya masih ada.
   */
  berjalan: boolean;
};

export function LatihanIq({
  paketId,
  paketNama,
  tingkat,
  soal,
  jawabanTersimpan,
  hasilTersimpan,
  durasiMenit,
  sisaDetikAwal,
  berjalan,
}: Props) {
  const [jawaban, setJawaban] = useState<Record<number, HurufIq>>(jawabanTersimpan);
  const [aktif, setAktif] = useState(0);
  const [navTerbuka, setNavTerbuka] = useState(false);
  const [hasil, setHasil] = useState<HasilLatihanIq | null>(hasilTersimpan);
  const [galat, setGalat] = useState<string | null>(null);
  const [sisaDetik, setSisaDetik] = useState(sisaDetikAwal);
  // Pewaktu baru berdetak setelah percobaan benar-benar dimulai di server.
  const [mulai, setMulai] = useState(berjalan);
  const [proses, mulaiTransisi] = useTransition();

  const puncak = useRef<HTMLDivElement>(null);
  // Batas waktu diturunkan dari sisa waktu menurut server, bukan dari durasi
  // penuh — latihan yang dilanjutkan melanjutkan hitungannya, tidak mengulang.
  const batasWaktu = useRef<number>(Date.now() + sisaDetikAwal * 1000);
  // Menjaga agar penutupan otomatis saat waktu habis hanya terjadi sekali.
  const sudahDitutup = useRef(hasilTersimpan !== null);

  /**
   * Rantai penyimpanan jawaban.
   *
   * Setiap pilihan dikirim ke server berurutan, bukan serentak: dua tulisan
   * yang berangkat bersamaan dapat tiba terbalik dan menyimpan jawaban lama.
   */
  const antrean = useRef<Promise<unknown>>(Promise.resolve());

  const butir = soal[aktif];
  const terjawab = Object.keys(jawaban).length;
  const belum = soal.length - terjawab;

  const pilih = useCallback(
    (nomor: number, huruf: HurufIq) => {
      // Menekan pilihan yang sama sekali lagi membatalkannya — di latihan,
      // "ragu-ragu lalu mengosongkan" adalah keadaan yang wajar.
      const dibatalkan = jawaban[nomor] === huruf;

      setJawaban((sebelumnya) =>
        sebelumnya[nomor] === huruf
          ? Object.fromEntries(
              Object.entries(sebelumnya).filter(([kunci]) => Number(kunci) !== nomor),
            )
          : { ...sebelumnya, [nomor]: huruf },
      );

      antrean.current = antrean.current
        .then(() =>
          simpanJawabanIqAksi(paketId, nomor, dibatalkan ? null : huruf),
        )
        .then((balasan) => {
          if (balasan.tersimpan) {
            // Jawaban pertama yang diterima server adalah saat pewaktunya
            // dimulai di sana; hitungan di layar menyusul dari titik yang sama.
            setMulai((sudah) => {
              if (!sudah) batasWaktu.current = Date.now() + durasiMenit * 60_000;
              return true;
            });
            return;
          }

          setGalat(
            `${balasan.alasan ?? "Jawaban gagal disimpan."} Periksa sambungan Anda.`,
          );
        })
        .catch(() => {
          setGalat(
            "Jawaban terakhir gagal dikirim ke server. Periksa sambungan Anda.",
          );
        });
    },
    [durasiMenit, jawaban, paketId],
  );

  const kumpulkan = useCallback(
    (otomatis = false) => {
      if (sudahDitutup.current) return;
      sudahDitutup.current = true;
      setGalat(null);

      mulaiTransisi(async () => {
        // Menunggu jawaban terakhir tersimpan sebelum paket dinilai.
        await antrean.current;
        const balasan = await tutupLatihanIqAksi(paketId, otomatis);
        if (!balasan.ok) {
          // Gagal menutup bukan alasan mengunci peserta di layar kosong.
          sudahDitutup.current = false;
          setGalat(balasan.masalah);
          return;
        }
        setHasil(balasan.hasil);
        puncak.current?.scrollIntoView({ block: "start" });
      });
    },
    [paketId],
  );

  /* Pewaktu mundur; menutup latihan dengan sendirinya ketika habis. */
  useEffect(() => {
    if (hasil || !mulai) return;

    const jam = setInterval(() => {
      const sisa = Math.round((batasWaktu.current - Date.now()) / 1000);
      setSisaDetik(Math.max(0, sisa));
      if (sisa <= 0) kumpulkan(true);
    }, 1000);

    return () => clearInterval(jam);
  }, [hasil, kumpulkan, mulai]);



  /* Pintasan papan ketik; hanya aktif selama masih mengerjakan. */
  useEffect(() => {
    if (hasil) return;

    function tekan(peristiwa: KeyboardEvent) {
      if (peristiwa.ctrlKey || peristiwa.altKey || peristiwa.metaKey) return;

      if (peristiwa.key === "ArrowRight") {
        setAktif((n) => Math.min(soal.length - 1, n + 1));
        return;
      }
      if (peristiwa.key === "ArrowLeft") {
        setAktif((n) => Math.max(0, n - 1));
        return;
      }

      const huruf = peristiwa.key.toUpperCase() as HurufIq;
      const target = soal[aktif];
      if (target && HURUF.includes(huruf)) pilih(target.nomor, huruf);
    }

    window.addEventListener("keydown", tekan);
    return () => window.removeEventListener("keydown", tekan);
  }, [aktif, hasil, pilih, soal]);

  /* ------------------------------- Hasil ---------------------------------- */

  if (hasil) {
    return (
      <div ref={puncak} className="min-w-0 space-y-5 scroll-mt-24">
        <RingkasanHasil
          paketNama={paketNama}
          hasil={hasil}
        />

        {galat ? (
          <p
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {galat}
          </p>
        ) : null}

        <ol className="space-y-4">
          {soal.map((item) => {
            const koreksi = hasil.butir.find((k) => k.nomor === item.nomor);
            if (!koreksi) return null;
            return (
              <li key={item.nomor}>
                <KartuUlasan soal={item} koreksi={koreksi} />
              </li>
            );
          })}
        </ol>

        <ButtonLink href="/siswa/tes-iq" variant="outline">
          <ArrowLeft className="size-4" />
          Kembali ke daftar paket
        </ButtonLink>
      </div>
    );
  }

  /* ---------------------------- Mengerjakan -------------------------------- */

  const hampirHabis = sisaDetik <= 120;

  return (
    <div ref={puncak} className="min-w-0 scroll-mt-24">
      <div
        className={cn(
          "sticky top-16 z-10 -mx-4 mb-4 flex items-center justify-between gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6",
          hampirHabis ? "border-rose-200" : "border-line",
        )}
      >
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
        <span className="text-xs font-medium text-muted">
          {terjawab}/{soal.length} terjawab
        </span>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[1fr_16rem] lg:items-start">
      <section className="min-w-0 space-y-4">
        {galat ? (
          <p
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {galat}
          </p>
        ) : null}

        {/* Pembuka navigasi versi ponsel; di layar lebar panelnya selalu tampak. */}
        <button
          type="button"
          onClick={() => setNavTerbuka((sebelumnya) => !sebelumnya)}
          aria-expanded={navTerbuka}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-navy-800 shadow-[var(--shadow-soft)] lg:hidden"
        >
          <span className="flex items-center gap-2">
            <LayoutGrid className="size-4.5 text-langit-600" />
            Navigasi soal
          </span>
          <span className="text-xs font-medium text-muted">
            {terjawab}/{soal.length} terjawab
          </span>
        </button>

        {navTerbuka ? (
          <div className="lg:hidden">
            <PanelNavigasi
              soal={soal}
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
                Soal {butir.nomor} dari {soal.length}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="netral">{butir.kategori}</Badge>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    jawaban[butir.nomor] ? "text-emerald-600" : "text-slate-400",
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

            <PolaSoal pola={butir.pola} />

            <ul className="mt-5 space-y-2.5">
              {HURUF.map((huruf) => {
                const terpilih = jawaban[butir.nomor] === huruf;
                return (
                  <li key={huruf}>
                    <button
                      type="button"
                      onClick={() => pilih(butir.nomor, huruf)}
                      aria-pressed={terpilih}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
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
                      <span className="min-w-0 leading-relaxed">
                        {butir.opsi[huruf]}
                      </span>
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
                onClick={() => setAktif((n) => Math.min(soal.length - 1, n + 1))}
                disabled={aktif === soal.length - 1}
              >
                Berikutnya
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      {/* Panel navigasi versi layar lebar */}
      <aside className="hidden min-w-0 lg:sticky lg:top-24 lg:block">
        <PanelNavigasi
          soal={soal}
          jawaban={jawaban}
          aktif={aktif}
          onPilih={setAktif}
          judulPaket={`${paketNama} · ${tingkat}`}
        />
      </aside>

      {/* Tombol submit di bawah panel navigasi (kolom kanan) */}
      <div className="lg:col-start-2 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <p className="text-sm text-muted">
            {belum === 0
              ? "Semua soal sudah dijawab. Tekan tombol di bawah untuk melihat koreksi dan pembahasannya."
              : `Masih ada ${belum} soal yang belum dijawab. Soal yang dikosongkan tetap diberi pembahasan, jadi Anda boleh menyelesaikannya sekarang.`}
          </p>
          <Button
            type="button"
            onClick={() => kumpulkan(false)}
            disabled={proses}
            className="mt-4 w-full sm:w-auto"
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Selesai &amp; lihat pembahasan
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatWaktu(detik: number) {
  const aman = Math.max(0, detik);
  const menit = Math.floor(aman / 60);
  const sisa = aman % 60;
  return `${String(menit).padStart(2, "0")}:${String(sisa).padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/*                                  Bagian                                    */
/* -------------------------------------------------------------------------- */

/**
 * Deret, matriks, atau pola yang perlu lebar huruf tetap.
 *
 * Dibungkus wadah yang dapat digeser mendatar supaya baris panjang tidak
 * memaksa seluruh halaman ikut melebar di layar ponsel.
 */
function PolaSoal({ pola }: { pola?: string[] }) {
  if (!pola?.length) return null;

  return (
    <div className="mt-4 w-full min-w-0 overflow-x-auto rounded-xl border border-line bg-navy-50/50 px-4 py-3">
      <pre className="w-max font-mono text-sm leading-7 text-navy-900">
        {pola.join("\n")}
      </pre>
    </div>
  );
}

function PanelNavigasi({
  soal,
  jawaban,
  aktif,
  onPilih,
  judulPaket,
}: {
  soal: SoalIqLatihan[];
  jawaban: Record<number, HurufIq>;
  aktif: number;
  onPilih: (indeks: number) => void;
  judulPaket?: string;
}) {
  const terjawab = Object.keys(jawaban).length;

  return (
    <div className="min-w-0 space-y-4 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)]">
      <div>
        <h2 className="text-sm font-semibold text-navy-900">Navigasi Soal</h2>
        <p className="mt-1 text-xs text-muted">
          {judulPaket ? `${judulPaket} · ` : ""}
          {terjawab} terjawab · {soal.length - terjawab} belum
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
        <p className="hidden pt-1 leading-relaxed lg:block">
          Pintasan: <b className="text-navy-700">←</b> /{" "}
          <b className="text-navy-700">→</b> pindah soal,{" "}
          <b className="text-navy-700">A–D</b> memilih jawaban.
        </p>
      </div>
    </div>
  );
}

/**
 * Ringkasan hasil latihan.
 *
 * Sengaja hanya memuat cacah benar, salah, dan kosong — tanpa nilai, tanpa
 * persentase yang menyerupai skor, dan tanpa angka IQ.
 */
function RingkasanHasil({
  paketNama,
  hasil,
}: {
  paketNama: string;
  hasil: HasilLatihanIq;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="min-w-0 space-y-1">
        <h2 className="text-lg font-semibold text-navy-900">
          Hasil latihan · {paketNama}
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          Latihan ini tidak menghasilkan angka IQ dan tidak masuk Riwayat
          Hasil try out akademik. Hasilnya tersimpan dan terbaca pengajar.
          Gunakan pembahasan di bawah untuk menelusuri cara berpikir tiap
          soal, terutama yang jawabannya keliru.
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
            Benar per kategori
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

/** Satu butir pada ulasan: soal, jawaban peserta, kunci, dan pembahasannya. */
function KartuUlasan({
  soal,
  koreksi,
}: {
  soal: SoalIqLatihan;
  koreksi: KoreksiIq;
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

      <PolaSoal pola={soal.pola} />

      <ul className="mt-4 space-y-1.5">
        {HURUF.map((huruf) => {
          const iniKunci = huruf === koreksi.kunci;
          const iniJawaban = huruf === koreksi.jawaban;

          return (
            <li
              key={huruf}
              className={cn(
                "flex gap-3 rounded-xl border px-3.5 py-2.5 text-sm",
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
