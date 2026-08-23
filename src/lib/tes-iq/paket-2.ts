import type { SoalIq } from "@/lib/tes-iq/tipe";

/**
 * Tes IQ Latihan — Paket 2 (Lanjutan).
 *
 * Susunan kategorinya sama dengan Paket 1, tetapi setiap butir menuntut lebih
 * dari satu langkah: deretnya berlapis, silogismenya melibatkan ingkaran dan
 * rantai sebab-akibat, dan soal spasialnya meminta peserta membayangkan benda
 * tiga dimensi. Tidak ada satu pun soal yang mengulang butir Paket 1.
 */
export const SOAL_PAKET_2: SoalIq[] = [
  /* --------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "PADI : BERAS = TEBU : ...",
    opsi: {
      A: "Manis",
      B: "Gula",
      C: "Batang",
      D: "Ladang",
    },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah bahan mentah dengan hasil olahannya. Padi diolah menjadi beras, tebu diolah menjadi gula. Manis adalah sifat, batang adalah bagian tanaman, dan ladang adalah tempat tumbuh — ketiganya bukan hasil olahan.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "TERMOMETER : SUHU = BAROMETER : ...",
    opsi: {
      A: "Cuaca",
      B: "Tekanan udara",
      C: "Ketinggian",
      D: "Kelembapan",
    },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah alat ukur dengan besaran yang diukurnya. Termometer mengukur suhu, barometer mengukur tekanan udara. Cuaca terlalu luas — ia disimpulkan dari banyak besaran, bukan diukur langsung. Kelembapan diukur higrometer.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "Lawan kata MUFAKAT adalah ...",
    opsi: {
      A: "Sepakat",
      B: "Musyawarah",
      C: "Sengketa",
      D: "Rembuk",
    },
    kunci: "C",
    pembahasan:
      "Mufakat berarti kesepakatan bersama, sehingga lawannya adalah keadaan berselisih, yaitu sengketa. Sepakat bersinonim dengan mufakat, sedangkan musyawarah dan rembuk adalah proses menuju mufakat, bukan lawannya.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "Kata yang bersinonim dengan NISBI adalah ...",
    opsi: {
      A: "Mutlak",
      B: "Relatif",
      C: "Jelas",
      D: "Pasti",
    },
    kunci: "B",
    pembahasan:
      "Nisbi berarti bergantung pada pembandingnya, tidak berlaku secara mutlak — dalam bahasa serapan disebut relatif. Mutlak dan pasti justru lawannya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan ketiga bangun lainnya?",
    opsi: {
      A: "Segitiga",
      B: "Persegi",
      C: "Lingkaran",
      D: "Trapesium",
    },
    kunci: "C",
    pembahasan:
      "Segitiga, persegi, dan trapesium sama-sama tersusun dari ruas garis lurus dan memiliki sudut. Lingkaran dibatasi satu garis lengkung dan tidak bersudut, sehingga ia yang keluar dari kelompok. Jumlah sisi bukan pembedanya, karena ketiga bangun lain pun berbeda jumlah sisinya.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan: "HANGAT : PANAS = SEJUK : ...",
    opsi: {
      A: "Beku",
      B: "Dingin",
      C: "Segar",
      D: "Basah",
    },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah tingkatan: hangat adalah bentuk ringan dari panas. Bentuk ringan dari dingin adalah sejuk, jadi pasangannya dingin. Beku terlalu jauh — ia dua tingkat dari sejuk, bukan satu tingkat.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "OBAT : PENYAKIT sama hubungannya dengan ...",
    opsi: {
      A: "Air : Api",
      B: "Pupuk : Tanaman",
      C: "Hujan : Banjir",
      D: "Guru : Murid",
    },
    kunci: "A",
    pembahasan:
      "Obat adalah sesuatu yang meniadakan penyakit. Pasangan dengan hubungan yang sama adalah air dan api, karena air memadamkan api. Pupuk justru menumbuhkan tanaman, hujan justru menyebabkan banjir, dan guru mengajar murid — ketiganya bukan hubungan meniadakan.",
  },

  /* -------------------------------- Numerik -------------------------------- */
  {
    nomor: 8,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["1,  1,  2,  3,  5,  8,  ..."],
    opsi: { A: "11", B: "12", C: "13", D: "16" },
    kunci: "C",
    pembahasan:
      "Setiap suku adalah jumlah dua suku sebelumnya: 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8. Maka suku berikutnya adalah 5 + 8 = 13. Deret ini dikenal sebagai deret Fibonacci.",
  },
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["2,  6,  12,  20,  30,  ..."],
    opsi: { A: "36", B: "40", C: "42", D: "44" },
    kunci: "C",
    pembahasan:
      "Selisih antarsuku adalah +4, +6, +8, +10 — bertambah 2 setiap langkah. Selisih berikutnya +12, sehingga 30 + 12 = 42. Cara lain: setiap suku berbentuk n x (n + 1), dan untuk n = 6 hasilnya 6 x 7 = 42.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["81,  27,  9,  3,  ..."],
    opsi: { A: "0", B: "1", C: "2", D: "3" },
    kunci: "B",
    pembahasan:
      "Setiap suku adalah suku sebelumnya dibagi 3: 81 : 3 = 27, 27 : 3 = 9, 9 : 3 = 3. Maka suku berikutnya adalah 3 : 3 = 1. Jawaban 0 keliru karena mengira polanya pengurangan.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Deret berikut tersusun dari dua deret yang berselang-seling. Berapakah bilangan berikutnya?",
    pola: ["4,  7,  9,  14,  14,  21,  19,  ..."],
    opsi: { A: "24", B: "26", C: "28", D: "30" },
    kunci: "C",
    pembahasan:
      "Suku pada urutan ganjil membentuk deret 4, 9, 14, 19 yang bertambah 5. Suku pada urutan genap membentuk deret 7, 14, 21, ... yang bertambah 7. Bilangan yang diminta menempati urutan genap, jadi nilainya 21 + 7 = 28.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["3,  4,  7,  11,  18,  29,  ..."],
    opsi: { A: "40", B: "43", C: "47", D: "58" },
    kunci: "C",
    pembahasan:
      "Mulai dari suku ketiga, setiap suku adalah jumlah dua suku sebelumnya: 3 + 4 = 7, 4 + 7 = 11, 7 + 11 = 18, 11 + 18 = 29. Maka suku berikutnya adalah 18 + 29 = 47. Jawaban 58 keliru karena mengira polanya perkalian dua.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah mobil menempuh jarak 180 km dalam waktu 3 jam. Dengan kecepatan tetap yang sama, berapa jarak yang ditempuh dalam 5 jam?",
    opsi: { A: "240 km", B: "270 km", C: "300 km", D: "360 km" },
    kunci: "C",
    pembahasan:
      "Kecepatannya 180 km : 3 jam = 60 km per jam. Dalam 5 jam jarak yang ditempuh adalah 60 x 5 = 300 km.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Perbandingan uang Andi dan Budi adalah 3 : 5. Selisih uang keduanya Rp40.000. Berapa uang Budi?",
    opsi: {
      A: "Rp60.000",
      B: "Rp80.000",
      C: "Rp100.000",
      D: "Rp120.000",
    },
    kunci: "C",
    pembahasan:
      "Selisih perbandingannya 5 - 3 = 2 bagian, dan 2 bagian itu bernilai Rp40.000, sehingga 1 bagian = Rp20.000. Uang Budi sebesar 5 bagian, yaitu 5 x Rp20.000 = Rp100.000. Jawaban Rp120.000 muncul bila selisih dikira 1 bagian.",
  },

  /* --------------------------------- Logika -------------------------------- */
  {
    nomor: 15,
    kategori: "Logika",
    pertanyaan:
      "Semua logam memuai bila dipanaskan. Tembaga adalah logam. Kesimpulan yang pasti benar adalah ...",
    opsi: {
      A: "Tembaga memuai bila dipanaskan",
      B: "Tembaga tidak memuai bila dipanaskan",
      C: "Hanya tembaga yang memuai bila dipanaskan",
      D: "Semua benda yang memuai adalah logam",
    },
    kunci: "A",
    pembahasan:
      "Sifat yang berlaku bagi semua logam otomatis berlaku bagi tembaga, karena tembaga termasuk logam. Pilihan D membalik arah pernyataan: benda bukan logam pun dapat memuai, jadi kesimpulan itu tidak sah.",
  },
  {
    nomor: 16,
    kategori: "Logika",
    pertanyaan:
      "Ingkaran (negasi) dari pernyataan Semua siswa hadir hari ini adalah ...",
    opsi: {
      A: "Semua siswa tidak hadir hari ini",
      B: "Ada siswa yang tidak hadir hari ini",
      C: "Tidak ada siswa yang hadir hari ini",
      D: "Sebagian siswa hadir hari ini",
    },
    kunci: "B",
    pembahasan:
      "Untuk membantah pernyataan yang berbunyi semua, cukup ditunjukkan satu pengecualian. Jadi ingkarannya adalah ada siswa yang tidak hadir. Pilihan A dan C terlalu jauh: keduanya menyatakan tidak seorang pun hadir, padahal pernyataan aslinya sudah salah meski hanya satu siswa yang absen.",
  },
  {
    nomor: 17,
    kategori: "Logika",
    pertanyaan:
      "Jika rajin berlatih, maka terampil. Jika terampil, maka percaya diri. Dita rajin berlatih. Kesimpulan yang pasti benar adalah ...",
    opsi: {
      A: "Dita percaya diri",
      B: "Dita terampil tetapi belum tentu percaya diri",
      C: "Dita belum tentu terampil",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "A",
    pembahasan:
      "Kedua pernyataan bersyarat itu dapat disambung: rajin berlatih membawa ke terampil, dan terampil membawa ke percaya diri. Karena Dita rajin berlatih, rantai itu berjalan penuh sampai ujungnya, sehingga Dita percaya diri.",
  },
  {
    nomor: 18,
    kategori: "Logika",
    pertanyaan:
      "Nilai Budi lebih tinggi daripada Ani. Nilai Cici lebih rendah daripada Ani. Nilai Dedi lebih tinggi daripada Budi. Siapakah yang nilainya paling tinggi?",
    opsi: { A: "Ani", B: "Budi", C: "Cici", D: "Dedi" },
    kunci: "D",
    pembahasan:
      "Susun dari yang tertinggi: Dedi di atas Budi, Budi di atas Ani, dan Ani di atas Cici. Urutan lengkapnya Dedi - Budi - Ani - Cici, sehingga nilai tertinggi dipegang Dedi.",
  },
  {
    nomor: 19,
    kategori: "Logika",
    pertanyaan:
      "Lima cabang lomba — basket, voli, catur, futsal, dan renang — diadakan Senin sampai Jumat, satu cabang setiap hari. Catur diadakan Rabu. Voli diadakan tepat sehari setelah catur. Renang diadakan pada hari terakhir. Basket diadakan lebih awal daripada futsal. Kapan futsal diadakan?",
    opsi: { A: "Senin", B: "Selasa", C: "Kamis", D: "Jumat" },
    kunci: "B",
    pembahasan:
      "Isi dahulu yang pasti: catur Rabu, voli Kamis, renang Jumat. Tersisa Senin dan Selasa untuk basket dan futsal. Karena basket harus lebih awal, basket menempati Senin dan futsal menempati Selasa.",
  },
  {
    nomor: 20,
    kategori: "Logika",
    pertanyaan:
      "Dalam sebuah barisan, Ratna berada di urutan ke-7 dari depan dan ke-12 dari belakang. Berapa jumlah orang dalam barisan itu?",
    opsi: { A: "17 orang", B: "18 orang", C: "19 orang", D: "20 orang" },
    kunci: "B",
    pembahasan:
      "Jumlahkan kedua urutan lalu kurangi satu, karena Ratna terhitung dua kali: 7 + 12 - 1 = 18 orang. Di depan Ratna ada 6 orang dan di belakangnya 11 orang, sehingga 6 + 1 + 11 = 18.",
  },

  /* -------------------------------- Spasial -------------------------------- */
  {
    nomor: 21,
    kategori: "Spasial",
    pertanyaan:
      "Sebuah kubus berukuran 3 x 3 x 3 dicat seluruh permukaan luarnya, lalu dipotong menjadi 27 kubus satuan. Berapa kubus satuan yang tepat memiliki tiga sisi tercat?",
    opsi: { A: "6", B: "8", C: "12", D: "27" },
    kunci: "B",
    pembahasan:
      "Hanya kubus satuan di pojok yang menyentuh tiga permukaan sekaligus, dan sebuah kubus memiliki 8 pojok. Sebagai pembanding: 12 kubus di tengah rusuk tercat dua sisi, 6 kubus di tengah bidang tercat satu sisi, dan 1 kubus di pusat tidak tercat sama sekali. Jumlahnya 8 + 12 + 6 + 1 = 27, sesuai.",
  },
  {
    nomor: 22,
    kategori: "Spasial",
    pertanyaan:
      "Huruf kecil p diputar 180 derajat pada bidang datar. Bentuk yang terlihat menjadi ...",
    opsi: { A: "b", B: "d", C: "q", D: "p" },
    kunci: "B",
    pembahasan:
      "Putaran 180 derajat memindahkan perut huruf dari kanan ke kiri sekaligus memindahkan kakinya dari bawah ke atas. Perut p yang semula di kanan bawah berpindah ke kiri atas, dan bentuk itulah huruf d. Jawaban q hanya hasil pencerminan mendatar, bukan putaran.",
  },
  {
    nomor: 23,
    kategori: "Spasial",
    pertanyaan:
      "Pada matriks berikut, jumlah bintang bertambah satu setiap melangkah ke kanan maupun ke bawah. Berapa bintang yang seharusnya menempati tanda tanya?",
    pola: ["*        **       ***", "**       ***      ****", "***      ****     ?"],
    opsi: {
      A: "3 bintang",
      B: "4 bintang",
      C: "5 bintang",
      D: "6 bintang",
    },
    kunci: "C",
    pembahasan:
      "Dilihat dari baris ketiga, jumlahnya 3, 4, lalu 5. Dilihat dari kolom ketiga, jumlahnya 3, 4, lalu 5 juga. Kedua arah memberi jawaban yang sama, yaitu 5 bintang — kecocokan inilah yang memastikan pola terbaca benar.",
  },
  {
    nomor: 24,
    kategori: "Spasial",
    pertanyaan:
      "Selembar kertas persegi dilipat dua sama besar sebanyak tiga kali berturut-turut, lalu dibuka kembali. Bekas lipatannya membagi kertas menjadi berapa bagian sama besar?",
    opsi: { A: "4 bagian", B: "6 bagian", C: "8 bagian", D: "16 bagian" },
    kunci: "C",
    pembahasan:
      "Setiap lipatan menggandakan jumlah bagian: lipatan pertama menghasilkan 2 bagian, kedua 4 bagian, ketiga 8 bagian. Jadi hasilnya 2 x 2 x 2 = 8 bagian. Jawaban 6 keliru karena mengira setiap lipatan menambah 2.",
  },
  {
    nomor: 25,
    kategori: "Spasial",
    pertanyaan:
      "Sebuah papan berbentuk huruf F berdiri tegak dengan kedua lengannya menghadap ke kanan. Papan itu diputar 90 derajat searah jarum jam. Ke arah manakah lengan huruf F sekarang menghadap?",
    opsi: { A: "Atas", B: "Bawah", C: "Kiri", D: "Kanan" },
    kunci: "B",
    pembahasan:
      "Putaran 90 derajat searah jarum jam memindahkan arah menurut urutan kanan - bawah - kiri - atas. Lengan yang semula menghadap kanan berpindah menghadap bawah. Bila putarannya berlawanan arah jarum jam, jawabannya justru atas.",
  },
];
