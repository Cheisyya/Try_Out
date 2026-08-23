import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { RuangUjian } from "@/components/ujian/ruang-ujian";
import { wajibFitur } from "@/lib/get-session";
import { getPaket, isSesiId } from "@/lib/paket-tryout";
import { ambilSoalUjian } from "@/lib/bank-soal/pengambilan";
import { percobaanAktif } from "@/lib/pengerjaan/layanan";

type Props = {
  params: Promise<{ paketId: string; sesiId: string }>;
  searchParams: Promise<{ lanjut?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paketId } = await params;
  const paket = await getPaket(paketId);
  return { title: paket ? `Ruang Ujian — ${paket.nama}` : "Ruang Ujian" };
}

export default async function RuangUjianPage({ params, searchParams }: Props) {
  const { paketId, sesiId } = await params;
  const { lanjut } = await searchParams;

  const session = await wajibFitur("tryoutAkademikAktif");
  if (!await getPaket(paketId) || !isSesiId(sesiId)) notFound();

  // Membaca percobaan aktif sekaligus membukukan mata uji yang waktunya habis.
  const aktif = await percobaanAktif({
    id: session.identitas,
    nama: session.nama,
  });

  // Belum memulai sesi ini (password belum diverifikasi) -> kembali ke instruksi.
  if (
    !aktif ||
    aktif.percobaan.package_id !== paketId ||
    aktif.percobaan.session_id !== sesiId
  ) {
    redirect(`/siswa/tryout/${paketId}/${sesiId}/instruksi`);
  }

  const { percobaan, paket, sesi, jadwal } = aktif;

  // Seluruh mata uji sudah dibukukan: sesi berakhir.
  if (jadwal.aktif === null) {
    redirect(`/siswa/tryout/${paket.id}?sesi=${sesiId}&selesai=1`);
  }

  const indeks = jadwal.aktif;
  const mata = sesi.mataUji[indeks];
  const subject = mata.subject;
  const bank = await ambilSoalUjian(paket.id, subject);

  if (bank.soal.length === 0) {
    return (
      <main className="grid min-h-dvh place-items-center px-5">
        <div className="max-w-sm text-center">
          <h1 className="text-lg font-semibold text-navy-900">
            Soal belum tersedia
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Bank soal {mata.subject} pada {paket.nama} belum terisi. Hubungi
            pengajar Smart Home Center sebelum melanjutkan sesi.
          </p>
        </div>
      </main>
    );
  }

  // Jawaban yang sudah tersimpan di server dikirim kembali sebagai isian awal.
  // Kunci jawaban dan pembahasan tidak pernah ikut dikirim ke browser.
  const jawabanTersimpan = Object.fromEntries(
    percobaan.jawaban
      .filter((item) => item.subject === subject)
      .map((item) => [item.question_id, item.answer]),
  );

  const soal = bank.soal.map((butir) => ({
    id: butir.id,
    nomor: butir.nomor,
    pertanyaan: butir.question,
    opsi: [
      butir.options.A,
      butir.options.B,
      butir.options.C,
      butir.options.D,
    ],
    gambar: butir.image
      ? {
          src: butir.image.src,
          alt: butir.image.alt,
          keterangan: butir.image.keterangan,
        }
      : undefined,
    tabel: butir.table,
  }));

  return (
    <RuangUjian
      paketNama={paket.nama}
      sesiNama={sesi.nama}
      mataUjiNama={mata.subject}
      mataUjiIndeks={indeks}
      totalMataUji={sesi.mataUji.length}
      durasiMenit={mata.durasiMenit}
      soal={soal}
      jawabanTersimpan={jawabanTersimpan}
      sisaDetikAwal={jadwal.sisaDetik}
      jumlahPelanggaran={percobaan.pelanggaran?.length ?? 0}
      catatanBank={
        bank.lengkap
          ? undefined
          : `Bank soal ${mata.subject} masih dalam pengisian: tersedia ${bank.tersedia} dari ${bank.target} soal.`
      }
      pesanLanjut={
        lanjut === "1"
          ? `Mata uji sebelumnya telah dikumpulkan. Anda kini mengerjakan ${mata.subject} dengan waktu ${mata.durasiMenit} menit.`
          : undefined
      }
    />
  );
}
