import { EPPS_PAKET_10 } from "@/lib/psikotes/epps-lanjutan";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 10.
 *
 * Paket penutup. Dipakai sebagai gambaran kesiapan menjelang seleksi: bentuk
 * soalnya mengambil seluruh jenis yang pernah muncul pada sembilan paket
 * sebelumnya, dengan tingkat kesulitan yang setara pelaksanaan sesungguhnya.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_10: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari AKURAT adalah ...",
    opsi: { A: "Saksama", B: "Cepat", C: "Ringkas", D: "Lengkap" },
    kunci: "A",
    pembahasan:
      "Akurat berarti tepat dan tidak menyimpang dari yang sebenarnya; saksama menyatakan ketelitian yang sama. Cepat menyangkut waktu, ringkas menyangkut panjang, dan lengkap menyangkut kecukupan isi.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata OPTIMIS adalah ...",
    opsi: { A: "Pesimis", B: "Realistis", C: "Apatis", D: "Kritis" },
    kunci: "A",
    pembahasan:
      "Optimis berarti berpengharapan baik; lawannya pesimis, yang selalu menduga hal buruk. Realistis berpijak pada kenyataan, apatis berarti tidak peduli, dan kritis berarti tajam menilai — tidak satu pun kebalikan optimis.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "KERAN : AIR = SAKELAR : ...",
    opsi: { A: "Kabel", B: "Listrik", C: "Lampu", D: "Dinding" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah alat pengatur dengan sesuatu yang dialirkannya. Keran mengatur air, sakelar mengatur listrik. Kabel adalah salurannya, lampu pemakainya, dan dinding tempat pemasangannya.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "GEMPA : RUNTUH = BANJIR : ...",
    opsi: { A: "Hujan", B: "Sungai", C: "Terendam", D: "Tanggul" },
    kunci: "C",
    pembahasan:
      "Hubungannya adalah bencana dengan akibat yang ditimbulkannya. Gempa menimbulkan runtuh, banjir menimbulkan terendam. Hujan adalah penyebab banjir, sungai tempatnya, dan tanggul alat pencegahnya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Semua pengurus asrama tinggal di kompleks sekolah. Sebagian yang tinggal di kompleks sekolah adalah guru. Manakah yang PASTI benar?",
    opsi: {
      A: "Sebagian pengurus asrama adalah guru",
      B: "Semua guru adalah pengurus asrama",
      C: "Sebagian yang tinggal di kompleks sekolah adalah pengurus asrama",
      D: "Tidak ada guru yang tinggal di kompleks sekolah",
    },
    kunci: "C",
    pembahasan:
      "Seluruh pengurus asrama berada di dalam kelompok penghuni kompleks, sehingga pasti ada penghuni kompleks yang merupakan pengurus asrama. Pilihan A belum tentu benar karena guru yang tinggal di kompleks mungkin bukan pengurus asrama.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Tidak seorang pun yang melanggar tata tertib boleh mengikuti lomba. Semua peserta lomba mengenakan seragam khusus. Kesimpulannya ...",
    opsi: {
      A: "Semua yang mengenakan seragam khusus adalah peserta lomba",
      B: "Tidak seorang pun pelanggar tata tertib mengenakan seragam khusus",
      C: "Sebagian pelanggar tata tertib mengikuti lomba",
      D: "Tidak dapat ditarik kesimpulan yang pasti",
    },
    kunci: "D",
    pembahasan:
      "Pelanggar tata tertib memang tidak boleh mengikuti lomba, tetapi soal tidak menyatakan bahwa seragam khusus hanya dikenakan peserta lomba. Karena itu tidak ada yang dapat dipastikan tentang seragam yang dikenakan pelanggar.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Panas", B: "Dingin", C: "Suhu", D: "Hangat" },
    kunci: "C",
    pembahasan:
      "Panas, dingin, dan hangat adalah tingkatan suhu yang dapat dirasakan. Suhu adalah besaran yang mencakup ketiganya, sehingga ia berada pada tingkatan yang berbeda.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan:
      'Makna peribahasa "Berat sama dipikul, ringan sama dijinjing" adalah ...',
    opsi: {
      A: "Menanggung susah dan senang bersama-sama",
      B: "Membagi pekerjaan menurut kekuatan masing-masing",
      C: "Meringankan beban orang yang lemah",
      D: "Bekerja sendiri agar cepat selesai",
    },
    kunci: "A",
    pembahasan:
      "Peribahasa ini menggambarkan kebersamaan dalam menanggung keadaan, baik yang berat maupun yang ringan. Pilihan B mendekati tetapi menekankan pembagian menurut kekuatan, bukan kebersamaannya.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 4, 7, 13, 25, 49, ...",
    opsi: { A: "73", B: "89", C: "97", D: "98" },
    kunci: "C",
    pembahasan:
      "Setiap suku adalah dua kali suku sebelumnya dikurangi satu: 4 × 2 - 1 = 7, 7 × 2 - 1 = 13, dan seterusnya. Maka 49 × 2 - 1 = 97.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah bak berisi 240 liter air. Setiap menit keluar 8 liter dan masuk 3 liter. Berapa menit sampai bak kosong?",
    opsi: { A: "30 menit", B: "40 menit", C: "48 menit", D: "80 menit" },
    kunci: "C",
    pembahasan:
      "Setiap menit isinya berkurang 8 - 3 = 5 liter. Maka waktunya 240 ÷ 5 = 48 menit. Membagi 240 dengan 8 saja akan memberi 30 menit dan itu mengabaikan air yang masuk.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Harga sebuah sepeda turun 25%, lalu turun lagi 20% dari harga yang baru. Berapa persen penurunan seluruhnya dari harga semula?",
    opsi: { A: "40%", B: "42%", C: "45%", D: "50%" },
    kunci: "A",
    pembahasan:
      "Ambil harga semula 100. Turun 25% menjadi 75, lalu turun 20% dari 75 berarti berkurang 15 menjadi 60. Penurunan seluruhnya 40%, bukan 45% — persentase bertingkat tidak boleh dijumlahkan.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Perbandingan umur ayah dan ibu 6 : 5. Bila selisih umur mereka 6 tahun, berapa umur ibu?",
    opsi: { A: "24 tahun", B: "30 tahun", C: "36 tahun", D: "42 tahun" },
    kunci: "B",
    pembahasan:
      "Selisih perbandingannya 6 - 5 = 1 bagian yang bernilai 6 tahun. Umur ibu menempati 5 bagian, yaitu 5 × 6 = 30 tahun.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah bus berangkat pukul 06.30 dan tiba pukul 13.15 dengan istirahat 45 menit di tengah jalan. Berapa lama bus itu benar-benar berjalan?",
    opsi: {
      A: "5 jam",
      B: "5 jam 45 menit",
      C: "6 jam",
      D: "6 jam 45 menit",
    },
    kunci: "C",
    pembahasan:
      "Selisih waktu seluruhnya dari 06.30 ke 13.15 adalah 6 jam 45 menit. Dikurangi istirahat 45 menit, waktu berjalannya 6 jam.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Rata-rata nilai kelas A yang berisi 20 siswa adalah 75, dan kelas B yang berisi 30 siswa adalah 85. Berapa rata-rata gabungan keduanya?",
    opsi: { A: "80", B: "81", C: "82", D: "83" },
    kunci: "B",
    pembahasan:
      "Jumlah nilainya 20 × 75 + 30 × 85 = 1.500 + 2.550 = 4.050, dibagi 50 siswa menjadi 81. Merata-ratakan 75 dan 85 secara langsung akan memberi 80 dan itu keliru karena jumlah siswanya tidak sama.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kubus bersisi 6 cm. Berapa luas seluruh permukaannya?",
    opsi: { A: "36 cm²", B: "144 cm²", C: "216 cm²", D: "252 cm²" },
    kunci: "C",
    pembahasan:
      "Kubus memiliki enam sisi berbentuk persegi seluas 6 × 6 = 36 cm². Luas seluruhnya 6 × 36 = 216 cm². Jawaban 216 juga sama dengan volumenya pada kubus bersisi 6, jadi periksalah yang ditanyakan dengan cermat.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berselang berikut: 9, 2, 18, 6, 36, 18, 72, ...",
    opsi: { A: "36", B: "54", C: "144", D: "72" },
    kunci: "B",
    pembahasan:
      "Suku ganjil 9, 18, 36, 72 berlipat dua; suku genap 2, 6, 18 berlipat tiga. Yang ditanyakan menempati urutan kedelapan — urutan genap — sehingga 18 × 3 = 54.",
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
        "persegi",
        "persegi@30",
        "persegi@60",
        "segienam",
        "segienam@30",
        "segienam@60",
        "silang",
        "silang@30",
        "?",
      ],
    },
    opsi: {
      A: "Silang diputar 60 derajat",
      B: "Silang pada kedudukan semula",
      C: "Silang diputar 90 derajat",
      D: "Segi enam diputar 60 derajat",
    },
    opsiFigur: {
      A: "silang@60",
      B: "silang",
      C: "silang@90",
      D: "segienam@60",
    },
    kunci: "A",
    pembahasan:
      "Bentuk ditentukan barisnya dan sudut putaran ditentukan kolomnya: 0, 30, lalu 60 derajat.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "bintang",
        "bintang@90#separuh",
        "bintang@180#penuh",
        "bintang@270",
        "?",
      ],
    },
    opsi: {
      A: "Bintang tegak terisi separuh",
      B: "Bintang tegak bergaris",
      C: "Bintang diputar 90 derajat",
      D: "Bintang terisi penuh diputar 180 derajat",
    },
    opsiFigur: {
      A: "bintang#separuh",
      B: "bintang",
      C: "bintang@90",
      D: "bintang@180#penuh",
    },
    kunci: "A",
    pembahasan:
      "Dua aturan berjalan bersamaan: sudutnya bertambah 90 derajat setiap langkah, dan isinya berputar bergaris, separuh, penuh, bergaris, lalu separuh. Langkah kelima kembali ke 0 derajat dan giliran terisi separuh.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "segitiga",
        "segitiga*2",
        "segitiga*4",
        "segitiga",
        "segitiga*2",
        "?",
      ],
    },
    opsi: {
      A: "Empat segitiga",
      B: "Satu segitiga",
      C: "Dua segitiga",
      D: "Tiga segitiga",
    },
    opsiFigur: {
      A: "segitiga*4",
      B: "segitiga",
      C: "segitiga*2",
      D: "segitiga*3",
    },
    kunci: "A",
    pembahasan:
      "Deret berulang dalam kelompok bertiga: satu, dua, empat, lalu mengulang dari awal. Sel keenam menempati kedudukan ketiga pada kelompok kedua.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segienam", "segilima", "persegi", "?"],
    },
    opsi: { A: "Segitiga", B: "Lingkaran", C: "Bintang", D: "Segi enam" },
    opsiFigur: {
      A: "segitiga",
      B: "lingkaran",
      C: "bintang",
      D: "segienam",
    },
    kunci: "A",
    pembahasan:
      "Banyak sisinya berkurang satu setiap langkah: 6, 5, 4, lalu 3. Lingkaran tidak bersisi sehingga tidak dapat melanjutkan pola cacah sisi.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "panah",
        "panah@120",
        "panah@240",
        "panah@240",
        "panah",
        "panah@120",
        "panah@120",
        "panah@240",
        "?",
      ],
    },
    opsi: {
      A: "Panah mengarah ke kanan",
      B: "Panah diputar 120 derajat",
      C: "Panah diputar 240 derajat",
      D: "Panah diputar 180 derajat",
    },
    opsiFigur: {
      A: "panah",
      B: "panah@120",
      C: "panah@240",
      D: "panah@180",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat ketiga kedudukan tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memakai 120 dan 240 derajat, sehingga tersisa 0 derajat.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "belahketupat",
        "belahketupat#penuh",
        "segilima",
        "segilima#penuh",
        "silang",
        "?",
      ],
    },
    opsi: {
      A: "Silang terisi penuh",
      B: "Silang bergaris",
      C: "Segi lima terisi penuh",
      D: "Belah ketupat terisi penuh",
    },
    opsiFigur: {
      A: "silang#penuh",
      B: "silang",
      C: "segilima#penuh",
      D: "belahketupat#penuh",
    },
    kunci: "A",
    pembahasan:
      "Setiap bentuk muncul dua kali berturut-turut: sekali bergaris, sekali terisi penuh. Silang baru muncul sekali dalam keadaan bergaris.",
  },
  {
    nomor: 23,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "lingkaran",
        "lingkaran#separuh",
        "lingkaran#penuh",
        "lingkaran#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Lingkaran bergaris",
      B: "Lingkaran terisi separuh",
      C: "Lingkaran terisi penuh",
      D: "Segi enam bergaris",
    },
    opsiFigur: {
      A: "lingkaran",
      B: "lingkaran#separuh",
      C: "lingkaran#penuh",
      D: "segienam",
    },
    kunci: "A",
    pembahasan:
      "Isinya bergerak bolak-balik: bergaris, separuh, penuh, separuh, lalu bergaris lagi. Bentuknya tidak pernah berganti sepanjang deret.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "garis",
        "garis*2#separuh",
        "garis*4#penuh",
        "silang",
        "silang*2#separuh",
        "silang*4#penuh",
        "bintang",
        "bintang*2#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Empat bintang terisi penuh",
      B: "Empat bintang bergaris",
      C: "Dua bintang terisi penuh",
      D: "Empat silang terisi penuh",
    },
    opsiFigur: {
      A: "bintang*4#penuh",
      B: "bintang*4",
      C: "bintang*2#penuh",
      D: "silang*4#penuh",
    },
    kunci: "A",
    pembahasan:
      "Dua aturan berjalan pada kolom sekaligus: jumlahnya berlipat dua dan isinya bertambah dari bergaris ke separuh lalu penuh. Bentuknya ditentukan barisnya.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_10: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segilima",
        "segilima#separuh",
        "segilima#penuh",
        "segienam",
        "segienam#separuh",
        "segienam#penuh",
        "silang",
        "silang#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Silang bergaris",
      B: "Silang terisi separuh",
      C: "Silang terisi penuh",
      D: "Segi enam terisi penuh",
    },
    opsiFigur: {
      A: "silang",
      B: "silang#separuh",
      C: "silang#penuh",
      D: "segienam#penuh",
    },
    kunci: "C",
    pembahasan:
      "Baris menentukan bentuk dan kolom menentukan isi. Sel yang ditanyakan berada di baris silang dan kolom terisi penuh.",
  },
  {
    nomor: 2,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "persegi",
        "persegi@45",
        "persegi@90",
        "persegi@135",
        "persegi@180",
        "?",
      ],
    },
    opsi: {
      A: "Persegi diputar 225 derajat",
      B: "Persegi pada kedudukan semula",
      C: "Persegi diputar 270 derajat",
      D: "Belah ketupat",
    },
    opsiFigur: {
      A: "persegi@225",
      B: "persegi",
      C: "persegi@270",
      D: "belahketupat",
    },
    kunci: "A",
    pembahasan:
      "Perputarannya tetap 45 derajat setiap langkah: 0, 45, 90, 135, 180, lalu 225 derajat.",
  },
  {
    nomor: 3,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "panah@90",
        "panah",
        "panah@270",
        "panah@180",
        "?",
      ],
    },
    opsi: {
      A: "Panah mengarah ke bawah",
      B: "Panah mengarah ke kanan",
      C: "Panah mengarah ke atas",
      D: "Panah mengarah ke kiri",
    },
    opsiFigur: {
      A: "panah@90",
      B: "panah",
      C: "panah@270",
      D: "panah@180",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya berkurang 90 derajat setiap langkah, dan setiap kali menembus nol ia dihitung ulang dari 360: 90 → 0 → 270 → 180. Langkah berikutnya 180 - 90 = 90 derajat, yaitu mengarah ke bawah.",
  },
  {
    nomor: 4,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah panah serong kanan-bawah dicerminkan terhadap garis tegak. Ke arah manakah bayangannya menghadap?",
    stimulus: { kolom: 2, sel: ["panah@45", "?"] },
    opsi: {
      A: "Serong kiri-bawah",
      B: "Serong kanan-atas",
      C: "Serong kiri-atas",
      D: "Tetap serong kanan-bawah",
    },
    opsiFigur: {
      A: "panah@135",
      B: "panah@315",
      C: "panah@225",
      D: "panah@45",
    },
    kunci: "A",
    pembahasan:
      "Cermin tegak menukar kiri dengan kanan sementara atas-bawah tidak tersentuh, sehingga panah serong kanan-bawah menjadi serong kiri-bawah.",
  },
  {
    nomor: 5,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "bintang",
        "silang",
        "belahketupat",
        "belahketupat",
        "bintang",
        "silang",
        "silang",
        "belahketupat",
        "?",
      ],
    },
    opsi: { A: "Bintang", B: "Silang", C: "Belah ketupat", D: "Persegi" },
    opsiFigur: {
      A: "bintang",
      B: "silang",
      C: "belahketupat",
      D: "persegi",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat ketiga lambang tepat satu kali dan urutannya bergeser satu langkah pada baris berikutnya. Baris ketiga sudah memuat silang dan belah ketupat.",
  },
  {
    nomor: 6,
    kategori: "Analogi",
    pertanyaan:
      "Segi enam bergaris berbanding segi enam terisi penuh dan diputar 90 derajat, sebagaimana silang bergaris berbanding ...",
    stimulus: {
      kolom: 4,
      sel: ["segienam", "segienam@90#penuh", "silang", "?"],
    },
    opsi: {
      A: "Silang terisi penuh dan diputar 90 derajat",
      B: "Silang terisi penuh",
      C: "Silang diputar 90 derajat",
      D: "Bintang terisi penuh",
    },
    opsiFigur: {
      A: "silang@90#penuh",
      B: "silang#penuh",
      C: "silang@90",
      D: "bintang#penuh",
    },
    kunci: "A",
    pembahasan:
      "Dua perubahan terjadi sekaligus: diisi penuh dan diputar 90 derajat. Keduanya harus diterapkan bersama pada silang.",
  },
  {
    nomor: 7,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan tiga lainnya?",
    stimulus: {
      kolom: 4,
      sel: [
        "segitiga*2#penuh",
        "persegi*2#penuh",
        "bintang*2#penuh",
        "lingkaran*2",
      ],
    },
    opsi: {
      A: "Dua segitiga terisi penuh",
      B: "Dua persegi terisi penuh",
      C: "Dua bintang terisi penuh",
      D: "Dua lingkaran bergaris",
    },
    opsiFigur: {
      A: "segitiga*2#penuh",
      B: "persegi*2#penuh",
      C: "bintang*2#penuh",
      D: "lingkaran*2",
    },
    kunci: "D",
    pembahasan:
      "Keempat gambar sama-sama memuat dua lambang, tetapi hanya lingkaran yang dibiarkan bergaris sementara tiga lainnya terisi penuh. Bentuk dan jumlah karena itu bukan pembedanya.",
  },
  {
    nomor: 8,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "segienam*4",
        "segienam*3",
        "segienam*2",
        "segienam",
        "?",
      ],
    },
    opsi: {
      A: "Empat segi enam",
      B: "Satu segi enam",
      C: "Dua segi enam",
      D: "Tiga segi enam",
    },
    opsiFigur: {
      A: "segienam*4",
      B: "segienam",
      C: "segienam*2",
      D: "segienam*3",
    },
    kunci: "A",
    pembahasan:
      "Jumlahnya berkurang sampai satu, lalu deret berputar kembali ke awal karena tidak mungkin berkurang di bawah satu. Pola berputar dikenali dari kembalinya deret ke bentuk semula.",
  },
  {
    nomor: 9,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "persegi",
        "persegi*2",
        "persegi*3",
        "persegi*3",
        "persegi",
        "persegi*2",
        "persegi*2",
        "persegi*3",
        "?",
      ],
    },
    opsi: {
      A: "Satu persegi",
      B: "Dua persegi",
      C: "Tiga persegi",
      D: "Empat persegi",
    },
    opsiFigur: {
      A: "persegi",
      B: "persegi*2",
      C: "persegi*3",
      D: "persegi*4",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat jumlah satu, dua, dan tiga tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memuat dua dan tiga.",
  },
  {
    nomor: 10,
    kategori: "Rotasi",
    pertanyaan:
      "Sebuah bangun diputar 90 derajat searah jarum jam, lalu 90 derajat berlawanan arah jarum jam. Bagaimana kedudukan akhirnya?",
    opsi: {
      A: "Kembali ke kedudukan semula",
      B: "Terputar 180 derajat",
      C: "Terputar 90 derajat searah jarum jam",
      D: "Terbalik kiri-kanan",
    },
    kunci: "A",
    pembahasan:
      "Dua perputaran yang sama besar tetapi berlawanan arah saling membatalkan, sehingga bangun kembali persis ke kedudukan semula.",
  },
  {
    nomor: 11,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah bangun dicerminkan terhadap garis tegak sebanyak tiga kali. Bagaimana kedudukan akhirnya?",
    opsi: {
      A: "Sama dengan bangun semula",
      B: "Terbalik kiri-kanan",
      C: "Terbalik atas-bawah",
      D: "Berputar 180 derajat",
    },
    kunci: "B",
    pembahasan:
      "Dua pencerminan pertama saling membatalkan dan mengembalikan bangun ke kedudukan semula, sehingga pencerminan ketiga menyisakan satu penukaran kiri-kanan. Pencerminan berjumlah ganjil selalu menghasilkan bayangan yang terbalik.",
  },
  {
    nomor: 12,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "panah",
        "panah@45",
        "panah@90",
        "panah@135",
        "panah@180",
        "panah@225",
        "panah@270",
        "panah@315",
        "?",
      ],
    },
    opsi: {
      A: "Panah mengarah ke kanan",
      B: "Panah serong ke kanan-atas",
      C: "Panah mengarah ke atas",
      D: "Panah mengarah ke kiri",
    },
    opsiFigur: {
      A: "panah",
      B: "panah@315",
      C: "panah@270",
      D: "panah@180",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya bertambah 45 derajat pada setiap sel bila matriks dibaca berurutan dari kiri atas ke kanan bawah. Sesudah 315 derajat, langkah berikutnya genap satu putaran dan kembali ke 0 derajat.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_10: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Anda memimpin regu dalam kegiatan luar ruang dan cuaca berubah buruk di tengah perjalanan. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Melanjutkan perjalanan agar jadwal tidak berantakan",
      B: "Menghentikan regu di tempat aman, menghubungi panitia, dan menunggu petunjuk",
      C: "Membiarkan setiap anggota memutuskan sendiri",
      D: "Kembali ke titik awal tanpa memberi tahu siapa pun",
    },
    kunci: "B",
    pembahasan:
      "Keselamatan mendahului jadwal, dan menghubungi panitia menjaga agar keputusan diambil dengan keterangan yang lengkap. Pilihan A mengabaikan bahaya, C membubarkan tanggung jawab, dan D bergerak tanpa koordinasi sehingga regu justru sulit ditemukan.",
  },
  {
    nomor: 2,
    kategori: "Integritas",
    pertanyaan:
      "Anda menemukan kesalahan pada penilaian yang justru menguntungkan regu Anda dalam lomba. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Melaporkannya kepada panitia meskipun regu Anda dapat dirugikan",
      B: "Diam karena bukan Anda yang menghitung",
      C: "Melaporkannya setelah lomba berakhir",
      D: "Memberitahukannya hanya kepada regu Anda sendiri",
    },
    kunci: "A",
    pembahasan:
      "Kemenangan yang berdiri di atas kesalahan penilaian bukan kemenangan. Pilihan B dan D membiarkan keuntungan yang tidak sah, sedangkan C menunda sampai koreksi tidak lagi berguna.",
  },
  {
    nomor: 3,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Menjelang pengumuman hasil seleksi, Anda sulit tidur dan terus memeriksa telepon. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memeriksa telepon lebih sering agar tidak ketinggalan kabar",
      B: "Menetapkan waktu tertentu untuk memeriksa kabar dan mengisi sisanya dengan kegiatan yang sudah direncanakan",
      C: "Mematikan telepon sampai pengumuman keluar",
      D: "Meminta orang lain memberi tahu Anda dan tidak melakukan apa pun sampai itu terjadi",
    },
    kunci: "B",
    pembahasan:
      "Menetapkan waktu memeriksa memutus lingkaran cemas tanpa memutus hubungan dengan kabar yang ditunggu. Pilihan A memperkuat kecemasan, C berlebihan ke arah sebaliknya, dan D membuat hari-hari menunggu menjadi kosong.",
  },
  {
    nomor: 4,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Anda dan seorang teman sama-sama mendaftar, tetapi hanya teman Anda yang diterima. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengucapkan selamat dengan tulus, lalu menimbang langkah Anda berikutnya",
      B: "Menghindarinya agar tidak terus teringat",
      C: "Mengatakan bahwa ia beruntung saja",
      D: "Menyalahkan diri sendiri berkepanjangan",
    },
    kunci: "A",
    pembahasan:
      "Mengakui keberhasilan orang lain dan mengurus langkah sendiri adalah dua hal yang dapat berjalan bersamaan. Pilihan B memutus hubungan, C mengecilkan usaha temannya, dan D mengubah kekecewaan menjadi hukuman terhadap diri sendiri.",
  },
  {
    nomor: 5,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Anda menjadi penanggung jawab dokumen regu dan salah satu berkas hilang menjelang batas pengumpulan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Segera memberi tahu regu dan panitia, lalu mengurus penggantian berkasnya",
      B: "Mengumpulkan berkas yang ada dan berharap tidak diperiksa",
      C: "Menyalin berkas milik regu lain",
      D: "Meminta perpanjangan waktu tanpa menjelaskan sebabnya",
    },
    kunci: "A",
    pembahasan:
      "Memberi tahu segera membuka waktu yang masih tersisa untuk mengganti berkas. Pilihan B menyerahkan hasil pada keberuntungan, C memalsukan, dan D meminta kelonggaran tanpa keterbukaan sehingga panitia tidak dapat membantu dengan tepat.",
  },
  {
    nomor: 6,
    kategori: "Kerja Sama",
    pertanyaan:
      "Regu Anda berselisih mengenai pembagian tugas dan pekerjaan berhenti. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengusulkan pembagian tertulis yang disepakati bersama, lalu mulai bekerja",
      B: "Menunggu sampai ada yang mengalah",
      C: "Mengerjakan seluruhnya sendiri",
      D: "Meminta pembina membagi tugas untuk regu Anda",
    },
    kunci: "A",
    pembahasan:
      "Pembagian tertulis yang disepakati menghentikan perselisihan sekaligus mencegahnya berulang. Pilihan B membiarkan pekerjaan berhenti, C menanggung beban timpang, dan D menyerahkan hal yang sebenarnya masih dapat diselesaikan regu.",
  },
  {
    nomor: 7,
    kategori: "Kejujuran",
    pertanyaan:
      "Pada wawancara seleksi, Anda ditanya tentang keterampilan yang belum Anda kuasai. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengatakan Anda menguasainya agar tidak kehilangan kesempatan",
      B: "Mengatakan sejauh mana Anda menguasainya beserta kesediaan mempelajarinya",
      C: "Mengalihkan pembicaraan ke keterampilan lain",
      D: "Mengatakan tidak tahu dan berhenti di situ",
    },
    kunci: "B",
    pembahasan:
      "Menyatakan sejauh mana penguasaan Anda beserta kesediaan belajar bersikap jujur tanpa menutup kesempatan. Pilihan A berbohong, C menghindar, dan D membuang kesempatan menjelaskan kesediaan Anda.",
  },
  {
    nomor: 8,
    kategori: "Menerima Otoritas",
    pertanyaan:
      "Anda diberi tugas yang bertentangan dengan tugas lain dari pembina yang berbeda. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengerjakan yang datang lebih dahulu dan mengabaikan yang lain",
      B: "Menyampaikan keadaan itu kepada kedua pembina agar mereka menentukan mana yang didahulukan",
      C: "Mengerjakan yang paling mudah",
      D: "Tidak mengerjakan keduanya sampai ada kejelasan",
    },
    kunci: "B",
    pembahasan:
      "Bila dua perintah bertabrakan, yang berwenang menyelesaikannya adalah pemberi perintahnya sendiri. Pilihan A dan C memutuskan sepihak, sedangkan D menghentikan pekerjaan tanpa memberi tahu siapa pun.",
  },
  {
    nomor: 9,
    kategori: "Kepedulian",
    pertanyaan:
      "Seorang teman gagal seleksi dan menarik diri dari pergaulan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membiarkannya sampai ia siap bergaul kembali",
      B: "Tetap menyapa dan mengajaknya pada kegiatan ringan tanpa membahas kegagalannya terus-menerus",
      C: "Menghiburnya dengan mengatakan seleksi itu tidak penting",
      D: "Mengajaknya membicarakan kegagalannya sampai tuntas",
    },
    kunci: "B",
    pembahasan:
      "Kehadiran yang tetap tanpa menekan memberi ruang pulih sekaligus menjaga hubungan. Pilihan A membiarkan ia menyendiri, C mengecilkan hal yang ia perjuangkan, dan D memaksanya membicarakan hal yang belum siap ia bicarakan.",
  },
  {
    nomor: 10,
    kategori: "Evaluasi Diri",
    pertanyaan:
      "Setelah menjalani sepuluh paket latihan, Anda ingin mengetahui kesiapan Anda yang sebenarnya. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Menghitung rata-rata nilai seluruh paket",
      B: "Memeriksa jenis soal yang paling sering salah pada seluruh paket, lalu memperbaikinya",
      C: "Mengulang paket yang nilainya paling tinggi",
      D: "Membandingkan nilai Anda dengan nilai teman",
    },
    kunci: "B",
    pembahasan:
      "Rata-rata hanya menunjukkan kedudukan, sedangkan pola kesalahan menunjukkan apa yang perlu dikerjakan. Pilihan C mengulang yang sudah dikuasai, dan D mengalihkan perhatian dari perbaikan ke perbandingan.",
  },
  {
    nomor: 11,
    kategori: "Keberanian Moral",
    pertanyaan:
      "Anda mengetahui seorang peserta lain memakai keterangan palsu pada berkas pendaftarannya. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membiarkannya karena bukan urusan Anda",
      B: "Melaporkannya kepada panitia beserta dasar yang Anda ketahui",
      C: "Menyebarkannya kepada peserta lain",
      D: "Menegurnya lalu berhenti di situ",
    },
    kunci: "B",
    pembahasan:
      "Keterangan palsu merugikan seluruh peserta yang jujur, dan panitialah yang berwenang memeriksanya. Pilihan A membiarkan, C menyebarkan tuduhan tanpa pemeriksaan, dan D berhenti sebelum persoalannya sampai kepada yang berwenang.",
  },
  {
    nomor: 12,
    kategori: "Penyesuaian Diri",
    pertanyaan:
      "Anda diterima di sekolah berasrama yang jauh dari rumah dan belum mengenal siapa pun di sana. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menjalani hari-hari pertama seadanya sampai terbiasa sendiri",
      B: "Mengenali jadwal dan aturan lebih dahulu, lalu berkenalan dengan teman sekamar dan pembina",
      C: "Sering pulang pada awal masa sekolah agar tidak terlalu rindu",
      D: "Menunggu sampai ada yang mengajak berkenalan",
    },
    kunci: "B",
    pembahasan:
      "Mengenali jadwal dan aturan mengurangi kebingungan yang paling melelahkan pada pekan pertama, sementara berkenalan mempercepat terbentuknya dukungan. Pilihan A dan D menunggu, dan C memperpanjang masa penyesuaian dengan terus kembali ke keadaan lama.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_10: PaketPsikotes = {
  id: "psi-10",
  nomor: 10,
  nama: "Try Out Psikotes 10",
  deskripsi:
    "Paket penutup. Mengambil seluruh jenis soal yang pernah muncul pada sembilan paket sebelumnya, dengan tingkat kesulitan setara pelaksanaan sesungguhnya.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_10,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Cari satu aturan yang berlaku untuk seluruh gambar, bukan yang hanya cocok untuk dua gambar pertama. Pada soal matriks, periksa polanya dari arah baris dan dari arah kolom — jawaban yang benar cocok dari kedua arah.",
      durasiMenit: 10,
      soal: VISUAL_10,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_10,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_10,
    },
  ],
};
