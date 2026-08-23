import { EPPS_PAKET_9 } from "@/lib/psikotes/epps-lanjutan";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 9.
 *
 * Simulasi lanjutan. Tingkat kesulitannya berada di atas Paket 8: soal verbal
 * memakai kata yang lebih jarang, soal numerik menuntut dua tahap perhitungan,
 * dan soal figuralnya memakai pola yang tidak langsung terbaca pada dua gambar
 * pertama.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_9: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari PARADIGMA adalah ...",
    opsi: { A: "Kerangka berpikir", B: "Kesimpulan", C: "Perbandingan", D: "Contoh soal" },
    kunci: "A",
    pembahasan:
      "Paradigma adalah kerangka berpikir atau cara pandang yang mendasari penilaian seseorang terhadap sesuatu. Kesimpulan adalah hasilnya, dan perbandingan hanyalah salah satu cara memeriksanya.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata KOHESI adalah ...",
    opsi: { A: "Keterpaduan", B: "Perpecahan", C: "Kerja sama", D: "Kelekatan" },
    kunci: "B",
    pembahasan:
      "Kohesi berarti keterpaduan atau kelekatan antarbagian; lawannya perpecahan. Keterpaduan dan kelekatan justru bersinonim dengannya.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "PENA : TINTA = SENAPAN : ...",
    opsi: { A: "Peluru", B: "Prajurit", C: "Sasaran", D: "Laras" },
    kunci: "A",
    pembahasan:
      "Hubungannya adalah alat dengan isi yang membuatnya berfungsi. Pena berisi tinta, senapan berisi peluru. Laras adalah bagiannya, prajurit pemakainya, dan sasaran tujuannya.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "MATAHARI : SIANG = BULAN : ...",
    opsi: { A: "Bintang", B: "Malam", C: "Gelap", D: "Langit" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah benda langit dengan waktu ketika ia tampak menonjol. Matahari menandai siang, bulan menandai malam. Gelap adalah keadaannya, dan langit adalah tempat keduanya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Semua pemain cadangan hadir pada latihan. Sebagian yang hadir pada latihan mendapat pujian pelatih. Manakah yang PASTI benar?",
    opsi: {
      A: "Semua pemain cadangan mendapat pujian",
      B: "Sebagian pemain cadangan mendapat pujian",
      C: "Sebagian yang hadir pada latihan adalah pemain cadangan",
      D: "Tidak seorang pun pemain cadangan mendapat pujian",
    },
    kunci: "C",
    pembahasan:
      "Seluruh pemain cadangan berada di dalam kelompok yang hadir, sehingga pasti ada yang hadir dan sekaligus pemain cadangan. Pilihan B belum tentu benar karena yang dipuji mungkin seluruhnya pemain inti yang juga hadir.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Jika berkas lengkap, peserta dipanggil wawancara. Jika dipanggil wawancara, peserta menerima surat. Sari tidak menerima surat. Kesimpulannya ...",
    opsi: {
      A: "Berkas Sari lengkap",
      B: "Berkas Sari tidak lengkap",
      C: "Sari dipanggil wawancara",
      D: "Tidak dapat disimpulkan",
    },
    kunci: "B",
    pembahasan:
      "Rantainya: berkas lengkap → dipanggil wawancara → menerima surat. Ujung rantai tidak terjadi pada Sari, sehingga seluruh mata rantai sebelumnya juga tidak terjadi.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Kabinet", B: "Menteri", C: "Presiden", D: "Gubernur" },
    kunci: "A",
    pembahasan:
      "Menteri, presiden, dan gubernur adalah jabatan yang dipegang orang. Kabinet adalah lembaga, bukan jabatan perseorangan, sehingga ia berada pada tingkatan yang berbeda.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan:
      'Makna peribahasa "Menepuk air di dulang, terpercik muka sendiri" adalah ...',
    opsi: {
      A: "Membuka aib sendiri saat menjelekkan orang dekat",
      B: "Bekerja tanpa hasil sama sekali",
      C: "Menolong orang tanpa mengharap balasan",
      D: "Mengerjakan sesuatu dengan tergesa-gesa",
    },
    kunci: "A",
    pembahasan:
      "Air yang ditepuk di dulang memercik kembali ke wajah penepuknya. Kiasannya: menjelekkan kerabat atau kelompok sendiri justru mempermalukan diri sendiri. Pilihan B menunjuk peribahasa lain, yaitu 'menegakkan benang basah'.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 2, 3, 5, 8, 13, 21, ...",
    opsi: { A: "26", B: "29", C: "34", D: "42" },
    kunci: "C",
    pembahasan:
      "Setiap suku adalah jumlah dua suku sebelumnya: 8 + 13 = 21, sehingga suku berikutnya 13 + 21 = 34. Jawaban 42 muncul bila polanya keliru dianggap perkalian dua.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 1, 4, 2, 8, 4, 16, 8, ...",
    opsi: { A: "16", B: "24", C: "32", D: "64" },
    kunci: "C",
    pembahasan:
      "Suku ganjil 1, 2, 4, 8 berlipat dua; suku genap 4, 8, 16 juga berlipat dua. Yang ditanyakan menempati urutan kedelapan — urutan genap — sehingga 16 × 2 = 32.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah campuran terdiri atas 3 bagian air dan 2 bagian sirop. Bila diperlukan 12 liter sirop, berapa liter campuran yang terbentuk?",
    opsi: { A: "18 liter", B: "24 liter", C: "30 liter", D: "36 liter" },
    kunci: "C",
    pembahasan:
      "Sirop menempati 2 bagian yang bernilai 12 liter, sehingga satu bagian 6 liter. Seluruh campuran 3 + 2 = 5 bagian = 5 × 6 = 30 liter.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah barang dijual Rp138.000 dengan keuntungan 15%. Berapa keuntungan dalam rupiah?",
    opsi: { A: "Rp18.000", B: "Rp20.700", C: "Rp23.000", D: "Rp24.000" },
    kunci: "A",
    pembahasan:
      "Harga jual adalah 115% harga beli, sehingga harga beli = 138.000 ÷ 1,15 = 120.000. Keuntungannya 138.000 - 120.000 = 18.000. Menghitung 15% dari harga jual akan memberi 20.700 dan itu keliru.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kendaraan berangkat pukul 08.00 dengan kecepatan 50 km/jam. Kendaraan kedua menyusul pukul 09.00 dengan kecepatan 75 km/jam. Pukul berapa kendaraan kedua menyusulnya?",
    opsi: { A: "10.00", B: "10.30", C: "11.00", D: "11.30" },
    kunci: "C",
    pembahasan:
      "Pada pukul 09.00 kendaraan pertama sudah 50 km di depan. Selisih kecepatannya 25 km/jam, sehingga jarak itu terkejar dalam 50 ÷ 25 = 2 jam, yaitu pukul 11.00.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Rata-rata nilai 20 siswa adalah 78. Bila dua siswa bernilai 90 dan 40 dikeluarkan, berapa rata-rata sisanya?",
    opsi: { A: "77", B: "78", C: "79", D: "80" },
    kunci: "C",
    pembahasan:
      "Jumlah nilai semula 20 × 78 = 1.560. Setelah dikurangi 90 dan 40, sisanya 1.430 untuk 18 siswa, sehingga rata-ratanya 1.430 ÷ 18 ≈ 79,4 dan dibulatkan menjadi 79.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah persegi panjang berukuran 15 cm × 8 cm. Bila seluruh sisinya diperbesar dua kali, berapa kali luasnya bertambah?",
    opsi: { A: "2 kali", B: "3 kali", C: "4 kali", D: "8 kali" },
    kunci: "C",
    pembahasan:
      "Panjang dan lebar sama-sama dikalikan dua, sehingga luasnya dikalikan 2 × 2 = 4. Luas bertambah menurut kuadrat perbandingan sisinya, bukan menurut perbandingan sisinya sendiri.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan:
      "Dua puluh pekerja menyelesaikan proyek dalam 30 hari. Setelah 10 hari, 5 pekerja mengundurkan diri. Berapa hari lagi proyek itu selesai?",
    opsi: {
      A: "20 hari lagi",
      B: "24 hari lagi",
      C: "26 hari lagi",
      D: "27 hari lagi",
    },
    kunci: "D",
    pembahasan:
      "Seluruh proyek bernilai 20 × 30 = 600 hari-orang. Sepuluh hari pertama menghabiskan 20 × 10 = 200, sehingga tersisa 400 hari-orang. Dengan 15 pekerja, sisanya selesai dalam 400 ÷ 15 ≈ 26,7 hari, dibulatkan menjadi 27 hari.",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "segitiga",
        "segitiga@90#separuh",
        "segitiga@180#penuh",
        "segitiga@270",
        "?",
      ],
    },
    opsi: {
      A: "Segitiga tegak terisi separuh",
      B: "Segitiga tegak bergaris",
      C: "Segitiga terbalik terisi penuh",
      D: "Segitiga diputar 90 derajat",
    },
    opsiFigur: {
      A: "segitiga#separuh",
      B: "segitiga",
      C: "segitiga@180#penuh",
      D: "segitiga@90",
    },
    kunci: "A",
    pembahasan:
      "Dua aturan berjalan bersamaan: sudutnya bertambah 90 derajat setiap langkah, dan isinya berputar bergaris, separuh, penuh, bergaris, lalu separuh. Langkah kelima kembali ke 0 derajat dan giliran terisi separuh.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran*2",
        "lingkaran*4",
        "bintang*4",
        "bintang*2",
        "bintang",
        "silang",
        "silang*2",
        "?",
      ],
    },
    opsi: {
      A: "Empat silang",
      B: "Satu silang",
      C: "Dua silang",
      D: "Tiga silang",
    },
    opsiFigur: {
      A: "silang*4",
      B: "silang",
      C: "silang*2",
      D: "silang*3",
    },
    kunci: "A",
    pembahasan:
      "Baris pertama dan ketiga berlipat dua ke kanan, sedangkan baris kedua justru terbagi dua — arahnya berselang antarbaris. Baris ketiga berjalan 1, 2, lalu 4.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "persegi",
        "belahketupat",
        "persegi@45",
        "belahketupat@45",
        "persegi@90",
        "?",
      ],
    },
    opsi: {
      A: "Belah ketupat diputar 90 derajat",
      B: "Belah ketupat pada kedudukan semula",
      C: "Persegi diputar 90 derajat",
      D: "Belah ketupat diputar 45 derajat",
    },
    opsiFigur: {
      A: "belahketupat@90",
      B: "belahketupat",
      C: "persegi@90",
      D: "belahketupat@45",
    },
    kunci: "A",
    pembahasan:
      "Bentuknya berganti-ganti antara persegi dan belah ketupat, sementara setiap pasangan bertambah 45 derajat. Pasangan ketiga memakai 90 derajat, dan giliran belah ketupat.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "garis",
        "garis@30",
        "garis@60",
        "garis@90",
        "?",
      ],
    },
    opsi: {
      A: "Garis diputar 120 derajat",
      B: "Garis mendatar",
      C: "Garis diputar 135 derajat",
      D: "Garis diputar 150 derajat",
    },
    opsiFigur: {
      A: "garis@120",
      B: "garis",
      C: "garis@135",
      D: "garis@150",
    },
    kunci: "A",
    pembahasan:
      "Garis berputar 30 derajat setiap langkah: 0, 30, 60, 90, lalu 120 derajat. Pilihan 135 dan 150 derajat memakai besar putaran yang lain.",
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
        "panah@120",
        "panah@240",
        "panah",
        "panah@240",
        "panah",
        "?",
      ],
    },
    opsi: {
      A: "Panah diputar 120 derajat",
      B: "Panah diputar 240 derajat",
      C: "Panah mengarah ke kanan",
      D: "Panah diputar 180 derajat",
    },
    opsiFigur: {
      A: "panah@120",
      B: "panah@240",
      C: "panah",
      D: "panah@180",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat ketiga kedudukan — 0, 120, dan 240 derajat — tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memakai 240 dan 0 derajat, sehingga tersisa 120 derajat.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "segienam",
        "segienam*2#separuh",
        "segienam*3#penuh",
        "segienam*4",
        "?",
      ],
    },
    opsi: {
      A: "Satu segi enam terisi separuh",
      B: "Satu segi enam bergaris",
      C: "Empat segi enam terisi penuh",
      D: "Dua segi enam bergaris",
    },
    opsiFigur: {
      A: "segienam#separuh",
      B: "segienam",
      C: "segienam*4#penuh",
      D: "segienam*2",
    },
    kunci: "A",
    pembahasan:
      "Jumlahnya bertambah sampai empat lalu berputar kembali ke satu, sementara isinya berputar bergaris, separuh, penuh, bergaris, lalu separuh. Kedua aturan harus diperiksa sendiri-sendiri.",
  },
  {
    nomor: 23,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "bintang",
        "bintang#penuh",
        "silang",
        "silang#penuh",
        "belahketupat",
        "?",
      ],
    },
    opsi: {
      A: "Belah ketupat terisi penuh",
      B: "Belah ketupat bergaris",
      C: "Silang terisi penuh",
      D: "Bintang terisi penuh",
    },
    opsiFigur: {
      A: "belahketupat#penuh",
      B: "belahketupat",
      C: "silang#penuh",
      D: "bintang#penuh",
    },
    kunci: "A",
    pembahasan:
      "Setiap bentuk muncul dua kali berturut-turut: sekali bergaris, sekali terisi penuh. Belah ketupat baru muncul sekali dalam keadaan bergaris.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segilima",
        "segilima#separuh",
        "segilima#penuh",
        "segilima#separuh",
        "segilima#penuh",
        "segilima",
        "segilima#penuh",
        "segilima",
        "?",
      ],
    },
    opsi: {
      A: "Segi lima terisi separuh",
      B: "Segi lima bergaris",
      C: "Segi lima terisi penuh",
      D: "Segi enam terisi separuh",
    },
    opsiFigur: {
      A: "segilima#separuh",
      B: "segilima",
      C: "segilima#penuh",
      D: "segienam#separuh",
    },
    kunci: "A",
    pembahasan:
      "Bentuknya tetap sepanjang matriks; yang bergilir hanyalah isinya. Setiap baris memuat ketiga cara pengisian tepat satu kali, dan baris ketiga sudah memakai penuh dan bergaris.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_9: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "silang",
        "silang@30",
        "silang@60",
        "garis",
        "garis@30",
        "garis@60",
        "panah",
        "panah@30",
        "?",
      ],
    },
    opsi: {
      A: "Panah diputar 60 derajat",
      B: "Panah pada kedudukan semula",
      C: "Panah diputar 90 derajat",
      D: "Garis diputar 60 derajat",
    },
    opsiFigur: {
      A: "panah@60",
      B: "panah",
      C: "panah@90",
      D: "garis@60",
    },
    kunci: "A",
    pembahasan:
      "Bentuk ditentukan barisnya dan sudut putaran ditentukan kolomnya: 0, 30, lalu 60 derajat.",
  },
  {
    nomor: 2,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "lingkaran",
        "lingkaran*2",
        "lingkaran*4",
        "lingkaran",
        "lingkaran*2",
        "?",
      ],
    },
    opsi: {
      A: "Empat lingkaran",
      B: "Satu lingkaran",
      C: "Dua lingkaran",
      D: "Tiga lingkaran",
    },
    opsiFigur: {
      A: "lingkaran*4",
      B: "lingkaran",
      C: "lingkaran*2",
      D: "lingkaran*3",
    },
    kunci: "A",
    pembahasan:
      "Deret berulang dalam kelompok bertiga: satu, dua, empat, lalu mengulang dari awal. Sel keenam menempati kedudukan ketiga pada kelompok kedua.",
  },
  {
    nomor: 3,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "panah",
        "panah@45",
        "panah@135",
        "panah@270",
        "?",
      ],
    },
    opsi: {
      A: "Panah diputar 90 derajat",
      B: "Panah mengarah ke kanan",
      C: "Panah diputar 180 derajat",
      D: "Panah serong ke kanan-atas",
    },
    opsiFigur: {
      A: "panah@90",
      B: "panah",
      C: "panah@180",
      D: "panah@315",
    },
    kunci: "A",
    pembahasan:
      "Besar putarannya sendiri bertambah: 45, lalu 90, lalu 135 derajat. Dari 270 derajat ditambah 180 derajat menjadi 450 derajat, yang sama artinya dengan 90 derajat setelah dikurangi satu putaran penuh.",
  },
  {
    nomor: 4,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah bangun dicerminkan terhadap garis mendatar lalu dicerminkan lagi terhadap garis tegak. Perubahan itu setara dengan ...",
    opsi: {
      A: "Perputaran 180 derajat",
      B: "Kembali ke kedudukan semula",
      C: "Perputaran 90 derajat",
      D: "Pencerminan terhadap garis miring",
    },
    kunci: "A",
    pembahasan:
      "Menukar atas-bawah lalu menukar kiri-kanan sama hasilnya dengan memutar bangun setengah putaran. Urutan kedua pencerminan itu tidak mengubah hasilnya.",
  },
  {
    nomor: 5,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segienam",
        "segilima",
        "persegi",
        "segilima",
        "persegi",
        "segienam",
        "persegi",
        "segienam",
        "?",
      ],
    },
    opsi: { A: "Segi lima", B: "Segi enam", C: "Persegi", D: "Segitiga" },
    opsiFigur: {
      A: "segilima",
      B: "segienam",
      C: "persegi",
      D: "segitiga",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat ketiga bentuk tepat satu kali dan urutannya bergeser satu langkah pada baris berikutnya. Baris ketiga sudah memuat persegi dan segi enam.",
  },
  {
    nomor: 6,
    kategori: "Analogi",
    pertanyaan:
      "Bintang bergaris berbanding dua bintang terisi penuh, sebagaimana persegi bergaris berbanding ...",
    stimulus: {
      kolom: 4,
      sel: ["bintang", "bintang*2#penuh", "persegi", "?"],
    },
    opsi: {
      A: "Dua persegi terisi penuh",
      B: "Dua persegi bergaris",
      C: "Satu persegi terisi penuh",
      D: "Empat persegi terisi penuh",
    },
    opsiFigur: {
      A: "persegi*2#penuh",
      B: "persegi*2",
      C: "persegi#penuh",
      D: "persegi*4#penuh",
    },
    kunci: "A",
    pembahasan:
      "Dua perubahan terjadi sekaligus: jumlahnya menjadi dua dan isinya menjadi penuh. Keduanya harus diterapkan bersama, bukan salah satunya saja.",
  },
  {
    nomor: 7,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan tiga lainnya?",
    stimulus: {
      kolom: 4,
      sel: ["persegi", "belahketupat", "segienam", "panah"],
    },
    opsi: {
      A: "Persegi",
      B: "Belah ketupat",
      C: "Segi enam",
      D: "Panah",
    },
    opsiFigur: {
      A: "persegi",
      B: "belahketupat",
      C: "segienam",
      D: "panah",
    },
    kunci: "D",
    pembahasan:
      "Persegi, belah ketupat, dan segi enam memiliki jumlah sisi genap dan simetri berpasangan. Panah tidak simetris terhadap sumbu tegak maupun mendatar sekaligus, dan ia menunjuk satu arah — itulah yang membuatnya keluar dari kelompok.",
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
        "segitiga#separuh",
        "segitiga#penuh",
        "segitiga#separuh",
        "segitiga",
        "?",
      ],
    },
    opsi: {
      A: "Segitiga terisi separuh",
      B: "Segitiga terisi penuh",
      C: "Segitiga bergaris",
      D: "Persegi terisi separuh",
    },
    opsiFigur: {
      A: "segitiga#separuh",
      B: "segitiga#penuh",
      C: "segitiga",
      D: "persegi#separuh",
    },
    kunci: "A",
    pembahasan:
      "Isinya bergerak bolak-balik: bergaris, separuh, penuh, separuh, bergaris, lalu separuh lagi. Gerak semacam ini dikenali dari kembalinya deret ke nilai yang sudah pernah muncul.",
  },
  {
    nomor: 9,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "bintang",
        "bintang@45",
        "bintang@90",
        "bintang@45",
        "bintang@90",
        "bintang@135",
        "bintang@90",
        "bintang@135",
        "?",
      ],
    },
    opsi: {
      A: "Bintang diputar 180 derajat",
      B: "Bintang diputar 135 derajat",
      C: "Bintang pada kedudukan semula",
      D: "Bintang diputar 90 derajat",
    },
    opsiFigur: {
      A: "bintang@180",
      B: "bintang@135",
      C: "bintang",
      D: "bintang@90",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya bertambah 45 derajat ke arah kanan maupun ke arah bawah, sehingga baris ketiga berjalan 90, 135, lalu 180 derajat.",
  },
  {
    nomor: 10,
    kategori: "Rotasi",
    pertanyaan:
      "Sebuah bangun diputar 270 derajat searah jarum jam. Perputaran itu setara dengan berapa derajat berlawanan arah jarum jam?",
    opsi: { A: "90°", B: "180°", C: "270°", D: "360°" },
    kunci: "A",
    pembahasan:
      "Satu putaran penuh 360 derajat, sehingga berputar 270 derajat ke satu arah menempuh kedudukan yang sama dengan berputar 360 - 270 = 90 derajat ke arah sebaliknya.",
  },
  {
    nomor: 11,
    kategori: "Pencerminan",
    pertanyaan:
      "Manakah bentuk yang bayangannya TETAP SAMA baik dicerminkan terhadap garis tegak maupun garis mendatar?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga", "belahketupat", "panah", "garis@45"],
    },
    opsi: {
      A: "Segitiga tegak",
      B: "Belah ketupat",
      C: "Panah ke kanan",
      D: "Garis serong",
    },
    opsiFigur: {
      A: "segitiga",
      B: "belahketupat",
      C: "panah",
      D: "garis@45",
    },
    kunci: "B",
    pembahasan:
      "Belah ketupat memiliki sumbu simetri tegak sekaligus mendatar, sehingga bayangannya tidak berubah pada kedua pencerminan. Segitiga tegak hanya simetris terhadap garis tegak, dan panah maupun garis serong tidak simetris terhadap keduanya.",
  },
  {
    nomor: 12,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "persegi",
        "persegi*2#separuh",
        "persegi*4#penuh",
        "silang",
        "silang*2#separuh",
        "silang*4#penuh",
        "garis",
        "garis*2#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Empat garis terisi penuh",
      B: "Empat garis bergaris",
      C: "Dua garis terisi penuh",
      D: "Empat silang terisi penuh",
    },
    opsiFigur: {
      A: "garis*4#penuh",
      B: "garis*4",
      C: "garis*2#penuh",
      D: "silang*4#penuh",
    },
    kunci: "A",
    pembahasan:
      "Dua aturan berjalan pada kolom sekaligus: jumlahnya berlipat dua dan isinya bertambah dari bergaris ke separuh lalu penuh. Bentuknya ditentukan barisnya dan tidak berubah.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_9: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Sebagai ketua panitia, Anda mendapati anggaran kegiatan ternyata kurang dua hari sebelum pelaksanaan. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Menutup kekurangan dengan uang pribadi tanpa memberi tahu siapa pun",
      B: "Melapor kepada pembina beserta pilihan penyesuaian acara yang mungkin diambil",
      C: "Membatalkan kegiatan",
      D: "Meminta tambahan iuran dari peserta tanpa penjelasan",
    },
    kunci: "B",
    pembahasan:
      "Melapor beserta pilihan penyelesaian memberi pembina bahan memutuskan tanpa membuang waktu. Pilihan A menyembunyikan persoalan anggaran, C membuang persiapan yang sudah berjalan, dan D membebani peserta tanpa keterbukaan.",
  },
  {
    nomor: 2,
    kategori: "Integritas",
    pertanyaan:
      "Anda dipercaya memegang uang kas dan sedang sangat membutuhkan uang untuk keperluan mendesak. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Meminjam sebentar dan menggantinya sebelum diperiksa",
      B: "Tidak menyentuhnya sama sekali, dan mencari pinjaman melalui jalur lain",
      C: "Meminjam dengan mencatatnya sendiri",
      D: "Meminjam setelah memberi tahu seorang teman",
    },
    kunci: "B",
    pembahasan:
      "Uang yang dipercayakan bukan milik pemegangnya, dan niat mengembalikan tidak mengubah hal itu. Pilihan A, C, dan D sama-sama memakainya lebih dahulu; yang membedakan hanya cara mencatat atau memberi tahu.",
  },
  {
    nomor: 3,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Anda diminta menyelesaikan pekerjaan besar dalam waktu yang menurut Anda tidak cukup. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menyanggupinya dan berharap sempat",
      B: "Menyampaikan taksiran waktu Anda beserta bagian mana yang dapat selesai lebih dahulu",
      C: "Menolak sejak awal",
      D: "Mengerjakan seadanya sesuai waktu yang tersedia",
    },
    kunci: "B",
    pembahasan:
      "Menyampaikan taksiran beserta bagian yang dapat diselesaikan lebih dahulu memberi pemberi tugas pilihan yang nyata. Pilihan A menyanggupi tanpa dasar, C menutup pembicaraan, dan D menyerahkan mutu pekerjaan pada nasib.",
  },
  {
    nomor: 4,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Anda kalah tipis pada pertandingan terakhir dan wasit membuat keputusan yang Anda anggap keliru. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memprotes wasit di lapangan",
      B: "Menerima hasilnya, lalu menyampaikan keberatan melalui jalur resmi bila memang perlu",
      C: "Menyalahkan rekan satu regu",
      D: "Meninggalkan lapangan tanpa bersalaman",
    },
    kunci: "B",
    pembahasan:
      "Menerima hasil di lapangan menjaga ketertiban pertandingan, sedangkan jalur resmi adalah tempat keberatan ditimbang. Pilihan A dan D melanggar tata krama pertandingan, dan C memindahkan kekecewaan kepada rekan sendiri.",
  },
  {
    nomor: 5,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Anda menjadi penanggung jawab kebersihan dan hasil piket regu Anda dinilai buruk selama sepekan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menerima penilaiannya, mencari sebabnya bersama regu, dan menyusun pembagian yang lebih jelas",
      B: "Menyebut nama anggota yang paling sering absen kepada pembina",
      C: "Mengerjakan sendiri seluruh piket pekan berikutnya",
      D: "Meminta jabatan itu dialihkan kepada orang lain",
    },
    kunci: "A",
    pembahasan:
      "Mencari sebab bersama dan memperbaiki pembagian menyentuh akar persoalannya. Pilihan B melaporkan tanpa memperbaiki cara kerja, C menutupi kelemahan sistem dengan tenaga sendiri, dan D melepaskan tanggung jawab.",
  },
  {
    nomor: 6,
    kategori: "Kerja Sama",
    pertanyaan:
      "Dalam kerja kelompok, pendapat Anda ditolak dan kelompok memilih cara lain. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menjalankan keputusan kelompok sebaik-baiknya sambil mencatat hal yang perlu dievaluasi",
      B: "Mengerjakan bagian Anda menurut cara Anda sendiri",
      C: "Menarik diri dari kelompok",
      D: "Terus mengulang pendapat Anda sampai diterima",
    },
    kunci: "A",
    pembahasan:
      "Menjalankan keputusan bersama sambil mencatat bahan evaluasi menjaga kerja kelompok sekaligus membuka perbaikan berikutnya. Pilihan B memecah pekerjaan, C meninggalkan kelompok, dan D menghambat kerja yang sudah diputuskan.",
  },
  {
    nomor: 7,
    kategori: "Kejujuran",
    pertanyaan:
      "Seorang panitia salah menghitung dan memberi Anda uang kembalian lebih banyak. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengembalikan kelebihannya saat itu juga",
      B: "Menyimpannya karena bukan Anda yang keliru",
      C: "Mengembalikannya bila kelak ditanyakan",
      D: "Menyerahkannya kepada teman lain",
    },
    kunci: "A",
    pembahasan:
      "Mengembalikan segera menutup selisih selagi mudah ditelusuri, dan menjaga panitia dari kekurangan kas yang harus ia tanggung sendiri. Pilihan B dan C menahan yang bukan hak, sedangkan D memindahkan persoalan.",
  },
  {
    nomor: 8,
    kategori: "Menerima Kritik",
    pertanyaan:
      "Pembina menilai laporan kegiatan Anda kurang lengkap, sementara Anda merasa sudah mengikuti contoh yang diberikan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menunjukkan contoh yang Anda pakai dan menanyakan bagian mana yang masih kurang",
      B: "Mengulang laporan dari awal tanpa bertanya",
      C: "Menjelaskan bahwa contohnya memang kurang jelas",
      D: "Meminta orang lain menyusun laporannya",
    },
    kunci: "A",
    pembahasan:
      "Menunjukkan contoh yang dipakai sekaligus bertanya menyelesaikan dua hal: menjelaskan dasar kerja Anda dan memperoleh keterangan yang kurang. Pilihan B membuang waktu tanpa arah, C berhenti pada pembelaan, dan D memindahkan pekerjaan.",
  },
  {
    nomor: 9,
    kategori: "Kepedulian",
    pertanyaan:
      "Anda melihat adik kelas kesulitan membawa barang berat sementara Anda sedang terburu-buru. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Berjalan terus karena Anda sedang terburu-buru",
      B: "Berhenti sebentar membantunya atau memanggil orang lain yang dapat menolong",
      C: "Menyuruhnya membawa sedikit demi sedikit",
      D: "Menanyakan mengapa ia tidak meminta bantuan sejak tadi",
    },
    kunci: "B",
    pembahasan:
      "Membantu sebentar atau memanggilkan bantuan sama-sama menyelesaikan keadaannya tanpa mengorbankan keperluan Anda sepenuhnya. Pilihan A membiarkan, sedangkan C dan D memberi nasihat tanpa menolong.",
  },
  {
    nomor: 10,
    kategori: "Evaluasi Diri",
    pertanyaan:
      "Anda menyadari sering menunda pekerjaan meskipun sudah berkali-kali berniat berubah. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Berjanji lebih keras kepada diri sendiri",
      B: "Mengubah keadaan yang memicunya — misalnya menyiapkan bahan sejak malam dan menetapkan waktu mulai yang tetap",
      C: "Menerima bahwa itu memang watak Anda",
      D: "Meminta teman terus mengingatkan Anda",
    },
    kunci: "B",
    pembahasan:
      "Niat yang berulang kali gagal biasanya tidak diperbaiki oleh niat yang lebih keras, melainkan oleh perubahan keadaan yang memicunya. Pilihan A mengulang cara yang sudah terbukti tidak cukup, C menyerah, dan D bergantung pada orang lain.",
  },
  {
    nomor: 11,
    kategori: "Keberanian Moral",
    pertanyaan:
      "Anda diminta menandatangani laporan kegiatan yang Anda tahu isinya tidak sesuai kenyataan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menandatanganinya karena diminta atasan kegiatan",
      B: "Menolak menandatangani sebelum isinya diperbaiki, dan menjelaskan bagian mana yang tidak sesuai",
      C: "Menandatanganinya sambil mencatat keberatan di tempat lain",
      D: "Menghindar agar tidak perlu menandatangani",
    },
    kunci: "B",
    pembahasan:
      "Tanda tangan adalah pernyataan bahwa isinya benar, sehingga menolak sampai diperbaiki adalah satu-satunya sikap yang jujur sekaligus membuka jalan perbaikan. Pilihan A dan C tetap menandatangani, sedangkan D menghindari tanpa menyelesaikan.",
  },
  {
    nomor: 12,
    kategori: "Penyesuaian Diri",
    pertanyaan:
      "Anda dipindahkan ke kamar dengan kebiasaan tidur yang jauh lebih larut daripada Anda. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengikuti kebiasaan mereka agar tidak berbeda sendiri",
      B: "Membicarakan kesepakatan bersama mengenai jam tenang, dan sementara itu menyesuaikan diri dengan cara Anda sendiri",
      C: "Meminta pindah kamar lagi",
      D: "Menegur mereka setiap malam",
    },
    kunci: "B",
    pembahasan:
      "Kesepakatan bersama menyelesaikan persoalan tanpa memaksa satu pihak mengalah seluruhnya. Pilihan A mengorbankan kesehatan sendiri, C menghindari penyesuaian, dan D menimbulkan perselisihan yang berulang setiap malam.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_9: PaketPsikotes = {
  id: "psi-9",
  nomor: 9,
  nama: "Try Out Psikotes 9",
  deskripsi:
    "Simulasi lanjutan. Kata yang dipakai lebih jarang, perhitungannya dua tahap, dan pola gambarnya tidak langsung terbaca pada dua gambar pertama.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_9,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Cari satu aturan yang berlaku untuk seluruh gambar, bukan yang hanya cocok untuk dua gambar pertama. Pada soal matriks, periksa polanya dari arah baris dan dari arah kolom — jawaban yang benar cocok dari kedua arah.",
      durasiMenit: 10,
      soal: VISUAL_9,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_9,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_9,
    },
  ],
};
