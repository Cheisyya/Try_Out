"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  Lightbulb,
  LoaderCircle,
  Pencil,
  Plus,
  Power,
  Save,
  Trash2,
} from "lucide-react";

import { Figur, PapanFigur } from "@/components/psikotes/figur";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { KeadaanKosong } from "@/components/ui/state";
import { useToast } from "@/components/ui/toast";
import {
  hapusSoalPsikotesAksi,
  setAktifButirPsikotesAksi,
  simpanSoalPsikotesAksi,
  tambahSoalPsikotesAksi,
} from "@/lib/actions-psikotes-admin";
import {
  hapusSoalIqAksi,
  setAktifSoalIqAksi,
  simpanSoalIqAksi,
  tambahSoalIqAksi,
} from "@/lib/actions-tes-iq-admin";
import type { KodeFigur, Stimulus } from "@/lib/psikotes/tipe";
import { cn } from "@/lib/utils";

/**
 * Penyuntingan bank soal latihan — psikotes maupun Tes IQ.
 *
 * Satu komponen melayani keduanya karena bentuk butirnya sama: pertanyaan,
 * empat pilihan, kunci, dan pembahasan. Yang berbeda hanya Server Action
 * tujuannya dan ada-tidaknya sesi, dan itu cukup ditentukan lewat satu prop.
 *
 * Soal figural — yang memuat gambar stimulus atau gambar pilihan — dapat dibaca
 * dan dinyalakan/dipadamkan di sini, tetapi penyuntingan gambarnya tidak
 * disediakan: kodenya ringkas tetapi tidak dapat diperiksa dengan aman lewat
 * kotak teks biasa, dan satu salah ketik akan berakhir sebagai kotak kosong di
 * layar peserta. Butir semacam itu diberi tanda pada daftar.
 */

export type ButirLatihan = {
  nomor: number;
  kategori: string;
  pertanyaan: string;
  pola?: string[];
  stimulus?: Stimulus;
  opsi: Record<"A" | "B" | "C" | "D", string>;
  opsiFigur?: Record<"A" | "B" | "C" | "D", KodeFigur>;
  kunci: string;
  pembahasan: string;
  aktif: boolean;
};

const HURUF = ["A", "B", "C", "D"] as const;

function TombolSimpan({ label = "Simpan" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Save className="size-4" />
      )}
      {label}
    </Button>
  );
}

