"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { FormPendaftaran } from "@/components/pendaftaran/form-pendaftaran";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { KeadaanKosong } from "@/components/ui/state";
import { simpanPrestasiAksi } from "@/lib/actions-pendaftaran";
import {
  MAKS_PRESTASI,
  PERINGKAT_PRESTASI,
  prestasiKosong,
  SUMBER_PRESTASI,
  TINGKAT_PRESTASI,
  type Prestasi,
} from "@/lib/pendaftaran/tipe";

type Baris = { kunci: number; nilai: Prestasi };

/**
 * Data Prestasi — maksimal 3 pencapaian tertinggi.
 *
 * Baris dikelola di klien (tambah/hapus), lalu seluruhnya dikirim sekaligus
 * bersama jumlah barisnya sehingga server dapat membaca ulang isian per indeks.
 */
export function FormPrestasi({
  prestasi,
  tersimpan,
}: {
  prestasi: Prestasi[];
  tersimpan: boolean;
}) {
  // Kunci baris dibuat sendiri, bukan memakai indeks: isian pada baris lain
  // ditulis pada input tak terkendali, sehingga kunci yang bergeser saat sebuah
  // baris dihapus akan membuat nilainya ikut berpindah baris.
  const [daftar, setDaftar] = useState<Baris[]>(() =>
    prestasi.map((nilai, i) => ({ kunci: i, nilai })),
  );
  const [kunciBerikutnya, setKunciBerikutnya] = useState(prestasi.length);

  const tambah = () => {
    if (daftar.length >= MAKS_PRESTASI) return;
    setDaftar((sebelumnya) => [
      ...sebelumnya,
      { kunci: kunciBerikutnya, nilai: prestasiKosong() },
    ]);
    setKunciBerikutnya((nomor) => nomor + 1);
  };

  const hapus = (kunci: number) => {
    setDaftar((sebelumnya) => sebelumnya.filter((baris) => baris.kunci !== kunci));
  };

  const tahunIni = new Date().getFullYear();

  return (
    <FormPendaftaran
      aksi={simpanPrestasiAksi}
      tersimpan={tersimpan}
      pesanSukses="Data prestasi tersimpan."
      labelSimpan="Simpan Data Prestasi"
      catatanBawah="Sertifikat pendukung diunggah pada menu Kelengkapan Dokumen nomor 12."
    >
      {/* Jumlah baris ikut terkirim agar server membaca indeks yang sama. */}
      <input type="hidden" name="jumlah" value={daftar.length} />

      <Card>
        <CardHeader
          judul="Data Prestasi"
          deskripsi={`Tambahkan maksimal ${MAKS_PRESTASI} data prestasi tertinggi. Bagian ini tidak wajib diisi.`}
          aksi={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={tambah}
              disabled={daftar.length >= MAKS_PRESTASI}
            >
              <Plus className="size-4" />
              Tambah Prestasi
            </Button>
          }
        />
        <CardBody className={daftar.length === 0 ? "p-0 sm:p-0" : "space-y-5"}>
          {daftar.length === 0 ? (
            <KeadaanKosong
              judul="Belum ada data prestasi"
              deskripsi={`Bila memiliki prestasi yang diakui panitia, tambahkan maksimal ${MAKS_PRESTASI} pencapaian tertinggi. Bila memang tidak ada, tekan Simpan tanpa mengisi apa pun — bagian ini baru tercatat selesai setelah disimpan.`}
            />
          ) : (
            daftar.map((baris, i) => (
              <fieldset
                key={baris.kunci}
                className="rounded-xl border border-line p-4 sm:p-5"
              >
                <legend className="px-1.5 text-sm font-semibold text-navy-900">
                  Prestasi {i + 1}
                </legend>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      label="Nama Kegiatan / Lomba"
                      htmlFor={`prestasi-${i}-nama`}
                    >
                      <Input
                        id={`prestasi-${i}-nama`}
                        name={`prestasi::${i}::namaKegiatan`}
                        maxLength={120}
                        defaultValue={baris.nilai.namaKegiatan}
                        placeholder="Contoh: OSN Matematika Tingkat Provinsi"
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Sumber Prestasi"
                      htmlFor={`prestasi-${i}-sumber`}
                      hint="Hanya prestasi dari daftar ini yang diakui panitia."
                    >
                      <Select
                        id={`prestasi-${i}-sumber`}
                        name={`prestasi::${i}::sumber`}
                        defaultValue={baris.nilai.sumber}
                      >
                        <option value="">— Pilih sumber prestasi —</option>
                        {SUMBER_PRESTASI.map((sumber) => (
                          <option key={sumber} value={sumber}>
                            {sumber}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>

                  <Field label="Tingkat" htmlFor={`prestasi-${i}-tingkat`}>
                    <Select
                      id={`prestasi-${i}-tingkat`}
                      name={`prestasi::${i}::tingkat`}
                      defaultValue={baris.nilai.tingkat}
                    >
                      <option value="">— Pilih tingkat —</option>
                      {TINGKAT_PRESTASI.map((tingkat) => (
                        <option key={tingkat} value={tingkat}>
                          {tingkat}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Peringkat" htmlFor={`prestasi-${i}-peringkat`}>
                    <Select
                      id={`prestasi-${i}-peringkat`}
                      name={`prestasi::${i}::peringkat`}
                      defaultValue={baris.nilai.peringkat}
                    >
                      <option value="">— Pilih peringkat —</option>
                      {PERINGKAT_PRESTASI.map((peringkat) => (
                        <option key={peringkat} value={peringkat}>
                          {peringkat}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Tahun" htmlFor={`prestasi-${i}-tahun`}>
                    <Input
                      id={`prestasi-${i}-tahun`}
                      name={`prestasi::${i}::tahun`}
                      inputMode="numeric"
                      maxLength={4}
                      defaultValue={baris.nilai.tahun}
                      placeholder={String(tahunIni)}
                    />
                  </Field>

                  <Field
                    label="Penyelenggara"
                    htmlFor={`prestasi-${i}-penyelenggara`}
                  >
                    <Input
                      id={`prestasi-${i}-penyelenggara`}
                      name={`prestasi::${i}::penyelenggara`}
                      maxLength={120}
                      defaultValue={baris.nilai.penyelenggara}
                      placeholder="Contoh: Dinas Pendidikan Provinsi Jawa Tengah"
                    />
                  </Field>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => hapus(baris.kunci)}
                  >
                    <Trash2 className="size-4" />
                    Hapus prestasi ini
                  </Button>
                </div>
              </fieldset>
            ))
          )}
        </CardBody>
      </Card>
    </FormPendaftaran>
  );
}
