"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  Upload,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, TableWrapper, Td, Th } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import {
  konfirmasiImporPsikotesAksi,
  pratinjauImporPsikotesAksi,
} from "@/lib/actions-psikotes-admin";
import {
  konfirmasiImporIqAksi,
  pratinjauImporIqAksi,
} from "@/lib/actions-tes-iq-admin";
import type { HasilPratinjauLatihan } from "@/lib/import/latihan";
import { cn } from "@/lib/utils";

/**
 * Impor massal soal latihan dari PDF atau Excel.
 *
 * Alurnya sengaja bertahap — unggah, lihat pratinjau, baru konfirmasi — supaya
 * admin dapat memeriksa butir mana yang bermasalah sebelum satu pun tersimpan.
 * Pratinjau tidak menulis apa pun ke penyimpanan, dan seluruh butir divalidasi
 * ulang di server pada saat konfirmasi.
 */

export type TujuanImpor = {
  paketId: string;
  paketNama: string;
  /** Sesi tujuan; kosong untuk Tes IQ yang tidak mengenal sesi. */
  sesiId?: string;
  sesiNama?: string;
};

function TombolUnggah() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Upload className="size-4" />
      )}
      Baca berkas
    </Button>
  );
}

export function ImportLatihan({
  jenis,
  tujuan,
  kategori,
}: {
  jenis: "psikotes" | "tesiq";
  /** Pilihan tujuan impor; kosong berarti belum ada paket yang dapat diisi. */
  tujuan: TujuanImpor[];
  /** Pilihan kategori. Kosong berarti kategori bebas diketik admin. */
  kategori: readonly string[];
}) {
  const router = useRouter();
  const toast = useToast();

  const pratinjauAksi =
    jenis === "psikotes" ? pratinjauImporPsikotesAksi : pratinjauImporIqAksi;
  const [hasil, aksi] = useActionState(pratinjauAksi, null);

  const [tujuanTerpilih, setTujuanTerpilih] = useState(0);
  const [kategoriBawaan, setKategoriBawaan] = useState(kategori[0] ?? "Umum");
  const [proses, mulaiTransisi] = useTransition();

  const dipilih = tujuan[tujuanTerpilih];

  const konfirmasi = () => {
    if (!hasil?.ok || !dipilih) return;

    mulaiTransisi(async () => {
      const balasan =
        jenis === "psikotes"
          ? await konfirmasiImporPsikotesAksi(
              dipilih.paketId,
              dipilih.sesiId ?? "",
              hasil.mentah,
              kategoriBawaan,
            )
          : await konfirmasiImporIqAksi(
              dipilih.paketId,
              hasil.mentah,
              kategoriBawaan,
            );

      if (!balasan.ok) {
        toast.galat(balasan.masalah[0] ?? "Impor gagal disimpan.");
        return;
      }
      toast.sukses(
        `${balasan.tersimpan} butir tersimpan${
          balasan.dilewati > 0 ? `, ${balasan.dilewati} dilewati` : ""
        }.`,
      );
      router.refresh();
    });
  };

  if (tujuan.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm text-muted">
            Belum ada paket yang dapat diisi soal. Buat paket lebih dahulu pada
            tab Paket &amp; Sesi.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          judul="Unggah berkas soal"
          deskripsi="PDF berformat soal bernomor, atau Excel dengan kolom question, option_a sampai option_d, correct_answer, dan explanation."
        />
        <CardBody>
          <form action={aksi} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tujuan penyimpanan" htmlFor="tujuan-impor">
                <Select
                  id="tujuan-impor"
                  value={String(tujuanTerpilih)}
                  onChange={(event) =>
                    setTujuanTerpilih(Number(event.target.value))
                  }
                >
                  {tujuan.map((item, i) => (
                    <option key={`${item.paketId}-${item.sesiId ?? ""}`} value={i}>
                      {item.sesiNama
                        ? `${item.paketNama} · ${item.sesiNama}`
                        : item.paketNama}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Kategori bawaan"
                htmlFor="kategori-impor"
                hint="Dipakai untuk butir yang berkasnya tidak menyebut kategori."
              >
                {kategori.length > 0 ? (
                  <Select
                    id="kategori-impor"
                    name="kategori"
                    value={kategoriBawaan}
                    onChange={(event) => setKategoriBawaan(event.target.value)}
                  >
                    {kategori.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    id="kategori-impor"
                    name="kategori"
                    value={kategoriBawaan}
                    onChange={(event) => setKategoriBawaan(event.target.value)}
                    maxLength={60}
                  />
                )}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Jenis berkas" htmlFor="sumber-impor">
                <Select id="sumber-impor" name="sumber" defaultValue="pdf">
                  <option value="pdf">PDF (.pdf)</option>
                  <option value="excel">Excel (.xlsx)</option>
                </Select>
              </Field>

              <Field label="Berkas" htmlFor="berkas-impor">
                <input
                  id="berkas-impor"
                  name="berkas"
                  type="file"
                  accept=".pdf,.xlsx"
                  required
                  className="block w-full text-sm text-navy-800 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-800"
                />
              </Field>
            </div>

            {hasil && !hasil.ok ? (
              <p
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {hasil.galat}
              </p>
            ) : null}

            <div className="flex justify-end">
              <TombolUnggah />
            </div>
          </form>
        </CardBody>
      </Card>

      {hasil?.ok ? (
        <Pratinjau
          hasil={hasil}
          tujuan={dipilih}
          proses={proses}
          onKonfirmasi={konfirmasi}
        />
      ) : null}
    </div>
  );
}

function Pratinjau({
  hasil,
  tujuan,
  proses,
  onKonfirmasi,
}: {
  hasil: HasilPratinjauLatihan;
  tujuan: TujuanImpor | undefined;
  proses: boolean;
  onKonfirmasi: () => void;
}) {
  return (
    <Card>
      <CardHeader
        judul="Pratinjau"
        deskripsi={`${hasil.namaBerkas} · ${hasil.jumlahValid} butir siap disimpan, ${hasil.jumlahBermasalah} bermasalah.`}
        aksi={
          <Badge tone={hasil.sumber === "pdf" ? "navy" : "gold"}>
            {hasil.sumber === "pdf" ? (
              <FileText className="size-3.5" />
            ) : (
              <FileSpreadsheet className="size-3.5" />
            )}
            {hasil.sumber.toUpperCase()}
          </Badge>
        }
      />
      <CardBody className="space-y-4 p-0 sm:p-0">
        {hasil.catatan.length > 0 ? (
          <ul className="space-y-1 px-5 pt-5 text-sm text-muted sm:px-6">
            {hasil.catatan.map((catatan) => (
              <li key={catatan}>· {catatan}</li>
            ))}
          </ul>
        ) : null}

        <TableWrapper>
          <Table className="min-w-[900px]">
            <thead>
              <tr>
                <Th className="w-14">No</Th>
                <Th className="w-28">Kategori</Th>
                <Th>Pertanyaan</Th>
                <Th className="w-20">Kunci</Th>
                <Th className="w-64">Status</Th>
              </tr>
            </thead>
            <tbody>
              {hasil.baris.map((baris) => (
                <tr key={baris.baris}>
                  <Td className="tabular-nums text-navy-900">{baris.baris}</Td>
                  <Td className="text-muted">{baris.kategori}</Td>
                  <Td>
                    <span className="line-clamp-2 block text-navy-800">
                      {baris.pertanyaan || "—"}
                    </span>
                  </Td>
                  <Td>
                    <span
                      className={cn(
                        "inline-grid size-7 place-items-center rounded-lg text-xs font-bold",
                        baris.valid
                          ? "bg-navy-50 text-navy-700"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {baris.kunci || "—"}
                    </span>
                  </Td>
                  <Td>
                    {baris.valid ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="size-3.5" />
                        Siap disimpan
                      </span>
                    ) : (
                      <ul className="space-y-0.5 text-xs text-rose-700">
                        {baris.masalah.map((pesan) => (
                          <li key={pesan} className="flex items-start gap-1.5">
                            <XCircle className="mt-0.5 size-3.5 shrink-0" />
                            {pesan}
                          </li>
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
          <p className="text-sm text-muted">
            {tujuan
              ? `Akan disimpan ke ${tujuan.sesiNama ? `${tujuan.paketNama} · ${tujuan.sesiNama}` : tujuan.paketNama}. Butir bermasalah dilewati.`
              : "Pilih tujuan penyimpanan terlebih dahulu."}
          </p>
          <Button
            type="button"
            onClick={onKonfirmasi}
            disabled={proses || hasil.jumlahValid === 0 || !tujuan}
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            Simpan {hasil.jumlahValid} butir
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
