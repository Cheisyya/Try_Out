"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

/**
 * Bilah kemajuan tipis untuk setiap perpindahan halaman.
 *
 * Perpindahan App Router menunggu server selesai merender halaman berikutnya.
 * Tanpa isyarat apa pun, klik pada menu, tab, atau tombol filter terasa seperti
 * tidak terjadi apa-apa — sampai halaman baru tiba-tiba muncul, atau pengguna
 * menyerah dan mengetik alamatnya sendiri di bilah peramban.
 *
 * Komponen ini memasang satu pendengar di tingkat dokumen sehingga *seluruh*
 * tautan internal dan formulir GET ikut tercakup, tanpa perlu mengubah
 * satu per satu. Bilahnya hilang begitu alamat benar-benar berubah.
 */
export function ProgresNavigasi() {
  return (
    <Suspense fallback={null}>
      <Bilah />
    </Suspense>
  );
}

function Bilah() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [berjalan, setBerjalan] = useState(false);

  // Alamat sudah berpindah — hentikan bilahnya.
  useEffect(() => {
    setBerjalan(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const alamatSekarang = () => window.location.pathname + window.location.search;

    const padaKlik = (event: MouseEvent) => {
      // Klik dengan modifier membuka tab baru; halaman ini tidak berpindah.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const tautan = (event.target as HTMLElement | null)?.closest?.("a");
      if (!(tautan instanceof HTMLAnchorElement)) return;
      if (tautan.target && tautan.target !== "_self") return;
      if (tautan.hasAttribute("download")) return;

      const tujuan = new URL(tautan.href, window.location.href);
      if (tujuan.origin !== window.location.origin) return;
      // Tautan jangkar di halaman yang sama, bukan perpindahan.
      if (tujuan.pathname + tujuan.search === alamatSekarang()) return;

      setBerjalan(true);
    };

    const padaKirim = (event: SubmitEvent) => {
      if (event.defaultPrevented) return;
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      // Formulir POST ditangani Server Action dengan indikatornya sendiri.
      if (form.method && form.method.toLowerCase() !== "get") return;
      setBerjalan(true);
    };

    document.addEventListener("click", padaKlik);
    document.addEventListener("submit", padaKirim);
    return () => {
      document.removeEventListener("click", padaKlik);
      document.removeEventListener("submit", padaKirim);
    };
  }, []);

  // Jaring pengaman: bila perpindahan gagal atau dibatalkan peramban, bilahnya
  // tidak boleh menggantung selamanya.
  useEffect(() => {
    if (!berjalan) return;
    const jeda = setTimeout(() => setBerjalan(false), 12_000);
    return () => clearTimeout(jeda);
  }, [berjalan]);

  if (!berjalan) return null;

  return (
    <span
      role="status"
      aria-label="Memuat halaman"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-gold-100"
    >
      <span className="block h-full w-1/3 animate-[geser_1.1s_ease-in-out_infinite] rounded-full bg-gold-500" />
    </span>
  );
}
