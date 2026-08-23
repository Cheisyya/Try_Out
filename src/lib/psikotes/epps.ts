import { DIMENSI_EPPS, type DimensiEpps, type PasanganEpps } from "@/lib/psikotes/tipe";

/**
 * Bank pernyataan EPPS (Edward Personal Preference Schedule) versi latihan.
 *
 * Bentuk aslinya memaksa peserta memilih satu dari dua pernyataan yang
 * sama-sama masuk akal, sehingga ia tidak dapat "menjawab yang bagus" pada
 * kedua-duanya. Yang terukur bukan benar-salah, melainkan mana yang lebih kuat
 * ketika dua dorongan dibenturkan.
 *
 * Lima dimensi di sini mengikuti aspek yang dinilai pada seleksi SMA Taruna
 * Nusantara: kepemimpinan, disiplin, tanggung jawab, ketekunan, kemandirian.
 * EPPS yang sesungguhnya memakai 15 kebutuhan psikologis dan hanya boleh
 * ditafsirkan psikolog; versi ini semata alat berlatih agar peserta terbiasa
 * dengan bentuk soalnya.
 *
 * ## Penjadwalan pasangan
 *
 * Dari 5 dimensi ada 10 kemungkinan pasangan. Setiap pasangan muncul dua kali,
 * jadi 20 butir dan setiap dimensi memperoleh tepat 8 kesempatan dipilih.
 * Keseimbangan ini penting: tanpa itu, dimensi yang lebih sering muncul akan
 * selalu tampak paling menonjol pada profil, semata karena kesempatannya lebih
 * banyak.
 *
 * Sisi kiri/kanan juga digilir supaya kebiasaan memilih pilihan pertama tidak
 * memihak satu dimensi tertentu.
 */

/** Singkatan dimensi, dipakai agar tabel pasangan tetap terbaca sebaris. */
const DIM = {
  P: DIMENSI_EPPS[0], // Kepemimpinan
  D: DIMENSI_EPPS[1], // Disiplin
  T: DIMENSI_EPPS[2], // Tanggung Jawab
  K: DIMENSI_EPPS[3], // Ketekunan
  M: DIMENSI_EPPS[4], // Kemandirian
} as const satisfies Record<string, DimensiEpps>;

export type KodeDimensi = keyof typeof DIM;

/** Satu baris tabel: teks A, dimensi A, teks B, dimensi B. */
export type BarisPasangan = readonly [string, KodeDimensi, string, KodeDimensi];

export function susun(baris: readonly BarisPasangan[]): PasanganEpps[] {
  return baris.map(([teksA, dimA, teksB, dimB], i) => ({
    nomor: i + 1,
    a: { teks: teksA, dimensi: DIM[dimA] },
    b: { teks: teksB, dimensi: DIM[dimB] },
  }));
}

/**
 * Memeriksa keseimbangan sebuah set: setiap dimensi harus muncul sama banyak.
 *
 * Dipanggil saat modul dimuat sehingga kekeliruan penyusunan ketahuan pada saat
 * pengembangan, bukan setelah peserta menerima profil yang berat sebelah.
 */
export function periksaSeimbang(nama: string, daftar: PasanganEpps[]): PasanganEpps[] {
  const hitung = new Map<DimensiEpps, number>();
  for (const butir of daftar) {
    hitung.set(butir.a.dimensi, (hitung.get(butir.a.dimensi) ?? 0) + 1);
    hitung.set(butir.b.dimensi, (hitung.get(butir.b.dimensi) ?? 0) + 1);
  }

  const nilai = DIMENSI_EPPS.map((dimensi) => hitung.get(dimensi) ?? 0);
  if (new Set(nilai).size > 1) {
    console.error(
      `EPPS ${nama}: kesempatan tiap dimensi tidak sama —`,
      Object.fromEntries(DIMENSI_EPPS.map((d, i) => [d, nilai[i]])),
    );
  }
  return daftar;
}

