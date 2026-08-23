"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  Save,
  Settings2,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { simpanSesiAksi, type KonfigState } from "@/lib/actions-konfigurasi";
import { SUBJECTS, type Subject } from "@/lib/bank-soal/skema";
import { cn } from "@/lib/utils";

export type BarisSesi = {
  paketId: string;
  paketNama: string;
  sesiId: string;
  nama: string;
  urutan: number;
  mataUji: {
    subject: Subject;
    jumlahSoal: number;
    durasiMenit: number;
    /** Jumlah soal aktif yang benar-benar tersedia di bank. */
    tersedia?: number;
  }[];
  /** true bila sesi ini sudah punya password pembuka. */
  sandiTerpasang: boolean;
  totalSoal?: number;
  totalDurasi?: number;
};

export type BarisPaketSesi = {
  paketId: string;
  paketNama: string;
  /** Seluruh sesi milik paket ini, sudah terurut. */
  sesi: BarisSesi[];
};

/**
 * Satu tombol untuk mengatur seluruh sesi sebuah paket.
 *
 * Tabelnya diringkas menjadi satu baris per paket; sesi-sesinya baru muncul di
 * dalam modal ini sebagai tab. Sebelumnya tiap sesi punya barisnya sendiri,
 * sehingga enam paket berarti dua belas baris yang isinya berulang-ulang.
 *
 * Tiap sesi tetap disimpan lewat aksinya sendiri — bukan satu simpanan besar —
 * supaya validasi silang antar sesi (satu mata uji hanya boleh ada di satu
 * sesi) tetap berlaku apa adanya.
 */
export function TombolAturPaket({ paket }: { paket: BarisPaketSesi }) {
  const router = useRouter();
  const [terbuka, setTerbuka] = useState(false);

  return (
    <>
      <button
        type="button"
        title={`Atur sesi & password ${paket.paketNama}`}
        onClick={() => setTerbuka(true)}
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-transparent text-slate-500 transition hover:border-navy-100 hover:bg-navy-50 hover:text-navy-900"
      >
        <Settings2 className="size-4.5" strokeWidth={2} />
        <span className="sr-only">Atur sesi &amp; password {paket.paketNama}</span>
      </button>

      {terbuka ? (
        <PanelSesiPaket
          paket={paket}
          onTutup={() => setTerbuka(false)}
          onSelesai={() => {
            setTerbuka(false);
            router.refresh();
          }}
        />
      ) : null}
    </>
  );
}

