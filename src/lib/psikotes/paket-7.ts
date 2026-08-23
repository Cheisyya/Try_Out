import { EPPS_PAKET_7 } from "@/lib/psikotes/epps-lanjutan";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 7.
 *
 * Penalaran bertingkat. Sebagian besar butir tidak dapat diselesaikan dalam
 * satu langkah: kesimpulannya harus dirangkai dari dua keterangan, dan pola
 * gambarnya dibentuk oleh dua aturan yang bekerja bersamaan.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_7: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari INTERVENSI adalah ...",
    opsi: { A: "Campur tangan", B: "Perundingan", C: "Pengawasan", D: "Penolakan" },
    kunci: "A",
    pembahasan:
      "Intervensi berarti turut campur dalam urusan pihak lain. Perundingan adalah pembicaraan bersama, pengawasan hanya mengamati, dan penolakan berarti menolak — ketiganya tidak menyentuh unsur campur tangan.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata KONKRET adalah ...",
    opsi: { A: "Nyata", B: "Abstrak", C: "Padat", D: "Jelas" },
    kunci: "B",
    pembahasan:
      "Konkret berarti berwujud dan dapat diamati; lawannya abstrak, yang hanya ada dalam pikiran. Nyata dan jelas justru bersinonim dengan konkret, sedangkan padat menyangkut wujud benda.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "AIR : HAUS = MAKANAN : ...",
    opsi: { A: "Lapar", B: "Perut", C: "Piring", D: "Kenyang" },
    kunci: "A",
    pembahasan:
      "Hubungannya adalah sesuatu dengan keadaan yang menuntutnya. Air dibutuhkan ketika haus, makanan dibutuhkan ketika lapar. Kenyang adalah keadaan sesudahnya, bukan yang menuntut.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "BENIH : TANAMAN = TELUR : ...",
    opsi: { A: "Sarang", B: "Ayam", C: "Induk", D: "Cangkang" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah bakal dengan makhluk yang kelak terbentuk darinya. Benih menjadi tanaman, telur menjadi ayam. Sarang adalah tempatnya, cangkang bagiannya, dan induk justru yang menghasilkannya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Semua siswa kelas IX mengikuti bimbingan. Sebagian yang mengikuti bimbingan lulus seleksi. Kesimpulan yang PASTI benar adalah ...",
    opsi: {
      A: "Semua siswa kelas IX lulus seleksi",
      B: "Sebagian siswa kelas IX lulus seleksi",
      C: "Sebagian peserta bimbingan adalah siswa kelas IX",
      D: "Semua yang lulus seleksi adalah siswa kelas IX",
    },
    kunci: "C",
    pembahasan:
      "Seluruh siswa kelas IX berada di dalam kelompok peserta bimbingan, sehingga pasti ada peserta bimbingan yang merupakan siswa kelas IX. Pilihan B belum tentu benar: yang lulus mungkin seluruhnya berasal dari peserta bimbingan di luar kelas IX.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Jika hari libur, perpustakaan tutup. Jika perpustakaan tutup, Rina belajar di rumah. Hari ini Rina tidak belajar di rumah. Kesimpulannya ...",
    opsi: {
      A: "Hari ini libur",
      B: "Hari ini bukan hari libur",
      C: "Perpustakaan buka tetapi Rina tidak ke sana",
      D: "Tidak dapat disimpulkan",
    },
    kunci: "B",
    pembahasan:
      "Rantainya: hari libur → perpustakaan tutup → Rina belajar di rumah. Karena ujung rantai tidak terjadi, seluruh mata rantai sebelumnya juga tidak terjadi, sehingga hari ini bukan hari libur.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Bimbang", B: "Ragu", C: "Yakin", D: "Sangsi" },
    kunci: "C",
    pembahasan:
      "Bimbang, ragu, dan sangsi sama-sama menyatakan ketidakpastian. Yakin justru kebalikannya, sehingga ia yang keluar dari kelompok.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan:
      'Makna ungkapan "Panjang tangan" adalah ...',
    opsi: {
      A: "Suka mengambil barang orang lain",
      B: "Suka menolong sesama",
      C: "Mempunyai banyak kenalan",
      D: "Bekerja dengan cepat",
    },
    kunci: "A",
    pembahasan:
      "Panjang tangan adalah ungkapan untuk kebiasaan mencuri atau mengambil milik orang lain. Pilihan B tergoda oleh kesan positif kata 'tangan', sedangkan C menunjuk ungkapan 'luas pergaulan'.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 1, 2, 4, 7, 11, 16, ...",
    opsi: { A: "20", B: "21", C: "22", D: "24" },
    kunci: "C",
    pembahasan:
      "Selisih antarsuku adalah 1, 2, 3, 4, 5 — bertambah satu tiap langkah — sehingga selisih berikutnya 6 dan 16 + 6 = 22.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 5, 10, 8, 16, 14, 28, 26, ...",
    opsi: { A: "24", B: "42", C: "52", D: "54" },
    kunci: "C",
    pembahasan:
      "Aturannya berselang: dikalikan dua, lalu dikurangi dua. Dari 5 → 10, 10 → 8, 8 → 16, 16 → 14, 14 → 28, 28 → 26, sehingga langkah berikutnya mengalikan dua: 26 × 2 = 52.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kolam diisi dua keran. Keran pertama mengisinya dalam 6 jam, keran kedua dalam 3 jam. Berapa lama bila keduanya dibuka bersamaan?",
    opsi: { A: "1,5 jam", B: "2 jam", C: "4,5 jam", D: "9 jam" },
    kunci: "B",
    pembahasan:
      "Dalam satu jam, keran pertama mengisi 1/6 kolam dan keran kedua 1/3 kolam, seluruhnya 1/6 + 2/6 = 3/6 = 1/2 kolam. Maka satu kolam penuh terisi dalam 2 jam. Menjumlahkan waktunya secara langsung selalu keliru pada soal semacam ini.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Umur ayah tiga kali umur anaknya. Lima tahun lagi umur ayah menjadi dua setengah kali umur anaknya. Berapa umur anak sekarang?",
    opsi: { A: "10 tahun", B: "12 tahun", C: "15 tahun", D: "20 tahun" },
    kunci: "C",
    pembahasan:
      "Misalkan umur anak a, maka umur ayah 3a. Lima tahun lagi: 3a + 5 = 2,5(a + 5), sehingga 3a + 5 = 2,5a + 12,5 dan 0,5a = 7,5, maka a = 15. Pemeriksaan: sekarang 15 dan 45; lima tahun lagi 20 dan 50, dan 50 memang 2,5 kali 20.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah barang dibeli Rp120.000 dan dijual dengan rugi 15%. Berapa harga jualnya?",
    opsi: { A: "Rp96.000", B: "Rp102.000", C: "Rp105.000", D: "Rp108.000" },
    kunci: "B",
    pembahasan:
      "Rugi 15% berarti harga jualnya 85% dari harga beli: 0,85 × 120.000 = 102.000. Jawaban 108.000 muncul bila persentasenya keliru dihitung 10%.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Perbandingan uang A, B, dan C adalah 2 : 3 : 5. Bila uang C Rp250.000, berapa jumlah uang ketiganya?",
    opsi: { A: "Rp400.000", B: "Rp450.000", C: "Rp500.000", D: "Rp550.000" },
    kunci: "C",
    pembahasan:
      "C menempati 5 bagian yang bernilai 250.000, sehingga satu bagian 50.000. Jumlah seluruhnya 2 + 3 + 5 = 10 bagian = 10 × 50.000 = 500.000.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Dari 25 siswa, nilai rata-rata 15 siswa pertama adalah 80 dan rata-rata 10 siswa sisanya 70. Berapa rata-rata seluruh kelas?",
    opsi: { A: "74", B: "75", C: "76", D: "78" },
    kunci: "C",
    pembahasan:
      "Jumlah nilainya 15 × 80 + 10 × 70 = 1.200 + 700 = 1.900, lalu dibagi 25 siswa menjadi 76. Merata-ratakan 80 dan 70 secara langsung akan memberi 75 dan itu keliru karena banyak siswanya tidak sama.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah persegi panjang berkeliling 60 cm dan panjangnya dua kali lebarnya. Berapa luasnya?",
    opsi: { A: "180 cm²", B: "200 cm²", C: "220 cm²", D: "240 cm²" },
    kunci: "B",
    pembahasan:
      "Misalkan lebar l, maka panjangnya 2l dan kelilingnya 2(l + 2l) = 6l = 60, sehingga l = 10 dan panjangnya 20. Luasnya 10 × 20 = 200 cm².",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segitiga",
        "segitiga@90",
        "segitiga@180",
        "persegi",
        "persegi@90",
        "persegi@180",
        "bintang",
        "bintang@90",
        "?",
      ],
    },
    opsi: {
      A: "Bintang diputar 180 derajat",
      B: "Bintang pada kedudukan semula",
      C: "Persegi diputar 180 derajat",
      D: "Bintang diputar 270 derajat",
    },
    opsiFigur: {
      A: "bintang@180",
      B: "bintang",
      C: "persegi@180",
      D: "bintang@270",
    },
    kunci: "A",
    pembahasan:
      "Bentuk ditentukan barisnya dan sudut putaran ditentukan kolomnya: 0, 90, lalu 180 derajat. Sel yang ditanyakan berada di baris bintang dan kolom ketiga.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "lingkaran",
        "lingkaran*2#separuh",
        "lingkaran*3#penuh",
        "lingkaran*4",
        "?",
      ],
    },
    opsi: {
      A: "Satu lingkaran terisi separuh",
      B: "Empat lingkaran terisi penuh",
      C: "Satu lingkaran bergaris",
      D: "Dua lingkaran bergaris",
    },
    opsiFigur: {
      A: "lingkaran#separuh",
      B: "lingkaran*4#penuh",
      C: "lingkaran",
      D: "lingkaran*2",
    },
    kunci: "A",
    pembahasan:
      "Dua aturan berjalan bersamaan. Jumlahnya bertambah satu sampai empat lalu kembali ke satu, sementara isinya berputar bergaris, separuh, penuh, bergaris, lalu separuh lagi. Sel kelima karena itu berisi satu lingkaran terisi separuh.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["persegi", "belahketupat", "persegi@45", "?"],
    },
    opsi: {
      A: "Belah ketupat diputar 45 derajat",
      B: "Persegi diputar 90 derajat",
      C: "Belah ketupat pada kedudukan semula",
      D: "Persegi pada kedudukan semula",
    },
    opsiFigur: {
      A: "belahketupat@45",
      B: "persegi@90",
      C: "belahketupat",
      D: "persegi",
    },
    kunci: "A",
    pembahasan:
      "Bentuknya berganti-ganti antara persegi dan belah ketupat, sementara setiap dua langkah sekali sudutnya bertambah 45 derajat. Sesudah persegi yang diputar 45 derajat, giliran belah ketupat yang juga diputar 45 derajat.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran*2",
        "lingkaran*3",
        "segienam*3",
        "segienam*2",
        "segienam",
        "bintang",
        "bintang*2",
        "?",
      ],
    },
    opsi: {
      A: "Tiga bintang",
      B: "Satu bintang",
      C: "Empat bintang",
      D: "Tiga segi enam",
    },
    opsiFigur: {
      A: "bintang*3",
      B: "bintang",
      C: "bintang*4",
      D: "segienam*3",
    },
    kunci: "A",
    pembahasan:
      "Baris pertama dan ketiga menaik, baris kedua menurun — arahnya berselang. Baris ketiga menaik dari satu ke dua, sehingga sel terakhir berisi tiga bintang.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "panah",
        "panah@90#penuh",
        "panah@180",
        "panah@270#penuh",
        "?",
      ],
    },
    opsi: {
      A: "Panah ke kanan bergaris",
      B: "Panah ke kanan terisi penuh",
      C: "Panah ke atas bergaris",
      D: "Panah ke bawah terisi penuh",
    },
    opsiFigur: {
      A: "panah",
      B: "panah#penuh",
      C: "panah@270",
      D: "panah@90#penuh",
    },
    kunci: "A",
    pembahasan:
      "Dua aturan berjalan bersamaan: sudutnya bertambah 90 derajat setiap langkah, dan isinya berselang antara bergaris dan penuh. Langkah kelima kembali ke 0 derajat dan giliran bergaris.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran", "segitiga#separuh", "lingkaran#penuh", "?"],
    },
    opsi: {
      A: "Segitiga bergaris",
      B: "Segitiga terisi penuh",
      C: "Lingkaran bergaris",
      D: "Segitiga terisi separuh",
    },
    opsiFigur: {
      A: "segitiga",
      B: "segitiga#penuh",
      C: "lingkaran",
      D: "segitiga#separuh",
    },
    kunci: "A",
    pembahasan:
      "Dua aturan berjalan sendiri-sendiri. Bentuknya berselang antara lingkaran dan segitiga, sehingga langkah keempat giliran segitiga. Isinya berputar bergaris, separuh, penuh, lalu kembali bergaris. Gabungan keduanya memberi segitiga bergaris.",
  },
  {
    nomor: 23,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "silang",
        "silang#penuh",
        "silang#separuh",
        "garis#separuh",
        "garis",
        "garis#penuh",
        "belahketupat#penuh",
        "belahketupat#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Belah ketupat bergaris",
      B: "Belah ketupat terisi penuh",
      C: "Belah ketupat terisi separuh",
      D: "Garis bergaris",
    },
    opsiFigur: {
      A: "belahketupat",
      B: "belahketupat#penuh",
      C: "belahketupat#separuh",
      D: "garis",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat ketiga cara pengisian tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memakai penuh dan separuh, sehingga tersisa bergaris.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["garis", "garis@60", "garis@120", "?"],
    },
    opsi: {
      A: "Garis mendatar",
      B: "Garis diputar 150 derajat",
      C: "Garis tegak",
      D: "Garis diputar 30 derajat",
    },
    opsiFigur: {
      A: "garis",
      B: "garis@150",
      C: "garis@90",
      D: "garis@30",
    },
    kunci: "A",
    pembahasan:
      "Garis berputar 60 derajat setiap langkah: 0, 60, 120, lalu 180 derajat. Garis yang diputar 180 derajat kembali tampak mendatar seperti semula, karena garis tidak berujung arah.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_7: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran@45",
        "lingkaran@90",
        "segitiga",
        "segitiga@45",
        "segitiga@90",
        "panah",
        "panah@45",
        "?",
      ],
    },
    opsi: {
      A: "Panah diputar 90 derajat",
      B: "Panah pada kedudukan semula",
      C: "Panah diputar 135 derajat",
      D: "Segitiga diputar 90 derajat",
    },
    opsiFigur: {
      A: "panah@90",
      B: "panah",
      C: "panah@135",
      D: "segitiga@90",
    },
    kunci: "A",
    pembahasan:
      "Bentuk ditentukan barisnya dan sudut putaran ditentukan kolomnya: 0, 45, lalu 90 derajat. Sel yang ditanyakan berada di baris panah dan kolom ketiga.",
  },
  {
    nomor: 2,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "persegi",
        "persegi*2#separuh",
        "persegi*3#penuh",
        "persegi*4",
        "?",
      ],
    },
    opsi: {
      A: "Satu persegi terisi separuh",
      B: "Satu persegi bergaris",
      C: "Empat persegi terisi penuh",
      D: "Dua persegi terisi separuh",
    },
    opsiFigur: {
      A: "persegi#separuh",
      B: "persegi",
      C: "persegi*4#penuh",
      D: "persegi*2#separuh",
    },
    kunci: "A",
    pembahasan:
      "Jumlahnya bertambah sampai empat lalu berputar kembali ke satu, sementara isinya berputar bergaris, separuh, penuh, bergaris, lalu separuh. Dua aturan itu berjalan sendiri-sendiri dan harus diperiksa satu per satu.",
  },
  {
    nomor: 3,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["panah", "panah@60", "panah@120", "panah@180", "?"],
    },
    opsi: {
      A: "Panah diputar 240 derajat",
      B: "Panah diputar 270 derajat",
      C: "Panah mengarah ke kanan",
      D: "Panah diputar 210 derajat",
    },
    opsiFigur: {
      A: "panah@240",
      B: "panah@270",
      C: "panah",
      D: "panah@210",
    },
    kunci: "A",
    pembahasan:
      "Perputarannya tetap 60 derajat setiap langkah: 0, 60, 120, 180, lalu 240 derajat. Pilihan 270 derajat memakai besar putaran yang lain.",
  },
  {
    nomor: 4,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah panah serong kanan-atas dicerminkan terhadap garis tegak. Ke arah manakah bayangannya menghadap?",
    stimulus: { kolom: 2, sel: ["panah@315", "?"] },
    opsi: {
      A: "Serong kiri-atas",
      B: "Serong kanan-bawah",
      C: "Serong kiri-bawah",
      D: "Tetap serong kanan-atas",
    },
    opsiFigur: {
      A: "panah@225",
      B: "panah@45",
      C: "panah@135",
      D: "panah@315",
    },
    kunci: "A",
    pembahasan:
      "Cermin tegak menukar kiri dengan kanan sementara atas-bawah tidak tersentuh. Panah yang serong ke kanan-atas karena itu berbalik menjadi serong ke kiri-atas.",
  },
  {
    nomor: 5,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segitiga",
        "segitiga*2",
        "segitiga*4",
        "persegi",
        "persegi*2",
        "persegi*4",
        "bintang",
        "bintang*2",
        "?",
      ],
    },
    opsi: {
      A: "Tiga bintang",
      B: "Empat bintang",
      C: "Dua bintang",
      D: "Empat persegi",
    },
    opsiFigur: {
      A: "bintang*3",
      B: "bintang*4",
      C: "bintang*2",
      D: "persegi*4",
    },
    kunci: "B",
    pembahasan:
      "Jumlahnya berlipat dua pada setiap kolom: satu, dua, empat. Sel yang ditanyakan berada di baris bintang dan kolom ketiga, sehingga berisi empat bintang.",
  },
  {
    nomor: 6,
    kategori: "Analogi",
    pertanyaan:
      "Segitiga bergaris berbanding segitiga terbalik terisi penuh, sebagaimana persegi bergaris berbanding ...",
    stimulus: {
      kolom: 4,
      sel: ["segitiga", "segitiga@180#penuh", "persegi", "?"],
    },
    opsi: {
      A: "Persegi terisi penuh",
      B: "Persegi diputar 180 derajat dan terisi penuh",
      C: "Persegi diputar 180 derajat",
      D: "Belah ketupat terisi penuh",
    },
    opsiFigur: {
      A: "persegi#penuh",
      B: "persegi@180#penuh",
      C: "persegi@180",
      D: "belahketupat#penuh",
    },
    kunci: "B",
    pembahasan:
      "Dua perubahan terjadi sekaligus: diputar setengah putaran dan diisi penuh. Keduanya harus diterapkan pada persegi, bukan salah satunya saja.",
  },
  {
    nomor: 7,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan tiga lainnya?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga*2", "persegi*2", "bintang*3", "lingkaran*2"],
    },
    opsi: {
      A: "Dua segitiga",
      B: "Dua persegi",
      C: "Tiga bintang",
      D: "Dua lingkaran",
    },
    opsiFigur: {
      A: "segitiga*2",
      B: "persegi*2",
      C: "bintang*3",
      D: "lingkaran*2",
    },
    kunci: "C",
    pembahasan:
      "Tiga gambar lainnya sama-sama memuat dua lambang; hanya bintang yang memuat tiga. Bentuknya berbeda-beda pada keempat gambar, sehingga bentuk bukan pembedanya.",
  },
  {
    nomor: 8,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "segitiga",
        "segitiga#penuh",
        "persegi",
        "persegi#penuh",
        "segilima",
        "?",
      ],
    },
    opsi: {
      A: "Segi lima terisi penuh",
      B: "Segi lima bergaris",
      C: "Segi enam bergaris",
      D: "Persegi terisi penuh",
    },
    opsiFigur: {
      A: "segilima#penuh",
      B: "segilima",
      C: "segienam",
      D: "persegi#penuh",
    },
    kunci: "A",
    pembahasan:
      "Setiap bentuk muncul dua kali berturut-turut: sekali bergaris, sekali terisi penuh. Segi lima baru muncul sekali dalam keadaan bergaris, sehingga menyusul segi lima terisi penuh.",
  },
  {
    nomor: 9,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "panah",
        "panah@90",
        "panah@180",
        "panah@90",
        "panah@180",
        "panah@270",
        "panah@180",
        "panah@270",
        "?",
      ],
    },
    opsi: {
      A: "Panah mengarah ke kanan",
      B: "Panah mengarah ke atas",
      C: "Panah mengarah ke bawah",
      D: "Panah mengarah ke kiri",
    },
    opsiFigur: {
      A: "panah",
      B: "panah@270",
      C: "panah@90",
      D: "panah@180",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya bertambah 90 derajat ke arah kanan maupun ke arah bawah. Sesudah 270 derajat, putaran berikutnya genap satu lingkaran dan kembali ke 0 derajat, yaitu mengarah ke kanan.",
  },
  {
    nomor: 10,
    kategori: "Rotasi",
    pertanyaan:
      "Sebuah bangun diputar 120 derajat searah jarum jam sebanyak tiga kali. Bagaimana kedudukan akhirnya?",
    opsi: {
      A: "Kembali ke kedudukan semula",
      B: "Terputar 120 derajat",
      C: "Terputar 240 derajat",
      D: "Terbalik atas-bawah",
    },
    kunci: "A",
    pembahasan:
      "Tiga kali 120 derajat berjumlah 360 derajat, yaitu satu putaran penuh, sehingga bangun kembali persis ke kedudukan semula.",
  },
  {
    nomor: 11,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah bangun dicerminkan terhadap garis tegak lalu diputar 180 derajat. Perubahan itu setara dengan ...",
    opsi: {
      A: "Pencerminan terhadap garis mendatar",
      B: "Kembali ke kedudukan semula",
      C: "Perputaran 90 derajat",
      D: "Pencerminan terhadap garis tegak sekali lagi",
    },
    kunci: "A",
    pembahasan:
      "Pencerminan tegak menukar kiri-kanan; perputaran setengah putaran menukar kiri-kanan sekaligus atas-bawah. Gabungannya menyisakan penukaran atas-bawah saja, yaitu pencerminan terhadap garis mendatar.",
  },
  {
    nomor: 12,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran#penuh",
        "lingkaran#separuh",
        "lingkaran",
        "bintang",
        "bintang#penuh",
        "bintang#separuh",
        "silang#separuh",
        "silang",
        "?",
      ],
    },
    opsi: {
      A: "Silang terisi penuh",
      B: "Silang bergaris",
      C: "Silang terisi separuh",
      D: "Bintang terisi penuh",
    },
    opsiFigur: {
      A: "silang#penuh",
      B: "silang",
      C: "silang#separuh",
      D: "bintang#penuh",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat ketiga cara pengisian tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memakai separuh dan bergaris, sehingga tersisa terisi penuh.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_7: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Anda memimpin regu yang anggotanya jauh lebih berpengalaman daripada Anda. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menyerahkan seluruh keputusan kepada mereka",
      B: "Meminta pertimbangan mereka, lalu tetap mengambil keputusan dan menanggungnya",
      C: "Memutuskan sendiri agar tidak terlihat ragu",
      D: "Meminta pembina mengganti ketua regu",
    },
    kunci: "B",
    pembahasan:
      "Memanfaatkan pengalaman anggota tanpa melepaskan tanggung jawab adalah inti memimpin. Pilihan A melepaskan peran, C membuang keterangan berharga, dan D menyerah sebelum mencoba.",
  },
  {
    nomor: 2,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Anda menyadari keputusan yang Anda ambil kemarin merugikan regu. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menjelaskan keadaannya kepada regu, mengakui kekeliruan, dan mengusulkan perbaikan",
      B: "Menunggu apakah ada yang menyadarinya",
      C: "Menjelaskan bahwa keterangan yang Anda terima memang tidak lengkap",
      D: "Menyerahkan urusan itu kepada wakil ketua",
    },
    kunci: "A",
    pembahasan:
      "Mengakui dan mengusulkan perbaikan menghentikan kerugian selagi masih dapat diperkecil. Pilihan B membiarkan, C berhenti pada pembelaan tanpa perbaikan, dan D memindahkan akibat kepada orang lain.",
  },
  {
    nomor: 3,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Menjelang lomba, Anda gemetar dan sulit berkonsentrasi. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membatalkan keikutsertaan",
      B: "Mengatur napas, mengulang bagian yang sudah dikuasai, lalu memusatkan perhatian pada langkah pertama",
      C: "Memikirkan berulang-ulang kemungkinan gagal agar siap",
      D: "Meminta teman menggantikan Anda",
    },
    kunci: "B",
    pembahasan:
      "Gugup sebelum tampil adalah hal wajar; yang menolong adalah menenangkan tubuh dan mempersempit perhatian pada langkah terdekat. Pilihan C justru memperbesar kecemasan, sedangkan A dan D membatalkan kesempatan yang sudah disiapkan.",
  },
  {
    nomor: 4,
    kategori: "Kejujuran",
    pertanyaan:
      "Anda tidak sengaja merusak alat laboratorium dan tidak ada yang melihatnya. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Melaporkannya kepada guru beserta kesediaan menggantinya",
      B: "Mengembalikan alat itu ke tempatnya seperti semula",
      C: "Menunggu sampai ada yang menemukannya",
      D: "Memberitahu teman agar tidak memakainya",
    },
    kunci: "A",
    pembahasan:
      "Alat yang rusak dapat membahayakan pemakai berikutnya, sehingga melapor bukan sekadar soal kejujuran melainkan juga keselamatan. Pilihan B menyembunyikan kerusakan, C menunda, dan D hanya melindungi sebagian orang.",
  },
  {
    nomor: 5,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Anda menerima kabar buruk dari rumah tepat sebelum ujian dimulai. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Meninggalkan ruang ujian untuk menelepon rumah",
      B: "Memberi tahu pengawas secara singkat, lalu mengerjakan ujian sebaik mungkin dan menindaklanjutinya setelah selesai",
      C: "Mengerjakan ujian sambil terus memikirkannya",
      D: "Mengosongkan lembar jawaban karena tidak dapat berkonsentrasi",
    },
    kunci: "B",
    pembahasan:
      "Memberi tahu pengawas membuka kemungkinan bantuan bila keadaan memburuk, sementara ujian tetap dikerjakan pada waktunya. Pilihan A melanggar tata tertib, C membiarkan perhatian terpecah tanpa penyelesaian, dan D membuang hasil kerja tanpa mencoba.",
  },
  {
    nomor: 6,
    kategori: "Kerja Sama",
    pertanyaan:
      "Dalam kerja kelompok, satu anggota terus mengerjakan sendiri seluruh tugas tanpa membagi pekerjaan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membiarkannya karena hasilnya tetap selesai",
      B: "Membicarakannya dengan kelompok dan menyepakati pembagian yang jelas",
      C: "Ikut mengerjakan bagian yang sama agar tidak menganggur",
      D: "Melaporkannya kepada guru",
    },
    kunci: "B",
    pembahasan:
      "Pembagian yang disepakati bersama memperbaiki cara kerja kelompok sekaligus memberi ruang bagi setiap anggota. Pilihan A membiarkan beban timpang, C menyia-nyiakan tenaga, dan D melompat sebelum kelompok berusaha sendiri.",
  },
  {
    nomor: 7,
    kategori: "Menghadapi Kegagalan",
    pertanyaan:
      "Setelah dua kali gagal pada seleksi yang sama, Anda mulai ragu melanjutkan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Berhenti karena sudah dua kali gagal",
      B: "Menimbang kembali kesungguhan Anda, memeriksa apa yang belum diperbaiki, lalu memutuskan dengan sadar",
      C: "Mencoba lagi tanpa mengubah persiapan",
      D: "Beralih ke bidang lain agar tidak gagal lagi",
    },
    kunci: "B",
    pembahasan:
      "Keputusan melanjutkan atau berhenti sama-sama sah, asal diambil setelah memeriksa sebab kegagalan dan kesungguhan sendiri. Pilihan A dan D memutuskan tanpa pemeriksaan, sedangkan C mengulang cara yang sudah terbukti belum cukup.",
  },
  {
    nomor: 8,
    kategori: "Kepatuhan",
    pertanyaan:
      "Anda diminta menunggu di suatu tempat tanpa penjelasan, dan sudah satu jam berlalu. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Meninggalkan tempat karena tidak ada kejelasan",
      B: "Menunggu sambil menghubungi petugas untuk menanyakan keadaannya",
      C: "Menunggu terus tanpa bertanya sampai malam",
      D: "Mengajak teman lain ikut meninggalkan tempat",
    },
    kunci: "B",
    pembahasan:
      "Bertanya sambil tetap menunggu menghormati perintah tanpa membiarkan diri terkatung-katung. Pilihan A dan D melanggar perintah, sedangkan C patuh tetapi menutup jalan memperoleh kejelasan.",
  },
  {
    nomor: 9,
    kategori: "Kepedulian",
    pertanyaan:
      "Seorang teman meminjam uang berulang kali dan belum pernah mengembalikannya. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Terus meminjamkan agar ia tidak tersinggung",
      B: "Menagih dengan baik, dan menjelaskan bahwa Anda belum dapat meminjamkan lagi sebelum yang lama dilunasi",
      C: "Menghindarinya setiap kali ia mendekat",
      D: "Menceritakan kebiasaannya kepada teman-teman lain",
    },
    kunci: "B",
    pembahasan:
      "Menagih dengan baik sambil menetapkan batas menjaga hubungan sekaligus menghentikan kebiasaan yang merugikan. Pilihan A membiarkan berlanjut, C menghindari tanpa menyelesaikan, dan D membicarakannya di belakang.",
  },
  {
    nomor: 10,
    kategori: "Evaluasi Diri",
    pertanyaan:
      "Anda selalu merasa waktu belajar kurang padahal jam belajar Anda cukup panjang. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Menambah jam belajar lagi",
      B: "Mencatat pemakaian waktu selama beberapa hari untuk melihat ke mana waktunya sebenarnya pergi",
      C: "Mengurangi kegiatan di luar pelajaran",
      D: "Belajar sampai larut malam setiap hari",
    },
    kunci: "B",
    pembahasan:
      "Bila jam belajar sudah panjang tetapi hasilnya kurang, persoalannya kemungkinan besar pada mutu pemakaian waktu, bukan jumlahnya. Mencatat memberi keterangan yang diperlukan sebelum menambah apa pun.",
  },
  {
    nomor: 11,
    kategori: "Keberanian Moral",
    pertanyaan:
      "Anda mengetahui rencana teman-teman melanggar aturan asrama malam nanti. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Ikut serta agar tidak dijauhi",
      B: "Mengingatkan mereka akan akibatnya, dan bila tetap dijalankan melaporkannya kepada pengasuh",
      C: "Tidak ikut, tetapi juga tidak mengatakan apa pun",
      D: "Melaporkannya tanpa berbicara lebih dahulu",
    },
    kunci: "B",
    pembahasan:
      "Mengingatkan lebih dahulu memberi kesempatan membatalkan, dan melaporkan bila tetap dijalankan mencegah akibat yang lebih besar. Pilihan A ikut melanggar, C membiarkan, dan D melewatkan langkah yang lebih ringan.",
  },
  {
    nomor: 12,
    kategori: "Penyesuaian Diri",
    pertanyaan:
      "Anda dipindahkan ke regu baru yang kebiasaannya berbeda dengan regu lama. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengusulkan agar regu baru mengikuti kebiasaan regu lama",
      B: "Mempelajari kebiasaan regu baru lebih dahulu sebelum mengusulkan apa pun",
      C: "Bekerja sendiri menurut kebiasaan lama Anda",
      D: "Meminta dikembalikan ke regu lama",
    },
    kunci: "B",
    pembahasan:
      "Mengenali kebiasaan yang berlaku lebih dahulu membuat usul yang kelak Anda sampaikan lebih tepat sasaran dan lebih mudah diterima. Pilihan A mengubah sebelum memahami, C memencilkan diri, dan D menghindari penyesuaian sama sekali.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_7: PaketPsikotes = {
  id: "psi-7",
  nomor: 7,
  nama: "Try Out Psikotes 7",
  deskripsi:
    "Paket penalaran bertingkat. Kesimpulannya harus dirangkai dari dua keterangan, dan pola gambarnya dibentuk oleh dua aturan yang bekerja bersamaan.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_7,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Cari satu aturan yang berlaku untuk seluruh gambar, bukan yang hanya cocok untuk dua gambar pertama. Pada soal matriks, periksa polanya dari arah baris dan dari arah kolom — jawaban yang benar cocok dari kedua arah.",
      durasiMenit: 10,
      soal: VISUAL_7,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_7,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_7,
    },
  ],
};
