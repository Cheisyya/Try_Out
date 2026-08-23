import { permanentRedirect } from "next/navigation";

/**
 * Alamat masuk lama.
 *
 * Login siswa dan pengelola kini menyatu di `/masuk`; halaman ini hanya
 * meneruskan penanda buku dan tautan lama tanpa mengubah alasan yang dibawa.
 */
export default async function MasukAdminLama({
  searchParams,
}: {
  searchParams: Promise<{ alasan?: string }>;
}) {
  const { alasan } = await searchParams;
  permanentRedirect(alasan ? `/masuk?alasan=${encodeURIComponent(alasan)}` : "/masuk");
}
