import type { ReactNode } from "react";

export function PageHeader({
  judul,
  deskripsi,
  aksi,
}: {
  judul: string;
  deskripsi?: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          {judul}
        </h1>
        {deskripsi ? (
          <p className="max-w-2xl text-sm text-muted">{deskripsi}</p>
        ) : null}
      </div>
      {aksi ? <div className="flex flex-wrap gap-2">{aksi}</div> : null}
    </div>
  );
}
