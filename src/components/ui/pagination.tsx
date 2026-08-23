import Link from "next/link";

import { cn } from "@/lib/utils";

/** Memotong daftar sesuai halaman dan menghitung informasi paginasi. */
export function potongHalaman<T>(data: T[], halaman: number, perHalaman: number) {
  const totalHalaman = Math.max(1, Math.ceil(data.length / perHalaman));
  const aman = Math.min(Math.max(1, halaman), totalHalaman);
  const mulai = (aman - 1) * perHalaman;
  return {
    baris: data.slice(mulai, mulai + perHalaman),
    halaman: aman,
    totalHalaman,
    total: data.length,
    dari: data.length === 0 ? 0 : mulai + 1,
    sampai: Math.min(mulai + perHalaman, data.length),
  };
}

export function Pagination({
  basePath,
  params,
  halaman,
  totalHalaman,
  dari,
  sampai,
  total,
}: {
  basePath: string;
  /** Parameter pencarian/filter yang harus dipertahankan antar halaman. */
  params: Record<string, string | undefined>;
  halaman: number;
  totalHalaman: number;
  dari: number;
  sampai: number;
  total: number;
}) {
  const tautan = (nomor: number) => {
    const query = new URLSearchParams();
    for (const [kunci, nilai] of Object.entries(params)) {
      if (nilai) query.set(kunci, nilai);
    }
    query.set("halaman", String(nomor));
    return `${basePath}?${query.toString()}`;
  };

  const nomorTampil = Array.from({ length: totalHalaman }, (_, i) => i + 1).filter(
    (nomor) =>
      nomor === 1 ||
      nomor === totalHalaman ||
      Math.abs(nomor - halaman) <= 1,
  );

  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-muted">
        Menampilkan <b className="text-navy-800">{dari}</b>–
        <b className="text-navy-800">{sampai}</b> dari{" "}
        <b className="text-navy-800">{total}</b> baris
      </p>

      {totalHalaman > 1 ? (
        <nav className="flex flex-wrap items-center gap-1.5" aria-label="Paginasi">
          <TautanHalaman
            href={tautan(Math.max(1, halaman - 1))}
            nonaktif={halaman === 1}
          >
            Sebelumnya
          </TautanHalaman>

          {nomorTampil.map((nomor, i) => (
            <span key={nomor} className="flex items-center gap-1.5">
              {i > 0 && nomor - nomorTampil[i - 1] > 1 ? (
                <span className="px-1 text-xs text-muted">…</span>
              ) : null}
              <TautanHalaman href={tautan(nomor)} aktif={nomor === halaman}>
                {nomor}
              </TautanHalaman>
            </span>
          ))}

          <TautanHalaman
            href={tautan(Math.min(totalHalaman, halaman + 1))}
            nonaktif={halaman === totalHalaman}
          >
            Berikutnya
          </TautanHalaman>
        </nav>
      ) : null}
    </div>
  );
}

function TautanHalaman({
  href,
  children,
  aktif,
  nonaktif,
}: {
  href: string;
  children: React.ReactNode;
  aktif?: boolean;
  nonaktif?: boolean;
}) {
  const kelas = cn(
    "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition",
    aktif
      ? "border-navy-800 bg-navy-900 text-white"
      : "border-line bg-white text-navy-700 hover:bg-navy-50",
    nonaktif && "pointer-events-none opacity-40",
  );

  if (nonaktif) return <span className={kelas}>{children}</span>;
  return (
    <Link href={href} className={kelas} aria-current={aktif ? "page" : undefined}>
      {children}
    </Link>
  );
}
