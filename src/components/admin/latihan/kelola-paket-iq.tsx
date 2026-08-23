"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  Brain,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Label, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { KeadaanKosong } from "@/components/ui/state";
import { Table, TableWrapper, Td, Th } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import {
  hapusPaketIqAksi,
  simpanPaketIqAksi,
  tambahPaketIqAksi,
  type HasilAksiIqAdmin,
} from "@/lib/actions-tes-iq-admin";
import { cn } from "@/lib/utils";

/**
 * Pengelolaan paket Tes IQ.
 *
 * Tes IQ tidak mengenal sesi — satu paket adalah satu lembar latihan — sehingga
 * tabelnya lebih pendek daripada psikotes. Selebihnya sama: satu baris per
 * paket, jendela penyuntingan, dan tautan ke bank soalnya.
 */

export type BarisPaketIq = {
  id: string;
  nomor: number;
  nama: string;
  tingkat: string;
  deskripsi: string;
  durasiMenit: number;
  aktif: boolean;
  jumlahSoal: number;
  jumlahAktif: number;
};

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

function PesanMasalah({ hasil }: { hasil: HasilAksiIqAdmin | null }) {
  if (!hasil || hasil.ok) return null;
  return (
    <ul
      role="alert"
      className="space-y-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      {hasil.masalah.map((pesan) => (
        <li key={pesan}>{pesan}</li>
      ))}
    </ul>
  );
}

