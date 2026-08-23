import { KeadaanMemuat } from "@/components/ui/state";

/** Keadaan memuat untuk seluruh halaman area peserta. */
export default function SiswaLoading() {
  return (
    <div className="space-y-5">
      <div className="h-16 animate-pulse rounded-2xl bg-navy-50" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-navy-50"
            aria-hidden
          />
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-white">
        <KeadaanMemuat />
      </div>
    </div>
  );
}
