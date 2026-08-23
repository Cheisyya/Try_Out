"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Pencil,
  Plus,
  Power,
  Save,
  Trash2,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { KeadaanKosong } from "@/components/ui/state";
import { Field, Input, Label } from "@/components/ui/field";
import { Table, Td, Th, TableWrapper } from "@/components/ui/table";
import { TombolAturPaket, type BarisSesi } from "@/components/admin/kelola-sesi";
import {
  hapusPaketAksi,
  simpanPaketAksi,
  ubahAktifPaketAksi,
  type KonfigState,
} from "@/lib/actions-konfigurasi";
import { cn, formatTanggalWaktu } from "@/lib/utils";

export type BarisPaket = {
  id: string;
  nomor: number;
  nama: string;
  deskripsi: string;
  jadwal: string;
  ditutupPada?: string;
  statusJendela: string;
  aktif: boolean;
  jumlahSesi: number;
  totalSoal: number;
  totalDurasi: number;
  soalTersedia: number;
  /** Sesi milik paket ini, untuk jendela pengaturan sesi & password. */
  sesi: BarisSesi[];
};

const kelasTextarea =
  "w-full rounded-xl border border-navy-100 bg-white px-3.5 py-3 text-sm leading-relaxed text-navy-900 shadow-sm outline-none transition focus:border-navy-400 focus:ring-4 focus:ring-navy-100";

/**
 * Tombol baris paket; dipakai baris tabel maupun kartu ponsel.
 *
 * Ikon saja dengan lebar tetap, sama seperti kolom aksi pada tabel siswa —
 * kolomnya jadi tidak ikut melebar mengikuti panjang label, dan seluruh tabel
 * admin terbaca seragam. Maknanya tetap tersampaikan lewat tooltip dan teks
 * `sr-only`.
 */
