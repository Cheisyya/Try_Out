import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Menggabungkan class Tailwind dengan aman (menghindari konflik utility). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format tanggal ISO -> "12 Agustus 2026". */
export function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Format tanggal ISO -> "12 Agu 2026, 09:00". */
export function formatTanggalWaktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 1234 -> "1.234" */
export function formatAngka(n: number) {
  return n.toLocaleString("id-ID");
}
