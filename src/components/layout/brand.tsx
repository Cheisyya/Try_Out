import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Identitas Smart Home Center.
 *
 * Berkas logo asli (`public/logo.png`, 500×500) memuat lambang sekaligus
 * wordmark. Pada ruang sempit seperti bilah navigasi, wordmark bawaannya akan
 * terlalu kecil untuk dibaca sekaligus mengulang teks di sebelahnya — karena
 * itu `BrandMark` memangkas tampilan ke bagian lambangnya saja lewat CSS,
 * tanpa mengubah berkas aslinya. `LogoPenuh` memakai logo apa adanya untuk
 * penempatan berukuran besar.
 */

export const NAMA_BIMBEL = "Smart Home Center";
export const TAGLINE_BIMBEL = "Bimbingan Belajar Terpercaya";

/** Lambang saja (lingkaran + rumah + buku + bohlam), tanpa wordmark. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block size-10 shrink-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt=""
        className="absolute left-[-26%] top-[-7%] w-[152%] max-w-none"
      />
    </span>
  );
}

/** Logo utuh beserta wordmark, untuk penempatan besar. */
export function LogoPenuh({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt={`${NAMA_BIMBEL} — ${TAGLINE_BIMBEL}`}
      className={cn("h-auto w-40", className)}
    />
  );
}

export function Brand({
  href = "/",
  tone = "terang",
  className,
  ringkas = false,
}: {
  href?: string;
  /** "terang" untuk latar putih, "gelap" untuk latar navy */
  tone?: "terang" | "gelap";
  className?: string;
  /** Menyembunyikan tagline pada ruang sempit. */
  ringkas?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5", className)}
      aria-label={`${NAMA_BIMBEL} — ${TAGLINE_BIMBEL}`}
    >
      <BrandMark
        className={cn(tone === "gelap" && "rounded-lg bg-white/95 p-0.5")}
      />
      <span className="leading-tight">
        <span
          className={cn(
            "block text-sm font-bold tracking-tight",
            tone === "gelap" ? "text-white" : "text-navy-900",
          )}
        >
          {NAMA_BIMBEL}
        </span>
        {ringkas ? null : (
          <span
            className={cn(
              "block text-[11px]",
              tone === "gelap" ? "text-langit-200" : "text-muted",
            )}
          >
            {TAGLINE_BIMBEL}
          </span>
        )}
      </span>
    </Link>
  );
}
