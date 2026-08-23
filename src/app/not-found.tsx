import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan.
        </p>
        <ButtonLink href="/" className="mt-7">
          Kembali ke Beranda
        </ButtonLink>
      </div>
    </main>
  );
}
