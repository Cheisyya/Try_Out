"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, KeyRound, LoaderCircle, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { mulaiSesi, type MulaiSesiState } from "@/lib/actions-sesi";

/**
 * Verifikasi kesiapan dan password sesi sebelum peserta masuk ruang ujian.
 * Tombol baru aktif setelah pernyataan dicentang; password diverifikasi di
 * server sehingga password yang salah tidak dapat membuka sesi.
 */
export function FormMulaiSesi({
  paketId,
  sesiId,
  namaSesi,
  passwordBawaan,
}: {
  paketId: string;
  sesiId: string;
  namaSesi: string;
  /**
   * Password bawaan demo. Hanya dikirim server pada pengembangan lokal dan
   * selama password sesi belum pernah diganti admin — di produksi selalu
   * kosong agar tidak ada password yang bocor lewat HTML.
   */
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
          <KeyRound className="size-4 text-navy-600" />
          Password Sesi
        </h2>
        <p className="text-xs leading-relaxed text-muted">
          Password dibagikan pengajar saat sesi dibuka. Sesi tidak dapat dimulai
          tanpa password yang benar.
        </p>
      </div>

      <Field label={`Password ${namaSesi}`} htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="off"
          placeholder="Masukkan password sesi"
          required
        />
      </Field>

      {passwordBawaan ? (
        <p className="rounded-xl border border-gold-200 bg-gold-50 px-3.5 py-2.5 text-xs text-gold-800">
          Password bawaan (khusus pengembangan lokal):{" "}
          <span className="font-mono font-semibold">{passwordBawaan}</span>.
        </p>
      ) : null}

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
