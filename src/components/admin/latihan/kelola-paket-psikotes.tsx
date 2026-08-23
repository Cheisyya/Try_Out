"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  AlarmClock,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  Power,
  Save,
  Settings2,
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
  hapusPaketPsikotesAksi,
  simpanPaketPsikotesAksi,
  simpanSesiPsikotesAksi,
  tambahPaketPsikotesAksi,
  ubahAktifPaketPsikotesAksi,
  type HasilAksiAdmin,
} from "@/lib/actions-psikotes-admin";
import { cn } from "@/lib/utils";

/**
 * Pengelolaan paket dan sesi Try Out Psikotes.
 *
 * Susunannya mengikuti tab "Paket & Sesi" pada Try Out Akademik: satu baris per
 * paket, dan sesi-sesinya dibuka lewat jendela pengaturan pada baris itu. Sesi
 * psikotes selalu milik sebuah paket, sehingga memisahkannya ke tab lain akan
 * menyebarkan satu pekerjaan ke dua tempat.
 */

export type BarisSesiPsikotes = {
  id: string;
  jenis: "skor" | "epps";
  nama: string;
  ringkas: string;
  petunjuk: string;
  durasiMenit: number;
  aktif: boolean;
  jumlahButir: number;
  jumlahAktif: number;
};