export function KelolaSoalLatihan({
  jenis,
  paketId,
  sesiId,
  judul,
  deskripsi,
  kategori,
  daftar,
}: {
  jenis: "psikotes" | "tesiq";
  paketId: string;
  /** Kosong untuk Tes IQ, yang tidak mengenal sesi. */
  sesiId?: string;
  judul: string;
  deskripsi: string;
  /** Kosong berarti kategori bebas diketik admin. */
  kategori: readonly string[];
  daftar: ButirLatihan[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();

  const [sunting, setSunting] = useState<ButirLatihan | null>(null);
  const [tambah, setTambah] = useState(false);

  const ubahAktif = (butir: ButirLatihan) => {
    const tujuan = !butir.aktif;
    mulaiTransisi(async () => {
      const hasil =
        jenis === "psikotes"
          ? await setAktifButirPsikotesAksi(
              paketId,
              sesiId ?? "",
              butir.nomor,
              tujuan,
            )
          : await setAktifSoalIqAksi(paketId, butir.nomor, tujuan);

      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Status butir gagal diubah.");
        return;
      }
      toast.sukses(hasil.pesan);
      router.refresh();
    });
  };

  const hapus = (butir: ButirLatihan) => {
    const yakin = window.confirm(
      `Hapus soal nomor ${butir.nomor}? Menonaktifkannya sudah cukup bila soal ini hanya perlu ditarik sementara.`,
    );
    if (!yakin) return;

    mulaiTransisi(async () => {
      const hasil =
        jenis === "psikotes"
          ? await hapusSoalPsikotesAksi(paketId, sesiId ?? "", butir.nomor)
          : await hapusSoalIqAksi(paketId, butir.nomor);

      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Soal gagal dihapus.");
        return;
      }
      toast.sukses(hasil.pesan);
      router.refresh();
    });
  };

  const jumlahAktif = daftar.filter((butir) => butir.aktif).length;

  return (
    <>
      <Card>
        <CardHeader
          judul={judul}
          deskripsi={`${deskripsi} · ${jumlahAktif} dari ${daftar.length} butir aktif.`}
          aksi={
            <Button type="button" size="sm" onClick={() => setTambah(true)}>
              <Plus className="size-4" />
              Soal Baru
            </Button>
          }
        />
        <CardBody className="p-0 sm:p-0">
          {daftar.length === 0 ? (
            <KeadaanKosong
              judul="Belum ada soal"
              ikon={Lightbulb}
              deskripsi="Tambahkan soal satu per satu di sini, atau impor massal lewat tab Import Soal."
            />
          ) : (
            <ol className="divide-y divide-line">
              {daftar.map((butir) => (
                <li key={butir.nomor} className="px-4 py-4 sm:px-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold",
                          butir.aktif
                            ? "bg-navy-900 text-gold-300"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {butir.nomor}
                      </span>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="netral">{butir.kategori}</Badge>
                          <Badge tone={butir.aktif ? "hijau" : "netral"}>
                            {butir.aktif ? "Aktif" : "Nonaktif"}
                          </Badge>
                          {butir.stimulus || butir.opsiFigur ? (
                            <Badge tone="gold">Figural</Badge>
                          ) : null}
                        </div>

                        <p className="whitespace-pre-line text-sm leading-relaxed text-navy-900">
                          {butir.pertanyaan}
                        </p>

                        {butir.pola?.length ? (
                          <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-line bg-navy-50/50 px-4 py-2.5">
                            <pre className="w-max font-mono text-sm leading-7 text-navy-900">
                              {butir.pola.join("\n")}
                            </pre>
                          </div>
                        ) : null}

                        {butir.stimulus ? (
                          <PapanFigur stimulus={butir.stimulus} />
                        ) : null}

                        <ul className="grid gap-1.5 sm:grid-cols-2">
                          {HURUF.map((huruf) => {
                            const benar = butir.kunci === huruf;
                            return (
                              <li
                                key={huruf}
                                className={cn(
                                  "flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm",
                                  benar
                                    ? "bg-emerald-50 text-emerald-900"
                                    : "text-navy-800",
                                )}
                              >
                                <span
                                  className={cn(
                                    "grid size-5 shrink-0 place-items-center rounded text-[11px] font-bold",
                                    benar
                                      ? "bg-emerald-600 text-white"
                                      : "bg-navy-50 text-navy-700",
                                  )}
                                >
                                  {huruf}
                                </span>
                                {butir.opsiFigur ? (
                                  <span className="grid size-10 place-items-center rounded border border-line bg-white p-1">
                                    <Figur
                                      kode={butir.opsiFigur[huruf]}
                                      label={butir.opsi[huruf]}
                                    />
                                  </span>
                                ) : (
                                  <span className="min-w-0">
                                    {butir.opsi[huruf]}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>

                        <p className="rounded-lg bg-gold-50/70 px-3 py-2 text-xs leading-relaxed text-navy-800">
                          <span className="font-semibold text-gold-800">
                            Pembahasan:{" "}
                          </span>
                          {butir.pembahasan}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        title={butir.aktif ? "Nonaktifkan soal" : "Aktifkan soal"}
                        onClick={() => ubahAktif(butir)}
                        disabled={proses}
                        className={cn(
                          "grid size-9 place-items-center rounded-lg border border-transparent transition disabled:opacity-50",
                          butir.aktif
                            ? "text-rose-600 hover:bg-rose-50"
                            : "text-emerald-600 hover:bg-emerald-50",
                        )}
                      >
                        <Power className="size-4.5" />
                        <span className="sr-only">
                          {butir.aktif ? "Nonaktifkan soal" : "Aktifkan soal"}
                        </span>
                      </button>
                      <button
                        type="button"
                        title={
                          butir.stimulus || butir.opsiFigur
                            ? "Soal figural tidak dapat disunting di sini"
                            : "Sunting soal"
                        }
                        onClick={() => setSunting(butir)}
                        disabled={
                          proses || Boolean(butir.stimulus || butir.opsiFigur)
                        }
                        className="grid size-9 place-items-center rounded-lg border border-transparent text-navy-600 transition hover:border-navy-200 hover:bg-navy-50 disabled:opacity-40"
                      >
                        <Pencil className="size-4.5" />
                        <span className="sr-only">Sunting soal</span>
                      </button>
                      <button
                        type="button"
                        title="Hapus soal"
                        onClick={() => hapus(butir)}
                        disabled={proses}
                        className="grid size-9 place-items-center rounded-lg border border-transparent text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        <Trash2 className="size-4.5" />
                        <span className="sr-only">Hapus soal</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardBody>
      </Card>

      <ModalSoal
        jenis={jenis}
        paketId={paketId}
        sesiId={sesiId}
        kategori={kategori}
        butir={sunting}
        terbuka={sunting !== null || tambah}
        modeTambah={tambah}
        onTutup={() => {
          setSunting(null);
          setTambah(false);
        }}
        onSelesai={() => {
          setSunting(null);
          setTambah(false);
          router.refresh();
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function ModalSoal({
  jenis,
  paketId,
  sesiId,
  kategori,
  butir,
  terbuka,
  modeTambah,
  onTutup,
  onSelesai,
}: {
  jenis: "psikotes" | "tesiq";
  paketId: string;
  sesiId?: string;
  kategori: readonly string[];
  butir: ButirLatihan | null;
  terbuka: boolean;
  modeTambah: boolean;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const toast = useToast();

  const aksiTujuan = modeTambah
    ? jenis === "psikotes"
      ? tambahSoalPsikotesAksi
      : tambahSoalIqAksi
    : jenis === "psikotes"
      ? simpanSoalPsikotesAksi
      : simpanSoalIqAksi;

  const [hasil, aksi] = useActionState(aksiTujuan, null);

  useEffect(() => {
    if (hasil?.ok) {
      toast.sukses(hasil.pesan);
      onSelesai();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasil]);

  if (!terbuka) return null;

  const awal = modeTambah ? null : butir;

  return (
    <Modal
      terbuka
      judul={modeTambah ? "Soal Baru" : `Sunting Soal ${butir?.nomor ?? ""}`}
      deskripsi="Pembahasan wajib diisi — peserta membacanya setelah latihan ditutup."
      onTutup={onTutup}
      lebar="lg"
    >
      {/* `key` memaksa formulir tersusun ulang ketika butir yang disunting
          berganti, sehingga nilai bawaannya ikut menyesuaikan. */}
      <form
        key={awal?.nomor ?? "baru"}
        action={aksi}
        className="space-y-4"
      >
        <input type="hidden" name="paketId" value={paketId} />
        {sesiId ? <input type="hidden" name="sesiId" value={sesiId} /> : null}
        {awal ? <input type="hidden" name="nomor" value={awal.nomor} /> : null}

        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
          <Field label="Kategori" htmlFor="kategori-soal">
            {kategori.length > 0 ? (
              <Select
                id="kategori-soal"
                name="kategori"
                defaultValue={awal?.kategori ?? kategori[0]}
              >
                {kategori.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id="kategori-soal"
                name="kategori"
                defaultValue={awal?.kategori ?? ""}
                required
                maxLength={60}
              />
            )}
          </Field>

          <Field label="Kunci jawaban" htmlFor="kunci-soal">
            <Select
              id="kunci-soal"
              name="kunci"
              defaultValue={awal?.kunci ?? "A"}
            >
              {HURUF.map((huruf) => (
                <option key={huruf} value={huruf}>
                  {huruf}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Pertanyaan" htmlFor="pertanyaan-soal">
          <Textarea
            id="pertanyaan-soal"
            name="pertanyaan"
            defaultValue={awal?.pertanyaan ?? ""}
            rows={3}
            required
            maxLength={1200}
          />
        </Field>

        {jenis === "tesiq" ? (
          <Field
            label="Pola (opsional)"
            htmlFor="pola-soal"
            hint="Deret atau matriks yang perlu lebar huruf tetap. Satu baris per baris pola."
          >
            <Textarea
              id="pola-soal"
              name="pola"
              defaultValue={awal?.pola?.join("\n") ?? ""}
              rows={3}
              className="font-mono"
              maxLength={600}
            />
          </Field>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          {HURUF.map((huruf) => (
            <Field
              key={huruf}
              label={`Pilihan ${huruf}`}
              htmlFor={`opsi-${huruf}`}
            >
              <Input
                id={`opsi-${huruf}`}
                name={`opsi${huruf}`}
                defaultValue={awal?.opsi[huruf] ?? ""}
                required
                maxLength={300}
              />
            </Field>
          ))}
        </div>

        <Field label="Pembahasan" htmlFor="pembahasan-soal">
          <Textarea
            id="pembahasan-soal"
            name="pembahasan"
            defaultValue={awal?.pembahasan ?? ""}
            rows={4}
            required
            maxLength={1500}
          />
        </Field>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="aktif"
            defaultChecked={awal?.aktif ?? true}
            className="size-4"
          />
          <span className="text-navy-900">Soal ini ikut diujikan</span>
        </label>

        {hasil && !hasil.ok ? (
          <ul
            role="alert"
            className="space-y-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {hasil.masalah.map((pesan) => (
              <li key={pesan}>{pesan}</li>
            ))}
          </ul>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onTutup}>
            Batal
          </Button>
          <TombolSimpan label={modeTambah ? "Tambahkan" : "Simpan"} />
        </div>
      </form>
    </Modal>
  );
}
