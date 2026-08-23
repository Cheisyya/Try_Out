"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import {
  AlertCircle,
  ExternalLink,
  Link2,
  LoaderCircle,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { simpanTautanDriveAksi } from "@/lib/actions-siswa";

/**
 * Pengelolaan tautan Google Drive milik satu siswa.
 *
 * Setiap siswa punya tautannya sendiri; admin mengisi di sini, dan siswa
 * membacanya pada menu Data Diri Siswa → Link Google Drive.
 */
export function TautanDriveSiswa({
  id,
  nama,
  tautanDrive,
  catatanDrive,
}: {
  id: string;
  nama: string;
  tautanDrive: string;
  catatanDrive: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [masalah, setMasalah] = useState<string[]>([]);

  // `onSubmit`, bukan prop `action`: React mengosongkan form setelah fungsi
  // `action` selesai, dan tautan drive terlalu panjang untuk diketik ulang.
  const kirim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setMasalah([]);
    mulaiTransisi(async () => {
      const hasil = await simpanTautanDriveAksi(id, formData);
      if (!hasil.ok) {
        setMasalah(hasil.masalah);
        return;
      }
      toast.sukses(`Link drive ${nama} tersimpan.`);
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader
        judul="Link Google Drive"
        deskripsi="Tautan khusus siswa ini. Tampil pada portal siswa setelah disimpan."
        aksi={
          tautanDrive ? (
            <a
              href={tautanDrive}
              target="_blank"
              // Wajib pada tautan keluar yang dibuka di tab baru agar halaman
              // tujuan tidak dapat menyentuh tab ini.
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-langit-600 hover:text-navy-900"
            >
              Buka drive
              <ExternalLink className="size-4" />
            </a>
          ) : null
        }
      />
      <CardBody>
        <form onSubmit={kirim} className="space-y-4">
          <Field
            label="Alamat Tautan"
            htmlFor="tautanDrive"
            hint="Harus diawali http:// atau https://. Kosongkan untuk menghapus tautan."
          >
            <Input
              id="tautanDrive"
              name="tautanDrive"
              type="url"
              defaultValue={tautanDrive}
              placeholder="https://drive.google.com/drive/folders/..."
              maxLength={500}
            />
          </Field>

          <Field label="Catatan" htmlFor="catatanDrive" hint="Opsional.">
            <Textarea
              id="catatanDrive"
              name="catatanDrive"
              rows={2}
              defaultValue={catatanDrive}
              placeholder="Berisi format surat dan berkas contoh dari panitia."
              maxLength={300}
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

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs text-muted">
              <Link2 className="size-4 shrink-0" />
              {tautanDrive
                ? "Siswa sudah dapat membuka tautan ini."
                : "Belum ada tautan untuk siswa ini."}
            </p>
            <Button type="submit" size="sm" disabled={proses}>
              {proses ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Simpan Link
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
