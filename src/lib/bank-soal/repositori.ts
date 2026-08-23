import { bacaJson, cobaSimpan, tulisJson } from "@/lib/penyimpanan";
import { daftarSemuaPaket, getPaket } from "@/lib/paket-tryout";
import {
  isSubject,
  validasiSoal,
  type Difficulty,
  type Soal,
  type Subject,
} from "@/lib/bank-soal/skema";

/**
 * Repositori bank soal berbasis berkas JSON (satu berkas per paket).
 *
 * Lapisan ini sengaja dipisah dari pemakainya sehingga penggantian ke database
 * sungguhan cukup mengganti isi file ini tanpa menyentuh halaman maupun engine
 * ujian. Operasi tulis hanya berjalan pada lingkungan dengan sistem berkas yang
 * dapat ditulis (pengembangan lokal); pada hosting read-only operasi tulis
 * mengembalikan kegagalan yang jelas, sementara operasi baca tetap normal.
 *
 * Modul ini hanya boleh diimpor dari Server Component atau Server Action.
 */



export type HasilTulis = { ok: true } | { ok: false; pesan: string };

function kunciPaket(paketId: string) {
  return `bank-soal/${paketId}.json`;
}

async function paketDikenal(paketId: string) {
  return (await daftarSemuaPaket()).some((paket) => paket.id === paketId);
}

/** Membaca seluruh soal satu paket, termasuk yang nonaktif. */
export async function bacaPaket(paketId: string): Promise<Soal[]> {
  if (!(await paketDikenal(paketId))) return [];

  const mentah = await bacaJson<unknown>(kunciPaket(paketId));
  if (!Array.isArray(mentah)) return [];

  const soal: Soal[] = [];
  for (const butir of mentah) {
    const hasil = validasiSoal(butir as Partial<Soal>);
    if (hasil.ok) soal.push(hasil.soal);
    else {
      console.error(
        `Bank soal ${paketId}: butir dilewati (${(butir as { id?: string })?.id ?? "tanpa id"}) — ${hasil.masalah.join("; ")}`,
      );
    }
  }

  return soal.sort(
    (a, b) =>
      a.subject.localeCompare(b.subject) || a.question_order - b.question_order,
  );
}

export async function bacaSemua(): Promise<Soal[]> {
  const paket = await daftarSemuaPaket();
  const perPaket = await Promise.all(paket.map((item) => bacaPaket(item.id)));
  return perPaket.flat();
}

async function tulisPaket(paketId: string, soal: Soal[]): Promise<HasilTulis> {
  const urut = [...soal].sort(
    (a, b) =>
      a.subject.localeCompare(b.subject) || a.question_order - b.question_order,
  );

  const hasil = await cobaSimpan(
    () => tulisJson(kunciPaket(paketId), urut),
    "Gagal menyimpan bank soal.",
  );
  return hasil.ok ? { ok: true } : { ok: false, pesan: hasil.pesan };
}

/* ------------------------------- Pembacaan -------------------------------- */

export type FilterSoal = {
  paketId?: string;
  subject?: Subject;
  difficulty?: Difficulty;
  category?: string;
  /** true = hanya soal aktif */
  aktifSaja?: boolean;
  /** Pencarian pada teks pertanyaan */
  cari?: string;
};

export async function daftarSoal(filter: FilterSoal = {}): Promise<Soal[]> {
  const sumber = filter.paketId
    ? await bacaPaket(filter.paketId)
    : await bacaSemua();

  const cari = filter.cari?.trim().toLowerCase();

  return sumber.filter((soal) => {
    if (filter.subject && soal.subject !== filter.subject) return false;
    if (filter.difficulty && soal.difficulty !== filter.difficulty) return false;
    if (filter.category && soal.category !== filter.category) return false;
    if (filter.aktifSaja && !soal.active) return false;
    if (cari && !soal.question.toLowerCase().includes(cari)) return false;
    return true;
  });
}

