"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink, buttonStyles } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Table, Td, Th, TableWrapper } from "@/components/ui/table";
import {
  konfirmasiImport,
  pratinjauExcel,
  pratinjauPdf,
  type HasilKonfirmasi,
} from "@/lib/actions-import";
import type { HasilPratinjau } from "@/lib/import/tipe";
import { DIFFICULTIES } from "@/lib/bank-soal/skema";
import { cn } from "@/lib/utils";

export type PilihanPaket = {
  id: string;
  nama: string;
  mataUji: { subject: string; kategori: string[] }[];
};

const kelasSelect =
  "h-11 w-full rounded-xl border border-navy-100 bg-white px-3.5 text-sm text-navy-900 shadow-sm outline-none transition focus:border-navy-400 focus:ring-4 focus:ring-navy-100";
const kelasBerkas =
  "block w-full text-sm text-navy-800 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-navy-800 hover:file:bg-navy-100";

export function ImportSoal({ paketPilihan }: { paketPilihan: PilihanPaket[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"excel" | "pdf">("excel");
  const [hasilSimpan, setHasilSimpan] = useState<HasilKonfirmasi | null>(null);

  const [pratinjauXls, aksiExcel] = useActionState<HasilPratinjau | null, FormData>(
    pratinjauExcel,
    null,
  );
  const [pratinjauPdfState, aksiPdf] = useActionState<HasilPratinjau | null, FormData>(
    pratinjauPdf,
    null,
  );

  const pratinjau = tab === "excel" ? pratinjauXls : pratinjauPdfState;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <TombolTab
          aktif={tab === "excel"}
          onClick={() => {
            setTab("excel");
            setHasilSimpan(null);
          }}
          icon={FileSpreadsheet}
        >
          Impor Excel
        </TombolTab>
        <TombolTab
          aktif={tab === "pdf"}
          onClick={() => {
            setTab("pdf");
            setHasilSimpan(null);
          }}
          icon={FileText}
        >
          Impor PDF
        </TombolTab>
      </div>

      {tab === "excel" ? (
        <Card>
          <CardHeader
            judul="Unggah Berkas Excel"
            deskripsi="Pilih paket tujuan, lalu unggah berkasnya. Gunakan template agar susunan kolom sesuai; kolom explanation wajib diisi karena dibaca siswa."
            aksi={
              // Anchor biasa, bukan <Link>: unduhan berkas harus ditangani
              // peramban, bukan router Next.
              <a
                href="/admin/import/template"
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                <Download className="size-4" />
                Unduh Template
              </a>
            }
          />
          <CardBody>
            <form action={aksiExcel} className="space-y-4">
              {/* Paket tujuan dipilih di layar, sama seperti impor PDF —
                  berkasnya sendiri tidak lagi memuat kolom package. */}
              <Field
                label="Paket Tujuan"
                htmlFor="paket-excel"
                hint="Seluruh soal pada berkas ini dimasukkan ke paket tersebut."
              >
                <select
                  id="paket-excel"
                  name="paket"
                  defaultValue={paketPilihan[0]?.id ?? ""}
                  className={kelasSelect}
                  required
                >
                  {paketPilihan.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Berkas .xlsx"
                htmlFor="berkas-excel"
                hint="Maksimal 8 MB dan 300 baris per impor."
              >
                <input
                  id="berkas-excel"
                  name="berkas"
                  type="file"
                  accept=".xlsx"
                  className={kelasBerkas}
                  required
                />
              </Field>
              <TombolProses label="Baca & Pratinjau" />
            </form>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader
            judul="Unggah Berkas PDF"
            deskripsi="Soal dikenali dari pola nomor, pilihan A–D, dan baris kunci jawaban. Hasil parsing wajib dikonfirmasi sebelum disimpan."
          />
          <CardBody>
            <FormPdf aksi={aksiPdf} paketPilihan={paketPilihan} />
          </CardBody>
        </Card>
      )}

      {pratinjau && !pratinjau.ok ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 size-4.5 shrink-0" />
          <div>
            <p className="font-semibold">Berkas tidak dapat diproses</p>
            <p className="mt-1 leading-relaxed">{pratinjau.galat}</p>
          </div>
        </div>
      ) : null}

      {pratinjau?.ok ? (
        <Pratinjau
          // Kunci berubah setiap ada hasil pratinjau baru sehingga status
          // "dibatalkan" dari unggahan sebelumnya tidak ikut terbawa.
          key={pratinjau.dibuatPada}
          pratinjau={pratinjau}
          hasilSimpan={hasilSimpan}
          onSelesai={(hasil) => {
            setHasilSimpan(hasil);
            router.refresh();
          }}
          onBatal={() => setHasilSimpan(null)}
        />
      ) : null}
    </>
  );
}

function TombolTab({
  aktif,
  onClick,
  icon: Icon,
  children,
}: {
  aktif: boolean;
  onClick: () => void;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
        aktif
          ? "border-navy-800 bg-navy-900 text-white"
          : "border-line bg-white text-navy-700 hover:bg-navy-50",
      )}
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}

