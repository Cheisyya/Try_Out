"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, Table2 } from "lucide-react";

import { AksiSoal } from "@/components/bank-soal/aksi-soal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Pratinjau bank soal dengan tampilan ruang ujian.
 *
 * Admin melihat butir soal persis seperti yang dilihat peserta — satu soal per
 * layar, pilihan A–D, navigasi nomor di samping — hanya saja kunci jawaban dan
 * pembahasan ikut ditampilkan, dan tiap soal membawa aksi sunting,
 * aktif/nonaktif, serta hapus.
 */

export type ButirPratinjau = {
  id: string;
  question_order: number;
  question: string;
  /** Huruf A–D sejajar dengan urutan pilihan. */
  opsi: { huruf: string; teks: string }[];
  correct_answer: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  explanation: string;
  active: boolean;
  image?: { src: string; alt: string; keterangan?: string };
  table?: { judul?: string; kolom: string[]; baris: string[][] };
};

const nadaTingkat: Record<
  ButirPratinjau["difficulty"],
  "hijau" | "navy" | "gold" | "merah"
> = {
  Easy: "hijau",
  Medium: "navy",
  Hard: "gold",
  "Very Hard": "merah",
};

export function PratinjauSoal({ daftar }: { daftar: ButirPratinjau[] }) {
  const [aktif, setAktif] = useState(0);

  // Daftar berubah setiap kali sebuah soal dihapus; indeks yang melewati ujung
  // daftar ditarik kembali supaya layar tidak kosong tanpa sebab.
  useEffect(() => {
    setAktif((n) => Math.min(n, Math.max(0, daftar.length - 1)));
  }, [daftar.length]);

  /** Panah kiri/kanan berpindah soal, sama seperti di ruang ujian. */
  useEffect(() => {
    const padaTombol = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
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
        setAktif((n) => Math.min(daftar.length - 1, n + 1));
      } else if (event.key === "ArrowLeft") {
        setAktif((n) => Math.max(0, n - 1));
      }
    };

    window.addEventListener("keydown", padaTombol);
    return () => window.removeEventListener("keydown", padaTombol);
  }, [daftar.length]);

  const butir = daftar[Math.min(aktif, daftar.length - 1)];
  if (!butir) return null;

  const jumlahAktif = daftar.filter((item) => item.active).length;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-start">
      {/* ------------------------------- Soal ------------------------------- */}
      <section className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
            Soal {butir.question_order} dari {daftar.length}
          </span>
          <AksiSoal id={butir.id} aktif={butir.active} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone={nadaTingkat[butir.difficulty]}>{butir.difficulty}</Badge>
          <Badge tone="netral">{butir.category}</Badge>
          <Badge tone={butir.active ? "hijau" : "merah"}>
            {butir.active ? "Aktif" : "Nonaktif"}
          </Badge>
          {butir.image ? (
            <Badge tone="navy">
              <ImageIcon className="size-3" />
              Gambar
            </Badge>
          ) : null}
          {butir.table ? (
            <Badge tone="navy">
              <Table2 className="size-3" />
              Tabel
            </Badge>
          ) : null}
          <span className="text-xs text-muted">{butir.id}</span>
        </div>

        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-navy-900">
          {butir.question}
        </p>

        {butir.image ? (
          <figure className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={butir.image.src}
              alt={butir.image.alt}
              className="w-full max-w-xl rounded-xl border border-line bg-white"
            />
            {butir.image.keterangan ? (
              <figcaption className="mt-2 text-xs text-muted">
                {butir.image.keterangan}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        {butir.table ? (
          <figure className="mt-4">
            {butir.table.judul ? (
              <figcaption className="mb-2 text-xs font-semibold text-navy-800">
                {butir.table.judul}
              </figcaption>
            ) : null}
            <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {butir.table.kolom.map((judul) => (
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
                  {butir.table.baris.map((baris, i) => (
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

        {/* Pilihan jawaban: susunannya sama seperti ruang ujian, hanya saja
            kunci jawaban ditandai karena layar ini hanya dibuka admin. */}
        <ul className="mt-5 space-y-2.5">
          {butir.opsi.map(({ huruf, teks }) => {
            const kunci = huruf === butir.correct_answer;
            return (
              <li
                key={huruf}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm",
                  kunci
                    ? "border-emerald-300 bg-emerald-50/70 text-navy-900"
                    : "border-line bg-white text-navy-800",
                )}
              >
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
                    kunci
                      ? "bg-emerald-600 text-white"
                      : "bg-navy-50 text-navy-700",
                  )}
                >
                  {huruf}
                </span>
                <span className="leading-relaxed">{teks}</span>
                {kunci ? (
                  <span className="ml-auto shrink-0 self-center text-xs font-semibold text-emerald-700">
                    Kunci
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 rounded-xl border border-navy-100 bg-navy-50/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">
            Pembahasan
          </p>
          {butir.explanation.trim() ? (
            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-navy-800">
              {butir.explanation}
            </p>
          ) : (
            <p className="mt-1.5 text-sm font-semibold text-rose-600">
              Belum ditulis — siswa akan melihat koreksi tanpa penjelasan.
            </p>
          )}
        </div>

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
            onClick={() => setAktif((n) => Math.min(daftar.length - 1, n + 1))}
            disabled={aktif >= daftar.length - 1}
          >
            Berikutnya
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* --------------------------- Navigasi soal -------------------------- */}
      <aside className="min-w-0 space-y-4 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
        <div>
          <h2 className="text-sm font-semibold text-navy-900">Navigasi Soal</h2>
          <p className="mt-1 text-xs text-muted">
            {jumlahAktif} aktif · {daftar.length - jumlahAktif} nonaktif
          </p>
        </div>

        <ol className="grid grid-cols-6 gap-2 lg:grid-cols-5">
          {daftar.map((item, i) => {
            const ini = i === aktif;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setAktif(i)}
                  aria-current={ini ? "true" : undefined}
                  title={`Soal ${item.question_order}${item.active ? "" : " (nonaktif)"}`}
                  className={cn(
                    "grid aspect-square w-full place-items-center rounded-lg border text-sm font-semibold transition",
                    item.active
                      ? "border-navy-700 bg-navy-800 text-white"
                      : "border-rose-200 bg-rose-50 text-rose-600",
                    ini && "ring-2 ring-gold-400 ring-offset-1",
                  )}
                >
                  {item.question_order}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="space-y-2 border-t border-line pt-4 text-xs text-muted">
          <p className="flex items-center gap-2">
            <span className="size-3.5 rounded border border-navy-700 bg-navy-800" />
            Aktif — dipakai saat ujian
          </p>
          <p className="flex items-center gap-2">
            <span className="size-3.5 rounded border border-rose-200 bg-rose-50" />
            Nonaktif — tersimpan, tidak diujikan
          </p>
          <p className="pt-1 leading-relaxed">
            Pintasan: <b className="text-navy-700">←</b> /{" "}
            <b className="text-navy-700">→</b> berpindah soal.
          </p>
        </div>
      </aside>
    </div>
  );
}