export async function ambilSoalById(id: string): Promise<Soal | null> {
  const semua = await bacaSemua();
  return semua.find((soal) => soal.id === id) ?? null;
}

/** Nomor urut berikutnya untuk kombinasi paket + mata uji. */
export async function urutanBerikutnya(paketId: string, subject: Subject) {
  const soal = await daftarSoal({ paketId, subject });
  return soal.reduce((maks, butir) => Math.max(maks, butir.question_order), 0) + 1;
}

/* ---------------------------------- CRUD ---------------------------------- */

export type HasilCrud =
  | { ok: true; soal: Soal }
  | { ok: false; masalah: string[] };

function buatId(paketId: string, subject: Subject, urutan: number) {
  const kode: Record<Subject, string> = {
    "Bahasa Indonesia": "bin",
    IPA: "ipa",
    "Bahasa Inggris": "ing",
    Matematika: "mat",
  };
  const nomorPaket = paketId.replace(/[^0-9]/g, "") || "0";
  return `p${nomorPaket}-${kode[subject]}-${String(urutan).padStart(2, "0")}`;
}

export async function buatSoal(masukan: Partial<Soal>): Promise<HasilCrud> {
  const paketId = (masukan.package_id ?? "").trim();
  if (!paketDikenal(paketId)) {
    return { ok: false, masalah: [`package_id "${paketId}" tidak dikenal`] };
  }

  const subject = masukan.subject as Subject | undefined;
  if (!subject || !isSubject(subject)) {
    return { ok: false, masalah: ["subject tidak dikenal"] };
  }

  const urutan = masukan.question_order ?? (await urutanBerikutnya(paketId, subject));
  const id = masukan.id?.trim() || buatId(paketId, subject, urutan);

  // Sesi soal mengikuti penempatan mata uji pada konfigurasi paket.
  const paketKonfig = await getPaket(paketId);
  const session =
    paketKonfig?.sesi.find((sesi) =>
      sesi.mataUji.some((mata) => mata.subject === subject),
    )?.id ?? "sesi-1";

  const hasil = validasiSoal({ ...masukan, id, session, question_order: urutan });
  if (!hasil.ok) return { ok: false, masalah: hasil.masalah };

  const isiPaket = await bacaPaket(paketId);
  if (isiPaket.some((soal) => soal.id === hasil.soal.id)) {
    return { ok: false, masalah: [`id "${hasil.soal.id}" sudah dipakai`] };
  }
  if (
    isiPaket.some(
      (soal) =>
        soal.subject === hasil.soal.subject &&
        soal.question_order === hasil.soal.question_order,
    )
  ) {
    return {
      ok: false,
      masalah: [
        `question_order ${hasil.soal.question_order} sudah dipakai pada ${hasil.soal.subject} di paket ini`,
      ],
    };
  }

  const tulis = await tulisPaket(paketId, [...isiPaket, hasil.soal]);
  if (!tulis.ok) return { ok: false, masalah: [tulis.pesan] };
  return { ok: true, soal: hasil.soal };
}

export type HasilImpor = {
  tersimpan: number;
  gagal: { baris: number; masalah: string[] }[];
};

/**
 * Menyimpan banyak soal sekaligus (impor massal).
 * Nomor urut dilanjutkan dari soal terakhir tiap kombinasi paket + mata uji,
 * dan setiap berkas paket hanya ditulis satu kali.
 */
