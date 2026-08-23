import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SesiPsikotes } from "@/components/psikotes/sesi-psikotes";
import { wajibFitur } from "@/lib/get-session";
import { pasanganLatihan, soalLatihan } from "@/lib/psikotes/bank";
import {
  nilaiSesi,
  sinkronSesiKedaluwarsa,
  statusSesi,
} from "@/lib/psikotes/catatan";
import {
  cariPaketPsikotes,
  cariSesiPsikotes,
} from "@/lib/psikotes/repositori";
import { sesiDiujikan } from "@/lib/psikotes/tipe";

type Props = { params: Promise<{ paketId: string; sesiId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paketId, sesiId } = await params;
  const paket = await cariPaketPsikotes(paketId);
  const sesi = paket ? cariSesiPsikotes(paket, sesiId) : null;
  return { title: sesi ? `Ruang Psikotes — ${sesi.nama}` : "Ruang Psikotes" };
}

/**
 * Ruang pengerjaan satu sesi psikotes — layar penuh.
 *
 * Ditempatkan di bawah `/ujian` agar memakai layout tanpa sidebar dan tanpa
 * cache, persis seperti ruang ujian try out akademik. Peserta yang sedang
 * mengerjakan sesi berbatas waktu tidak perlu melihat menu dashboard, dan
 * halaman yang tersimpan di cache browser dapat menampilkan sisa waktu yang
 * sudah basi.
 *
 * Server Component ini menentukan keadaan sesi beserta sisa waktunya, lalu
 * membuang kunci jawaban dan pembahasan sebelum menyerahkan soalnya ke komponen
 * klien. Kunci baru dibuka setelah sesi ditutup.
 */
export default async function RuangPsikotesPage({ params }: Props) {
  const sesiLogin = await wajibFitur("psikotesAktif");

  const { paketId, sesiId } = await params;
  const paket = await cariPaketPsikotes(paketId);
  if (!paket || paket.aktif === false) notFound();

  const sesi = cariSesiPsikotes(paket, sesiId);
  // Sesi yang dimatikan admin, atau yang seluruh butirnya dinonaktifkan, tidak
  // dapat dibuka meskipun alamatnya diketik langsung.
  if (!sesi || !sesiDiujikan(sesi)) notFound();

  // Membukukan sesi yang waktunya sudah lewat tetapi belum sempat ditutup,
  // sehingga keadaan yang ditampilkan selalu mencerminkan catatan di server.
  const berkas = await sinkronSesiKedaluwarsa(sesiLogin.identitas);
  const status = statusSesi(berkas, paket.id, sesi);

  const bersama = {
    paketId: paket.id,
    paketNama: paket.nama,
    sesiId: sesi.id,
    sesiNama: sesi.nama,
    petunjuk: sesi.petunjuk,
    durasiMenit: sesi.durasiMenit,
    keadaan: status.keadaan,
    sisaDetikAwal: status.sisaDetik,
    jawabanTersimpan: status.jawaban,
    tautanKembali: `/siswa/psikotes/${paket.id}`,
    // Hasil disusun ulang dari jawaban yang tersimpan supaya pembahasannya ikut
    // terkirim; ringkasan pada catatan hanya dipakai panel admin.
    hasilTersimpan:
      status.keadaan === "selesai" ? nilaiSesi(sesi, status.jawaban) : null,
  };

  return sesi.jenis === "epps" ? (
    <SesiPsikotes {...bersama} jenis="epps" pasangan={pasanganLatihan(sesi)} />
  ) : (
    <SesiPsikotes {...bersama} jenis="skor" soal={soalLatihan(sesi)} />
  );
}
