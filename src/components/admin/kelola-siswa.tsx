"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { AlertCircle, LoaderCircle, Pencil, Save, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  buatSiswaAksi,
  hapusSiswaAksi,
  perbaruiSiswaAksi,
} from "@/lib/actions-siswa";
import {
  KELULUSAN_AWAL,
  STATUS_KELULUSAN,
  type StatusKelulusan,
} from "@/lib/siswa/status";

/**
 * Form tambah/sunting siswa beserta konfirmasi hapus.
 *
 * Password hanya dikirim bila diisi: saat menyunting, membiarkannya kosong
 * berarti password lama tetap berlaku.
 */

export type SiswaForm = {
  id: string;
  noCasis: string;
  username: string;
  nama: string;
  email: string;
  asalSekolah: string;
  kelas: string;
  status: "Aktif" | "Nonaktif";
  statusKelulusan: StatusKelulusan;
  tautanDrive: string;
  catatanDrive: string;
  jumlahPercobaan: number;
};

export function FormSiswa({
  siswa,
  onSelesai,
}: {
  /** null berarti menambah peserta baru. */
  siswa: SiswaForm | null;
  onSelesai: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [masalah, setMasalah] = useState<string[]>([]);

  const menyunting = Boolean(siswa);

  // `onSubmit`, bukan prop `action`: React mengosongkan form setelah fungsi
  // `action` selesai, sehingga satu pesan validasi akan menghapus seluruh
  // isian yang sudah diketik admin.
  const kirim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setMasalah([]);
    mulaiTransisi(async () => {
      const hasil = siswa
        ? await perbaruiSiswaAksi(siswa.id, formData)
        : await buatSiswaAksi(formData);

      if (!hasil.ok) {
        setMasalah(hasil.masalah);
        return;
      }

      toast.sukses(
        menyunting
          ? "Data peserta berhasil diperbarui."
          : "Peserta baru berhasil ditambahkan.",
      );
      onSelesai();
      router.refresh();
    });
  };

  return (
    <form onSubmit={kirim} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nomor Casis"
          htmlFor="noCasis"
          hint="Nomor calon siswa dari panitia. Opsional, tetapi bila diisi harus unik — peserta juga dapat memakainya untuk masuk."
        >
          <Input
            id="noCasis"
            name="noCasis"
            defaultValue={siswa?.noCasis}
            placeholder="contoh: 2026001"
            maxLength={30}
          />
        </Field>

        <Field
          label="Username"
          htmlFor="username"
          hint="Dipakai peserta untuk masuk. Huruf kecil, angka, titik, garis bawah, atau strip."
        >
          <Input
            id="username"
            name="username"
            defaultValue={siswa?.username}
            placeholder="contoh: aditya.pratama"
            maxLength={32}
            required
          />
        </Field>

        <Field label="Nama Lengkap" htmlFor="nama">
          <Input
            id="nama"
            name="nama"
            defaultValue={siswa?.nama}
            placeholder="Nama sesuai data sekolah"
            maxLength={80}
            required
          />
        </Field>

        <Field label="Email" htmlFor="email" hint="Opsional.">
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={siswa?.email}
            placeholder="nama@email.com"
            maxLength={120}
          />
        </Field>

        <Field label="Asal Sekolah" htmlFor="asalSekolah" hint="Opsional.">
          <Input
            id="asalSekolah"
            name="asalSekolah"
            defaultValue={siswa?.asalSekolah}
            placeholder="SMP Negeri 1 ..."
            maxLength={120}
          />
        </Field>

        <Field label="Kelas" htmlFor="kelas" hint="Opsional.">
          <Input
            id="kelas"
            name="kelas"
            defaultValue={siswa?.kelas}
            placeholder="IX-A"
            maxLength={20}
          />
        </Field>

        <Field
          label="Status Akun"
          htmlFor="status"
          hint="Siswa nonaktif tidak dapat masuk."
        >
          <Select id="status" name="status" defaultValue={siswa?.status ?? "Aktif"}>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </Select>
        </Field>

        <Field
          label="Status Kelulusan"
          htmlFor="statusKelulusan"
          hint="Hasil seleksi SMA Taruna Nusantara."
        >
          <Select
            id="statusKelulusan"
            name="statusKelulusan"
            defaultValue={siswa?.statusKelulusan ?? KELULUSAN_AWAL}
          >
            {STATUS_KELULUSAN.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Link Google Drive"
            htmlFor="tautanDrive"
            hint="Tautan khusus siswa ini. Kosongkan bila belum ada."
          >
            <Input
              id="tautanDrive"
              name="tautanDrive"
              type="url"
              defaultValue={siswa?.tautanDrive}
              placeholder="https://drive.google.com/drive/folders/..."
              maxLength={500}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Catatan Drive" htmlFor="catatanDrive" hint="Opsional.">
            <Textarea
              id="catatanDrive"
              name="catatanDrive"
              rows={2}
              defaultValue={siswa?.catatanDrive}
              placeholder="Berisi format surat dan berkas contoh dari panitia."
              maxLength={300}
            />
          </Field>
        </div>
      </div>

      <Field
        label={menyunting ? "Password Baru" : "Password Awal"}
        htmlFor="password"
        hint={
          menyunting
            ? "Biarkan kosong bila password tidak diubah."
            : "Minimal 6 karakter. Sampaikan kepada peserta."
        }
      >
        <Input
          id="password"
          name="password"
          type="text"
          autoComplete="new-password"
          placeholder={menyunting ? "Kosongkan bila tidak diubah" : "Minimal 6 karakter"}
          maxLength={64}
          required={!menyunting}
        />
      </Field>

      {masalah.length > 0 ? (
        <ul
          role="alert"
          className="space-y-1 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
        >
          {masalah.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row-reverse">
        <Button type="submit" disabled={proses} className="w-full sm:w-auto">
          {proses ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {menyunting ? "Simpan perubahan" : "Tambah peserta"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onSelesai}
          disabled={proses}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}

/** Tombol tambah peserta pada kepala tabel. */
export function TombolTambahSiswa() {
  const [terbuka, setTerbuka] = useState(false);

  return (
    <>
      <Button type="button" size="sm" onClick={() => setTerbuka(true)}>
        <UserPlus className="size-4" />
        Tambah Siswa
      </Button>

      <Modal
        terbuka={terbuka}
        lebar="lg"
        judul="Tambah Peserta"
        deskripsi="Peserta baru langsung dapat masuk memakai username dan password ini."
        onTutup={() => setTerbuka(false)}
      >
        <FormSiswa siswa={null} onSelesai={() => setTerbuka(false)} />
      </Modal>
    </>
  );
}

/** Tombol sunting dan hapus pada satu baris tabel. */
export function AksiKelolaSiswa({ siswa }: { siswa: SiswaForm }) {
  const router = useRouter();
  const toast = useToast();
  const [sunting, setSunting] = useState(false);
  const [hapus, setHapus] = useState(false);
  const [proses, mulaiTransisi] = useTransition();

  const jalankanHapus = () => {
    mulaiTransisi(async () => {
      const hasil = await hapusSiswaAksi(siswa.id);
      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Peserta gagal dihapus.");
        return;
      }
      toast.sukses(`${siswa.nama} telah dihapus.`);
      setHapus(false);
      router.refresh();
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setSunting(true)}
      >
        <Pencil className="size-4" />
        Sunting
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-rose-600 hover:bg-rose-50"
        onClick={() => setHapus(true)}
      >
        <Trash2 className="size-4" />
        Hapus
      </Button>

      <Modal
        terbuka={sunting}
        lebar="lg"
        judul={`Sunting ${siswa.nama}`}
        deskripsi={`ID peserta ${siswa.id} · tidak berubah meskipun username diganti.`}
        onTutup={() => setSunting(false)}
      >
        <FormSiswa siswa={siswa} onSelesai={() => setSunting(false)} />
      </Modal>

      <Modal
        terbuka={hapus}
        judul="Hapus peserta?"
        deskripsi={`${siswa.nama} akan dihapus permanen.`}
        onTutup={() => setHapus(false)}
      >
        <p className="text-sm leading-relaxed text-muted">
          Seluruh data peserta beserta{" "}
          <b className="text-navy-800">
            {siswa.jumlahPercobaan} riwayat pengerjaan
          </b>{" "}
          akan ikut terhapus dan tidak dapat dikembalikan. Bila hanya ingin
          menutup aksesnya, gunakan <b className="text-navy-800">Nonaktifkan</b>.
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
