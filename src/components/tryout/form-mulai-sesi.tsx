"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, LoaderCircle, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mulaiSesi, type MulaiSesiState } from "@/lib/actions-sesi";

/**
 * Tombol mulai sesi try out akademik.
 * Password tidak diperlukan — peserta langsung memulai sesi.
 */
export function FormMulaiSesi({
  paketId,
  sesiId,
  namaSesi,
}: {
  paketId: string;
  sesiId: string;
  namaSesi: string;
  /** @deprecated Password tidak lagi digunakan untuk try out akademik. */
  passwordBawaan?: string;
}) {
  const aksi = mulaiSesi.bind(null, paketId, sesiId);
  const [state, formAction] = useActionState<MulaiSesiState, FormData>(aksi, {});

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
          <PlayCircle className="size-4 text-navy-600" />
          Mulai Sesi
        </h2>
        <p className="text-xs leading-relaxed text-muted">
          Tekan tombol di bawah untuk memulai {namaSesi}. Pastikan Anda sudah
          membaca instruksi dan tata tertib sebelum memulai.
        </p>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <TombolMulai aktif />
    </form>
  );
}

function TombolMulai({ aktif }: { aktif: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      variant="gold"
      className="w-full"
      disabled={!aktif || pending}
    >
      {pending ? (
        <LoaderCircle className="size-4.5 animate-spin" />
      ) : (
        <PlayCircle className="size-4.5" />
      )}
      {pending ? "Menyiapkan sesi..." : "Mulai Sesi"}
    </Button>
  );
}
