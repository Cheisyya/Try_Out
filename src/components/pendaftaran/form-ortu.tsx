"use client";

import { FormPendaftaran } from "@/components/pendaftaran/form-pendaftaran";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { simpanOrtuAksi } from "@/lib/actions-pendaftaran";
import type { DataOrtu } from "@/lib/pendaftaran/tipe";

/** Formulir Data Orang Tua/Wali sesuai formulir resmi panitia. */
export function FormOrtu({
  ortu,
  tersimpan,
}: {
  ortu: DataOrtu;
  tersimpan: boolean;
}) {
  return (
    <FormPendaftaran
      aksi={simpanOrtuAksi}
      tersimpan={tersimpan}
      pesanSukses="Data orang tua/wali tersimpan."
      labelSimpan="Simpan Data Orang Tua"
      catatanBawah="Alamat yang diisi dipakai panitia untuk korespondensi seleksi."
    >
      <Card>
        <CardHeader
          judul="Identitas Orang Tua / Wali"
          deskripsi="Isi data wali apabila siswa tidak tinggal bersama orang tua kandung."
        />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Ayah / Wali" htmlFor="namaAyah">
            <Input id="namaAyah" name="namaAyah" defaultValue={ortu.namaAyah} required />
          </Field>

          <Field label="Nama Ibu / Wali" htmlFor="namaIbu">
            <Input id="namaIbu" name="namaIbu" defaultValue={ortu.namaIbu} required />
          </Field>

          <Field label="Suku Ayah" htmlFor="sukuAyah">
            <Input
              id="sukuAyah"
              name="sukuAyah"
              defaultValue={ortu.sukuAyah}
              placeholder="Contoh: Jawa"
              required
            />
          </Field>

          <Field label="Suku Ibu" htmlFor="sukuIbu">
            <Input
              id="sukuIbu"
              name="sukuIbu"
              defaultValue={ortu.sukuIbu}
              placeholder="Contoh: Sunda"
              required
            />
          </Field>

          <Field label="Pekerjaan Ayah" htmlFor="pekerjaanAyah">
            <Input
              id="pekerjaanAyah"
              name="pekerjaanAyah"
              defaultValue={ortu.pekerjaanAyah}
              placeholder="Contoh: Karyawan Swasta"
              required
            />
          </Field>

          <Field label="Pekerjaan Ibu" htmlFor="pekerjaanIbu">
            <Input
              id="pekerjaanIbu"
              name="pekerjaanIbu"
              defaultValue={ortu.pekerjaanIbu}
              placeholder="Contoh: Wiraswasta"
              required
            />
          </Field>

          <Field
            label="Penghasilan Ayah"
            htmlFor="penghasilanAyah"
            hint="Perkiraan penghasilan per bulan."
          >
            <Input
              id="penghasilanAyah"
              name="penghasilanAyah"
              defaultValue={ortu.penghasilanAyah}
              placeholder="Contoh: Rp5.000.000"
              required
            />
          </Field>

          <Field
            label="Penghasilan Ibu"
            htmlFor="penghasilanIbu"
            hint='Tulis "Tidak ada" bila tidak berpenghasilan.'
          >
            <Input
              id="penghasilanIbu"
              name="penghasilanIbu"
              defaultValue={ortu.penghasilanIbu}
              placeholder="Contoh: Rp2.000.000"
              required
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="Kontak dan Alamat"
          deskripsi="Pastikan nomor seluler aktif — pengumuman seleksi dikirim ke nomor ini."
        />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Telepon Rumah" htmlFor="teleponRumah" hint="Opsional.">
            <Input
              id="teleponRumah"
              name="teleponRumah"
              inputMode="tel"
              defaultValue={ortu.teleponRumah}
              placeholder="(0293) 123456"
            />
          </Field>

          <Field label="Telepon Seluler" htmlFor="teleponSeluler">
            <Input
              id="teleponSeluler"
              name="teleponSeluler"
              inputMode="tel"
              defaultValue={ortu.teleponSeluler}
              placeholder="0812xxxxxxx"
              required
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Alamat Rumah" htmlFor="alamatRumah">
              <Textarea
                id="alamatRumah"
                name="alamatRumah"
                rows={3}
                maxLength={300}
                defaultValue={ortu.alamatRumah}
                placeholder="Nama jalan, nomor rumah, RT/RW, dusun"
                required
              />
            </Field>
          </div>

          <Field label="Provinsi" htmlFor="provinsi">
            <Input id="provinsi" name="provinsi" defaultValue={ortu.provinsi} required />
          </Field>

          <Field label="Kabupaten / Kota" htmlFor="kabupaten">
            <Input
              id="kabupaten"
              name="kabupaten"
              defaultValue={ortu.kabupaten}
              required
            />
          </Field>

          <Field label="Kecamatan" htmlFor="kecamatan">
            <Input
              id="kecamatan"
              name="kecamatan"
              defaultValue={ortu.kecamatan}
              required
            />
          </Field>

          <Field label="Kelurahan" htmlFor="kelurahan">
            <Input
              id="kelurahan"
              name="kelurahan"
              defaultValue={ortu.kelurahan}
              required
            />
          </Field>

          <Field label="Kode Pos" htmlFor="kodePos" hint="5 digit.">
            <Input
              id="kodePos"
              name="kodePos"
              inputMode="numeric"
              maxLength={5}
              defaultValue={ortu.kodePos}
              placeholder="56115"
              required
            />
          </Field>
        </CardBody>
      </Card>
    </FormPendaftaran>
  );
}
