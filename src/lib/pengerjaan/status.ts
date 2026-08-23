import {
  sesiTerurut,
  type PaketKonfig,
  type SesiId,
  type StatusSesi,
} from "@/lib/paket-tryout";
import type { KonteksSiswa } from "@/lib/pengerjaan/layanan";
import type { Percobaan } from "@/lib/pengerjaan/tipe";

/**
 * Turunan status sesi untuk tampilan siswa.
 * Seluruhnya dihitung dari percobaan yang tersimpan di server.
 */

export function percobaanSesi(
  ctx: KonteksSiswa,
  paketId: string,
  sesiId: SesiId,
): Percobaan | undefined {
  return ctx.percobaan.find(
    (item) => item.package_id === paketId && item.session_id === sesiId,
  );
}

export function statusSesi(
  paket: PaketKonfig,
  sesiId: SesiId,
  ctx: KonteksSiswa,
): StatusSesi {
  const percobaan = percobaanSesi(ctx, paket.id, sesiId);
  if (!percobaan) return "Belum Dimulai";
  return percobaan.status === "selesai" ? "Selesai" : "Sedang Berlangsung";
}

/**
 * Sebuah sesi baru terbuka setelah seluruh sesi dengan urutan lebih awal pada
 * paket yang sama dinyatakan selesai. Urutan diatur admin.
 */
export function sesiTerkunci(paket: PaketKonfig, sesiId: SesiId, ctx: KonteksSiswa) {
  const urut = sesiTerurut(paket);
  const ini = urut.find((sesi) => sesi.id === sesiId);
  if (!ini) return true;

  return urut
    .filter((sesi) => sesi.urutan < ini.urutan)
    .some((sesi) => statusSesi(paket, sesi.id, ctx) !== "Selesai");
}

export function ringkasanPaket(paket: PaketKonfig, ctx: KonteksSiswa) {
  const urut = sesiTerurut(paket);
  const status = Object.fromEntries(
    urut.map((sesi) => [sesi.id, statusSesi(paket, sesi.id, ctx)]),
  ) as Record<SesiId, StatusSesi>;

  const daftar = urut.map((sesi) => status[sesi.id]);
  const sesiSelesai = daftar.filter((nilai) => nilai === "Selesai").length;
  const jumlahSesi = urut.length || 1;

  return {
    status,
    sesiSelesai,
    jumlahSesi: urut.length,
    tuntas: urut.length > 0 && sesiSelesai === urut.length,
    sedangBerlangsung: daftar.some((nilai) => nilai === "Sedang Berlangsung"),
    persen: (sesiSelesai / jumlahSesi) * 100,
  };
}

/** Paket berikutnya yang perlu dikerjakan peserta (untuk dashboard). */
export function paketBerikutnya(daftar: PaketKonfig[], ctx: KonteksSiswa) {
  return daftar.find((paket) => !ringkasanPaket(paket, ctx).tuntas) ?? daftar[0];
}

/** Sesi yang sedang berjalan, dipakai untuk menautkan tombol ruang ujian. */
export function sesiBerjalan(ctx: KonteksSiswa, paketId: string, sesiId: SesiId) {
  return percobaanSesi(ctx, paketId, sesiId)?.status === "berlangsung";
}
