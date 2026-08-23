"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { wajibSesi } from "@/lib/get-session";
import {
  buatSoal as repoBuat,
  hapusSoal as repoHapus,
  perbaruiSoal as repoPerbarui,
  setAktifSoal as repoSetAktif,
} from "@/lib/bank-soal/repositori";
import {
  HURUF_OPSI,
  isDifficulty,
  isHurufOpsi,
  isSubject,
  type Soal,
} from "@/lib/bank-soal/skema";

/**
 * Server Action CRUD bank soal (khusus admin).
 * Seluruh validasi dan penulisan dilakukan pada lapisan repositori.
 */

export type FormSoalState = { masalah?: string[]; sukses?: string };

function bacaFormSoal(formData: FormData): Partial<Soal> {
  const teks = (nama: string) => String(formData.get(nama) ?? "").trim();

  const subject = teks("subject");
  const difficulty = teks("difficulty");
  const correct = teks("correct_answer");
  const urutan = Number(formData.get("question_order"));

  const gambarSrc = teks("image_src");
  const gambarAlt = teks("image_alt");
  const gambarKeterangan = teks("image_keterangan");

  return {
    package_id: teks("package_id"),
    subject: isSubject(subject) ? subject : undefined,
    category: teks("category"),
    question: teks("question"),
    options: Object.fromEntries(
      HURUF_OPSI.map((huruf) => [huruf, teks(`option_${huruf}`)]),
    ) as Soal["options"],
    correct_answer: isHurufOpsi(correct) ? correct : undefined,
    difficulty: isDifficulty(difficulty) ? difficulty : undefined,
    explanation: teks("explanation"),
    question_order: Number.isFinite(urutan) && urutan > 0 ? urutan : undefined,
    active: formData.get("active") !== null,
    image: gambarSrc
      ? {
          src: gambarSrc,
          alt: gambarAlt,
          keterangan: gambarKeterangan || undefined,
        }
      : undefined,
  };
}

export async function buatSoalAksi(
  _prevState: FormSoalState,
  formData: FormData,
): Promise<FormSoalState> {
  await wajibSesi("admin");

  const hasil = await repoBuat(bacaFormSoal(formData));
  if (!hasil.ok) return { masalah: hasil.masalah };

  revalidatePath("/admin/bank-soal");
  revalidatePath("/admin/bank-soal/daftar");
  revalidatePath("/ujian", "layout");
  redirect(
    `/admin/bank-soal/daftar?paket=${hasil.soal.package_id}&subject=${encodeURIComponent(hasil.soal.subject)}&dibuat=${hasil.soal.id}`,
  );
}

export async function perbaruiSoalAksi(
  id: string,
  _prevState: FormSoalState,
  formData: FormData,
): Promise<FormSoalState> {
  await wajibSesi("admin");

  const hasil = await repoPerbarui(id, bacaFormSoal(formData));
  if (!hasil.ok) return { masalah: hasil.masalah };

  revalidatePath("/admin/bank-soal");
  revalidatePath("/admin/bank-soal/daftar");
  revalidatePath(`/admin/bank-soal/${id}`);
  revalidatePath("/ujian", "layout");
  redirect(
    `/admin/bank-soal/daftar?paket=${hasil.soal.package_id}&subject=${encodeURIComponent(hasil.soal.subject)}&diperbarui=${hasil.soal.id}`,
  );
}

export async function ubahStatusAktifAksi(id: string, aktif: boolean) {
  await wajibSesi("admin");
  const hasil = await repoSetAktif(id, aktif);
  revalidatePath("/admin/bank-soal");
  revalidatePath("/admin/bank-soal/daftar");
  revalidatePath("/ujian", "layout");
  return hasil.ok ? { ok: true as const } : { ok: false as const, masalah: hasil.masalah };
}

export async function hapusSoalAksi(id: string) {
  await wajibSesi("admin");
  const hasil = await repoHapus(id);
  revalidatePath("/admin/bank-soal");
  revalidatePath("/admin/bank-soal/daftar");
  revalidatePath("/ujian", "layout");
  return hasil.ok ? { ok: true as const } : { ok: false as const, masalah: hasil.masalah };
}
