import type { SoalIq } from "@/lib/tes-iq/tipe";

/**
 * Tes IQ Latihan — Paket 3 (Menengah).
 *
 * Susunannya sama dengan dua paket sebelumnya — tujuh verbal, tujuh numerik,
 * enam logika, lima spasial — tetapi setiap butir menuntut satu langkah
 * tambahan: analogi bertingkat, deret dengan dua aturan berselang, penalaran
 * bersyarat, dan bangun ruang yang harus dibayangkan terlipat.
 *
 * Seluruh soal tetap dapat dikerjakan tanpa gambar; pola spasialnya ditulis
 * sebagai huruf atau lambang sederhana agar tetap terbaca di layar ponsel
 * maupun oleh pembaca layar.
 */
export const SOAL_PAKET_3: SoalIq[] = [
  /* --------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "TEPUNG : ROTI = BENANG : ...",
    opsi: { A: "Jarum", B: "Kain", C: "Jahit", D: "Kapas" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah bahan dengan barang jadi yang dihasilkannya. Tepung diolah menjadi roti, benang ditenun menjadi kain. Jarum adalah alat, menjahit adalah pekerjaannya, dan kapas justru bahan sebelum benang — arahnya terbalik satu langkah.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari MUTAKHIR adalah ...",
    opsi: { A: "Terakhir", B: "Terkini", C: "Terpencil", D: "Terpakai" },
    kunci: "B",
    pembahasan:
      "Mutakhir berarti paling baru atau paling maju pada saat ini, sehingga sinonimnya terkini. Terakhir menunjuk urutan, bukan kebaruan; terpencil menyangkut letak; dan terpakai menyangkut pemanfaatan.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "Lawan kata MAJEMUK adalah ...",
    opsi: { A: "Tunggal", B: "Banyak", C: "Rumit", D: "Beragam" },
    kunci: "A",
    pembahasan:
      "Majemuk berarti terdiri atas lebih dari satu bagian atau unsur, sehingga lawannya adalah tunggal. Banyak dan beragam justru searti dengan majemuk, sedangkan rumit menyangkut tingkat kesulitan, bukan jumlah unsur.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "GEMPA : SEISMOGRAF = SUHU : ...",
    opsi: { A: "Barometer", B: "Termometer", C: "Higrometer", D: "Anemometer" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah gejala dengan alat pengukurnya. Seismograf mengukur gempa, termometer mengukur suhu. Barometer mengukur tekanan udara, higrometer mengukur kelembapan, dan anemometer mengukur kecepatan angin.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Cemas", B: "Gembira", C: "Marah", D: "Menangis" },
    kunci: "D",
    pembahasan:
      "Cemas, gembira, dan marah adalah nama perasaan. Menangis adalah perbuatan yang tampak dari luar, bukan perasaannya sendiri — itulah yang membuatnya keluar dari kelompok. Perhatikan bahwa menangis dapat muncul dari ketiga perasaan tersebut sekaligus, jadi ia berada pada tingkatan yang berbeda.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Semua siswa yang menghafal rumus lulus ujian. Sebagian siswa yang lulus ujian memperoleh beasiswa. Kesimpulan yang PASTI benar adalah ...",
    opsi: {
      A: "Semua penghafal rumus memperoleh beasiswa",
      B: "Semua penerima beasiswa menghafal rumus",
      C: "Sebagian siswa yang lulus ujian menghafal rumus",
      D: "Tidak ada kesimpulan yang dapat ditarik",
    },
    kunci: "C",
    pembahasan:
      "Karena setiap penghafal rumus pasti lulus, kelompok penghafal rumus seluruhnya berada di dalam kelompok yang lulus. Jadi pasti ada — sekurang-kurangnya sebagian — siswa lulus yang menghafal rumus. Pilihan A dan B melompat: 'sebagian yang lulus memperoleh beasiswa' tidak menentukan siapa di antara mereka yang menghafal.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan:
      'Makna peribahasa "Air beriak tanda tak dalam" adalah ...',
    opsi: {
      A: "Orang yang banyak bicara biasanya sedikit ilmunya",
      B: "Orang yang pendiam menyimpan dendam",
      C: "Masalah kecil dapat menjadi besar",
      D: "Kebaikan akan berbalas kebaikan",
    },
    kunci: "A",
    pembahasan:
      "Sungai yang dangkal permukaannya beriak ramai, sedangkan yang dalam justru tenang. Kiasan itu menggambarkan orang yang banyak bicara tetapi dangkal ilmunya. Pilihan lain memakai peribahasa yang berbeda: 'diam-diam menghanyutkan' untuk B dan 'air susu dibalas air tuba' untuk D.",
  },

  /* -------------------------------- Numerik -------------------------------- */
  {
    nomor: 8,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["3, 6, 12, 24, 48, ..."],
    opsi: { A: "72", B: "84", C: "96", D: "108" },
    kunci: "C",
    pembahasan:
      "Setiap suku adalah dua kali suku sebelumnya: 3 → 6 → 12 → 24 → 48. Maka suku berikutnya 48 × 2 = 96. Jawaban 72 muncul bila polanya keliru dianggap penjumlahan 24, yang tidak berlaku pada suku-suku awal.",
  },
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berselang berikut.",
    pola: ["2, 5, 4, 10, 6, 20, 8, ..."],
    opsi: { A: "10", B: "16", C: "24", D: "40" },
    kunci: "D",
    pembahasan:
      "Deret ini terdiri atas dua deret yang berselang. Suku ganjil 2, 4, 6, 8 bertambah 2. Suku genap 5, 10, 20 dikalikan 2, sehingga suku genap berikutnya 20 × 2 = 40. Karena yang ditanyakan menempati urutan genap, jawabannya 40.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan:
      "Harga sebuah buku Rp48.000 setelah memperoleh potongan 20%. Berapa harga sebelum potongan?",
    opsi: { A: "Rp57.600", B: "Rp60.000", C: "Rp62.400", D: "Rp64.000" },
    kunci: "B",
    pembahasan:
      "Setelah potongan 20%, yang dibayar adalah 80% dari harga awal. Maka harga awal = 48.000 ÷ 0,8 = 60.000. Kesalahan yang lazim adalah menambahkan 20% pada 48.000 sehingga memperoleh 57.600 — itu keliru, karena persentase potongan dihitung dari harga awal, bukan dari harga setelah potongan.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Rata-rata nilai 5 siswa adalah 78. Setelah seorang siswa baru bergabung, rata-ratanya menjadi 80. Berapa nilai siswa baru itu?",
    opsi: { A: "82", B: "86", C: "88", D: "90" },
    kunci: "D",
    pembahasan:
      "Jumlah nilai lima siswa = 5 × 78 = 390. Jumlah nilai enam siswa = 6 × 80 = 480. Selisihnya, 480 - 390 = 90, adalah nilai siswa baru. Perhatikan bahwa nilainya harus jauh di atas 80 karena ia sendiri yang mengangkat rata-rata seluruh kelompok.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah pekerjaan dapat diselesaikan 6 orang dalam 12 hari. Berapa hari yang diperlukan bila dikerjakan 9 orang dengan kecepatan sama?",
    opsi: { A: "6 hari", B: "8 hari", C: "9 hari", D: "18 hari" },
    kunci: "B",
    pembahasan:
      "Banyak pekerja dan lama pengerjaan berbanding terbalik. Total pekerjaan = 6 × 12 = 72 hari-orang. Dengan 9 orang, waktunya 72 ÷ 9 = 8 hari. Jawaban 18 hari muncul bila perbandingannya keliru dianggap lurus.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan: "Berapakah 35% dari 240?",
    opsi: { A: "72", B: "78", C: "84", D: "96" },
    kunci: "C",
    pembahasan:
      "Cara tercepat memecahnya: 10% dari 240 adalah 24, jadi 30% adalah 72; 5% adalah separuh dari 10%, yaitu 12. Maka 35% = 72 + 12 = 84.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["1, 4, 9, 16, 25, ..."],
    opsi: { A: "30", B: "36", C: "40", D: "49" },
    kunci: "B",
    pembahasan:
      "Deret ini adalah kuadrat bilangan asli: 1², 2², 3², 4², 5². Suku berikutnya 6² = 36. Cara memeriksanya tanpa mengenali polanya: selisih antarsuku adalah 3, 5, 7, 9 — bertambah 2 tiap langkah — sehingga selisih berikutnya 11 dan 25 + 11 = 36.",
  },

  /* --------------------------------- Logika -------------------------------- */
  {
    nomor: 15,
    kategori: "Logika",
    pertanyaan:
      "Jika hari ini hujan, maka lapangan basah. Lapangan tidak basah. Kesimpulannya ...",
    opsi: {
      A: "Hari ini hujan",
      B: "Hari ini tidak hujan",
      C: "Lapangan sedang diperbaiki",
      D: "Tidak dapat disimpulkan",
    },
    kunci: "B",
    pembahasan:
      "Ini bentuk penyangkalan akibat: bila sebab selalu menimbulkan akibat, dan akibatnya tidak ada, maka sebabnya juga tidak ada. Karena lapangan tidak basah, hari ini tidak hujan. Pilihan C menambahkan keterangan yang tidak disebutkan di dalam soal.",
  },
  {
    nomor: 16,
    kategori: "Logika",
    pertanyaan:
      "Ani lebih tinggi daripada Budi. Citra lebih pendek daripada Budi. Dewi lebih tinggi daripada Ani. Siapakah yang paling pendek?",
    opsi: { A: "Ani", B: "Budi", C: "Citra", D: "Dewi" },
    kunci: "C",
    pembahasan:
      "Susun dari yang tertinggi: Dewi > Ani > Budi > Citra. Citra berada di ujung terpendek karena ia satu-satunya yang dinyatakan lebih pendek daripada Budi, sedangkan Budi sendiri sudah berada di bawah Ani dan Dewi.",
  },
  {
    nomor: 17,
    kategori: "Logika",
    pertanyaan:
      "Lima regu — P, Q, R, S, T — berbaris satu banjar. T tepat di depan Q, Q tepat di depan R, S paling belakang, dan P bukan yang pertama. Regu manakah yang berada di urutan pertama?",
    opsi: { A: "P", B: "Q", C: "R", D: "T" },
    kunci: "D",
    pembahasan:
      "T, Q, dan R merupakan satu blok berurutan. S menempati urutan kelima, sehingga blok bertiga itu hanya muat pada urutan 1-2-3 atau 2-3-4. Bila blok menempati 2-3-4, urutan pertama jatuh kepada P — dan itu dilarang. Maka blok menempati 1-2-3, P di urutan keempat, dan yang berada paling depan adalah T.",
  },
  {
    nomor: 18,
    kategori: "Logika",
    pertanyaan:
      "Tidak seorang pun taruna terlambat apel. Sebagian penghuni asrama adalah taruna. Kesimpulan yang PASTI benar adalah ...",
    opsi: {
      A: "Semua penghuni asrama tidak terlambat apel",
      B: "Sebagian penghuni asrama tidak terlambat apel",
      C: "Sebagian taruna terlambat apel",
      D: "Semua yang terlambat apel adalah penghuni asrama",
    },
    kunci: "B",
    pembahasan:
      "Sebagian penghuni asrama adalah taruna, dan tidak satu pun taruna terlambat. Maka sebagian penghuni asrama itu pasti tidak terlambat. Pilihan A terlalu jauh karena penghuni asrama yang bukan taruna tidak dibicarakan sama sekali, dan C bertentangan langsung dengan pernyataan pertama.",
  },
  {
    nomor: 19,
    kategori: "Logika",
    pertanyaan:
      "Dalam sebuah kelas, setiap siswa mengikuti sekurang-kurangnya satu klub. 18 siswa ikut klub sains, 15 ikut klub bahasa, dan 7 ikut keduanya. Berapa jumlah siswa di kelas itu?",
    opsi: { A: "26", B: "33", C: "40", D: "25" },
    kunci: "A",
    pembahasan:
      "Yang ikut keduanya terhitung dua kali bila kedua angka sekadar dijumlahkan, jadi ia harus dikurangkan sekali: 18 + 15 - 7 = 26. Jawaban 33 muncul bila irisannya lupa dikurangkan.",
  },
  {
    nomor: 20,
    kategori: "Logika",
    pertanyaan:
      "Sebuah sandi menggeser tiap huruf dua langkah maju dalam abjad, sehingga A menjadi C. Kata apakah yang tersembunyi di balik sandi \"DKO\"?",
    opsi: { A: "BIM", B: "FMQ", C: "AIM", D: "BJM" },
    kunci: "A",
    pembahasan:
      "Karena sandi menggeser maju dua langkah, membacanya berarti mundur dua langkah: D → B, K → I, O → M, sehingga terbaca BIM. Pilihan FMQ adalah hasil menggeser maju lagi, yaitu arah yang terbalik.",
  },

  /* -------------------------------- Spasial -------------------------------- */
  {
    nomor: 21,
    kategori: "Spasial",
    pertanyaan:
      "Sebuah kubus dipotong tepat di tengah oleh satu bidang datar yang sejajar dengan salah satu sisinya. Bangun apakah yang terbentuk pada bidang potong itu?",
    opsi: { A: "Segitiga", B: "Persegi", C: "Lingkaran", D: "Segi enam" },
    kunci: "B",
    pembahasan:
      "Bidang yang sejajar dengan sebuah sisi kubus memotongnya persis seperti bentuk sisi itu sendiri, yaitu persegi. Segitiga dan segi enam memang mungkin terjadi pada kubus, tetapi hanya bila bidang potongnya miring — bukan sejajar sisi.",
  },
  {
    nomor: 22,
    kategori: "Spasial",
    pertanyaan:
      "Pada matriks berikut, banyaknya lambang bintang bertambah satu dari kiri ke kanan dan bertambah satu dari atas ke bawah. Berapa bintang yang menggantikan tanda tanya?",
    pola: ["*      **     ***", "**     ***    ****", "***    ****   ?"],
    opsi: { A: "Tiga", B: "Empat", C: "Lima", D: "Enam" },
    kunci: "C",
    pembahasan:
      "Sel yang ditanyakan berada pada baris ketiga kolom ketiga. Dari arah baris: 3, 4, lalu 5. Dari arah kolom: 3, 4, lalu 5. Kedua arah memberi jawaban sama, yaitu lima bintang — dan kecocokan dari dua arah itulah tanda bahwa polanya sudah benar.",
  },
  {
    nomor: 23,
    kategori: "Spasial",
    pertanyaan:
      "Sebuah persegi diputar 90° searah jarum jam, lalu diputar 180° lagi. Berapa derajat perputaran seluruhnya bila diukur searah jarum jam?",
    opsi: { A: "90°", B: "180°", C: "270°", D: "360°" },
    kunci: "C",
    pembahasan:
      "Dua perputaran berurutan pada arah yang sama tinggal dijumlahkan: 90° + 180° = 270°. Jawaban 360° akan berarti kembali ke kedudukan semula, yang hanya terjadi bila jumlahnya genap satu putaran penuh.",
  },
  {
    nomor: 24,
    kategori: "Spasial",
    pertanyaan:
      "Sebuah jaring-jaring kubus dilipat. Bila sisi bertanda X berhadapan dengan sisi bertanda Y, dan pada kubus jumlah pasangan sisi yang berhadapan ada tiga, berapa sisi yang TIDAK berhadapan dengan X?",
    opsi: { A: "Dua", B: "Tiga", C: "Empat", D: "Lima" },
    kunci: "C",
    pembahasan:
      "Kubus memiliki enam sisi. Satu di antaranya adalah X sendiri dan satu lagi adalah Y yang berhadapan dengannya, sehingga tersisa 6 - 2 = 4 sisi yang bersinggungan dengan X, bukan berhadapan. Keempatnya mengelilingi X sebagai sisi tetangga.",
  },
  {
    nomor: 25,
    kategori: "Spasial",
    pertanyaan:
      "Deret lambang berikut berputar dengan aturan tetap. Lambang apakah yang menggantikan tanda tanya?",
    pola: ["^   >   v   <   ^   >   ?"],
    opsi: {
      A: "^ (atas)",
      B: "> (kanan)",
      C: "v (bawah)",
      D: "< (kiri)",
    },
    kunci: "C",
    pembahasan:
      "Anak panah berputar seperempat lingkaran searah jarum jam pada setiap langkah: atas, kanan, bawah, kiri, lalu berulang. Setelah atas dan kanan pada dua langkah terakhir, giliran berikutnya adalah bawah.",
  },
];
