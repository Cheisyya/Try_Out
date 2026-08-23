"use client";

import { useState } from "react";

import { FormPendaftaran } from "@/components/pendaftaran/form-pendaftaran";
import { Card, CardBody } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { simpanBiodataAksi } from "@/lib/actions-pendaftaran";
import {
  AGAMA,
  JALUR_PENDAFTARAN,
  JENIS_KELAMIN,
  PEMINATAN,
  UKURAN_BAJU,
  type Biodata,
} from "@/lib/pendaftaran/tipe";
import { cn } from "@/lib/utils";

/**
 * Formulir Biodata Siswa.
 *
 * Dibagi menjadi dua tab sesuai formulir resmi panitia: Data Utama dan Data
 * Pendukung. Kedua tab berada dalam satu `form` yang sama — tab yang tidak
 * tampil hanya disembunyikan lewat CSS, bukan dilepas dari DOM, sehingga
 * isiannya tetap ikut terkirim dan pesan validasi peramban tetap dapat
 * memindahkan fokus ke kolom yang bermasalah.
 */

type Tab = "utama" | "pendukung";

export function FormBiodata({
  biodata,
  tersimpan,
}: {
  biodata: Biodata;
  tersimpan: boolean;
}) {
  const [tab, setTab] = useState<Tab>("utama");

  return (
    <FormPendaftaran
      aksi={simpanBiodataAksi}
      tersimpan={tersimpan}
      pesanSukses="Biodata siswa tersimpan."
      labelSimpan="Simpan Biodata"
      catatanBawah="Kedua tab tersimpan sekaligus saat tombol simpan ditekan."
    >
      <Card>
        <div className="flex gap-1 border-b border-line px-3 pt-3 sm:px-4">
          <TombolTab aktif={tab === "utama"} onClick={() => setTab("utama")}>
            Data Utama
          </TombolTab>
          <TombolTab
            aktif={tab === "pendukung"}
            onClick={() => setTab("pendukung")}
          >
            Data Pendukung
          </TombolTab>
        </div>

        <CardBody>
          <div
            className={cn("grid gap-4 sm:grid-cols-2", tab !== "utama" && "hidden")}
          >
            <Field label="Jalur Pendaftaran" htmlFor="jalurPendaftaran">
              <Select
                id="jalurPendaftaran"
                name="jalurPendaftaran"
                defaultValue={biodata.jalurPendaftaran}
                required
              >
                <option value="">— Pilih jalur —</option>
                {JALUR_PENDAFTARAN.map((jalur) => (
                  <option key={jalur} value={jalur}>
                    {jalur}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Sumbangan Sukarela"
              htmlFor="sumbanganSukarela"
              hint="Nominal dalam rupiah, isi angka saja. Contoh: 5000000"
            >
              <Input
                id="sumbanganSukarela"
                name="sumbanganSukarela"
                inputMode="numeric"
                defaultValue={biodata.sumbanganSukarela}
                placeholder="5000000"
                required
              />
            </Field>

            <Field label="NISN" htmlFor="nisn" hint="10 digit angka.">
              <Input
                id="nisn"
                name="nisn"
                inputMode="numeric"
                maxLength={10}
                defaultValue={biodata.nisn}
                placeholder="0071234567"
                required
              />
            </Field>

            <Field label="Peminatan" htmlFor="peminatan">
              <Select
                id="peminatan"
                name="peminatan"
                defaultValue={biodata.peminatan}
                required
              >
                <option value="">— Pilih peminatan —</option>
                {PEMINATAN.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Nama Lengkap"
              htmlFor="namaLengkap"
              hint="Sesuai akta kelahiran. Dipakai pada penamaan berkas unggahan."
            >
              <Input
                id="namaLengkap"
                name="namaLengkap"
                maxLength={80}
                defaultValue={biodata.namaLengkap}
                placeholder="Nama sesuai dokumen resmi"
                required
              />
            </Field>

            <Field label="Jenis Kelamin" htmlFor="jenisKelamin">
              <Select
                id="jenisKelamin"
                name="jenisKelamin"
                defaultValue={biodata.jenisKelamin}
                required
              >
                <option value="">— Pilih —</option>
                {JENIS_KELAMIN.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Agama" htmlFor="agama">
              <Select id="agama" name="agama" defaultValue={biodata.agama} required>
                <option value="">— Pilih agama —</option>
                {AGAMA.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Tempat Lahir" htmlFor="tempatLahir">
              <Input
                id="tempatLahir"
                name="tempatLahir"
                defaultValue={biodata.tempatLahir}
                placeholder="Kabupaten/Kota kelahiran"
                required
              />
            </Field>

            <Field label="Tanggal Lahir" htmlFor="tanggalLahir">
              <Input
                id="tanggalLahir"
                name="tanggalLahir"
                type="date"
                defaultValue={biodata.tanggalLahir}
                required
              />
            </Field>
          </div>

          <div
            className={cn(
              "grid gap-4 sm:grid-cols-2",
              tab !== "pendukung" && "hidden",
            )}
          >
            <Field
              label="Nama SMP / Setingkat"
              htmlFor="namaSmp"
              hint="Tulis lengkap, contoh: SMP Negeri 1 Magelang."
            >
              <Input
                id="namaSmp"
                name="namaSmp"
                defaultValue={biodata.namaSmp}
                required
              />
            </Field>

            <Field label="Provinsi Sekolah" htmlFor="provinsiSekolah">
              <Input
                id="provinsiSekolah"
                name="provinsiSekolah"
                defaultValue={biodata.provinsiSekolah}
                required
              />
            </Field>

            <Field label="Kabupaten/Kota Sekolah" htmlFor="kabupatenSekolah">
              <Input
                id="kabupatenSekolah"
                name="kabupatenSekolah"
                defaultValue={biodata.kabupatenSekolah}
                required
              />
            </Field>

            <Field label="Kecamatan Sekolah" htmlFor="kecamatanSekolah">
              <Input
                id="kecamatanSekolah"
                name="kecamatanSekolah"
                defaultValue={biodata.kecamatanSekolah}
                required
              />
            </Field>

            <Field label="Kelurahan Sekolah" htmlFor="kelurahanSekolah">
              <Input
                id="kelurahanSekolah"
                name="kelurahanSekolah"
                defaultValue={biodata.kelurahanSekolah}
                required
              />
            </Field>

            <Field label="Kode Pos Sekolah" htmlFor="kodePosSekolah" hint="5 digit.">
              <Input
                id="kodePosSekolah"
                name="kodePosSekolah"
                inputMode="numeric"
                maxLength={5}
                defaultValue={biodata.kodePosSekolah}
                placeholder="56115"
                required
              />
            </Field>

            <Field label="Hobi" htmlFor="hobi">
              <Input
                id="hobi"
                name="hobi"
                defaultValue={biodata.hobi}
                placeholder="Contoh: Membaca, Sepak Bola"
                required
              />
            </Field>

            <Field label="Cita Cita" htmlFor="citaCita">
              <Input
                id="citaCita"
                name="citaCita"
                defaultValue={biodata.citaCita}
                placeholder="Contoh: Perwira TNI"
                required
              />
            </Field>

            <Field
              label="Imunisasi"
              htmlFor="imunisasi"
              hint="Sebutkan imunisasi yang pernah diterima."
            >
              <Input
                id="imunisasi"
                name="imunisasi"
                defaultValue={biodata.imunisasi}
                placeholder="Contoh: HB, BCG, Polio, DPT, Campak"
                required
              />
            </Field>

            <Field label="Tinggi Badan (cm)" htmlFor="tinggiBadan">
              <Input
                id="tinggiBadan"
                name="tinggiBadan"
                inputMode="numeric"
                defaultValue={biodata.tinggiBadan}
                placeholder="165"
                required
              />
            </Field>

            <Field label="Berat Badan (kg)" htmlFor="beratBadan">
              <Input
                id="beratBadan"
                name="beratBadan"
                inputMode="numeric"
                defaultValue={biodata.beratBadan}
                placeholder="52"
                required
              />
            </Field>

            <Field label="Ukuran Sepatu" htmlFor="ukuranSepatu">
              <Input
                id="ukuranSepatu"
                name="ukuranSepatu"
                inputMode="numeric"
                defaultValue={biodata.ukuranSepatu}
                placeholder="38"
                required
              />
            </Field>

            <Field label="Ukuran Baju" htmlFor="ukuranBaju">
              <Select
                id="ukuranBaju"
                name="ukuranBaju"
                defaultValue={biodata.ukuranBaju}
                required
              >
                <option value="">— Pilih ukuran —</option>
                {UKURAN_BAJU.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Ukuran Celana / Rok" htmlFor="ukuranCelana">
              <Input
                id="ukuranCelana"
                name="ukuranCelana"
                inputMode="numeric"
                defaultValue={biodata.ukuranCelana}
                placeholder="27"
                required
              />
            </Field>
          </div>
        </CardBody>
      </Card>
    </FormPendaftaran>
  );
}

function TombolTab({
  aktif,
  onClick,
  children,
}: {
  aktif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={cn(
        "-mb-px rounded-t-lg border border-b-0 px-4 py-2.5 text-sm transition",
        aktif
          ? "border-line bg-white font-semibold text-navy-900"
          : "border-transparent font-medium text-langit-600 hover:text-navy-900",
      )}
    >
      {children}
    </button>
  );
}
