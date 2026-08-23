import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ paketId: string; sesiId: string }> };

/**
 * Alamat lama ruang psikotes.
 *
 * Sesi psikotes kini dikerjakan layar penuh di bawah `/ujian/psikotes`, sama
 * seperti ruang ujian try out akademik. Alamat lama tetap dilayani agar tautan
 * yang sudah tersimpan di riwayat peramban peserta tidak berakhir buntu.
 */
export default async function AlamatLamaSesiPsikotes({ params }: Props) {
  const { paketId, sesiId } = await params;
  permanentRedirect(`/ujian/psikotes/${paketId}/${sesiId}`);
}
