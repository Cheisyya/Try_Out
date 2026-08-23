"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

/**
 * Pembaca materi.
 *
 * Berkas dimuat lewat route yang memeriksa sesi, disematkan `inline`, dan
 * ditampilkan tanpa bilah alat bawaan pembaca PDF (`#toolbar=0`) sehingga tidak
 * ada tombol unduh maupun cetak. Menu klik-kanan pada area pembaca juga
 * dimatikan.
 *
 * Ini menutup jalur "simpan" yang biasa, bukan menjadikan berkas mustahil
 * diambil: apa pun yang dapat dibaca peramban pada akhirnya tetap dapat
 * disalin. Keterangan sejujurnya ditampilkan kepada admin pada panel materi.
 */
export function PembacaMateri({
  sumber,
  judul,
}: {
  sumber: string;
  judul: string;
}) {
  const [memuat, setMemuat] = useState(true);
  const bingkai = useRef<HTMLIFrameElement>(null);

  // Beberapa peramban tidak memicu `onLoad` untuk PDF tersemat; penanda muat
  // dilepas setelah jeda singkat agar spinner tidak tertinggal selamanya.
  useEffect(() => {
    const jeda = setTimeout(() => setMemuat(false), 2500);
    return () => clearTimeout(jeda);
  }, []);

  return (
    <div
      onContextMenu={(event) => event.preventDefault()}
      className="relative overflow-hidden rounded-2xl border border-line bg-navy-50"
    >
      {memuat ? (
        <span className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-2.5 text-sm text-muted">
          <LoaderCircle className="size-4.5 animate-spin text-navy-600" />
          Menyiapkan materi...
        </span>
      ) : null}

      <iframe
        ref={bingkai}
        title={judul}
        src={`${sumber}#toolbar=0&navpanes=0&statusbar=0&view=FitH`}
        onLoad={() => setMemuat(false)}
        className="h-[70vh] w-full min-h-[420px] border-0 bg-white"
      />
    </div>
  );
}
