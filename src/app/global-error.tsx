"use client";

import { useEffect } from "react";

/**
 * Batas kesalahan terakhir: dipakai bila root layout sendiri gagal dirender,
 * sehingga komponen dan gaya aplikasi belum tentu tersedia.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Aplikasi gagal dimuat:", error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          margin: 0,
          padding: "1.25rem",
          fontFamily: "system-ui, sans-serif",
          color: "#0f1c39",
          background: "#f6f8fc",
        }}
      >
        <div style={{ maxWidth: "26rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Aplikasi gagal dimuat
          </h1>
          <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Terjadi kendala mendasar saat menyiapkan aplikasi. Muat ulang
            halaman; bila masih berlanjut, hubungi pengajar Smart Home Center.
          </p>
          {error.digest ? (
            <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#64748b" }}>
              Kode kejadian: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.65rem 1.25rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "#0f1c39",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
