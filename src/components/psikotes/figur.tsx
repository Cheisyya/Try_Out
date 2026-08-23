"use client";

import { useId } from "react";

import {
  uraikanFigur,
  type BentukFigur,
  type FigurTerurai,
  type KodeFigur,
  type Stimulus,
} from "@/lib/psikotes/tipe";
import { cn } from "@/lib/utils";

/**
 * Penyaji gambar figural.
 *
 * Setiap sel digambar sebagai SVG dari kode ringkas pada bank soal (lihat
 * `uraikanFigur`), bukan dimuat sebagai berkas gambar. Akibatnya soal figural
 * ikut terbundel bersama kode: tidak ada permintaan jaringan tambahan, tidak
 * ada berkas yang bisa hilang dari penyimpanan, dan tampilannya tetap tajam di
 * layar kerapatan tinggi maupun saat diperbesar.
 *
 * Warnanya mengikuti `currentColor` supaya satu berkas gambar melayani semua
 * keadaan: soal biasa, opsi terpilih, kunci jawaban, dan jawaban keliru.
 */

/* ------------------------------ Titik bentuk ------------------------------ */

/** Poligon digambar pada kanvas 100x100 dengan tepi aman 12 satuan. */
const POLIGON: Partial<Record<BentukFigur, string>> = {
  segitiga: "50,14 86,82 14,82",
  persegi: "16,16 84,16 84,84 16,84",
  belahketupat: "50,12 88,50 50,88 12,50",
  segilima: "50,12 88,40 73,84 27,84 12,40",
  segienam: "50,12 83,31 83,69 50,88 17,69 17,31",
  bintang:
    "50,10 61,38 91,38 67,56 76,85 50,67 24,85 33,56 9,38 39,38",
  panah: "18,42 58,42 58,24 88,50 58,76 58,58 18,58",
};

function Bentuk({
  figur,
  idKlip,
}: {
  figur: FigurTerurai;
  idKlip: string;
}) {
  const { bentuk, isi } = figur;

  if (bentuk === "kosong") return null;

  const goresan = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 5,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  if (bentuk === "silang") {
    return (
      <g {...goresan}>
        <line x1={20} y1={20} x2={80} y2={80} />
        <line x1={80} y1={20} x2={20} y2={80} />
      </g>
    );
  }

  if (bentuk === "garis") {
    return <line x1={14} y1={50} x2={86} y2={50} {...goresan} />;
  }

  /* Isi "separuh" digambar dengan menumpuk bentuk terisi yang dipotong
     setengah kanvas di atas bentuk bergaris — cara yang sama bekerja untuk
     lingkaran maupun poligon tanpa perlu menghitung ulang titiknya. */
  const bagian = (props: Record<string, unknown>) =>
    bentuk === "lingkaran" ? (
      <circle cx={50} cy={50} r={34} {...props} />
    ) : (
      <polygon points={POLIGON[bentuk] ?? ""} {...props} />
    );

  if (isi === "penuh") {
    return bagian({ fill: "currentColor", stroke: "currentColor", strokeWidth: 5, strokeLinejoin: "round" });
  }

  if (isi === "separuh") {
    return (
      <>
        <defs>
          <clipPath id={idKlip}>
            <rect x={0} y={0} width={50} height={100} />
          </clipPath>
        </defs>
        {bagian({ fill: "currentColor", stroke: "none", clipPath: `url(#${idKlip})` })}
        {bagian(goresan)}
      </>
    );
  }

  return bagian(goresan);
}

/* --------------------------- Penataan banyak bentuk ------------------------ */

/** Kotak tempat tiap salinan digambar ketika satu sel memuat lebih dari satu. */
const TATA_LETAK: Record<number, { x: number; y: number; s: number }[]> = {
  1: [{ x: 0, y: 0, s: 100 }],
  2: [
    { x: 2, y: 26, s: 48 },
    { x: 50, y: 26, s: 48 },
  ],
  3: [
    { x: 0, y: 33, s: 34 },
    { x: 33, y: 33, s: 34 },
    { x: 66, y: 33, s: 34 },
  ],
  4: [
    { x: 2, y: 2, s: 48 },
    { x: 50, y: 2, s: 48 },
    { x: 2, y: 50, s: 48 },
    { x: 50, y: 50, s: 48 },
  ],
};

/**
 * Satu sel gambar.
 *
 * `label` dipakai sebagai teks alternatif; soal figural tetap harus punya
 * penjelasan kata bagi pengguna pembaca layar, sehingga tiap opsi pada bank
 * soal wajib menyertakan teksnya.
 */
export function Figur({
  kode,
  label,
  className,
}: {
  kode: KodeFigur;
  label?: string;
  className?: string;
}) {
  // `useId` menyisipkan titik dua, yang tidak sah pada pemilih CSS dan hanya
  // kebetulan bekerja pada rujukan `url(#...)`. Dibersihkan agar tidak ada yang
  // bergantung pada kebetulan itu.
  const id = `figur${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const figur = uraikanFigur(kode);

  if (figur.tanya) {
    return (
      <span
        role="img"
        aria-label={label ?? "Sel yang ditanyakan"}
        className={cn(
          "grid size-full place-items-center text-2xl font-bold text-langit-600 sm:text-3xl",
          className,
        )}
      >
        ?
      </span>
    );
  }

  const susunan = TATA_LETAK[figur.jumlah] ?? TATA_LETAK[1];

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={label ?? "Gambar figural"}
      className={cn("size-full text-navy-900", className)}
    >
      {susunan.map((kotak, i) => (
        <svg
          key={i}
          x={kotak.x}
          y={kotak.y}
          width={kotak.s}
          height={kotak.s}
          viewBox="0 0 100 100"
          overflow="visible"
        >
          <g transform={`rotate(${figur.putar} 50 50)`}>
            <Bentuk figur={figur} idKlip={`${id}-${i}`} />
          </g>
        </svg>
      ))}
    </svg>
  );
}

/**
 * Papan gambar soal: deret mendatar atau matriks.
 *
 * Wadahnya dapat digeser mendatar sehingga deret panjang tidak memaksa seluruh
 * halaman melebar di layar ponsel, dan setiap sel dijaga tetap persegi supaya
 * bentuk yang diputar tidak ikut gepeng.
 */
export function PapanFigur({
  stimulus,
  className,
}: {
  stimulus: Stimulus;
  className?: string;
}) {
  const kolom = Math.max(1, stimulus.kolom);

  return (
    <div className={cn("w-full min-w-0 overflow-x-auto", className)}>
      <div
        className="grid w-max gap-2 rounded-xl border border-line bg-white p-3"
        style={{ gridTemplateColumns: `repeat(${kolom}, minmax(0, 1fr))` }}
      >
        {stimulus.sel.map((kode, i) => (
          <div
            key={i}
            className="grid size-16 place-items-center rounded-lg border border-line bg-navy-50/40 p-1.5 sm:size-20"
          >
            <Figur kode={kode} label={`Sel ${i + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
