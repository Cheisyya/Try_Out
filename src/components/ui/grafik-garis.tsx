"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Grafik garis perkembangan nilai.
 *
 * Digambar sebagai SVG inline, tanpa pustaka grafik: satu-satunya bentuk yang
 * dibutuhkan portal ini adalah garis 0–100, dan pustaka grafik akan menambah
 * ratusan kilobyte untuk itu. Semua ukuran mengikuti spesifikasi mark: garis
 * 2px, penanda r=4 dengan cincin warna permukaan, gridline hairline solid.
 *
 * Aplikasi ini bertema terang saja (lihat `globals.css`), jadi paletnya
 * disetel untuk permukaan putih dan tidak menyediakan varian gelap.
 */

export type SeriGrafik = {
  nama: string;
  warna: string;
  /** Sejajar dengan `labelX`; null berarti paket itu belum dikerjakan. */
  titik: (number | null)[];
};

const LEBAR = 720;
const TINGGI = 260;
const PAD = { atas: 16, kanan: 92, bawah: 34, kiri: 40 };
const TICK_Y = [0, 25, 50, 75, 100];
/** Setengah panjang ruas penanda ketika sebuah seri baru punya satu titik. */
const PANJANG_TUNGGAL = 18;

const AREA_LEBAR = LEBAR - PAD.kiri - PAD.kanan;
const AREA_TINGGI = TINGGI - PAD.atas - PAD.bawah;

