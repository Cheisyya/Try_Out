import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  FileText,
  XCircle,
} from "lucide-react";

import { AksiKelolaSiswa } from "@/components/admin/kelola-siswa";
import { ResetPengerjaan } from "@/components/admin/reset-pengerjaan";
import {
  LencanaKelulusan,
  PilihStatusKelulusan,
} from "@/components/admin/status-kelulusan";
import { TautanDriveSiswa } from "@/components/admin/tautan-drive-siswa";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { Table, TableWrapper, Td, Th } from "@/components/ui/table";
import { wajibSesi } from "@/lib/get-session";
import {
  DOKUMEN,
  DOKUMEN_WAJIB,
  formatUkuran,
  namaBerkasOtomatis,
} from "@/lib/pendaftaran/dokumen";
import {
  persenKelengkapan,
  statusPendaftaran,
} from "@/lib/pendaftaran/kelengkapan";
import { bacaPendaftaran } from "@/lib/pendaftaran/repositori";
import { JUMLAH_SEMESTER, MAPEL_AKADEMIK } from "@/lib/pendaftaran/tipe";
import { semuaPercobaan } from "@/lib/pengerjaan/admin";
import { bacaBerkasPsikotes } from "@/lib/psikotes/catatan";
import { bacaBerkasIq } from "@/lib/tes-iq/catatan";
import { cariSiswa } from "@/lib/siswa/repositori";
import { formatTanggal, formatTanggalWaktu } from "@/lib/utils";

export const metadata: Metadata = { title: "Detail Siswa" };

const KOSONG = "—";

function nilaiTampil(nilai: string | undefined) {
  return nilai?.trim() ? nilai : KOSONG;
}