/* -------------------------------------------------------------------------- */
/*                                  Paket 1                                   */
/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_1 = periksaSeimbang(
  "paket 1",
  susun([
    ["Saya senang ditunjuk memimpin kerja kelompok.", "P",
     "Saya menyusun jadwal harian dan berusaha menaatinya.", "D"],

    ["Saya mengulang latihan soal yang sama sampai benar-benar bisa.", "K",
     "Saya menyelesaikan tugas yang sudah saya sanggupi meskipun ternyata berat.", "T"],

    ["Saya mencari jawaban sendiri lebih dahulu sebelum bertanya kepada orang lain.", "M",
     "Saya merapikan meja belajar sebelum mulai mengerjakan tugas.", "D"],

    ["Saya berani menyampaikan pendapat di depan banyak orang.", "P",
     "Saya mengakui kesalahan saya tanpa mencari-cari alasan.", "T"],

    ["Saya bertahan mengerjakan tugas yang sulit sampai selesai.", "K",
     "Saya mengurus keperluan saya sendiri tanpa dibantu orang lain.", "M"],

    ["Saya menanggung sendiri akibat dari keputusan yang saya ambil.", "T",
     "Saya datang lebih awal daripada waktu yang ditentukan.", "D"],

    ["Saya suka mengatur pembagian tugas di dalam regu.", "P",
     "Saya tidak berhenti mengerjakan sesuatu walau hasilnya belum terlihat.", "K"],

    ["Saya memutuskan sendiri kegiatan yang akan saya ikuti.", "M",
     "Saya menepati janji kepada teman walaupun merepotkan saya.", "T"],

    ["Saya menyiapkan perlengkapan sekolah pada malam sebelumnya.", "D",
     "Saya rela berlatih berbulan-bulan demi satu tujuan.", "K"],

    ["Saya nyaman pergi ke tempat baru seorang diri.", "M",
     "Saya bersedia menjadi juru bicara kelompok saat menghadap guru.", "P"],

    ["Saya mengikuti aturan asrama meskipun tidak ada yang mengawasi.", "D",
     "Saya senang mengarahkan teman yang belum paham tugasnya.", "P"],

    ["Saya memperbaiki pekerjaan saya yang merugikan kelompok.", "T",
     "Saya menyelesaikan buku yang saya mulai sampai halaman terakhir.", "K"],

    ["Saya menyimpan barang selalu di tempat yang sama.", "D",
     "Saya lebih suka menyelesaikan masalah saya tanpa melibatkan orang lain.", "M"],

    ["Saya menjaga barang pinjaman lebih hati-hati daripada barang sendiri.", "T",
     "Saya mengambil keputusan ketika kelompok saya buntu.", "P"],

    ["Saya memilih cita-cita berdasarkan pertimbangan saya sendiri.", "M",
     "Saya mencoba lagi setelah gagal beberapa kali.", "K"],

    ["Saya membuat daftar langkah sebelum mengerjakan pekerjaan besar.", "D",
     "Saya melapor kepada pembina bila saya melakukan pelanggaran.", "T"],

    ["Saya betah mengerjakan pekerjaan yang menuntut ketelitian lama.", "K",
     "Saya suka memimpin barisan saat upacara.", "P"],

    ["Saya mengerjakan bagian saya tanpa perlu ditagih siapa pun.", "T",
     "Saya mengatur sendiri uang saku untuk keperluan saya.", "M"],

    ["Saya tidur dan bangun pada jam yang sama setiap hari.", "D",
     "Saya terus berlatih fisik meskipun badan sudah terasa lelah.", "K"],

    ["Saya lebih suka mengerjakan tugas sendiri daripada bersama orang lain.", "M",
     "Saya senang mengajak teman melakukan kegiatan yang saya rencanakan.", "P"],
  ]),
);

/* -------------------------------------------------------------------------- */
/*                                  Paket 2                                   */
/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_2 = periksaSeimbang(
  "paket 2",
  susun([
    ["Saya membereskan kamar sebelum berangkat, sesibuk apa pun pagi itu.", "D",
     "Saya berani menegur teman yang melanggar aturan regu.", "P"],

    ["Saya menyelesaikan pekerjaan rumah lebih dahulu sebelum bermain.", "T",
     "Saya sanggup mengerjakan satu soal berjam-jam sampai ketemu jawabannya.", "K"],

    ["Saya menyiapkan sendiri bekal dan pakaian saya setiap hari.", "M",
     "Saya menaruh kembali alat ke tempatnya setelah dipakai.", "D"],

    ["Saya siap dimintai pertanggungjawaban atas hasil kerja regu saya.", "T",
     "Saya senang menyusun rencana kegiatan untuk teman-teman saya.", "P"],

    ["Saya menyelesaikan latihan yang sudah saya mulai walau tidak diperiksa guru.", "K",
     "Saya berusaha memecahkan kesulitan saya sendiri lebih dahulu.", "M"],

    ["Saya mengerjakan piket sesuai giliran tanpa diingatkan.", "T",
     "Saya mengikuti jadwal belajar yang sudah saya tetapkan.", "D"],

    ["Saya bersedia maju lebih dahulu ketika belum ada yang berani.", "P",
     "Saya mengerjakan tugas yang membosankan sampai tuntas.", "K"],

    ["Saya menentukan sendiri cara belajar yang cocok untuk saya.", "M",
     "Saya menepati kesepakatan yang sudah saya buat dengan kelompok.", "T"],

    ["Saya memeriksa ulang pekerjaan saya sebelum dikumpulkan.", "D",
     "Saya berlatih hal yang sama berulang-ulang sampai gerakannya benar.", "K"],

    ["Saya lebih suka menentukan jalan saya sendiri daripada mengikuti kebanyakan orang.", "M",
     "Saya senang diberi kepercayaan memimpin kegiatan.", "P"],

    ["Saya mengenakan seragam lengkap dan rapi meski tidak ada pemeriksaan.", "D",
     "Saya menjadi penengah ketika teman-teman berselisih pendapat.", "P"],

    ["Saya mengganti barang teman yang rusak karena kelalaian saya.", "T",
     "Saya menyelesaikan program latihan sampai jadwal terakhir.", "K"],

    ["Saya menyusun catatan pelajaran dengan rapi dan berurutan.", "D",
     "Saya mengerjakan tugas tanpa menunggu diajak teman.", "M"],

    ["Saya berterus terang bila hasil kerja saya belum selesai.", "T",
     "Saya mengambil alih pimpinan saat keadaan menjadi kacau.", "P"],

    ["Saya menanggung sendiri risiko pilihan yang saya buat.", "M",
     "Saya tetap tekun berlatih meskipun teman-teman sudah menyerah.", "K"],

    ["Saya mengatur waktu agar tidak ada tugas yang terlambat.", "D",
     "Saya menyampaikan sendiri kesalahan saya kepada guru sebelum ketahuan.", "T"],

    ["Saya sanggup menghafal materi panjang dengan mengulangnya tiap hari.", "K",
     "Saya berani memberi usul di rapat kelas.", "P"],

    ["Saya menyelesaikan urusan saya tanpa merepotkan orang tua.", "M",
     "Saya menuntaskan tugas yang sudah dipercayakan kepada saya.", "T"],

    ["Saya menjaga kebersihan tempat tidur setiap pagi.", "D",
     "Saya terus mencoba cara lain ketika satu cara gagal.", "K"],

    ["Saya lebih tenang bekerja sendiri daripada dalam kelompok besar.", "M",
     "Saya senang memberi semangat kepada regu yang sedang lemah.", "P"],
  ]),
);