export function GrafikGaris({
  labelX,
  seri,
  satuan = "nilai",
}: {
  labelX: string[];
  seri: SeriGrafik[];
  satuan?: string;
}) {
  const idDasar = useId();
  const [aktif, setAktif] = useState<number | null>(null);
  const [tabel, setTabel] = useState(false);

  const banyakSeri = seri.length > 1;

  const x = (i: number) =>
    labelX.length === 1
      ? PAD.kiri + AREA_LEBAR / 2
      : PAD.kiri + (i / (labelX.length - 1)) * AREA_LEBAR;
  const y = (nilai: number) =>
    PAD.atas + AREA_TINGGI - (Math.min(100, Math.max(0, nilai)) / 100) * AREA_TINGGI;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Legenda wajib ada begitu serinya lebih dari satu. */}
        {banyakSeri ? (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {seri.map((item) => (
              <li
                key={item.nama}
                className="flex items-center gap-1.5 text-xs font-medium text-navy-800"
              >
                <span
                  aria-hidden
                  className="h-0.5 w-4 rounded-full"
                  style={{ backgroundColor: item.warna }}
                />
                {item.nama}
              </li>
            ))}
          </ul>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={() => setTabel((n) => !n)}
          className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-navy-700 transition hover:bg-navy-50"
        >
          {tabel ? "Lihat grafik" : "Lihat tabel"}
        </button>
      </div>

      {tabel ? (
        <TabelNilai labelX={labelX} seri={seri} />
      ) : (
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${LEBAR} ${TINGGI}`}
            className="h-auto w-full min-w-[520px]"
            role="img"
            aria-label={`Grafik garis ${satuan} pada ${labelX.length} paket try out`}
            onPointerLeave={() => setAktif(null)}
          >
            {/* Gridline + tick sumbu Y */}
            {TICK_Y.map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD.kiri}
                  x2={LEBAR - PAD.kanan}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke={tick === 0 ? "#c3c2b7" : "#e1e0d9"}
                  strokeWidth={1}
                />
                <text
                  x={PAD.kiri - 8}
                  y={y(tick) + 4}
                  textAnchor="end"
                  className="fill-[#898781] text-[11px] [font-variant-numeric:tabular-nums]"
                >
                  {tick}
                </text>
              </g>
            ))}

            {/* Label sumbu X */}
            {labelX.map((label, i) => (
              <text
                key={label}
                x={x(i)}
                y={TINGGI - 12}
                textAnchor="middle"
                className="fill-[#898781] text-[11px]"
              >
                {label}
              </text>
            ))}

            {/* Penanda kolom yang sedang disorot */}
            {aktif !== null ? (
              <line
                x1={x(aktif)}
                x2={x(aktif)}
                y1={PAD.atas}
                y2={PAD.atas + AREA_TINGGI}
                stroke="#c3c2b7"
                strokeWidth={1}
              />
            ) : null}

            {/* Garis tiap seri */}
            {seri.map((item) => {
              const titikTerisi = terisi(item.titik);
              return (
              <g key={item.nama}>
                {titikTerisi.length === 1 ? (
                  // Satu titik tidak dapat membentuk garis, sementara penanda
                  // sendirian terbaca sebagai grafik titik. Ruas pendek di
                  // sekitar titik itu menjaga bentuknya tetap garis sampai
                  // paket berikutnya dikerjakan.
                  <line
                    key={`${idDasar}-${item.nama}-tunggal`}
                    x1={x(titikTerisi[0].i) - PANJANG_TUNGGAL}
                    x2={x(titikTerisi[0].i) + PANJANG_TUNGGAL}
                    y1={y(titikTerisi[0].nilai)}
                    y2={y(titikTerisi[0].nilai)}
                    stroke={item.warna}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                ) : (
                  <polyline
                    key={`${idDasar}-${item.nama}-garis`}
                    fill="none"
                    stroke={item.warna}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={titikTerisi
                      .map(({ i, nilai }) => `${x(i)},${y(nilai)}`)
                      .join(" ")}
                  />
                )}

                {item.titik.map((nilai, i) =>
                  nilai === null ? null : (
                    <circle
                      key={`${idDasar}-${item.nama}-t-${i}`}
                      cx={x(i)}
                      cy={y(nilai)}
                      r={4}
                      fill={item.warna}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ),
                )}

                {/* Label langsung di ujung garis — pelega untuk warna
                    berkontras rendah, sekaligus identitas tanpa mencocokkan
                    warna. */}
                <LabelUjung seri={item} x={x} y={y} />
              </g>
              );
            })}

            {/* Area sentuh per kolom untuk sorotan */}
            {labelX.map((label, i) => (
              <rect
                key={`${idDasar}-hit-${i}`}
                x={x(i) - AREA_LEBAR / Math.max(1, labelX.length * 2)}
                y={PAD.atas}
                width={AREA_LEBAR / Math.max(1, labelX.length) || AREA_LEBAR}
                height={AREA_TINGGI}
                fill="transparent"
                onPointerEnter={() => setAktif(i)}
              />
            ))}
          </svg>
        </div>
      )}

      {/* Rincian kolom yang sedang disorot */}
      {!tabel && aktif !== null ? (
        <div className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm">
          <p className="font-semibold text-navy-900">{labelX[aktif]}</p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {seri.map((item) => (
              <li
                key={item.nama}
                className="flex items-center gap-1.5 text-xs text-navy-800"
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.warna }}
                />
                {item.nama}:{" "}
                <b className="[font-variant-numeric:tabular-nums]">
                  {item.titik[aktif] ?? "—"}
                </b>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------- Pembantu -------------------------------- */

/**
 * Titik yang benar-benar bernilai, beserta posisi paketnya.
 *
 * Seluruhnya disambung menjadi satu garis — paket yang mata ujinya belum
 * dikerjakan dilompati, bukan memutus garis. Memutusnya membuat grafik tampak
 * seperti kumpulan titik lepas justru pada kasus yang paling sering terjadi:
 * satu mata pelajaran yang hanya muncul di sebagian paket.
 */
function terisi(titik: (number | null)[]) {
  return titik.flatMap((nilai, i) => (nilai === null ? [] : [{ i, nilai }]));
}

function LabelUjung({
  seri,
  x,
  y,
}: {
  seri: SeriGrafik;
  x: (i: number) => number;
  y: (nilai: number) => number;
}) {
  const terakhir = [...seri.titik]
    .map((nilai, i) => ({ nilai, i }))
    .reverse()
    .find((item) => item.nilai !== null);

  if (!terakhir || terakhir.nilai === null) return null;

  return (
    <text
      x={x(terakhir.i) + 10}
      y={y(terakhir.nilai) + 4}
      className="fill-[#52514e] text-[11px] font-semibold [font-variant-numeric:tabular-nums]"
    >
      {seri.nama} {terakhir.nilai}
    </text>
  );
}

function TabelNilai({
  labelX,
  seri,
}: {
  labelX: string[];
  seri: SeriGrafik[];
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-line px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-navy-700">
              Paket
            </th>
            {seri.map((item) => (
              <th
                key={item.nama}
                className="border-b border-line px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-navy-700"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className={cn("size-2 shrink-0 rounded-full")}
                    style={{ backgroundColor: item.warna }}
                  />
                  {item.nama}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labelX.map((label, i) => (
            <tr key={label}>
              <td className="border-b border-line px-3 py-2 font-medium text-navy-900">
                {label}
              </td>
              {seri.map((item) => (
                <td
                  key={item.nama}
                  className="border-b border-line px-3 py-2 text-navy-800 [font-variant-numeric:tabular-nums]"
                >
                  {item.titik[i] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
