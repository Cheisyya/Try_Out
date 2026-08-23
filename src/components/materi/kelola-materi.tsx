"use client";

import { useRouter } from "next/navigation";
import { useActionState, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  hapusMateriAksi,
  simpanMateriAksi,
  ubahAktifMateriAksi,
  unggahMateriAksi,
  type MateriState,
} from "@/lib/actions-materi";
import {
  MAKS_BYTE_MATERI,
  MATA_PELAJARAN,
  type Materi,
} from "@/lib/materi/tipe";
import { cn } from "@/lib/utils";

/* -------------------------------- Unggahan -------------------------------- */

/**
 * Tombol tambah materi.
 *
 * Formulirnya tinggal di dalam modal, bukan menetap di halaman: yang paling
 * sering dilihat admin adalah daftar materinya, sementara formulir unggah baru
 * dibutuhkan sesekali.
 */
export function TombolTambahMateri() {
  const [terbuka, setTerbuka] = useState(false);

  return (
    <>
      <Button type="button" size="sm" onClick={() => setTerbuka(true)}>
        <Plus className="size-4" />
        Tambah Materi
      </Button>

      <Modal
        terbuka={terbuka}
        lebar="lg"
        judul="Tambah Materi"
        deskripsi="Satu berkas PDF per materi. Materi langsung terlihat siswa setelah tersimpan."
        onTutup={() => setTerbuka(false)}
      >
        <FormUnggahMateri onSelesai={() => setTerbuka(false)} />
      </Modal>
    </>
  );
}

