"use client";

import { useRef, useState, useTransition } from "react";
import { CheckCircle2, ImageUp, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { unggahGambarSoal } from "@/lib/actions-unggah";

/**
 * Pengunggah gambar soal. Setelah berhasil, path berkas diisikan ke input
 * `image_src` pada form soal sehingga admin tidak perlu mengetik manual.
 */
export function UnggahGambar({
  onTerunggah,
}: {
  onTerunggah: (src: string) => void;
}) {
  const berkasRef = useRef<HTMLInputElement>(null);
  const [proses, mulaiTransisi] = useTransition();
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(null);

  const kirim = () => {
    const berkas = berkasRef.current?.files?.[0];
    if (!berkas) {
      setPesan({ ok: false, teks: "Pilih berkas gambar terlebih dahulu." });
      return;
    }

    const data = new FormData();
    data.set("gambar", berkas);

    mulaiTransisi(async () => {
      const hasil = await unggahGambarSoal(null, data);
      if (hasil.ok) {
        onTerunggah(hasil.src);
        setPesan({ ok: true, teks: `Gambar tersimpan sebagai ${hasil.src}` });
      } else {
        setPesan({ ok: false, teks: hasil.masalah });
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={berkasRef}
          type="file"
          accept="image/svg+xml,image/png,image/jpeg,image/webp"
          className="block w-full max-w-xs text-sm text-navy-800 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-navy-800 hover:file:bg-navy-100"
        />
        <Button type="button" variant="outline" size="sm" onClick={kirim} disabled={proses}>
          {proses ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <ImageUp className="size-4" />
          )}
          Unggah
        </Button>
      </div>

      {pesan ? (
        <p
          className={
            pesan.ok
              ? "flex items-center gap-2 text-xs text-emerald-600"
              : "text-xs text-rose-600"
          }
        >
          {pesan.ok ? <CheckCircle2 className="size-3.5" /> : null}
          {pesan.teks}
        </p>
      ) : (
        <p className="text-xs text-muted">
          SVG, PNG, JPG, atau WebP maksimal 2 MB. Path gambar terisi otomatis
          setelah unggah berhasil.
        </p>
      )}
    </div>
  );
}
