import { NextResponse } from "next/server";

import { getSession } from "@/lib/get-session";
import { KATEGORI } from "@/lib/bank-soal/skema";
import { buatTemplateExcel } from "@/lib/import/excel";
import { daftarSemuaPaket, sesiTerurut } from "@/lib/paket-tryout";

/** Mengunduh template Excel impor soal. Hanya untuk admin. */
export async function GET() {
  const sesi = await getSession();
  if (sesi?.role !== "admin") {
    return new NextResponse("Tidak diizinkan", { status: 403 });
  }

  const semua = await daftarSemuaPaket();
  const paket = semua[0];
  const sesiPertama = paket ? sesiTerurut(paket)[0] : undefined;
  const subject = sesiPertama?.mataUji[0]?.subject ?? "Bahasa Indonesia";

  const buffer = await buatTemplateExcel({
    subject,
    category: KATEGORI[subject][0],
    kategoriPerSubject: KATEGORI,
  });

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="template-import-bank-soal.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
