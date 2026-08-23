import { EPPS_PAKET_6 } from "@/lib/psikotes/epps-lanjutan";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 6.
 *
 * Bertumpu pada ketelitian. Banyak butir di sini sengaja menyisipkan satu kata
 * atau satu angka yang mudah terlewat — "bukan", "kecuali", satuan yang
 * berbeda — sehingga peserta berlatih membaca soal sampai selesai sebelum
 * melihat pilihan jawabannya.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_6: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Kata berikut bersinonim dengan TELADAN, KECUALI ...",
    opsi: { A: "Panutan", B: "Contoh", C: "Acuan", D: "Bawahan" },
    kunci: "D",
    pembahasan:
      "Panutan, contoh, dan acuan sama-sama menunjuk sesuatu yang diikuti. Bawahan menunjuk kedudukan di bawah orang lain, sehingga ia yang bukan sinonim. Perhatikan kata KECUALI pada pertanyaannya.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata TERAMPIL adalah ...",
    opsi: { A: "Cekatan", B: "Canggung", C: "Cerdas", D: "Cermat" },
    kunci: "B",
    pembahasan:
      "Terampil berarti cakap menjalankan sesuatu dengan mudah dan lancar; lawannya canggung, yaitu kikuk dan tidak lancar. Cekatan justru bersinonim, sedangkan cerdas dan cermat menyangkut hal yang lain.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "GURU : MENGAJAR = HAKIM : ...",
    opsi: { A: "Pengadilan", B: "Mengadili", C: "Hukum", D: "Terdakwa" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah pelaku dengan pekerjaannya. Guru mengajar, hakim mengadili. Pengadilan adalah tempatnya, hukum adalah dasarnya, dan terdakwa adalah pihak yang dihadapinya.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "LAPAR : MAKAN = GELAP : ...",
    opsi: { A: "Malam", B: "Lampu", C: "Menyalakan lampu", D: "Terang" },
    kunci: "C",
    pembahasan:
      "Hubungannya adalah keadaan dengan tindakan yang mengatasinya. Lapar diatasi dengan makan — sebuah tindakan — sehingga gelap diatasi dengan menyalakan lampu. Lampu adalah bendanya, terang adalah hasilnya, dan malam adalah penyebabnya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Sebagian pemain basket bertubuh tinggi. Semua yang bertubuh tinggi mudah meraih papan. Kesimpulan yang PASTI benar adalah ...",
    opsi: {
      A: "Semua pemain basket mudah meraih papan",
      B: "Sebagian pemain basket mudah meraih papan",
      C: "Semua yang mudah meraih papan adalah pemain basket",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "B",
    pembahasan:
      "Sebagian pemain basket berada di dalam kelompok bertubuh tinggi, dan seluruh orang bertubuh tinggi mudah meraih papan. Maka sebagian pemain basket itu pasti mudah meraih papan. Pilihan A melompat kepada seluruh pemain.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Jika lampu menyala, mesin bekerja. Mesin tidak bekerja. Manakah yang PASTI benar?",
    opsi: {
      A: "Lampu menyala",
      B: "Lampu tidak menyala",
      C: "Mesin rusak",
      D: "Tidak dapat disimpulkan",
    },
    kunci: "B",
    pembahasan:
      "Menyalanya lampu selalu berakibat mesin bekerja. Karena akibatnya tidak terjadi, sebabnya juga tidak terjadi: lampu tidak menyala. Pilihan C menambahkan penjelasan yang tidak disebutkan.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang BUKAN sekelompok dengan yang lain?",
    opsi: { A: "Segitiga", B: "Kerucut", C: "Persegi", D: "Lingkaran" },
    kunci: "B",
    pembahasan:
      "Segitiga, persegi, dan lingkaran adalah bangun datar. Kerucut adalah bangun ruang, sehingga ia yang keluar dari kelompok. Perhatikan kata BUKAN pada pertanyaannya.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan:
      'Makna peribahasa "Tong kosong nyaring bunyinya" adalah ...',
    opsi: {
      A: "Orang yang banyak bicara biasanya sedikit ilmunya",
      B: "Barang kosong lebih ringan dibawa",
      C: "Suara keras menandakan keberanian",
      D: "Orang miskin banyak keinginan",
    },
    kunci: "A",
    pembahasan:
      "Tong yang kosong berbunyi paling nyaring bila dipukul, dan itu menjadi kiasan bagi orang yang banyak bicara tetapi dangkal ilmunya. Pilihan B membaca peribahasa itu secara harfiah.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah tali panjangnya 2,4 meter dipotong menjadi bagian-bagian sepanjang 30 sentimeter. Berapa potongan yang diperoleh?",
    opsi: { A: "6", B: "8", C: "10", D: "12" },
    kunci: "B",
    pembahasan:
      "Samakan satuannya lebih dahulu: 2,4 meter = 240 sentimeter. Maka 240 ÷ 30 = 8 potongan. Kekeliruan yang paling sering terjadi adalah membagi 2,4 dengan 30 tanpa menyamakan satuan.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 2, 6, 12, 20, 30, ...",
    opsi: { A: "38", B: "40", C: "42", D: "45" },
    kunci: "C",
    pembahasan:
      "Selisih antarsuku adalah 4, 6, 8, 10 — bertambah dua tiap langkah — sehingga selisih berikutnya 12 dan 30 + 12 = 42. Deret ini juga dapat dibaca sebagai n × (n + 1).",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kelas berisi 36 siswa. Bila 2/3 di antaranya perempuan, berapa siswa laki-laki?",
    opsi: { A: "9", B: "12", C: "18", D: "24" },
    kunci: "B",
    pembahasan:
      "Perempuan menempati 2/3 bagian, sehingga laki-laki menempati sisanya, yaitu 1/3 dari 36 = 12 orang. Jawaban 24 adalah jumlah siswa perempuan — perhatikan yang ditanyakan.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah barang seharga Rp250.000 memperoleh potongan berturut-turut 20% lalu 10%. Berapa harga akhirnya?",
    opsi: { A: "Rp175.000", B: "Rp180.000", C: "Rp190.000", D: "Rp200.000" },
    kunci: "B",
    pembahasan:
      "Potongan bertingkat dihitung berurutan, bukan dijumlahkan. Setelah 20%, harganya 200.000; potongan 10% dari 200.000 adalah 20.000, sehingga harga akhirnya 180.000. Menjumlahkan menjadi 30% akan memberi 175.000 dan itu keliru.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kereta berangkat pukul 07.45 dan tiba pukul 11.20. Berapa lama perjalanannya?",
    opsi: {
      A: "3 jam 25 menit",
      B: "3 jam 35 menit",
      C: "4 jam 25 menit",
      D: "4 jam 35 menit",
    },
    kunci: "B",
    pembahasan:
      "Dari 07.45 ke 11.45 berlalu 4 jam, lalu dikurangi 25 menit karena tibanya pukul 11.20, sehingga 3 jam 35 menit. Menghitung selisih jam dan menit secara terpisah akan memberi hasil yang keliru bila menitnya tidak cukup dikurangkan.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Rata-rata tiga bilangan berurutan adalah 21. Berapa bilangan yang terbesar?",
    opsi: { A: "20", B: "21", C: "22", D: "23" },
    kunci: "C",
    pembahasan:
      "Pada tiga bilangan berurutan, rata-ratanya sama dengan bilangan yang di tengah, yaitu 21. Maka ketiganya 20, 21, dan 22, sehingga yang terbesar 22.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Luas sebuah persegi 144 cm². Berapa kelilingnya?",
    opsi: { A: "36 cm", B: "48 cm", C: "56 cm", D: "576 cm" },
    kunci: "B",
    pembahasan:
      "Sisi persegi adalah akar dari luasnya, yaitu 12 cm. Kelilingnya 4 × 12 = 48 cm. Jawaban 576 cm muncul bila luas keliru dikalikan empat tanpa mengakar lebih dahulu.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 64, 32, 16, 8, ...",
    opsi: { A: "2", B: "4", C: "6", D: "0" },
    kunci: "B",
    pembahasan:
      "Setiap suku separuh dari suku sebelumnya, sehingga 8 ÷ 2 = 4. Jawaban 2 melompati satu langkah, dan 6 mengira polanya pengurangan tetap.",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segienam", "segilima", "persegi", "?"],
    },
    opsi: { A: "Segitiga", B: "Lingkaran", C: "Segi enam", D: "Bintang" },
    opsiFigur: {
      A: "segitiga",
      B: "lingkaran",
      C: "segienam",
      D: "bintang",
    },
    kunci: "A",
    pembahasan:
      "Banyak sisinya berkurang satu setiap langkah: 6, 5, 4, lalu 3. Perhatikan arahnya berkurang, bukan bertambah — inilah yang paling sering terbaca terbalik.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["panah@180", "panah@135", "panah@90", "panah@45", "?"],
    },
    opsi: {
      A: "Panah mengarah ke kanan",
      B: "Panah mengarah ke kiri",
      C: "Panah mengarah ke atas",
      D: "Panah serong ke kiri-bawah",
    },
    opsiFigur: {
      A: "panah",
      B: "panah@180",
      C: "panah@270",
      D: "panah@135",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya berkurang 45 derajat setiap langkah: 180, 135, 90, 45, lalu 0 derajat — yaitu mengarah ke kanan. Pilihan ke kiri hanya mengulang gambar pertama.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "silang#penuh",
        "silang#separuh",
        "silang",
        "persegi#penuh",
        "persegi#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Persegi bergaris",
      B: "Persegi terisi penuh",
      C: "Silang bergaris",
      D: "Persegi terisi separuh",
    },
    opsiFigur: {
      A: "persegi",
      B: "persegi#penuh",
      C: "silang",
      D: "persegi#separuh",
    },
    kunci: "A",
    pembahasan:
      "Dua kelompok bertiga, dan isinya berkurang bertahap: penuh, separuh, lalu bergaris. Kelompok kedua memakai persegi dan baru sampai separuh.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran*2", "lingkaran*4", "lingkaran*3", "?"],
    },
    opsi: {
      A: "Satu lingkaran",
      B: "Dua lingkaran",
      C: "Empat lingkaran",
      D: "Tiga lingkaran",
    },
    opsiFigur: {
      A: "lingkaran",
      B: "lingkaran*2",
      C: "lingkaran*4",
      D: "lingkaran*3",
    },
    kunci: "A",
    pembahasan:
      "Jumlahnya bergerak naik-turun dengan langkah yang mengecil: 2, lalu naik dua menjadi 4, lalu turun satu menjadi 3, lalu turun dua menjadi 1. Ditulis sebagai selisih, polanya +2, -1, -2.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "persegi",
        "persegi#separuh",
        "persegi#penuh",
        "silang",
        "silang#separuh",
        "silang#penuh",
        "garis",
        "garis#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Garis bergaris",
      B: "Garis terisi penuh",
      C: "Silang terisi penuh",
      D: "Persegi terisi penuh",
    },
    opsiFigur: {
      A: "garis",
      B: "garis#penuh",
      C: "silang#penuh",
      D: "persegi#penuh",
    },
    kunci: "B",
    pembahasan:
      "Baris menentukan bentuk dan kolom menentukan isi. Sel yang ditanyakan berada di baris garis dan kolom terisi penuh.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["bintang", "lingkaran", "bintang", "lingkaran", "?"],
    },
    opsi: { A: "Bintang", B: "Lingkaran", C: "Persegi", D: "Segitiga" },
    opsiFigur: {
      A: "bintang",
      B: "lingkaran",
      C: "persegi",
      D: "segitiga",
    },
    kunci: "A",
    pembahasan:
      "Dua bentuk berselang-seling; kedudukan ganjil selalu ditempati bintang, dan yang ditanyakan adalah kedudukan kelima.",
  },
  {
    nomor: 23,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segilima", "segilima@72", "segilima@144", "?"],
    },
    opsi: {
      A: "Segi lima diputar 216 derajat",
      B: "Segi lima pada kedudukan semula",
      C: "Segi lima terisi penuh",
      D: "Segi enam diputar 216 derajat",
    },
    opsiFigur: {
      A: "segilima@216",
      B: "segilima",
      C: "segilima#penuh",
      D: "segienam@216",
    },
    kunci: "A",
    pembahasan:
      "Perputarannya tetap 72 derajat setiap langkah: 0, 72, 144, lalu 216 derajat. Bentuk dan isinya tidak boleh ikut berubah.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segitiga",
        "segitiga*2",
        "segitiga*3",
        "segienam",
        "segienam*2",
        "segienam*3",
        "silang",
        "silang*2",
        "?",
      ],
    },
    opsi: {
      A: "Dua silang",
      B: "Tiga silang",
      C: "Tiga segi enam",
      D: "Empat silang",
    },
    opsiFigur: {
      A: "silang*2",
      B: "silang*3",
      C: "segienam*3",
      D: "silang*4",
    },
    kunci: "B",
    pembahasan:
      "Bentuk ditentukan barisnya dan jumlah ditentukan kolomnya: satu, dua, tiga. Sel yang ditanyakan berada di baris silang dan kolom ketiga.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_6: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "bintang",
        "bintang#separuh",
        "bintang#penuh",
        "lingkaran",
        "lingkaran#separuh",
        "lingkaran#penuh",
        "segitiga",
        "segitiga#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Segitiga bergaris",
      B: "Segitiga terisi separuh",
      C: "Segitiga terisi penuh",
      D: "Lingkaran terisi penuh",
    },
    opsiFigur: {
      A: "segitiga",
      B: "segitiga#separuh",
      C: "segitiga#penuh",
      D: "lingkaran#penuh",
    },
    kunci: "C",
    pembahasan:
      "Baris menentukan bentuk dan kolom menentukan isi. Sel yang ditanyakan berada di baris segitiga dan kolom terisi penuh.",
  },
  {
    nomor: 2,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["garis", "garis*2", "garis*3", "garis*4", "?"],
    },
    opsi: {
      A: "Tiga garis",
      B: "Empat garis",
      C: "Dua garis",
      D: "Satu garis",
    },
    opsiFigur: {
      A: "garis*3",
      B: "garis*4",
      C: "garis*2",
      D: "garis",
    },
    kunci: "D",
    pembahasan:
      "Jumlahnya bertambah sampai empat, lalu deret ini berputar kembali ke awal — pada bank gambar ini satu sel paling banyak memuat empat lambang, sehingga langkah kelima kembali ke satu garis. Pola berputar semacam ini dikenali dari kembalinya deret ke bentuk awalnya, bukan dari terus bertambah.",
  },
  {
    nomor: 3,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["silang", "silang@15", "silang@30", "?"],
    },
    opsi: {
      A: "Silang diputar 45 derajat",
      B: "Silang diputar 60 derajat",
      C: "Silang pada kedudukan semula",
      D: "Silang terisi penuh",
    },
    opsiFigur: {
      A: "silang@45",
      B: "silang@60",
      C: "silang",
      D: "silang#penuh",
    },
    kunci: "A",
    pembahasan:
      "Perputarannya tetap 15 derajat setiap langkah: 0, 15, 30, lalu 45 derajat. Pilihan 60 derajat melompati satu langkah.",
  },
  {
    nomor: 4,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah bangun dicerminkan terhadap garis tegak lalu dicerminkan lagi terhadap garis mendatar. Perubahan itu setara dengan ...",
    opsi: {
      A: "Perputaran 90 derajat",
      B: "Perputaran 180 derajat",
      C: "Kembali ke kedudukan semula",
      D: "Perbesaran bangun",
    },
    kunci: "B",
    pembahasan:
      "Menukar kiri-kanan lalu menukar atas-bawah sama hasilnya dengan memutar bangun setengah putaran. Pencerminan tidak mengubah ukuran, sehingga perbesaran tidak mungkin terjadi.",
  },
  {
    nomor: 5,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "panah",
        "panah@45",
        "panah@90",
        "panah@45",
        "panah@90",
        "panah@135",
        "panah@90",
        "panah@135",
        "?",
      ],
    },
    opsi: {
      A: "Panah mengarah ke kiri",
      B: "Panah serong ke kiri-bawah",
      C: "Panah mengarah ke bawah",
      D: "Panah mengarah ke kanan",
    },
    opsiFigur: {
      A: "panah@180",
      B: "panah@135",
      C: "panah@90",
      D: "panah",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya bertambah 45 derajat baik ke arah kanan maupun ke arah bawah. Baris ketiga berjalan 90, 135, lalu 180 derajat — yaitu mengarah ke kiri. Kedua arah pembacaan memberi jawaban yang sama.",
  },
  {
    nomor: 6,
    kategori: "Analogi",
    pertanyaan:
      "Persegi berbanding empat persegi, sebagaimana bintang berbanding ...",
    stimulus: {
      kolom: 4,
      sel: ["persegi", "persegi*4", "bintang", "?"],
    },
    opsi: {
      A: "Dua bintang",
      B: "Tiga bintang",
      C: "Empat bintang",
      D: "Empat persegi",
    },
    opsiFigur: {
      A: "bintang*2",
      B: "bintang*3",
      C: "bintang*4",
      D: "persegi*4",
    },
    kunci: "C",
    pembahasan:
      "Perubahan dari gambar pertama ke kedua adalah pelipatgandaan jumlah menjadi empat, tanpa mengganti bentuk maupun isi. Perubahan yang sama diterapkan pada bintang.",
  },
  {
    nomor: 7,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan tiga lainnya?",
    stimulus: {
      kolom: 4,
      sel: ["persegi", "belahketupat", "segilima", "garis"],
    },
    opsi: {
      A: "Persegi",
      B: "Belah ketupat",
      C: "Segi lima",
      D: "Garis",
    },
    opsiFigur: {
      A: "persegi",
      B: "belahketupat",
      C: "segilima",
      D: "garis",
    },
    kunci: "D",
    pembahasan:
      "Persegi, belah ketupat, dan segi lima adalah bangun tertutup yang memiliki luas. Garis tidak menutup ruang mana pun, sehingga ia yang keluar dari kelompok.",
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
        "segitiga@180",
        "segitiga",
        "segitiga@180",
        "segitiga",
        "?",
      ],
    },
    opsi: {
      A: "Segitiga pada kedudukan semula",
      B: "Segitiga terbalik",
      C: "Segitiga terisi penuh",
      D: "Persegi terbalik",
    },
    opsiFigur: {
      A: "segitiga",
      B: "segitiga@180",
      C: "segitiga#penuh",
      D: "persegi@180",
    },
    kunci: "B",
    pembahasan:
      "Segitiga berbalik-balik pada setiap langkah. Kedudukan ganjil tegak dan kedudukan genap terbalik, sehingga kedudukan keenam adalah segitiga terbalik.",
  },
  {
    nomor: 9,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "belahketupat",
        "silang",
        "garis",
        "silang",
        "garis",
        "belahketupat",
        "garis",
        "belahketupat",
        "?",
      ],
    },
    opsi: { A: "Belah ketupat", B: "Silang", C: "Garis", D: "Persegi" },
    opsiFigur: {
      A: "belahketupat",
      B: "silang",
      C: "garis",
      D: "persegi",
    },
    kunci: "B",
    pembahasan:
      "Setiap baris memuat ketiga lambang tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memuat garis dan belah ketupat, sehingga tersisa silang.",
  },
  {
    nomor: 10,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["panah@270", "panah@180", "panah@90", "?"],
    },
    opsi: {
      A: "Panah mengarah ke kanan",
      B: "Panah mengarah ke atas",
      C: "Panah mengarah ke kiri",
      D: "Panah mengarah ke bawah",
    },
    opsiFigur: {
      A: "panah",
      B: "panah@270",
      C: "panah@180",
      D: "panah@90",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya berkurang 90 derajat setiap langkah: 270, 180, 90, lalu 0 derajat — yaitu mengarah ke kanan. Perhatikan arah putarannya berlawanan dengan yang biasa dijumpai.",
  },
  {
    nomor: 11,
    kategori: "Pencerminan",
    pertanyaan:
      "Manakah bentuk yang bayangannya TETAP SAMA ketika dicerminkan terhadap garis tegak?",
    stimulus: {
      kolom: 4,
      sel: ["panah", "segitiga", "panah@45", "garis@45"],
    },
    opsi: {
      A: "Panah mengarah ke kanan",
      B: "Segitiga tegak",
      C: "Panah serong",
      D: "Garis serong",
    },
    opsiFigur: {
      A: "panah",
      B: "segitiga",
      C: "panah@45",
      D: "garis@45",
    },
    kunci: "B",
    pembahasan:
      "Segitiga tegak memiliki sumbu simetri tegak, sehingga sisi kiri dan kanannya sama dan bayangannya tidak berubah. Panah dan garis serong seluruhnya condong ke satu sisi, sehingga bayangannya condong ke sisi yang berlawanan.",
  },
  {
    nomor: 12,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran*2",
        "lingkaran*3",
        "lingkaran*2",
        "lingkaran*3",
        "lingkaran*4",
        "lingkaran*3",
        "lingkaran*4",
        "?",
      ],
    },
    opsi: {
      A: "Tiga lingkaran",
      B: "Empat lingkaran",
      C: "Dua lingkaran",
      D: "Satu lingkaran",
    },
    opsiFigur: {
      A: "lingkaran*3",
      B: "lingkaran*4",
      C: "lingkaran*2",
      D: "lingkaran",
    },
    kunci: "B",
    pembahasan:
      "Jumlahnya bertambah satu ke arah kanan dan ke arah bawah, tetapi satu sel paling banyak memuat empat lambang. Baris ketiga berjalan 3, 4, lalu tetap 4 karena sudah menyentuh batas tampilannya.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_6: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Ketelitian",
    pertanyaan:
      "Anda menyerahkan laporan lalu menyadari ada satu angka yang keliru. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menunggu apakah kekeliruan itu diketahui",
      B: "Segera memberitahukannya dan menyerahkan perbaikannya",
      C: "Memperbaiki diam-diam pada arsip Anda sendiri",
      D: "Menjelaskan bahwa angka itu tidak terlalu berpengaruh",
    },
    kunci: "B",
    pembahasan:
      "Melapor segera membatasi akibat kekeliruan selagi masih kecil. Pilihan A menyerahkan keadaan pada nasib, C hanya membereskan salinan pribadi sementara yang dipakai orang lain tetap keliru, dan D mengecilkan persoalan tanpa memperbaikinya.",
  },
  {
    nomor: 2,
    kategori: "Kepatuhan",
    pertanyaan:
      "Anda diminta mengumpulkan tugas dalam format tertentu, tetapi format Anda sendiri terasa lebih rapi. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memakai format Anda karena hasilnya lebih baik",
      B: "Mengikuti format yang diminta, lalu mengusulkan format Anda sebagai masukan",
      C: "Mengumpulkan dua-duanya sekaligus",
      D: "Mengumpulkan format Anda dan meminta maaf kemudian",
    },
    kunci: "B",
    pembahasan:
      "Format seragam biasanya ada agar seluruh tugas dapat diperiksa dengan satu cara. Mengikuti lebih dahulu lalu mengusulkan menjaga ketertiban sekaligus membuka perbaikan. Pilihan A dan D mendahulukan penilaian sendiri, dan C menambah pekerjaan pemeriksa.",
  },
  {
    nomor: 3,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Anda kelelahan setelah kegiatan seharian, lalu seorang adik kelas bertanya berulang-ulang tentang hal yang sama. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menjawab sekenanya agar cepat selesai",
      B: "Mengatakan Anda sedang lelah dan menjanjikan waktu untuk menjelaskannya nanti",
      C: "Menyuruhnya bertanya kepada orang lain",
      D: "Menahan diri dan tetap menjawab meski dengan nada tinggi",
    },
    kunci: "B",
    pembahasan:
      "Menyatakan keadaan diri dengan jujur sambil menjanjikan waktu menjaga hubungan tetap baik tanpa memaksakan diri. Pilihan A memberi jawaban yang tidak berguna, C mengalihkan tanpa penjelasan, dan D tetap melukai meski niatnya menahan diri.",
  },
  {
    nomor: 4,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Tugas kelompok Anda mendapat nilai rendah karena bagian yang Anda kerjakan tidak lengkap. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengakuinya kepada kelompok dan menawarkan memperbaiki bagian itu",
      B: "Menyebut bahwa bagian teman lain juga kurang",
      C: "Menerima nilainya tanpa mengatakan apa pun",
      D: "Meminta guru menilai secara perseorangan",
    },
    kunci: "A",
    pembahasan:
      "Mengakui dan menawarkan perbaikan memulihkan kepercayaan kelompok sekaligus membuka kemungkinan nilai diperbaiki. Pilihan B memindahkan perhatian, C membiarkan kelompok menanggung tanpa penjelasan, dan D mencari jalan keluar bagi diri sendiri.",
  },
  {
    nomor: 5,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Anda diminta tampil menggantikan teman yang berhalangan, dengan persiapan hanya satu jam. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menolak karena persiapannya terlalu singkat",
      B: "Menerima, memakai satu jam itu untuk menguasai bagian yang paling penting, dan menyampaikan apa adanya",
      C: "Menerima lalu membaca seluruh naskah di panggung",
      D: "Menerima tetapi meminta acaranya diundur",
    },
    kunci: "B",
    pembahasan:
      "Waktu yang sempit menuntut pemilihan bagian yang paling penting, bukan penguasaan seluruhnya. Pilihan A menutup kesempatan, C menyerahkan seluruh penampilan pada naskah, dan D memindahkan beban kepada panitia dan hadirin.",
  },
  {
    nomor: 6,
    kategori: "Kejujuran",
    pertanyaan:
      "Seorang teman meminta Anda merahasiakan bahwa ia mencontek saat ulangan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Merahasiakannya demi persahabatan",
      B: "Mendorongnya mengakui sendiri kepada guru, dan menjelaskan bahwa Anda tidak dapat ikut menutupinya",
      C: "Langsung melaporkannya tanpa berbicara dengannya",
      D: "Mengatakan bahwa Anda tidak melihat apa-apa",
    },
    kunci: "B",
    pembahasan:
      "Mendorongnya mengakui sendiri memberi kesempatan memperbaiki tanpa Anda ikut menutupi pelanggaran. Pilihan A dan D menjadikan Anda bagian dari pelanggarannya, sedangkan C melewatkan langkah yang lebih dahulu dapat ditempuh.",
  },
  {
    nomor: 7,
    kategori: "Kepedulian",
    pertanyaan:
      "Anda melihat seorang teman kesulitan mengikuti pelajaran tetapi ia enggan bertanya. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membiarkannya karena ia sendiri yang enggan",
      B: "Menawarkan belajar bersama tanpa menyinggung kekurangannya",
      C: "Memberitahukan kesulitannya kepada guru di depan kelas",
      D: "Meminjamkan catatan Anda dan menganggap persoalan selesai",
    },
    kunci: "B",
    pembahasan:
      "Belajar bersama membuka bantuan tanpa membuatnya merasa disorot. Pilihan A membiarkan, C mempermalukan, dan D memberi bahan tanpa memastikan ia memahaminya.",
  },
  {
    nomor: 8,
    kategori: "Pengelolaan Waktu",
    pertanyaan:
      "Anda punya waktu luang dua jam dan tiga pekerjaan yang semuanya belum mendesak. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Beristirahat saja karena tidak ada yang mendesak",
      B: "Mengerjakan bagian awal pekerjaan yang paling besar",
      C: "Mengerjakan sedikit dari ketiganya",
      D: "Menunggu sampai salah satunya menjadi mendesak",
    },
    kunci: "B",
    pembahasan:
      "Pekerjaan besar paling sering menjadi sumber penumpukan di akhir; memulainya saat masih longgar mengurangi risiko itu. Pilihan C memecah perhatian, sedangkan A dan D membiarkan waktu longgar berlalu tanpa hasil.",
  },
  {
    nomor: 9,
    kategori: "Menerima Kritik",
    pertanyaan:
      "Teman satu regu mengatakan cara Anda memimpin terlalu kaku. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menanyakan contoh kejadiannya lalu menimbang mana yang perlu diubah",
      B: "Menjelaskan bahwa ketegasan memang diperlukan",
      C: "Mengubah seluruh cara memimpin agar tidak dikritik lagi",
      D: "Menganggapnya tidak menyukai Anda secara pribadi",
    },
    kunci: "A",
    pembahasan:
      "Meminta contoh mengubah kritik yang umum menjadi bahan yang dapat ditimbang. Pilihan B menolak sebelum memeriksa, C berubah tanpa pertimbangan, dan D membaca kritik sebagai serangan pribadi sehingga isinya tidak pernah diperiksa.",
  },
  {
    nomor: 10,
    kategori: "Integritas",
    pertanyaan:
      "Anda menemukan uang di lorong asrama tanpa tanda pemiliknya. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menyerahkannya kepada pengasuh dan meminta diumumkan",
      B: "Menyimpannya sampai ada yang mencari",
      C: "Membiarkannya di tempat semula",
      D: "Memakainya karena tidak ada tandanya",
    },
    kunci: "A",
    pembahasan:
      "Menyerahkan kepada pengasuh memberi jalan resmi bagi pemiliknya menemukan kembali. Pilihan B menempatkan Anda pada dugaan yang tidak perlu, C membiarkan risikonya, dan D mengambil yang bukan hak.",
  },
  {
    nomor: 11,
    kategori: "Hubungan Sosial",
    pertanyaan:
      "Dua teman dekat Anda berselisih dan masing-masing meminta dukungan Anda. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memihak yang menurut Anda paling benar",
      B: "Menjauhi keduanya sampai perselisihannya reda",
      C: "Mendengarkan keduanya dan mengajak mereka berbicara langsung satu sama lain",
      D: "Menyampaikan pesan bolak-balik di antara keduanya",
    },
    kunci: "C",
    pembahasan:
      "Mempertemukan mereka menyelesaikan sebabnya, bukan sekadar mengurangi ketegangan sesaat. Pilihan A memperlebar jarak, B meninggalkan keduanya, dan D membuat Anda menjadi perantara yang justru menghambat pembicaraan langsung.",
  },
  {
    nomor: 12,
    kategori: "Kemauan Belajar",
    pertanyaan:
      "Anda diberi tugas memakai perangkat lunak yang belum pernah Anda pakai. Langkah pertama yang paling tepat adalah ...",
    opsi: {
      A: "Meminta teman mengerjakannya untuk Anda",
      B: "Mencoba sendiri sambil membaca panduannya, lalu bertanya pada bagian yang tetap buntu",
      C: "Menunggu pelatihan resmi diadakan",
      D: "Mengerjakannya dengan cara lama yang Anda kuasai",
    },
    kunci: "B",
    pembahasan:
      "Mencoba sambil membaca panduan menumbuhkan penguasaan, dan bertanya pada bagian yang buntu menghemat waktu. Pilihan A memindahkan pekerjaan, C menunda tanpa kepastian, dan D menghindari tugas yang sebenarnya diberikan.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_6: PaketPsikotes = {
  id: "psi-6",
  nomor: 6,
  nama: "Try Out Psikotes 6",
  deskripsi:
    "Paket ketelitian. Banyak butir menyisipkan satu kata atau satu satuan yang mudah terlewat, sehingga melatih kebiasaan membaca soal sampai selesai sebelum melihat pilihannya.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_6,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Cari satu aturan yang berlaku untuk seluruh gambar, bukan yang hanya cocok untuk dua gambar pertama. Pada soal matriks, periksa polanya dari arah baris dan dari arah kolom — jawaban yang benar cocok dari kedua arah.",
      durasiMenit: 10,
      soal: VISUAL_6,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_6,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_6,
    },
  ],
};
