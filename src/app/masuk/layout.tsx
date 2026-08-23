import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

import { Brand, NAMA_BIMBEL } from "@/components/layout/brand";

const janji = [
  "Simulasi ujian berbasis komputer",
  "Nilai keluar begitu sesi dikumpulkan",
  "Riwayat hasil tersimpan rapi",
];

export default function MasukLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      {/* Panel branding — tersembunyi pada layar kecil */}
      <aside className="relative hidden overflow-hidden bg-navy-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute -bottom-32 -left-20 size-96 rounded-full bg-langit-600/40 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <Brand tone="gelap" />
        </div>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Belajar terarah,{" "}
            <span className="text-gold-300">hasil terukur</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-langit-100">
            Masuk untuk melanjutkan latihan try out bersama {NAMA_BIMBEL}.
          </p>
          <ul className="mt-8 space-y-3">
            {janji.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-langit-100"
              >
                <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-gold-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-langit-300">
          © {new Date().getFullYear()} {NAMA_BIMBEL}
        </p>
      </aside>

      {/* Panel form */}
      <main className="flex min-h-dvh flex-col bg-white">
        <div className="flex h-16 items-center justify-between border-b border-line px-5 sm:px-8">
          <Brand className="lg:hidden" ringkas />
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-navy-700 transition hover:text-navy-900"
          >
            <ArrowLeft className="size-4" />
            Beranda
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
