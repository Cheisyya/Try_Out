import type { SoalIq } from "@/lib/tes-iq/tipe";

/**
 * Tes IQ Latihan — Paket 4 (Lanjutan).
 *
 * Bobotnya berada di atas Paket 3: analogi menuntut hubungan yang tidak
 * langsung, deret memakai dua aturan yang bekerja bersamaan, penalarannya
 * memuat ingkaran dan syarat berantai, dan soal spasialnya menuntut membayangkan
 * benda berputar pada lebih dari satu sumbu.
 *
 * Sama seperti paket lain, seluruh butir dapat dikerjakan tanpa gambar.
 */
export const SOAL_PAKET_4: SoalIq[] = [
  /* --------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "HAUS : MINUM = LELAH : ...",
    opsi: { A: "Tidur", B: "Bekerja", C: "Sakit", D: "Berlari" },
    kunci: "A",
    pembahasan:
      "Hubungannya adalah keadaan dengan tindakan yang meredakannya. Haus diredakan dengan minum, lelah diredakan dengan tidur atau beristirahat. Bekerja dan berlari justru menimbulkan lelah, sedangkan sakit adalah keadaan lain, bukan penawarnya.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari ANOMALI adalah ...",
    opsi: { A: "Keteraturan", B: "Penyimpangan", C: "Perulangan", D: "Kesepakatan" },
    kunci: "B",
    pembahasan:
      "Anomali berarti keadaan yang menyimpang dari yang biasa atau dari yang seharusnya. Keteraturan justru lawannya, perulangan menyangkut frekuensi, dan kesepakatan menyangkut persetujuan antarorang.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "Lawan kata EKSPLISIT adalah ...",
    opsi: { A: "Terang", B: "Tersirat", C: "Terperinci", D: "Tertulis" },
    kunci: "B",
    pembahasan:
      "Eksplisit berarti dinyatakan dengan terang dan tegas — tersurat. Lawannya adalah tersirat, yaitu yang hanya terkandung di dalam maksud tanpa dikatakan langsung. Terang dan terperinci justru sejalan dengan eksplisit.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "TUNAS : POHON = BAYI : ...",
    opsi: { A: "Ibu", B: "Anak", C: "Dewasa", D: "Keluarga" },
    kunci: "C",
    pembahasan:
      "Hubungannya adalah tahap awal dengan bentuk matangnya. Tunas kelak menjadi pohon, bayi kelak menjadi dewasa. Ibu dan keluarga adalah hubungan kekerabatan, bukan tahap pertumbuhan, dan anak masih berada di tengah jalan, bukan bentuk matangnya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Meter", B: "Liter", C: "Timbangan", D: "Kilogram" },
    kunci: "C",
    pembahasan:
      "Meter, liter, dan kilogram adalah satuan ukuran. Timbangan adalah alat untuk mengukur, bukan satuannya, sehingga ia berada pada tingkatan yang berbeda. Perhatikan bahwa ketiga satuan itu mengukur besaran yang berbeda-beda — panjang, isi, dan massa — jadi jenis besaran bukan pembedanya.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Semua yang rajin berlatih menguasai teknik dasar. Tidak seorang pun yang menguasai teknik dasar gugur pada babak pertama. Kesimpulannya ...",
    opsi: {
      A: "Semua yang rajin berlatih tidak gugur pada babak pertama",
      B: "Sebagian yang rajin berlatih gugur pada babak pertama",
      C: "Semua yang gugur pada babak pertama tidak rajin berlatih",
      D: "Jawaban A dan C dua-duanya benar",
    },
    kunci: "D",
    pembahasan:
      "Rajin berlatih → menguasai teknik dasar → tidak gugur pada babak pertama. Rantai itu membenarkan A. Pilihan C adalah bentuk kontraposisi dari A — 'bila gugur, berarti tidak rajin berlatih' — yang selalu bernilai sama dengan pernyataan asalnya. Karena keduanya benar, jawabannya D.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan:
      'Makna ungkapan "Besar pasak daripada tiang" adalah ...',
    opsi: {
      A: "Pengeluaran melebihi pemasukan",
      B: "Pekerjaan yang tidak kunjung selesai",
      C: "Rencana yang terlalu muluk",
      D: "Bawahan yang melebihi atasannya",
    },
    kunci: "A",
    pembahasan:
      "Pasak yang lebih besar daripada tiang justru merusak bangunan yang hendak dikokohkannya. Kiasannya: belanja yang melebihi penghasilan. Pilihan C mendekati tetapi menunjuk peribahasa lain, yaitu 'jauh panggang dari api' untuk rencana yang meleset dari kenyataan.",
  },

  /* -------------------------------- Numerik -------------------------------- */
  {
    nomor: 8,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["2, 3, 5, 8, 13, 21, ..."],
    opsi: { A: "26", B: "31", C: "34", D: "42" },
    kunci: "C",
    pembahasan:
      "Setiap suku adalah jumlah dua suku sebelumnya: 2 + 3 = 5, 3 + 5 = 8, 5 + 8 = 13, 8 + 13 = 21. Maka suku berikutnya 13 + 21 = 34. Jawaban 42 muncul bila polanya keliru dianggap perkalian dua.",
  },
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["100, 96, 88, 76, 60, ..."],
    opsi: { A: "48", B: "44", C: "40", D: "36" },
    kunci: "C",
    pembahasan:
      "Selisih antarsuku adalah 4, 8, 12, 16 — bertambah 4 setiap langkah. Selisih berikutnya 20, sehingga 60 - 20 = 40. Kunci soal semacam ini adalah menuliskan barisan selisihnya lebih dahulu, bukan menebak langsung dari angkanya.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah barang dijual Rp90.000 dan penjualnya memperoleh untung 25% dari harga beli. Berapa harga belinya?",
    opsi: { A: "Rp67.500", B: "Rp72.000", C: "Rp75.000", D: "Rp80.000" },
    kunci: "B",
    pembahasan:
      "Untung 25% dari harga beli berarti harga jual = 125% harga beli. Maka harga beli = 90.000 ÷ 1,25 = 72.000. Jawaban 67.500 muncul bila 25% keliru dihitung dari harga jual, padahal soal menyebut untung dihitung dari harga beli.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Perbandingan uang Ali dan Budi adalah 3 : 5. Bila selisih uang mereka Rp40.000, berapa jumlah uang keduanya?",
    opsi: { A: "Rp120.000", B: "Rp140.000", C: "Rp160.000", D: "Rp200.000" },
    kunci: "C",
    pembahasan:
      "Selisih perbandingannya 5 - 3 = 2 bagian, yang senilai Rp40.000, sehingga satu bagian Rp20.000. Jumlah keduanya 3 + 5 = 8 bagian = 8 × 20.000 = Rp160.000. Kesalahan yang lazim adalah membagi 40.000 dengan 8, padahal 40.000 adalah selisih, bukan jumlah.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kendaraan menempuh 120 km dengan kecepatan 40 km/jam, lalu 120 km berikutnya dengan kecepatan 60 km/jam. Berapa kecepatan rata-rata seluruh perjalanan?",
    opsi: { A: "45 km/jam", B: "48 km/jam", C: "50 km/jam", D: "52 km/jam" },
    kunci: "B",
    pembahasan:
      "Kecepatan rata-rata adalah jarak total dibagi waktu total, bukan rata-rata kedua kecepatan. Waktunya 120/40 = 3 jam dan 120/60 = 2 jam, seluruhnya 5 jam untuk 240 km, sehingga 240 ÷ 5 = 48 km/jam. Jawaban 50 km/jam adalah jebakan bagi yang merata-ratakan 40 dan 60.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah tangki terisi 3/8 bagian. Setelah ditambah 45 liter, tangki terisi 3/4 bagian. Berapa isi penuh tangki itu?",
    opsi: { A: "100 liter", B: "110 liter", C: "120 liter", D: "150 liter" },
    kunci: "C",
    pembahasan:
      "Selisih bagiannya 3/4 - 3/8 = 6/8 - 3/8 = 3/8, dan itu senilai 45 liter. Maka 1/8 bagian = 15 liter, sehingga isi penuh 8 × 15 = 120 liter.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berselang berikut.",
    pola: ["81, 3, 27, 9, 9, 27, 3, ..."],
    opsi: { A: "1", B: "9", C: "54", D: "81" },
    kunci: "D",
    pembahasan:
      "Suku ganjil 81, 27, 9, 3 dibagi 3 setiap langkah. Suku genap 3, 9, 27 dikalikan 3 setiap langkah, sehingga suku genap berikutnya 27 × 3 = 81. Yang ditanyakan menempati urutan kedelapan, yaitu urutan genap, maka jawabannya 81.",
  },

  /* --------------------------------- Logika -------------------------------- */
  {
    nomor: 15,
    kategori: "Logika",
    pertanyaan:
      "Jika seseorang lulus wawancara, maka ia mengikuti tes kesehatan. Jika ia mengikuti tes kesehatan, maka ia menyerahkan surat keterangan dokter. Rina tidak menyerahkan surat keterangan dokter. Kesimpulannya ...",
    opsi: {
      A: "Rina lulus wawancara",
      B: "Rina tidak lulus wawancara",
      C: "Rina mengikuti tes kesehatan",
      D: "Tidak dapat disimpulkan",
    },
    kunci: "B",
    pembahasan:
      "Rantainya: lulus wawancara → tes kesehatan → menyerahkan surat dokter. Karena ujung rantai tidak terjadi pada Rina, seluruh mata rantai sebelumnya juga tidak terjadi. Jadi Rina tidak mengikuti tes kesehatan, dan karena itu tidak lulus wawancara.",
  },
  {
    nomor: 16,
    kategori: "Logika",
    pertanyaan:
      "Lima siswa duduk berjajar. Andi di antara Bima dan Candra. Dedi di ujung kiri. Bima duduk tepat di sebelah kanan Dedi. Siapakah yang duduk di ujung kanan?",
    opsi: { A: "Andi", B: "Bima", C: "Candra", D: "Eka" },
    kunci: "D",
    pembahasan:
      "Dedi di kursi 1 dan Bima di kursi 2. Andi berada di antara Bima dan Candra, sehingga urutannya Bima-Andi-Candra pada kursi 2-3-4. Kursi 5 tinggal untuk Eka, satu-satunya nama yang belum ditempatkan.",
  },
  {
    nomor: 17,
    kategori: "Logika",
    pertanyaan:
      "Semua anggota paduan suara pandai membaca not. Sebagian anggota paduan suara adalah pemain gitar. Manakah yang PASTI benar?",
    opsi: {
      A: "Semua pemain gitar pandai membaca not",
      B: "Sebagian pemain gitar pandai membaca not",
      C: "Semua yang pandai membaca not adalah anggota paduan suara",
      D: "Tidak ada pemain gitar yang pandai membaca not",
    },
    kunci: "B",
    pembahasan:
      "Sebagian anggota paduan suara adalah pemain gitar, dan setiap anggota paduan suara pandai membaca not. Maka pemain gitar yang menjadi anggota itu pasti pandai membaca not — cukup untuk menyimpulkan 'sebagian'. Pilihan A melompat karena mungkin ada pemain gitar di luar paduan suara.",
  },
  {
    nomor: 18,
    kategori: "Logika",
    pertanyaan:
      "Dalam sebuah pertandingan, A mengalahkan B. C mengalahkan A. B mengalahkan D. C kalah dari E. Siapakah yang belum pernah kalah?",
    opsi: { A: "A", B: "C", C: "D", D: "E" },
    kunci: "D",
    pembahasan:
      "Daftar yang pernah kalah: B kalah dari A, A kalah dari C, D kalah dari B, dan C kalah dari E. Nama E tidak pernah muncul di sisi yang kalah, sehingga hanya E yang belum pernah kalah.",
  },
  {
    nomor: 19,
    kategori: "Logika",
    pertanyaan:
      "Sebuah jadwal piket berulang setiap 6 hari. Bila hari ini Rina bertugas dan hari ini adalah Senin, pada hari apakah Rina bertugas untuk keempat kalinya terhitung mulai hari ini?",
    opsi: { A: "Rabu", B: "Kamis", C: "Jumat", D: "Sabtu" },
    kunci: "C",
    pembahasan:
      "Tugas pertama jatuh hari ini, sehingga tugas keempat berjarak tiga selang, yaitu 3 × 6 = 18 hari kemudian. Delapan belas hari sama dengan dua pekan penuh ditambah empat hari; dua pekan mengembalikan hari ke Senin, lalu empat hari sesudah Senin adalah Jumat.",
  },
  {
    nomor: 20,
    kategori: "Logika",
    pertanyaan:
      "Dari 40 siswa, 24 menyukai olahraga, 20 menyukai musik, dan 6 tidak menyukai keduanya. Berapa siswa yang menyukai keduanya?",
    opsi: { A: "8", B: "10", C: "12", D: "14" },
    kunci: "B",
    pembahasan:
      "Yang menyukai sekurang-kurangnya satu = 40 - 6 = 34. Bila kedua angka dijumlahkan, 24 + 20 = 44, kelompok yang menyukai keduanya terhitung dua kali. Maka irisannya 44 - 34 = 10.",
  },

  /* -------------------------------- Spasial -------------------------------- */
  {
    nomor: 21,
    kategori: "Spasial",
    pertanyaan:
      "Huruf kapital manakah yang bayangannya TETAP SAMA bila dicerminkan terhadap garis mendatar?",
    opsi: { A: "B", B: "N", C: "R", D: "J" },
    kunci: "A",
    pembahasan:
      "Cermin mendatar menukar bagian atas dengan bagian bawah. Huruf B memiliki sumbu simetri mendatar di tengahnya sehingga bayangannya tidak berubah. Huruf N, R, dan J tidak simetris terhadap garis mendatar, sehingga bayangannya terbalik atas-bawah.",
  },
  {
    nomor: 22,
    kategori: "Spasial",
    pertanyaan:
      "Sebuah kubus berukuran 3 × 3 × 3 dicat seluruh permukaan luarnya, lalu dipotong menjadi 27 kubus kecil. Berapa kubus kecil yang sama sekali tidak terkena cat?",
    opsi: { A: "0", B: "1", C: "6", D: "8" },
    kunci: "B",
    pembahasan:
      "Hanya kubus kecil yang tidak menyentuh permukaan luar yang bebas cat, yaitu kubus di titik pusat. Pada kubus 3 × 3 × 3, bagian dalamnya berukuran 1 × 1 × 1, sehingga jumlahnya tepat satu. Jawaban 8 adalah cacah kubus sudut, yang justru terkena cat pada tiga sisi.",
  },
  {
    nomor: 23,
    kategori: "Spasial",
    pertanyaan:
      "Deret lambang berikut berputar dengan aturan tetap. Lambang apakah yang menggantikan tanda tanya?",
    pola: ["<   ^   >   v   <   ^   >   ?"],
    opsi: {
      A: "^ (atas)",
      B: "> (kanan)",
      C: "v (bawah)",
      D: "< (kiri)",
    },
    kunci: "C",
    pembahasan:
      "Anak panah berputar seperempat lingkaran searah jarum jam: kiri, atas, kanan, bawah, lalu berulang. Empat langkah terakhir mengulang pola yang sama, sehingga sesudah kanan giliran berikutnya adalah bawah.",
  },
  {
    nomor: 24,
    kategori: "Spasial",
    pertanyaan:
      "Sehelai kertas persegi dilipat dua kali — sekali mendatar, sekali tegak — lalu digunting satu lubang di titik lipatnya. Berapa lubang yang terbentuk setelah kertas dibuka kembali?",
    opsi: { A: "Satu", B: "Dua", C: "Tiga", D: "Empat" },
    kunci: "D",
    pembahasan:
      "Setiap lipatan melipatgandakan jumlah lapisan kertas. Dua lipatan menghasilkan 2 × 2 = 4 lapisan, dan satu guntingan menembus keempatnya sekaligus, sehingga terbentuk empat lubang ketika kertas dibuka.",
  },
  {
    nomor: 25,
    kategori: "Spasial",
    pertanyaan:
      "Pada matriks berikut, setiap baris memuat ketiga lambang tepat satu kali dan setiap kolom pun demikian. Lambang apakah yang menggantikan tanda tanya?",
    pola: ["O   S   K", "K   O   S", "S   ?   O"],
    opsi: {
      A: "O (lingkaran)",
      B: "S (segitiga)",
      C: "K (kotak)",
      D: "Tidak ada yang cocok",
    },
    kunci: "C",
    pembahasan:
      "Baris ketiga sudah memuat S dan O, sehingga yang tersisa adalah K. Pemeriksaan dari arah kolom memberi jawaban yang sama: kolom kedua sudah memuat S dan O, sehingga K-lah yang belum muncul. Kecocokan dari dua arah itulah tanda bahwa jawabannya benar.",
  },
];
