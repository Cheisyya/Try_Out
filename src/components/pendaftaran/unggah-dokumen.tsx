"use client";

import { useRouter } from "next/navigation";
import {
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  LoaderCircle,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import {
  hapusDokumenAksi,
  unggahDokumenAksi,
} from "@/lib/actions-pendaftaran";
import { kompresBerkas } from "@/lib/kompresi";
import {
  atributAccept,
  ekstensiDari,
  formatDariEkstensi,
  formatUkuran,
  labelFormat,
  labelUkuran,
  namaBerkasOtomatis,
  type SpesifikasiDokumen,
} from "@/lib/pendaftaran/dokumen";
import type { BerkasDokumen } from "@/lib/pendaftaran/tipe";
import { cn, formatTanggalWaktu } from "@/lib/utils";

/**
 * Kartu unggah satu jenis dokumen.
 *
 * Format diperiksa lebih dulu di peramban agar peserta mendapat jawaban
 * seketika tanpa menunggu unggahan besar selesai terkirim. Pemeriksaan yang
 * menentukan tetap berada di server — termasuk pencocokan isi berkas lewat
 * magic bytes, yang tidak dapat ditiru dari sisi klien.
 *
 * Berkas yang melebihi batas tidak langsung ditolak: gambar dan PDF dikecilkan
 * lebih dulu di peramban (lihat `src/lib/kompresi`), dan yang terkirim adalah
 * hasilnya. Penolakan hanya terjadi bila setelah dikecilkan pun masih di atas
 * batas.
 */
export function KartuDokumen({
  spek,
  berkas,
  namaSiswa,
}: {
  spek: SpesifikasiDokumen;
  berkas: BerkasDokumen | null;
  /** Nama yang dipakai pada penamaan berkas otomatis. */
  namaSiswa: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [proses, mulaiTransisi] = useTransition();
  const [masalah, setMasalah] = useState<string | null>(null);
  const [pilihan, setPilihan] = useState<File | null>(null);
  // Berkas hasil pengecilan beserta ukuran aslinya, untuk keterangan di layar.
  const [kompresi, setKompresi] = useState<{
    berkas: File;
    ukuranAwal: number;
  } | null>(null);
  const [mengompres, setMengompres] = useState(false);
  // Hanya berlaku ketika berkas sudah ada: menandai form ganti berkas terbuka.
  const [menyunting, setMenyunting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Pemeriksaan cepat di peramban: format dan berkas kosong.
   *
   * Ukuran sengaja tidak diperiksa di sini — berkas kebesaran dikecilkan dulu
   * oleh `siapkanBerkas`, dan baru ditolak bila hasilnya tetap di atas batas.
   */
  const periksaDiKlien = (file: File): string | null => {
    const ekstensi = ekstensiDari(file.name);
    if (!formatDariEkstensi(spek, ekstensi)) {
      return `Format berkas harus ${labelFormat(spek)}. Berkas ".${ekstensi || "tanpa ekstensi"}" tidak diterima.`;
    }
    if (file.size === 0) return "Berkas kosong. Pilih berkas yang lain.";
    return null;
  };

  /**
   * Mengecilkan berkas bila melebihi batas, lalu mengembalikan berkas yang
   * benar-benar akan dikirim. `null` berarti berkasnya tidak dapat dipakai dan
   * pesannya sudah ditampilkan.
   */
  const siapkanBerkas = async (file: File): Promise<File | null> => {
    if (file.size <= spek.maksByte) {
      setKompresi(null);
      return file;
    }

    setMengompres(true);
    try {
      const hasil = await kompresBerkas(file, spek.maksByte);

      if (hasil.berkas.size > spek.maksByte) {
        setMasalah(
          `Setelah dikecilkan, berkas masih ${formatUkuran(hasil.berkas.size)} — di atas batas ${labelUkuran(spek.maksByte)}. Pindai ulang dengan resolusi lebih rendah, lalu unggah kembali.`,
        );
        setKompresi(null);
        return null;
      }

      setKompresi(
        hasil.dikompres
          ? { berkas: hasil.berkas, ukuranAwal: hasil.ukuranAwal }
          : null,
      );
      return hasil.berkas;
    } catch (galat) {
      setMasalah(
        galat instanceof Error
          ? galat.message
          : "Berkas gagal dikecilkan otomatis.",
      );
      setKompresi(null);
      return null;
    } finally {
      setMengompres(false);
    }
  };

  const pilihBerkas = async (file: File | null) => {
    setMasalah(null);
    setKompresi(null);
    if (!file) {
      setPilihan(null);
      return;
    }

    const salah = periksaDiKlien(file);
    if (salah) {
      setMasalah(salah);
      setPilihan(null);
      // Berkas yang ditolak dibuang dari input agar tidak ikut terkirim.
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Pengecilan dijalankan begitu berkas dipilih, bukan saat tombol Unggah
    // ditekan: peserta langsung tahu ukuran akhirnya sebelum mengirim.
    const siap = await siapkanBerkas(file);
    if (!siap) {
      setPilihan(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setPilihan(siap);
  };

  /**
   * `onSubmit`, bukan prop `action`: React mengosongkan form setelah fungsi
   * `action` selesai, sehingga keterangan yang sudah diketik ikut hilang ketika
   * berkas ditolak server. Form hanya dikosongkan setelah unggahan berhasil.
   */
  const kirim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const file = formData.get("berkas");
    if (!(file instanceof File) || file.size === 0) {
      setMasalah("Pilih berkas terlebih dahulu.");
      return;
    }

    const salah = periksaDiKlien(file);
    if (salah) {
      setMasalah(salah);
      return;
    }

    // `pilihan` adalah berkas yang sudah dikecilkan; isi input berkas masih
    // berupa berkas asli, jadi ia ditimpa sebelum dikirim.
    if (pilihan) formData.set("berkas", pilihan, pilihan.name);

    setMasalah(null);
    mulaiTransisi(async () => {
      const hasil = await unggahDokumenAksi(formData);
      if (!hasil.ok) {
        setMasalah(hasil.masalah[0] ?? "Berkas gagal diunggah.");
        toast.galat("Berkas ditolak. Periksa ketentuan dokumen.");
        return;
      }

      toast.sukses(`${spek.namaBerkas} berhasil diunggah.`);
      setPilihan(null);
      setKompresi(null);
      setMenyunting(false);
      formRef.current?.reset();
      router.refresh();
    });
  };

  const hapus = () => {
    mulaiTransisi(async () => {
      const hasil = await hapusDokumenAksi(spek.kunci);
      if (!hasil.ok) {
        toast.galat(hasil.masalah[0] ?? "Berkas gagal dihapus.");
        return;
      }
      toast.sukses(`${spek.namaBerkas} telah dihapus.`);
      router.refresh();
    });
  };

  // Ekstensi mengikuti berkas yang benar-benar akan dikirim: gambar hasil
  // pengecilan selalu berupa JPG, termasuk ketika aslinya PNG.
  const namaOtomatis = namaBerkasOtomatis(
    spek,
    namaSiswa,
    pilihan
      ? ekstensiDari(pilihan.name)
      : (berkas?.ekstensi ?? spek.format[0]),
  );

  return (
    <Card id={spek.kunci} className="scroll-mt-24">
      <CardHeader
        judul={
          <span className="flex flex-wrap items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-navy-900 text-xs font-bold text-gold-300">
              {spek.nomor}
            </span>
            {spek.judul}
          </span>
        }
        aksi={
          berkas ? (
            <Badge tone="hijau">
              <CheckCircle2 className="size-3.5" />
              Terunggah
            </Badge>
          ) : (
            <Badge tone={spek.wajib ? "merah" : "netral"}>
              {spek.wajib ? "Wajib" : "Tidak wajib"}
            </Badge>
          )
        }
      />

      <CardBody className="space-y-4">
        <ul className="space-y-1.5 rounded-xl bg-navy-50/60 px-4 py-3 text-sm leading-relaxed text-navy-800">
          {spek.ketentuan.map((butir) => (
            <li key={butir} className="flex gap-2">
              <span aria-hidden className="text-langit-500">
                •
              </span>
              <span className="min-w-0">{butir}</span>
            </li>
          ))}
        </ul>

        {berkas ? (
          <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-900">
                {namaOtomatis}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {formatUkuran(berkas.ukuran)} · diunggah{" "}
                {formatTanggalWaktu(new Date(berkas.diunggahPada).toISOString())}
                {berkas.keterangan ? ` · ${berkas.keterangan}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    `/siswa/data-diri/dokumen/berkas/${spek.kunci}`,
                    "_blank",
                    "noopener",
                  )
                }
              >
                <Eye className="size-4" />
                Lihat
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMenyunting((sebelumnya) => !sebelumnya)}
              >
                <Pencil className="size-4" />
                {menyunting ? "Batal" : "Ganti"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:bg-rose-50"
                onClick={hapus}
                disabled={proses}
              >
                {proses ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Hapus
              </Button>
            </div>
          </div>
        ) : null}

        {/*
          Setelah berkas terunggah, form unggah disembunyikan supaya berkas yang
          sudah benar tidak tertimpa tanpa sengaja. Tombol "Ganti" di atas
          membukanya kembali — alur yang sama dengan Simpan/Edit pada submenu
          Data Diri Siswa lainnya.
        */}
        <form
          ref={formRef}
          onSubmit={kirim}
          className={cn("space-y-3", berkas && !menyunting && "hidden")}
        >
          <input type="hidden" name="kunci" value={spek.kunci} />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor={`berkas-${spek.kunci}`}>
                {berkas ? "Ganti berkas" : "Pilih berkas"}
              </Label>
              <input
                ref={inputRef}
                id={`berkas-${spek.kunci}`}
                name="berkas"
                type="file"
                accept={atributAccept(spek)}
                onChange={(event) => {
                  void pilihBerkas(event.currentTarget.files?.[0] ?? null);
                }}
                className={cn(
                  "w-full rounded-xl border border-navy-100 bg-white text-sm text-navy-900 shadow-sm outline-none transition",
                  "file:mr-3 file:h-11 file:cursor-pointer file:border-0 file:bg-navy-50 file:px-4 file:text-sm file:font-semibold file:text-navy-800",
                  "hover:file:bg-navy-100 focus:border-navy-400 focus:ring-4 focus:ring-navy-100",
                )}
              />
              <p className="text-xs text-muted">
                Akan disimpan otomatis sebagai{" "}
                <b className="font-semibold text-navy-800">{namaOtomatis}</b>
              </p>

              {/* Berkas kebesaran dikecilkan otomatis; keadaannya dilaporkan
                  apa adanya supaya peserta tahu berkas mana yang tersimpan. */}
              {mengompres ? (
                <p className="flex items-center gap-2 text-xs font-medium text-navy-700">
                  <LoaderCircle className="size-3.5 animate-spin" />
                  Mengecilkan berkas agar muat batas{" "}
                  {labelUkuran(spek.maksByte)}...
                </p>
              ) : kompresi ? (
                <p className="flex items-start gap-2 rounded-lg bg-emerald-50 px-2.5 py-2 text-xs text-emerald-800">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    Dikecilkan dari{" "}
                    <b>{formatUkuran(kompresi.ukuranAwal)}</b> menjadi{" "}
                    <b>{formatUkuran(kompresi.berkas.size)}</b>.{" "}
                    {kompresi.berkas.type === "application/pdf"
                      ? "Halaman PDF diubah menjadi gambar, jadi teksnya tidak lagi dapat diseleksi."
                      : "Gambar disimpan ulang sebagai JPG."}{" "}
                    Pastikan isinya masih terbaca jelas sebelum diunggah.
                  </span>
                </p>
              ) : null}
            </div>

            <Button type="submit" disabled={proses || mengompres || !pilihan}>
              {proses || mengompres ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Unggah
            </Button>
          </div>

          {spek.mintaKeterangan ? (
            <div className="space-y-1.5">
              <Label htmlFor={`keterangan-${spek.kunci}`}>
                {spek.mintaKeterangan.label}
              </Label>
              <Input
                id={`keterangan-${spek.kunci}`}
                name="keterangan"
                maxLength={80}
                defaultValue={berkas?.keterangan ?? ""}
                placeholder="AKSELARASI"
              />
              <p className="text-xs text-muted">{spek.mintaKeterangan.hint}</p>
            </div>
          ) : null}

          {masalah ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {masalah}
            </p>
          ) : null}
        </form>
      </CardBody>
    </Card>
  );
}