/* -------------------------------------------------------------------------- */
/*                                  Paket 3                                   */
/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_3 = periksaSeimbang(
  "paket 3",
  susun([
    ["Saya mengatur langkah kerja kelompok agar semua kebagian tugas.", "P",
     "Saya bangun pagi tanpa perlu dibangunkan siapa pun.", "D"],

    ["Saya mengerjakan tugas sampai selesai walau harus mengurangi waktu istirahat.", "K",
     "Saya bersedia disalahkan atas keputusan yang saya ambil untuk kelompok.", "T"],

    ["Saya memperbaiki barang saya sendiri sebelum meminta bantuan.", "M",
     "Saya mengembalikan buku ke rak sesuai urutannya.", "D"],

    ["Saya mau berbicara mewakili kelas dalam pertemuan resmi.", "P",
     "Saya menyelesaikan tanggungan saya sebelum meminta izin pergi.", "T"],

    ["Saya berlatih menghadapi kelemahan saya secara rutin.", "K",
     "Saya menyusun rencana masa depan saya tanpa bergantung pada orang lain.", "M"],

    ["Saya menjaga nama baik regu dengan tidak melanggar aturan.", "T",
     "Saya menyelesaikan kegiatan tepat pada waktu yang dijadwalkan.", "D"],

    ["Saya mengajak teman bergerak ketika tidak ada yang memulai.", "P",
     "Saya tetap mengerjakan bagian yang sulit walau bisa saya lewati.", "K"],

    ["Saya mengambil keputusan penting setelah menimbang sendiri.", "M",
     "Saya menepati waktu janji temu dengan siapa pun.", "T"],

    ["Saya menyiapkan bahan pelajaran sebelum pelajaran dimulai.", "D",
     "Saya mengulang hafalan setiap hari sampai benar-benar melekat.", "K"],

    ["Saya sanggup menjalani kegiatan yang saya pilih tanpa ditemani.", "M",
     "Saya bersedia memimpin doa atau apel di depan barisan.", "P"],

    ["Saya menaati larangan meskipun teman-teman melanggarnya.", "D",
     "Saya memberi contoh lebih dahulu sebelum meminta teman melakukannya.", "P"],

    ["Saya mengakui bila hasil kerja saya kurang baik.", "T",
     "Saya menyelesaikan pekerjaan bertahap sampai bagian terakhir.", "K"],

    ["Saya menaruh perlengkapan pada tempat yang sudah saya tentukan.", "D",
     "Saya mencari sendiri jalan keluar sebelum mengadu kepada orang lain.", "M"],

    ["Saya menerima hukuman atas pelanggaran yang saya lakukan.", "T",
     "Saya mengatur teman-teman ketika keadaan tidak tertib.", "P"],

    ["Saya menentukan sendiri batas kemampuan yang ingin saya lampaui.", "M",
     "Saya melanjutkan usaha meskipun sudah gagal berkali-kali.", "K"],

    ["Saya mencatat semua tugas agar tidak ada yang terlewat.", "D",
     "Saya menyelesaikan pekerjaan yang ditinggalkan teman satu regu.", "T"],

    ["Saya bertahan pada latihan berat sampai jadwalnya berakhir.", "K",
     "Saya berani mengambil tanggung jawab yang orang lain hindari.", "P"],

    ["Saya menuntaskan janji saya walaupun keadaan berubah.", "T",
     "Saya mengurus pendaftaran dan keperluan sekolah saya sendiri.", "M"],

    ["Saya membiasakan olahraga pada jam yang tetap setiap hari.", "D",
     "Saya tetap belajar walau tidak ada ulangan dalam waktu dekat.", "K"],

    ["Saya lebih puas menyelesaikan pekerjaan dengan usaha sendiri.", "M",
     "Saya senang menggerakkan teman-teman untuk mencapai satu tujuan.", "P"],
  ]),
);
