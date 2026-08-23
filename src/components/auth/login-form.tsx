"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, LoaderCircle, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { login, type LoginState } from "@/lib/actions";

/** Kredensial demo hanya dikirim server saat pengembangan lokal. */
export type KredensialDemo = { identitas: string; password: string } | null;

/**
 * Satu formulir masuk untuk siswa maupun pengelola.
 *
 * Tidak ada pemilih peran: server yang menentukan peran dari kredensial yang
 * cocok, lalu mengantar pengguna ke dashboard miliknya. Peran karenanya tidak
 * pernah menjadi masukan dari peramban.
 */
export function LoginForm({
  demo = null,
  pemberitahuan,
}: {
  demo?: KredensialDemo;
  /** Alasan pengguna dikembalikan ke halaman masuk, mis. sesi kedaluwarsa. */
  pemberitahuan?: string;
}) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">
          Masuk ke akun Anda
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Gunakan username atau email beserta kata sandi Anda. Halaman yang
          terbuka menyesuaikan jenis akun secara otomatis.
        </p>
      </div>

      {pemberitahuan ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-xl border border-navy-100 bg-navy-50 px-3.5 py-2.5 text-sm text-navy-800"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-navy-600" />
          {pemberitahuan}
        </p>
      ) : null}
      
      <form action={formAction} className="space-y-4">
        <Field label="Username atau Email" htmlFor="identitas">
          <Input
            id="identitas"
            name="identitas"
            type="text"
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Contoh: aditya.pratama"
            defaultValue={demo?.identitas}
            maxLength={120}
            required
          />
        </Field>

        <Field label="Kata Sandi" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            defaultValue={demo?.password}
            maxLength={200}
            required
          />
        </Field>

        {state.error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}

        <TombolMasuk />
      </form>

      <p className="text-center text-sm text-muted">
        Lupa username atau kata sandi? Hubungi pengajar Smart Home Center.
      </p>
    </div>
  );
}

function TombolMasuk() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <LoaderCircle className="size-4.5 animate-spin" />
      ) : (
        <LogIn className="size-4.5" />
      )}
      {pending ? "Memproses..." : "Masuk"}
    </Button>
  );
}