function TombolPaket({
  paket,
  proses,
  onSunting,
  onUbahAktif,
  onHapus,
}: {
  paket: BarisPaket;
  proses: boolean;
  onSunting: () => void;
  onUbahAktif: () => void;
  onHapus: () => void;
}) {
  const labelAktif = paket.aktif ? "Nonaktifkan paket" : "Aktifkan paket";

  return (
    <div className="flex gap-1 lg:justify-end">
      {/* Gerigi membuka sesi & password paket ini. */}
      <TombolAturPaket
        paket={{
          paketId: paket.id,
          paketNama: paket.nama,
          sesi: paket.sesi,
        }}
      />
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

/**
 * Ringkasan sesi sebuah paket: nama, mata ujinya, dan status passwordnya.
 * Cukup untuk memutuskan perlu dibuka atau tidak, tanpa satu baris per sesi.
 */
function RingkasSesi({ sesi }: { sesi: BarisSesi[] }) {
  if (sesi.length === 0) {
    return <span className="text-xs text-muted">belum ada sesi</span>;
  }

  return (
    <ul className="space-y-1">
      {sesi.map((item) => (
        <li key={item.sesiId} className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-navy-800">{item.nama}</span>
          <span className="text-muted">
            {item.mataUji.map((mata) => mata.subject).join(" & ") ||
              "tanpa mata uji"}
          </span>
        </li>
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

export function KelolaPaket({ daftar }: { daftar: BarisPaket[] }) {
  const router = useRouter();
  const [daftarLokal, setDaftarLokal] = useState(daftar);
  const [formTerbuka, setFormTerbuka] = useState<null | BarisPaket | "baru">(null);
  const [hapusTerbuka, setHapusTerbuka] = useState<BarisPaket | null>(null);
  const [proses, mulaiTransisi] = useTransition();
  const [galat, setGalat] = useState<string | null>(null);

  useEffect(() => {
    setDaftarLokal(daftar);
  }, [daftar]);

  const ubahAktif = (paket: BarisPaket) => {
    const tujuan = !paket.aktif;
    setGalat(null);
    setDaftarLokal((prev) =>
      prev.map((item) =>
        item.id === paket.id ? { ...item, aktif: tujuan } : item,
      ),
    );
    mulaiTransisi(async () => {
      const hasil = await ubahAktifPaketAksi(paket.id, tujuan);
      if (!hasil.ok) {
        setDaftarLokal((prev) =>
          prev.map((item) =>
            item.id === paket.id ? { ...item, aktif: paket.aktif } : item,
          ),
        );
        setGalat(hasil.masalah?.[0] ?? "Perubahan gagal disimpan.");
      }
    });
  };

  const jalankanHapus = (paket: BarisPaket) => {
    setGalat(null);
    mulaiTransisi(async () => {
      const hasil = await hapusPaketAksi(paket.id);
      if (!hasil.ok) {
        setGalat(hasil.masalah?.[0] ?? "Paket gagal dihapus.");
        return;
      }
      setHapusTerbuka(null);
      router.refresh();
    });
  };

  return (
    <>
      <Card>
        <CardHeader
          judul="Paket &amp; Sesi Try Out"
          deskripsi="Satu baris per paket. Ikon gerigi membuka sesi beserta passwordnya."
          aksi={
            <Button type="button" size="sm" onClick={() => setFormTerbuka("baru")}>
              <Plus className="size-4" />
              Tambah Paket
            </Button>
          }
        />
        <CardBody className="p-0 sm:p-0">
          {galat ? (
            <p className="border-b border-line bg-rose-50 px-5 py-3 text-sm text-rose-700 sm:px-6">
              {galat}
            </p>
          ) : null}
          {daftarLokal.length === 0 ? (
            <KeadaanKosong
              judul="Belum ada paket try out"
              deskripsi="Tambahkan paket pertama agar peserta dapat mulai mengerjakan try out. Setiap paket baru otomatis dibuatkan dua sesi bawaan."
            />
          ) : (
          <>
          <TableWrapper className="hidden lg:block">
            <Table>
              <thead>
                <tr>
                  <Th>Paket</Th>
                  <Th>Jadwal Pengerjaan</Th>
                  <Th>Sesi</Th>
                  <Th>Komposisi</Th>
                  <Th>Bank Soal</Th>
                  <Th>Status</Th>
                  <Th className="w-[168px] text-right">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {daftarLokal.map((paket) => (
                  <tr key={paket.id} className="transition hover:bg-navy-50/40">
                    {/* Cukup nama paket. Deskripsi dibiarkan di formulir saja
                        supaya tinggi tiap baris seragam. */}
                    <Td className="whitespace-nowrap font-medium">{paket.nama}</Td>
                    <Td className="whitespace-nowrap">
                      <span className="block text-xs text-navy-800">
                        Buka: {formatTanggalWaktu(paket.jadwal)}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        Tutup:{" "}
                        {paket.ditutupPada
                          ? formatTanggalWaktu(paket.ditutupPada)
                          : "tanpa batas"}
                      </span>
                    </Td>
                    <Td>
                      <RingkasSesi sesi={paket.sesi} />
                    </Td>
                    <Td className="whitespace-nowrap text-muted">
                      {paket.totalSoal} soal · {paket.totalDurasi} menit
                    </Td>
                    <Td className="whitespace-nowrap">
                      <span
                        className={
                          paket.soalTersedia >= paket.totalSoal
                            ? "font-semibold text-emerald-600"
                            : "font-semibold text-navy-900"
                        }
                      >
                        {paket.soalTersedia}
                      </span>
                      <span className="text-muted"> / {paket.totalSoal}</span>
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
                        onSunting={() => setFormTerbuka(paket)}
                        onUbahAktif={() => ubahAktif(paket)}
                        onHapus={() => setHapusTerbuka(paket)}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          {/* Kartu untuk ponsel dan tablet */}
          <ul className="divide-y divide-line lg:hidden">
            {daftarLokal.map((paket) => (
              <li key={paket.id} className="space-y-3 px-4 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy-900">{paket.nama}</p>
                  </div>
                  <Badge tone={paket.aktif ? "hijau" : "netral"}>
                    {paket.aktif ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-muted">
                  <p>Buka: {formatTanggalWaktu(paket.jadwal)}</p>
                  <p>
                    Tutup:{" "}
                    {paket.ditutupPada
                      ? formatTanggalWaktu(paket.ditutupPada)
                      : "tanpa batas"}
                  </p>
                  <p>
                    {paket.jumlahSesi} sesi · {paket.totalSoal} soal ·{" "}
                    {paket.totalDurasi} menit
                  </p>
                </div>

                <p className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted">
                    bank soal{" "}
                    <span
                      className={
                        paket.soalTersedia >= paket.totalSoal
                          ? "font-semibold text-emerald-600"
                          : "font-semibold text-navy-900"
                      }
                    >
                      {paket.soalTersedia}
                    </span>
                    /{paket.totalSoal}
                  </span>
                </p>

                <TombolPaket
                  paket={paket}
                  proses={proses}
                  onSunting={() => setFormTerbuka(paket)}
                  onUbahAktif={() => ubahAktif(paket)}
                  onHapus={() => setHapusTerbuka(paket)}
                />
              </li>
            ))}
          </ul>
          </>
          )}
        </CardBody>
      </Card>

      {formTerbuka ? (
        <FormPaket
          key={formTerbuka === "baru" ? "baru" : formTerbuka.id}
          paket={formTerbuka === "baru" ? null : formTerbuka}
          onSelesai={() => {
            setFormTerbuka(null);
            router.refresh();
          }}
          onTutup={() => setFormTerbuka(null)}
        />
      ) : null}

      <Modal
        terbuka={hapusTerbuka !== null}
        judul="Hapus paket try out?"
        deskripsi={
          hapusTerbuka
            ? `${hapusTerbuka.nama} beserta ${hapusTerbuka.jumlahSesi} sesinya akan dihapus.`
            : ""
        }
        onTutup={() => setHapusTerbuka(null)}
      >
        <p className="text-sm leading-relaxed text-muted">
          Konfigurasi paket, sesi, dan passwordnya hilang permanen, dan paket ini
          berhenti muncul di portal peserta.{" "}
          <b className="text-navy-800">
            Riwayat pengerjaan peserta tidak dihapus
          </b>{" "}
          — nilai yang sudah masuk tetap terbaca pada Hasil Try Out. Soal di bank
          soal juga tetap ada. Bila hanya ingin menutup paket sementara, gunakan{" "}
          <b className="text-navy-800">Nonaktifkan</b>.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            type="button"
            className="w-full bg-rose-600 hover:bg-rose-700 sm:w-auto"
            disabled={proses}
            onClick={() => hapusTerbuka && jalankanHapus(hapusTerbuka)}
          >
            {proses ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Ya, hapus paket
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setHapusTerbuka(null)}
            disabled={proses}
          >
            Batal
          </Button>
        </div>
      </Modal>
    </>
  );
}

function FormPaket({
  paket,
  onTutup,
  onSelesai,
}: {
  paket: BarisPaket | null;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const [state, formAction] = useActionState<KonfigState, FormData>(
    simpanPaketAksi,
    {},
  );

  useEffect(() => {
    if (state.sukses) onSelesai();
    // onSelesai berubah tiap render; cukup bereaksi pada hasil simpan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sukses]);

  return (
    <Modal
      terbuka
      lebar="lg"
      judul={paket ? `Sunting ${paket.nama}` : "Tambah Paket Try Out"}
      deskripsi="Perubahan langsung berlaku pada portal peserta."
      onTutup={onTutup}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="paketId" value={paket?.id ?? ""} />

        <Field label="Nama Paket" htmlFor="nama">
          <Input
            id="nama"
            name="nama"
            defaultValue={paket?.nama ?? ""}
            placeholder="Contoh: Try Out Paket 7"
            required
          />
        </Field>

        <div className="space-y-1.5">
          <Label htmlFor="deskripsi">Deskripsi</Label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={3}
            defaultValue={paket?.deskripsi ?? ""}
            className={kelasTextarea}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Dibuka Pada"
            htmlFor="jadwal"
            hint="Sebelum waktu ini peserta belum dapat memulai sesi."
          >
            <Input
              id="jadwal"
              name="jadwal"
              type="datetime-local"
              defaultValue={(paket?.jadwal ?? "").slice(0, 16)}
              required
            />
          </Field>

          <Field
            label="Ditutup Pada"
            htmlFor="ditutupPada"
            hint="Kosongkan bila paket tidak punya batas akhir. Dapat diubah kapan saja untuk memperpanjang atau membuka ulang."
          >
            <Input
              id="ditutupPada"
              name="ditutupPada"
              type="datetime-local"
              defaultValue={(paket?.ditutupPada ?? "").slice(0, 16)}
            />
          </Field>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm text-navy-800">
          <input
            type="checkbox"
            name="aktif"
            defaultChecked={paket ? paket.aktif : true}
            className="size-4.5 rounded border-navy-200 accent-navy-800"
          />
          Paket aktif dan tampil pada portal peserta
        </label>

        {state.masalah?.length ? (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            <p className="flex items-center gap-2 font-semibold">
              <AlertCircle className="size-4" />
              Paket belum dapat disimpan
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

        <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
          <TombolSimpan />
          <Button type="button" variant="outline" onClick={onTutup}>
            Batal
          </Button>
        </div>
      </form>
    </Modal>
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
      Simpan
    </Button>
  );
}
