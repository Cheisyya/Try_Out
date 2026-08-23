import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/get-session";
import { berandaPeran } from "@/lib/session";
import { kredensialDemoSiswa } from "@/lib/siswa/repositori";

export const metadata: Metadata = { title: "Masuk" };

const ALASAN: Record<string, string> = {
  nonaktif:
    "Akun Anda berstatus nonaktif sehingga sesi dihentikan. Hubungi pengajar Smart Home Center.",
  "tidak-dikenal":
    "Sesi Anda sudah tidak berlaku. Silakan masuk kembali untuk melanjutkan.",
  "perlu-masuk": "Silakan masuk terlebih dahulu untuk membuka halaman tersebut.",
};

/**
 * Satu halaman masuk untuk seluruh peran.
 *
 * Pengunjung yang sesinya masih berlaku langsung diantar ke dashboard peran
 * miliknya, sehingga tombol "Masuk" pada beranda tidak pernah berhenti di
 * formulir yang tidak diperlukan.
 */
export default async function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ alasan?: string }>;
}) {
  const session = await getSession();
  if (session) redirect(berandaPeran(session.role));

  const { alasan } = await searchParams;

  return (
    <LoginForm
      demo={await kredensialDemoSiswa()}
      pemberitahuan={alasan ? ALASAN[alasan] : undefined}
    />
  );
}
