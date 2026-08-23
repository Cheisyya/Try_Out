import {
  bersihkanPotonganNama,
  DOKUMEN,
  formatUkuran,
  namaBerkasOtomatis,
} from "@/lib/pendaftaran/dokumen";
import {
  bacaBerkasDokumen,
  bacaPendaftaran,
} from "@/lib/pendaftaran/repositori";
import {
  JUMLAH_SEMESTER,
  MAPEL_AKADEMIK,
  type Pendaftaran,
} from "@/lib/pendaftaran/tipe";
import type { Siswa } from "@/lib/siswa/repositori";
import { buatZip, type EntriZip } from "@/lib/pendaftaran/zip";

/**
 * Ekspor data pendaftaran siswa untuk panitia.
 *
 * Data isian diringkas menjadi berkas teks yang mudah dibaca dan dicetak, lalu
 * digabung bersama seluruh berkas unggahan peserta ke dalam satu arsip ZIP.
 */

const KOSONG = "-";

/** Baris ditulis dengan CRLF agar rapi ketika dibuka Notepad di Windows. */
const AKHIR_BARIS = "\r\n";

function isi(nilai: string | undefined) {
  const teks = (nilai ?? "").trim();
  return teks || KOSONG;
}

function rupiah(nilai: string) {
  const angka = Number((nilai ?? "").replace(/[^\d]/g, ""));
  if (!nilai?.trim() || !Number.isFinite(angka) || angka === 0) return isi(nilai);
  return `Rp${angka.toLocaleString("id-ID")}`;
}

function garis(judul: string) {
  return [
    "",
    "=".repeat(72),
    judul.toUpperCase(),
    "=".repeat(72),
  ];
}

/** "Nama Lengkap        : Aditya Pratama" */
function baris(label: string, nilai: string) {
  return `${label.padEnd(28, " ")}: ${nilai}`;
}