/** Daftar definisi dua kolom yang dipakai ulang pada setiap kartu data. */
function DaftarData({ data }: { data: { label: string; nilai: string }[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {data.map((item) => (
        <div key={item.label}>
          <dt className="text-xs uppercase tracking-wide text-muted">
            {item.label}
          </dt>
          <dd className="mt-1 break-words text-sm font-medium text-navy-900">
            {item.nilai}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Halaman detail satu siswa: data akun, data diri, berkas persyaratan, link
 * drive, dan status kelulusan — seluruhnya pada satu tempat.
 */
export default async function DetailSiswaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await wajibSesi("admin");

  const { id } = await params;
  const siswa = await cariSiswa(id);
  if (!siswa) notFound();

  const [data, percobaan, berkasPsikotes, berkasIq] = await Promise.all([
    bacaPendaftaran(siswa.id),
    semuaPercobaan(),
    bacaBerkasPsikotes(siswa.id),
    bacaBerkasIq(siswa.id),
  ]);

  const { biodata, ortu, akademik, prestasi, dokumen } = data;
  const namaSiswa = biodata.namaLengkap || siswa.nama;
  const persen = persenKelengkapan(data);
  const status = statusPendaftaran(data);
  const dokumenWajibMasuk = DOKUMEN_WAJIB.filter(
    (spek) => dokumen[spek.kunci],
  ).length;
  const jumlahPercobaan = percobaan.filter(
    (item) => item.student_id === siswa.id,
  ).length;
  const jumlahSesiPsikotes = berkasPsikotes.sesi.length;
  const jumlahPaketIq = berkasIq.paket.length;

  return (
    <>
      <PageHeader
        judul={namaSiswa}
        deskripsi={
          siswa.noCasis
            ? `Nomor casis ${siswa.noCasis} · ${siswa.username}`
            : siswa.username
        }
        aksi={
          <>
            <Link
              href="/admin/siswa"
              className={buttonStyles({ variant: "ghost", size: "sm" })}
            >
              <ArrowLeft className="size-4" />
              Kembali
            </Link>
            <Link
              href={`/admin/evaluasi/${siswa.id}`}
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              <ClipboardList className="size-4" />
              Evaluasi Pengerjaan
            </Link>
            {/* Anchor biasa: unduhan berkas ditangani peramban, bukan router. */}
            <a
              href={`/admin/siswa/${siswa.id}/teks`}
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              <FileText className="size-4" />
              Unduh TXT
            </a>
            <a
              href={`/admin/siswa/${siswa.id}/unduh`}
              className={buttonStyles({ size: "sm" })}
            >
              <Download className="size-4" />
              Unduh ZIP
            </a>
          </>
        }
      />

      <Card>
        <CardHeader
          judul="Data Akun & Kelulusan"
          deskripsi={
            data.diperbaruiPada
              ? `Data diri terakhir diperbarui siswa ${formatTanggalWaktu(new Date(data.diperbaruiPada).toISOString())}.`
              : "Siswa belum menyimpan data diri apa pun."
          }
          aksi={
            <AksiKelolaSiswa
              siswa={{
                id: siswa.id,
                noCasis: siswa.noCasis,
                username: siswa.username,
                nama: siswa.nama,
                email: siswa.email,
                asalSekolah: siswa.asalSekolah,
                kelas: siswa.kelas,
                status: siswa.status,
                statusKelulusan: siswa.statusKelulusan,
                tautanDrive: siswa.tautanDrive,
                catatanDrive: siswa.catatanDrive,
                jumlahPercobaan,
              }}
            />
          }
        />
        <CardBody className="space-y-5">
          <DaftarData
            data={[
              { label: "Nama Akun", nilai: siswa.nama },
              { label: "Nomor Casis", nilai: nilaiTampil(siswa.noCasis) },
              { label: "Username", nilai: siswa.username },
              { label: "Email", nilai: nilaiTampil(siswa.email) },
              { label: "Kelas", nilai: nilaiTampil(siswa.kelas) },
              { label: "Asal Sekolah (Akun)", nilai: nilaiTampil(siswa.asalSekolah) },
              {
                label: "Terdaftar Sejak",
                nilai: formatTanggal(new Date(siswa.dibuatPada).toISOString()),
              },
            ]}
          />

          <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wide text-muted">
                Status Akun
              </p>
              <Badge tone={siswa.status === "Aktif" ? "hijau" : "netral"}>
                {siswa.status}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wide text-muted">
                Status Kelulusan Seleksi
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <PilihStatusKelulusan
                  id={siswa.id}
                  nama={namaSiswa}
                  status={siswa.statusKelulusan}
                />
                <LencanaKelulusan status={siswa.statusKelulusan} />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <TautanDriveSiswa
        id={siswa.id}
        nama={namaSiswa}
        tautanDrive={siswa.tautanDrive}
        catatanDrive={siswa.catatanDrive}
      />

      <Card>
        <CardHeader
          judul="Kelengkapan Data Diri"
          aksi={
            <Badge tone={persen === 100 ? "hijau" : "gold"}>{persen}% lengkap</Badge>
          }
        />
        <CardBody className="space-y-4">
          <Progress nilai={persen} />
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {status.map((bagian) => (
              <li
                key={bagian.kunci}
                className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm"
              >
                {bagian.lengkap ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 shrink-0 text-slate-300" />
                )}
                <span className="min-w-0 flex-1 truncate text-navy-800">
                  {bagian.label}
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="Reset Pengerjaan"
          deskripsi="Beri peserta kesempatan mengulang bila sesinya telanjur terpakai karena gangguan teknis. Tindakan ini tidak dapat dibatalkan."
        />
        <CardBody>
          <ResetPengerjaan
            siswaId={siswa.id}
            siswaNama={namaSiswa}
            jumlahPercobaan={jumlahPercobaan}
            jumlahSesiPsikotes={jumlahSesiPsikotes}
            jumlahPaketIq={jumlahPaketIq}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader judul="1. Biodata Siswa — Data Utama" />
        <CardBody>
          <DaftarData
            data={[
              { label: "Jalur Pendaftaran", nilai: nilaiTampil(biodata.jalurPendaftaran) },
              { label: "Sumbangan Sukarela", nilai: nilaiTampil(biodata.sumbanganSukarela) },
              { label: "NISN", nilai: nilaiTampil(biodata.nisn) },
              { label: "Peminatan", nilai: nilaiTampil(biodata.peminatan) },
              { label: "Nama Lengkap", nilai: nilaiTampil(biodata.namaLengkap) },
              { label: "Jenis Kelamin", nilai: nilaiTampil(biodata.jenisKelamin) },
              { label: "Agama", nilai: nilaiTampil(biodata.agama) },
              { label: "Tempat Lahir", nilai: nilaiTampil(biodata.tempatLahir) },
              { label: "Tanggal Lahir", nilai: nilaiTampil(biodata.tanggalLahir) },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader judul="1. Biodata Siswa — Data Pendukung" />
        <CardBody>
          <DaftarData
            data={[
              { label: "Nama SMP / Setingkat", nilai: nilaiTampil(biodata.namaSmp) },
              { label: "Provinsi Sekolah", nilai: nilaiTampil(biodata.provinsiSekolah) },
              { label: "Kabupaten/Kota Sekolah", nilai: nilaiTampil(biodata.kabupatenSekolah) },
              { label: "Kecamatan Sekolah", nilai: nilaiTampil(biodata.kecamatanSekolah) },
              { label: "Kelurahan Sekolah", nilai: nilaiTampil(biodata.kelurahanSekolah) },
              { label: "Kode Pos Sekolah", nilai: nilaiTampil(biodata.kodePosSekolah) },
              { label: "Hobi", nilai: nilaiTampil(biodata.hobi) },
              { label: "Cita Cita", nilai: nilaiTampil(biodata.citaCita) },
              { label: "Imunisasi", nilai: nilaiTampil(biodata.imunisasi) },
              { label: "Tinggi Badan (cm)", nilai: nilaiTampil(biodata.tinggiBadan) },
              { label: "Berat Badan (kg)", nilai: nilaiTampil(biodata.beratBadan) },
              { label: "Ukuran Sepatu", nilai: nilaiTampil(biodata.ukuranSepatu) },
              { label: "Ukuran Baju", nilai: nilaiTampil(biodata.ukuranBaju) },
              { label: "Ukuran Celana / Rok", nilai: nilaiTampil(biodata.ukuranCelana) },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader judul="2. Data Orang Tua/Wali" />
        <CardBody>
          <DaftarData
            data={[
              { label: "Nama Ayah / Wali", nilai: nilaiTampil(ortu.namaAyah) },
              { label: "Nama Ibu / Wali", nilai: nilaiTampil(ortu.namaIbu) },
              { label: "Suku Ayah", nilai: nilaiTampil(ortu.sukuAyah) },
              { label: "Suku Ibu", nilai: nilaiTampil(ortu.sukuIbu) },
              { label: "Pekerjaan Ayah", nilai: nilaiTampil(ortu.pekerjaanAyah) },
              { label: "Pekerjaan Ibu", nilai: nilaiTampil(ortu.pekerjaanIbu) },
              { label: "Penghasilan Ayah", nilai: nilaiTampil(ortu.penghasilanAyah) },
              { label: "Penghasilan Ibu", nilai: nilaiTampil(ortu.penghasilanIbu) },
              { label: "Telepon Rumah", nilai: nilaiTampil(ortu.teleponRumah) },
              { label: "Telepon Seluler", nilai: nilaiTampil(ortu.teleponSeluler) },
              { label: "Alamat Rumah", nilai: nilaiTampil(ortu.alamatRumah) },
              { label: "Provinsi", nilai: nilaiTampil(ortu.provinsi) },
              { label: "Kabupaten / Kota", nilai: nilaiTampil(ortu.kabupaten) },
              { label: "Kecamatan", nilai: nilaiTampil(ortu.kecamatan) },
              { label: "Kelurahan", nilai: nilaiTampil(ortu.kelurahan) },
              { label: "Kode Pos", nilai: nilaiTampil(ortu.kodePos) },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="3. Data Akademik"
          deskripsi="Nilai pengetahuan rapor semester 1 sampai 4."
        />
        <CardBody className="p-0 sm:p-0">
          <TableWrapper>
            <Table className="min-w-[620px]">
              <thead>
                <tr>
                  <Th>Mata Pelajaran</Th>
                  {Array.from({ length: JUMLAH_SEMESTER }, (_, i) => (
                    <Th key={i}>Sem {i + 1}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MAPEL_AKADEMIK.map((mapel) => (
                  <tr key={mapel}>
                    <Td className="font-medium">{mapel}</Td>
                    {Array.from({ length: JUMLAH_SEMESTER }, (_, i) => (
                      <Td key={i}>{nilaiTampil(akademik[mapel]?.[i])}</Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="4. Kelengkapan Dokumen"
          deskripsi={`${dokumenWajibMasuk} dari ${DOKUMEN_WAJIB.length} dokumen wajib terunggah.`}
        />
        <CardBody className="p-0 sm:p-0">
          <TableWrapper>
            <Table className="min-w-[840px]">
              <thead>
                <tr>
                  <Th className="w-12">No</Th>
                  <Th>Dokumen</Th>
                  <Th>Nama Berkas</Th>
                  <Th>Ukuran</Th>
                  <Th>Status</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {DOKUMEN.map((spek) => {
                  const berkas = dokumen[spek.kunci];
                  return (
                    <tr key={spek.kunci} className="transition hover:bg-navy-50/40">
                      <Td className="text-muted">{spek.nomor}</Td>
                      <Td className="font-medium">{spek.namaBerkas}</Td>
                      <Td className="text-muted">
                        {berkas
                          ? namaBerkasOtomatis(spek, namaSiswa, berkas.ekstensi)
                          : KOSONG}
                        {berkas?.keterangan ? (
                          <span className="mt-0.5 block text-xs font-semibold text-gold-700">
                            {berkas.keterangan}
                          </span>
                        ) : null}
                      </Td>
                      <Td className="whitespace-nowrap text-muted">
                        {berkas ? formatUkuran(berkas.ukuran) : KOSONG}
                      </Td>
                      <Td>
                        {berkas ? (
                          <Badge tone="hijau">Terunggah</Badge>
                        ) : (
                          <Badge tone={spek.wajib ? "merah" : "netral"}>
                            {spek.wajib ? "Belum" : "Tidak wajib"}
                          </Badge>
                        )}
                      </Td>
                      <Td>
                        {berkas ? (
                          <a
                            href={`/admin/siswa/${siswa.id}/berkas/${spek.kunci}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonStyles({
                              variant: "ghost",
                              size: "sm",
                            })}
                          >
                            <Eye className="size-4" />
                            Lihat
                          </a>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          judul="5. Data Prestasi"
          deskripsi={
            prestasi.length === 0
              ? "Siswa tidak mengisi data prestasi."
              : `${prestasi.length} prestasi tercatat.`
          }
        />
        <CardBody className={prestasi.length === 0 ? undefined : "space-y-5"}>
          {prestasi.length === 0 ? (
            <p className="text-sm text-muted">Tidak ada data prestasi.</p>
          ) : (
            prestasi.map((item, i) => (
              <div key={i} className="rounded-xl border border-line p-4">
                <p className="mb-3 text-sm font-semibold text-navy-900">
                  Prestasi {i + 1}
                </p>
                <DaftarData
                  data={[
                    { label: "Nama Kegiatan", nilai: nilaiTampil(item.namaKegiatan) },
                    { label: "Sumber Prestasi", nilai: nilaiTampil(item.sumber) },
                    { label: "Tingkat", nilai: nilaiTampil(item.tingkat) },
                    { label: "Peringkat", nilai: nilaiTampil(item.peringkat) },
                    { label: "Tahun", nilai: nilaiTampil(item.tahun) },
                    { label: "Penyelenggara", nilai: nilaiTampil(item.penyelenggara) },
                  ]}
                />
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </>
  );
}
