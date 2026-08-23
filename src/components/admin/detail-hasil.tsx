"use client";

import { useState } from "react";
import { Eye, ShieldAlert, ShieldCheck } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LABEL_PELANGGARAN,
  type JenisPelanggaran,
} from "@/lib/pengerjaan/tipe";

export type RincianMataUji = {
  subject: string;
  nilai: number;
  benar: number;
  salah: number;
  kosong: number;
  jumlahSoal: number;
  waktu: number;
  otomatis: boolean;
};

export type CatatanPengawasan = {
  jenis: JenisPelanggaran;
  subject: string | null;
  waktu: number;
  detail?: string;
};

export type DetailHasilProps = {
  studentNama: string;
  studentId: string;
  paketNama: string;
  sesiNama: string;
  status: string;
  mulai: number;
  selesaiPada: number | null;
  jumlahJawaban: number;
  mataUji: RincianMataUji[];
  pelanggaran: CatatanPengawasan[];
};

const waktuLokal = (nilai: number) =>
  new Date(nilai).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Modal rincian satu percobaan pengerjaan peserta. */
export function DetailHasil({ detail }: { detail: DetailHasilProps }) {
  const [terbuka, setTerbuka] = useState(false);

  const total = detail.mataUji.reduce(
    (akumulasi, item) => ({
      benar: akumulasi.benar + item.benar,
      salah: akumulasi.salah + item.salah,
      soal: akumulasi.soal + item.jumlahSoal,
    }),
    { benar: 0, salah: 0, soal: 0 },
  );
  const rataRata =
    detail.mataUji.length === 0
      ? 0
      : Math.round(
          detail.mataUji.reduce((jumlah, item) => jumlah + item.nilai, 0) /
            detail.mataUji.length,
        );

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setTerbuka(true)}>
        <Eye className="size-4" />
        Detail
      </Button>

      <Modal
        terbuka={terbuka}
        lebar="lg"
        judul={`${detail.studentNama} · ${detail.paketNama}`}
        deskripsi={`${detail.sesiNama} · Peserta ${detail.studentId}`}
        onTutup={() => setTerbuka(false)}
      >
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Rata-rata Nilai", nilai: String(rataRata) },
              { label: "Total Benar", nilai: String(total.benar) },
              { label: "Total Salah", nilai: String(total.salah) },
              { label: "Total Soal", nilai: String(total.soal) },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-navy-50/70 px-3.5 py-3">
                <dt className="text-xs text-muted">{item.label}</dt>
                <dd className="mt-1 text-lg font-bold text-navy-900">
                  {item.nilai}
                </dd>
              </div>
            ))}
          </dl>

          <div className="space-y-2 text-sm text-muted">
            <p>
              Status percobaan:{" "}
              <Badge tone={detail.status === "selesai" ? "hijau" : "gold"}>
                {detail.status === "selesai" ? "Selesai" : "Berlangsung"}
              </Badge>
            </p>
            <p>Mulai: {waktuLokal(detail.mulai)}</p>
            <p>
              Selesai:{" "}
              {detail.selesaiPada ? waktuLokal(detail.selesaiPada) : "belum selesai"}
            </p>
            <p>Jawaban tersimpan: {detail.jumlahJawaban} butir</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr>
                  {["Mata Uji", "Nilai", "Benar", "Salah", "Kosong", "Soal", "Dikumpulkan"].map(
                    (judul) => (
                      <th
                        key={judul}
                        className="border-b border-line bg-navy-50/60 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-navy-700"
                      >
                        {judul}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {detail.mataUji.map((item) => (
                  <tr key={item.subject}>
                    <td className="border-b border-line px-3 py-2 font-medium text-navy-900">
                      {item.subject}
                    </td>
                    <td className="border-b border-line px-3 py-2 font-semibold text-navy-900">
                      {item.nilai}
                    </td>
                    <td className="border-b border-line px-3 py-2 text-emerald-600">
                      {item.benar}
                    </td>
                    <td className="border-b border-line px-3 py-2 text-rose-600">
                      {item.salah}
                    </td>
                    <td className="border-b border-line px-3 py-2 text-slate-500">
                      {item.kosong}
                    </td>
                    <td className="border-b border-line px-3 py-2 text-navy-800">
                      {item.jumlahSoal}
                    </td>
                    <td className="whitespace-nowrap border-b border-line px-3 py-2 text-muted">
                      {waktuLokal(item.waktu)}
                      {item.otomatis ? (
                        <Badge tone="netral" className="ml-2">
                          otomatis
                        </Badge>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <RingkasanPengawasan catatan={detail.pelanggaran} />

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setTerbuka(false)}>
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/**
 * Catatan pengawasan sisi peramban. Bersifat informatif: nilai peserta tidak
 * pernah dikurangi otomatis oleh sistem, penilaian pelanggaran ada pada panitia.
 */
function RingkasanPengawasan({ catatan }: { catatan: CatatanPengawasan[] }) {
  if (catatan.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <ShieldCheck className="mt-0.5 size-4.5 shrink-0" />
        <p>Tidak ada kejadian pengawasan yang tercatat pada sesi ini.</p>
      </div>
    );
  }

  const rekap = new Map<JenisPelanggaran, number>();
  for (const item of catatan) {
    rekap.set(item.jenis, (rekap.get(item.jenis) ?? 0) + 1);
  }

  const terbaru = [...catatan].sort((a, b) => b.waktu - a.waktu).slice(0, 10);

  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3.5">
      <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
        <ShieldAlert className="size-4.5 shrink-0" />
        {catatan.length} kejadian pengawasan tercatat
      </p>

      <ul className="flex flex-wrap gap-1.5">
        {[...rekap.entries()].map(([jenis, jumlah]) => (
          <li
            key={jenis}
            className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-200"
          >
            {LABEL_PELANGGARAN[jenis]} · {jumlah}×
          </li>
        ))}
      </ul>

      <details className="text-xs text-amber-900">
        <summary className="cursor-pointer font-semibold">
          Lihat {Math.min(10, catatan.length)} kejadian terakhir
        </summary>
        <ol className="mt-2 space-y-1.5">
          {terbaru.map((item, i) => (
            <li key={`${item.waktu}-${i}`} className="leading-relaxed">
              <span className="text-amber-700">{waktuLokal(item.waktu)}</span> ·{" "}
              {LABEL_PELANGGARAN[item.jenis]}
              {item.subject ? ` · ${item.subject}` : ""}
              {item.detail ? ` (${item.detail})` : ""}
            </li>
          ))}
        </ol>
      </details>

      <p className="text-xs leading-relaxed text-amber-800">
        Catatan ini tidak memengaruhi nilai. Keputusan atas pelanggaran
        sepenuhnya berada pada panitia seleksi.
      </p>
    </div>
  );
}