function FormPdf({
  aksi,
  paketPilihan,
}: {
  aksi: (formData: FormData) => void;
  paketPilihan: PilihanPaket[];
}) {
  const [paketId, setPaketId] = useState(paketPilihan[0]?.id ?? "");
  const paket = paketPilihan.find((item) => item.id === paketId);
  const [subject, setSubject] = useState(paket?.mataUji[0]?.subject ?? "");

  const mataUji = paket?.mataUji ?? [];
  const kategori =
    mataUji.find((item) => item.subject === subject)?.kategori ?? [];

  return (
    <form action={aksi} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Paket Tujuan" htmlFor="paket">
          <select
            id="paket"
            name="paket"
            value={paketId}
            onChange={(event) => {
              const nilai = event.target.value;
              setPaketId(nilai);
              const berikut = paketPilihan.find((item) => item.id === nilai);
              setSubject(berikut?.mataUji[0]?.subject ?? "");
            }}
            className={kelasSelect}
            required
          >
            {paketPilihan.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Mata Pelajaran" htmlFor="subject">
          <select
            id="subject"
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className={kelasSelect}
            required
          >
            {mataUji.map((item) => (
              <option key={item.subject} value={item.subject}>
                {item.subject}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Kategori Materi"
          htmlFor="category"
          hint="Dipakai untuk seluruh soal, kecuali PDF menuliskan baris “Kategori: ...”."
        >
          <select id="category" name="category" className={kelasSelect} required>
            {kategori.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Tingkat Kesulitan Bawaan"
          htmlFor="difficulty"
          hint="Dipakai bila PDF tidak menuliskan baris “Tingkat: ...”."
        >
          <select
            id="difficulty"
            name="difficulty"
            defaultValue="Medium"
            className={kelasSelect}
          >
            {DIFFICULTIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Berkas .pdf"
        htmlFor="berkas-pdf"
        hint="PDF harus berbasis teks, bukan hasil pindaian."
      >
        <input
          id="berkas-pdf"
          name="berkas"
          type="file"
          accept=".pdf"
          className={kelasBerkas}
          required
        />
      </Field>

      <div className="rounded-xl border border-navy-100 bg-navy-50/60 px-4 py-3 text-xs leading-relaxed text-navy-800">
        <p className="font-semibold">Format yang dikenali</p>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px]">{`1. Nilai x yang memenuhi 2x + 5 = 17 adalah ...
A. 4
B. 5
C. 6
D. 7
Kunci: C
Tingkat: Medium
Pembahasan: 2x = 12 sehingga x = 6.`}</pre>
      </div>

      <TombolProses label="Ekstraksi & Pratinjau" />
    </form>
  );
}

function TombolProses({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit" disabled={pending}>
        {pending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {pending ? "Memproses berkas..." : label}
      </Button>
      {pending ? (
        <span className="flex items-center gap-2 text-sm text-muted">
          <span className="h-1.5 w-32 overflow-hidden rounded-full bg-navy-100">
            <span className="block h-full w-1/2 animate-pulse rounded-full bg-navy-700" />
          </span>
          Membaca dan memvalidasi isi berkas
        </span>
      ) : null}
    </div>
  );
}

function Pratinjau({
  pratinjau,
  hasilSimpan,
  onSelesai,
  onBatal,
}: {
  pratinjau: HasilPratinjau;
  hasilSimpan: HasilKonfirmasi | null;
  onSelesai: (hasil: HasilKonfirmasi) => void;
  onBatal: () => void;
}) {
  const [dibatalkan, setDibatalkan] = useState(false);
  const [proses, mulaiTransisi] = useTransition();

  if (dibatalkan) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-navy-50/60 px-4 py-3.5 text-sm text-navy-800">
        <Info className="mt-0.5 size-4.5 shrink-0 text-navy-600" />
        <p>
          Impor dibatalkan. Tidak ada data yang masuk ke bank soal. Unggah berkas
          lain bila ingin mengulang.
        </p>
      </div>
    );
  }

  const barisValid = new Set(
    pratinjau.baris.filter((item) => item.valid).map((item) => item.baris),
  );
  const mentahValid = pratinjau.mentah.filter((item) => barisValid.has(item.baris));

  const simpan = () => {
    mulaiTransisi(async () => {
      const hasil = await konfirmasiImport(mentahValid);
      onSelesai(hasil);
    });
  };

  return (
    <Card>
      <CardHeader
        judul="Pratinjau Sebelum Import"
        deskripsi={`${pratinjau.namaBerkas} · ${pratinjau.baris.length} baris terbaca. Belum ada data yang disimpan.`}
        aksi={
          <div className="flex flex-wrap gap-2">
            <Badge tone="hijau">{pratinjau.jumlahValid} siap diimpor</Badge>
            {pratinjau.jumlahBermasalah > 0 ? (
              <Badge tone="merah">{pratinjau.jumlahBermasalah} bermasalah</Badge>
            ) : null}
          </div>
        }
      />
      <CardBody className="space-y-4 p-0 sm:p-0">
        {pratinjau.catatan.length > 0 ? (
          <ul className="space-y-1 border-b border-line bg-navy-50/50 px-5 py-3 text-xs text-navy-800 sm:px-6">
            {pratinjau.catatan.map((catatan) => (
              <li key={catatan}>· {catatan}</li>
            ))}
          </ul>
        ) : null}

        {hasilSimpan ? (
          <div
            role="status"
            className={cn(
              "mx-5 mt-4 rounded-xl border px-4 py-3 text-sm sm:mx-6",
              hasilSimpan.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-700",
            )}
          >
            <p className="flex items-center gap-2 font-semibold">
              {hasilSimpan.ok ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <AlertCircle className="size-4" />
              )}
              {hasilSimpan.pesan}
            </p>
            {hasilSimpan.gagal.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                {hasilSimpan.gagal.slice(0, 5).map((item) => (
                  <li key={item.baris}>
                    Baris {item.baris}: {item.masalah.join("; ")}
                  </li>
                ))}
              </ul>
            ) : null}
            {hasilSimpan.ok ? (
              <ButtonLink href="/admin/bank-soal" size="sm" className="mt-3">
                Buka Bank Soal
              </ButtonLink>
            ) : null}
          </div>
        ) : null}

        <TableWrapper>
          <Table className="min-w-[980px]">
            <thead>
              <tr>
                <Th>Baris</Th>
                <Th>Status</Th>
                <Th>Paket</Th>
                <Th>Mata Pelajaran</Th>
                <Th>Pertanyaan</Th>
                <Th>Kunci</Th>
                <Th>Tingkat</Th>
                <Th>Catatan</Th>
              </tr>
            </thead>
            <tbody>
              {pratinjau.baris.map((item) => (
                <tr
                  key={item.baris}
                  className={item.valid ? "" : "bg-rose-50/40"}
                >
                  <Td className="whitespace-nowrap font-mono text-xs">
                    {item.baris}
                  </Td>
                  <Td>
                    <Badge tone={item.valid ? "hijau" : "merah"}>
                      {item.valid ? "Siap" : "Bermasalah"}
                    </Badge>
                  </Td>
                  <Td className="whitespace-nowrap">
                    {item.data?.paketNama ?? (item.ringkas.paket || "—")}
                  </Td>
                  <Td className="whitespace-nowrap text-muted">
                    {item.data?.subject ?? (item.ringkas.subject || "—")}
                  </Td>
                  <Td>
                    <span className="line-clamp-2 max-w-md text-sm text-navy-800">
                      {item.ringkas.question || "—"}
                    </span>
                  </Td>
                  <Td className="whitespace-nowrap font-semibold">
                    {item.data?.correct_answer ?? (item.ringkas.correct_answer || "—")}
                  </Td>
                  <Td className="whitespace-nowrap">
                    {item.data?.difficulty ?? (item.ringkas.difficulty || "—")}
                  </Td>
                  <Td>
                    {item.masalah.length === 0 ? (
                      <span className="text-xs text-muted">—</span>
                    ) : (
                      <ul className="space-y-1 text-xs text-rose-700">
                        {item.masalah.map((pesan) => (
                          <li key={pesan}>{pesan}</li>
                        ))}
                      </ul>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-muted">
            Hanya baris berstatus <b>Siap</b> yang akan disimpan. Baris
            bermasalah dilewati dan dapat diperbaiki lalu diunggah ulang.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDibatalkan(true);
                onBatal();
              }}
              disabled={proses}
            >
              <X className="size-4" />
              Batalkan Import
            </Button>
            <Button
              type="button"
              onClick={simpan}
              disabled={proses || mentahValid.length === 0 || Boolean(hasilSimpan?.ok)}
            >
              {proses ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {proses
                ? "Menyimpan..."
                : `Konfirmasi Import ${mentahValid.length} Soal`}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