export type BarisPaketPsikotes = {
  id: string;
  nomor: number;
  nama: string;
  deskripsi: string;
  aktif: boolean;
  totalButir: number;
  totalAktif: number;
  totalMenit: number;
  sesi: BarisSesiPsikotes[];
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

function PesanMasalah({ hasil }: { hasil: HasilAksiAdmin | null }) {
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
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      title={label}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg border border-transparent text-navy-600 transition hover:border-navy-200 hover:bg-navy-50 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function TombolPaket({
  paket,
  proses,
  onAturSesi,
  onSunting,
  onUbahAktif,
  onHapus,
}: {
  paket: BarisPaketPsikotes;
  proses: boolean;
  onAturSesi: () => void;
  onSunting: () => void;
  onUbahAktif: () => void;
  onHapus: () => void;
}) {
  const labelAktif = paket.aktif ? "Nonaktifkan paket" : "Aktifkan paket";

  return (
    <div className="flex justify-end gap-1">
      <IkonAksi label="Atur sesi" onClick={onAturSesi} disabled={proses}>
        <Settings2 className="size-4.5" />
      </IkonAksi>
      <IkonAksi label="Sunting paket" onClick={onSunting} disabled={proses}>
        <Pencil className="size-4.5" />
      </IkonAksi>
      <IkonAksi
        label={labelAktif}
        onClick={onUbahAktif}
        disabled={proses}
        className={
          paket.aktif
            ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
        }
      >
        {proses ? (
          <LoaderCircle className="size-4.5 animate-spin" />
        ) : (
          <Power className="size-4.5" />
        )}
      </IkonAksi>
      <IkonAksi
        label="Hapus paket"
        onClick={onHapus}
        disabled={proses}
        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      >
        <Trash2 className="size-4.5" />
      </IkonAksi>
    </div>
  );
}

export function KelolaPaketPsikotes({
  daftar,
}: {
  daftar: BarisPaketPsikotes[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();

  const [daftarLokal, setDaftarLokal] = useState(daftar);
  const [sunting, setSunting] = useState<BarisPaketPsikotes | null>(null);
  const [aturSesi, setAturSesi] = useState<BarisPaketPsikotes | null>(null);
  const [tambah, setTambah] = useState(false);

  useEffect(() => {
    setDaftarLokal(daftar);
  }, [daftar]);

  const ubahAktif = (paket: BarisPaketPsikotes) => {
    const tujuan = !paket.aktif;
    setDaftarLokal((prev) =>
      prev.map((item) =>
        item.id === paket.id ? { ...item, aktif: tujuan } : item,
      ),
    );
    mulaiTransisi(async () => {
      const hasil = await ubahAktifPaketPsikotesAksi(paket.id, tujuan);
      if (!hasil.ok) {
        setDaftarLokal((prev) =>
          prev.map((item) =>
            item.id === paket.id ? { ...item, aktif: paket.aktif } : item,
          ),
        );
        toast.galat(hasil.masalah[0] ?? "Perubahan status gagal disimpan.");
        return;
      }
      toast.sukses(hasil.pesan);
    });
  };

  const hapus = (paket: BarisPaketPsikotes) => {
    const yakin = window.confirm(
      `Hapus paket "${paket.nama}" beserta seluruh soalnya? Catatan pengerjaan peserta tidak ikut terhapus.`,
    );
    if (!yakin) return;

    mulaiTransisi(async () => {
      const hasil = await hapusPaketPsikotesAksi(paket.id);
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
          judul="Paket Psikotes"
          deskripsi="Nama, keterangan, sesi beserta durasinya, dan sakelar tampil di portal siswa."
          aksi={
            <Button type="button" size="sm" onClick={() => setTambah(true)}>
              <Plus className="size-4" />
              Paket Baru
            </Button>
          }
        />
        <CardBody className="p-0 sm:p-0">
          {daftarLokal.length === 0 ? (
            <KeadaanKosong
              judul="Belum ada paket psikotes"
              ikon={FileText}
              deskripsi="Tambahkan paket, lalu isi soalnya lewat tab Import Soal atau Bank Soal."
            />
          ) : (
            <TableWrapper>
              <Table className="min-w-[840px]">
                <thead>
                  <tr>
                    <Th className="w-12">#</Th>
                    <Th>Paket</Th>
                    <Th className="w-40">Sesi</Th>
                    <Th className="w-36">Butir aktif</Th>
                    <Th className="w-28">Status</Th>
                    <Th className="w-32 text-right">Aksi</Th>
                  </tr>
                </thead>
                <tbody>
                  {daftarLokal.map((paket) => (
                    <tr key={paket.id}>
                      <Td className="font-semibold text-navy-900">
                        {paket.nomor}
                      </Td>
                      <Td>
                        <span className="block font-semibold text-navy-900">
                          {paket.nama}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-xs text-muted">
                          {paket.deskripsi || "Belum ada keterangan."}
                        </span>
                      </Td>
                      <Td>
                        <span className="block text-sm text-navy-800">
                          {paket.sesi.filter((sesi) => sesi.aktif).length} dari{" "}
                          {paket.sesi.length} aktif
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {paket.totalMenit} menit
                        </span>
                      </Td>
                      <Td>
                        <span className="text-sm tabular-nums text-navy-800">
                          {paket.totalAktif} / {paket.totalButir}
                        </span>
                      </Td>
                      <Td>
                        <Badge tone={paket.aktif ? "hijau" : "netral"}>
                          {paket.aktif ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </Td>
                      <Td>
                        <TombolPaket
                          paket={paket}
                          proses={proses}
                          onAturSesi={() => setAturSesi(paket)}
                          onSunting={() => setSunting(paket)}
                          onUbahAktif={() => ubahAktif(paket)}
                          onHapus={() => hapus(paket)}
                        />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </CardBody>
      </Card>

      <ModalPaket
        paket={sunting}
        onTutup={() => setSunting(null)}
        onSelesai={() => {
          setSunting(null);
          router.refresh();
        }}
      />

      <ModalTambah
        terbuka={tambah}
        onTutup={() => setTambah(false)}
        onSelesai={() => {
          setTambah(false);
          router.refresh();
        }}
      />

      <ModalSesi
        paket={aturSesi}
        onTutup={() => setAturSesi(null)}
        onSelesai={() => router.refresh()}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Jendela                                   */
/* -------------------------------------------------------------------------- */

function ModalPaket({
  paket,
  onTutup,
  onSelesai,
}: {
  paket: BarisPaketPsikotes | null;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const toast = useToast();
  const [hasil, aksi] = useActionState(simpanPaketPsikotesAksi, null);

  useEffect(() => {
    if (hasil?.ok) {
      toast.sukses(hasil.pesan);
      onSelesai();
    }
    // `onSelesai` sengaja tidak diikutkan: ia berubah setiap render dan akan
    // membuat efek ini berjalan berulang tanpa perubahan hasil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasil]);

  if (!paket) return null;

  return (
    <Modal
      terbuka
      judul="Sunting Paket Psikotes"
      deskripsi="Perubahan berlaku langsung di portal siswa."
      onTutup={onTutup}
      lebar="lg"
    >
      <form action={aksi} className="space-y-4">
        <input type="hidden" name="paketId" value={paket.id} />

        <Field label="Nama paket" htmlFor="nama-paket">
          <Input
            id="nama-paket"
            name="nama"
            defaultValue={paket.nama}
            required
            maxLength={80}
          />
        </Field>

        <Field label="Keterangan" htmlFor="deskripsi-paket">
          <Textarea
            id="deskripsi-paket"
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

function ModalTambah({
  terbuka,
  onTutup,
  onSelesai,
}: {
  terbuka: boolean;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const toast = useToast();
  const [hasil, aksi] = useActionState(tambahPaketPsikotesAksi, null);

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
      judul="Paket Psikotes Baru"
      deskripsi="Paket dibuat dengan empat sesi baku yang masih kosong soalnya."
      onTutup={onTutup}
    >
      <form action={aksi} className="space-y-4">
        <Field label="Nama paket" htmlFor="nama-paket-baru">
          <Input
            id="nama-paket-baru"
            name="nama"
            placeholder="Try Out Psikotes 11"
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

/**
 * Pengaturan seluruh sesi sebuah paket.
 *
 * Setiap sesi punya formulirnya sendiri sehingga menyimpan satu sesi tidak
 * memaksa admin menyentuh sesi lain — dan kegagalan pada satu sesi tidak
 * membatalkan perubahan yang sudah tersimpan pada sesi sebelumnya.
 */
function ModalSesi({
  paket,
  onTutup,
  onSelesai,
}: {
  paket: BarisPaketPsikotes | null;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  if (!paket) return null;

  return (
    <Modal
      terbuka
      judul={`Sesi · ${paket.nama}`}
      deskripsi="Durasi, keterangan, dan sakelar tampil untuk tiap sesi."
      onTutup={onTutup}
      lebar="lg"
    >
      <div className="space-y-4">
        {paket.sesi.map((sesi) => (
          <FormSesi
            key={sesi.id}
            paketId={paket.id}
            sesi={sesi}
            onSelesai={onSelesai}
          />
        ))}

        <div className="flex justify-end pt-1">
          <Button type="button" variant="outline" onClick={onTutup}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function FormSesi({
  paketId,
  sesi,
  onSelesai,
}: {
  paketId: string;
  sesi: BarisSesiPsikotes;
  onSelesai: () => void;
}) {
  const toast = useToast();
  const [hasil, aksi] = useActionState(simpanSesiPsikotesAksi, null);

  useEffect(() => {
    if (hasil?.ok) {
      toast.sukses(hasil.pesan);
      onSelesai();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasil]);

  const hrefSoal =
    sesi.jenis === "epps"
      ? `/admin/psikotes/soal?paket=${paketId}&sesi=${sesi.id}`
      : `/admin/psikotes/soal?paket=${paketId}&sesi=${sesi.id}`;

  return (
    <form
      action={aksi}
      className="space-y-3 rounded-xl border border-line px-4 py-4"
    >
      <input type="hidden" name="paketId" value={paketId} />
      <input type="hidden" name="sesiId" value={sesi.id} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy-900">{sesi.nama}</p>
          <p className="mt-0.5 text-xs text-muted">
            {sesi.jenis === "epps"
              ? "Pilihan paksa — tanpa kunci jawaban"
              : "Berkunci — dikoreksi benar/salah"}{" "}
            · {sesi.jumlahAktif} dari {sesi.jumlahButir} butir aktif
          </p>
        </div>
        <Link
          href={hrefSoal}
          className={buttonStyles({ variant: "outline", size: "sm" })}
        >
          <FileText className="size-4" />
          Bank Soal
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
        <Field label="Nama sesi" htmlFor={`nama-${sesi.id}`}>
          <Input
            id={`nama-${sesi.id}`}
            name="nama"
            defaultValue={sesi.nama}
            required
            maxLength={80}
          />
        </Field>
        <Field label="Durasi (menit)" htmlFor={`durasi-${sesi.id}`}>
          <Input
            id={`durasi-${sesi.id}`}
            name="durasiMenit"
            type="number"
            min={1}
            max={180}
            defaultValue={sesi.durasiMenit}
            required
          />
        </Field>
      </div>

      <Field label="Keterangan singkat" htmlFor={`ringkas-${sesi.id}`}>
        <Input
          id={`ringkas-${sesi.id}`}
          name="ringkas"
          defaultValue={sesi.ringkas}
          maxLength={120}
        />
      </Field>

      <Field label="Petunjuk pengerjaan" htmlFor={`petunjuk-${sesi.id}`}>
        <Textarea
          id={`petunjuk-${sesi.id}`}
          name="petunjuk"
          defaultValue={sesi.petunjuk}
          rows={3}
          maxLength={600}
        />
      </Field>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="aktif"
          defaultChecked={sesi.aktif}
          className="size-4"
        />
        <span className="inline-flex items-center gap-2 text-navy-900">
          <Power className="size-4 text-slate-400" />
          Sesi ini dikerjakan peserta
        </span>
      </label>

      <PesanMasalah hasil={hasil} />

      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <AlarmClock className="size-3.5" />
          {sesi.durasiMenit} menit
        </span>
        <TombolSimpan label="Simpan sesi" />
      </div>
    </form>
  );
}
