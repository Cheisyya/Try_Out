"use client";

import { FormPendaftaran } from "@/components/pendaftaran/form-pendaftaran";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, TableWrapper, Td, Th } from "@/components/ui/table";
import { simpanAkademikAksi } from "@/lib/actions-pendaftaran";
import {
  JUMLAH_SEMESTER,
  MAPEL_AKADEMIK,
  type NilaiAkademik,
} from "@/lib/pendaftaran/tipe";

/**
 * Tabel Nilai Pengetahuan semester 1–4.
 *
 * Semester 4 boleh dikosongkan oleh siswa akselerasi — aturan yang sama
 * diberlakukan ulang pada validasi server.
 */
export function FormAkademik({
  akademik,
  tersimpan,
}: {
  akademik: NilaiAkademik;
  tersimpan: boolean;
}) {
  return (
    <FormPendaftaran
      aksi={simpanAkademikAksi}
      tersimpan={tersimpan}
      pesanSukses="Data akademik tersimpan."
      labelSimpan="Simpan Data Akademik"
      catatanBawah="Nilai wajib berupa angka 0–100 sesuai rapor yang diunggah."
    >
      <Card>
        <CardHeader
          judul="Data Akademik Siswa"
          deskripsi="Isi NILAI PENGETAHUAN (bukan nilai keterampilan) sesuai rapor terlegalisir."
        />
        <CardBody className="p-0 sm:p-0">
          <TableWrapper>
            <Table className="min-w-[680px]">
              <thead>
                <tr>
                  <Th className="w-12">No</Th>
                  <Th>Mata Pelajaran</Th>
                  {Array.from({ length: JUMLAH_SEMESTER }, (_, i) => (
                    <Th key={i} className="w-32">
                      Sem {i + 1}
                      <span className="block font-normal normal-case tracking-normal text-muted">
                        Pengetahuan
                      </span>
                    </Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MAPEL_AKADEMIK.map((mapel, urut) => (
                  <tr key={mapel} className="transition hover:bg-navy-50/40">
                    <Td className="text-muted">{urut + 1}.</Td>
                    <Td className="font-medium">{mapel}</Td>
                    {Array.from({ length: JUMLAH_SEMESTER }, (_, i) => {
                      const id = `${mapel}::${i}`;
                      return (
                        <Td key={i}>
                          <label className="sr-only" htmlFor={id}>
                            Nilai {mapel} semester {i + 1}
                          </label>
                          <input
                            id={id}
                            name={id}
                            inputMode="decimal"
                            maxLength={5}
                            defaultValue={akademik[mapel]?.[i] ?? ""}
                            placeholder={i === 3 ? "opsional" : "0–100"}
                            className="h-10 w-24 rounded-lg border border-navy-100 bg-white px-3 text-sm text-navy-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-navy-400 focus:ring-4 focus:ring-navy-100"
                          />
                        </Td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          <p className="border-t border-line px-5 py-4 text-xs leading-relaxed text-muted sm:px-6">
            Khusus siswa akselerasi, kolom Semester 4 boleh dikosongkan. Jangan
            lupa menambahkan keterangan <b className="text-navy-800">AKSELARASI</b>{" "}
            saat mengunggah berkas rapor pada menu Kelengkapan Dokumen.
          </p>
        </CardBody>
      </Card>
    </FormPendaftaran>
  );
}
