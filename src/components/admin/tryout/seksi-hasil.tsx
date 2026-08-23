import { ArrowRight, Medal, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { KeadaanKosong } from "@/components/ui/state";
import { rekapSeluruhPaket } from "@/lib/pengerjaan/rekap-admin";
import { formatTanggalWaktu } from "@/lib/utils";

/**
 * Hasil Try Out: satu kartu per paket.
 *
 * Daftar per mata uji yang panjang dipindahkan ke halaman rincian tiap paket —
 * pada tingkat ini yang dicari panitia hanya "paket mana yang sudah dikerjakan,
 * seberapa baik hasilnya, dan siapa yang tertinggi". Rincian per peserta dan
 * per mata pelajaran dibuka lewat tombol Lihat Rincian.
 */
export async function SeksiHasil() {
  const rekap = await rekapSeluruhPaket();
  const adaHasil = rekap.some((paket) => paket.peserta.length > 0);

  if (!adaHasil) {
    return (
      <Card>
        <CardBody className="p-0 sm:p-0">
          <KeadaanKosong
            judul="Belum ada hasil try out"
            deskripsi="Kartu hasil muncul setelah peserta mengumpulkan mata uji pertamanya."
            ikon={Medal}
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {rekap.map((paket) => {
        const juara = paket.peserta[0];
        return (
          <li
            key={paket.paketId}
            className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-navy-900">
                  {paket.paketNama}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {paket.peserta.length} peserta
                  </span>
                  {paket.terakhir > 0 ? (
                    <span>
                      · terakhir{" "}
                      {formatTanggalWaktu(new Date(paket.terakhir).toISOString())}
                    </span>
                  ) : null}
                </p>
              </div>
              {!paket.aktif ? <Badge tone="netral">nonaktif</Badge> : null}
            </div>

            {paket.peserta.length === 0 ? (
              <p className="mt-5 rounded-xl border border-dashed border-line px-4 py-5 text-center text-sm text-muted">
                Belum ada peserta yang mengumpulkan paket ini.
              </p>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line px-4 py-3">
                    <p className="text-xs text-muted">Rata-rata paket</p>
                    <p className="mt-0.5 text-2xl font-bold tabular-nums text-navy-900">
                      {paket.rataRata}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3">
                    <p className="flex items-center gap-1.5 text-xs text-gold-800">
                      <Medal className="size-3.5" />
                      Tertinggi
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-navy-900">
                      {juara.studentNama}
                    </p>
                    <p className="text-xs font-semibold tabular-nums text-gold-800">
                      rata-rata {juara.rataRata}
                    </p>
                  </div>
                </div>

                <ButtonLink
                  href={`/admin/tryout/hasil/${paket.paketId}`}
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                >
                  Lihat Rincian Peserta
                  <ArrowRight className="size-4" />
                </ButtonLink>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