function waktuCetak(epoch: number) {
  if (!epoch) return "belum pernah disimpan";
  return new Date(epoch).toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

/* ---------------------------------- Teks ---------------------------------- */

export function susunTeksPendaftaran(
  siswa: Pick<Siswa, "id" | "nama" | "username" | "email" | "asalSekolah" | "kelas">,
  data: Pendaftaran,
): string {
  const { biodata, ortu, akademik, prestasi, dokumen } = data;
  const b: string[] = [];

  b.push("DATA PENDAFTARAN SISWA");
  b.push("SMA TARUNA NUSANTARA");
  b.push("");
  b.push(baris("Nomor Peserta", siswa.id));
  b.push(baris("Username Portal", isi(siswa.username)));
  b.push(baris("Email Portal", isi(siswa.email)));
  b.push(baris("Diperbarui Pada", waktuCetak(data.diperbaruiPada)));
  b.push(baris("Berkas Dicetak", waktuCetak(Date.now())));

  b.push(...garis("1. Biodata Siswa — Data Utama"));
  b.push(baris("Jalur Pendaftaran", isi(biodata.jalurPendaftaran)));
  b.push(baris("Sumbangan Sukarela", rupiah(biodata.sumbanganSukarela)));
  b.push(baris("NISN", isi(biodata.nisn)));
  b.push(baris("Peminatan", isi(biodata.peminatan)));
  b.push(baris("Nama Lengkap", isi(biodata.namaLengkap)));
  b.push(baris("Jenis Kelamin", isi(biodata.jenisKelamin)));
  b.push(baris("Agama", isi(biodata.agama)));
  b.push(baris("Tempat Lahir", isi(biodata.tempatLahir)));
  b.push(baris("Tanggal Lahir", isi(biodata.tanggalLahir)));

  b.push(...garis("1. Biodata Siswa — Data Pendukung"));
  b.push(baris("Nama SMP / Setingkat", isi(biodata.namaSmp)));
  b.push(baris("Provinsi Sekolah", isi(biodata.provinsiSekolah)));
  b.push(baris("Kabupaten/Kota Sekolah", isi(biodata.kabupatenSekolah)));
  b.push(baris("Kecamatan Sekolah", isi(biodata.kecamatanSekolah)));
  b.push(baris("Kelurahan Sekolah", isi(biodata.kelurahanSekolah)));
  b.push(baris("Kode Pos Sekolah", isi(biodata.kodePosSekolah)));
  b.push(baris("Hobi", isi(biodata.hobi)));
  b.push(baris("Cita Cita", isi(biodata.citaCita)));
  b.push(baris("Imunisasi", isi(biodata.imunisasi)));
  b.push(baris("Tinggi Badan (cm)", isi(biodata.tinggiBadan)));
  b.push(baris("Berat Badan (kg)", isi(biodata.beratBadan)));
  b.push(baris("Ukuran Sepatu", isi(biodata.ukuranSepatu)));
  b.push(baris("Ukuran Baju", isi(biodata.ukuranBaju)));
  b.push(baris("Ukuran Celana / Rok", isi(biodata.ukuranCelana)));

  b.push(...garis("2. Data Orang Tua/Wali"));
  b.push(baris("Nama Ayah / Wali", isi(ortu.namaAyah)));
  b.push(baris("Nama Ibu / Wali", isi(ortu.namaIbu)));
  b.push(baris("Suku Ayah", isi(ortu.sukuAyah)));
  b.push(baris("Suku Ibu", isi(ortu.sukuIbu)));
  b.push(baris("Pekerjaan Ayah", isi(ortu.pekerjaanAyah)));
  b.push(baris("Pekerjaan Ibu", isi(ortu.pekerjaanIbu)));
  b.push(baris("Penghasilan Ayah", isi(ortu.penghasilanAyah)));
  b.push(baris("Penghasilan Ibu", isi(ortu.penghasilanIbu)));
  b.push(baris("Telepon Rumah", isi(ortu.teleponRumah)));
  b.push(baris("Telepon Seluler", isi(ortu.teleponSeluler)));
  b.push(baris("Alamat Rumah", isi(ortu.alamatRumah)));
  b.push(baris("Provinsi", isi(ortu.provinsi)));
  b.push(baris("Kabupaten / Kota", isi(ortu.kabupaten)));
  b.push(baris("Kecamatan", isi(ortu.kecamatan)));
  b.push(baris("Kelurahan", isi(ortu.kelurahan)));
  b.push(baris("Kode Pos", isi(ortu.kodePos)));

  b.push(...garis("3. Data Akademik (Nilai Pengetahuan)"));
  const lebarMapel = 24;
  b.push(
    `${"Mata Pelajaran".padEnd(lebarMapel, " ")}${Array.from(
      { length: JUMLAH_SEMESTER },
      (_, i) => `Sem ${i + 1}`.padStart(8, " "),
    ).join("")}`,
  );
  b.push("-".repeat(lebarMapel + JUMLAH_SEMESTER * 8));
  MAPEL_AKADEMIK.forEach((mapel) => {
    const nilai = akademik[mapel] ?? [];
    const kolom = Array.from({ length: JUMLAH_SEMESTER }, (_, i) =>
      isi(nilai[i]).padStart(8, " "),
    ).join("");
    b.push(`${mapel.padEnd(lebarMapel, " ")}${kolom}`);
  });

  b.push(...garis("4. Kelengkapan Dokumen"));
  DOKUMEN.forEach((spek) => {
    const catatan = dokumen[spek.kunci];
    const status = catatan
      ? `${namaBerkasOtomatis(spek, biodata.namaLengkap || siswa.nama, catatan.ekstensi)} (${formatUkuran(catatan.ukuran)})`
      : spek.wajib
        ? "BELUM DIUNGGAH"
        : "belum diunggah (tidak wajib)";
    b.push(`${String(spek.nomor).padStart(2, " ")}. ${spek.namaBerkas}`);
    b.push(`    ${status}`);
    if (catatan?.keterangan) b.push(`    Keterangan: ${catatan.keterangan}`);
  });

  b.push(...garis("5. Data Prestasi"));
  if (prestasi.length === 0) {
    b.push("Tidak ada data prestasi yang diisi.");
  } else {
    prestasi.forEach((item, i) => {
      b.push(`Prestasi ${i + 1}`);
      b.push(baris("  Nama Kegiatan", isi(item.namaKegiatan)));
      b.push(baris("  Sumber Prestasi", isi(item.sumber)));
      b.push(baris("  Tingkat", isi(item.tingkat)));
      b.push(baris("  Peringkat", isi(item.peringkat)));
      b.push(baris("  Tahun", isi(item.tahun)));
      b.push(baris("  Penyelenggara", isi(item.penyelenggara)));
      b.push("");
    });
  }

  b.push("");
  b.push("-".repeat(72));
  b.push("Dokumen ini dibuat otomatis oleh sistem pendaftaran.");

  return b.join(AKHIR_BARIS) + AKHIR_BARIS;
}

/* ----------------------------------- ZIP ---------------------------------- */

/** Nama folder/berkas arsip untuk seorang peserta. */
export function namaArsipPeserta(
  siswa: Pick<Siswa, "id" | "nama">,
  data: Pendaftaran,
) {
  const nama = bersihkanPotonganNama(data.biodata.namaLengkap || siswa.nama);
  return `${siswa.id}_${nama}`;
}

/**
 * Menyusun entri ZIP milik satu peserta: satu berkas teks berisi seluruh
 * isian, ditambah seluruh berkas unggahan dengan nama sesuai ketentuan panitia.
 * `awalan` diisi ketika beberapa peserta digabung ke dalam satu arsip.
 */
export async function entriZipPeserta(
  siswa: Siswa,
  data: Pendaftaran,
  awalan = "",
): Promise<EntriZip[]> {
  const namaPeserta = data.biodata.namaLengkap || siswa.nama;
  const folder = awalan ? `${awalan}/` : "";

  const entri: EntriZip[] = [
    {
      nama: `${folder}${namaArsipPeserta(siswa, data)}.txt`,
      isi: Buffer.from(susunTeksPendaftaran(siswa, data), "utf8"),
    },
  ];

  for (const spek of DOKUMEN) {
    const catatan = data.dokumen[spek.kunci];
    if (!catatan) continue;

    const isiBerkas = await bacaBerkasDokumen(siswa.id, catatan);
    if (!isiBerkas) continue;

    entri.push({
      nama: `${folder}${namaBerkasOtomatis(spek, namaPeserta, catatan.ekstensi)}`,
      isi: isiBerkas,
    });
  }

  return entri;
}

/** Arsip satu peserta: berkas teks + seluruh dokumennya. */
export async function zipPeserta(siswa: Siswa) {
  const data = await bacaPendaftaran(siswa.id);
  const entri = await entriZipPeserta(siswa, data);
  return {
    nama: `${namaArsipPeserta(siswa, data)}.zip`,
    isi: buatZip(entri),
  };
}

/** Arsip banyak peserta: satu folder per peserta di dalam arsip yang sama. */
export async function zipBanyakPeserta(daftar: Siswa[]) {
  const entri: EntriZip[] = [];

  for (const siswa of daftar) {
    const data = await bacaPendaftaran(siswa.id);
    entri.push(...(await entriZipPeserta(siswa, data, namaArsipPeserta(siswa, data))));
  }

  const tanggal = new Date().toISOString().slice(0, 10);
  return {
    nama: `Berkas Pendaftaran Siswa ${tanggal}.zip`,
    isi: buatZip(entri),
  };
}
