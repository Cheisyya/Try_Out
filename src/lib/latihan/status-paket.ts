import { bacaJson, cobaSimpan, pastikanJson, tulisJson } from "@/lib/penyimpanan";

/**
 * Overlay status aktif/nonaktif paket latihan (Try Out Akademik, Tes IQ & Psikotes).
 *
 * Bank soal bawaan terbundel di kode; perubahan admin disimpan terpisah pada
 * berkas kecil ini supaya menyalakan/mematikan paket tidak perlu menulis ulang
 * seluruh bank soal. Overlay selalu dibaca setelah paket dasar sehingga
 * preferensi admin tetap berlaku meski paket belum pernah disunting penuh.
 *
 * Disimpan lewat adapter penyimpanan yang sama dengan data aplikasi lainnya
 * (Postgres pada Vercel, berkas lokal pada pengembangan).
 *
 * Modul ini hanya boleh diimpor dari kode server.
 */

export type OverlayStatus = {
  paket: Record<string, boolean>;
  sesi: Record<string, Record<string, boolean>>;
};

const KOSONG: OverlayStatus = { paket: {}, sesi: {} };

function rekamanBoolean(nilai: unknown): Record<string, boolean> {
  if (!nilai || typeof nilai !== "object" || Array.isArray(nilai)) return {};
  const hasil: Record<string, boolean> = {};
  for (const [kunci, status] of Object.entries(nilai)) {
    if (typeof status === "boolean") hasil[kunci] = status;
  }
  return hasil;
}

function normalisasiOverlay(tersimpan: Partial<OverlayStatus> | null): OverlayStatus {
  const sesi: OverlayStatus["sesi"] = {};
  const mentah = tersimpan?.sesi;
  if (mentah && typeof mentah === "object" && !Array.isArray(mentah)) {
    for (const [paketId, daftar] of Object.entries(mentah)) {
      sesi[paketId] = rekamanBoolean(daftar);
    }
  }
  return { paket: rekamanBoolean(tersimpan?.paket), sesi };
}

export async function bacaOverlay(kunci: string): Promise<OverlayStatus> {
  const tersimpan = await bacaJson<Partial<OverlayStatus>>(kunci);
  if (!tersimpan) {
    await pastikanJson(kunci, KOSONG);
  }
  return normalisasiOverlay(tersimpan);
}

async function tulisOverlay(
  kunci: string,
  overlay: OverlayStatus,
): Promise<{ ok: true } | { ok: false; masalah: string[] }> {
  const hasil = await cobaSimpan(
    () => tulisJson(kunci, overlay),
    "Gagal menyimpan status paket.",
  );
  return hasil.ok ? { ok: true } : { ok: false, masalah: [hasil.pesan] };
}

/** Menyalakan atau memadamkan satu paket lewat overlay. */
export async function setAktifPaketOverlay(
  kunci: string,
  paketId: string,
  aktif: boolean,
): Promise<{ ok: true } | { ok: false; masalah: string[] }> {
  const overlay = await bacaOverlay(kunci);
  overlay.paket[paketId] = aktif === true;
  return tulisOverlay(kunci, overlay);
}

/** Menyalakan atau memadamkan satu sesi psikotes lewat overlay. */
export async function setAktifSesiOverlay(
  kunci: string,
  paketId: string,
  sesiId: string,
  aktif: boolean,
): Promise<{ ok: true } | { ok: false; masalah: string[] }> {
  const overlay = await bacaOverlay(kunci);
  if (!overlay.sesi[paketId]) overlay.sesi[paketId] = {};
  overlay.sesi[paketId][sesiId] = aktif;
  return tulisOverlay(kunci, overlay);
}

export function aktifPaketDariOverlay(
  paketId: string,
  aktifAsli: boolean | undefined,
  overlay: OverlayStatus,
): boolean {
  if (Object.prototype.hasOwnProperty.call(overlay.paket, paketId)) {
    return overlay.paket[paketId];
  }
  return aktifAsli !== false;
}

export function aktifSesiDariOverlay(
  paketId: string,
  sesiId: string,
  aktifAsli: boolean | undefined,
  overlay: OverlayStatus,
): boolean {
  const paket = overlay.sesi[paketId];
  if (paket && Object.prototype.hasOwnProperty.call(paket, sesiId)) {
    return paket[sesiId];
  }
  return aktifAsli !== false;
}

/** Menerapkan overlay status pada daftar paket yang sudah dibaca. */
export function terapkanOverlayPaket<
  T extends { id: string; aktif?: boolean },
>(daftar: T[], overlay: OverlayStatus): T[] {
  return daftar.map((paket) => {
    if (!Object.prototype.hasOwnProperty.call(overlay.paket, paket.id)) {
      return paket;
    }
    return { ...paket, aktif: overlay.paket[paket.id] };
  });
}

/** Menerapkan overlay status sesi pada satu paket psikotes. */
export function terapkanOverlaySesi<
  T extends { id: string; aktif?: boolean },
  P extends { id: string; sesi: T[] },
>(paket: P, overlay: OverlayStatus): P {
  const sesiOverlay = overlay.sesi[paket.id];
  if (!sesiOverlay) return paket;
  return {
    ...paket,
    sesi: paket.sesi.map((sesi) =>
      Object.prototype.hasOwnProperty.call(sesiOverlay, sesi.id)
        ? { ...sesi, aktif: sesiOverlay[sesi.id] }
        : sesi,
    ),
  };
}

export { KOSONG as OVERLAY_KOSONG };
