"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Pencil, Power, Save, Scale } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { KeadaanKosong } from "@/components/ui/state";
import { useToast } from "@/components/ui/toast";
import {
  setAktifButirPsikotesAksi,
  simpanPasanganEppsAksi,
} from "@/lib/actions-psikotes-admin";
import { cn } from "@/lib/utils";

/**
 * Penyuntingan pasangan pernyataan EPPS.
 *
 * EPPS tidak punya kunci jawaban, sehingga yang disunting bukan "soal dan
 * jawaban benar" melainkan dua pernyataan beserta dimensi yang diwakilinya.
 * Dimensi itulah yang menentukan profil peserta, jadi ia dipilih dari daftar
 * tetap — bukan diketik bebas — supaya tidak ada dimensi baru yang muncul
 * diam-diam dan membuat profilnya timpang.
 *
 * Penambahan dan penghapusan pasangan sengaja tidak disediakan: keseimbangan
 * profil bergantung pada setiap dimensi memperoleh kesempatan yang sama, dan
 * itu rusak begitu pasangan ditambah atau dibuang satu per satu. Yang tersedia
 * adalah menyunting isinya dan memadamkan pasangan yang keliru.
 */

export type PasanganTinjauAdmin = {
  nomor: number;
  teksA: string;
  dimensiA: string;
  teksB: string;
  dimensiB: string;
  aktif: boolean;
};

function TombolSimpan() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Save className="size-4" />
      )}
      Simpan
    </Button>
  );
}

