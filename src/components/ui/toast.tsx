"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Notifikasi sekilas (toast).
 *
 * Dipakai untuk memberi umpan balik atas aksi yang berhasil maupun gagal tanpa
 * menggeser tata letak halaman. Wadahnya memakai `aria-live="polite"` sehingga
 * pesan tetap terbaca pembaca layar, dan setiap toast dapat ditutup manual.
 */

export type NadaToast = "sukses" | "galat" | "info";

type Toast = { id: number; pesan: string; nada: NadaToast };

type KonteksToast = {
  tampilkan: (pesan: string, nada?: NadaToast) => void;
  sukses: (pesan: string) => void;
  galat: (pesan: string) => void;
};

const Konteks = createContext<KonteksToast | null>(null);

const DURASI_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [daftar, setDaftar] = useState<Toast[]>([]);
  const nomor = useRef(0);
  const pewaktu = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const tutup = useCallback((id: number) => {
    setDaftar((sebelumnya) => sebelumnya.filter((item) => item.id !== id));
    const jam = pewaktu.current.get(id);
    if (jam) {
      clearTimeout(jam);
      pewaktu.current.delete(id);
    }
  }, []);

  const tampilkan = useCallback(
    (pesan: string, nada: NadaToast = "info") => {
      nomor.current += 1;
      const id = nomor.current;
      setDaftar((sebelumnya) => [...sebelumnya.slice(-2), { id, pesan, nada }]);
      pewaktu.current.set(
        id,
        setTimeout(() => tutup(id), DURASI_MS),
      );
    },
    [tutup],
  );

  const pewaktuSaatIni = pewaktu.current;
  useEffect(() => {
    return () => {
      for (const jam of pewaktuSaatIni.values()) clearTimeout(jam);
      pewaktuSaatIni.clear();
    };
  }, [pewaktuSaatIni]);

  const nilai = useMemo<KonteksToast>(
    () => ({
      tampilkan,
      sukses: (pesan: string) => tampilkan(pesan, "sukses"),
      galat: (pesan: string) => tampilkan(pesan, "galat"),
    }),
    [tampilkan],
  );

  return (
    <Konteks.Provider value={nilai}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-auto sm:right-4 sm:top-4 sm:items-end sm:px-0"
      >
        {daftar.map((item) => (
          <BarisToast key={item.id} toast={item} onTutup={() => tutup(item.id)} />
        ))}
      </div>
    </Konteks.Provider>
  );
}

const gaya: Record<NadaToast, string> = {
  sukses: "border-emerald-200 bg-emerald-50 text-emerald-900",
  galat: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-navy-100 bg-white text-navy-900",
};

const ikon: Record<NadaToast, typeof Info> = {
  sukses: CheckCircle2,
  galat: AlertCircle,
  info: Info,
};

function BarisToast({ toast, onTutup }: { toast: Toast; onTutup: () => void }) {
  const Ikon = ikon[toast.nada];

  return (
    <div
      role={toast.nada === "galat" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-[var(--shadow-lift)]",
        gaya[toast.nada],
      )}
    >
      <Ikon className="mt-0.5 size-4.5 shrink-0" />
      <p className="min-w-0 flex-1 leading-relaxed">{toast.pesan}</p>
      <button
        type="button"
        onClick={onTutup}
        aria-label="Tutup notifikasi"
        className="-my-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-lg transition hover:bg-black/5"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/**
 * Akses notifikasi. Aman dipanggil di luar provider (menjadi no-op) agar
 * komponen tetap dapat dipakai pada halaman yang belum memasang provider.
 */
export function useToast(): KonteksToast {
  const konteks = useContext(Konteks);
  return (
    konteks ?? {
      tampilkan: () => {},
      sukses: () => {},
      galat: () => {},
    }
  );
}
