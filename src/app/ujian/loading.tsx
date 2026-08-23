import { LoaderCircle } from "lucide-react";

/**
 * Keadaan memuat ruang ujian. Ditulis khusus agar peserta tahu bahwa waktu
 * ujian dihitung server dan tidak berkurang karena halaman sedang disiapkan.
 */
export default function UjianLoading() {
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <div
        role="status"
        aria-live="polite"
        className="max-w-sm text-center"
      >
        <LoaderCircle className="mx-auto size-7 animate-spin text-navy-700" />
        <p className="mt-4 text-sm font-semibold text-navy-900">
          Menyiapkan ruang ujian...
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Naskah soal dan jawaban Anda diambil dari server. Jangan menutup
          halaman ini.
        </p>
      </div>
    </main>
  );
}