function IkonAksi({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg border border-transparent text-navy-600 transition",
        "hover:border-navy-200 hover:bg-navy-50 disabled:opacity-50",
        className,
      )}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function KelolaPaketIq({ daftar }: { daftar: BarisPaketIq[] }) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();

  const [sunting, setSunting] = useState<BarisPaketIq | null>(null);
  const [tambah, setTambah] = useState(false);

  const hapus = (paket: BarisPaketIq) => {
    const yakin = window.confirm(
      `Hapus paket "${paket.nama}" beserta seluruh soalnya? Catatan pengerjaan peserta tidak ikut terhapus.`,
    );
    if (!yakin) return;

    mulaiTransisi(async () => {
      const hasil = await hapusPaketIqAksi(paket.id);
      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Paket gagal dihapus.");
        return;
      }
      toast.sukses(hasil.pesan);
      router.refresh();
    });
  };

  return (
    <>
      <Card>
        <CardHeader
          judul="Paket Tes IQ"
          deskripsi="Nama, tingkat, batas waktu, dan sakelar tampil di portal siswa."
          aksi={
            <Button type="button" size="sm" onClick={() => setTambah(true)}>
              <Plus className="size-4" />
              Paket Baru
            </Button>
          }
        />
        <CardBody className="p-0 sm:p-0">
          {daftar.length === 0 ? (
            <KeadaanKosong
              judul="Belum ada paket Tes IQ"
              ikon={Brain}
              deskripsi="Tambahkan paket, lalu isi soalnya lewat tab Import Soal atau Bank Soal."
            />
          ) : (
            <TableWrapper>
              <Table className="min-w-[820px]">
                <thead>
                  <tr>
                    <Th className="w-12">#</Th>
                    <Th>Paket</Th>
                    <Th className="w-28">Waktu</Th>
                    <Th className="w-36">Soal aktif</Th>
                    <Th className="w-28">Status</Th>
                    <Th className="w-32 text-right">Aksi</Th>
                  </tr>
                </thead>
                <tbody>
                  {daftar.map((paket) => (
                    <tr key={paket.id}>
                      <Td className="font-semibold text-navy-900">
                        {paket.nomor}
                      </Td>
                      <Td>
                        <span className="block font-semibold text-navy-900">
                          {paket.nama}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          Tingkat {paket.tingkat.toLowerCase()}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-sm tabular-nums text-navy-800">
                          {paket.durasiMenit} menit
                        </span>
                      </Td>
                      <Td>
                        <span className="text-sm tabular-nums text-navy-800">
                          {paket.jumlahAktif} / {paket.jumlahSoal}
                        </span>
                      </Td>
                      <Td>
                        <Badge tone={paket.aktif ? "hijau" : "netral"}>
                          {paket.aktif ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </Td>
                      <Td>
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/admin/tes-iq/soal?paket=${paket.id}`}
                            title="Bank soal"
                            className={cn(
                              "grid size-9 shrink-0 place-items-center rounded-lg border border-transparent text-navy-600 transition",
                              "hover:border-navy-200 hover:bg-navy-50",
                            )}
                          >
                            <FileText className="size-4.5" />
                            <span className="sr-only">Bank soal</span>
                          </Link>
                          <IkonAksi
                            label="Sunting paket"
                            onClick={() => setSunting(paket)}
                            disabled={proses}
                          >
                            <Pencil className="size-4.5" />
                          </IkonAksi>
                          <IkonAksi
                            label="Hapus paket"
                            onClick={() => hapus(paket)}
                            disabled={proses}
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="size-4.5" />
                          </IkonAksi>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </CardBody>
      </Card>

      <ModalPaketIq
        paket={sunting}
        onTutup={() => setSunting(null)}
        onSelesai={() => {
          setSunting(null);
          router.refresh();
        }}
      />

      <ModalTambahIq
        terbuka={tambah}
        onTutup={() => setTambah(false)}
        onSelesai={() => {
          setTambah(false);
          router.refresh();
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function ModalPaketIq({
  paket,
  onTutup,
  onSelesai,
}: {
  paket: BarisPaketIq | null;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const toast = useToast();
  const [hasil, aksi] = useActionState(simpanPaketIqAksi, null);

  useEffect(() => {
    if (hasil?.ok) {
      toast.sukses(hasil.pesan);
      onSelesai();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasil]);

  if (!paket) return null;

  return (
    <Modal
      terbuka
      judul="Sunting Paket Tes IQ"
      deskripsi="Perubahan berlaku langsung di portal siswa."
      onTutup={onTutup}
      lebar="lg"
    >
      <form action={aksi} className="space-y-4">
        <input type="hidden" name="paketId" value={paket.id} />

        <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
          <Field label="Nama paket" htmlFor="nama-iq">
            <Input
              id="nama-iq"
              name="nama"
              defaultValue={paket.nama}
              required
              maxLength={80}
            />
          </Field>
          <Field label="Batas waktu (menit)" htmlFor="durasi-iq">
            <Input
              id="durasi-iq"
              name="durasiMenit"
              type="number"
              min={1}
              max={180}
              defaultValue={paket.durasiMenit}
              required
            />
          </Field>
        </div>

        <Field label="Tingkat" htmlFor="tingkat-iq" hint="Mis. Dasar, Menengah, Lanjutan.">
          <Input
            id="tingkat-iq"
            name="tingkat"
            defaultValue={paket.tingkat}
            maxLength={40}
          />
        </Field>

        <Field label="Keterangan" htmlFor="deskripsi-iq">
          <Textarea
            id="deskripsi-iq"
            name="deskripsi"
            defaultValue={paket.deskripsi}
            rows={3}
            maxLength={400}
          />
        </Field>

        <label className="flex items-start gap-3 rounded-xl border border-line px-4 py-3">
          <input
            type="checkbox"
            name="aktif"
            defaultChecked={paket.aktif}
            className="mt-0.5 size-4"
          />
          <span className="min-w-0 text-sm">
            <span className="block font-medium text-navy-900">
              Tampilkan paket ini di portal siswa
            </span>
            <span className="mt-0.5 block text-xs text-muted">
              Paket yang dimatikan tetap tersimpan lengkap; peserta hanya tidak
              melihatnya, dan alamatnya pun tertutup.
            </span>
          </span>
        </label>

        <PesanMasalah hasil={hasil} />

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

function ModalTambahIq({
  terbuka,
  onTutup,
  onSelesai,
}: {
  terbuka: boolean;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const toast = useToast();
  const [hasil, aksi] = useActionState(tambahPaketIqAksi, null);

  useEffect(() => {
    if (hasil?.ok) {
      toast.sukses(hasil.pesan);
      onSelesai();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasil]);

  if (!terbuka) return null;

  return (
    <Modal
      terbuka
      judul="Paket Tes IQ Baru"
      deskripsi="Paket dibuat kosong; soalnya diisi lewat Import Soal atau Bank Soal."
      onTutup={onTutup}
    >
      <form action={aksi} className="space-y-4">
        <Field label="Nama paket" htmlFor="nama-iq-baru">
          <Input
            id="nama-iq-baru"
            name="nama"
            placeholder="Tes IQ Latihan 6"
            required
            maxLength={80}
          />
        </Field>

        <PesanMasalah hasil={hasil} />

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onTutup}>
            Batal
          </Button>
          <TombolSimpan label="Buat paket" />
        </div>
      </form>
    </Modal>
  );
}