export async function buatBanyakSoal(
  masukan: (Partial<Soal> & { baris: number })[],
): Promise<HasilImpor> {
  const gagal: HasilImpor["gagal"] = [];
  const perPaket = new Map<string, (Partial<Soal> & { baris: number })[]>();

  for (const butir of masukan) {
    const paketId = (butir.package_id ?? "").trim();
    if (!paketDikenal(paketId)) {
      gagal.push({ baris: butir.baris, masalah: [`package_id "${paketId}" tidak dikenal`] });
      continue;
    }
    perPaket.set(paketId, [...(perPaket.get(paketId) ?? []), butir]);
  }

  let tersimpan = 0;

  for (const [paketId, daftar] of perPaket) {
    const isiPaket = await bacaPaket(paketId);
    const urutanTerpakai = new Map<string, number>();
    const idTerpakai = new Set(isiPaket.map((soal) => soal.id));

    for (const soal of isiPaket) {
      urutanTerpakai.set(
        soal.subject,
        Math.max(urutanTerpakai.get(soal.subject) ?? 0, soal.question_order),
      );
    }

    const baru: Soal[] = [];

    for (const butir of daftar) {
      const subject = butir.subject as Subject | undefined;
      if (!subject || !isSubject(subject)) {
        gagal.push({ baris: butir.baris, masalah: ["subject tidak dikenal"] });
        continue;
      }

      const urutan = (urutanTerpakai.get(subject) ?? 0) + 1;
      let id = buatId(paketId, subject, urutan);
      let pembeda = 1;
      while (idTerpakai.has(id)) {
        id = `${buatId(paketId, subject, urutan)}-${pembeda}`;
        pembeda += 1;
      }

      const hasil = validasiSoal({ ...butir, id, question_order: urutan });
      if (!hasil.ok) {
        gagal.push({ baris: butir.baris, masalah: hasil.masalah });
        continue;
      }

      urutanTerpakai.set(subject, urutan);
      idTerpakai.add(id);
      baru.push(hasil.soal);
    }

    if (baru.length === 0) continue;

    const tulis = await tulisPaket(paketId, [...isiPaket, ...baru]);
    if (!tulis.ok) {
      for (const butir of daftar) {
        gagal.push({ baris: butir.baris, masalah: [tulis.pesan] });
      }
      continue;
    }
    tersimpan += baru.length;
  }

  return { tersimpan, gagal };
}

export async function perbaruiSoal(
  id: string,
  perubahan: Partial<Soal>,
): Promise<HasilCrud> {
  const lama = await ambilSoalById(id);
  if (!lama) return { ok: false, masalah: [`Soal "${id}" tidak ditemukan`] };

  const gabungan: Partial<Soal> = {
    ...lama,
    ...perubahan,
    id: lama.id,
    package_id: lama.package_id,
  };

  const hasil = validasiSoal(gabungan);
  if (!hasil.ok) return { ok: false, masalah: hasil.masalah };

  const isiPaket = await bacaPaket(lama.package_id);
  const bentrok = isiPaket.some(
    (soal) =>
      soal.id !== id &&
      soal.subject === hasil.soal.subject &&
      soal.question_order === hasil.soal.question_order,
  );
  if (bentrok) {
    return {
      ok: false,
      masalah: [
        `question_order ${hasil.soal.question_order} sudah dipakai pada ${hasil.soal.subject} di paket ini`,
      ],
    };
  }

  const berikutnya = isiPaket.map((soal) => (soal.id === id ? hasil.soal : soal));
  const tulis = await tulisPaket(lama.package_id, berikutnya);
  if (!tulis.ok) return { ok: false, masalah: [tulis.pesan] };
  return { ok: true, soal: hasil.soal };
}

export async function setAktifSoal(id: string, active: boolean) {
  return perbaruiSoal(id, { active });
}

export async function hapusSoal(
  id: string,
): Promise<{ ok: true } | { ok: false; masalah: string[] }> {
  const lama = await ambilSoalById(id);
  if (!lama) return { ok: false, masalah: [`Soal "${id}" tidak ditemukan`] };

  const isiPaket = await bacaPaket(lama.package_id);
  const tulis = await tulisPaket(
    lama.package_id,
    isiPaket.filter((soal) => soal.id !== id),
  );
  if (!tulis.ok) return { ok: false, masalah: [tulis.pesan] };
  return { ok: true };
}