export function KelolaPasanganEpps({
  paketId,
  sesiId,
  judul,
  dimensi,
  daftar,
}: {
  paketId: string;
  sesiId: string;
  judul: string;
  dimensi: readonly string[];
  daftar: PasanganTinjauAdmin[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [sunting, setSunting] = useState<PasanganTinjauAdmin | null>(null);

  const ubahAktif = (pasangan: PasanganTinjauAdmin) => {
    const tujuan = !pasangan.aktif;
    mulaiTransisi(async () => {
      const hasil = await setAktifButirPsikotesAksi(
        paketId,
        sesiId,
        pasangan.nomor,
        tujuan,
      );
      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Status pasangan gagal diubah.");
        return;
      }
      toast.sukses(hasil.pesan);
      router.refresh();
    });
  };

  const jumlahAktif = daftar.filter((item) => item.aktif).length;

  return (
    <>
      <Card>
        <CardHeader
          judul={judul}
          deskripsi={`${jumlahAktif} dari ${daftar.length} pasangan aktif. Label dimensi hanya tampil di layar admin — peserta tidak melihatnya.`}
        />
        <CardBody className="p-0 sm:p-0">
          {daftar.length === 0 ? (
            <KeadaanKosong
              judul="Belum ada pasangan pernyataan"
              ikon={Scale}
              deskripsi="Sesi EPPS baru dibuat kosong. Salin susunannya dari paket lain bila diperlukan."
            />
          ) : (
            <ol className="divide-y divide-line">
              {daftar.map((pasangan) => (
                <li key={pasangan.nomor} className="px-4 py-4 sm:px-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold",
                          pasangan.aktif
                            ? "bg-navy-900 text-gold-300"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {pasangan.nomor}
                      </span>
                      <div className="min-w-0 flex-1 space-y-2">
                        {(
                          [
                            ["A", pasangan.teksA, pasangan.dimensiA],
                            ["B", pasangan.teksB, pasangan.dimensiB],
                          ] as const
                        ).map(([huruf, teks, dim]) => (
                          <div
                            key={huruf}
                            className="flex items-start gap-2 rounded-lg bg-navy-50/60 px-3 py-2"
                          >
                            <span className="grid size-5 shrink-0 place-items-center rounded bg-navy-900 text-[11px] font-bold text-gold-300">
                              {huruf}
                            </span>
                            <span className="min-w-0 flex-1 text-sm text-navy-900">
                              {teks}
                            </span>
                            <Badge tone="netral">{dim}</Badge>
                          </div>
                        ))}
                        {!pasangan.aktif ? (
                          <Badge tone="netral">Nonaktif</Badge>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        title={
                          pasangan.aktif
                            ? "Nonaktifkan pasangan"
                            : "Aktifkan pasangan"
                        }
                        onClick={() => ubahAktif(pasangan)}
                        disabled={proses}
                        className={cn(
                          "grid size-9 place-items-center rounded-lg border border-transparent transition disabled:opacity-50",
                          pasangan.aktif
                            ? "text-rose-600 hover:bg-rose-50"
                            : "text-emerald-600 hover:bg-emerald-50",
                        )}
                      >
                        <Power className="size-4.5" />
                        <span className="sr-only">
                          {pasangan.aktif ? "Nonaktifkan" : "Aktifkan"}
                        </span>
                      </button>
                      <button
                        type="button"
                        title="Sunting pasangan"
                        onClick={() => setSunting(pasangan)}
                        disabled={proses}
                        className="grid size-9 place-items-center rounded-lg border border-transparent text-navy-600 transition hover:border-navy-200 hover:bg-navy-50 disabled:opacity-50"
                      >
                        <Pencil className="size-4.5" />
                        <span className="sr-only">Sunting pasangan</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardBody>
      </Card>

      <ModalPasangan
        paketId={paketId}
        sesiId={sesiId}
        dimensi={dimensi}
        pasangan={sunting}
        onTutup={() => setSunting(null)}
        onSelesai={() => {
          setSunting(null);
          router.refresh();
        }}
      />
    </>
  );
}

function ModalPasangan({
  paketId,
  sesiId,
  dimensi,
  pasangan,
  onTutup,
  onSelesai,
}: {
  paketId: string;
  sesiId: string;
  dimensi: readonly string[];
  pasangan: PasanganTinjauAdmin | null;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const toast = useToast();
  const [hasil, aksi] = useActionState(simpanPasanganEppsAksi, null);

  useEffect(() => {
    if (hasil?.ok) {
      toast.sukses(hasil.pesan);
      onSelesai();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasil]);

  if (!pasangan) return null;

  return (
    <Modal
      terbuka
      judul={`Pasangan ${pasangan.nomor}`}
      deskripsi="Kedua pernyataan sebaiknya sama-sama terdengar baik — itulah yang membuat pilihannya bermakna."
      onTutup={onTutup}
      lebar="lg"
    >
      <form key={pasangan.nomor} action={aksi} className="space-y-4">
        <input type="hidden" name="paketId" value={paketId} />
        <input type="hidden" name="sesiId" value={sesiId} />
        <input type="hidden" name="nomor" value={pasangan.nomor} />

        <Field label="Pernyataan A" htmlFor="teks-a">
          <Textarea
            id="teks-a"
            name="teksA"
            defaultValue={pasangan.teksA}
            rows={2}
            required
            maxLength={300}
          />
        </Field>
        <Field label="Dimensi A" htmlFor="dimensi-a">
          <Select id="dimensi-a" name="dimensiA" defaultValue={pasangan.dimensiA}>
            {dimensi.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Pernyataan B" htmlFor="teks-b">
          <Textarea
            id="teks-b"
            name="teksB"
            defaultValue={pasangan.teksB}
            rows={2}
            required
            maxLength={300}
          />
        </Field>
        <Field label="Dimensi B" htmlFor="dimensi-b">
          <Select id="dimensi-b" name="dimensiB" defaultValue={pasangan.dimensiB}>
            {dimensi.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="aktif"
            defaultChecked={pasangan.aktif}
            className="size-4"
          />
          <span className="text-navy-900">Pasangan ini ikut diujikan</span>
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
          <TombolSimpan />
        </div>
      </form>
    </Modal>
  );
}
