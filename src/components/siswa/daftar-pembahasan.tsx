import { CheckCircle2, CircleSlash, Lightbulb, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { HURUF_OPSI } from "@/lib/bank-soal/skema";
import type {
  ButirPembahasan,
  PembahasanMataUji,
} from "@/lib/pengerjaan/pembahasan";
import { formatTanggalWaktu } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Pembahasan satu mata uji: soal, jawaban peserta, kunci, dan penjelasannya.
 *
 * Komponen ini hanya menerima data yang sudah disaring di server — mata uji yang
 * belum dikumpulkan tidak pernah sampai ke sini.
 */
export function KartuMataUji({ mata }: { mata: PembahasanMataUji }) {
  return (
    <Card>
      <CardHeader
        judul={`${mata.subject} · ${mata.sesiNama}`}
        deskripsi={`Dikumpulkan ${formatTanggalWaktu(new Date(mata.dikumpulkanPada).toISOString())}.`}
        aksi={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={mata.nilai >= 70 ? "hijau" : "gold"}>
              Nilai {mata.nilai}
            </Badge>
            <Badge tone="netral">
              {mata.benar} benar · {mata.salah} salah · {mata.kosong} kosong
            </Badge>
          </div>
        }
      />
      <CardBody className="p-0 sm:p-0">
        <ol className="divide-y divide-line">
          {mata.butir.map((butir) => (
            <li key={butir.nomor} className="px-4 py-5 sm:px-6">
              <ButirSoal butir={butir} />
            </li>
          ))}
        </ol>
      </CardBody>
    </Card>
  );
}

function ButirSoal({ butir }: { butir: ButirPembahasan }) {
  const kosong = butir.jawaban === null;

  return (
    <div className="space-y-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-navy-50 px-2 py-0.5 text-xs font-bold text-navy-700">
          Soal {butir.nomor}
        </span>
        {kosong ? (
          <Badge tone="netral">
            <CircleSlash className="size-3" />
            Tidak dijawab
          </Badge>
        ) : butir.benar ? (
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
        <Badge tone="netral">{butir.kategori}</Badge>
      </div>

      <p className="whitespace-pre-line text-sm leading-relaxed text-navy-900">
        {butir.pertanyaan}
      </p>

      {butir.gambar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={butir.gambar.src}
          alt={butir.gambar.alt}
          className="max-w-full rounded-xl border border-line"
        />
      ) : null}

      {butir.tabel ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {butir.tabel.kolom.map((kolom) => (
                  <th
                    key={kolom}
                    className="border border-line bg-navy-50/60 px-3 py-2 text-left text-xs font-semibold text-navy-700"
                  >
                    {kolom}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {butir.tabel.baris.map((baris, i) => (
                <tr key={i}>
                  {baris.map((sel, j) => (
                    <td key={j} className="border border-line px-3 py-2 text-navy-800">
                      {sel}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <ul className="space-y-1.5">
        {HURUF_OPSI.map((huruf) => {
          const iniKunci = huruf === butir.kunci;
          const iniJawaban = huruf === butir.jawaban;

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
                {butir.opsi[huruf]}
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

      <div className="flex gap-3 rounded-xl border border-gold-200 bg-gold-50/70 px-4 py-3.5">
        <Lightbulb className="mt-0.5 size-4.5 shrink-0 text-gold-700" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-800">
            Pembahasan
          </p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-navy-800">
            {butir.pembahasan || (
              <span className="text-muted">
                Pembahasan untuk soal ini belum ditulis pengajar.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
