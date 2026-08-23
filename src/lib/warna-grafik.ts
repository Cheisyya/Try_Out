/**
 * Palet seri grafik.
 *
 * Sengaja berdiri di luar komponen grafik: `grafik-garis.tsx` adalah modul
 * `"use client"`, dan seluruh ekspor modul semacam itu berubah menjadi rujukan
 * klien ketika diimpor Server Component — konstanta biasa pun ikut, sehingga
 * `WARNA_SERI[0]` terbaca `undefined` di server. Akibatnya `stroke` garis tidak
 * pernah tertulis dan grafik hanya menyisakan titik. Dengan paletnya berada di
 * modul biasa, server maupun klien membaca nilai yang sama.
 *
 * Empat slot kategorikal yang sudah lolos pemeriksaan CVD pada permukaan putih.
 */
export const WARNA_SERI = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100"] as const;