function PanelSesiPaket({
  paket,
  onTutup,
  onSelesai,
}: {
  paket: BarisPaketSesi;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const [aktif, setAktif] = useState(paket.sesi[0]?.sesiId ?? "");
  const sesi = paket.sesi.find((item) => item.sesiId === aktif) ?? paket.sesi[0];

  if (!sesi) {
    return (
      <Modal
        terbuka
        judul={paket.paketNama}
        deskripsi="Paket ini belum memiliki sesi."
        onTutup={onTutup}
      >
        <p className="text-sm leading-relaxed text-muted">
          Sesi bawaan dibuat otomatis saat paket ditambahkan. Bila daftar ini
          kosong, buat ulang paketnya dari tab Paket Try Out.
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      terbuka
      lebar="lg"
      judul={paket.paketNama}
      deskripsi="Pilih sesi yang ingin diatur, lalu simpan. Setiap sesi disimpan terpisah."
      onTutup={onTutup}
    >
      {/* Pemilih sesi di dalam modal, menggantikan baris terpisah per sesi. */}
      <div
        role="tablist"
        aria-label="Sesi pada paket ini"
        className="mb-5 flex flex-wrap gap-2 border-b border-line pb-3"
      >
        {paket.sesi.map((item) => {
          const dipilih = item.sesiId === sesi.sesiId;
          return (
            <button
              key={item.sesiId}
              type="button"
              role="tab"
              aria-selected={dipilih}
              onClick={() => setAktif(item.sesiId)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition",
                dipilih
                  ? "bg-navy-900 font-semibold text-white"
                  : "border border-navy-100 font-medium text-navy-700 hover:bg-navy-50",
              )}
            >
              {item.nama}
              <Badge tone={item.sandiTerpasang ? "hijau" : "merah"}>
                {item.sandiTerpasang ? "ada sandi" : "tanpa sandi"}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* `key` memaksa form disusun ulang saat berpindah sesi, sehingga isian
          sesi sebelumnya tidak tertinggal di layar. */}
      <FormSesi
        key={sesi.sesiId}
        sesi={sesi}
        onTutup={onTutup}
        onSelesai={onSelesai}
      />
    </Modal>
  );
}

function FormSesi({
  sesi,
  onTutup,
  onSelesai,
}: {
  sesi: BarisSesi;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const aksi = simpanSesiAksi.bind(null, sesi.paketId, sesi.sesiId);
  const [state, formAction] = useActionState<KonfigState, FormData>(aksi, {});
  const [dipilih, setDipilih] = useState<Subject[]>(
    sesi.mataUji.map((mata) => mata.subject),
  );

  if (state.sukses) queueMicrotask(onSelesai);

  const nilaiAwal = (subject: Subject) =>
    sesi.mataUji.find((mata) => mata.subject === subject);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama Sesi" htmlFor="nama">
          <Input id="nama" name="nama" defaultValue={sesi.nama} required />
        </Field>
        <Field
          label="Urutan Pelaksanaan"
          htmlFor="urutan"
          hint="Sesi dengan urutan lebih kecil dikerjakan lebih dahulu."
        >
          <Input
            id="urutan"
            name="urutan"
            type="number"
            min={1}
            defaultValue={sesi.urutan}
            required
          />
        </Field>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-navy-900">Mata Uji</p>
        {SUBJECTS.map((subject) => {
          const awal = nilaiAwal(subject);
          const aktif = dipilih.includes(subject);
          return (
            <div
              key={subject}
              className="rounded-xl border border-line px-4 py-3.5"
            >
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-navy-900">
                <input
                  type="checkbox"
                  name="mataUji"
                  value={subject}
                  checked={aktif}
                  onChange={(event) =>
                    setDipilih((sebelumnya) =>
                      event.target.checked
                        ? [...sebelumnya, subject]
                        : sebelumnya.filter((item) => item !== subject),
                    )
                  }
                  className="size-4.5 rounded border-navy-200 accent-navy-800"
                />
                {subject}
              </label>

              {aktif ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Jumlah Soal" htmlFor={`jumlahSoal_${subject}`}>
                    <Input
                      id={`jumlahSoal_${subject}`}
                      name={`jumlahSoal_${subject}`}
                      type="number"
                      min={1}
                      max={200}
                      defaultValue={awal?.jumlahSoal ?? 20}
                      required
                    />
                  </Field>
                  <Field label="Durasi (menit)" htmlFor={`durasi_${subject}`}>
                    <Input
                      id={`durasi_${subject}`}
                      name={`durasi_${subject}`}
                      type="number"
                      min={1}
                      max={300}
                      defaultValue={awal?.durasiMenit ?? 25}
                      required
                    />
                  </Field>
                </div>
              ) : null}
            </div>
          );
        })}
        <p className="text-xs text-muted">
          Satu mata uji hanya boleh berada pada satu sesi dalam paket yang sama.
        </p>
      </div>

      {/* Password sesi menyatu dengan konfigurasinya: satu sesi, satu form. */}
      <div className="space-y-3 rounded-xl border border-line bg-navy-50/40 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <KeyRound className="size-4.5 shrink-0 text-navy-600" />
          <p className="text-sm font-semibold text-navy-900">Password Sesi</p>
          <Badge tone={sesi.sandiTerpasang ? "hijau" : "merah"}>
            {sesi.sandiTerpasang ? "Terpasang" : "Belum diatur"}
          </Badge>
        </div>

        <p className="text-xs leading-relaxed text-muted">
          Yang tersimpan hanya turunan scrypt beserta salt acak, sehingga
          password lama tidak dapat ditampilkan kembali. Kosongkan kedua isian
          di bawah bila password tidak ingin diubah.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Password Baru"
            htmlFor="password"
            hint="Minimal 6 karakter, tanpa spasi."
          >
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Kosongkan bila tidak diubah"
            />
          </Field>
          <Field label="Ulangi Password Baru" htmlFor="ulangi">
            <Input
              id="ulangi"
              name="ulangi"
              type="password"
              autoComplete="new-password"
              placeholder="Ketik ulang password baru"
            />
          </Field>
        </div>
      </div>

      {state.masalah?.length ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="size-4" />
            Konfigurasi belum dapat disimpan
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {state.masalah.map((pesan) => (
              <li key={pesan}>{pesan}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.sukses ? (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="size-4" />
          {state.sukses}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row-reverse">
        <TombolSimpan />
        <Button type="button" variant="outline" onClick={onTutup}>
          Batal
        </Button>
      </div>
    </form>
  );
}

function TombolSimpan() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Save className="size-4" />
      )}
      Simpan Sesi
    </Button>
  );
}

export function BadgeMataUji({ nama }: { nama: string }) {
  return <Badge tone="netral">{nama}</Badge>;
}