/** Formulir unggah materi baru. */
function FormUnggahMateri({ onSelesai }: { onSelesai: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const form = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<MateriState, FormData>(
    unggahMateriAksi,
    {},
  );

  // Setelah unggahan berhasil, modal ditutup dan daftar disegarkan.
  if (state.sukses) {
    queueMicrotask(() => {
      form.current?.reset();
      onSelesai();
      router.refresh();
    });
  }

  return (
    <form ref={form} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mata Pelajaran" htmlFor="mataPelajaran">
          <Select id="mataPelajaran" name="mataPelajaran" defaultValue="Matematika">
            {MATA_PELAJARAN.map((mapel) => (
              <option key={mapel} value={mapel}>
                {mapel}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Judul Materi" htmlFor="judul">
          <Input
            id="judul"
            name="judul"
            placeholder="Contoh: Bangun Ruang Sisi Datar"
            maxLength={120}
            required
          />
        </Field>
      </div>

      <Field label="Deskripsi" htmlFor="deskripsi" hint="Opsional.">
        <Textarea
          id="deskripsi"
          name="deskripsi"
          rows={2}
          placeholder="Ringkasan singkat isi materi."
          maxLength={400}
        />
      </Field>

      <Field
        label="Berkas Materi (PDF)"
        htmlFor="berkas"
        hint={`Hanya PDF, maksimal ${Math.round(MAKS_BYTE_MATERI / 1024 / 1024)} MB. Format PDF dipilih agar siswa dapat membacanya langsung di halaman tanpa mengunduh.`}
      >
        <input
          id="berkas"
          name="berkas"
          type="file"
          accept="application/pdf,.pdf"
          required
          className="w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-sm text-navy-900 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-800"
        />
      </Field>

      <PesanAksi state={state} judulGagal="Materi belum dapat diunggah" />

      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row-reverse">
        <TombolKirim label="Unggah Materi" icon={Upload} />
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onSelesai}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------- Aksi baris ------------------------------- */

/** Sunting, tampil/sembunyi, dan hapus untuk satu materi. */
export function AksiMateri({ materi }: { materi: Materi }) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [sunting, setSunting] = useState(false);
  const [hapus, setHapus] = useState(false);

  const ubahAktif = () => {
    mulaiTransisi(async () => {
      const hasil = await ubahAktifMateriAksi(materi.id, !materi.aktif);
      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Perubahan gagal disimpan.");
        return;
      }
      toast.sukses(
        materi.aktif
          ? `"${materi.judul}" disembunyikan dari siswa.`
          : `"${materi.judul}" kini terlihat siswa.`,
      );
      router.refresh();
    });
  };

  const jalankanHapus = () => {
    mulaiTransisi(async () => {
      const hasil = await hapusMateriAksi(materi.id);
      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Materi gagal dihapus.");
        return;
      }
      toast.sukses(`"${materi.judul}" telah dihapus.`);
      setHapus(false);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <TombolIkon
          label="Sunting materi"
          onClick={() => setSunting(true)}
          disabled={proses}
        >
          <Pencil className="size-4.5" />
        </TombolIkon>
        <TombolIkon
          label={materi.aktif ? "Sembunyikan dari siswa" : "Tampilkan ke siswa"}
          onClick={ubahAktif}
          disabled={proses}
        >
          {proses ? (
            <LoaderCircle className="size-4.5 animate-spin" />
          ) : materi.aktif ? (
            <EyeOff className="size-4.5" />
          ) : (
            <Eye className="size-4.5" />
          )}
        </TombolIkon>
        <TombolIkon
          label="Hapus materi"
          onClick={() => setHapus(true)}
          disabled={proses}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <Trash2 className="size-4.5" />
        </TombolIkon>
      </div>

      <Modal
        terbuka={sunting}
        lebar="lg"
        judul={`Sunting "${materi.judul}"`}
        deskripsi="Berkas PDF tidak dapat diganti di sini — hapus materi lalu unggah ulang bila berkasnya berubah."
        onTutup={() => setSunting(false)}
      >
        <FormSuntingMateri materi={materi} onSelesai={() => setSunting(false)} />
      </Modal>

      <Modal
        terbuka={hapus}
        judul="Hapus materi?"
        deskripsi={`"${materi.judul}" akan dihapus permanen.`}
        onTutup={() => setHapus(false)}
      >
        <p className="text-sm leading-relaxed text-muted">
          Berkas PDF-nya ikut terhapus dan tidak dapat dikembalikan. Bila hanya
          ingin menutupnya sementara dari siswa, gunakan tombol{" "}
          <b className="text-navy-800">Sembunyikan</b>.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            type="button"
            className="w-full bg-rose-600 hover:bg-rose-700 sm:w-auto"
            disabled={proses}
            onClick={jalankanHapus}
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Ya, hapus permanen
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setHapus(false)}
            disabled={proses}
          >
            Batal
          </Button>
        </div>
      </Modal>
    </>
  );
}

function FormSuntingMateri({
  materi,
  onSelesai,
}: {
  materi: Materi;
  onSelesai: () => void;
}) {
  const router = useRouter();
  const aksi = simpanMateriAksi.bind(null, materi.id);
  const [state, formAction] = useActionState<MateriState, FormData>(aksi, {});

  if (state.sukses) {
    queueMicrotask(() => {
      onSelesai();
      router.refresh();
    });
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mata Pelajaran" htmlFor="mataPelajaran-sunting">
          <Select
            id="mataPelajaran-sunting"
            name="mataPelajaran"
            defaultValue={materi.mataPelajaran}
          >
            {MATA_PELAJARAN.map((mapel) => (
              <option key={mapel} value={mapel}>
                {mapel}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Judul Materi" htmlFor="judul-sunting">
          <Input
            id="judul-sunting"
            name="judul"
            defaultValue={materi.judul}
            maxLength={120}
            required
          />
        </Field>
      </div>

      <Field label="Deskripsi" htmlFor="deskripsi-sunting" hint="Opsional.">
        <Textarea
          id="deskripsi-sunting"
          name="deskripsi"
          rows={3}
          defaultValue={materi.deskripsi}
          maxLength={400}
        />
      </Field>

      <PesanAksi state={state} judulGagal="Perubahan belum dapat disimpan" />

      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row-reverse">
        <TombolKirim label="Simpan perubahan" icon={Save} />
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onSelesai}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}

/* -------------------------------- Pembantu -------------------------------- */

function PesanAksi({
  state,
  judulGagal,
}: {
  state: MateriState;
  judulGagal: string;
}) {
  return (
    <>
      {state.masalah?.length ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="size-4" />
            {judulGagal}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {state.masalah.map((pesan) => (
              <li key={pesan}>{pesan}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.sukses ? (
        <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          {state.sukses}
        </p>
      ) : null}
    </>
  );
}

function TombolKirim({
  label,
  icon: Icon,
}: {
  label: string;
  icon: typeof Upload;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Icon className="size-4" />
      )}
      {pending ? "Menyimpan..." : label}
    </Button>
  );
}

function TombolIkon({
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
        "grid size-9 shrink-0 place-items-center rounded-lg border border-transparent text-slate-500 transition hover:border-navy-100 hover:bg-navy-50 hover:text-navy-900 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
