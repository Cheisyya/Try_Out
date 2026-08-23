import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Ruang Ujian" };

/**
 * Layout khusus ruang ujian: tanpa sidebar dan menu dashboard agar peserta
 * fokus mengerjakan soal.
 */
export default function UjianLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-surface">{children}</div>;
}
