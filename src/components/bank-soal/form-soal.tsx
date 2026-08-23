"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, LoaderCircle, Save } from "lucide-react";

import { UnggahGambar } from "@/components/bank-soal/unggah-gambar";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Label } from "@/components/ui/field";
import {
  buatSoalAksi,
  perbaruiSoalAksi,
  type FormSoalState,
} from "@/lib/actions-bank-soal";
import {
  DIFFICULTIES,
  HURUF_OPSI,
  KATEGORI,
  SUBJECTS,
  type Soal,
  type Subject,
} from "@/lib/bank-soal/skema";
import { cn } from "@/lib/utils";

const kelasSelect =
  "h-11 w-full rounded-xl border border-navy-100 bg-white px-3.5 text-sm text-navy-900 shadow-sm outline-none transition focus:border-navy-400 focus:ring-4 focus:ring-navy-100";
const kelasTextarea =
  "w-full rounded-xl border border-navy-100 bg-white px-3.5 py-3 text-sm leading-relaxed text-navy-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-navy-400 focus:ring-4 focus:ring-navy-100";

export function FormSoal({
  paketPilihan,
  soal,
  paketAwal,
  subjectAwal,
}: {
  paketPilihan: { id: string; nama: string }[];
  /** Diisi saat menyunting soal yang sudah ada. */
  soal?: Soal;
  paketAwal?: string;
  subjectAwal?: Subject;
}) {
  const aksi = soal
    ? perbaruiSoalAksi.bind(null, soal.id)
    : (buatSoalAksi as (
        state: FormSoalState,
        formData: FormData,
      ) => Promise<FormSoalState>);
  const [state, formAction] = useActionState<FormSoalState, FormData>(aksi, {});

  const [subject, setSubject] = useState<Subject>(
    soal?.subject ?? subjectAwal ?? "Bahasa Indonesia",
  );
  const [kategori, setKategori] = useState(soal?.category ?? "");
  const [pathGambar, setPathGambar] = useState(soal?.image?.src ?? "");

  // Batal kembali ke daftar soal paket yang sedang dikerjakan, bukan ke
  // ringkasan bank soal — itu halaman yang tadi ditinggalkan.
  const paketBatal = soal?.package_id ?? paketAwal;
  const subjectBatal = soal?.subject ?? subjectAwal;
  const tautanBatal =
    paketBatal && subjectBatal
      ? `/admin/bank-soal/daftar?paket=${paketBatal}&subject=${encodeURIComponent(subjectBatal)}`
      : "/admin/bank-soal";

  const gantiSubject = (nilai: Subject) => {
    setSubject(nilai);
    if (!KATEGORI[nilai].includes(kategori)) setKategori("");
  };

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader
          judul="Identitas Soal"
          deskripsi="Paket, mata uji, dan kategori menentukan penempatan soal pada sesi ujian."
        />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Paket" htmlFor="package_id">
            <select
              id="package_id"
              name="package_id"
              defaultValue={soal?.package_id ?? paketAwal ?? paketPilihan[0]?.id}
              className={kelasSelect}
              disabled={Boolean(soal)}
              required
            >
              {paketPilihan.map((paket) => (
                <option key={paket.id} value={paket.id}>
                  {paket.nama}
                </option>
              ))}
            </select>
          </Field>
          {soal ? (
            <input type="hidden" name="package_id" value={soal.package_id} />
          ) : null}

          <Field label="Mata Uji" htmlFor="subject">
            <select
              id="subject"
              name="subject"
              value={subject}
              onChange={(event) => gantiSubject(event.target.value as Subject)}
              className={kelasSelect}
              required
            >
              {SUBJECTS.map((nilai) => (
                <option key={nilai} value={nilai}>
                  {nilai}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Kategori Materi"
            htmlFor="category"
            hint="Terbatas pada cakupan materi Seleksi Tahap I."
          >
            <select
              id="category"
              name="category"
              value={kategori}
              onChange={(event) => setKategori(event.target.value)}
              className={kelasSelect}
              required
            >
              <option value="">Pilih kategori</option>
              {KATEGORI[subject].map((nilai) => (
                <option key={nilai} value={nilai}>
                  {nilai}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tingkat Kesulitan" htmlFor="difficulty">
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={soal?.difficulty ?? "Medium"}
              className={kelasSelect}
              required
            >
              {DIFFICULTIES.map((nilai) => (
                <option key={nilai} value={nilai}>
                  {nilai}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Nomor Urut"
            htmlFor="question_order"
            hint="Kosongkan untuk melanjutkan nomor terakhir pada mata uji ini."
          >
            <Input
              id="question_order"
              name="question_order"
              type="number"
              min={1}
              defaultValue={soal?.question_order ?? ""}
            />
          </Field>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm text-navy-800">
              <input
                type="checkbox"
                name="active"
                defaultChecked={soal ? soal.active : true}
                className="size-4.5 rounded border-navy-200 accent-navy-800"
              />
              Soal aktif dan dipakai pada ujian
            </label>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="Isi Soal"
          deskripsi="Seluruh soal berbentuk pilihan ganda dengan empat opsi (A-D)."
        />
        <CardBody className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="question">Pertanyaan</Label>
            <textarea
              id="question"
              name="question"
              rows={6}
              defaultValue={soal?.question}
              className={kelasTextarea}
              placeholder="Tulis stimulus dan pertanyaan. Gunakan baris baru untuk memisahkan paragraf."
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {HURUF_OPSI.map((huruf) => (
              <Field key={huruf} label={`Opsi ${huruf}`} htmlFor={`option_${huruf}`}>
                <Input
                  id={`option_${huruf}`}
                  name={`option_${huruf}`}
                  defaultValue={soal?.options[huruf]}
                  required
                />
              </Field>
            ))}
          </div>

          <Field label="Kunci Jawaban" htmlFor="correct_answer">
            <select
              id="correct_answer"
              name="correct_answer"
              defaultValue={soal?.correct_answer ?? "A"}
              className={cn(kelasSelect, "sm:max-w-40")}
              required
            >
              {HURUF_OPSI.map((huruf) => (
                <option key={huruf} value={huruf}>
                  {huruf}
                </option>
              ))}
            </select>
          </Field>

          <div className="space-y-1.5">
            <Label htmlFor="explanation">Pembahasan</Label>
            <p className="text-xs leading-relaxed text-muted">
              Wajib diisi. Pembahasan ini <b>dibaca siswa</b> pada halaman
              Riwayat Hasil setelah mata ujinya dikumpulkan — bukan catatan
              internal. Tulis langkah penyelesaiannya dan alasan opsi lain
              keliru.
            </p>
            <textarea
              id="explanation"
              name="explanation"
              rows={5}
              defaultValue={soal?.explanation}
              className={kelasTextarea}
              placeholder="Contoh: 2x + 5 = 17 → 2x = 12 → x = 6. Opsi lain keliru karena ..."
              required
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="Gambar Pendukung"
          deskripsi="Opsional. Isi bila soal memerlukan diagram, grafik, atau gambar percobaan."
        />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Path Gambar"
            htmlFor="image_src"
            hint="Terisi otomatis setelah gambar diunggah, atau isi manual bila berkas sudah ada."
          >
            <Input
              id="image_src"
              name="image_src"
              value={pathGambar}
              onChange={(event) => setPathGambar(event.target.value)}
              placeholder="/soal/nama-berkas.svg"
            />
          </Field>

          <div className="sm:col-span-2">
            <Label htmlFor="unggah-gambar">Unggah Gambar Baru</Label>
            <div className="mt-1.5">
              <UnggahGambar onTerunggah={setPathGambar} />
            </div>
          </div>
          <Field
            label="Teks Alternatif"
            htmlFor="image_alt"
            hint="Wajib diisi bila path gambar diisi."
          >
            <Input
              id="image_alt"
              name="image_alt"
              defaultValue={soal?.image?.alt ?? ""}
            />
          </Field>
          <Field label="Keterangan Gambar" htmlFor="image_keterangan">
            <Input
              id="image_keterangan"
              name="image_keterangan"
              defaultValue={soal?.image?.keterangan ?? ""}
              placeholder="Gambar 1. ..."
            />
          </Field>
        </CardBody>
      </Card>

      {state.masalah?.length ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700"
        >
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="size-4" />
            Soal belum dapat disimpan
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {state.masalah.map((pesan) => (
              <li key={pesan}>{pesan}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <TombolSimpan menyunting={Boolean(soal)} />
        <Link
          href={tautanBatal}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-navy-200 bg-white px-5 text-sm font-semibold text-navy-800 transition hover:bg-navy-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}

function TombolSimpan({ menyunting }: { menyunting: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Save className="size-4" />
      )}
      {menyunting ? "Simpan Perubahan" : "Simpan Soal"}
    </Button>
  );
}
